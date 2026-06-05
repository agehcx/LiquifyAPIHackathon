import { z } from "zod";
import type { DecodedEvent } from "@/types/domain";

const addressSchema = z
  .string()
  .regex(/^0x[0-9a-fA-F]+$/, "must be a 0x-prefixed hex string");

const decimalStringSchema = z
  .string()
  .regex(/^-?\d+$/, "must be an integer string (base units)");

const tokenAmountSchema = z.object({
  tokenAddress: addressSchema,
  symbol: z.string().min(1),
  decimals: z.number().int().nonnegative(),
  raw: decimalStringSchema,
});

export const decodedEventSchema = z.object({
  id: z.string().min(1),
  txHash: addressSchema,
  logIndex: z.number().int().nonnegative(),
  blockNumber: z.number().int().nonnegative(),
  timestamp: z.number().int().positive(),
  chainId: z.number().int().positive(),
  protocol: z.enum(["UNISWAP_V2", "UNISWAP_V3", "STAKING", "AIRDROP"]),
  eventName: z.string().min(1),
  wallet: addressSchema,
  sent: tokenAmountSchema.optional(),
  received: tokenAmountSchema.optional(),
  raw: z.record(z.string(), z.unknown()),
});

/** Parse + validate an array of raw decoded events (fixture or live API). */
export function parseDecodedEvents(input: unknown): DecodedEvent[] {
  return z.array(decodedEventSchema).parse(input) as DecodedEvent[];
}
