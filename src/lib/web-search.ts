import { tavily } from "@tavily/core";

export interface SearchResult {
  title: string;
  snippet: string;
  url: string;
  source: string;
  score?: number;
  publishedDate?: string;
}

export interface SearchOptions {
  depth?: "basic" | "advanced";
  maxResults?: number;
}

/**
 * Searches the web using the Tavily API.
 * Requires TAVILY_API_KEY to be set in environment variables.
 */
export async function searchWeb(
  query: string,
  options: SearchOptions = {},
): Promise<SearchResult[]> {
  try {
    const apiKey = process.env.TAVILY_API_KEY;

    if (!apiKey) {
      console.warn("TAVILY_API_KEY is not set. Falling back to empty results.");
      return [];
    }

    const tvly = tavily({ apiKey });

    // Execute search with advanced depth by default for better quality
    const response = await tvly.search(query, {
      searchDepth: options.depth || "advanced",
      maxResults: options.maxResults || 8,
      includeAnswer: true,
      includeImages: false,
      includeRawContent: false,
    });

    if (!response || !response.results) {
      return [];
    }

    return response.results.map((res) => ({
      title: res.title,
      snippet: res.content,
      url: res.url,
      source: "Tavily Search Engine",
      score: res.score,
      publishedDate: res.publishedDate,
    }));
  } catch (error) {
    console.error("Tavily search error:", error);
    return [];
  }
}
