"use client";

import { useState } from "react";
import {
  X,
  Search,
  BookOpen,
  MessageCircle,
  Zap,
  Shield,
  HelpCircle,
  ChevronRight,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "~/lib/utils";

export default function HelpPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const helpArticles = [
    { title: "Getting Started with Fuseion", category: "Basics", icon: Zap },
    {
      title: "Managing your Account & Subscription",
      category: "Account",
      icon: Shield,
    },
    {
      title: "How to use DeepThink and features",
      category: "Features",
      icon: BookOpen,
    },
    {
      title: "Troubleshooting common issues",
      category: "Support",
      icon: HelpCircle,
    },
  ];

  return (
    <div className="w-full min-h-full flex items-start justify-center p-6 animate-in fade-in duration-500">
      <div className="w-full max-w-[900px] bg-[#1c1c1e] rounded-2xl border border-zinc-800/50 shadow-2xl flex flex-col overflow-hidden">
        {/* Header Section */}
        <div className="p-8 md:p-12 bg-gradient-to-b from-blue-600/10 to-transparent border-b border-zinc-800/50 relative">
          <button
            onClick={() => router.push("/")}
            className="absolute top-6 right-6 text-zinc-400 hover:text-white transition-colors rounded-full hover:bg-zinc-800 p-1"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="max-w-2xl mx-auto text-center space-y-6">
            <h1 className="text-3xl font-bold text-white tracking-tight">
              Help Center
            </h1>
            <p className="text-zinc-400 text-sm">
              Advice and answers from the Fuseion Team
            </p>

            <div className="relative max-w-lg mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
              <input
                type="text"
                placeholder="Search for articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-12 bg-zinc-900 border border-zinc-800 rounded-full pl-11 pr-4 text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-blue-500/50 transition-colors shadow-xl"
              />
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-8 md:p-12 grid grid-cols-1 md:grid-cols-2 gap-6">
          {helpArticles.map((article, idx) => (
            <button
              key={idx}
              className="flex items-center gap-4 p-5 rounded-2xl bg-zinc-900/40 border border-zinc-800/50 hover:border-zinc-700 hover:bg-zinc-800/40 transition-all text-left group"
            >
              <div className="h-10 w-10 rounded-xl bg-zinc-800 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
                <article.icon className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">
                  {article.category}
                </p>
                <h3 className="text-sm font-semibold text-zinc-200 mt-0.5 truncate">
                  {article.title}
                </h3>
              </div>
              <ChevronRight className="h-4 w-4 text-zinc-700 group-hover:text-zinc-400 group-hover:translate-x-1 transition-all" />
            </button>
          ))}
        </div>

        {/* Community Footer */}
        <div className="p-8 border-t border-zinc-800/50 bg-zinc-900/20 text-center">
          <div className="flex flex-col items-center gap-4">
            <div className="flex -space-x-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-8 w-8 rounded-full border-2 border-[#1c1c1e] bg-zinc-800 flex items-center justify-center shadow-lg"
                >
                  <div className="h-full w-full rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 opacity-50" />
                </div>
              ))}
            </div>
            <p className="text-sm text-zinc-400">
              Join our community or reach out to us at{" "}
              <a
                href="mailto:Fuseion25@gmail.com"
                className="text-blue-500 hover:text-blue-400 transition-colors"
              >
                Fuseion25@gmail.com
              </a>
            </p>
            <button className="px-6 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-full text-xs font-bold border border-zinc-700 transition-colors">
              Visit Community
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
