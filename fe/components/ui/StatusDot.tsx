"use client";

import { CheckStatus } from "@/types";

interface StatusDotProps {
  status: CheckStatus;
  size?: "sm" | "md" | "lg";
}

const statusConfig: Record<CheckStatus, { symbol: string; color: string }> = {
  pass: {
    symbol: "●",
    color: "text-accent-green",
  },
  warning: {
    symbol: "◐",
    color: "text-accent-yellow",
  },
  fail: {
    symbol: "○",
    color: "text-accent-red",
  },
  not_applicable: {
    symbol: "◌",
    color: "text-text-tertiary",
  },
};

const sizeClasses = {
  sm: "text-xs",
  md: "text-sm",
  lg: "text-base",
};

export function StatusDot({ status, size = "md" }: StatusDotProps) {
  const config = statusConfig[status] || statusConfig.pass;

  return (
    <span className={`font-mono ${config.color} ${sizeClasses[size]}`}>
      {config.symbol}
    </span>
  );
}
