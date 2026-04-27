"use client";

import { useState } from "react";
import { Search, X } from "lucide-react";
import { cn } from "~/lib/utils";

interface SearchResult {
  title: string;
  snippet: string;
  url: string;
  source: string;
}

interface WebSearchProps {
  onResultSelect: (result: SearchResult) => void;
  isOpen: boolean;
  onClose: () => void;
}

export function WebSearch({ onResultSelect, isOpen, onClose }: WebSearchProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    if (!query.trim() || query.length < 2) return;

    setIsSearching(true);
    setError("");
    setResults([]);

    try {
      const response = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: query.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Search failed");
      }

      setResults(data.results || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Search failed");
    } finally {
      setIsSearching(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
      <div className="bg-[#1a1a1a]/95 border border-white/10 rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <Search className="h-5 w-5 text-blue-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">
                Search the Web
              </h2>
              <p className="text-xs text-muted-foreground">
                Powered by DuckDuckGo
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/5 rounded-full text-muted-foreground hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Search Input */}
        <div className="p-5 border-b border-white/5">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="What would you like to search for?"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all text-sm"
                autoFocus
              />
            </div>
            <button
              onClick={handleSearch}
              disabled={isSearching || query.trim().length < 2}
              className="px-6 py-2.5 bg-blue-500 text-white rounded-xl hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium text-sm shadow-lg shadow-blue-500/20"
            >
              {isSearching ? "Searching..." : "Search"}
            </button>
          </div>
        </div>

        {/* Results */}
        <div className="flex-1 overflow-y-auto p-5 scrollbar-thin scrollbar-thumb-white/10">
          {isSearching && (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent mb-4"></div>
              <p className="text-muted-foreground animate-pulse">
                Searching the deep web...
              </p>
            </div>
          )}

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-sm mb-4">
              {error}
            </div>
          )}

          {!isSearching && results.length === 0 && !error && query && (
            <div className="text-center py-12">
              <div className="text-muted-foreground/30 mb-4">
                <Search className="h-12 w-12 mx-auto" />
              </div>
              <p className="text-muted-foreground">
                No results found. Try a different search term.
              </p>
            </div>
          )}

          {!isSearching && results.length === 0 && !error && !query && (
            <div className="text-center py-12 text-muted-foreground/50 text-sm italic">
              Type a query to start searching...
            </div>
          )}

          {results.length > 0 && (
            <div className="space-y-4">
              {results.map((result, idx) => (
                <div key={idx} className="group">
                  <button
                    onClick={() => {
                      onResultSelect(result);
                      onClose();
                    }}
                    className="w-full text-left bg-white/5 hover:bg-white/10 border border-white/5 hover:border-blue-500/30 rounded-xl p-4 transition-all duration-200"
                  >
                    <h3 className="font-semibold text-blue-400 group-hover:text-blue-300 mb-1.5 leading-tight">
                      {result.title}
                    </h3>
                    <p className="text-sm text-muted-foreground/80 mb-3 line-clamp-2 leading-relaxed">
                      {result.snippet}
                    </p>
                    <div className="flex items-center gap-3 text-[10px] text-muted-foreground/40 font-mono uppercase tracking-wider">
                      <span className="px-1.5 py-0.5 bg-white/5 rounded border border-white/5">
                        {result.source}
                      </span>
                      <span className="truncate flex-1 hover:text-blue-400/60 transition-colors uppercase">
                        {result.url}
                      </span>
                    </div>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
