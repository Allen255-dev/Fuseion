"use client";

import cx from "classnames";
import { cn } from "~/lib/utils";
import { TextPart } from "./text";
import equal from "fast-deep-equal";
import { ChatMessage } from "~/types";
import { memo, useState } from "react";
import { MessageEditor } from "./editor";
import { MessageActions as MessageActionsComponent } from "./actions";
import {
  Message,
  MessageContent,
  MessageActions,
} from "../../ai-elements/message";
import { MessageResponse } from "../../ai-elements/response";
import { Reasoning } from "../../ai-elements/reasoning";
import type { UseChatHelpers } from "@ai-sdk/react";
import { AnimatePresence, motion } from "framer-motion";
import { PreviewAttachment } from "./attachment-preview";
import { CitationLinks, extractCitations } from "../citations";
import { Lightbulb, Search } from "lucide-react";

type FileUIPart = any; // Simplify for now to avoid SDK version conflicts

const PurePreviewMessage = ({
  message,
  isLoading,
  regenerate,
  setMessages,
  requiresScrollPadding,
}: {
  isLoading: boolean;
  message: ChatMessage;
  requiresScrollPadding: boolean;
  setMessages: UseChatHelpers<ChatMessage>["setMessages"];
  regenerate: UseChatHelpers<ChatMessage>["regenerate"];
}) => {
  const [mode, setMode] = useState<"view" | "edit">("view");

  const messageFiles = (message.parts ?? []).filter(
    (part): part is any =>
      (part as any).type === "file" || (part as any).type === "image",
  );

  let allWebPages: any[] = [];
  if (message.toolInvocations) {
    message.toolInvocations.forEach((result: any) => {
      if (
        result.toolName === "internetSearch" &&
        Array.isArray(result.result)
      ) {
        allWebPages = [...allWebPages, ...result.result];
      }
    });
  }

  return (
    <Message from={message.role}>
      <MessageContent>
        {messageFiles.length > 0 && (
          <div
            data-testid={`message-attachments`}
            className="flex flex-row gap-2 flex-wrap mb-2"
          >
            {messageFiles.map((filePart: any, idx: number) => (
              <PreviewAttachment
                key={filePart.url || idx}
                attachment={{
                  type: "file",
                  filename: filePart.name,
                  url: filePart.url,
                  mediaType: filePart.mimeType,
                }}
              />
            ))}
          </div>
        )}

        {allWebPages.length > 0 && (
          <Reasoning
            title={
              <div className="flex items-center gap-1.5 text-muted-foreground font-semibold">
                <Search className="size-3.5 text-blue-400" /> Read{" "}
                {allWebPages.length} web pages
              </div>
            }
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
              {allWebPages.map((page: any) => (
                <a
                  key={page.id}
                  href={page.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col p-2.5 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
                >
                  <span className="text-xs font-semibold truncate text-blue-400 mb-0.5">
                    {page.title}
                  </span>
                  <span className="text-[10px] text-muted-foreground truncate">
                    {page.url}
                  </span>
                </a>
              ))}
            </div>
          </Reasoning>
        )}

        {Array.isArray(message.parts) &&
          message.parts
            .filter((part) => part != null)
            .map((part, index) => {
              const { type } = part;
              const key = `message-${message.id}-part-${index}`;
              const partText = (part as any).text || (part as any).reasoning || "";

              if (type === "reasoning" && typeof partText === "string" && partText.trim().length > 0) {
                return (
                  <Reasoning
                    key={key}
                    isLoading={isLoading}
                    title={
                      <div className="flex items-center gap-1.5 text-muted-foreground font-semibold">
                        <Lightbulb
                          className={cn(
                            "size-3.5 text-yellow-500",
                            isLoading && "animate-pulse",
                          )}
                        />
                        {isLoading ? "Thinking Process" : "Thought Process"}
                      </div>
                    }
                  >
                    <MessageResponse>{partText}</MessageResponse>
                  </Reasoning>
                );
              }

              if (type === "text") {
                if (typeof partText !== "string" || partText.trim() === "") {
                  return null;
                }

                if (mode === "view") {
                  if (message.role === "user") {
                    return (
                      <div
                        key={key}
                        className="bg-primary text-primary-foreground px-4 py-2.5 rounded-2xl rounded-tr-none text-sm leading-relaxed whitespace-pre-wrap break-words"
                      >
                        {partText}
                      </div>
                    );
                  }
                  return (
                    <MessageResponse key={key}>{partText}</MessageResponse>
                  );
                }

                if (mode === "edit") {
                  return (
                    <div key={key} className="flex flex-row gap-2 items-start">
                      <MessageEditor
                        key={message.id}
                        message={message}
                        setMode={setMode}
                        setMessages={setMessages}
                        regenerate={regenerate}
                      />
                    </div>
                  );
                }
              }

              return null;
            })}

        {message.role === "assistant" && (
          <CitationLinks
            citations={
              extractCitations(
                message.parts
                  ?.filter((p) => p.type === "text")
                  .map((p) => p.text)
                  .join("\n") || "",
                message.toolInvocations,
              ).citations
            }
          />
        )}

        <MessageActions>
          <MessageActionsComponent
            key={`action-${message.id}`}
            setMode={setMode}
            message={message}
            isLoading={isLoading}
            regenerate={regenerate}
          />
        </MessageActions>
      </MessageContent>
    </Message>
  );
};

export const PreviewMessage = memo(
  PurePreviewMessage,
  (prevProps, nextProps) => {
    if (prevProps.isLoading !== nextProps.isLoading) return false;
    if (prevProps.message.id !== nextProps.message.id) return false;
    if (prevProps.requiresScrollPadding !== nextProps.requiresScrollPadding)
      return false;

    // During streaming, we want to always re-render to show real-time updates
    if (prevProps.isLoading || nextProps.isLoading) return false;

    if (!equal(prevProps.message.parts, nextProps.message.parts)) return false;

    return true;
  },
);

export const ThinkingMessage = () => {
  const role = "assistant";

  return (
    <motion.div
      data-testid="message-assistant-loading"
      className="w-full mx-auto max-w-3xl px-4 group/message min-h-24"
      initial={{ y: 5, opacity: 0 }}
      animate={{ y: 0, opacity: 1, transition: { delay: 1 } }}
      data-role={role}
    >
      <div
        className={cx(
          "flex gap-4 group-data-[role=user]/message:px-3 w-full group-data-[role=user]/message:w-fit group-data-[role=user]/message:ml-auto group-data-[role=user]/message:max-w-[75%] group-data-[role=user]/message:py-2 rounded-xl",
          {
            "group-data-[role=user]/message:bg-muted": true,
          },
        )}
      >
        <div className="flex gap-1 items-center">
          <div className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce"></div>
          <div
            className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce"
            style={{ animationDelay: "0.1s" }}
          ></div>
          <div
            className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce"
            style={{ animationDelay: "0.2s" }}
          ></div>
        </div>
      </div>
    </motion.div>
  );
};
