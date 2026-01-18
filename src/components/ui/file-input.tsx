/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import { Upload } from "lucide-react";

interface FileInputProps extends React.HTMLProps<HTMLInputElement> {
  name: string;
  required?: boolean;
  onFileChange: (file: File) => void;
  fileName?: string;
  preview?: string;
}

const FileInput: React.FC<FileInputProps> = ({
  name,
  required = false,
  onFileChange,
  fileName,
  preview,
}) => {
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) onFileChange(file);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onFileChange(file);
  };

  return (
    <div className="flex flex-col gap-2">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-lg transition-all duration-200 cursor-pointer ${
          isDragging
            ? "border-primary bg-primary/10"
            : "border-primary/30 hover:border-primary/50 bg-bg-sec"
        }`}
      >
        <input
          type="file"
          id={name}
          name={name}
          required={required}
          accept="image/*"
          onChange={handleChange}
          className="absolute inset-0 w-full max-h-40 opacity-0 cursor-pointer"
        />
        {preview ? (
          <div className="p-4">
            <img
              src={preview}
              alt="Preview"
              className="w-full h-46 object-cover rounded-lg"
            />
            <p className="text-center mt-3 text-text text-sm">{fileName}</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3 p-8 pointer-events-none">
            <div className="p-4 rounded-full bg-bg">
              <Upload className="w-6 h-6 text-primary" />
            </div>
            <div className="text-center">
              <p className="font-medium text-text">
                {fileName || "Drop your image here or click to browse"}
              </p>
              <p className="text-sm mt-1 text-text/60">
                PNG, JPG, GIF up to 10MB
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileInput;
