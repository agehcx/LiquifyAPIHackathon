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

export interface SpecificIdResult {
  readonly disposals: GainLossRow[];
  readonly openLots: TaxLot[];
}

export type LotSelection = Record<string, string[]>;

function holdingPeriod(acquiredAt: number, disposedAt: number): HoldingPeriod {
  return disposedAt - acquiredAt > LONG_TERM_THRESHOLD_SECONDS
    ? "LONG_TERM"
    : "SHORT_TERM";
}

/**
 * Computes realized capital gains/losses by matching disposals against
 * acquisition lots based on user selection. Pure: events must already be sorted
 * ascending by (timestamp, logIndex).
 */
export function computeSpecificId(events: ClassifiedEvent[], lotSelections: LotSelection): SpecificIdResult {
  const queues = new Map<string, TaxLot[]>();
  const disposals: GainLossRow[] = [];

  // First, build up the lot queues from all acquisitions
  for (const ev of events) {
    if (ev.acquisition) {
      for (const acquisition of ev.acquisition) {
        const { amount, costBasisUsd } = acquisition;
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
  }


  for (const ev of events) {
    // ── Disposal (capital gain on the sent asset) ──
    if (ev.disposal) {
        for (const disposal of ev.disposal) {
            const { amount, proceedsUsd } = disposal;
            const token = amount.tokenAddress;
            const totalQty = amount.raw;
            let remaining = amount.raw;
            const queue = queues.get(token) ?? [];
            const selectedLotIds = lotSelections[ev.source.id] ?? [];

            while (gtZeroRaw(remaining)) {
                if (selectedLotIds.length === 0) {
                    // No selection for this disposal, or not enough lots selected.
                    // For now, we'll treat this as a zero-basis disposal.
                    // A real implementation would need a fallback strategy (e.g., FIFO).
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

                const lotId = selectedLotIds.shift()!;
                const lotIndex = queue.findIndex(l => l.id === lotId);

                if (lotIndex === -1) {
                    // Selected lot not found or already consumed.
                    // This indicates an error in the lot selection logic.
                    // We'll treat this as a zero-basis disposal for now.
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

                const lot = queue[lotIndex];
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
                    queue.splice(lotIndex, 1);
                } else {
                    queue[lotIndex] = { ...lot, quantityRaw: lotRemaining };
                }
            }
        }
    }
  }

  const openLots = [...queues.values()]
    .flat()
    .filter((lot) => gtZeroRaw(lot.quantityRaw));

  return { disposals, openLots };
}
