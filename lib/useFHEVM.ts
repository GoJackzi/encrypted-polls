// lib/useFHEVM.ts
// EDUCATIONAL DEMO: This hook uses MOCK FHEVM for educational purposes
"use client"

import { useEffect, useState } from "react"
import { getMockFHEVM, type ActivityLog } from "./mock-fhevm"

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
      console.log("[FHEVM Hook] 🎓 Initializing MOCK FHEVM for Educational Demo")

      try {
        // Initialize mock FHEVM with log callback
        const mockInstance = getMockFHEVM((newLogs: ActivityLog[]) => {
          setLogs(newLogs)
        })
        
        setFhevm(mockInstance)
        setError(null) // Clear any previous errors
        console.log("[FHEVM Hook] ✅ MOCK FHEVM initialized successfully for educational demo")
      } catch (err) {
        console.error("[FHEVM Hook] ❌ MOCK FHEVM initialization failed:", err)
        setError(err instanceof Error ? err.message : "MOCK FHEVM initialization failed")
        setFhevm(null)
      } finally {
        setLoading(false)
      }
    }

    initialize()
  }, [])

  return { fhevm, loading, error, logs }
}