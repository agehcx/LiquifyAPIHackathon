import type { Address } from "@/types/domain";

/** Normalize an address to lowercase for stable map keys. */
export function normalizeAddress(address: string): Address {
  return address.toLowerCase() as Address;
}

/** Cache/report key for an (address, taxYear) pair. */
export function reportKey(address: string, taxYear: number): string {
  return `${normalizeAddress(address)}:${taxYear}`;
}
