# LiquifyIndexerAPI — current-state.md

> This file is the authoritative snapshot of the project at any given moment.
> `@developer` must update it after every meaningful change.
> `@manager` must verify it during every review.

---

## Project Status

**Phase:** 2 — Core Engineering (MVP vertical slice **COMPLETE**)
**Last Updated:** 2026-06-14 14:21
**Updated By:** @developer

---

## What Is Built

All MVP deliverables are complete. 56 tests pass, build clean, lint clean.

| Module | Status | Notes |
|--------|--------|-------|
| Repo structure | ✅ Done | Governance files created |
| Agent rules backbones | ✅ Done | Backbone structures under `.agents/rules/` |
| Project brief | ✅ Done | `projectbrief.md` populated from PRD + MVP plan |
| Tech stack reconciled | ✅ Done | wagmi/viem + x402 + decimal.js approved; Privy demoted |
| Next.js app | ✅ Done | Next 16.2.7, Tailwind 4, vitest 4.1.8 |
| Tax engine (money/classify/FIFO/aggregate/buildReport) | ✅ Done | Pure, 44 tests green |
| Mock Liquify + Price oracle | ✅ Done | Interfaces + fixtures + factories |
| Free summary + CSV export routes | ✅ Done | per-row USD withheld; 8949 CSV |
| x402 export gate | ✅ Done | base-sepolia, $2 USDC, demo bypass; 402 verified |
| UI / Dashboard / Payment modal | ✅ Done | landing→scan→dashboard→pay→download |

---

## What Is Broken / Blocked

| Issue | Blocker | Owner |
|-------|---------|-------|
| Real x402 payment demo | Needs base-sepolia USDC addr, payTo, facilitator URL | User |
| (None blocking) | Demo-mode bypass lets the full flow run offline | — |

---

## What Is Next (Post-MVP Backlog)

1. Real Liquify + CoinGecko clients (behind existing interfaces).
2. PDF export; multi-chain (BNB / ARB / OP / AVAX).
3. HIFO & Specific-ID cost-basis methods.
4. LP add/remove + lending/borrow event types.
5. Wire real x402 facilitator/payTo/USDC values for live-payment demo.
6. Postgres/Prisma persistence layer.

---

## Active Decisions / Resolved

- [x] Chain: Ethereum mainnet (MVP); payments on Base Sepolia.
- [x] User flow: connect → scan → free summary → x402 export → CSV download.
- [x] Backend: Next.js route handlers; no DB for MVP (in-memory + mock-first).
- [x] Wallet: wagmi v2 + viem (Privy demoted).
- [x] Deployment target: Vercel (single Next.js app).
