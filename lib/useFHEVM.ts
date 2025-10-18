// lib/useFHEVM.ts
// HYBRID FHEVM: Real SDK data structures + Mock operations for Farcaster compatibility
"use client"

import { useEffect, useState } from "react"
import { createFHEVMInstanceWithFallback } from "./fhevm-config"
import { getHybridMockFHEVM, type ActivityLog } from "./hybrid-mock-fhevm"

export function useFHEVM() {
  const [fhevm, setFhevm] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [logs, setLogs] = useState<ActivityLog[]>([])

  useEffect(() => {
    // Only run in browser environment
    if (typeof window === "undefined") {
      setLoading(false)
      return
    }

    const initialize = async () => {
      console.log("[FHEVM Hook] 🔄 Initializing FHEVM System")

      try {
        // Skip real FHEVM attempt - go straight to hybrid mock
        console.log("[Debug] useFHEVM: Creating hybrid instance with callback")
        const hybridInstance = getHybridMockFHEVM((newLogs: ActivityLog[]) => {
          console.log("[Debug] useFHEVM: Callback triggered with", newLogs.length, "logs")
          setLogs(newLogs)
        }, null) // Pass null instead of realFhevm
        
        setFhevm(hybridInstance)
        setError(null) // Clear any previous errors
        console.log("[FHEVM Hook] ✅ FHEVM System initialized successfully")
      } catch (err) {
        console.error("[FHEVM Hook] ❌ FHEVM initialization failed:", err)
        setError(err instanceof Error ? err.message : "FHEVM initialization failed")
        setFhevm(null)
      } finally {
        setLoading(false)
      }
    }

    initialize()
  }, [])

      return { fhevm, loading, error, logs }
}