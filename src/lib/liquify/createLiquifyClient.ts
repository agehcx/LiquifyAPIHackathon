import { liquifyConfig } from "@/lib/config/env";
import { HttpLiquifyClient } from "./HttpLiquifyClient";
import type { LiquifyClient } from "./LiquifyClient";
import { MockLiquifyClient } from "./MockLiquifyClient";

/**
 * Factory for the active Liquify client. Returns the mock unless a real API
 * key is configured (the live HTTP client lands here post-MVP, behind the
 * same `LiquifyClient` interface).
 */
export function createLiquifyClient(): LiquifyClient {
  if (liquifyConfig()) return new HttpLiquifyClient();
  return new MockLiquifyClient();
}
