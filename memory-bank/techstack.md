# techstack.md — Approved & Forbidden Dependencies

> This is the whitelist. If a package is not listed under Approved, it must be proposed
> to `@architect` first. If it appears under Forbidden, it may never be imported.

---

## ✅ Approved — Core Framework

| Package | Version | Purpose |
|---------|---------|---------|
| next | latest (16.x) | App framework |
| react | latest (19.x) | UI library |
| react-dom | latest (19.x) | DOM rendering |
| typescript | latest (5.x) | Type safety |

---

## ✅ Approved — Styling

| Package | Version | Purpose |
|---------|---------|---------|
| tailwindcss | latest (4.x) | Utility-first CSS |
| clsx | latest | Conditional classnames |
| tailwind-merge | latest | Class conflict resolution |

---

## ✅ Approved — Wallet / Chain

| Package | Version | Purpose |
|---------|---------|---------|
| wagmi | latest (3.x) | React hooks for EVM wallet connection + signing |
| viem | latest (2.x) | Typed Ethereum client (used by wagmi + x402) |
| @tanstack/react-query | latest (5.x) | Async cache — required peer dep of wagmi |

> **Decision (2026-06-05, Phase 1):** Wallet stack is **wagmi v3 + viem v2**, not Privy.
> The product is EVM multi-chain DeFi + x402 payment signing, for which wagmi/viem is the
> standard. `@privy-io/react-auth` is **demoted** (no longer the mandated wallet lib); it may be
> re-proposed later if embedded-wallet onboarding is needed.

---

## ✅ Approved — Payments (x402)

| Package | Version | Purpose |
|---------|---------|---------|
| x402-next | latest | Next.js payment middleware (HTTP 402 gate) |
| x402-fetch | latest | Client `wrapFetchWithPayment` for signing/retrying gated requests |

---

## ✅ Approved — Animation

| Package | Version | Purpose |
|---------|---------|---------|
| motion | latest (formerly framer-motion) | Animation and spring physics — required by `design/ui-theme.md` |

---

## ✅ Approved — UI Primitives

| Package | Version | Purpose |
|---------|---------|---------|
| lucide-react | latest | Icons |
| shadcn/ui (via CLI) | latest | Component primitives |
| @radix-ui/* | (via shadcn) | Headless UI |

---

## ✅ Approved — Utilities

| Package | Version | Purpose |
|---------|---------|---------|
| zod | latest | Schema validation |
| zustand | latest | Client state (if needed) |
| decimal.js | latest | Decimal-safe USD arithmetic (no float drift in tax math) |

---

## ✅ Approved — Testing

| Package | Version | Purpose |
|---------|---------|---------|
| vitest | latest (4.x) | Unit / integration test runner (44 tests) |

---

## ⬜ Proposed — Awaiting Architect Approval

_Empty until a feature requires additional packages._

| Package | Proposed By | Reason | Status |
|---------|-------------|--------|--------|
| — | — | — | — |

---

## 🚫 Forbidden

| Package | Reason |
|---------|--------|
| styled-components | Use Tailwind instead |
| emotion | Use Tailwind instead |
| moment.js | Use `date-fns` or native `Intl` |
| lodash | Use native JS or targeted imports only |
| web3.js (legacy) | Use approved chain-specific SDK only |
| ethers v5 | Propose v6 or viem instead |
| axios | Use native `fetch` (Next.js extended fetch) |

---

## Notes

- All packages must be installed via `npm` — no `yarn` or `bun` unless explicitly decided
- Lock file (`package-lock.json`) must be committed
- No packages with known critical CVEs (run `npm audit` before adding)
