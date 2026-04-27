"use client";

import { useState } from "react";
import {
  X,
  MessageSquare,
  Bug,
  Zap,
  Sparkles,
  HelpCircle,
  FileText,
  Image as ImageIcon,
  ChevronDown,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "~/lib/utils";

type FeedbackCategory =
  | "performance"
  | "bug"
  | "optimization"
  | "content"
  | "other";

export default function FeedbackPage() {
  const router = useRouter();
  const [category, setCategory] = useState<FeedbackCategory>("performance");
  const [description, setDescription] = useState("");
  const [contact, setContact] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = [
    { id: "performance", label: "Performance", icon: Zap },
    { id: "bug", label: "Bug Report", icon: Bug },
    { id: "optimization", label: "Optimization", icon: MessageSquare },
    { id: "content", label: "Content Quality", icon: Sparkles },
    { id: "other", label: "Other", icon: HelpCircle },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Reset and close
    setIsSubmitting(false);
    router.push("/");
  };

  return (
    <div className="w-full min-h-full flex items-start justify-center p-6 animate-in fade-in duration-500">
      <div className="w-full max-w-[800px] bg-[#1c1c1e] rounded-2xl border border-zinc-800/50 shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 pb-4">
          <h2 className="text-lg font-semibold text-white">Feedback</h2>
          <button
            onClick={() => router.push("/")}
            className="text-zinc-400 hover:text-white transition-colors rounded-full hover:bg-zinc-800 p-1"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 md:p-8 pt-2 space-y-8">
          {/* Category Selection */}
          <div className="space-y-4">
            <label className="text-sm font-medium text-zinc-100 italic">
              Select a category to help us improve
            </label>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategory(cat.id as FeedbackCategory)}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium transition-all duration-200",
                    category === cat.id
                      ? "bg-zinc-800 border-zinc-700 text-white"
                      : "bg-transparent border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200",
                  )}
                >
                  <cat.icon className="h-4 w-4" />
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-4">
            <textarea
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Please describe the problem you encountered or your suggestions..."
              className="w-full h-48 bg-zinc-900 border border-zinc-800/50 rounded-xl p-4 text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-700 transition-colors resize-none text-sm leading-relaxed"
            />
          </div>

          {/* Optional Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-zinc-600 uppercase tracking-widest px-1">
                Upload Image (Optional)
              </label>
              <button
                type="button"
                className="w-full flex items-center justify-center gap-2 h-11 bg-zinc-900 border border-zinc-800/50 rounded-xl text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-all text-sm font-medium"
              >
                <ImageIcon className="h-4 w-4" />
                Select screenshots
              </button>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-bold text-zinc-600 uppercase tracking-widest px-1">
                Contact Information (Optional)
              </label>
              <input
                type="text"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                placeholder="Email or phone number"
                className="w-full h-11 bg-zinc-900 border border-zinc-800/50 rounded-xl px-4 text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-700 transition-colors text-sm"
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-6 flex justify-end items-center gap-4">
            <p className="text-[11px] text-zinc-600 font-medium">
              Thank you for your support!
            </p>
            <button
              type="submit"
              disabled={isSubmitting || !description.trim()}
              className={cn(
                "px-8 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 shadow-xl",
                isSubmitting || !description.trim()
                  ? "bg-zinc-800 text-zinc-500 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-500 text-white shadow-blue-900/20",
              )}
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
