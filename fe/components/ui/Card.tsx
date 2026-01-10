"use client";

import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  hoverable?: boolean;
  onClick?: () => void;
}

export function Card({
  children,
  className = "",
  hoverable = false,
  onClick,
}: CardProps) {
  const baseClasses =
    "bg-bg-secondary border border-border p-4 shadow-[4px_4px_0px_0px_rgba(42,42,42,1)]";
  const hoverClasses = hoverable
    ? "cursor-pointer transition-all hover:border-border-bright hover:shadow-[6px_6px_0px_0px_rgba(58,58,58,1)] hover:translate-x-[-2px] hover:translate-y-[-2px]"
    : "";

  return (
    <div
      className={`${baseClasses} ${hoverClasses} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
