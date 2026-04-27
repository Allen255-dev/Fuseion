import { google } from "@ai-sdk/google";
import { createOpenAI } from "@ai-sdk/openai";
import { groq } from "@ai-sdk/groq";
import {
  streamText,
  type ModelMessage,
  tool,
  wrapLanguageModel,
  extractReasoningMiddleware,
} from "ai";
import { z } from "zod";
import { saveMessage, getThread, createThread, mutations, queries } from "@/lib/db";
import { generateTitleFromUserMessage } from "@/lib/ai/titles";
import { getModelById } from "@/lib/models";
const uuidv4 = () => crypto.randomUUID();
import { ChatSDKError } from "@/lib/errors";
import { auth } from "@/app/(auth)/auth";
import { getSystemPrompt } from "@/lib/ai/system";

export const maxDuration = 60;

export async function POST(req: Request) {
  try {
    const session = await auth();

    const json = await req.json();
    const { messages, model: clientModel } = json;

    // Extract model ID
    const modelId = json.modelId ?? clientModel?.id;

    // Thread ID: DefaultChatTransport sends it as `id`
    const threadId = json.threadId ?? json.id;

    // Session user shape uses `userId`
    const userId = (session?.user as any)?.userId ?? json.userId;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      console.error("Bad Request: Messages are missing", { json });
      throw new ChatSDKError("bad_request:api", "Messages are required");
    }

    if (!threadId) {
      console.error("Bad Request: Thread ID is missing");
      throw new ChatSDKError("bad_request:api", "Thread ID is required");
    }

    const currentModel = getModelById(modelId);
    
    // Ensure thread exists in the database

    const thread = await getThread(userId, threadId);
    if (!thread) {
      console.log(`Creating new thread: ${threadId} for user: ${userId}`);
      await createThread({
        externalId: threadId,
        title: "New Chat",
        model: currentModel.id,
        userId: userId,
      });
    }

    let model;
    console.log(
      `Using model: ${currentModel.id} (provider: ${currentModel.provider})`,
    );

    // Configure provider
    const provider = currentModel.provider.toLowerCase();

    if (provider === "google") {
      model = google(currentModel.id);
    } else if (provider === "openrouter" || provider === "openai" || provider === "anthropic" || provider === "deepseek") {
      const openrouter = createOpenAI({
        baseURL: "https://openrouter.ai/api/v1",
        apiKey: process.env.OPENROUTER_API_KEY,
        headers: {
          "HTTP-Referer": process.env.APP_URL ?? "http://localhost:3000",
          "X-Title": "Fuseion",
        },
      });
      // For OpenRouter, we use the model ID directly
      // If the provider is 'openai' or 'anthropic' but routed via OpenRouter, 
      // we might need to prefix if the ID doesn't already have it
      const fullModelId = (provider !== "openrouter" && !currentModel.id.includes("/")) 
        ? `${provider}/${currentModel.id}` 
        : currentModel.id;
        
      model = openrouter.chat(fullModelId);
    } else if (provider === "groq") {
      model = groq(currentModel.id);
    } else {
      throw new ChatSDKError(
        "unsupported_provider:api",
        `Unsupported provider: ${currentModel.provider}`,
      );
    }

    // Normalize messages for the AI SDK
    const normalizedMessages = messages
      .filter((m: any) => m.role === "user" || m.role === "assistant")
      .map((m: any) => {
        let content = m.content ?? m.parts ?? "";
        if (typeof content === "string" && content.trim().startsWith("[")) {
          try {
            const parsed = JSON.parse(content);
            if (Array.isArray(parsed)) content = parsed;
          } catch {}
        }

        // Ensure content is in the right format for AI SDK
        if (Array.isArray(content)) {
          content = content
            .map((p: any) => {
              if (p.type === "text")
                return { type: "text", text: p.text || "" };
              if (p.type === "image")
                return {
                  type: "image",
                  image: p.image || p.url || p.data || "",
                };
              return null;
            })
            .filter(Boolean);
        }

        return {
          role: m.role as "user" | "assistant",
          content: content || "",
        };
      });

    // Add system message with context
    const systemPrompt = getSystemPrompt({
      modelName: currentModel.name,
      userName: (session?.user as any)?.name ?? "User",
    });

    // Proactively save the last user message to DB
    const lastUserMessage = messages[messages.length - 1];
    try {
      await saveMessage({
        externalId: uuidv4(),
        role: "user",
        parts:
          lastUserMessage.parts ||
          (typeof lastUserMessage.content === "string"
            ? [{ type: "text", text: lastUserMessage.content }]
            : lastUserMessage.content),
        threadId,
        userId,
        metadata: "{}",
      });
    } catch (dbError) {
      console.error("Failed to save user message to DB:", dbError);
    }

    const result = await streamText({
      model,
      system: systemPrompt,
      messages: normalizedMessages,
      maxSteps: 1, // Reduced steps as tools are removed
      maxRetries: 2,

      onFinish: async (completion: any) => {
        const parts: any[] = [];

        if (completion.reasoning) {
          parts.push({ type: "reasoning", text: completion.reasoning });
        }

        if (completion.text) {
          parts.push({ type: "text", text: completion.text });
        }

        const toolInvocations: any[] = [];
        if (completion.toolCalls && completion.toolResults) {
          for (let i = 0; i < completion.toolCalls.length; i++) {
            const call = completion.toolCalls[i];
            const res = completion.toolResults.find(
              (r: any) => r.toolCallId === call.toolCallId,
            );
            if (res) {
              toolInvocations.push({
                state: "result",
                toolCallId: call.toolCallId,
                toolName: call.toolName,
                args: call.args,
                result: res.result,
              });
            }
          }
        }

        try {
          await saveMessage({
            externalId: uuidv4(),
            role: "assistant",
            parts:
              parts.length > 0
                ? parts
                : [{ type: "text", text: completion.text || "" }],
            metadata:
              toolInvocations.length > 0
                ? JSON.stringify({ toolInvocations })
                : "{}",
            threadId,
            userId,
          });
        } catch (dbError) {
          console.error("Failed to save assistant message:", dbError);
        }

        // Automatic Title Generation
        if (normalizedMessages.length <= 3) {
          const latestThread = await getThread(userId, threadId);
          if (latestThread?.title === "New Chat" || !latestThread?.title) {
            try {
              const title = await generateTitleFromUserMessage({
                message: normalizedMessages,
              });
              console.log(`Generated title: ${title}`);
              await mutations.updateThreadWithId({ id: threadId, title });
            } catch (titleError) {
              console.error("Error generating title:", titleError);
            }
          }
        }
      },
    });

    return result.toUIMessageStreamResponse();
  } catch (error: any) {
    console.error("Chat API Error:", error);
    
    // Detect Rate Limit/Quota errors from providers
    const isRateLimit = 
      error.statusCode === 429 || 
      error.status === 429 || 
      error.lastError?.statusCode === 429 ||
      error.message?.toLowerCase().includes("quota") || 
      error.message?.toLowerCase().includes("rate limit") ||
      error.lastError?.message?.toLowerCase().includes("rate limit") ||
      (error.lastError?.responseBody && JSON.parse(error.lastError.responseBody).error?.code === 429);

    let errorMessage = error.message;
    let errorCause = error.cause;

    if (error.lastError?.responseBody) {
      try {
        const parsed = JSON.parse(error.lastError.responseBody);
        const upstreamError = parsed.error;
        errorMessage = upstreamError?.message || errorMessage;
        errorCause = upstreamError?.metadata?.raw || upstreamError?.message || errorCause;
      } catch (_) {
        errorMessage = error.lastError.message || errorMessage;
      }
    } else if (error.lastError?.message) {
      errorMessage = error.lastError.message;
    }

    const sdkError = error instanceof ChatSDKError
        ? error
        : new ChatSDKError(
            isRateLimit ? "rate_limit:api" : "internal_server_error:api", 
            errorCause || errorMessage
          );
          
    return sdkError.toResponse();
  }
}
