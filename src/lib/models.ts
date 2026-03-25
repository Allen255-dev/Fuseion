export type Provider = 'google' | 'openrouter' | 'groq' | 'openai';

export interface ModelConfig {
    id: string;
    name: string;
    provider: Provider;
    description: string;
    isFree: boolean;
    rateLimit?: string;
}

export const MODELS: ModelConfig[] = [
    {
        id: 'gemini-3.1-pro',
        name: 'Gemini 3.1 Pro',
        provider: 'google',
        description: 'Google\'s most advanced model with enhanced reasoning and agentic capabilities.',
        isFree: true,
        rateLimit: '20 RPM / 2M Context'
    },
    {
        id: 'gemini-3.1-flash-lite',
        name: 'Gemini 3.1 Flash-Lite',
        provider: 'google',
        description: 'Blazing fast, intelligence-at-scale model optimized for speed.',
        isFree: true,
        rateLimit: '15 RPM / 1M Context'
    },
    {
        id: 'gpt-5.4',
        name: 'GPT-5.4 Standard',
        provider: 'openai',
        description: 'OpenAI\'s latest flagship model with industry-leading intelligence.',
        isFree: false
    },
    {
        id: 'gpt-5.4-thinking',
        name: 'GPT-5.4 Thinking',
        provider: 'openai',
        description: 'Reasoning-first model optimized for complex problem solving and coding.',
        isFree: false
    },
    {
        id: 'gpt-5.4-mini',
        name: 'GPT-5.4 mini',
        provider: 'openai',
        description: 'Highly efficient and fast version of GPT-5.4.',
        isFree: false
    },
    {
        id: 'anthropic/claude-opus-4.6',
        name: 'Claude Opus 4.6',
        provider: 'openrouter',
        description: 'Anthropic\'s most capable model with state-of-the-art coding and agentic performance.',
        isFree: false
    },
    {
        id: 'anthropic/claude-sonnet-4.6',
        name: 'Claude Sonnet 4.6',
        provider: 'openrouter',
        description: 'High-performance model balancing speed and frontier-level intelligence.',
        isFree: true
    },
    {
        id: 'anthropic/claude-haiku-4.5',
        name: 'Claude Haiku 4.5',
        provider: 'openrouter',
        description: 'Fastest model with near-frontier performance in reasoning and coding.',
        isFree: true
    },
    {
        id: 'meta-llama/llama-4.1-maverick:free',
        name: 'Llama 4.1 Maverick',
        provider: 'openrouter',
        description: 'Meta\'s smartest open-weights model to date.',
        isFree: true
    },
    {
        id: 'deepseek/deepseek-v3.2:free',
        name: 'DeepSeek V3.2',
        provider: 'openrouter',
        description: 'Latest DeepSeek with high computational efficiency and vast reasoning.',
        isFree: true
    },
    {
        id: 'deepseek/deepseek-r1:free',
        name: 'DeepSeek R1',
        provider: 'openrouter',
        description: 'Advanced open-weights reasoning model.',
        isFree: true
    },
    {
        id: 'llama-3.3-70b-versatile',
        name: 'Llama 3.3 70B (Groq)',
        provider: 'groq',
        description: 'Ultra-fast Llama 3.3 inference via Groq.',
        isFree: true,
        rateLimit: 'Fastest'
    }
];

export function getModelById(id: string) {
    return MODELS.find(m => m.id === id) || MODELS[0];
}
