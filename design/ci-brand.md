# ci-brand.md — Brand Identity & Color System

> Authoritative source for all color tokens, typography, and brand identity.
> Never use hardcoded values in components — always reference these tokens.

---

## Brand Identity

### Design Direction

The visual language combines:
- Geospatial precision aesthetics
- Institutional fintech interfaces
- Modern infrastructure dashboards
- Tactical minimalism

The interface must feel: **intelligent · tactile · engineered · deliberate · efficient**

Avoid: consumer-social styling, excessive decoration, oversized gradients, playful visual noise.

---

## Typography

### Primary Typeface

| Role | Font | Notes |
|------|------|-------|
| Primary UI | `Terrova` | All interface text, headings, labels |
| Monospace / Data | `JetBrains Mono` | All numerical/data contexts (see below) |

### Monospace Mandatory Contexts

Use `JetBrains Mono` for:
- Metrics and balances
- Timestamps
- Wallet addresses
- Coordinates / hashes
- Trading values
- Analytics tables
- Any numerical alignment context

### Typography Scale

| Token | Size | Weight | Line Height | Usage |
|-------|------|--------|-------------|-------|
| `text-hero` | 56px | 700 | 1.1 | Landing hero sections |
| `text-h1` | 40px | 700 | 1.15 | Main page headers |
| `text-h2` | 28px | 600 | 1.2 | Section headers |
| `text-h3` | 22px | 600 | 1.25 | Card titles |
| `text-body` | 16px | 400 | 1.5 | Standard content |
| `text-small` | 14px | 400 | 1.5 | Secondary / supporting content |
| `text-meta` | 11px | 600 | 1.4 | Metadata, labels — uppercase + tracked |

### Typography Rules

- Use tabular numbers everywhere alignment matters: `font-variant-numeric: tabular-nums`
- `text-meta` must be `uppercase` with `letter-spacing: 0.08em`
- Avoid oversized line spacing
- Keep headings compact — do not inflate line-height

---

## Color System

### Theme Architecture

| Mode | Status | Description |
|------|--------|-------------|
| Light | **Primary** | Technical light — default environment |
| Dark | Secondary | Deep monochrome — alternate environment |

---

### CSS Custom Properties

Paste this block into your global CSS (`src/app/globals.css`):

```css
:root {
  /* Backgrounds */
  --bg-base:           #FFFFFF;
  --bg-surface:        #F8FAFC;
  --bg-elevated:       #F1F5F9;

  /* Borders */
  --border-default:    #E2E8F0;

  /* Text */
  --text-primary:      #0F172A;
  --text-secondary:    #475569;
  --text-muted:        #94A3B8;

  /* Brand Accent */
  --brand-primary:         #10B981;
  --brand-primary-hover:   #059669;
  --brand-primary-muted:   rgba(16, 185, 129, 0.12);
  --brand-primary-glow:    rgba(16, 185, 129, 0.18);

  /* Semantic Status */
  --color-success:     #22C55E;
  --color-error:       #EF4444;
  --color-warning:     #F59E0B;
  --color-info:        #3B82F6;
}
```

---

### Token Reference Table — Light Mode

| Token | Hex / RGBA | Usage |
|-------|-----------|-------|
| `--bg-base` | `#FFFFFF` | Page background |
| `--bg-surface` | `#F8FAFC` | Card / panel background |
| `--bg-elevated` | `#F1F5F9` | Elevated layers, hover tints |
| `--border-default` | `#E2E8F0` | All structural borders |
| `--text-primary` | `#0F172A` | Primary readable text |
| `--text-secondary` | `#475569` | Supporting / secondary text |
| `--text-muted` | `#94A3B8` | Disabled / placeholder text |
| `--brand-primary` | `#10B981` | CTAs, active indicators, links |
| `--brand-primary-hover` | `#059669` | Hover state for brand elements |
| `--brand-primary-muted` | `rgba(16,185,129,0.12)` | Tinted backgrounds |
| `--brand-primary-glow` | `rgba(16,185,129,0.18)` | Glow / shadow accents |
| `--color-success` | `#22C55E` | Positive states, gains |
| `--color-error` | `#EF4444` | Errors, losses, destructive |
| `--color-warning` | `#F59E0B` | Warnings, pending states |
| `--color-info` | `#3B82F6` | Informational, neutral action |

### Semantic Status Muted Backgrounds

All status muted backgrounds use 15%–20% opacity:
```css
background: rgba(34, 197, 94, 0.15);  /* success-muted */
background: rgba(239, 68, 68, 0.15);   /* error-muted */
background: rgba(245, 158, 11, 0.15);  /* warning-muted */
background: rgba(59, 130, 246, 0.15);  /* info-muted */
```

---

## Data Visualization Colors

| State | Color | Token |
|-------|-------|-------|
| Positive / Increase | `#22C55E` | `--color-success` |
| Negative / Decrease | `#EF4444` | `--color-error` |
| Neutral / Inactive | `#94A3B8` | `--text-muted` |

Rules:
- No rainbow palettes
- No noisy gradients
- No decorative chart effects
- Prioritize numerical clarity and readability
