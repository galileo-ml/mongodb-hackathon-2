"use client";

import { useRouter } from "next/navigation";
import { Document } from "@/types";
import { Card } from "./ui/Card";
import { StatusBar } from "./ui/StatusBar";

interface DocumentCardProps {
  document: Document;
}

export function DocumentCard({ document }: DocumentCardProps) {
  const router = useRouter();
  const { summary } = document;
  const hasIssues = summary.failed > 0 || summary.warnings > 0;
  const totalIssues = summary.failed + summary.warnings;

  return (
    <Card
      hoverable
      onClick={() => router.push(`/documents/${document.id}`)}
      className="flex flex-col gap-3 font-mono"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-lg flex-shrink-0">📄</span>
          <span className="text-text-primary">
            {document.filename}
          </span>
        </div>
        <span className="text-text-tertiary text-xs flex-shrink-0">→</span>
      </div>

      <div className="text-text-secondary text-xs">
        {document.uploadedAt} • {document.fileSize}
      </div>

      <div className="flex items-center gap-2">
        <StatusBar
          passed={summary.passed}
          warnings={summary.warnings}
          failed={summary.failed}
        />
      </div>

      <div className="flex items-center justify-between">
        <div className="text-xs text-text-secondary">
          <span className="text-accent-green">{summary.passed}</span>
          <span className="text-text-tertiary"> / </span>
          <span className="text-accent-yellow">{summary.warnings}</span>
          <span className="text-text-tertiary"> / </span>
          <span className="text-accent-red">{summary.failed}</span>
        </div>

        <div className="text-xs">
          {hasIssues ? (
            <span className="text-accent-yellow">
              ⚠ {totalIssues} issue{totalIssues > 1 ? "s" : ""}
            </span>
          ) : (
            <span className="text-accent-green">✓ All checks passed</span>
          )}
        </div>
      </div>
    </Card>
  );
}
