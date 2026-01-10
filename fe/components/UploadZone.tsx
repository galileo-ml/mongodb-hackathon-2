"use client";

import { useState, useCallback } from "react";

interface UploadZoneProps {
  onUpload?: (file: File) => void;
}

export function UploadZone({ onUpload }: UploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file && onUpload) {
        onUpload(file);
      }
    },
    [onUpload]
  );

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file && onUpload) {
        onUpload(file);
      }
    },
    [onUpload]
  );

  return (
    <div
      className={`
        border-2 border-dashed p-12 font-mono
        flex flex-col items-center justify-center gap-4
        transition-all cursor-pointer
        ${
          isDragging
            ? "border-accent-orange bg-bg-tertiary"
            : "border-border hover:border-border-bright"
        }
      `}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => document.getElementById("file-input")?.click()}
    >
      <input
        id="file-input"
        type="file"
        accept=".pdf,.png,.jpg,.jpeg,.dwg"
        className="hidden"
        onChange={handleFileSelect}
      />

      <div className="text-4xl opacity-50">📄</div>

      <div className="text-center">
        <p className="text-text-primary mb-1">
          Drop files here or click to browse
        </p>
        <p className="text-text-secondary text-sm">
          PDF, PNG, DWG supported
        </p>
      </div>
    </div>
  );
}
