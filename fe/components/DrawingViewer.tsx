"use client";

import { useState } from "react";
import { Check } from "@/types";

interface DrawingViewerProps {
  filename: string;
  fileUrl?: string;
  activeCheck?: Check;
  totalSheets?: number;
}

export function DrawingViewer({
  filename,
  fileUrl,
  activeCheck,
  totalSheets = 1,
}: DrawingViewerProps) {
  const [currentSheet, setCurrentSheet] = useState(
    activeCheck?.location?.sheet || 1
  );
  const [zoom, setZoom] = useState(100);

  const handleFit = () => {
    setZoom(100);
  };

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(300, prev + 25));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(25, prev - 25));
  };

  const scale = zoom / 100;

  return (
    <div className="flex flex-col h-full font-mono">
      {/* Drawing Area - scrollable container */}
      <div className="flex-1 bg-bg-secondary border border-border overflow-auto relative shadow-[4px_4px_0px_0px_rgba(42,42,42,1)]">
        {/* Scaled content wrapper */}
        <div
          style={{
            width: `${zoom}%`,
            height: `${zoom}%`,
            minWidth: "100%",
            minHeight: "100%",
          }}
        >
          <div
            style={{
              width: `${10000 / zoom}%`,
              height: `${10000 / zoom}%`,
              transform: `scale(${scale})`,
              transformOrigin: "top left",
            }}
          >
            {fileUrl ? (
              /* Embedded PDF */
              <iframe
                src={`${fileUrl}#toolbar=0&navpanes=0`}
                className="w-full h-full border-0"
                title={filename}
              />
            ) : (
              /* Mock Drawing */
              <div className="w-full h-full flex items-center justify-center p-8">
                <div className="w-full h-full border-2 border-dashed border-border flex flex-col items-center justify-center text-text-tertiary">
                  <pre className="text-xs leading-relaxed text-text-secondary">
                    {`
┌─────────────────────────────────────────┐
│                                         │
│    ┌─────────┐         ┌─────────┐      │
│    │         │         │         │      │
│    │ XFMR-1  │─────────│  MCC-1  │      │
│    │         │         │         │      │
│    └────┬────┘         └────┬────┘      │
│         │                   │           │
│         │    ┌─────────┐    │           │
│         └────│ Panel A │────┘           │
│              │         │                │
│              └─────────┘                │
│                                         │
│    Sheet ${currentSheet} of ${totalSheets}                          │
└─────────────────────────────────────────┘
                    `}
                  </pre>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Location Badge */}
        {activeCheck?.location && (
          <div className="absolute top-4 left-4 bg-bg-primary/90 border border-border px-2 py-1 z-10">
            <span className="text-xs text-text-secondary">
              {activeCheck.location.region}
            </span>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between mt-4">
        {/* Sheet Navigation */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-text-secondary">Sheet:</span>
          <div className="flex gap-1">
            {Array.from({ length: totalSheets }, (_, i) => i + 1).map(
              (sheet) => (
                <button
                  key={sheet}
                  onClick={() => setCurrentSheet(sheet)}
                  className={`
                    w-8 h-8 text-sm transition-colors
                    ${
                      currentSheet === sheet
                        ? "bg-bg-tertiary text-text-primary border border-border-bright"
                        : "text-text-secondary hover:text-text-primary"
                    }
                  `}
                >
                  {sheet}
                </button>
              )
            )}
          </div>
        </div>

        {/* Zoom Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleZoomOut}
            className="w-8 h-8 text-text-secondary hover:text-text-primary hover:bg-bg-tertiary transition-colors border border-border"
          >
            -
          </button>
          <span className="text-xs text-text-secondary w-12 text-center">
            {zoom}%
          </span>
          <button
            onClick={handleZoomIn}
            className="w-8 h-8 text-text-secondary hover:text-text-primary hover:bg-bg-tertiary transition-colors border border-border"
          >
            +
          </button>
          <button
            onClick={handleFit}
            className="px-3 h-8 text-xs text-text-secondary hover:text-text-primary hover:bg-bg-tertiary transition-colors border border-border"
          >
            Fit
          </button>
        </div>
      </div>
    </div>
  );
}
