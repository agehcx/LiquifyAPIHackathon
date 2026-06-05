# logs/process.md — Append-Only Process Ledger

> This file is append-only. Never edit or delete past entries.
> Every agent action that modifies files or makes an architectural decision must log here.

---

## [2026-05-20 00:00] @architect — Governance Initialization

- **Summary:** Created full project governance structure and populated core memory-bank files.
- **Files Modified:** `AGENTS.md`, `memory-bank/current-state.md`, `memory-bank/techstack.md`, `logs/process.md`, `CLAUDE.md`, `task_progress.md` (empty), `.antigravity.md` (empty), `design/ci-brand.md` (empty), `design/ui-theme.md` (empty), `design/ux-principles.md` (empty), `memory-bank/projectbrief.md` (empty)
- **Architectural Decisions:** Established single-source-of-truth governance model. Tech stack seeded with Next.js 15, React 19, Tailwind 4, Privy, shadcn/ui. Forbidden list blocks legacy libraries with known alternatives.
- **Next Steps:** User to provide full project brief → populate `memory-bank/projectbrief.md` → `@architect` produces Phase 1 plan.

---

## [2026-05-20 14:38] @architect & @developer — Agent Rules Scaffolding

- **Summary:** Created plan `logs/plan_rules_backbone.md` and rewrote all files in `.agents/rules/` to establish high-fidelity backbone structures with placeholders for features, standards, and layout guidelines.
- **Files Modified:** `logs/plan_rules_backbone.md`, `.agents/rules/projectbrief.md`, `.agents/rules/techstack.md`, `.agents/rules/ux-principles.md`, `.agents/rules/ci-brand.md`, `.agents/rules/ui-theme.md`, `memory-bank/current-state.md`, `logs/process.md`
- **Architectural Decisions:** Structured rules files with appropriate triggers (always_on vs *.tsx globs) and standard schemas so that future development phases enforce strict alignment with UX, Brand, and Tech Stack governance.
- **Next Steps:** Await user input for `projectbrief.md` definition to complete Phase 0 and enter Phase 1.

---

## [2026-06-05] @architect & @developer — Phase 1 Kickoff: DeFi TaxGen + x402 MVP

- **Summary:** User supplied the DeFi TaxGen + x402 PRD v1.0. Approved an MVP vertical-slice plan
  (Ethereum-only, Uniswap swaps + staking/airdrop income, FIFO, free summary + $2 USDC CSV export
  via x402 on Base Sepolia, mock-first data). Reconciled governance to match the locked decisions.
- **Files Modified:** `memory-bank/projectbrief.md` (populated), `memory-bank/techstack.md`
  (approved wagmi/viem, @tanstack/react-query, x402-next, x402-fetch, decimal.js; demoted Privy),
  `CLAUDE.md` (stack, wallet rule, env vars, project summary), `memory-bank/current-state.md`
  (Phase 1, status table, resolved decisions).
- **Architectural Decisions:** Single Next.js 15 app (route handlers + x402-next middleware, no
  separate Express server). Wallet = wagmi v2 + viem (supersedes Privy). No Postgres for MVP —
  in-memory report cache; `transactions`/`cost_basis` survive as TS types. Mock-first via
  `LiquifyClient` / `PriceOracle` interfaces. Tax math is pure & decimal-safe (bigint + decimal.js).
- **Next Steps:** Scaffold Next.js; TDD the pure tax core; wire x402 gate + UI. Awaiting
  base-sepolia USDC/payTo/facilitator values for the real-payment demo (demo-mode unblocks offline).

---

## [2026-06-05] @developer — Phase 2: MVP Vertical Slice Implemented

- **Summary:** Built the full DeFi TaxGen + x402 MVP end-to-end. Scaffolded Next.js 16 (App Router,
  Tailwind 4, vitest). Implemented the pure tax core TDD-first and wired the API routes, x402 gate,
  and UI. 44 unit/integration tests pass; `npm run build` + `lint` + `typecheck` clean.
- **Files Added (high level):** `src/types/{domain,api,enums}.ts`; `src/lib/tax/{money,classify,
  fifo,aggregate,buildReport,constants}.ts`; `src/lib/liquify/*` + fixtures; `src/lib/pricing/*` +
  fixtures; `src/lib/report/*`; `src/lib/export/csvExporter.ts`; `src/lib/config/{wagmi,env}.ts`;
  `src/app/api/{summary,export}/route.ts`; `src/app/{layout,page,providers}.tsx`,
  `src/app/report/page.tsx`; `src/components/{primitives,wallet,scan,dashboard,payment,layout}/*`;
  `src/hooks/*`. Config: `vitest.config.ts`, tsconfig target → ES2020.
- **Key decisions made during build:**
  - No DB — module-level report cache (`reportCache.ts`) keyed by address:year with 10-min TTL.
  - Stablecoins treated as cash: spending one is not a taxable disposal and receiving one creates
    no lot (prevents spurious zero-basis USDC disposals). Added `isStablecoin` to `PriceOracle`.
  - Money math decimal-safe: bigint base units + decimal.js USD, rounding to 2dp only at export.
  - x402 via `withX402` per-route wrapper (lazy dynamic import) instead of global middleware; demo
    bypass when `X402_DEMO_MODE=true` or no `X402_PAY_TO`. Client bypass via `NEXT_PUBLIC_X402_DEMO_MODE`.
  - Paywall integrity: `/api/summary` withholds per-row USD; only headline totals + counts + a
    symbol/term teaser ship over the wire.
- **Verification:** Runtime — demo export returns 200 text/csv with full Form-8949 data; gated
  export (payTo set, demo off) returns 402 with correct payment requirements (base-sepolia, $2 →
  2000000 USDC base units, asset 0x036CbD…); summary stays free (200); bad address → 400.
- **Next Steps (post-MVP):** real Liquify/CoinGecko clients behind the interfaces; PDF + more chains
  + HIFO/Specific-ID; supply live base-sepolia facilitator/payTo/USDC for an on-chain payment demo.

---

## [2026-06-05 14:54] @manager — Documentation Audit & Sync

- **Summary:** Full audit of all documentation files. Found and corrected multiple stale/inconsistent
  entries across `memory-bank/`, `logs/`, `README.md`, and `task_progress.md`. All docs now reflect
  the actual project state after the Phase 2 MVP vertical slice was completed. Verified: 44 tests
  pass, build clean, lint clean.
- **Files Modified:** `memory-bank/current-state.md` (removed stale "Nothing yet" prose, corrected
  Next version to 16.2.7, updated "What Is Next" to post-MVP backlog), `memory-bank/techstack.md`
  (Next 15→16, wagmi 2→3, removed uninstalled @tailwindcss/typography, added vitest to approved
  list), `README.md` (replaced stale Express+Postgres description with actual Next.js 16 + x402
  stack, added scripts table, detailed project structure), `logs/INDEX.md` (added missing
  `plan_rules_backbone.md` to file table), `task_progress.md` (replaced invalid `[~]` marker with
  standard `[ ]`), `logs/process.md` (this entry).
- **Discrepancies Found:**
  1. `current-state.md` — "What Is Built" said "Nothing yet" despite all table rows being ✅.
  2. `current-state.md` — "What Is Next" listed already-completed Phase 2 items.
  3. `techstack.md` — Listed Next 15.x (actual: 16.x), wagmi 2.x (actual: 3.x).
  4. `techstack.md` — Listed `@tailwindcss/typography` as approved but never installed.
  5. `techstack.md` — Missing vitest from approved packages.
  6. `README.md` — Listed Express.js + PostgreSQL as the stack (completely wrong).
  7. `logs/INDEX.md` — Missing `plan_rules_backbone.md` from file table.
  8. `task_progress.md` — Used invalid `[~]` marker notation.
- **Design files reviewed:** `ci-brand.md`, `ui-theme.md`, `ux-principles.md` — all accurate and
  consistent with their intended scope. No changes needed.
- **Next Steps:** No action required. All docs are now in sync with code.
