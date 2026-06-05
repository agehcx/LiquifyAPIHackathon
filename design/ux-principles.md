# ux-principles.md — UX, Accessibility & Responsive Standards

> Governs interaction philosophy, accessibility requirements, responsive behavior, and performance targets.
> Non-negotiable. Cross-reference with `.antigravity.md` for enforcement rules.

---

## Core UX Philosophy

The platform communicates:
- **Precision** — every element has a reason to exist
- **Reliability** — the interface reflects system state accurately at all times
- **Operational confidence** — users always know where they are and what state the system is in
- **Transparency** — data is never hidden or obscured behind decoration
- **Technical rigor** — the experience feels engineered, not styled

### Experience Goals

Users must feel:
- Immediately oriented upon arrival
- Confident navigating between sections
- Continuously aware of application state
- Fully in control of all interactions

The interface should feel like **interacting with infrastructure**, not a consumer social application.

---

## Accessibility Standards

### Compliance Target

**WCAG 2.1 AA** — mandatory for all components and pages.

### Requirements

| Requirement | Standard |
|-------------|---------|
| Color contrast (text on bg) | Minimum 4.5:1 (AA) |
| Large text contrast | Minimum 3:1 |
| Focus indicators | Always visible, never hidden |
| Keyboard navigation | Full support — no mouse-only interactions |
| Semantic HTML | Correct landmark roles, heading hierarchy |
| Screen reader support | ARIA labels where visual-only context exists |
| Reduced motion | `prefers-reduced-motion` respected |

### Touch Target Minimum

```
44px × 44px
```

All interactive elements must meet this minimum size.

### Focus States

Never suppress focus outlines. Use brand-colored rings:
```css
focus-visible:ring-2 focus-visible:ring-[--brand-primary] focus-visible:outline-none
```

### Reduced Motion

All animated components must include:
```tsx
// Check before applying motion
const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
```

Or use Motion's built-in `useReducedMotion()` hook.

---

## Responsive Design System

### Breakpoint Standards

| Name | Min Width | Layout Behavior |
|------|-----------|----------------|
| `xs` | 0px | Single column, bottom-sheet interactions |
| `sm` | 640px | Two-column capable |
| `md` | 768px | Sidebar begins to appear |
| `lg` | 1024px | Full multi-panel layouts |
| `xl` | 1280px | Standard content max-width |
| `2xl` | 1536px | Dashboard / ultra-wide mode |

### Mobile Philosophy

Mobile layouts should:
- Prioritize clarity over density
- Simplify analytics displays
- Maintain interaction consistency with desktop
- Use bottom-sheet patterns for contextual overlays
- Reduce navigation to essential items

### Desktop Philosophy

Desktop layouts should:
- Support multi-panel simultaneous views
- Use dense operational interfaces
- Maintain persistent sidebar navigation
- Enable full data visualization density

---

## Navigation UX

### Principles

- Navigation must be **persistent** — never hidden without user intent
- Navigation must be **spatially predictable** — position never changes unexpectedly
- Navigation must be **minimal** — no clutter, only essential structure
- Navigation must be **information-dense** without clutter

### Page Transitions

- Transitions reinforce spatial relationships between pages
- Direction of motion should match navigation hierarchy
- Duration: `500ms – 700ms` with `cubic-bezier(0.16, 1, 0.3, 1)`

---

## Data & State Display Standards

### Application State Rules

- The UI must **always** reflect the current system state
- Never show stale data without a visible indicator
- Loading states use skeleton/shimmer — never block the layout
- Error states must be actionable — always provide a recovery path
- Empty states must be informative — never blank white screens

### Data Table / List Standards

- Monospace font (`JetBrains Mono`) for all numerical columns
- Tabular numbers (`font-variant-numeric: tabular-nums`) for alignment
- Row hover should use `--bg-elevated` tint
- Sorting indicators must be visible
- Pagination or virtualization required for lists > 50 items

---

## Performance Standards

### Core Web Vitals Targets

| Metric | Target |
|--------|--------|
| CLS (Cumulative Layout Shift) | `< 0.1` |
| LCP (Largest Contentful Paint) | `< 1s` |
| Perceived Interaction Response | `< 100ms` |

### Performance Rules

- Reserve fixed heights for all dynamic content containers to prevent CLS
- Use skeleton placeholders before any async data renders
- Lazy-load all below-the-fold components with `next/dynamic`
- Prioritize above-the-fold rendering — defer everything else
- Hydrate live data progressively — never block on full dataset
- Images must use `next/image` with explicit `width` and `height`

---

## Content Hierarchy Rules

Visual hierarchy must be built through:
1. **Spacing** — generous whitespace creates separation
2. **Typography** — scale and weight carry meaning
3. **Contrast** — primary vs secondary vs muted text levels
4. **Alignment** — strong grid discipline
5. **Motion** — transitions reinforce relationships
6. **Surface layering** — elevation conveys priority

Never use:
- Color alone to convey meaning (accessibility)
- Decoration to substitute for structure
- Animation to compensate for unclear hierarchy
