# Energy Drawing Analyzer - Frontend Implementation Plan

## Overview

A web UI for uploading energy project drawings and viewing compliance check results. Terminal-inspired aesthetic (dark theme, monospace, ASCII elements). Backend API assumed to exist - using mock data for now.

---

## Tech Stack

```
┌─────────────────────────────────────┐
│  FRONTEND                           │
├─────────────────────────────────────┤
│  Next.js 14 (App Router)            │
│  TypeScript                         │
│  Tailwind CSS                       │
│  Framer Motion (subtle animations)  │
└─────────────────────────────────────┘
```

---

## Design System

### Colors
```
--bg-primary:      #0a0a0a    (near black)
--bg-secondary:    #141414    (card backgrounds)
--bg-tertiary:     #1f1f1f    (hover states)
--border:          #2a2a2a    (subtle borders)
--border-bright:   #3a3a3a    (emphasized borders)

--text-primary:    #e5e5e5    (main text)
--text-secondary:  #737373    (muted text)
--text-tertiary:   #525252    (very muted)

--accent-orange:   #f97316    (primary accent)
--accent-green:    #22c55e    (pass)
--accent-yellow:   #eab308    (warning)
--accent-red:      #ef4444    (fail)
```

### Typography
```
--font-mono:       'JetBrains Mono', 'Fira Code', monospace
--font-sans:       'Inter', system-ui, sans-serif

Body:              font-sans, 14px
Code/Data:         font-mono, 13px
Headings:          font-sans, medium weight
ASCII elements:    font-mono
```

### Component Patterns
```
┌─ Cards ───────────────────────────────────────┐
│  • 1px solid border (#2a2a2a)                 │
│  • No shadows                                 │
│  • Subtle hover: border brightens             │
└───────────────────────────────────────────────┘

┌─ Buttons ─────────────────────────────────────┐
│  Primary:   bg-orange, text-black, mono font  │
│  Secondary: border only, text-gray            │
└───────────────────────────────────────────────┘

┌─ Status Indicators ───────────────────────────┐
│  Pass:     ● green    solid circle            │
│  Warning:  ◐ yellow   half circle             │
│  Fail:     ○ red      empty circle            │
│  Bar:      ●●●●●●◐◐○  (visual summary)        │
└───────────────────────────────────────────────┘
```

---

## Pages

```
/                       Landing (upload + recent documents)
/documents/:id          Document summary (all checks)
/documents/:id/review   Check detail (drawing + scrollable check list)
```

---

## Mock Data Structure

```typescript
interface Document {
  id: string
  filename: string
  uploadedAt: string
  fileSize: string
  status: 'analyzing' | 'complete'
  summary: {
    passed: number
    warnings: number
    failed: number
  }
  checks: Check[]
}

interface Check {
  id: string
  name: string
  status: 'pass' | 'warning' | 'fail'
  standard: string        // e.g., "NFPA 70E §130.7"
  message: string         // Brief finding
  location?: {
    sheet: number
    region: string        // e.g., "XFMR-1"
  }
}
```

---

## Implementation Phases

### Phase 1: Setup & Design System
```
[ ] Next.js project with TypeScript + Tailwind
[ ] Google Fonts (Inter + JetBrains Mono)
[ ] Tailwind config (colors, fonts)
[ ] Global styles (dark theme base)
[ ] Layout component (header, container)
```

### Phase 2: Landing Page
```
[ ] Upload zone (drag & drop area, styled)
[ ] Recent documents grid
[ ] Document card component
  [ ] Filename, date, size
  [ ] Status bar (●●●●◐◐○)
  [ ] Pass/warn/fail counts
  [ ] Click to navigate
[ ] Mock data for 4-5 sample documents
```

### Phase 3: Document Summary Page
```
[ ] Back navigation
[ ] Document header (filename, metadata)
[ ] Summary stats (3 boxes: passed/warnings/failed)
[ ] Filter dropdown (All / Failed / Warnings / Passed)
[ ] Check list
  [ ] Status indicator (●/◐/○)
  [ ] Check name
  [ ] Standard reference (monospace badge)
  [ ] Message
  [ ] Click to navigate to detail
```

### Phase 4: Check Detail Page
```
[ ] Two-panel layout (responsive)
[ ] Left panel: Drawing viewer
  [ ] Placeholder/mock image for now
  [ ] Sheet tabs
  [ ] Zoom controls
  [ ] Highlight markers for issues
[ ] Right panel: Scrollable check list
  [ ] Compact check items
  [ ] Active state when selected
  [ ] Clicking highlights on drawing
[ ] Navigation (prev/next check)
```

### Phase 5: Polish
```
[ ] Loading skeletons
[ ] Hover/active states
[ ] Subtle transitions (framer-motion)
[ ] Empty states
[ ] Mobile responsiveness
```

---

## File Structure

```
├── app/
│   ├── layout.tsx              # Root layout, fonts, theme
│   ├── page.tsx                # Landing page
│   └── documents/
│       └── [id]/
│           ├── page.tsx        # Summary page
│           └── review/
│               └── page.tsx    # Detail page
├── components/
│   ├── Layout/
│   │   └── Header.tsx
│   ├── ui/
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── StatusDot.tsx
│   │   └── StatusBar.tsx
│   ├── UploadZone.tsx
│   ├── DocumentCard.tsx
│   ├── CheckList.tsx
│   ├── CheckItem.tsx
│   └── DrawingViewer.tsx
├── lib/
│   └── mockData.ts             # Mock documents & checks
├── types/
│   └── index.ts                # TypeScript interfaces
└── styles/
    └── globals.css
```

---

## Mock Data Examples

```typescript
// lib/mockData.ts

export const documents: Document[] = [
  {
    id: '1',
    filename: 'transformer_layout_v3.pdf',
    uploadedAt: '2026-01-10',
    fileSize: '2.4 MB',
    status: 'complete',
    summary: { passed: 12, warnings: 3, failed: 2 },
    checks: [
      {
        id: 'c1',
        name: 'Safety Distance Compliance',
        status: 'fail',
        standard: 'NFPA 70E §130.7',
        message: 'Transformer clearance not specified',
        location: { sheet: 2, region: 'XFMR-1' }
      },
      {
        id: 'c2',
        name: 'Emergency Disconnect Labeling',
        status: 'fail',
        standard: 'NEC 408.4',
        message: 'Missing disconnect location callout',
        location: { sheet: 1, region: 'Panel A' }
      },
      // ... more checks
    ]
  },
  // ... more documents
]
```

---

## ASCII/Terminal UI Elements

```tsx
// Status bar using unicode
function StatusBar({ passed, warnings, failed }) {
  return (
    <span className="font-mono text-sm tracking-tight">
      {'●'.repeat(passed)}
      {'◐'.repeat(warnings)}
      {'○'.repeat(failed)}
    </span>
  )
}

// Monospace badge for standards
<span className="font-mono text-xs bg-zinc-800 px-2 py-0.5 rounded">
  NEC 310.16
</span>

// Subtle border styling
<div className="border border-zinc-800 hover:border-zinc-700 transition-colors">
```

---

## Quick Start

```bash
npx create-next-app@latest . --typescript --tailwind --app --src-dir=false
npm install framer-motion
```
