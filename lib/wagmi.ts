// lib/wagmi.ts
// Simplified wagmi config without Reown AppKit for hybrid mock FHEVM
import { sepolia } from "viem/chains"
import { http, createConfig } from "wagmi"

// Simple wagmi config for FHEVM integration (no wallet connection needed for hybrid mock)
export const wagmiConfig = createConfig({
  chains: [sepolia],
  transports: {
    [sepolia.id]: http(process.env.NEXT_PUBLIC_ALCHEMY_SEPOLIA_URL || 'https://eth-sepolia.g.alchemy.com/v2/YOUR_API_KEY_HERE'),
  },
  ssr: true,
})