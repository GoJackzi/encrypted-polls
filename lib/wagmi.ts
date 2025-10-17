// lib/wagmi.ts
import { createAppKit } from "@reown/appkit/react"
import { sepolia } from "viem/chains"
import { http, createConfig } from "wagmi"

let appKit: any = null

export async function initializeAppKit() {
  if (appKit) return appKit

  try {
    const projectId =
      process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "9d8066195ba1b120ea780b7534548963"
    
    console.log("[Reown Config] Using Project ID:", projectId)

    appKit = await createAppKit({
      projectId,
      chains: [sepolia],
      networks: [sepolia], // Add this required property for external wallet support
      metadata: {
        name: "Encrypted Polls",
        description: "Zama FHEVM-powered Farcaster Mini-App (Sepolia Testnet)",
        url: "https://encryptedpolls.xyz",
        icons: [],
      },
      features: {
        analytics: false,
        explorer: false,
        notifications: false,
      },
    })

    console.log("[Reown Config] ✅ AppKit initialized successfully")
  } catch (err) {
    console.error(
      "[Reown Config] ❌ Failed to fetch project config. Using local fallback.",
      err
    )
    appKit = { connect: () => console.log("Using local AppKit fallback") }
  }

  return appKit
}

// Wagmi config for FHEVM integration
export const wagmiConfig = createConfig({
  chains: [sepolia],
  transports: {
    [sepolia.id]: http('https://eth-sepolia.g.alchemy.com/v2/RSaO0kH_yHZrcI8-GfcF4YOT3t4bSDpQ'),
  },
  ssr: true,
})