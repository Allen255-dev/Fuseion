export type Provider = 'google' | 'openrouter' | 'groq' | 'openai' | 'search';

export interface ModelConfig {
    id: string;
    name: string;
    provider: Provider;
    description: string;
    isFree: boolean;
    rateLimit?: string;
    icon?: string;
}

export const MODELS: ModelConfig[] = [
    {
        id: 'gemini-2.5-flash',
        name: 'Gemini 2.5 Flash',
        provider: 'google',
        description: 'Best balance of speed, cost, and accuracy for high-volume production tasks.',
        isFree: true,
        rateLimit: '15 RPM / 1M Context'
    },
    {
        id: 'gpt-5.4-nano',
        name: 'GPT-5.4 Nano',
        provider: 'openai',
        description: 'OpenAI\'s most cost-efficient and fastest model, ideal for simple and high-volume tasks.',
        isFree: false
    },
    {
        id: 'openrouter/free',
        name: 'OpenRouter Auto Free',
        provider: 'openrouter',
        description: "OpenRouter's automatic free model selector. Always picks the best currently available free model.",
        isFree: true
    },
    {
        id: 'llama-3.3-70b-versatile',
        name: 'Llama 3.3 70B (Groq)',
        provider: 'groq',
        description: 'Blazing fast inference for general-purpose chat and real-time applications via Groq LPU.',
        isFree: true,
        rateLimit: 'Ultra Fast'
    },
    {
        id: 'web-search',
        name: 'Web Search',
        provider: 'search',
        description: 'Search the web using DuckDuckGo to find up-to-date information.',
        isFree: true,
        icon: '🔍'
    },
];

export function getModelById(id: string) {
    return MODELS.find(m => m.id === id) || MODELS[0];
}
