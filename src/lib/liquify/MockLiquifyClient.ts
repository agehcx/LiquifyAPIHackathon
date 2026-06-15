import type { Address, DecodedEvent } from "@/types/domain";
import type { GetEventsOptions, LiquifyClient } from "./LiquifyClient";
import { FIXTURE_EVENTS, VITALIK_EVENTS, VITALIK_WALLET } from "./fixtures";

/**
 * Fixture-backed Liquify client. Returns demo data for specific addresses
 * or a default set, filtered by the requested timestamp window.
 */
export class MockLiquifyClient implements LiquifyClient {
  constructor(private readonly events: DecodedEvent[] = FIXTURE_EVENTS) {}

  async getDecodedEvents(
    address: Address,
    chainId: number,
    opts: GetEventsOptions = {},
  ): Promise<DecodedEvent[]> {
    const { fromTs, toTs } = opts;
    
    // Choose the dataset based on the address
    const dataset = address.toLowerCase() === VITALIK_WALLET.toLowerCase() 
        ? VITALIK_EVENTS 
        : this.events;

    return dataset.filter(
      (e) =>
        e.chainId === chainId &&
        (fromTs === undefined || e.timestamp >= fromTs) &&
        (toTs === undefined || e.timestamp <= toTs),
    );
  }
}
