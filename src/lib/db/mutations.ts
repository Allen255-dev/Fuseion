import "server-only";
import { Logger } from "../logger";
import { ChatSDKError } from "../errors";
import { getErrorMessage } from "../utils";
import { convexServer, api } from "../convex-server";

const logger = new Logger("db/mutations");

export const mutations = {
  updateUserCredits: async (userId: string, credits: number) => {
    try {
      await convexServer.mutation(api.users.updateUserCredits, {
        userId,
        credits,
      });
      return { credits }; // Just return updated credits
    } catch (error) {
      logger.error("Error updating user credits:", getErrorMessage(error));
      throw new ChatSDKError(
        "bad_request:database",
        "Failed to update user credits",
      );
    }
  },

  createThread: async (thread: any) => {
    try {
      const threadId = thread.id || thread.external_id;

      const threadData = {
        id: threadId,
        title: thread.title,
        model: thread.model,
        status: thread.status || "active",
        pinned: thread.pinned || false,
        userId: thread.userId || thread.user_id,
      };

      const result = await convexServer.mutation(
        api.threads.createThread,
        threadData,
      );
      return { ...threadData, _id: result };
    } catch (error) {
      logger.error("Error creating thread:", getErrorMessage(error));
      throw new ChatSDKError("bad_request:database", "Failed to create thread");
    }
  },

  createMessage: async (message: any) => {
    try {
      // Handle parts and metadata which might be stringified or objects
      let parts = message.parts;
      if (typeof parts === "string") {
        try {
          parts = JSON.parse(parts);
        } catch {
          parts = [{ type: "text", text: parts }];
        }
      }

      let metadata = message.metadata;
      if (typeof metadata === "string") {
        try {
          metadata = JSON.parse(metadata);
        } catch {
          metadata = {};
        }
      }

      const messageId = message.id || message.external_id;

      const messageData = {
        id: messageId,
        role: message.role,
        parts: typeof parts === "string" ? parts : JSON.stringify(parts),
        metadata:
          typeof metadata === "string" ? metadata : JSON.stringify(metadata),
        threadId: message.threadId || message.thread_id,
        userId: message.userId || message.user_id,
      };

      const result = await convexServer.mutation(
        api.messages.upsertMessage,
        messageData,
      );
      return { ...messageData, _id: result };
    } catch (error) {
      logger.error("Error creating message:", getErrorMessage(error));
      throw new ChatSDKError(
        "bad_request:database",
        "Failed to create message",
      );
    }
  },

  createStream: async (stream: any) => {
    try {
      const streamId = stream.id || stream.external_id;

      const streamData = {
        id: streamId,
        threadId: stream.threadId || stream.thread_id,
      };

      const result = await convexServer.mutation(
        api.streams.createStream,
        streamData,
      );
      return { ...streamData, _id: result };
    } catch (error) {
      logger.error("Error creating stream:", getErrorMessage(error));
      throw new ChatSDKError("bad_request:database", "Failed to create stream");
    }
  },

  updateThreadWithId: async (thread: { id: string } & any) => {
    try {
      const { id, ...updates } = thread;

      // Map updates to Convex camelCase fields
      const formattedUpdates: any = { id };
      if (typeof updates.title !== "undefined")
        formattedUpdates.title = updates.title;
      if (typeof updates.model !== "undefined")
        formattedUpdates.model = updates.model;
      if (typeof updates.status !== "undefined")
        formattedUpdates.status = updates.status;
      if (typeof updates.pinned !== "undefined")
        formattedUpdates.pinned = updates.pinned;

      await convexServer.mutation(
        api.threads.updateThreadWithExternalId,
        formattedUpdates,
      );
      return { ...thread };
    } catch (error) {
      logger.error("Error updating thread with ID:", getErrorMessage(error));
      throw new ChatSDKError(
        "bad_request:database",
        "Failed to update thread with ID",
      );
    }
  },
};
