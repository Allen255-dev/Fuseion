import React, { memo } from "react";
import { Markdown } from "../chat/messages/markdown";
import { cn } from "~/lib/utils";

export interface ResponseProps {
  children: string;
  className?: string;
}

export const MessageResponse = memo(
  ({ children, className }: ResponseProps) => {
    return (
      <div
        className={cn(
          "prose prose-zinc dark:prose-invert max-w-none break-words text-foreground",
          className,
        )}
      >
        <Markdown>{children}</Markdown>
      </div>
    );
  },
  (prevProps, nextProps) => prevProps.children === nextProps.children,
);
