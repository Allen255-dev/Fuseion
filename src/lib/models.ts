import { models as baseModels, Model as AIModel } from "./ai/models";

export type Provider = "google" | "openrouter" | "groq" | "anthropic" | "openai" | "deepseek";

export interface ModelConfig {
  id: string;
  name: string;
  provider: Provider;
  description: string;
  rateLimit?: string;
  icon?: string;
}

export const MODELS: ModelConfig[] = baseModels.map((m: AIModel) => ({
  id: m.id,
  name: m.name,
  provider: m.metadata.provider.toLowerCase() as Provider,
  description: m.metadata.shortDescription,
  rateLimit: m.metadata.rateLimit,
}));


export function getModelById(id: string) {
  return MODELS.find((m) => m.id === id) || MODELS[0];
}
