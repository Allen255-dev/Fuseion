import React, { useRef, useEffect } from 'react';
import { cn } from '~/lib/utils';

export interface ConversationProps {
  children: React.ReactNode;
  className?: string;
  autoScroll?: boolean;
}

export function Conversation({ children, className, autoScroll = true }: ConversationProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (autoScroll && containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [children, autoScroll]);

  return (
    <div 
      ref={containerRef}
      className={cn(
        "relative flex h-full grow flex-col overflow-y-auto overflow-x-hidden",
        "scrollbar-thin scrollbar-thumb-zinc-300 dark:scrollbar-thumb-zinc-700",
        className
      )}
    >
      <div className="mx-auto flex w-full max-w-3xl grow flex-col pb-8 pt-10 px-4 md:px-0">
        {children}
      </div>
    </div>
  );
}

export function ScrollAnchor() {
  const anchorRef = useRef<HTMLDivElement>(null);
  
  return (
    <div 
      ref={anchorRef}
      className="h-px min-h-[1px] w-full" 
    />
  );
}
