"use client";

import { Check } from "@/types";
import { StatusDot } from "./ui/StatusDot";

interface CheckItemProps {
  check: Check;
  onClick?: () => void;
  compact?: boolean;
  active?: boolean;
}

export function CheckItem({
  check,
  onClick,
  compact = false,
  active = false,
}: CheckItemProps) {
  if (compact) {
    return (
      <div
        className={`
          flex items-start gap-3 p-3 cursor-pointer transition-colors font-mono
          ${active ? "bg-bg-tertiary border border-border-bright" : "hover:bg-bg-tertiary"}
        `}
        onClick={onClick}
      >
        <StatusDot status={check.status} size="sm" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm text-text-primary truncate">
              {check.name}
            </span>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs text-text-tertiary bg-bg-secondary px-1.5 py-0.5">
              {check.standard}
            </span>
          </div>
          {check.status !== "pass" && (
            <p className="text-xs text-text-secondary mt-1 truncate">
              {check.message}
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      className={`
        bg-bg-secondary border border-border p-4 font-mono
        flex items-start gap-4 cursor-pointer transition-all
        shadow-[4px_4px_0px_0px_rgba(42,42,42,1)]
        hover:border-border-bright hover:shadow-[6px_6px_0px_0px_rgba(58,58,58,1)]
        hover:translate-x-[-2px] hover:translate-y-[-2px]
      `}
      onClick={onClick}
    >
      <StatusDot status={check.status} size="md" />
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <span className="text-text-primary">{check.name}</span>
          <span className="text-text-tertiary text-xs">→</span>
        </div>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-xs text-text-tertiary bg-bg-tertiary px-2 py-0.5">
            {check.standard}
          </span>
        </div>
        {check.status !== "pass" && (
          <p className="text-sm text-text-secondary mt-2">{check.message}</p>
        )}
      </div>
    </div>
  );
}
