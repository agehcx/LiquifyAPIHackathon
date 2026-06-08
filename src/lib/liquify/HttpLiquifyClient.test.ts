import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { liquifyConfig } from "../config/env";
import { HttpLiquifyClient } from "./HttpLiquifyClient";
import { DEMO_WALLET, FIXTURE_EVENTS } from "./fixtures";
import { parseDecodedEvents } from "./schema";

// Mock the liquifyConfig to return a valid configuration for testing purposes
vi.mock("../config/env", () => ({
  liquifyConfig: vi.fn(() => ({
    apiUrl: "https://mock.liquify.api",
    apiKey: "test-api-key",
  })),
}));

describe("HttpLiquifyClient", () => {
  // Mock the global fetch function
  const mockFetch = vi.fn();
  global.fetch = mockFetch;

  beforeEach(() => {
    mockFetch.mockReset();
  });

  it("should construct the URL and headers correctly", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(FIXTURE_EVENTS),
    });

    const client = new HttpLiquifyClient();
    await client.getDecodedEvents(DEMO_WALLET, {
      fromTs: 1672531200,
      toTs: 1704067200,
    });

    expect(mockFetch).toHaveBeenCalledWith(
      `https://mock.liquify.api/api/v1/addresses/${DEMO_WALLET}/events?fromTs=1672531200&toTs=1704067200`,
      {
        headers: {
          Authorization: "Bearer test-api-key",
          "Content-Type": "application/json",
        },
      },
    );
  });

  it("should return parsed decoded events on success", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(FIXTURE_EVENTS),
    });

    const client = new HttpLiquifyClient();
    const events = await client.getDecodedEvents(DEMO_WALLET);

    expect(mockFetch).toHaveBeenCalledTimes(1);
    expect(events).toEqual(parseDecodedEvents(FIXTURE_EVENTS));
    expect(events).toHaveLength(5);
  });

  it("should throw an error if API response is not ok", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      statusText: "Internal Server Error",
      text: () => Promise.resolve("Something went wrong"),
    });

    const client = new HttpLiquifyClient();
    await expect(client.getDecodedEvents(DEMO_WALLET)).rejects.toThrow(
      "Failed to fetch events from Liquify API: 500 Internal Server Error - Something went wrong",
    );
  });

  it("should throw an error if liquifyConfig is missing", () => {
    // Temporarily mock liquifyConfig to return undefined
    (liquifyConfig as vi.Mock).mockReturnValueOnce(undefined);
    expect(() => new HttpLiquifyClient()).toThrow(
      "Liquify API URL and API Key must be configured.",
    );
  });
});
