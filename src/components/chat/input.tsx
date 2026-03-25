"use client";

import { ChatMessage } from "~/types";
import { memo, useState, useRef, useEffect } from "react";
import { Model } from "~/lib/ai/models";
import type { Session } from "next-auth";
import ModelPicker from "./model-picker";
import { ArrowUp, Square, Paperclip, X, Image as ImageIcon, File as FileIcon, Loader2, Atom, Globe } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Textarea } from "~/components/ui/textarea";
import type { UseChatHelpers } from "@ai-sdk/react";
import { useMutation, useAction } from "convex/react";
import { api } from "~/convex/_generated/api";
import { cn } from "~/lib/utils";
import { toast } from "sonner";

interface ChatInputProps {
  id: string;
  session: Session;
  selectedModel: Model;
  onModelChange: (model: Model) => void;
  stop: UseChatHelpers<ChatMessage>["stop"];
  status: UseChatHelpers<ChatMessage>["status"];
  sendMessage: UseChatHelpers<ChatMessage>["sendMessage"];
}

interface UploadedFile {
  id: string;
  name: string;
  type: string;
  url: string;
  storageId: string;
}

const ChatInput = ({
  id,
  stop,
  status,
  session,
  sendMessage,
  selectedModel,
  onModelChange,
}: ChatInputProps) => {
  const [inputValue, setInputValue] = useState("");
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isDeepThink, setIsDeepThink] = useState(false);
  const [isSearch, setIsSearch] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const getFileUrl = useAction(api.files.getUrl);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [inputValue]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (!selectedFiles || selectedFiles.length === 0) return;

    setIsUploading(true);
    try {
      for (const file of Array.from(selectedFiles)) {
        // Step 1: Get upload URL
        const uploadUrl = await generateUploadUrl();

        // Step 2: POST the file to the URL
        const result = await fetch(uploadUrl, {
          method: "POST",
          headers: { "Content-Type": file.type },
          body: file,
        });

        if (!result.ok) throw new Error("Upload failed");

        const { storageId } = await result.json();

        // Step 3: Get the public URL for the storage ID
        const publicUrl = await getFileUrl({ storageId });

        if (!publicUrl) throw new Error("Could not get file URL");

        setFiles(prev => [...prev, {
          id: Math.random().toString(36).substring(7),
          name: file.name,
          type: file.type,
          url: publicUrl,
          storageId: storageId
        }]);
      }
    } catch (error: any) {
      console.error("Failed to upload file:", error);
      toast.error(error.message || "Failed to upload file. Please check your connection.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const removeFile = (fileId: string) => {
    setFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const handleSend = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (inputValue.trim() || files.length > 0) {
      window.history.replaceState({}, "", `/chat/${id}`);

      const messageParts: any[] = [
        {
          type: "text",
          text: inputValue.trim(),
        }
      ];

      files.forEach(file => {
        messageParts.push({
          type: "file",
          name: file.name,
          url: file.url,
          mimeType: file.type,
          storageId: file.storageId
        });
      });

      sendMessage({
        role: "user",
        parts: messageParts,
        metadata: {
          deepThink: isDeepThink,
          search: isSearch,
        } as any
      });

      setInputValue("");
      setFiles([]);
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto'; // Reset height
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="absolute bottom-6 left-0 right-0 z-10 w-full px-4">
      <div className="mx-auto w-full max-w-3xl">
        <div className="relative rounded-2xl bg-card/80 backdrop-blur-xl border border-white/10 shadow-2xl p-4 transition-all duration-300 focus-within:ring-1 focus-within:ring-primary/50 hover:bg-card/90">

          {/* File Previews */}
          {files.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3 pb-3 border-b border-white/5">
              {files.map((file) => (
                <div key={file.id} className="relative group flex items-center gap-2 bg-white/5 rounded-lg p-2 pr-8 border border-white/10">
                  {file.type.startsWith('image/') ? (
                    <ImageIcon className="size-4 text-blue-400" />
                  ) : (
                    <FileIcon className="size-4 text-purple-400" />
                  )}
                  <span className="text-xs truncate max-w-[120px] font-medium">{file.name}</span>
                  <button
                    onClick={() => removeFile(file.id)}
                    className="absolute right-1 top-1/2 -translate-y-1/2 p-1 rounded-md hover:bg-white/10 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <X className="size-3" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <form onSubmit={handleSend} className="flex flex-col gap-2">
            <Textarea
              ref={textareaRef}
              autoFocus
              id="chat-input"
              name="chat-input"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask Fuseion anything..."
              className="min-h-[24px] max-h-[200px] w-full resize-none border-none bg-transparent px-0 py-2 text-base text-foreground placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:ring-offset-0 scrollbar-thin scrollbar-thumb-white/10"
              rows={1}
            />

            <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/5">
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsDeepThink(!isDeepThink)}
                  className={cn(
                    "h-8 gap-2 rounded-full px-3 text-xs font-medium transition-all duration-200 border border-white/5",
                    isDeepThink
                      ? "bg-blue-500/10 text-blue-400 border-blue-500/20 hover:bg-blue-500/20"
                      : "text-muted-foreground hover:bg-white/5"
                  )}
                >
                  <Atom className={cn("size-3.5", isDeepThink && "animate-pulse-slow")} />
                  DeepThink
                </Button>

                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsSearch(!isSearch)}
                  className={cn(
                    "h-8 gap-2 rounded-full px-3 text-xs font-medium transition-all duration-200 border border-white/5",
                    isSearch
                      ? "bg-purple-500/10 text-purple-400 border-purple-500/20 hover:bg-purple-500/20"
                      : "text-muted-foreground hover:bg-white/5"
                  )}
                >
                  <Globe className="size-3.5" />
                  Search
                </Button>

                <div className="h-4 w-px bg-white/10 mx-1" />

                <ModelPicker session={session} selectedModel={selectedModel} onModelChange={onModelChange} />
              </div>

              <div className="flex items-center justify-end gap-2">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                  multiple
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  disabled={isUploading}
                  onClick={() => fileInputRef.current?.click()}
                  className="size-8 rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/5"
                >
                  {isUploading ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <Paperclip className="size-4" />
                  )}
                </Button>

                {status === "streaming" ? (
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={stop}
                    size="icon"
                    className="size-8 rounded-full bg-red-500/10 text-red-500 hover:bg-red-500/20"
                  >
                    <Square className="size-3 fill-current" />
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    disabled={!inputValue.trim() && files.length === 0}
                    size="icon"
                    className="size-9 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-purple-900/20 hover:shadow-purple-900/40 hover:opacity-90 transition-all disabled:opacity-50 disabled:shadow-none"
                  >
                    <ArrowUp className="size-5" />
                  </Button>
                )}
              </div>
            </div>
          </form>
        </div>
        <div className="mt-3 text-center text-xs text-muted-foreground/50">
          Fuseion can make mistakes. Check important info.
        </div>
      </div>
    </div>
  );
};

export default memo(
  ChatInput,
  (prev, next) =>
    prev.id === next.id &&
    prev.status === next.status &&
    prev.session?.user?.tier === next.session?.user?.tier &&
    prev.selectedModel.id === next.selectedModel.id,
);

