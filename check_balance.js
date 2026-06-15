const { createPublicClient, http, formatEther, formatUnits } = require('viem');
const { baseSepolia } = require('viem/chains');

const client = createPublicClient({
  chain: baseSepolia,
  transport: http()
});

const USDC_ADDRESS = "0x036CbD53842c5426634e7929541eC2318f3dCF7e";
const USER_ADDRESS = "0x994814619Dff01A7C33610F999F861043Eb54d13";

async function main() {
  try {
    const ethBalance = await client.getBalance({ address: USER_ADDRESS });
    console.log("ETH Balance:", formatEther(ethBalance));

    const usdcBalance = await client.readContract({
      address: USDC_ADDRESS,
      abi: [{ name: "balanceOf", type: "function", stateMutability: "view", inputs: [{ name: "account", type: "address" }], outputs: [{ name: "", type: "uint256" }] }],
      functionName: "balanceOf",
      args: [USER_ADDRESS]
    });
    console.log("USDC Balance:", formatUnits(usdcBalance, 6));
  } catch (err) {
    console.error(err);
  }
}

main();
