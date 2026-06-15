# DeFi TaxGen — Project Brief

## Hackathon Goals (Challenge 3)
Build a DeFi Tax Reporting tool using the **Liquify Indexer API** as the core data layer.

## The Solution
DeFi TaxGen is a high-performance, stateless tax reporting application that converts raw blockchain events into audit-ready financial documents.

### Core Value Props:
1. **Instant Scan:** Paste any address to fetch historical events via Liquify.
2. **Real-Time Classification:** Automatically identifies Swaps, Staking, Airdrops, and Transfers.
3. **FIFO Engine:** Implements industry-standard FIFO (First-In, First-Out) cost-basis accounting.
4. **Micropayment Gating:** Monetized via real on-chain USDC transfers on Base Sepolia.

## Key Technical Pillars

### 1. Data Layer (Liquify)
- **JSON-RPC 2.0:** Integrated directly with the Liquify Gateway.
- **Deep Log Scanning:** Custom implementation of `eth_getLogs` to perform multi-block history retrieval.
- **Robust Fallback:** A dedicated fixture database ensures the app is always available for demos.

### 2. Financial Engine (Pure Tax Logic)
- **Precision:** Uses `decimal.js` to eliminate floating-point errors.
- **Form 8949:** Maps blockchain realizations directly to IRS filing formats.
- **TDD:** 44+ tests covering FIFO matching, long-term vs short-term holding periods, and zero-basis handling.

### 3. Payment Layer (x402 Pattern)
- **Production Ready:** Direct USDC contract interaction via `viem`.
- **Stateless:** Uses transaction receipts for access verification, eliminating the need for a centralized user database.
- **Network Agnostic:** Built to support Base, Ethereum, and other EVM chains.

## MVP Vertical Slice
The current build represents a complete vertical slice:
1. **Connect:** Secure wallet connection (Phantom/MetaMask).
2. **Scan:** Real-time data retrieval.
3. **Analyze:** Visual P&L dashboard.
4. **Pay:** Real on-chain USDC settlement.
5. **Export:** Secure file generation and download.
