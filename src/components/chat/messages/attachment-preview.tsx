import { Loader2, Image as ImageIcon, File as FileIcon } from "lucide-react";
import type { UIMessage } from "@ai-sdk/react";

type FileUIPart = any; // Use any to support both 'file' and 'image' types without SDK type conflicts

export const PreviewAttachment = ({
  attachment,
  isUploading = false,
}: {
  attachment: FileUIPart;
  isUploading?: boolean;
}) => {
  const { filename, url, mediaType, size } = attachment;

  const formatSize = (bytes: number) => {
    if (!bytes) return "";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const fileType = mediaType ? mediaType.split("/")[1]?.toUpperCase() : "FILE";

  return (
    <div
      data-testid="input-attachment-preview"
      className="relative group flex items-center gap-3 bg-white/5 rounded-xl p-3 pr-4 border border-white/10 min-w-[200px] max-w-[300px]"
    >
      <div className="size-10 rounded-lg bg-blue-500/20 flex items-center justify-center flex-shrink-0 text-blue-400">
        {mediaType?.startsWith("image") ? (
          <ImageIcon className="size-5" />
        ) : (
          <FileIcon className="size-5" />
        )}
      </div>

      <div className="flex flex-col min-w-0 pr-2">
        <span className="text-sm font-medium truncate text-white">
          {filename || "Untitled"}
        </span>
        <span className="text-[10px] text-muted-foreground uppercase leading-none mt-1">
          {fileType} {size ? `• ${formatSize(size)}` : ""}
        </span>
      </div>

      {isUploading && (
        <div
          data-testid="input-attachment-loader"
          className="animate-spin absolute right-3 top-1/2 -translate-y-1/2 text-blue-500"
        >
          <Loader2 className="size-4" />
        </div>
      )}
    </div>
  );
};
