import type { ClassifiedEvent, DecodedEvent } from "@/types/domain";
import type { PriceOracle } from "@/lib/pricing/PriceOracle";
import { valueOfAmountUsd } from "./money";

/** Thrown when a decoded event is missing legs required for its protocol. */
export class MalformedEventError extends Error {
  constructor(eventId: string, detail: string) {
    super(`Event ${eventId}: ${detail}`);
    this.name = "MalformedEventError";
  }
}

/**
 * Classifies a single decoded event into its tax treatment, resolving FMV via
 * the oracle. Pure aside from the injected oracle. The key invariant: every
 * token *received* (swap output OR income) produces an acquisition lot, so the
 * FIFO ledger stays consistent across event kinds.
 */
export async function classifyEvent(
  event: DecodedEvent,
  oracle: PriceOracle,
): Promise<ClassifiedEvent> {
  const base = { source: event, timestamp: event.timestamp } as const;

  switch (event.protocol) {
    case "UNISWAP_V2":
    case "UNISWAP_V3": {
      if (!event.sent || !event.received) {
        throw new MalformedEventError(event.id, "swap missing sent/received");
      }
      // Trade value = FMV of the asset given up (for a stablecoin sent leg this
      // is just its face value). Stablecoins are cash, so:
      //   - sending a stablecoin is NOT a taxable disposal;
      //   - receiving a stablecoin creates NO cost-basis lot.
      // The received-leg basis equals the trade value (equal-value assumption).
      const sentPrice = await oracle.getUsdPriceAt(
        event.sent.tokenAddress,
        event.timestamp,
      );
      const tradeValueUsd = valueOfAmountUsd(event.sent, sentPrice.usd);
      const sentIsCash = oracle.isStablecoin(event.sent.tokenAddress);
      const receivedIsCash = oracle.isStablecoin(event.received.tokenAddress);
      return {
        ...base,
        kind: "SWAP",
        treatment: "CAPITAL_GAIN",
        disposal: sentIsCash
          ? undefined
          : { amount: event.sent, proceedsUsd: tradeValueUsd },
        acquisition: receivedIsCash
          ? undefined
          : { amount: event.received, costBasisUsd: tradeValueUsd },
      };
    }

    case "STAKING":
    case "AIRDROP": {
      if (!event.received) {
        throw new MalformedEventError(event.id, "income missing received");
      }
      // FMV at receipt is BOTH ordinary income and the new lot's cost basis.
      const price = await oracle.getUsdPriceAt(
        event.received.tokenAddress,
        event.timestamp,
      );
      const fmvUsd = valueOfAmountUsd(event.received, price.usd);
      return {
        ...base,
        kind: event.protocol === "STAKING" ? "STAKING_INCOME" : "AIRDROP_INCOME",
        treatment: "ORDINARY_INCOME",
        incomeUsd: fmvUsd,
        acquisition: { amount: event.received, costBasisUsd: fmvUsd },
      };
    }

    default: {
      // Unrecognized protocol → ignored downstream.
      return { ...base, kind: "SWAP", treatment: "NON_TAXABLE" };
    }
  }
}
