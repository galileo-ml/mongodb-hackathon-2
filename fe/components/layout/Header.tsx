"use client";

import Link from "next/link";

export function Header() {
  return (
    <header className="border-b border-border">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <span className="text-xl">⚡</span>
          <span className="font-mono text-text-primary font-medium">
            Pacific Gas & Compliance
          </span>
        </Link>
      </div>
    </header>
  );
}
