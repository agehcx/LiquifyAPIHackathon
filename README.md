# DeFi TaxGen — Liquify Hackathon MVP

> **Paste a wallet address -> get a tax-ready IRS Form 8949 CSV in minutes.**  
> Built for the **Liquify Indexer API Hackathon (Challenge 3)**.

---

## [Watch the 2-Minute Demo](YOUR_VIDEO_LINK_HERE)
## [Live Demo URL](YOUR_VERCEL_URL_HERE)

---

## Key Features

- **Liquify Indexer Integration:** Performs deep RPC scans for ERC20 transfers and DeFi events using the Liquify Gateway (JSON-RPC 2.0).
- **Pure Tax Engine:** Float-safe (`decimal.js`) implementation of FIFO cost-basis math. Supports capital gains, short/long-term splits, and ordinary income (staking/airdrops).
- **Real On-Chain Payments:** Production-ready USDC micropayment gate on **Base Sepolia**. Full export is unlocked only after a verified blockchain transaction.
- **High-Fidelity Demo Mode:** Instant "One-Click" demo for `vitalik.eth` and a 2025 sample wallet to showcase complex tax scenarios without API latency.
- **Accountant Ready:** Generates standardized CSV exports compatible with tax software and IRS Form 8949 requirements.

## Tech Stack

- **Framework:** Next.js 15 (App Router), React 19, TypeScript 5
- **Styling:** Tailwind CSS 4
- **Web3:** viem v2 + wagmi v3 (Real-time wallet connection & contract writes)
- **Math:** decimal.js (Precision accounting)
- **Testing:** vitest (44+ unit tests for the tax engine)

## Project Structure

```text
src/
  lib/tax/        # Pure FIFO engine (Classify, Aggregate, Realize)
  lib/liquify/    # Liquify JSON-RPC Client + Fixture Database
  lib/export/     # CSV Form 8949 Exporter
  hooks/          # Production-grade x402 payment lifecycle
  app/api/        # Gated export endpoints
```

## Getting Started

### 1. Installation
```bash
npm install
```

### 2. Environment Setup
Create a `.env.local` file (see `.env.example` for details):
```env
# Required for Real-Time Scanning
LIQUIFY_API_URL="https://gateway.liquify.com/api=YOUR_KEY"
COINGECKO_API_KEY="YOUR_KEY"

# Required for Payments
X402_PAY_TO="YOUR_RECEIVING_WALLET"
```

### 3. Run Development
```bash
npm run dev
```

---

## Security & Reliability
- **No Database Needed:** Uses stateless on-chain verification and high-performance in-memory caching.
- **Fallback Logic:** If API nodes are unstable, the system gracefully falls back to indexed fixtures to maintain UI availability.
- **Validated Math:** Every tax realization is covered by an extensive test suite to ensure $0.01 accuracy.

---

*Built for the Liquify Indexer API Hackathon.*