import { createConfig, http } from "wagmi";
import { baseSepolia, mainnet } from "wagmi/chains";
import { injected } from "wagmi/connectors";

/**
 * wagmi config. Ethereum mainnet provides read context for the MVP scan;
 * Base Sepolia is the network the x402 payment is signed on. Injected
 * (MetaMask / Coinbase Wallet) is the connector for the demo.
 */
export const wagmiConfig = createConfig({
  chains: [mainnet, baseSepolia],
  connectors: [injected()],
  ssr: true,
  transports: {
    [mainnet.id]: http(),
    [baseSepolia.id]: http(),
  },
});

declare module "wagmi" {
  interface Register {
    config: typeof wagmiConfig;
  }
}
