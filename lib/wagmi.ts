// lib/wagmi.ts
// Simplified wagmi config without Reown AppKit for hybrid mock FHEVM
import { sepolia } from "viem/chains"
import { http, createConfig } from "wagmi"

// Simple wagmi config for FHEVM integration (no wallet connection needed for hybrid mock)
export const wagmiConfig = createConfig({
  chains: [sepolia],
  transports: {
    [sepolia.id]: http('https://eth-sepolia.g.alchemy.com/v2/RSaO0kH_yHZrcI8-GfcF4YOT3t4bSDpQ'),
  },
  ssr: true,
})