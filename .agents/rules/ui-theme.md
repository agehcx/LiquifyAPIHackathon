# ui-theme.md — Component Structures & Theme Primitives

> Approved component patterns, shape language, surface system, and motion standards.
> `@developer` must reference this before writing any component. No deviations without `@architect` approval.

---

## Shape Language

### Border Radius System

| Component | Radius | Class (Tailwind) |
|-----------|--------|-----------------|
| Buttons | `8px` | `rounded-lg` |
| Inputs | `8px` | `rounded-lg` |
| Cards | `10px` | `rounded-[10px]` |
| Floating Panels | `14px` | `rounded-[14px]` |
| Modals | `16px` | `rounded-2xl` |

Rules:
- No pill-shaped UI (`rounded-full` only for avatars/badges)
- No excessive softness — the interface is geometric and structured
- No consumer-social rounded everything

---

## Spacing Scale

Base unit: **8px**

| Token | Value | Tailwind |
|-------|-------|---------|
| `xs` | 4px | `p-1` / `gap-1` |
| `sm` | 8px | `p-2` / `gap-2` |
| `md` | 16px | `p-4` / `gap-4` |
| `lg` | 24px | `p-6` / `gap-6` |
| `xl` | 32px | `p-8` / `gap-8` |
| `2xl` | 48px | `p-12` / `gap-12` |
| `3xl` | 64px | `p-16` / `gap-16` |

---

## Layout Architecture

### Grid System

- 12-column responsive grid
- Strong vertical rhythm
- Alignment-first layout philosophy

### Page Width Standards

| Layout | Max Width | Usage |
|--------|-----------|-------|
| Standard Content | `1280px` | Default pages |
| Dashboard | `1440px` | Data-dense views |
| Ultra-wide | `1600px` | Full operational interfaces |

---

## Surface System

### Base Card Style

```css
background: rgba(255, 255, 255, 0.75);
backdrop-filter: blur(20px);
border: 1px solid rgba(226, 232, 240, 1);
border-radius: 10px;
box-shadow:
  0 1px 2px rgba(15, 23, 42, 0.04),
  0 8px 24px rgba(15, 23, 42, 0.06);
```

Tailwind equivalent pattern:
```tsx
className="bg-white/75 backdrop-blur-xl border border-[--border-default] rounded-[10px] shadow-sm"
```

### Glassmorphism — Allowed Contexts Only

Glass surfaces (`backdrop-blur`) are permitted **only** for:
- Floating navigation / top nav
- Modals
- Command palettes
- Overlays and drawers
- Elevated panels

Do **not** apply glass globally. The interface must remain operational and structured.

---

## Component Patterns

### Button — Primary

```tsx
<button className="
  h-10 px-4
  bg-[--brand-primary] hover:bg-[--brand-primary-hover]
  text-white text-sm font-medium
  rounded-lg
  transition-all duration-150
  active:scale-[0.985]
  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[--brand-primary]
">
  Label
</button>
```

### Button — Secondary / Ghost

```tsx
<button className="
  h-10 px-4
  bg-transparent hover:bg-[--bg-elevated]
  text-[--text-primary] text-sm font-medium
  border border-[--border-default]
  rounded-lg
  transition-all duration-150
  active:scale-[0.985]
">
  Label
</button>
```

### Input — Standard

```tsx
<input className="
  h-10 px-3 w-full
  bg-[--bg-surface]
  border border-[--border-default] focus:border-[--brand-primary]
  text-[--text-primary] text-sm
  rounded-lg
  outline-none
  transition-colors duration-150
  placeholder:text-[--text-muted]
" />
```

### Card — Base

```tsx
<div className="
  bg-white/75 backdrop-blur-xl
  border border-[--border-default]
  rounded-[10px]
  shadow-[0_1px_2px_rgba(15,23,42,0.04),0_8px_24px_rgba(15,23,42,0.06)]
  p-6
">
  {children}
</div>
```

---

## Motion System

### Timings

| Interaction | Duration |
|-------------|----------|
| Hover transitions | `120ms – 180ms` |
| Standard transitions | `200ms – 280ms` |
| Modal enter/exit | `400ms – 550ms` |
| Page transitions | `500ms – 700ms` |

### Easing

```css
/* Standard easing — use for all transitions */
cubic-bezier(0.16, 1, 0.3, 1)
```

### Spring Physics (Motion / Framer Motion)

```ts
const spring = {
  stiffness: 300,
  damping: 30,
}
```

### Motion Rules

Never:
- Over-bounce animations
- Excessive blur transitions
- Playful elasticity
- Exaggerated scaling

Always:
- Preserve spatial continuity
- Prioritize directional movement
- Maintain responsive feedback
- Reinforce hierarchy through motion

---

## Interaction States

### Hover

```css
transform: translateY(-1px);
box-shadow: 0 8px 24px rgba(16, 185, 129, 0.12);
transition: all 180ms cubic-bezier(0.16, 1, 0.3, 1);
```

### Active / Press

```css
transform: scale(0.985);
transition-duration: 120ms;
```

### Loading States

Preferred patterns (in order):
1. Skeleton layouts with shimmer
2. Shimmer placeholders
3. Progressive hydration

Avoid:
- Blocking full-page spinners
- Full-page loading screens

---

## Navigation Standards

### Sidebar

- Fixed positioning
- Lightweight visual density
- Collapsible support
- Subtle `1px` border separation on right edge

### Active Navigation Item

```tsx
// Active state indicators:
// - Left accent bar (brand-primary color)
// - Stronger text contrast (text-primary vs text-secondary)
// - Muted surface tint (bg-elevated)
className="bg-[--bg-elevated] text-[--text-primary] border-l-2 border-[--brand-primary]"
```

---

## Background System

### Grid Overlays

Allowed background textures:
- Coordinate grids
- Topographic-inspired structures
- Low-opacity technical textures
- Subtle linear overlays

Rule: **Opacity must remain below 5%**

### Glow System

Glows are allowed to guide attention and reinforce hierarchy. Keep them subtle.

```css
/* Brand glow — use sparingly */
box-shadow: 0 0 40px rgba(16, 185, 129, 0.18);
```

Avoid aggressive neon bloom.
