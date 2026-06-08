import type { Address } from "viem";

/**
 * Server-side x402 configuration, read from the environment. All payment fields
 * are optional so the app runs offline; when payTo is unset (or X402_DEMO_MODE
 * is "true") the export gate is bypassed for demos.
 */
export interface X402ServerConfig {
  readonly payTo?: Address;
  readonly network: "base-sepolia" | "base";
  readonly facilitatorUrl?: string;
  readonly usdcAddress?: Address;
  readonly priceUsd: string; // e.g. "$2"
}

export function x402ServerConfig(): X402ServerConfig {
  return {
    payTo: process.env.X402_PAY_TO as Address | undefined,
    network:
      process.env.X402_NETWORK === "base" ? "base" : "base-sepolia",
    facilitatorUrl: process.env.X402_FACILITATOR_URL,
    usdcAddress: process.env.X402_USDC_ADDRESS as Address | undefined,
    priceUsd: process.env.X402_PRICE ?? "$2",
  };
}

/**
 * Whether the payment gate should be bypassed. True when explicitly enabled or
 * when no payTo address is configured (so the demo works with zero setup).
 */
export function isPaymentDemoMode(): boolean {
  if (process.env.X402_DEMO_MODE === "true") return true;
  return !process.env.X402_PAY_TO;
}

/** Configuration for the real Liquify Indexer API client. */
export interface LiquifyConfig {
  readonly apiUrl: string;
  readonly apiKey: string;
}

export function liquifyConfig(): LiquifyConfig | undefined {
  const apiUrl = process.env.LIQUIFY_API_URL;
  const apiKey = process.env.LIQUIFY_API_KEY;
  if (!apiUrl || !apiKey) return undefined;
  return { apiUrl, apiKey };
}

/** Configuration for the real CoinGecko API client. */
export interface CoinGeckoConfig {
  readonly apiKey?: string; // only needed for Pro API
}

export function coinGeckoConfig(): CoinGeckoConfig {
  return { apiKey: process.env.COINGECKO_API_KEY };
}
