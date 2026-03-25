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
    id: "gemini-3.1-pro",
    name: "Gemini 3.1 Pro",
    metadata: {
      provider: "Google",
      developer: "Google",
      shortDescription: "Free - 20 RPM",
      fullDescription: "Google's most advanced model with enhanced reasoning and agentic capabilities. Processes 2M+ context window including text, images, video, and code repositories.",
      disabled: false,
      modelPickerDefault: true,
      limits: { maxInputTokens: 2048576, maxOutputTokens: 131072 },
      features: ["text", "multimodal", "agentic", "reasoning"],
      experimental: false,
      apiKeySupport: "required",
      rateLimit: "20 RPM / 2M Context"
    },
  },
  {
    id: "gemini-3.1-flash-lite",
    name: "Gemini 3.1 Flash-Lite",
    metadata: {
      provider: "Google",
      developer: "Google",
      shortDescription: "Free - Ultra Fast",
      fullDescription: "Blazing fast, cost-efficient model designed for high-volume, latency-sensitive tasks.",
      disabled: false,
      modelPickerDefault: false,
      limits: { maxInputTokens: 1048576, maxOutputTokens: 65536 },
      features: ["text", "multimodal"],
      experimental: false,
      apiKeySupport: "required",
      rateLimit: "15 RPM / 1M Context"
    },
  },
  {
    id: "gpt-5.4",
    name: "GPT-5.4 Standard",
    metadata: {
      provider: "OpenAI",
      developer: "OpenAI",
      shortDescription: "Pro - Frontier Power",
      fullDescription: "OpenAI's latest flagship model with industry-leading scale and reasoning capabilities (March 2026).",
      disabled: false,
      modelPickerDefault: false,
      limits: { maxInputTokens: 1000000, maxOutputTokens: 16384 },
      features: ["text", "multimodal", "reasoning"],
      experimental: false,
      apiKeySupport: "required"
    },
  },
  {
    id: "gpt-5.4-thinking",
    name: "GPT-5.4 Thinking",
    metadata: {
      provider: "OpenAI",
      developer: "OpenAI",
      shortDescription: "Pro - Expert Reasoning",
      fullDescription: "Reasoning-first version of GPT-5.4. Optimized for science, complex coding, and logical tasks.",
      disabled: false,
      modelPickerDefault: false,
      limits: { maxInputTokens: 1000000, maxOutputTokens: 65536 },
      features: ["text", "reasoning", "coding"],
      experimental: false,
      apiKeySupport: "required"
    },
  },
  {
    id: "gpt-5.4-mini",
    name: "GPT-5.4 mini",
    metadata: {
      provider: "OpenAI",
      developer: "OpenAI",
      shortDescription: "Pro - Highly Efficient",
      fullDescription: "High-intelligence small model offering low latency and cost-effectiveness.",
      disabled: false,
      modelPickerDefault: false,
      limits: { maxInputTokens: 128000, maxOutputTokens: 16384 },
      features: ["text", "multimodal"],
      experimental: false,
      apiKeySupport: "required"
    },
  },
  {
    id: "anthropic/claude-opus-4.6",
    name: "Claude Opus 4.6",
    metadata: {
      provider: "OpenRouter",
      developer: "Anthropic",
      shortDescription: "Pro - Advanced Intelligence",
      fullDescription: "Anthropic's state-of-the-art flagship model with unmatched coding and agentic performance.",
      disabled: false,
      modelPickerDefault: false,
      limits: { maxInputTokens: 200000, maxOutputTokens: 32768 },
      features: ["text", "multimodal", "coding", "agentic"],
      experimental: false,
      apiKeySupport: "required"
    },
  },
  {
    id: "anthropic/claude-sonnet-4.6",
    name: "Claude Sonnet 4.6",
    metadata: {
      provider: "OpenRouter",
      developer: "Anthropic",
      shortDescription: "Free - High Performance",
      fullDescription: "Balanced model for professional tasks at scale, approaching Opus intelligence with higher efficiency.",
      disabled: false,
      modelPickerDefault: false,
      limits: { maxInputTokens: 200000, maxOutputTokens: 16384 },
      features: ["text", "multimodal", "professional"],
      experimental: false,
      apiKeySupport: "required"
    },
  },
  {
    id: "anthropic/claude-haiku-4.5",
    name: "Claude Haiku 4.5",
    metadata: {
      provider: "OpenRouter",
      developer: "Anthropic",
      shortDescription: "Free - Fastest",
      fullDescription: "Fastest model with impressive reasoning and coding efficiency.",
      disabled: false,
      modelPickerDefault: false,
      limits: { maxInputTokens: 200000, maxOutputTokens: 8192 },
      features: ["text", "speed"],
      experimental: false,
      apiKeySupport: "required"
    },
  },
  {
    id: "meta-llama/llama-4.1-maverick:free",
    name: "Llama 4.1 Maverick",
    metadata: {
      provider: "OpenRouter",
      developer: "Meta",
      shortDescription: "Free - Open Weights",
      fullDescription: "Meta's most capable open-source model with massive reasoning benchmarks (March 2026).",
      disabled: false,
      modelPickerDefault: false,
      limits: { maxInputTokens: 1000000, maxOutputTokens: 32768 },
      features: ["text", "multimodal", "open-weights"],
      experimental: false,
      apiKeySupport: "required"
    },
  },
  {
    id: "deepseek/deepseek-v3.2:free",
    name: "DeepSeek V3.2",
    metadata: {
      provider: "OpenRouter",
      developer: "DeepSeek",
      shortDescription: "Free - Efficient",
      fullDescription: "Latest iteration of DeepSeek V3 family with high-context reasoning and coding skills.",
      disabled: false,
      modelPickerDefault: false,
      limits: { maxInputTokens: 163840, maxOutputTokens: 8192 },
      features: ["text", "coding"],
      experimental: false,
      apiKeySupport: "required"
    },
  },
  {
    id: "deepseek/deepseek-r1:free",
    name: "DeepSeek R1",
    metadata: {
      provider: "OpenRouter",
      developer: "DeepSeek",
      shortDescription: "Free - Expert Logic",
      fullDescription: "Advanced reasoning model using deep reinforcement learning for elite problem solving.",
      disabled: false,
      modelPickerDefault: false,
      limits: { maxInputTokens: 163840, maxOutputTokens: 32768 },
      features: ["text", "reasoning"],
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
      shortDescription: "Free - Fastest Inference",
      fullDescription: "Ultra-low latency inference for meta-llama 3.3 model series powered by Groq LPU technology.",
      disabled: false,
      modelPickerDefault: false,
      limits: { maxInputTokens: 128000, maxOutputTokens: 32768 },
      features: ["text", "coding"],
      experimental: false,
      apiKeySupport: "required",
      rateLimit: "Fastest"
    },
  },
];
