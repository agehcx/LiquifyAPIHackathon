import { liquifyConfig } from "@/lib/config/env";
import { parseDecodedEvents } from "@/lib/liquify/schema";
import type { Address, DecodedEvent } from "@/types/domain";
import type { GetEventsOptions, LiquifyClient } from "./LiquifyClient";

/**
 * Real implementation of LiquifyClient that fetches data from the Liquify Indexer API.
 */
export class HttpLiquifyClient implements LiquifyClient {
  private readonly apiUrl: string;
  private readonly apiKey: string;

  constructor() {
    const config = liquifyConfig();
    if (!config) {
      throw new Error("Liquify API URL and API Key must be configured.");
    }
    this.apiUrl = config.apiUrl;
    this.apiKey = config.apiKey;
  }

  async getDecodedEvents(
    address: Address,
    chainId: number,
    opts?: GetEventsOptions,
  ): Promise<DecodedEvent[]> {
    const url = new URL(`${this.apiUrl}/api/v1/chains/${chainId}/addresses/${address}/events`);

    if (opts?.fromTs) {
      url.searchParams.set("fromTs", opts.fromTs.toString());
    }
    if (opts?.toTs) {
      url.searchParams.set("toTs", opts.toTs.toString());
    }

    const response = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(
        `Failed to fetch events from Liquify API: ${response.status} ${response.statusText} - ${errorBody}`,
      );
    }

    const json = await response.json();
    return parseDecodedEvents(json);
  }
}
