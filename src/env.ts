import { z } from "zod";
import { createEnv } from "@t3-oss/env-nextjs";

export const env = createEnv({
  server: {
    NODE_ENV: z
      .enum(["local", "test", "development", "staging", "production"])
      .default("development"),
    APP_URL: z.string(),
    REDIS_URL: z.string().optional(),
    ARCJET_KEY: z.string().optional(),
    AUTH_SECRET: z.string(),
    GOOGLE_GENERATIVE_AI_API_KEY: z.string(),
    OPENROUTER_API_KEY: z.string(),
    GROQ_API_KEY: z.string(),
    CONVEX_DEPLOYMENT: z.string().optional(),
    CONVEX_URL: z.string().optional(),
  },
  client: {
    NEXT_PUBLIC_CONVEX_URL: z.string(),
    NEXT_PUBLIC_CONVEX_SITE_URL: z.string().optional(),
  },
  emptyStringAsUndefined: true,
  experimental__runtimeEnv: {
    NEXT_PUBLIC_CONVEX_URL: process.env.NEXT_PUBLIC_CONVEX_URL,
    NEXT_PUBLIC_CONVEX_SITE_URL: process.env.NEXT_PUBLIC_CONVEX_SITE_URL,
  },
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
});
