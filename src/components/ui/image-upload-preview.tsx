"use client";

/* eslint-disable @next/next/no-img-element */
import { useState, ChangeEvent } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface ImageUploadPreviewProps {
  name: string;
  label: string;
  currentImageUrl?: string | null;
  error?: string | string[];
  imageClassName?: string;
  containerClassName?: string;
}

export function ImageUploadPreview({
  name,
  label,
  currentImageUrl,
  error,
  imageClassName,
  containerClassName,
}: ImageUploadPreviewProps) {
  const [preview, setPreview] = useState<string>("");

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setPreview("");
    }
  };

  return (
    <div className={cn("grid gap-2", containerClassName)}>
      <Label htmlFor={name}>{label}</Label>
      <div className="flex items-center gap-4">
        <Input
          id={name}
          name={name}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
        />
        {preview ? (
          <img
            src={preview}
            alt="Preview"
            className={cn("h-10 w-10 object-cover border", imageClassName)}
          />
        ) : currentImageUrl ? (
          <img
            src={currentImageUrl}
            alt="Current"
            className={cn("h-10 w-10 object-cover border", imageClassName)}
          />
        ) : null}
      </div>
      {error && (
        <p className="text-sm text-destructive">
          {Array.isArray(error) ? error[0] : error}
        </p>
      )}
    </div>
  );
}
