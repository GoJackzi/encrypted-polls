"use client"

import React from "react"
import { WagmiProvider } from "wagmi"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { wagmiConfig } from "@/lib/wagmi"
import { useFHEVM } from "../lib/useFHEVM"
import { sdk } from "@farcaster/miniapp-sdk"
import { ThemeProvider } from "@/components/theme-provider"

// Ensure Farcaster Mini-App SDK signals "ready" once loaded
function useFarcasterReady() {
  React.useEffect(() => {
    try {
      sdk.actions.ready()
      console.log("[Mini-App] Farcaster SDK ready")
    } catch (err) {
      console.warn("[Mini-App] SDK ready failed:", err)
    }
  }, [])
}

const queryClient = new QueryClient()

function FHEVMProvider({ children }: { children: React.ReactNode }) {
  const { fhevm, loading } = useFHEVM()

  if (loading) return <div className="text-center p-4">Initializing FHEVM...</div>

  if (!fhevm)
    return (
      <div className="text-red-500 text-center p-4">
        ❌ Failed to initialize FHEVM
      </div>
    )

  return <>{children}</>
}

export function Providers({ children }: { children: React.ReactNode }) {
  useFarcasterReady()

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <FHEVMProvider>
            {children}
          </FHEVMProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}