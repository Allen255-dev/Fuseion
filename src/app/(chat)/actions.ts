"use server";

import { queries, mutations } from "~/lib/db";
import { cookies } from "next/headers";
import { Logger } from "~/lib/logger";
import { Model } from "~/lib/ai/models";
import { convertToUIMessages, getErrorMessage } from "~/lib/utils";

const logger = new Logger("chat/actions");

import { generateTitleFromUserMessage } from "~/lib/ai/titles";
export { generateTitleFromUserMessage };

export async function saveModelAsCookie(model: Model) {
  const cookieStore = await cookies();
  cookieStore.set("chat-model", JSON.stringify(model));
}

export async function regenerateThreadTitle({
  userId,
  threadId,
}: {
  userId: string;
  threadId: string;
}) {
  try {
    const messages = await queries.listMessagesByThreadId(threadId);
    const title = await generateTitleFromUserMessage({
      message: convertToUIMessages(messages),
    });
    return title;
  } catch (error) {
    logger.error("Error regenerating thread title:", getErrorMessage(error));
    const thread = await queries.getThreadByUserIdAndThreadId(userId, threadId);
    if (!thread) {
      return "New Chat";
    }
    return thread.title;
  }
}
export async function updateThread(args: any) {
  try {
    return await mutations.updateThreadWithId(args);
  } catch (error) {
    logger.error("Error updating thread:", getErrorMessage(error));
    throw error;
  }
}

