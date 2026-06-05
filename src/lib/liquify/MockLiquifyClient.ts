import type { Address, DecodedEvent } from "@/types/domain";
import type { GetEventsOptions, LiquifyClient } from "./LiquifyClient";
import { FIXTURE_EVENTS } from "./fixtures";

/**
 * Fixture-backed Liquify client. Returns the demo wallet's events for any
 * address (so the demo works with any input), filtered by the requested
 * timestamp window and sorted by (timestamp, logIndex).
 */
export class MockLiquifyClient implements LiquifyClient {
  constructor(private readonly events: DecodedEvent[] = FIXTURE_EVENTS) {}

  async getDecodedEvents(
    _address: Address,
    opts: GetEventsOptions = {},
  ): Promise<DecodedEvent[]> {
    const { fromTs, toTs } = opts;
    return this.events.filter(
      (e) =>
        (fromTs === undefined || e.timestamp >= fromTs) &&
        (toTs === undefined || e.timestamp <= toTs),
    );
  }
}
