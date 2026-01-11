"use client";

import { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { CheckItem } from "@/components/CheckItem";
import { Check, CheckStatus, Document } from "@/types";

type FilterType = "all" | CheckStatus;

const STORAGE_KEY = "nec-compliance-documents";

function getDocumentById(id: string): Document | undefined {
  if (typeof window === "undefined") return undefined;
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return undefined;
  try {
    const documents: Document[] = JSON.parse(stored);
    return documents.find((doc) => doc.id === id);
  } catch {
    return undefined;
  }
}

export default function DocumentSummary({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [document, setDocument] = useState<Document | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterType>("all");

  useEffect(() => {
    const doc = getDocumentById(id);
    setDocument(doc || null);
    setLoading(false);
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-primary">
        <Header />
        <main className="max-w-6xl mx-auto px-6 py-8">
          <p className="text-text-secondary font-mono">Loading...</p>
        </main>
      </div>
    );
  }

  if (!document) {
    return (
      <div className="min-h-screen bg-bg-primary">
        <Header />
        <main className="max-w-6xl mx-auto px-6 py-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-text-secondary hover:text-text-primary text-sm font-mono mb-6 transition-colors"
          >
            ← Back to Uploads
          </Link>
          <p className="text-text-secondary font-mono">Document not found</p>
        </main>
      </div>
    );
  }

  const { summary, checks } = document;

  const filteredChecks = checks
    .filter((check) => filter === "all" || check.status === filter)
    .sort((a, b) => {
      const order: Record<CheckStatus, number> = { fail: 0, warning: 1, pass: 2, not_applicable: 3 };
      return order[a.status] - order[b.status];
    });

  const handleCheckClick = (check: Check) => {
    router.push(`/documents/${id}/review?check=${check.id}`);
  };

  const filterOptions: { value: FilterType; label: string; count: number }[] = [
    { value: "all", label: "All", count: checks.length },
    { value: "fail", label: "Failed", count: summary.failed },
    { value: "warning", label: "Warnings", count: summary.warnings },
    { value: "pass", label: "Passed", count: summary.passed },
  ];

  // Add not_applicable filter if there are any
  if (summary.not_applicable && summary.not_applicable > 0) {
    filterOptions.push({ value: "not_applicable", label: "N/A", count: summary.not_applicable });
  }

  return (
    <div className="min-h-screen bg-bg-primary">
      <Header />

      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* Back Link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-text-secondary hover:text-text-primary text-sm font-mono mb-6 transition-colors"
        >
          ← Back to Uploads
        </Link>

        {/* Document Header */}
        <div className="bg-bg-secondary border border-border p-4 mb-6 font-mono shadow-[4px_4px_0px_0px_rgba(42,42,42,1)]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-xl">📄</span>
              <div>
                <h1 className="text-lg text-text-primary">
                  {document.filename}
                </h1>
                <p className="text-xs text-text-secondary">
                  Uploaded {document.uploadedAt} • {document.fileSize}
                  {document.system_type && ` • ${document.system_type}`}
                </p>
              </div>
            </div>
            {summary.compliance_score !== undefined && (
              <div className="text-right">
                <div className="text-2xl text-text-primary">
                  {summary.compliance_score.toFixed(0)}%
                </div>
                <div className="text-xs text-text-secondary">Compliance</div>
              </div>
            )}
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-bg-secondary border border-border p-4 text-center font-mono shadow-[4px_4px_0px_0px_rgba(42,42,42,1)]">
            <div className="text-3xl text-accent-green">
              {summary.passed}
            </div>
            <div className="text-sm text-text-secondary mt-1">PASSED</div>
          </div>
          <div className="bg-bg-secondary border border-border p-4 text-center font-mono shadow-[4px_4px_0px_0px_rgba(42,42,42,1)]">
            <div className="text-3xl text-accent-yellow">
              {summary.warnings}
            </div>
            <div className="text-sm text-text-secondary mt-1">WARNINGS</div>
          </div>
          <div className="bg-bg-secondary border border-border p-4 text-center font-mono shadow-[4px_4px_0px_0px_rgba(42,42,42,1)]">
            <div className="text-3xl text-accent-red">
              {summary.failed}
            </div>
            <div className="text-sm text-text-secondary mt-1">FAILED</div>
          </div>
        </div>

        {/* Diagram Description */}
        {document.diagram_description && (
          <div className="bg-bg-secondary border border-border p-4 mb-6 font-mono shadow-[4px_4px_0px_0px_rgba(42,42,42,1)]">
            <h2 className="text-sm text-text-secondary mb-2">AI Description</h2>
            <p className="text-sm text-text-primary whitespace-pre-wrap">
              {document.diagram_description.replace(/SYSTEM_TYPE:.*$/m, "").trim()}
            </p>
          </div>
        )}

        {/* Filter */}
        <div className="flex items-center gap-2 mb-4 font-mono">
          <span className="text-sm text-text-secondary">Filter:</span>
          <div className="flex gap-2 flex-wrap">
            {filterOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setFilter(option.value)}
                className={`
                  px-3 py-1 text-sm transition-colors
                  ${
                    filter === option.value
                      ? "bg-bg-tertiary text-text-primary border border-border-bright"
                      : "text-text-secondary hover:text-text-primary"
                  }
                `}
              >
                {option.label}
                <span className="ml-1 opacity-50">{option.count}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Checks */}
        <div className="flex flex-col gap-3">
          {filteredChecks.map((check) => (
            <CheckItem
              key={check.id}
              check={check}
              onClick={() => handleCheckClick(check)}
            />
          ))}
        </div>
      </main>
    </div>
  );
}
