"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import { useSidebar } from "~/components/ui/sidebar";
import { useIsMobile } from "~/hooks/use-mobile";
import { PanelLeft, Plus, MessageSquare } from "lucide-react";
import { SidebarTrigger } from "~/components/ui/sidebar";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "~/components/ui/tooltip";
import Link from "next/link";
import { cn } from "~/lib/utils";

const Nav = () => {
  const router = useRouter();
  const { state, isMobile } = useSidebar();

  if (isMobile) return null;

  return (
    <div 
      className={cn(
        "pointer-events-auto fixed top-4 z-50 flex items-center transition-all duration-300 ease-in-out",
        state === "expanded" ? "left-6 w-[200px]" : "left-4"
      )}
    >
      <div className="flex items-center justify-between w-full gap-4">
        {/* Logo Section */}
        <Link href="/" className="flex items-center gap-2.5 group shrink-0">
          <div className="size-8 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-900/20 overflow-hidden shrink-0">
            <img src="/fuseion.png" alt="Fuseion" className="size-full object-cover" />
          </div>
          {state === "expanded" && (
            <span className="text-xl font-bold font-heading text-white tracking-tight animate-in fade-in slide-in-from-left-2 duration-300">
              Fuseion
            </span>
          )}
        </Link>

        {/* Action Area */}
        {state === "expanded" ? (
          <TooltipProvider delayDuration={0}>
            <Tooltip>
              <TooltipTrigger asChild>
                <SidebarTrigger
                  className="inline-flex items-center justify-center rounded-lg text-zinc-500 hover:text-white hover:bg-white/10 transition-all h-8 w-8"
                  aria-label="Toggle Sidebar"
                >
                  <PanelLeft className="size-4.5" />
                </SidebarTrigger>
              </TooltipTrigger>
              <TooltipContent align="end" side="bottom" sideOffset={10}>
                Close Sidebar
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ) : (
          <div className="flex items-center gap-3 animate-in fade-in slide-in-from-left-2 duration-300">
             <div className="flex items-center bg-[#1c1c1e] border border-white/5 rounded-full p-1 shadow-2xl">
              <TooltipProvider delayDuration={0}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <SidebarTrigger
                      className="inline-flex items-center justify-center rounded-full text-zinc-400 hover:text-white hover:bg-white/10 transition-all h-8 w-10"
                      aria-label="Toggle Sidebar"
                    >
                      <PanelLeft className="size-5" />
                    </SidebarTrigger>
                  </TooltipTrigger>
                  <TooltipContent align="start" side="bottom" sideOffset={10}>
                    Open Sidebar
                  </TooltipContent>
                </Tooltip>

                <div className="w-px h-4 bg-white/10 mx-0.5" />

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        router.push("/chat");
                        router.refresh();
                      }}
                      className="size-8 w-10 rounded-full text-zinc-400 hover:text-white hover:bg-white/10 transition-all"
                      aria-label="New Thread"
                    >
                      <Plus className="size-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent align="start" side="bottom" sideOffset={10}>
                    New Thread
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            
            <div className="flex flex-col -space-y-0.5 pointer-events-none">
              <span className="text-[13px] font-bold text-white tracking-tight uppercase">Fuseion</span>
              <span className="text-[10px] text-zinc-500 font-medium">Pro</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Nav;
