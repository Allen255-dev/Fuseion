import React, { useRef, useEffect } from 'react';
import { cn } from '~/lib/utils';
import { Button } from '~/components/ui/button';
import { ArrowUp, Square, Loader2 } from 'lucide-react';

export interface PromptInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  onStop?: () => void;
  status?: string;
  isUploading?: boolean;
  placeholder?: string;
  className?: string;
  children?: React.ReactNode;
}

export function PromptInput({
  value,
  onChange,
  onSubmit,
  onStop,
  status,
  isUploading,
  placeholder = 'Type a message...',
  className,
  children
}: PromptInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [value]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSubmit();
    }
  };

  const isLoading = status === 'streaming' || status === 'submitted';

  return (
    <div className={cn('relative flex flex-col gap-2 rounded-2xl bg-background border shadow-sm p-3 focus-within:ring-1 focus-within:ring-primary/30 dark:bg-zinc-900 dark:border-white/10', className)}>
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        rows={1}
        className="w-full resize-none bg-transparent px-2 py-1 text-sm outline-none placeholder:text-muted-foreground min-h-[40px]"
      />
      
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          {children}
        </div>
        
        <div className="flex items-center gap-2">
          {status === 'streaming' ? (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={onStop}
              className="h-8 w-8 rounded-full bg-red-500/10 text-red-500 hover:bg-red-500/20"
            >
              <Square className="h-3 w-3 fill-current" />
            </Button>
          ) : (
            <Button
              type="button"
              disabled={(!value.trim() && !isUploading) || status === 'submitted'}
              onClick={onSubmit}
              size="icon"
              className="h-8 w-8 rounded-full bg-primary text-primary-foreground shadow-sm hover:opacity-90 disabled:opacity-50"
            >
              {status === 'submitted' ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <ArrowUp className="h-4 w-4" />
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
