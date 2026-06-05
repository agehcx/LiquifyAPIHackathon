# LiquifyIndexerAPI

> Project brief TBD — full idea incoming.

## Stack

- **Express.js** — API Framework
- **PostgreSQL** — Database
- **TypeScript** — Type safety

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

## Project Structure

```
src/
  app/          # Next.js App Router pages and layouts
  components/   # Shared UI components
  hooks/        # Custom React hooks
  lib/          # Utilities, helpers, constants
  types/        # TypeScript types
public/         # Static assets
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

All Claude-assisted commits include:
```
Co-authored-by: Claude <noreply@anthropic.com>
```
# LiquifyAPIHackathon
