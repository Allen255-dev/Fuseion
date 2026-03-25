import { google } from '@ai-sdk/google';
import { createOpenAI } from '@ai-sdk/openai';
import { groq } from '@ai-sdk/groq';
import { streamText, type ModelMessage } from 'ai';
import { saveMessage } from '@/lib/db';
import { getModelById } from '@/lib/models';
import { v4 as uuidv4 } from 'uuid';
import { ChatSDKError } from '@/lib/errors';
import { auth } from '@/app/(auth)/auth';

export const maxDuration = 60;

export async function POST(req: Request) {
    try {
        const session = await auth();

        const json = await req.json();
        const { messages, model: clientModel } = json;

        // Extract model ID – prefer explicit field, then nested client model id
        const modelId = json.modelId ?? clientModel?.id;

        // Thread ID: DefaultChatTransport sends it as `id`; support both
        const threadId = json.threadId ?? json.id;

        // Session user shape uses `userId` (e.g. "google:<sub>"), not `id`
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
        let model;

        console.log(`Using model: ${currentModel.id} (provider: ${currentModel.provider})`);

        // Configure provider (case-insensitive)
        const provider = currentModel.provider.toLowerCase();

        if (provider === 'google') {
            model = google(currentModel.id);
        } else if (provider === 'openrouter') {
            const openrouter = createOpenAI({
                baseURL: 'https://openrouter.ai/api/v1',
                apiKey: process.env.OPENROUTER_API_KEY,
            });
            model = openrouter(currentModel.id);
        } else if (provider === 'groq') {
            model = groq(currentModel.id);
        } else if (provider === 'openai') {
            const openai = createOpenAI({
                apiKey: process.env.OPENAI_API_KEY,
            });
            model = openai(currentModel.id);
        } else {
            console.error(`Unsupported provider: ${currentModel.provider}`);
            throw new ChatSDKError('unsupported_provider:api', `Unsupported provider: ${currentModel.provider}`);
        }

        // Prepare the last user message for saving
        const userMessage = messages[messages.length - 1];
        const userMessageId = uuidv4();

        // Resolve parts: prefer explicit `parts`, fall back to `content`
        let partsValue: any = userMessage.parts ?? userMessage.content ?? '';

        // If parts is a JSON-stringified array, parse it
        if (typeof partsValue === 'string') {
            try {
                const parsed = JSON.parse(partsValue);
                if (Array.isArray(parsed)) {
                    partsValue = parsed;
                }
            } catch {
                // Plain text – keep as-is
            }
        }

        // Normalize messages for the AI SDK: only role + content expected
        const normalizedMessages: ModelMessage[] = messages.map((m: any) => {
            let content: any = m.content ?? m.parts ?? '';

            // If content is a JSON-stringified array, parse it
            if (typeof content === 'string') {
                try {
                    const parsed = JSON.parse(content);
                    if (Array.isArray(parsed)) {
                        content = parsed;
                    }
                } catch {
                    // Plain text – keep as-is
                }
            }

            return { role: m.role, content };
        });

        // Proactively save the user message to DB
        try {
            await saveMessage({
                externalId: userMessageId,
                role: 'user',
                parts: typeof partsValue === 'string'
                    ? [{ type: 'text', text: partsValue }]
                    : partsValue,
                threadId,
                userId,
                metadata: '{}',
            });
        } catch (dbError) {
            console.error('Failed to save user message to DB:', dbError);
        }

        const result = await streamText({
            model,
            messages: normalizedMessages,
            onFinish: async (completion) => {
                if (!completion.text) return; // Skip saving empty responses

                try {
                    await saveMessage({
                        externalId: uuidv4(),
                        role: 'assistant',
                        parts: [{ type: 'text', text: completion.text }],
                        threadId,
                        userId,
                        metadata: '{}',
                    });
                } catch (dbError) {
                    console.error('Failed to save assistant message to DB:', dbError);
                }
            },
        });

        return result.toUIMessageStreamResponse();
    } catch (error: any) {
        console.error('Chat API Error:', error);

        const sdkError = error instanceof ChatSDKError
            ? error
            : new ChatSDKError('internal_server_error:api', error.message);

        return sdkError.toResponse();
    }
}
