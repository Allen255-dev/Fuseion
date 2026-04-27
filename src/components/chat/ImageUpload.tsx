"use client";

import { useState, useRef, useEffect } from "react";
import { Camera, X } from "lucide-react";

interface ImageUploadProps {
  onImageSelect: (imageData: {
    base64: string;
    mimeType: string;
    name: string;
    preview: string;
    file: File;
  }) => void;
  onImageRemove: () => void;
  selectedImage: { preview: string; name: string } | null;
  isLoading: boolean;
}

export function ImageUpload({
  onImageSelect,
  onImageRemove,
  selectedImage,
  isLoading,
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processImage = async (file: File) => {
    // Validate file type
    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file (JPEG, PNG, WEBP, GIF)");
      return;
    }

    // Validate file size (max 5MB for fast processing)
    if (file.size > 5 * 1024 * 1024) {
      alert("Image must be less than 5MB");
      return;
    }

    setIsUploading(true);

    try {
      const preview = URL.createObjectURL(file);
      const reader = new FileReader();

      reader.onloadend = () => {
        const base64 = reader.result as string;
        onImageSelect({
          base64: base64.split(",")[1], // Remove data:image/xxx;base64, prefix
          mimeType: file.type,
          name: file.name,
          preview: preview,
          file: file,
        });
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error("Error processing image:", error);
      alert("Failed to process image");
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      processImage(file);
    }
    // Reset input so same file can be selected again
    event.target.value = "";
  };

  const handlePaste = (event: ClipboardEvent) => {
    // Only handle paste if the focus is on a textarea or input, or if it's a general paste
    const items = event.clipboardData?.items;
    if (items) {
      for (const item of items) {
        if (item.type.startsWith("image/")) {
          const file = item.getAsFile();
          if (file) {
            processImage(file);
          }
          break;
        }
      }
    }
  };

  useEffect(() => {
    document.addEventListener("paste", handlePaste);
    return () => document.removeEventListener("paste", handlePaste);
  }, []);

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        onChange={handleFileSelect}
        className="hidden"
      />

      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        disabled={isUploading || isLoading}
        className="p-2 text-muted-foreground hover:text-blue-400 hover:bg-white/5 rounded-full transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        title="Upload image (or Ctrl+V to paste)"
      >
        {isUploading ? (
          <div className="h-5 w-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
        ) : (
          <Camera className="h-5 w-5" />
        )}
      </button>
    </>
  );
}
