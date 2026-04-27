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
      rateLimit: "15 RPM / 1M Context"
    },
  },
];






