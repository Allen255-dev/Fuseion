"use client";

import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import type { Session } from "next-auth";
import { ChevronDown, Zap, Cpu, Search, FlaskConical } from "lucide-react";
import { Model, models } from "~/lib/ai/models";
import { Button } from "~/components/ui/button";
import { saveModelAsCookie } from "~/app/(chat)/actions";
import { memo, startTransition, useMemo, useOptimistic, useState } from "react";
import { cn } from "~/lib/utils";

interface ModelPickerProps {
  session: Session;
  selectedModel: Model;
  onModelChange: (model: Model) => void;
}

const PROVIDER_ORDER = ["Google", "Groq", "OpenRouter", "OpenAI", "Anthropic", "DeepSeek"];

const PROVIDER_STYLES: Record<string, string> = {
  Google: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  OpenRouter: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  Groq: "bg-orange-500/10 text-orange-400 border-orange-500/20",
  OpenAI: "bg-green-500/10 text-green-400 border-green-500/20",
  Anthropic: "bg-red-500/10 text-red-400 border-red-500/20",
  DeepSeek: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
};

const ModelPicker = ({
  session,
  selectedModel,
  onModelChange,
}: ModelPickerProps) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [optimisticModelId, setOptimisticModelId] = useOptimistic(
    selectedModel.id,
  );

  const selectedChatModel = useMemo(
    () =>
      models.find((chatModel) => chatModel.id === optimisticModelId) ||
      models[0],
    [optimisticModelId],
  );

  // Filter then group by provider
  const groupedModels = useMemo(() => {
    const q = search.toLowerCase().trim();
    const filtered = q
      ? models.filter(
          (m) =>
            m.name.toLowerCase().includes(q) ||
            m.metadata.provider.toLowerCase().includes(q) ||
            m.metadata.shortDescription.toLowerCase().includes(q),
        )
      : models;

    const groups: Record<string, Model[]> = {};
    for (const model of filtered) {
      const p = model.metadata.provider;
      if (!groups[p]) groups[p] = [];
      groups[p].push(model);
    }

    return PROVIDER_ORDER
      .filter((p) => groups[p]?.length)
      .map((p) => ({ provider: p, models: groups[p] }));
  }, [search]);

  const totalFiltered = groupedModels.reduce((n, g) => n + g.models.length, 0);

  return (
    <DropdownMenu
      open={open}
      onOpenChange={(v) => {
        setOpen(v);
        if (!v) setSearch("");
      }}
    >
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="px-3 py-1.5 flex items-center gap-2 h-9 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white transition-all duration-200"
        >
          <Cpu className="size-3.5 text-blue-400" />
          <span className="text-xs font-medium">{selectedChatModel?.name}</span>
          <ChevronDown className="h-3 w-3 opacity-50" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="start"
        className="w-80 p-2 bg-[#1a1a1a]/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl focus:outline-none"
      >
        {/* Header */}
        <div className="px-2 py-1.5 text-[10px] font-bold text-muted-foreground uppercase tracking-widest border-b border-white/5 mb-2">
          Select AI Intelligence
        </div>

        {/* Search */}
        <div className="relative mb-2 px-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3 text-white/30" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search models…"
            className="w-full pl-7 pr-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-white placeholder:text-white/30 outline-none focus:border-white/20 transition-colors"
          />
        </div>

        {/* Grouped model list */}
        <div className="max-h-[380px] overflow-y-auto scrollbar-thin space-y-3 pr-0.5">
          {totalFiltered === 0 ? (
            <div className="text-center text-xs text-white/30 py-6">
              No models found
            </div>
          ) : (
            groupedModels.map(({ provider, models: providerModels }) => (
              <div key={provider}>
                {/* Provider section heading */}
                <div className="flex items-center gap-2 px-2 mb-1">
                  <span
                    className={cn(
                      "text-[10px] font-bold uppercase tracking-widest",
                      PROVIDER_STYLES[provider]?.split(" ")[1] || "text-white/40",
                    )}
                  >
                    {provider}
                  </span>
                  <div className="flex-1 h-px bg-white/5" />
                </div>

                {providerModels.map((model) => (
                  <DropdownMenuItem
                    key={model.id}
                    onSelect={() => {
                      setOpen(false);
                      startTransition(() => {
                        setOptimisticModelId(model.id);
                        onModelChange(model);
                        saveModelAsCookie(model);
                      });
                    }}
                    className={cn(
                      "flex flex-col items-start gap-1 p-3 rounded-xl cursor-pointer transition-all duration-200 outline-none relative overflow-hidden group",
                      optimisticModelId === model.id
                        ? "bg-white/10 text-white"
                        : "text-muted-foreground hover:bg-white/5 hover:text-white",
                    )}
                  >
                    {/* Name + experimental badge */}
                    <div className="flex items-center justify-between w-full">
                      <span className="text-sm font-semibold">{model.name}</span>
                      {model.metadata.experimental && (
                        <span className="flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] font-bold border bg-yellow-500/10 text-yellow-400 border-yellow-500/20 uppercase tracking-wider shrink-0">
                          <FlaskConical className="size-2.5" />
                          Preview
                        </span>
                      )}
                    </div>

                    {/* Rate limit */}
                    {model.metadata.rateLimit && (
                      <div className="flex items-center gap-1 text-[10px] text-blue-400/80">
                        <Zap className="size-2.5" />
                        {model.metadata.rateLimit}
                      </div>
                    )}

                    {/* Short description */}
                    <div className="text-[11px] opacity-70 leading-relaxed">
                      {model.metadata.shortDescription}
                    </div>
                  </DropdownMenuItem>
                ))}
              </div>
            ))
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default memo(
  ModelPicker,
  (prev, next) => prev.selectedModel.id === next.selectedModel.id,
);
