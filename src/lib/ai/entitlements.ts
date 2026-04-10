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
      "gemini-2.5-flash",
      "openrouter/free",
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
      "gemini-2.5-flash",
      "gpt-5.4-nano",
      "openrouter/free",
      "llama-3.3-70b-versatile",
    ],
  },
};
