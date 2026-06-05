import type {
  ClassifiedEvent,
  GainLossRow,
  HoldingPeriod,
  TaxLot,
} from "@/types/domain";
import { LONG_TERM_THRESHOLD_SECONDS } from "./constants";
import {
  basisForQty,
  gtZeroRaw,
  isZeroRaw,
  minRaw,
  proceedsSlice,
  subRaw,
  subUsd,
  unitBasisUsd,
} from "./money";

export interface FifoResult {
  readonly disposals: GainLossRow[];
  readonly openLots: TaxLot[];
}

function holdingPeriod(acquiredAt: number, disposedAt: number): HoldingPeriod {
  return disposedAt - acquiredAt > LONG_TERM_THRESHOLD_SECONDS
    ? "LONG_TERM"
    : "SHORT_TERM";
}

/**
 * Computes realized capital gains/losses by matching disposals against
 * acquisition lots First-In-First-Out. Pure: events must already be sorted
 * ascending by (timestamp, logIndex).
 *
 * Within each event the disposal is processed BEFORE the acquisition, so a
 * token received in event N cannot be matched against a disposal in the same
 * event. An empty lot queue yields a flagged zero-basis (max-gain) row rather
 * than throwing.
 */
export function computeFifo(events: ClassifiedEvent[]): FifoResult {
  const queues = new Map<string, TaxLot[]>();
  const disposals: GainLossRow[] = [];

  for (const ev of events) {
    // ── Disposal (capital gain on the sent asset) ──
    if (ev.disposal) {
      const { amount, proceedsUsd } = ev.disposal;
      const token = amount.tokenAddress;
      const totalQty = amount.raw;
      let remaining = amount.raw;
      const queue = queues.get(token) ?? [];

      while (gtZeroRaw(remaining)) {
        if (queue.length === 0) {
          // No basis on record → zero-basis disposal, flagged for review.
          const proceeds = proceedsSlice(proceedsUsd, remaining, totalQty);
          disposals.push({
            eventId: ev.source.id,
            tokenAddress: token,
            symbol: amount.symbol,
            decimals: amount.decimals,
            quantityRaw: remaining,
            acquiredAt: 0,
            disposedAt: ev.timestamp,
            proceedsUsd: proceeds,
            costBasisUsd: "0",
            gainLossUsd: proceeds,
            holdingPeriod: "SHORT_TERM",
            zeroBasis: true,
          });
          remaining = "0";
          break;
        }

        const lot = queue[0];
        const matched = minRaw(remaining, lot.quantityRaw);
        const proceeds = proceedsSlice(proceedsUsd, matched, totalQty);
        const basis = basisForQty(lot.costBasisUsdPerUnit, matched);

        disposals.push({
          eventId: ev.source.id,
          tokenAddress: token,
          symbol: amount.symbol,
          decimals: amount.decimals,
          quantityRaw: matched,
          acquiredAt: lot.acquiredAt,
          disposedAt: ev.timestamp,
          proceedsUsd: proceeds,
          costBasisUsd: basis,
          gainLossUsd: subUsd(proceeds, basis),
          holdingPeriod: holdingPeriod(lot.acquiredAt, ev.timestamp),
          zeroBasis: false,
        });

        const lotRemaining = subRaw(lot.quantityRaw, matched);
        remaining = subRaw(remaining, matched);
        if (isZeroRaw(lotRemaining)) {
          queue.shift();
        } else {
          queue[0] = { ...lot, quantityRaw: lotRemaining };
        }
      }

      queues.set(token, queue);
    }

    // ── Acquisition (swap output OR income) → new lot at the back ──
    if (ev.acquisition) {
      const { amount, costBasisUsd } = ev.acquisition;
      const token = amount.tokenAddress;
      const queue = queues.get(token) ?? [];
      queue.push({
        id: `${ev.source.id}:${token}`,
        tokenAddress: token,
        symbol: amount.symbol,
        acquiredAt: ev.timestamp,
        originEventId: ev.source.id,
        quantityRaw: amount.raw,
        originalQuantityRaw: amount.raw,
        costBasisUsdPerUnit: unitBasisUsd(costBasisUsd, amount.raw),
      });
      queues.set(token, queue);
    }
  }

  const openLots = [...queues.values()]
    .flat()
    .filter((lot) => gtZeroRaw(lot.quantityRaw));

  return { disposals, openLots };
}
