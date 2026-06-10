# task_progress.md — Active Task Lists

> This file tracks the completion status of all items across phases.
> `@manager` maintains and updates this file.

---

## 🚀 Phase 0: Scaffolding
- [x] Initial repository structure and governance setup (`AGENTS.md`, `CLAUDE.md`, memory banks)
- [x] Create architectural plan for rule backbones (`logs/plan_rules_backbone.md`)
- [x] Rewrite `.agents/rules/` files to establish high-fidelity backbone structures
  - [x] `projectbrief.md`
  - [x] `techstack.md`
  - [x] `ux-principles.md`
  - [x] `ci-brand.md`
  - [x] `ui-theme.md`

---

## 💡 Phase 1: Project Definition & Design Specs
- [x] Receive project idea and requirements from the user (DeFi TaxGen + x402 PRD)
- [x] Populate `memory-bank/projectbrief.md` with core features and target workflows
- [x] Reconcile governance to locked decisions (wagmi+viem, x402, no Privy)
- [ ] Brand/theme/UX design specs — using framework defaults; no custom overrides applied yet

---

## 🛠️ Phase 2: Core Engineering — MVP Vertical Slice (DONE)
- [x] Scaffold Next.js 15 App Router project (Tailwind 4, vitest)
- [x] Wallet via wagmi v2/viem (replaces Privy) + connect button
- [x] Pure tax engine, TDD: `money` · `classify` · `fifo` · `aggregate` · `buildReport` (44 tests green)
- [x] Mock-first data: `LiquifyClient` + `PriceOracle` interfaces, fixtures, factories
- [x] Free summary route (`/api/summary`) — per-row USD withheld server-side
- [x] CSV exporter (IRS Form 8949 style) + golden-file test
- [x] x402-gated export route (`/api/export`) on Base Sepolia + demo-mode bypass
- [x] UI: landing/scan, free dashboard (blurred figures + locked table), payment modal + download
- [x] Verified end-to-end: demo CSV download (200) and gated 402 payment challenge

### Post-MVP backlog
- [x] Real Liquify + CoinGecko clients (behind existing interfaces)
- [x] PDF export; BNB/ARB/OP/AVAX; HIFO; LP + lending event types
- [x] Specific-ID (backend implemented)
- [ ] Wire real x402 facilitator/payTo/USDC values for live-payment demo
- [ ] Postgres/Prisma persistence layer
