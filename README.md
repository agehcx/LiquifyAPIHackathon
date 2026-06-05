# LiquifyIndexerAPI — DeFi TaxGen + x402

> Paste a wallet address → get a tax-ready IRS Form 8949 CSV in minutes.
> Free summary with blurred figures; full CSV export gated by a $2 USDC x402 micropayment on Base Sepolia.

## Stack

- **Next.js 16** (App Router, Turbopack)
- **React 19** + **TypeScript 5**
- **Tailwind CSS 4**
- **wagmi v3 + viem v2** — wallet connection & tx signing
- **x402-next / x402-fetch** — HTTP 402 micropayment gate
- **decimal.js** — float-safe tax math
- **vitest** — 44 unit/integration tests

## Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Set up environment variables
cp .env.example .env.local
# Fill in .env.local with your values

# 3. Run the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start local dev server |
| `npm run build` | Production build |
| `npm test` | Run all 44 tests (vitest) |
| `npm run lint` | ESLint check |
| `npm run typecheck` | TypeScript type check |

## Project Structure

```
src/
  app/            # Next.js App Router pages, layouts, API routes
    api/summary/  # Free summary endpoint (per-row USD withheld)
    api/export/   # x402-gated CSV export ($2 USDC)
    report/       # Dashboard page
  components/     # UI: dashboard, scan, payment, wallet, primitives, layout
  hooks/          # useExportPayment, useTaxReport, useWalletAddress
  lib/
    tax/          # Pure tax engine: money, classify, fifo, aggregate, buildReport
    liquify/      # Mock Liquify client + fixtures (interface-first)
    pricing/      # Mock price oracle + fixtures
    export/       # CSV exporter (Form 8949)
    report/       # In-memory report cache (10-min TTL)
    config/       # wagmi + env helpers
  types/          # domain.ts, api.ts, enums.ts
public/           # Static assets
```

## Governance

This project uses an AI agent governance system. See:

- [`AGENTS.md`](./AGENTS.md) — AI persona definitions and handoff rules
- [`CLAUDE.md`](./CLAUDE.md) — Stack conventions and commit rules
- [`memory-bank/`](./memory-bank/) — Project state and tech decisions
- [`design/`](./design/) — Brand, theme, and UX guidelines

## Commit Convention

```
feat: add wallet connect button
fix: resolve hydration mismatch on home page
chore: update dependencies
```

