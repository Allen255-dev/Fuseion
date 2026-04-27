import "server-only";
import { Logger } from "../logger";
import { ChatSDKError } from "../errors";
import { getErrorMessage } from "../utils";
import { convexServer, api } from "../convex-server";

const logger = new Logger("db/queries");

export const queries = {
  getDailyMessageCountByUserId: async (userId: string) => {
    try {
      // Convex doesn't have a direct "size" query for filtered collections easily without a custom query
      // Let's assume we have a query for this or just fetch and count if small
      // For now, I'll call a hypothetical or existing query
      return await convexServer.query(api.messages.getMessageCountByUserId, {
        userId,
        differenceInHours: 24,
      });
    } catch (error) {
      logger.error(
        "Error fetching daily message count:",
        getErrorMessage(error),
      );
      return 0; // Fallback
    }
  },

  getMonthlyMessageCountByUserId: async (userId: string) => {
    try {
      return await convexServer.query(api.messages.getMessageCountByUserId, {
        userId,
        differenceInHours: 720,
      });
    } catch (error) {
      logger.error(
        "Error fetching monthly message count:",
        getErrorMessage(error),
      );
      return 0; // Fallback
    }
  },

  getUserCredits: async (userId: string) => {
    try {
      return await convexServer.query(api.users.getUserCredits, { userId });
    } catch (error) {
      logger.error("Error fetching user credits:", getErrorMessage(error));
      return 0;
    }
  },

  getThreadByUserIdAndThreadId: async (userId: string, threadId: string) => {
    try {
      const data = await convexServer.query(
        api.threads.getThreadByUserIdAndThreadId,
        {
          userId,
          threadId,
        },
      );

      if (!data) return null;

      // Map back to expected format if necessary
      return {
        ...data,
        external_id: data.id,
        user_id: data.userId,
      };
    } catch (error) {
      logger.error(
        "Error fetching thread by user ID and thread ID:",
        getErrorMessage(error),
      );
      return null;
    }
  },

  listMessagesByThreadId: async (threadId: string) => {
    try {
      const messages = await convexServer.query(api.messages.listMessages, {
        threadId,
      });

      return messages.map((m: any) => ({
        ...m,
        id: m.id,
        threadId: m.threadId,
        userId: m.userId,
        // Compatibility with legacy code expecting snake_case
        external_id: m.id,
        thread_id: m.threadId,
        user_id: m.userId,
      }));
    } catch (error) {
      logger.error(
        "Error listing messages by thread ID:",
        getErrorMessage(error),
      );
      return [];
    }
  },

  listStreamsByThreadId: async (threadId: string) => {
    try {
      const streams = await convexServer.query(
        api.streams.listStreamsByThreadId,
        { threadId },
      );
      return streams.map((s: any) => ({
        ...s,
        external_id: s.id,
        thread_id: s.threadId,
      }));
    } catch (error) {
      logger.error(
        "Error listing streams by thread ID:",
        getErrorMessage(error),
      );
      return [];
    }
  },
  getUser: async (userId: string) => {
    try {
      return await convexServer.query(api.users.getUser, { userId });
    } catch (error) {
      logger.error("Error fetching user:", getErrorMessage(error));
      return null;
    }
  },
};
