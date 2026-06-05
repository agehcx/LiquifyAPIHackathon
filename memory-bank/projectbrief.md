# LiquifyIndexerAPI — projectbrief.md

> Source of truth for vision, scope, and user journeys. Derived from the PRD v1.0 (2026-06-05)
> and the approved MVP plan.

---

## Vision

Let any DeFi user paste a wallet address and receive a tax-ready report in minutes — no tax
knowledge required, no account, no subscription. Monetized per-export via x402 micropayments
($2 USDC), making compliance economically rational for low-frequency DeFi users.

**Tagline:** *"Liquify Indexer API - DeFi taxes, done in 3 minutes."*

---

## Two technical pillars

- **Liquify Indexer API** — real-time decoded on-chain event data (mocked behind an interface for
  the MVP; swapped in later without touching the engine).
- **x402** — pay-per-export monetization, replacing subscriptions with $2 USDC on Base.

---

## MVP scope (this build)

**In:**
- Ethereum mainnet only.
- Event types: Uniswap V2/V3 swaps (capital gain/loss) + staking/airdrop rewards (ordinary income).
- Cost basis: **FIFO only**.
- Free tier: blurred/withheld P&L summary + taxable-event counts.
- Paid tier: **$2 USDC CSV export** (IRS Form 8949-style) gated by x402 on **Base Sepolia**.
- Mock-first data: `LiquifyClient` + `PriceOracle` interfaces with fixtures; runs fully offline.
- Demo-mode bypass for offline presentation.

**Out (post-MVP, not precluded by the architecture):**
- PDF export; BNB / Arbitrum / Optimism / Avalanche; HIFO & Specific-ID methods;
  Postgres/Prisma persistence; LP add/remove, lending/borrow event types; real Liquify + CoinGecko.

---

## Target audience

Active DeFi traders, yield farmers, LP providers, DeFi beginners, and CPAs — see the PRD personas.
MVP demo centers on the trader/yield-farmer case (swaps + income).

---

## Primary user journey

1. Land → connect wallet (wagmi) or paste an address.
2. Select tax year → scan (mock Liquify events → classify → FIFO → aggregate).
3. View free dashboard: headline P&L + event counts (per-row USD withheld server-side).
4. Click **Export Full Report ($2 USDC)** → x402 payment modal → sign on Base Sepolia.
5. Payment settles → CSV downloads.

---

## Out-of-scope guarantees

No account, no email, no KYC at any point. Free tier never exposes per-row USD figures over the wire.
