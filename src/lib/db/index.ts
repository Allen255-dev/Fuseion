import { queries } from "./queries";
import { mutations } from "./mutations";
import { convexServer, api } from "../convex-server";

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
    return await queries.getThreadByUserIdAndThreadId(userId, externalId);
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
