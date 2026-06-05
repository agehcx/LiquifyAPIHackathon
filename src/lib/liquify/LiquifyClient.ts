import type { Address, DecodedEvent } from "@/types/domain";

export interface GetEventsOptions {
  /** Inclusive lower bound (unix seconds). */
  readonly fromTs?: number;
  /** Inclusive upper bound (unix seconds). */
  readonly toTs?: number;
}

/**
 * Abstraction over the Liquify Indexer API. The MVP ships a mock implementation
 * backed by fixtures; the real HTTP client is dropped in behind this interface
 * with no change to the classification engine or UI.
 */
export interface LiquifyClient {
  /**
   * Returns decoded on-chain events involving `address`, sorted ascending by
   * (timestamp, logIndex). Implementations must guarantee that ordering.
   */
  getDecodedEvents(
    address: Address,
    opts?: GetEventsOptions,
  ): Promise<DecodedEvent[]>;
}
