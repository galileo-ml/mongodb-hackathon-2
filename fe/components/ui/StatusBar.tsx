"use client";

interface StatusBarProps {
  passed: number;
  warnings: number;
  failed: number;
  maxDisplay?: number;
}

export function StatusBar({
  passed,
  warnings,
  failed,
  maxDisplay = 20,
}: StatusBarProps) {
  const total = passed + warnings + failed;
  const scale = total > maxDisplay ? maxDisplay / total : 1;

  const scaledPassed = Math.round(passed * scale);
  const scaledWarnings = Math.round(warnings * scale);
  const scaledFailed = Math.round(failed * scale);

  return (
    <span className="font-mono text-sm tracking-tight">
      <span className="text-accent-green">{"●".repeat(scaledPassed)}</span>
      <span className="text-accent-yellow">{"◐".repeat(scaledWarnings)}</span>
      <span className="text-accent-red">{"○".repeat(scaledFailed)}</span>
    </span>
  );
}
