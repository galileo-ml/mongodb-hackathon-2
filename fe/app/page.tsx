"use client";

import { Header } from "@/components/layout/Header";
import { UploadZone } from "@/components/UploadZone";
import { DocumentCard } from "@/components/DocumentCard";
import { documents } from "@/lib/mockData";

export default function Home() {
  const handleUpload = (file: File) => {
    console.log("Uploading file:", file.name);
    // TODO: Handle file upload
  };

  return (
    <div className="min-h-screen bg-bg-primary">
      <Header />

      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* Upload Section */}
        <section className="mb-12">
          <UploadZone onUpload={handleUpload} />
        </section>

        {/* Recent Uploads Section */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-medium text-text-primary font-mono">
              Recent Uploads
            </h2>
            <button className="text-text-secondary text-sm font-mono hover:text-text-primary transition-colors">
              View All →
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {documents.map((doc) => (
              <DocumentCard key={doc.id} document={doc} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
