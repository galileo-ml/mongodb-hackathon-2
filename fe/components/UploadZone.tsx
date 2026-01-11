"use client";

import { useState, useCallback } from "react";

interface UploadZoneProps {
  onUpload?: (file: File) => void;
  isUploading?: boolean;
}

export function UploadZone({ onUpload, isUploading = false }: UploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (!isUploading) setIsDragging(true);
  }, [isUploading]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      if (isUploading) return;
      const file = e.dataTransfer.files[0];
      if (file && onUpload) {
        onUpload(file);
      }
    },
    [onUpload, isUploading]
  );

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (isUploading) return;
      const file = e.target.files?.[0];
      if (file && onUpload) {
        onUpload(file);
      }
    },
    [onUpload, isUploading]
  );

  return (
    <div
      className={`
        border-2 border-dashed p-12 font-mono
        flex flex-col items-center justify-center gap-4
        transition-all
        ${isUploading ? "cursor-wait opacity-75" : "cursor-pointer"}
        ${
          isDragging
            ? "border-accent-orange bg-bg-tertiary"
            : "border-border hover:border-border-bright"
        }
      `}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => !isUploading && document.getElementById("file-input")?.click()}
    >
      <input
        id="file-input"
        type="file"
        accept=".pdf,.png,.jpg,.jpeg"
        className="hidden"
        onChange={handleFileSelect}
        disabled={isUploading}
      />

      {isUploading ? (
        <>
          <div className="text-4xl animate-pulse">⚡</div>
          <div className="text-center">
            <p className="text-text-primary mb-1">
              Analyzing diagram...
            </p>
            <p className="text-text-secondary text-sm">
              This may take a moment
            </p>
          </div>
        </>
      ) : (
        <>
          <div className="text-4xl opacity-50">📄</div>
          <div className="text-center">
            <p className="text-text-primary mb-1">
              Drop files here or click to browse
            </p>
            <p className="text-text-secondary text-sm">
              PDF, PNG, JPG supported
            </p>
          </div>
        </>
      )}
    </div>
  );
}
