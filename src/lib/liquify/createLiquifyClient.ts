import { liquifyConfig } from "@/lib/config/env";
import { HttpLiquifyClient } from "./HttpLiquifyClient";
import type { LiquifyClient } from "./LiquifyClient";
import { MockLiquifyClient } from "./MockLiquifyClient";

/**
 * Factory for the active Liquify client. Returns the mock unless a real API
 * key is configured (the live HTTP client lands here post-MVP, behind the
 * same `LiquifyClient` interface).
 */
export function createLiquifyClient(address?: string): LiquifyClient {
  // Always use mocks for the demo wallet to ensure the dashboard is rich for the video
  if (address?.toLowerCase() === "0x1111111111111111111111111111111111111111") {
    return new MockLiquifyClient();
  }
  if (liquifyConfig()) return new HttpLiquifyClient();
  return new MockLiquifyClient();
}
