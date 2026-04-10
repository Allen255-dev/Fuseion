import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { query } = await req.json();
    
    if (!query || query.length < 2) {
      return NextResponse.json({ results: [], error: 'Query too short' });
    }
    
    // Call DuckDuckGo API (free, no API key required)
    const response = await fetch(
      `https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&no_html=1&skip_disambig=1`
    );
    
    const data = await response.json();
    const results = [];
    
    // Add abstract result (main summary)
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
          // Extract title from text (first part before dash)
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
    
    // Add answer box if available
    if (data.Answer && data.Answer.length > 0) {
      results.unshift({
        title: 'Answer',
        snippet: data.Answer,
        url: data.AnswerURL || `https://duckduckgo.com/?q=${encodeURIComponent(query)}`,
        source: 'DuckDuckGo'
      });
    }
    
    return NextResponse.json({ 
      results: results.slice(0, 10),
      query: query,
      total: results.length
    });
    
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      { results: [], error: 'Search failed. Please try again.' },
      { status: 500 }
    );
  }
}
