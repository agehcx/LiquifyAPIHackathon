import type { DecodedEvent } from "@/types/domain";
import { parseDecodedEvents } from "../schema";
import incomeJson from "./income.staking.json";
import swapsJson from "./swaps.uniswap.json";
import vitalikJson from "./vitalik.json";

/** The single demo wallet covered by the fixtures. */
export const DEMO_WALLET =
  "0x1111111111111111111111111111111111111111" as const;

export const VITALIK_WALLET =
  "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045" as const;

/**
 * All fixture events, Zod-validated and sorted ascending by (timestamp,
 * logIndex) — the same ordering contract the real Liquify client must honor.
 */
export const FIXTURE_EVENTS: DecodedEvent[] = parseDecodedEvents([
  ...swapsJson,
  ...incomeJson,
]).sort((a, b) =>
  a.timestamp !== b.timestamp
    ? a.timestamp - b.timestamp
    : a.logIndex - b.logIndex,
);

export const VITALIK_EVENTS: DecodedEvent[] = parseDecodedEvents(vitalikJson);
