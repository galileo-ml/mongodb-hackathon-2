"use client";

import { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
}

const variantClasses = {
  primary:
    "bg-accent-orange text-black font-medium hover:bg-orange-400 active:bg-orange-600",
  secondary:
    "border border-border text-text-secondary hover:border-border-bright hover:text-text-primary",
  ghost: "text-text-secondary hover:text-text-primary hover:underline",
};

const sizeClasses = {
  sm: "px-3 py-1 text-xs",
  md: "px-4 py-2 text-sm",
  lg: "px-6 py-3 text-base",
};

export function Button({
  children,
  variant = "primary",
  size = "md",
  className = "",
  onClick,
  disabled = false,
}: ButtonProps) {
  return (
    <button
      className={`
        font-mono rounded transition-colors
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${disabled ? "opacity-50 cursor-not-allowed" : ""}
        ${className}
      `}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
