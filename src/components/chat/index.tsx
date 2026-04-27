"use client";

import ChatInput from "./input";
import { Messages } from "./messages";
import { ChatMessage, type CustomUIDataTypes } from "~/types";
import { Model } from "~/lib/ai/models";
import { useChat } from "@ai-sdk/react";
import type { Session } from "next-auth";
import { DefaultChatTransport, type DataUIPart } from "ai";
import { useRef, useEffect, useState } from "react";
import { Conversation, ScrollAnchor } from "../ai-elements/conversation";
import { useSearchParams } from "next/navigation";
import { useDataStream } from "./data-stream/provider";
import { useAutoResume } from "~/hooks/use-auto-resume";
import { fetchWithErrorHandlers, generateUUID } from "~/lib/utils";

interface ChatProps {
  id: string;
  session: Session;
  autoResume: boolean;
  selectedModel: Model;
  initialMessages?: ChatMessage[];
}

const Chat = ({
  id,
  session,
  autoResume,
  selectedModel: initialSelectedModel,
  initialMessages = [],
}: ChatProps) => {
  const { setDataStream } = useDataStream();
  const [selectedModel, setSelectedModel] =
    useState<Model>(initialSelectedModel);

  const {
    messages,
    status,
    regenerate,
    setMessages,
    stop,
    sendMessage,
    resumeStream,
    error,
  } = useChat<ChatMessage>({
    id,
    generateId: generateUUID,
    messages: initialMessages,
    experimental_throttle: 20,
    transport: new DefaultChatTransport({
      api: "/api/chat",
      fetch: fetchWithErrorHandlers,
      prepareSendMessagesRequest({ messages, id, body }) {
        return {
          body: {
            ...body,
            id,
            messages,
            model: selectedModel,
          },
        };
      },
    }),
    onData: (dataPart) => {
      setDataStream((ds) =>
        ds ? [...ds, dataPart as DataUIPart<CustomUIDataTypes>] : [],
      );
    },
  });

  const searchParams = useSearchParams();
  const query = searchParams.get("q");

  const hasAppendedQueryRef = useRef(false);

  useEffect(() => {
    if (query && !hasAppendedQueryRef.current) {
      hasAppendedQueryRef.current = true;
      sendMessage({
        role: "user" as const,
        parts: [{ type: "text", text: query }],
      });
      window.history.replaceState({}, "", `/chat/${id}`);
    }
  }, [query, sendMessage, id]);

  useAutoResume({
    setMessages,
    resumeStream,
    initialMessages,
    autoResume: autoResume || initialMessages.length > 0,
  });

  return (
    <div className="flex flex-col h-screen max-h-screen w-full min-h-0 relative overflow-hidden bg-background">
      <div className="flex-1 min-h-0 relative overflow-hidden flex flex-col">
        <Conversation className="h-full w-full overflow-y-auto">
          <Messages
            chatId={id}
            error={error}
            status={status}
            session={session}
            messages={messages}
            regenerate={regenerate}
            setMessages={setMessages}
          />
          <ScrollAnchor />
        </Conversation>
      </div>

      <div className="shrink-0 w-full p-4 md:px-0 bg-background z-10 border-t border-border/5">
        <div className="mx-auto w-full max-w-3xl pb-2">
          <ChatInput
            id={id}
            stop={stop}
            status={status}
            session={session}
            sendMessage={sendMessage}
            selectedModel={selectedModel}
            onModelChange={setSelectedModel}
          />
        </div>
      </div>
    </div>
  );
};


export default Chat;
