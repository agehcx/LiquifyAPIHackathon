import { describe, expect, it } from "vitest";
import { MockLiquifyClient } from "./MockLiquifyClient";
import { DEMO_WALLET, FIXTURE_EVENTS } from "./fixtures";

describe("MockLiquifyClient", () => {
  it("loads Zod-validated fixtures sorted by (timestamp, logIndex)", () => {
    for (let i = 1; i < FIXTURE_EVENTS.length; i++) {
      expect(FIXTURE_EVENTS[i].timestamp).toBeGreaterThanOrEqual(
        FIXTURE_EVENTS[i - 1].timestamp,
      );
    }
    // Sanity: the demo scenario has 5 events (3 swaps + 2 income).
    expect(FIXTURE_EVENTS).toHaveLength(5);
  });

  it("returns all events for the demo wallet", async () => {
    const client = new MockLiquifyClient();
    const events = await client.getDecodedEvents(DEMO_WALLET);
    expect(events).toHaveLength(5);
  });

  it("filters by timestamp window", async () => {
    const client = new MockLiquifyClient();
    // Only 2025-08-01 onward (the sell + the two income events).
    const events = await client.getDecodedEvents(DEMO_WALLET, {
      fromTs: 1754006400,
    });
    expect(events.map((e) => e.eventName)).toEqual([
      "Swap",
      "RewardPaid",
      "Claimed",
    ]);
  });
});
