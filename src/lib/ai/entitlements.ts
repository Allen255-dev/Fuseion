import type { Model } from "~/lib/ai/models";
import type { UserInterface } from "~/types/user";

interface Entitlements {
  maxMessagesPerDay: number;
  maxMessagesPerMonth: number;
  availableChatModelIds?: Array<Model["id"]>;
}

export const entitlementsByUserTier: Record<
  UserInterface["tier"],
  Entitlements
> = {
  /*
   * For users with a free account
   */
  free: {
    maxMessagesPerDay: 50,
    maxMessagesPerMonth: 1500,
    availableChatModelIds: [
      // Google — stable models for free tier
      "gemini-3-flash-preview",
      "gemini-2.5-flash",
      "gemini-2.0-flash",
      "gemini-2.0-flash-lite",
      // Groq (fast, free via API key)
      "llama-3.3-70b-versatile",
      "llama-3.1-8b-instant",
      // OpenRouter free tier
      "meta-llama/llama-3.3-70b-instruct:free",
      "google/gemma-3-27b-it:free",
      "google/gemma-4-31b-it:free",
    ],
  },

  /*
   * For users with a pro account
   */
  pro: {
    maxMessagesPerDay: 400,
    maxMessagesPerMonth: 10000,
    availableChatModelIds: [
      // Google — all models including pro & preview
      "gemini-3-flash-preview",
      "gemini-2.5-flash",
      "gemini-2.5-pro",
      "gemini-2.0-flash",
      "gemini-2.0-flash-lite",
      "gemini-3-pro-preview",
      "gemini-3.1-pro-preview",
      // Groq (all models)
      "llama-3.3-70b-versatile",
      "llama-3.1-8b-instant",
      "meta-llama/llama-4-scout-17b-16e-instruct",
      "qwen/qwen3-32b",
      // OpenRouter free tier
      "meta-llama/llama-3.3-70b-instruct:free",
      "google/gemma-3-27b-it:free",
      "google/gemma-4-31b-it:free",
      "nvidia/nemotron-3-super-120b-a12b:free",
      "nousresearch/hermes-3-llama-3.1-405b:free",
      "qwen/qwen3-coder:free",
    ],
  },
};
