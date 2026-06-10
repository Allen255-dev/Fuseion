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
  // ── Google ──────────────────────────────────────────────────────────────────
  {
    id: "gemini-3-flash-preview",
    name: "Gemini 3 Flash Preview",
    metadata: {
      provider: "Google",
      developer: "Google",
      shortDescription: "Reliable & Precise",
      fullDescription: "Google's most stable Flash model. Efficient for fast, high-volume tasks on the free tier.",
      disabled: false,
      modelPickerDefault: true,
      limits: { maxInputTokens: 1048576, maxOutputTokens: 8192 },
      features: ["text", "multimodal", "reasoning"],
      experimental: false,
      apiKeySupport: "required",
      rateLimit: "15 RPM / 1M Context",
    },
  },
  {
    id: "gemini-2.5-flash",
    name: "Gemini 2.5 Flash",
    metadata: {
      provider: "Google",
      developer: "Google",
      shortDescription: "Fast & Smart",
      fullDescription: "Google's latest stable Gemini 2.5 Flash — a great balance of speed, intelligence, and long context handling.",
      disabled: false,
      limits: { maxInputTokens: 1048576, maxOutputTokens: 65536 },
      features: ["text", "multimodal", "reasoning"],
      experimental: false,
      apiKeySupport: "required",
      rateLimit: "15 RPM / 1M Context",
    },
  },
  {
    id: "gemini-2.5-pro",
    name: "Gemini 2.5 Pro",
    metadata: {
      provider: "Google",
      developer: "Google",
      shortDescription: "Google's Best",
      fullDescription: "Gemini 2.5 Pro — Google's most intelligent model. Exceptional at complex reasoning, coding, and long-document analysis.",
      disabled: false,
      limits: { maxInputTokens: 1048576, maxOutputTokens: 65536 },
      features: ["text", "multimodal", "reasoning", "code"],
      experimental: false,
      apiKeySupport: "required",
      rateLimit: "5 RPM / 1M Context",
    },
  },
  {
    id: "gemini-2.0-flash",
    name: "Gemini 2.0 Flash",
    metadata: {
      provider: "Google",
      developer: "Google",
      shortDescription: "Proven & Stable",
      fullDescription: "Gemini 2.0 Flash — a proven, stable model with solid multimodal performance and fast response times.",
      disabled: false,
      limits: { maxInputTokens: 1048576, maxOutputTokens: 8192 },
      features: ["text", "multimodal"],
      experimental: false,
      apiKeySupport: "required",
      rateLimit: "15 RPM / 1M Context",
    },
  },
  {
    id: "gemini-2.0-flash-lite",
    name: "Gemini 2.0 Flash-Lite",
    metadata: {
      provider: "Google",
      developer: "Google",
      shortDescription: "Lightest & Fastest",
      fullDescription: "Gemini 2.0 Flash-Lite — the most lightweight Gemini model. Ideal for high-frequency, low-latency tasks.",
      disabled: false,
      limits: { maxInputTokens: 1048576, maxOutputTokens: 8192 },
      features: ["text", "multimodal"],
      experimental: false,
      apiKeySupport: "required",
      rateLimit: "30 RPM / 1M Context",
    },
  },
  {
    id: "gemini-3-pro-preview",
    name: "Gemini 3 Pro Preview",
    metadata: {
      provider: "Google",
      developer: "Google",
      shortDescription: "Next-Gen Pro",
      fullDescription: "Gemini 3 Pro Preview — Google's next-generation Pro model. Highly capable at advanced reasoning and complex tasks.",
      disabled: false,
      limits: { maxInputTokens: 1048576, maxOutputTokens: 65536 },
      features: ["text", "multimodal", "reasoning", "code"],
      experimental: true,
      apiKeySupport: "required",
      rateLimit: "5 RPM / 1M Context",
    },
  },
  {
    id: "gemini-3.1-pro-preview",
    name: "Gemini 3.1 Pro Preview",
    metadata: {
      provider: "Google",
      developer: "Google",
      shortDescription: "Cutting Edge",
      fullDescription: "Gemini 3.1 Pro Preview — Google's most advanced experimental model with enhanced reasoning and multimodal capabilities.",
      disabled: false,
      limits: { maxInputTokens: 1048576, maxOutputTokens: 65536 },
      features: ["text", "multimodal", "reasoning", "code"],
      experimental: true,
      apiKeySupport: "required",
      rateLimit: "5 RPM / 1M Context",
    },
  },

  // ── Groq ─────────────────────────────────────────────────────────────────
  {
    id: "llama-3.3-70b-versatile",
    name: "Llama 3.3 70B Versatile",
    metadata: {
      provider: "Groq",
      developer: "Meta",
      shortDescription: "Fast & Powerful",
      fullDescription: "Meta's Llama 3.3 70B running on Groq's ultra-fast LPU hardware. Ideal for complex reasoning and detailed responses.",
      disabled: false,
      limits: { maxInputTokens: 128000, maxOutputTokens: 32768 },
      features: ["text", "reasoning"],
      experimental: false,
      apiKeySupport: "required",
      rateLimit: "30 RPM on Groq",
    },
  },
  {
    id: "llama-3.1-8b-instant",
    name: "Llama 3.1 8B Instant",
    metadata: {
      provider: "Groq",
      developer: "Meta",
      shortDescription: "Ultra-Fast Responses",
      fullDescription: "Meta's Llama 3.1 8B on Groq LPU — the fastest available model for quick, snappy answers.",
      disabled: false,
      limits: { maxInputTokens: 128000, maxOutputTokens: 8192 },
      features: ["text"],
      experimental: false,
      apiKeySupport: "required",
      rateLimit: "30 RPM on Groq",
    },
  },
  {
    id: "meta-llama/llama-4-scout-17b-16e-instruct",
    name: "Llama 4 Scout 17B",
    metadata: {
      provider: "Groq",
      developer: "Meta",
      shortDescription: "Latest Llama 4",
      fullDescription: "Meta's newest Llama 4 Scout model with 17B active parameters. Excellent at following complex instructions with speed.",
      disabled: false,
      limits: { maxInputTokens: 131072, maxOutputTokens: 8192 },
      features: ["text", "reasoning"],
      experimental: true,
      apiKeySupport: "required",
      rateLimit: "30 RPM on Groq",
    },
  },
  {
    id: "qwen/qwen3-32b",
    name: "Qwen 3 32B",
    metadata: {
      provider: "Groq",
      developer: "Alibaba",
      shortDescription: "Strong Reasoning",
      fullDescription: "Alibaba's Qwen 3 32B on Groq — a highly capable model for coding, reasoning, and multilingual tasks.",
      disabled: false,
      limits: { maxInputTokens: 32768, maxOutputTokens: 8192 },
      features: ["text", "reasoning", "code"],
      experimental: false,
      apiKeySupport: "required",
      rateLimit: "30 RPM on Groq",
    },
  },

  // ── OpenRouter Free ──────────────────────────────────────────────────────
  {
    id: "meta-llama/llama-3.3-70b-instruct:free",
    name: "Llama 3.3 70B (Free)",
    metadata: {
      provider: "OpenRouter",
      developer: "Meta",
      shortDescription: "Free & Capable",
      fullDescription: "Meta Llama 3.3 70B via OpenRouter's free tier. Great all-around model for reasoning, writing, and coding.",
      disabled: false,
      limits: { maxInputTokens: 131072, maxOutputTokens: 8192 },
      features: ["text", "reasoning"],
      experimental: false,
      apiKeySupport: "required",
      rateLimit: "20 RPM / 200 req/day",
    },
  },
  {
    id: "google/gemma-3-27b-it:free",
    name: "Gemma 3 27B (Free)",
    metadata: {
      provider: "OpenRouter",
      developer: "Google",
      shortDescription: "Google Open Model",
      fullDescription: "Google's Gemma 3 27B instruction-tuned model via OpenRouter free tier. Strong at following instructions.",
      disabled: false,
      limits: { maxInputTokens: 131072, maxOutputTokens: 8192 },
      features: ["text", "multimodal"],
      experimental: false,
      apiKeySupport: "required",
      rateLimit: "20 RPM / 200 req/day",
    },
  },
  {
    id: "google/gemma-4-31b-it:free",
    name: "Gemma 4 31B (Free)",
    metadata: {
      provider: "OpenRouter",
      developer: "Google",
      shortDescription: "Newest Gemma",
      fullDescription: "Google's latest Gemma 4 31B model via OpenRouter free tier — one of the strongest free open models available.",
      disabled: false,
      limits: { maxInputTokens: 131072, maxOutputTokens: 8192 },
      features: ["text", "multimodal", "reasoning"],
      experimental: true,
      apiKeySupport: "required",
      rateLimit: "20 RPM / 200 req/day",
    },
  },
  {
    id: "nvidia/nemotron-3-super-120b-a12b:free",
    name: "Nemotron Super 120B (Free)",
    metadata: {
      provider: "OpenRouter",
      developer: "NVIDIA",
      shortDescription: "NVIDIA Powerhouse",
      fullDescription: "NVIDIA's Nemotron Super 120B MoE model via OpenRouter free tier. Excellent reasoning and STEM capabilities.",
      disabled: false,
      limits: { maxInputTokens: 131072, maxOutputTokens: 8192 },
      features: ["text", "reasoning"],
      experimental: false,
      apiKeySupport: "required",
      rateLimit: "20 RPM / 200 req/day",
    },
  },
  {
    id: "nousresearch/hermes-3-llama-3.1-405b:free",
    name: "Hermes 3 405B (Free)",
    metadata: {
      provider: "OpenRouter",
      developer: "Nous Research",
      shortDescription: "Largest Free Model",
      fullDescription: "Nous Research Hermes 3 built on Llama 3.1 405B — one of the most powerful free models on OpenRouter.",
      disabled: false,
      limits: { maxInputTokens: 131072, maxOutputTokens: 16384 },
      features: ["text", "reasoning"],
      experimental: false,
      apiKeySupport: "required",
      rateLimit: "20 RPM / 200 req/day",
    },
  },
  {
    id: "qwen/qwen3-coder:free",
    name: "Qwen3 Coder (Free)",
    metadata: {
      provider: "OpenRouter",
      developer: "Alibaba",
      shortDescription: "Best Free Coder",
      fullDescription: "Qwen3 Coder 480B A35B MoE via OpenRouter free tier — purpose-built for code generation, debugging, and review.",
      disabled: false,
      limits: { maxInputTokens: 131072, maxOutputTokens: 16384 },
      features: ["text", "code", "reasoning"],
      experimental: false,
      apiKeySupport: "required",
      rateLimit: "20 RPM / 200 req/day",
    },
  },
];






