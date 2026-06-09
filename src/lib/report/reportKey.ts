import type { Address } from "@/types/domain";
import type { CostBasisMethod } from "@/types/enums";

/** Normalize an address to lowercase for stable map keys. */
export function normalizeAddress(address: string): Address {
  return address.toLowerCase() as Address;
}

/** Cache/report key for an (address, chainId, taxYear) pair. */
export function reportKey(address: string, chainId: number, taxYear: number, costBasisMethod: CostBasisMethod): string {
  return `${normalizeAddress(address)}:${chainId}:${taxYear}:${costBasisMethod}`;
}
