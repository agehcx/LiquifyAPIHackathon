import { createConfig, http } from "wagmi";
import { baseSepolia, mainnet, bsc, arbitrum, optimism, avalanche } from "wagmi/chains";
import { injected } from "wagmi/connectors";

/**
 * wagmi config. Ethereum mainnet provides read context for the MVP scan;
 * Base Sepolia is the network the x402 payment is signed on. Injected
 * (MetaMask / Coinbase Wallet) is the connector for the demo.
 */
export const wagmiConfig = createConfig({
  chains: [mainnet, baseSepolia, bsc, arbitrum, optimism, avalanche],
  connectors: [injected()],
  ssr: true,
  transports: {
    [mainnet.id]: http(),
    [baseSepolia.id]: http(),
    [bsc.id]: http(),
    [arbitrum.id]: http(),
    [optimism.id]: http(),
    [avalanche.id]: http(),
  },
});

declare module "wagmi" {
  interface Register {
    config: typeof wagmiConfig;
  }
}
