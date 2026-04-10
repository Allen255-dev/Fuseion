'use client';

import { ExternalLink } from "lucide-react";

export interface Citation {
  id: number;
  title: string;
  url: string;
  snippet?: string;
  source?: string;
}

export function CitationLinks({ citations }: { citations: Citation[] }) {
  if (!citations || citations.length === 0) return null;
  
  return (
    <div className="mt-4 pt-3 border-t border-white/5">
      <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2 flex items-center gap-2">
        <span>Sources</span>
        <div className="h-px flex-1 bg-white/5" />
      </div>
      <div className="flex flex-wrap gap-2">
        {citations.map((citation) => (
          <a
            key={citation.id}
            href={citation.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-1 px-2.5 py-1 bg-white/5 hover:bg-white/10 border border-white/5 rounded-full text-xs text-blue-400 hover:text-blue-300 transition-all duration-200"
            title={citation.title}
          >
            <span className="font-bold opacity-70">[{citation.id}]</span>
            <span className="max-w-[150px] truncate opacity-80 group-hover:opacity-100">{citation.title}</span>
            <ExternalLink className="size-2.5 opacity-40 group-hover:opacity-70 transition-opacity" />
          </a>
        ))}
      </div>
    </div>
  );
}

// Helper to extract citations from AI response
export function extractCitations(text: string, toolResults?: any[]): { 
  content: string; 
  citations: Citation[] 
} {
  // DeepSeek-style responses usually have [1], [2] in them.
  // We extract all [n] where n is a number.
  const citationRegex = /\[(\d+)\]/g;
  const foundIds = new Set<number>();
  let match;
  
  while ((match = citationRegex.exec(text)) !== null) {
    foundIds.add(parseInt(match[1]));
  }

  // Filter tool results to only those cited
  const citations: Citation[] = [];
  if (toolResults) {
      toolResults.forEach(result => {
          if (Array.isArray(result.result)) {
              result.result.forEach((item: any) => {
                  if (item.id && foundIds.has(item.id)) {
                      citations.push(item);
                      foundIds.delete(item.id);
                  }
              });
          }
      });
  }

  return { content: text, citations };
}
