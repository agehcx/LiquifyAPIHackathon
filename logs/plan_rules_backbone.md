# LiquifyIndexerAPI — plan_rules_backbone.md

This plan details the backbone structures of the files in `.agents/rules/` directory to prepare them for the development phase of the project.

## Current State & Issues
1. Files exist in `.agents/rules/` but are empty placeholders with only frontmatter trigger definitions.
2. We need a robust backbone structure for all rule files to ensure consistency, clarity, and enforcement of development/design guidelines.
3. No code has been written yet, and the project is in Phase 0 (Scaffolding). We must lay down clear structural anchors without writing the final implementation code.

---

## Backbone Structure Design

### 1. `projectbrief.md` (trigger: always_on)
**Role:** Project scoping, target audience, core modules, user stories.
- **Backbone Headers:**
  - `# Project Brief & Core Requirements`
  - `## 1. Project Vision & Core Tagline`
  - `## 2. Core Target Audience & Use Cases`
  - `## 3. Product Modules & Key Features`
  - `## 4. Primary User Journeys & Flows`
  - `## 5. Out of Scope & Future Roadmap`

### 2. `techstack.md` (trigger: always_on)
**Role:** Technical choices, approved & forbidden libraries, architectural and styling guidelines.
- **Backbone Headers:**
  - `# Approved Tech Stack & Coding Standards`
  - `## 1. Stack Overview (Framework, UI, Wallet, Utils)`
  - `## 2. Next.js App Router & Architecture Conventions`
  - `## 3. State Management & Data Fetching (Server vs Client)`
  - `## 4. Authentication & Wallet Integration Policies (Privy)`
  - `## 5. Strict TypeScript & Code Quality Enforcement`

### 3. `ux-principles.md` (trigger: always_on)
**Role:** Mobile-first, UX patterns, interactions, accessibilities, trading UX.
- **Backbone Headers:**
  - `# UX Principles & Interaction Guidelines`
  - `## 1. Mobile-First & Responsive Breakpoints`
  - `## 2. Accessibility (A11y) & Semantic HTML`
  - `## 3. Loading, States & Micro-interactions`
  - `## 4. Transaction & Trading UX Best Practices`
  - `## 5. Performance Budget & Layout Shift (CLS) Mitigation`

### 4. `ci-brand.md` (trigger: glob, globs: *.tsx)
**Role:** Corporate Identity (CI), visual language, color harmonies, brand voice.
- **Backbone Headers:**
  - `# Corporate Identity & Brand Visuals`
  - `## 1. Brand Identity, Tone of Voice & Personality`
  - `## 2. Brand Color Palette (HSL tailormade)`
  - `## 3. Typography & Font Families`
  - `## 4. Iconography & Logo Assets`
  - `## 5. Illustrative & Photographic Art Direction`

### 5. `ui-theme.md` (trigger: glob, globs: *.tsx)
**Role:** Design system tokenization, styling systems (Tailwind), component states, motion tokens.
- **Backbone Headers:**
  - `# UI Theme & Styling Token Guidelines`
  - `## 1. Themes (Glassmorphism, Vibrant Dark Mode)`
  - `## 2. Layout Grids, Spacing & Container Tokens`
  - `## 3. Interactive States (Hover, Active, Focus, Disabled)`
  - `## 4. Motion Design, CSS Transitions & Keyframes`
  - `## 5. Component Primitives & Customizations (shadcn/ui)`

---

## Action Plan & Execution Flow

1. Create `logs/plan_rules_backbone.md` (this plan).
2. Propose plan to USER for approval.
3. Once approved, activate `@developer` role to execute rewriting of files under `.agents/rules/`.
4. `@developer` updates `memory-bank/current-state.md` and appends log entry to `logs/process.md`.
5. `@manager` validates files and updates `task_progress.md`.
6. Ensure no git commit commands are run.
