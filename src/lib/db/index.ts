import { queries } from "./queries";
import { mutations } from "./mutations";
import { convexServer, api } from "../convex-server";
import { redis } from "../redis";

export * from "./queries";
export * from "./mutations";


// Compatibility layer for legacy Prisma names during migration
export const saveMessage = async (args: {
  externalId: string;
  role: string;
  parts: any;
  metadata?: any;
  threadId: string;
  userId?: string;
}) => {
  return await mutations.createMessage({
    id: args.externalId,
    role: args.role,
    parts: args.parts,
    metadata: args.metadata,
    threadId: args.threadId,
    userId: args.userId,
  });
};

export const getThread = async (userId: string, externalId: string) => {

  const cacheKey = `thread:${userId}:${externalId}`;
  
  try {
    const cached = await redis.get(cacheKey);
    if (cached) return JSON.parse(cached);
  } catch (err) {
    console.error("Redis get error:", err);
  }

  const thread = await queries.getThreadByUserIdAndThreadId(userId, externalId);
  
  if (thread) {
    try {
      await redis.set(cacheKey, JSON.stringify(thread), {
        EX: 3600, // Cache for 1 hour
      });
    } catch (err) {
      console.error("Redis set error:", err);
    }
  }
  
  return thread;
};


export const createThread = async (args: {
  externalId: string;
  title: string;
  model: string;
  userId: string;
}) => {
  return await mutations.createThread({
    id: args.externalId,
    title: args.title,
    model: args.model,
    userId: args.userId,
    status: "active",
  });
};

export const upsertUser = async (args: {
  userId: string;
  email?: string;
  name?: string;
  picture?: string;
}) => {
  try {
    const result = await convexServer.mutation(api.users.upSertUser, {
      userId: args.userId,
      email: args.email || "",
      name: args.name || "",
      picture: args.picture,
      tier: "free",
    });
    return result;
  } catch (error) {
    console.error("Convex upsertUser error:", error);
    throw error;
  }
};
