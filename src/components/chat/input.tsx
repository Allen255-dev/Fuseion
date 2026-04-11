"use client";

import { ChatMessage } from "~/types";
import { memo, useState, useRef, useEffect } from "react";
import { Model } from "~/lib/ai/models";
import type { Session } from "next-auth";
import ModelPicker from "./model-picker";
import { ArrowUp, Square, Paperclip, X, Image as ImageIcon, File as FileIcon, Loader2, Atom } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Textarea } from "~/components/ui/textarea";
import { PromptInput } from "../ai-elements/prompt-input";
import { useMutation, useAction } from "convex/react";
import { api } from "~/convex/_generated/api";
import { cn } from "~/lib/utils";
import { toast } from "sonner";
import { type UseChatHelpers } from "@ai-sdk/react";

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
  size: number;
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



  // Handle clipboard paste
  useEffect(() => {
    const handlePaste = async (event: ClipboardEvent) => {
      const items = event.clipboardData?.items;
      if (!items) return;

      for (const item of Array.from(items)) {
        if (item.type.startsWith('image/')) {
          const file = item.getAsFile();
          if (file) {
            await uploadAndAddFile(file);
          }
          break;
        }
      }
    };

    document.addEventListener('paste', handlePaste);
    return () => document.removeEventListener('paste', handlePaste);
  }, []);

  const uploadAndAddFile = async (file: File) => {
    setIsUploading(true);
    try {
      const uploadUrl = await generateUploadUrl();
      const result = await fetch(uploadUrl, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      });

      if (!result.ok) throw new Error("Upload failed");
      const { storageId } = await result.json();
      const publicUrl = await getFileUrl({ storageId });

      if (!publicUrl) throw new Error("Could not get file URL");

      setFiles(prev => [...prev, {
        id: Math.random().toString(36).substring(7),
        name: file.name,
        type: file.type,
        url: publicUrl,
        storageId: storageId,
        size: file.size
      }]);
    } catch (error: any) {
      console.error("Failed to upload file:", error);
      toast.error(error.message || "Failed to upload file.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (!selectedFiles || selectedFiles.length === 0) return;

    for (const file of Array.from(selectedFiles)) {
      await uploadAndAddFile(file);
    }
    
    if (fileInputRef.current) fileInputRef.current.value = "";
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

      // Add files from general upload
      files.forEach(file => {
        const isImage = file.type.startsWith('image/');
        messageParts.push({
          type: isImage ? "image" : "file",
          name: file.name,
          url: file.url,
          mimeType: file.type,
          storageId: file.storageId,
          size: file.size,
          // For AI SDK recognition
          image: isImage ? file.url : undefined
        });
      });

      sendMessage({
        role: "user",
        parts: messageParts,
        metadata: {
          deepThink: isDeepThink,
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

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="w-full">
      {/* File Previews */}
      {files.length > 0 && (
        <div className="flex flex-wrap gap-3 mb-4">
          {files.map((file) => (
            <div key={file.id} className="relative group flex items-center gap-3 bg-white/5 rounded-xl p-3 pr-10 border border-white/10 min-w-[200px] max-w-[300px] animate-in fade-in slide-in-from-bottom-2">
              <div className="size-10 rounded-lg bg-blue-500/20 flex items-center justify-center flex-shrink-0 text-blue-400">
                {file.type.startsWith('image/') ? (
                  <ImageIcon className="size-5" />
                ) : (
                  <FileIcon className="size-5" />
                )}
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-medium truncate text-white">{file.name}</span>
                <span className="text-[10px] text-muted-foreground uppercase">
                  {file.type.split('/')[1] || 'FILE'} • {formatSize(file.size)}
                </span>
              </div>
              <button
                onClick={() => removeFile(file.id)}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full hover:bg-white/10 text-muted-foreground hover:text-white transition-colors"
              >
                <X className="size-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      <PromptInput
        value={inputValue}
        onChange={setInputValue}
        onSubmit={handleSend}
        onStop={stop}
        status={status}
        isUploading={isUploading}
        placeholder="Ask Fuseion anything..."
        secondaryAction={
          <>
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
              className="size-8 rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/5 mr-1"
            >
              {isUploading ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Paperclip className="size-4" />
              )}
            </Button>
          </>
        }
      >
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

          <div className="h-4 w-px bg-white/10 mx-1" />

          <ModelPicker session={session} selectedModel={selectedModel} onModelChange={onModelChange} />
        </div>
      </PromptInput>



      <div className="mt-3 text-center text-[10px] text-muted-foreground/40 pt-2">
        Fuseion can make mistakes. Check important info.
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

