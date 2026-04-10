import React from 'react';
import { cn } from '~/lib/utils';
import { motion } from 'framer-motion';

export interface MessageProps {
  from: 'user' | 'assistant' | 'system';
  children: React.ReactNode;
  className?: string;
}

export function Message({ from, children, className }: MessageProps) {
  return (
    <motion.div
      data-role={from}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'group relative flex w-full flex-col gap-4 px-4 py-8 md:px-0',
        from === 'user' && 'items-end',
        from === 'assistant' && 'items-start',
        className
      )}
    >
      {children}
    </motion.div>
  );
}

export function MessageContent({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('flex max-w-2xl flex-col gap-3', className)}>
      {children}
    </div>
  );
}

export function MessageActions({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        'flex items-center gap-1.5 opacity-0 transition-opacity group-hover:opacity-100',
        'group-data-[role=user]/message:justify-end',
        className
      )}
    >
      {children}
    </div>
  );
}

export function MessageAvatar({ src, fallback, from }: { src?: string; fallback?: string; from: 'user' | 'assistant' }) {
  return (
    <div className={cn(
      "flex h-8 w-8 items-center justify-center rounded-full border bg-background",
      from === 'user' ? "ml-3 order-last" : "mr-3"
    )}>
      {src ? (
        <img src={src} alt={fallback} className="h-full w-full rounded-full object-cover" />
      ) : (
        <span className="text-xs font-medium uppercase">{fallback?.[0] || from[0]}</span>
      )}
    </div>
  );
}
