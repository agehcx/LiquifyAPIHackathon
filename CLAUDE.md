# Project

**DeFi TaxGen + x402** — paste a wallet address, get a tax-ready DeFi report; pay $2 USDC per
export via the x402 micropayment protocol (no account, no subscription). Hackathon entry for the
Liquify Indexer API Challenge 3. See `memory-bank/projectbrief.md` for the MVP scope.

## Stack

- **Framework**: Next.js 15 (App Router) — backend = route handlers + middleware (no separate server)
- **UI**: React 19 + Tailwind CSS 4
- **Wallet / Chain**: wagmi v2 + viem (EVM connect + x402 signing)
- **Payments**: x402 (`x402-next` middleware + `x402-fetch` client) on Base Sepolia
- **Blockchain**: Ethereum mainnet (read context) for the MVP; payments on Base Sepolia
- **Data (MVP)**: in-memory, mock-first behind `LiquifyClient` / `PriceOracle` interfaces — no DB yet

## Project Structure (expected)

```
src/
  app/          # Next.js App Router pages and layouts
  components/   # Shared UI components
  hooks/        # Custom React hooks
  lib/          # Utilities, helpers, constants
  types/        # TypeScript types
public/         # Static assets
```

## Conventions

- TypeScript throughout — no `any`, prefer explicit types
- Tailwind for all styling — no CSS modules or inline styles
- Components are named exports, not default exports (except page.tsx / layout.tsx)
- Fetch / mutations go in server actions or API routes, not directly in components
- wagmi + viem handle all wallet connection / signing — do not add a second wallet library
- Tax math (`src/lib/tax/`) is pure & decimal-safe: bigint base units for quantities, decimal.js for USD — never floats

## Commands

```bash
npm run dev      # start dev server
npm run build    # production build
npm run lint     # eslint
npm run typecheck # tsc --noEmit
```

## Environment Variables

```
# Wallet connect (wagmi) — optional WalletConnect project id
NEXT_PUBLIC_WC_PROJECT_ID=

# x402 payment gate (Base Sepolia)
X402_FACILITATOR_URL=
X402_PAY_TO=               # merchant address receiving USDC
X402_USDC_ADDRESS=        # USDC contract on base-sepolia
X402_DEMO_MODE=false      # true = bypass payment gate for offline demos
NEXT_PUBLIC_X402_DEMO_MODE=false

# Data sources (mock-first; unset = use mocks)
LIQUIFY_API_KEY=
COINGECKO_API_KEY=
```

## Git Conventions

- Every commit made with Claude Code assistance **must** include the co-author trailer:
  ```
  Co-authored-by: Claude <noreply@anthropic.com>
  ```
- Use conventional commit prefixes: `feat:`, `fix:`, `chore:`, `docs:`, `refactor:`
- Do not commit `.env.local` or any file containing secrets

## Notes

- Project brief & MVP scope: `memory-bank/projectbrief.md`
- Full product spec (all 5 chains, all protocols): the DeFi TaxGen + x402 PRD v1.0
- MVP slice = Ethereum only · Uniswap V2/V3 swaps + staking/airdrop income · FIFO only · free
  summary + $2 USDC CSV export via x402 on Base Sepolia. PDF and the other 4 chains are post-MVP.
