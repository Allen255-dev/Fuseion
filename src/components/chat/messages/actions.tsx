import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "~/components/ui/tooltip";
import { toast } from "sonner";
import { ChatMessage } from "~/types";
import { Button } from "~/components/ui/button";
import { useCopyToClipboard } from "usehooks-ts";
import type { UseChatHelpers } from "@ai-sdk/react";
import { Dispatch, SetStateAction, memo } from "react";
import {
  Copy,
  Pencil,
  RefreshCcw,
  ThumbsUp,
  ThumbsDown,
  Share2,
  Forward,
} from "lucide-react";

export function PureMessageActions({
  message,
  setMode,
  isLoading,
  regenerate,
}: {
  isLoading: boolean;
  message: ChatMessage;
  setMode: Dispatch<SetStateAction<"view" | "edit">>;
  regenerate: UseChatHelpers<ChatMessage>["regenerate"];
}) {
  const [, copyToClipboard] = useCopyToClipboard();

  // Always return actions unless there's a specific reason not to
  // if (isLoading) return null;

  if (message.role === "user")
    return (
      <TooltipProvider delayDuration={0}>
        <div className="flex flex-row gap-2 opacity-100 transition-opacity duration-150 justify-end">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                className="p-2 rounded-md h-fit text-muted-foreground size-8"
                variant="ghost"
                size="icon"
                onClick={async () => {
                  const textFromParts = message.parts
                    ?.filter((part) => part.type === "text")
                    .map((part) => part.text)
                    .join("\n")
                    .trim();

                  if (!textFromParts) {
                    toast.error("There's no text to copy!");
                    return;
                  }

                  await copyToClipboard(textFromParts);
                  toast.success("Copied to clipboard!");
                }}
              >
                <Copy />
              </Button>
            </TooltipTrigger>
            <TooltipContent align="end" side="bottom">
              Copy
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                data-testid="message-edit-button"
                className="p-2 rounded-md h-fit text-muted-foreground size-8"
                variant="ghost"
                size="icon"
                onClick={() => {
                  setMode("edit");
                }}
              >
                <Pencil />
              </Button>
            </TooltipTrigger>
            <TooltipContent align="end" side="bottom">
              Edit
            </TooltipContent>
          </Tooltip>
        </div>
      </TooltipProvider>
    );

  return (
    <div className="flex flex-row gap-2 items-center opacity-100 transition-opacity duration-200 mt-1">
      <TooltipProvider delayDuration={0}>
        <div className="flex flex-row gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                className="p-1 px-[5px] rounded-md h-fit text-muted-foreground hover:text-foreground transition-colors"
                variant="ghost"
                size="icon"
                onClick={async () => {
                  const textFromParts = message.parts
                    ?.filter((part) => part.type === "text")
                    .map((part) => part.text)
                    .join("\n")
                    .trim();

                  if (!textFromParts) {
                    toast.error("There's no text to copy!");
                    return;
                  }

                  await copyToClipboard(textFromParts);
                  toast.success("Copied to clipboard!");
                }}
              >
                <Copy className="size-[18px]" />
              </Button>
            </TooltipTrigger>
            <TooltipContent align="start" side="bottom">
              Copy
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                className="p-1 px-[5px] rounded-md h-fit text-muted-foreground hover:text-foreground transition-colors disabled:opacity-30"
                variant="ghost"
                size="icon"
                disabled={isLoading}
                onClick={() => regenerate({ messageId: message.id })}
              >
                <RefreshCcw className="size-[18px]" />
              </Button>
            </TooltipTrigger>
            <TooltipContent align="start" side="bottom">
              Regenerate
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                className="p-1 px-[5px] rounded-md h-fit text-muted-foreground hover:text-foreground transition-colors"
                variant="ghost"
                size="icon"
              >
                <ThumbsUp className="size-[18px]" />
              </Button>
            </TooltipTrigger>
            <TooltipContent align="start" side="bottom">
              Good response
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                className="p-1 px-[5px] rounded-md h-fit text-muted-foreground hover:text-foreground transition-colors"
                variant="ghost"
                size="icon"
              >
                <ThumbsDown className="size-[18px]" />
              </Button>
            </TooltipTrigger>
            <TooltipContent align="start" side="bottom">
              Bad response
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                className="p-1 px-[5px] rounded-md h-fit text-muted-foreground hover:text-foreground transition-colors"
                variant="ghost"
                size="icon"
              >
                <Forward className="size-[18px]" />
              </Button>
            </TooltipTrigger>
            <TooltipContent align="start" side="bottom">
              Share
            </TooltipContent>
          </Tooltip>
        </div>
      </TooltipProvider>
      {message.metadata?.model && (
        <span className="text-[10px] items-center gap-1 font-medium text-muted-foreground/60 uppercase tracking-wider ml-1 hidden sm:flex">
          {message.metadata.model.name}
        </span>
      )}
    </div>
  );
}

export const MessageActions = memo(
  PureMessageActions,
  (prevProps, nextProps) => {
    if (prevProps.isLoading !== nextProps.isLoading) return false;

    return true;
  },
);
