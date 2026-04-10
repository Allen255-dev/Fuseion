// DuckDuckGo is free and privacy-focused - no API key needed!
export interface SearchResult {
  title: string;
  snippet: string;
  url: string;
  source: string;
}

export async function searchWeb(query: string): Promise<SearchResult[]> {
  try {
    // Use DuckDuckGo API (free, no API key)
    const response = await fetch(
      `https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&no_html=1&skip_disambig=1`,
      {
        headers: {
            'User-Agent': 'Fuseion/1.0 (https://fuseion.ai)'
        }
      }
    );
    
    if (!response.ok) {
        throw new Error(`DuckDuckGo API error: ${response.status}`);
    }

    const data = await response.json();
    const results: SearchResult[] = [];
    
    // Add abstract if available (like DeepSeek's main result)
    if (data.AbstractText && data.AbstractText.length > 0) {
      results.push({
        title: data.AbstractText.split('.')[0].substring(0, 100),
        snippet: data.AbstractText,
        url: data.AbstractURL || `https://duckduckgo.com/?q=${encodeURIComponent(query)}`,
        source: 'DuckDuckGo'
      });
    }
    
    // Add related topics
    if (data.RelatedTopics && Array.isArray(data.RelatedTopics)) {
      for (const topic of data.RelatedTopics) {
        if (topic.Text && topic.FirstURL) {
          let title = topic.Text.split(' - ')[0] || topic.Text;
          if (title.length > 100) title = title.substring(0, 100);
          
          results.push({
            title: title,
            snippet: topic.Text,
            url: topic.FirstURL,
            source: 'DuckDuckGo'
          });
        }
      }
    }
    
    // Add answer if available (like DeepSeek's quick answer)
    if (data.Answer && data.Answer.length > 0) {
      results.unshift({
        title: 'Direct Answer',
        snippet: data.Answer,
        url: data.AnswerURL || `https://duckduckgo.com/?q=${encodeURIComponent(query)}`,
        source: 'DuckDuckGo'
      });
    }
    
    return results.slice(0, 5); // Return top 5 results
  } catch (error) {
    console.error('Web search error:', error);
    return [];
  }
}
