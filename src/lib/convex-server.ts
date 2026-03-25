import { ConvexHttpClient } from "convex/browser";
import { api } from "../convex/_generated/api";

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL || process.env.CONVEX_URL;

if (!convexUrl) {
    throw new Error("CONVEX_URL is not defined in environment variables");
}

export const convexServer = new ConvexHttpClient(convexUrl);
export { api };
