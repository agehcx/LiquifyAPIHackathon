import { liquifyConfig } from "@/lib/config/env";
import type { Address, DecodedEvent, TokenAmount } from "@/types/domain";
import type { GetEventsOptions, LiquifyClient } from "./LiquifyClient";
import { FIXTURE_EVENTS } from "./fixtures";

/**
 * Real implementation of LiquifyClient that fetches data from a Liquify JSON-RPC Node.
 * It performs a deep scan for Transfer events (ERC20/ERC721).
 */
export class HttpLiquifyClient implements LiquifyClient {
  private readonly apiUrl: string;

  constructor() {
    const config = liquifyConfig();
    if (!config) {
      throw new Error("Liquify API URL and API Key must be configured.");
    }
    this.apiUrl = config.apiUrl;
  }

  async getDecodedEvents(
    address: Address,
    chainId: number,
    opts?: GetEventsOptions,
  ): Promise<DecodedEvent[]> {
    // 1. SPECIAL CASE: Demo Wallet
    if (address.toLowerCase() === "0x1111111111111111111111111111111111111111") {
      return FIXTURE_EVENTS;
    }

    // 2. Get current block
    const blockRes = await fetch(this.apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ jsonrpc: "2.0", id: 1, method: "eth_blockNumber", params: [] }),
    });
    const blockJson = await blockRes.json();
    const currentBlock = parseInt(blockJson.result, 16);

    // 3. Deep Scan: Fetch logs where wallet is Topic 1 (Sender) or Topic 2 (Receiver)
    // We scan the last 20,000 blocks (~3 days) for the demo to keep it fast
    const fromBlock = "0x" + (currentBlock - 20000).toString(16);
    const walletTopic = "0x000000000000000000000000" + address.slice(2).toLowerCase();

    const fetchLogs = async (topics: (string | null)[]) => {
      const res = await fetch(this.apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jsonrpc: "2.0",
          id: 2,
          method: "eth_getLogs",
          params: [{ fromBlock, toBlock: "latest", topics }],
        }),
      });
      const json = await res.json();
      return (json.result || []) as any[];
    };

    const [sentLogs, receivedLogs] = await Promise.all([
      fetchLogs([null, walletTopic]), // Sent
      fetchLogs([null, null, walletTopic]), // Received
    ]);

    // 4. Map to DecodedEvents
    const allLogs = [...sentLogs, ...receivedLogs];
    return allLogs.map((log) => {
      const isSender = log.topics[1]?.toLowerCase() === walletTopic;
      const amount: TokenAmount = {
        tokenAddress: log.address,
        symbol: "TOKEN", // We'd fetch this from the contract in production
        decimals: 18,
        raw: log.data === "0x" ? "0" : BigInt(log.data).toString(),
      };

      return {
        id: `${log.transactionHash}:${log.logIndex}`,
        txHash: log.transactionHash,
        logIndex: parseInt(log.logIndex, 16),
        blockNumber: parseInt(log.blockNumber, 16),
        timestamp: Math.floor(Date.now() / 1000), // Placeholder
        chainId,
        protocol: "ERC20",
        eventName: "Transfer",
        wallet: address,
        sent: isSender ? [amount] : [],
        received: isSender ? [] : [amount],
        raw: log,
      };
    });
  }
}
