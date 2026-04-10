export interface Model {
  id: string;
  name: string;
  metadata: {
    shortDescription: string;
    fullDescription: string;
    provider: string;
    developer: string;
    type?: string;
    createdAt?: number;
    updatedAt?: number;
    apiKeySupport?: "optional" | "required" | "none";
    disabled: boolean;
    experimental: boolean;
    features: string[];
    streamChunking?: "word" | "line";
    limits: {
      maxInputTokens: number;
      maxOutputTokens: number;
    };
    modelPickerDefault?: boolean;
    rateLimit?: string;
  };
}

export const models: Model[] = [
  {
    id: "gemini-2.5-flash",
    name: "Gemini 2.5 Flash",
    metadata: {
      provider: "Google",
      developer: "Google",
      shortDescription: "Free - Fast & Accurate",
      fullDescription: "Google's best balance of speed, cost, and accuracy with built-in reasoning. Ideal for high-volume production tasks.",
      disabled: false,
      modelPickerDefault: true,
      limits: { maxInputTokens: 1048576, maxOutputTokens: 65536 },
      features: ["text", "multimodal", "reasoning"],
      experimental: false,
      apiKeySupport: "required",
      rateLimit: "10 RPM / 1M Context"
    },
  },
  {
    id: "gpt-5.4-nano",
    name: "GPT-5.4 Nano",
    metadata: {
      provider: "OpenAI",
      developer: "OpenAI",
      shortDescription: "Pro - Ultra Efficient",
      fullDescription: "OpenAI's most cost-efficient and fastest model, ideal for simple and high-volume tasks.",
      disabled: false,
      modelPickerDefault: false,
      limits: { maxInputTokens: 128000, maxOutputTokens: 16384 },
      features: ["text", "multimodal", "speed"],
      experimental: false,
      apiKeySupport: "required"
    },
  },
  {
    id: "openrouter/free",
    name: "OpenRouter Auto Free",
    metadata: {
      provider: "OpenRouter",
      developer: "OpenRouter",
      shortDescription: "Free - Best Available",
      fullDescription: "OpenRouter's automatic free model selector. Always picks the best currently available free model (like Llama, Qwen, or Mistral).",
      disabled: false,
      modelPickerDefault: false,
      limits: { maxInputTokens: 128000, maxOutputTokens: 4096 },
      features: ["text", "multimodal", "speed"],
      experimental: false,
      apiKeySupport: "required"
    },
  },
  {
    id: "llama-3.3-70b-versatile",
    name: "Llama 3.3 70B (Groq)",
    metadata: {
      provider: "Groq",
      developer: "Meta",
      shortDescription: "Free - Blazing Fast",
      fullDescription: "Blazing fast inference for general-purpose chat and real-time applications via Groq LPU.",
      disabled: false,
      modelPickerDefault: false,
      limits: { maxInputTokens: 128000, maxOutputTokens: 32768 },
      features: ["text", "reasoning", "speed"],
      experimental: false,
      apiKeySupport: "required",
      rateLimit: "Ultra Fast"
    },
  },
  {
    id: "web-search",
    name: "Web Search",
    metadata: {
      provider: "Search",
      developer: "DuckDuckGo",
      shortDescription: "Free - Web Access",
      fullDescription: "Search the web using DuckDuckGo to find up-to-date information and insert results into chat.",
      disabled: false,
      modelPickerDefault: false,
      limits: { maxInputTokens: 0, maxOutputTokens: 0 },
      features: ["search", "web"],
      experimental: false,
      apiKeySupport: "none"
    },
  },
];
