import { google } from '@ai-sdk/google';
import { createOpenAI } from '@ai-sdk/openai';
import { groq } from '@ai-sdk/groq';
import { streamText, type ModelMessage, tool } from 'ai';
import { z } from 'zod';
import { saveMessage, getThread, createThread, mutations } from '@/lib/db';
import { generateTitleFromUserMessage } from '@/lib/ai/titles';
import { getModelById } from '@/lib/models';
const uuidv4 = () => crypto.randomUUID();
import { ChatSDKError } from '@/lib/errors';
import { auth } from '@/app/(auth)/auth';
import { getSystemPrompt } from '@/lib/ai/system';
import { searchWeb } from '@/lib/web-search';

export const maxDuration = 60;

export async function POST(req: Request) {
    try {
        const session = await auth();

        const json = await req.json();
        const { messages, model: clientModel, search, deepThink } = json;

        // Extract model ID
        const modelId = json.modelId ?? clientModel?.id;

        // Thread ID: DefaultChatTransport sends it as `id`
        const threadId = json.threadId ?? json.id;

        // Session user shape uses `userId`
        const userId = (session?.user as any)?.userId ?? json.userId;

        if (!messages || !Array.isArray(messages) || messages.length === 0) {
            console.error('Bad Request: Messages are missing', { json });
            throw new ChatSDKError('bad_request:api', 'Messages are required');
        }

        if (!threadId) {
            console.error('Bad Request: Thread ID is missing');
            throw new ChatSDKError('bad_request:api', 'Thread ID is required');
        }

        const currentModel = getModelById(modelId);
        
        // Ensure thread exists in the database
        const thread = await getThread(userId, threadId);
        if (!thread) {
            console.log(`Creating new thread: ${threadId} for user: ${userId}`);
            await createThread({
                externalId: threadId,
                title: 'New Chat',
                model: currentModel.id,
                userId: userId,
            });
        }

        let model;
        console.log(`Using model: ${currentModel.id} (provider: ${currentModel.provider})`);

        // Configure provider
        const provider = currentModel.provider.toLowerCase();

        if (provider === 'google') {
            model = google(currentModel.id);
        } else if (provider === 'openrouter') {
            const openrouter = createOpenAI({
                baseURL: 'https://openrouter.ai/api/v1',
                apiKey: process.env.OPENROUTER_API_KEY,
                headers: {
                    'HTTP-Referer': process.env.APP_URL ?? 'http://localhost:3000',
                    'X-Title': 'Fuseion',
                },
            });
            model = openrouter.chat(currentModel.id);
        } else if (provider === 'groq') {
            model = groq(currentModel.id);
        } else if (provider === 'openai') {
            const openai = createOpenAI({
                apiKey: process.env.OPENAI_API_KEY,
            });
            model = openai.chat(currentModel.id);
        } else {
            throw new ChatSDKError('unsupported_provider:api', `Unsupported provider: ${currentModel.provider}`);
        }

        // Normalize messages for the AI SDK
        const normalizedMessages = messages
            .filter((m: any) => m.role === 'user' || m.role === 'assistant')
            .map((m: any) => {
                let content = m.content ?? m.parts ?? '';
                if (typeof content === 'string' && content.trim().startsWith('[')) {
                    try {
                        const parsed = JSON.parse(content);
                        if (Array.isArray(parsed)) content = parsed;
                    } catch {}
                }
                
                // Ensure content is in the right format for AI SDK
                if (Array.isArray(content)) {
                    content = content.map((p: any) => {
                        if (p.type === 'text') return { type: 'text', text: p.text || '' };
                        if (p.type === 'image') return { type: 'image', image: p.image || p.url || p.data || '' };
                        return null;
                    }).filter(Boolean);
                }

                return {
                    role: m.role as 'user' | 'assistant',
                    content: content || ''
                };
            });

        // Add system message with context
        const systemPrompt = getSystemPrompt({
            modelName: currentModel.name,
            userName: (session?.user as any)?.name ?? 'User',
            search: search === true,
            deepThink: deepThink === true,
        });

        // Proactively save the last user message to DB
        const lastUserMessage = messages[messages.length - 1];
        try {
            await saveMessage({
                externalId: uuidv4(),
                role: 'user',
                parts: lastUserMessage.parts || (typeof lastUserMessage.content === 'string' ? [{ type: 'text', text: lastUserMessage.content }] : lastUserMessage.content),
                threadId,
                userId,
                metadata: '{}',
            });
        } catch (dbError) {
            console.error('Failed to save user message to DB:', dbError);
        }

        const result = await streamText({
            model,
            system: systemPrompt,
            messages: normalizedMessages,
            maxSteps: 5, // Allow tool calling steps
            tools: search ? {
                internetSearch: tool({
                    description: 'Search the internet for real-time information, news, current events, or up-to-date facts.',
                    parameters: z.object({
                        query: z.string().describe('The search query to look up on the web'),
                    }),
                    execute: async ({ query }) => {
                        console.log(`🔍 AI is searching for: ${query}`);
                        const results = await searchWeb(query);
                        
                        if (results.length === 0) {
                            return { error: 'No results found on the web for your query.' };
                        }

                        // Format results for the AI as context
                        return results.map((res, i) => ({
                           id: i + 1,
                           title: res.title,
                           snippet: res.snippet,
                           url: res.url,
                           source: res.source
                        }));
                    }
                })
            } : undefined,
            onFinish: async (completion) => {
                if (!completion.text) return;

                try {
                    await saveMessage({
                        externalId: uuidv4(),
                        role: 'assistant',
                        parts: [{ type: 'text', text: completion.text }],
                        threadId,
                        userId,
                    });
                } catch (dbError) {
                    console.error('Failed to save assistant message:', dbError);
                }

                // Automatic Title Generation
                if (normalizedMessages.length <= 3) {
                    const latestThread = await getThread(userId, threadId);
                    if (latestThread?.title === 'New Chat' || !latestThread?.title) {
                        try {
                            const title = await generateTitleFromUserMessage({
                                message: normalizedMessages,
                            });
                            console.log(`Generated title: ${title}`);
                            await mutations.updateThreadWithId({ id: threadId, title });
                        } catch (titleError) {
                            console.error('Error generating title:', titleError);
                        }
                    }
                }
            },
        });

        return result.toUIMessageStreamResponse();
    } catch (error: any) {
        console.error('Chat API Error:', error);
        const sdkError = error instanceof ChatSDKError ? error : new ChatSDKError('internal_server_error:api', error.message);
        return sdkError.toResponse();
    }
}
