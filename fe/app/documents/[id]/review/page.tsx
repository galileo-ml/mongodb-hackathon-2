"use client";

import { use, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { DrawingViewer } from "@/components/DrawingViewer";
import { StatusDot } from "@/components/ui/StatusDot";
import { Check, CheckStatus, Document } from "@/types";

type FilterType = "all" | CheckStatus;
type ViewMode = "list" | "detail";

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

export default function CheckDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const searchParams = useSearchParams();
  const [document, setDocument] = useState<Document | null>(null);
  const [loading, setLoading] = useState(true);

  const [filter, setFilter] = useState<FilterType>("all");
  const [activeCheckId, setActiveCheckId] = useState<string | null>(
    searchParams.get("check")
  );
  const [viewMode, setViewMode] = useState<ViewMode>("list");

  useEffect(() => {
    const doc = getDocumentById(id);
    setDocument(doc || null);
    setLoading(false);
  }, [id]);

  const checks = document?.checks || [];

  const filteredChecks = checks
    .filter((check) => filter === "all" || check.status === filter)
    .sort((a, b) => {
      const order: Record<CheckStatus, number> = { fail: 0, warning: 1, pass: 2, not_applicable: 3 };
      return order[a.status] - order[b.status];
    });

  const activeCheck = checks.find((c) => c.id === activeCheckId) || filteredChecks[0];

  useEffect(() => {
    if (!activeCheckId && filteredChecks.length > 0) {
      setActiveCheckId(filteredChecks[0].id);
    }
  }, [activeCheckId, filteredChecks]);

  if (loading) {
    return (
      <div className="h-screen bg-bg-primary">
        <Header />
        <main className="max-w-6xl mx-auto px-6 py-8">
          <p className="text-text-secondary font-mono">Loading...</p>
        </main>
      </div>
    );
  }

  if (!document) {
    return (
      <div className="h-screen bg-bg-primary">
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

  const { summary } = document;

  const handleCheckClick = (check: Check) => {
    setActiveCheckId(check.id);
  };

  const currentIndex = filteredChecks.findIndex((c) => c.id === activeCheckId);
  const prevCheck = currentIndex > 0 ? filteredChecks[currentIndex - 1] : null;
  const nextCheck =
    currentIndex < filteredChecks.length - 1
      ? filteredChecks[currentIndex + 1]
      : null;

  const getStatusLabel = (status: CheckStatus) => {
    switch (status) {
      case "fail": return "Failed";
      case "warning": return "Warning";
      case "pass": return "Passed";
      case "not_applicable": return "N/A";
    }
  };

  const getStatusColor = (status: CheckStatus) => {
    switch (status) {
      case "fail": return "text-accent-red";
      case "warning": return "text-accent-yellow";
      case "pass": return "text-accent-green";
      case "not_applicable": return "text-text-tertiary";
    }
  };

  return (
    <div className="h-screen bg-bg-primary flex flex-col font-mono overflow-hidden">
      <Header />

      {/* Sub Header */}
      <div className="border-b border-border flex-shrink-0">
        <div className="px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href={`/documents/${id}`}
              className="text-text-secondary hover:text-text-primary text-sm transition-colors"
            >
              ← Back
            </Link>
            <span className="text-text-tertiary">|</span>
            <span className="text-text-primary text-sm">
              {document.filename}
            </span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <span className="text-accent-green">{summary.passed} ●</span>
            <span className="text-text-tertiary">|</span>
            <span className="text-accent-yellow">{summary.warnings} ◐</span>
            <span className="text-text-tertiary">|</span>
            <span className="text-accent-red">{summary.failed} ○</span>
          </div>
        </div>
      </div>

      {/* Main Content - Two Panel Layout (fixed height, no page scroll) */}
      <div className="flex-1 flex min-h-0">
        {/* Left Panel - Drawing Viewer (full height) */}
        <div className="flex-1 p-6 overflow-hidden">
          <DrawingViewer
            filename={document.filename}
            fileUrl={document.fileUrl}
            activeCheck={activeCheck}
          />
        </div>

        {/* Right Panel - Check List or Detail View */}
        <div className="w-96 border-l border-border flex flex-col min-h-0">
          {viewMode === "list" ? (
            <>
              {/* Panel Header - fixed */}
              <div className="p-4 border-b border-border flex-shrink-0">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm text-text-primary">CHECKS</h2>
                  <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value as FilterType)}
                    className="bg-bg-secondary border border-border px-2 py-1 text-xs text-text-primary focus:outline-none focus:border-border-bright"
                  >
                    <option value="all">All</option>
                    <option value="fail">Failed</option>
                    <option value="warning">Warnings</option>
                    <option value="pass">Passed</option>
                    <option value="not_applicable">N/A</option>
                  </select>
                </div>
              </div>

              {/* Check List - scrollable */}
              <div className="flex-1 overflow-y-auto p-2 min-h-0">
                {filteredChecks.map((check) => (
                  <div
                    key={check.id}
                    onClick={() => handleCheckClick(check)}
                    className={`
                      p-3 cursor-pointer transition-colors mb-1
                      ${
                        check.id === activeCheckId
                          ? "bg-bg-tertiary border border-border-bright"
                          : "hover:bg-bg-secondary"
                      }
                    `}
                  >
                    <div className="flex items-start gap-2">
                      <StatusDot status={check.status} size="sm" />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm text-text-primary truncate">
                          {check.name}
                        </div>
                        <div className="text-xs text-text-tertiary mt-1">
                          {check.standard}
                        </div>
                        {check.status !== "pass" && check.status !== "not_applicable" && (
                          <p className="text-xs text-text-secondary mt-1 line-clamp-2">
                            {check.message}
                          </p>
                        )}
                        {/* View More button - only on selected check */}
                        {check.id === activeCheckId && check.description && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setViewMode("detail");
                            }}
                            className="mt-3 w-full px-3 py-2 text-xs text-text-primary bg-bg-secondary border border-border hover:border-border-bright hover:bg-bg-tertiary transition-colors text-center"
                          >
                            View More →
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Navigation Footer - fixed */}
              <div className="p-4 border-t border-border flex items-center justify-between flex-shrink-0">
                <button
                  onClick={() => prevCheck && setActiveCheckId(prevCheck.id)}
                  disabled={!prevCheck}
                  className={`
                    text-sm transition-colors
                    ${
                      prevCheck
                        ? "text-text-secondary hover:text-text-primary"
                        : "text-text-tertiary cursor-not-allowed"
                    }
                  `}
                >
                  ← Prev
                </button>
                <span className="text-xs text-text-tertiary">
                  {currentIndex + 1} / {filteredChecks.length}
                </span>
                <button
                  onClick={() => nextCheck && setActiveCheckId(nextCheck.id)}
                  disabled={!nextCheck}
                  className={`
                    text-sm transition-colors
                    ${
                      nextCheck
                        ? "text-text-secondary hover:text-text-primary"
                        : "text-text-tertiary cursor-not-allowed"
                    }
                  `}
                >
                  Next →
                </button>
              </div>
            </>
          ) : (
            <>
              {/* Detail View Header - fixed */}
              <div className="p-4 border-b border-border flex-shrink-0">
                <button
                  onClick={() => setViewMode("list")}
                  className="text-sm text-text-secondary hover:text-text-primary transition-colors"
                >
                  ← All Checks
                </button>
              </div>

              {/* Detail View Content - scrollable */}
              <div className="flex-1 overflow-y-auto p-4 min-h-0">
                {activeCheck && (
                  <div className="space-y-4">
                    {/* Status Badge */}
                    <div className="flex items-center gap-2">
                      <StatusDot status={activeCheck.status} size="sm" />
                      <span
                        className={`text-xs font-medium uppercase ${getStatusColor(activeCheck.status)}`}
                      >
                        {getStatusLabel(activeCheck.status)}
                      </span>
                    </div>

                    {/* Check Name */}
                    <h3 className="text-lg text-text-primary leading-tight">
                      {activeCheck.name}
                    </h3>

                    {/* Metadata */}
                    <div className="space-y-1 text-xs text-text-secondary">
                      <div>
                        <span className="text-text-tertiary">Standard: </span>
                        {activeCheck.standard}
                      </div>
                      {activeCheck.location && (
                        <div>
                          <span className="text-text-tertiary">Location: </span>
                          Sheet {activeCheck.location.sheet},{" "}
                          {activeCheck.location.region}
                        </div>
                      )}
                    </div>

                    {/* Divider */}
                    <div className="border-t border-border" />

                    {/* Summary Message */}
                    <div>
                      <h4 className="text-xs text-text-tertiary uppercase mb-2">
                        Summary
                      </h4>
                      <p className="text-sm text-text-secondary">
                        {activeCheck.message}
                      </p>
                    </div>

                    {/* Description */}
                    {activeCheck.description && (
                      <>
                        <div className="border-t border-border" />
                        <div>
                          <h4 className="text-xs text-text-tertiary uppercase mb-2">
                            Details
                          </h4>
                          <div className="text-sm text-text-secondary whitespace-pre-wrap leading-relaxed">
                            {activeCheck.description}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Navigation Footer - fixed */}
              <div className="p-4 border-t border-border flex items-center justify-between flex-shrink-0">
                <button
                  onClick={() => {
                    if (prevCheck) {
                      setActiveCheckId(prevCheck.id);
                    }
                  }}
                  disabled={!prevCheck}
                  className={`
                    text-sm transition-colors
                    ${
                      prevCheck
                        ? "text-text-secondary hover:text-text-primary"
                        : "text-text-tertiary cursor-not-allowed"
                    }
                  `}
                >
                  ← Prev
                </button>
                <span className="text-xs text-text-tertiary">
                  {currentIndex + 1} / {filteredChecks.length}
                </span>
                <button
                  onClick={() => {
                    if (nextCheck) {
                      setActiveCheckId(nextCheck.id);
                    }
                  }}
                  disabled={!nextCheck}
                  className={`
                    text-sm transition-colors
                    ${
                      nextCheck
                        ? "text-text-secondary hover:text-text-primary"
                        : "text-text-tertiary cursor-not-allowed"
                    }
                  `}
                >
                  Next →
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
