import { z } from "zod";
import { google } from "@ai-sdk/google";
import { generateObject, UIMessage } from "ai";
import { Logger } from "../logger";
import { getErrorMessage } from "../utils";

const logger = new Logger("ai/titles");

export async function generateTitleFromUserMessage({
  message,
}: {
  message: any;
}) {
  try {
    // Format messages for a cleaner prompt
    const messages = Array.isArray(message) ? message : [message];
    const conversation = messages
      .filter((m: any) => m.role === "user" || m.role === "assistant")
      .map((m: any) => {
        const content = typeof m.content === "string" 
          ? m.content 
          : Array.isArray(m.content) 
            ? m.content.map((p: any) => p.text || "").join("") 
            : JSON.stringify(m.content);
        return `${m.role.toUpperCase()}: ${content}`;
      })
      .join("\n");

    const {
      object: { title },
    } = await generateObject({
      model: google("gemini-1.5-flash"),
      schema: z.object({
        title: z.string().describe("A short, descriptive title for the conversation"),
      }),
      system: `\n
    - You are a helpful assistant that generates meaningful titles for AI chat conversations.
    - Create a short, high-quality title (maximum 4 words) based on the provided conversation.
    - Focus on the core topic or intent of the user.
    - If the user asks for a chart or data viz, reflect that (e.g., "Sales Analysis Chart").
    - Do not use quotes, colons, punctuation, or symbols.
    - Forbidden words: "Chat", "Conversation", "Thread", "Message", "New", "Untitled".
    - Avoid descriptors like "Initial" or "Turn".
    - Return in Title Case.`,
      prompt: `Conversation:\n${conversation}\n\nGenerate a title:`,
      temperature: 0.7,
    });

    logger.log(`Generated title: "${title}"`);
    return title;
  } catch (error) {
    logger.error(
      "Error generating title from user message:",
      getErrorMessage(error),
    );
    return "New Chat";
  }
}
