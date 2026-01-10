"use client";

import { useState } from "react";
import { Check, CheckStatus } from "@/types";
import { CheckItem } from "./CheckItem";

interface CheckListProps {
  checks: Check[];
  onCheckClick?: (check: Check) => void;
  compact?: boolean;
  activeCheckId?: string;
}

type FilterType = "all" | CheckStatus;

export function CheckList({
  checks,
  onCheckClick,
  compact = false,
  activeCheckId,
}: CheckListProps) {
  const [filter, setFilter] = useState<FilterType>("all");

  const filteredChecks = checks
    .filter((check) => filter === "all" || check.status === filter)
    .sort((a, b) => {
      const order: Record<CheckStatus, number> = { fail: 0, warning: 1, pass: 2 };
      return order[a.status] - order[b.status];
    });

  const filterOptions: { value: FilterType; label: string }[] = [
    { value: "all", label: "All" },
    { value: "fail", label: "Failed" },
    { value: "warning", label: "Warnings" },
    { value: "pass", label: "Passed" },
  ];

  return (
    <div className="flex flex-col h-full">
      {/* Filter */}
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xs text-text-secondary font-mono">Filter:</span>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as FilterType)}
          className="bg-bg-secondary border border-border rounded px-2 py-1 text-sm text-text-primary font-mono focus:outline-none focus:border-border-bright"
        >
          {filterOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Check List */}
      <div className="flex flex-col gap-2 overflow-y-auto flex-1">
        {filteredChecks.map((check) => (
          <CheckItem
            key={check.id}
            check={check}
            onClick={() => onCheckClick?.(check)}
            compact={compact}
            active={check.id === activeCheckId}
          />
        ))}
      </div>
    </div>
  );
}
