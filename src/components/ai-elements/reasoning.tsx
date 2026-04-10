import React, { useState } from 'react';
import { cn } from '~/lib/utils';
import { ChevronRight, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export interface ReasoningProps {
  children: React.ReactNode;
  isLoading?: boolean;
  className?: string;
  title?: string;
}

export function Reasoning({ children, isLoading, className, title = 'Reasoning' }: ReasoningProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center gap-2 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
      >
        <ChevronRight
          className={cn('h-3.5 w-3.5 transition-transform', isExpanded && 'rotate-90')}
        />
        <span>{title}</span>
        {isLoading && <Loader2 className="h-3 w-3 animate-spin" />}
      </button>
      
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="rounded-lg bg-muted/50 p-3 text-sm text-muted-foreground border border-border/50">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
