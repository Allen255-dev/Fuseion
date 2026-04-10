"use client";

import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import type { Session } from "next-auth";
import { ChevronDown, Zap, Shield, Cpu, Search } from "lucide-react";
import { Model, models } from "~/lib/ai/models";
import { Button } from "~/components/ui/button";
import { saveModelAsCookie } from "~/app/(chat)/actions";
import { entitlementsByUserTier } from "~/lib/ai/entitlements";
import { memo, startTransition, useMemo, useOptimistic, useState } from "react";
import { cn } from "~/lib/utils";

interface ModelPickerProps {
  session: Session;
  selectedModel: Model;
  onModelChange: (model: Model) => void;
}

const ProviderBadge = ({ provider }: { provider: string }) => {
  const styles: Record<string, string> = {
    Google: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    OpenRouter: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    Groq: "bg-orange-500/10 text-orange-400 border-orange-500/20",
    Search: "bg-green-500/10 text-green-400 border-green-500/20",
  };

  return (
    <span className={cn("px-1.5 py-0.5 rounded-md text-[10px] font-bold border uppercase tracking-wider", styles[provider] || "bg-white/5 text-white/50 border-white/10")}>
      {provider}
    </span>
  );
};

const ModelPicker = ({ session, selectedModel, onModelChange }: ModelPickerProps) => {
  const [open, setOpen] = useState(false);
  const [optimisticModelId, setOptimisticModelId] = useOptimistic(
    selectedModel.id,
  );

  const availableModels = useMemo(() => {
    return models.filter((model) => {
      if (session?.user?.tier === "free") {
        // For project Fuseion, we want to show all models in the free tier if not restricted
        return true;
      }
      return true;
    });
  }, [session?.user?.tier]);

  const selectedChatModel = useMemo(
    () =>
      availableModels.find((chatModel) => chatModel.id === optimisticModelId) || availableModels[0],
    [optimisticModelId, availableModels],
  );

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="px-3 py-1.5 flex items-center gap-2 h-9 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white transition-all duration-200"
        >
          {selectedChatModel?.id === "web-search" ? (
            <Search className="size-3.5 text-green-400" />
          ) : (
            <Cpu className="size-3.5 text-blue-400" />
          )}
          <span className="text-xs font-medium">{selectedChatModel?.name}</span>
          <ChevronDown className="h-3 w-3 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        className="w-80 p-2 bg-[#1a1a1a]/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl focus:outline-none"
      >
        <div className="px-2 py-1.5 text-[10px] font-bold text-muted-foreground uppercase tracking-widest border-b border-white/5 mb-1">
          Select AI Intelligence
        </div>
        <div className="max-h-[400px] overflow-y-auto scrollbar-thin">
          {availableModels.map((model) => (
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
                "flex flex-col items-start gap-1 p-3 rounded-xl cursor-pointer transition-all duration-200 outline-none",
                optimisticModelId === model.id
                  ? "bg-white/10 text-white"
                  : "text-muted-foreground hover:bg-white/5 hover:text-white"
              )}
            >
              <div className="flex items-center justify-between w-full">
                <span className="text-sm font-semibold">{model.name}</span>
                <ProviderBadge provider={model.metadata.provider} />
              </div>
              <div className="text-[11px] opacity-70 leading-relaxed">
                {model.metadata.fullDescription}
              </div>
              {model.metadata.rateLimit && (
                <div className="flex items-center gap-1.5 mt-1 text-[10px] font-medium text-blue-400/80">
                  <Zap className="size-3" />
                  {model.metadata.rateLimit}
                </div>
              )}
            </DropdownMenuItem>
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default memo(
  ModelPicker,
  (prev, next) =>
    prev.selectedModel.id === next.selectedModel.id &&
    prev.session?.user?.tier === next.session?.user?.tier,
);
