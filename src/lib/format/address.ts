import { isAddress } from "viem";

export { isAddress };

/** Shorten an address for display, e.g. 0x1234…cdef. */
export function truncateAddress(address: string): string {
  if (address.length < 10) return address;
  return `${address.slice(0, 6)}…${address.slice(-4)}`;
}
