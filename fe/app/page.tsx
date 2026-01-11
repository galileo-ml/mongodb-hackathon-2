"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { UploadZone } from "@/components/UploadZone";
import { DocumentCard } from "@/components/DocumentCard";
import { Document, analysisToDocument } from "@/types";
import { analyzeFile, formatFileSize } from "@/lib/api";

// LocalStorage key for persisting documents
const STORAGE_KEY = "nec-compliance-documents";

export default function Home() {
  const router = useRouter();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load documents from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setDocuments(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to parse stored documents:", e);
      }
    }
  }, []);

  // Save documents to localStorage when they change
  useEffect(() => {
    if (documents.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(documents));
    }
  }, [documents]);

  const handleUpload = async (file: File) => {
    setIsUploading(true);
    setError(null);

    try {
      // Call the backend API
      const analysis = await analyzeFile(file);

      // Convert to Document format
      const doc = analysisToDocument(
        analysis,
        file.name,
        formatFileSize(file.size)
      );

      // Add to documents list (prepend)
      setDocuments((prev) => [doc, ...prev]);

      // Navigate to the document page
      router.push(`/documents/${doc.id}`);
    } catch (err) {
      console.error("Upload failed:", err);
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-primary">
      <Header />

      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* Upload Section */}
        <section className="mb-12">
          <UploadZone onUpload={handleUpload} isUploading={isUploading} />
          {error && (
            <div className="mt-4 p-4 border border-accent-red bg-bg-secondary font-mono text-sm text-accent-red">
              Error: {error}
            </div>
          )}
        </section>

        {/* Recent Uploads Section */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-medium text-text-primary font-mono">
              Recent Analyses
            </h2>
            {documents.length > 0 && (
              <button
                onClick={() => {
                  if (confirm("Clear all analyses?")) {
                    setDocuments([]);
                    localStorage.removeItem(STORAGE_KEY);
                  }
                }}
                className="text-text-secondary text-sm font-mono hover:text-accent-red transition-colors"
              >
                Clear All
              </button>
            )}
          </div>

          {documents.length === 0 ? (
            <div className="border border-border p-8 text-center font-mono text-text-secondary">
              No analyses yet. Upload a diagram to get started.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {documents.map((doc) => (
                <DocumentCard key={doc.id} document={doc} />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
