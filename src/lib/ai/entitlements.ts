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
      "gemini-3.1-pro",
      "gemini-3.1-flash-lite",
      "anthropic/claude-sonnet-4.6",
      "anthropic/claude-haiku-4.5",
      "meta-llama/llama-4.1-maverick:free",
      "deepseek/deepseek-v3.2:free",
      "deepseek/deepseek-r1:free",
      "llama-3.3-70b-versatile",
    ],
  },

  /*
   * For users with a pro account
   */
  pro: {
    maxMessagesPerDay: 400,
    maxMessagesPerMonth: 10000,
    availableChatModelIds: [
      "gemini-3.1-pro",
      "gemini-3.1-flash-lite",
      "gpt-5.4",
      "gpt-5.4-thinking",
      "gpt-5.4-mini",
      "anthropic/claude-opus-4.6",
      "anthropic/claude-sonnet-4.6",
      "anthropic/claude-haiku-4.5",
      "meta-llama/llama-4.1-maverick:free",
      "deepseek/deepseek-v3.2:free",
      "deepseek/deepseek-r1:free",
      "llama-3.3-70b-versatile",
    ],
  },
};
