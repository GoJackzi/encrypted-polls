"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Copy, Trash2 } from "lucide-react"

interface LogEntry {
  id: string
  timestamp: string
  level: "info" | "success" | "warning" | "error" | "debug"
  category: "fhevm" | "vote" | "blockchain" | "ui"
  message: string
  data?: any
}

function isRelevantLog(log: LogEntry): boolean {
  // Show all logs for now to ensure we see activity
  return true
  
  // Original filtering logic (commented out for debugging)
  /*
  if (log.category === "fhevm") {
    return (
      log.message.includes("Encrypting vote") ||
      log.message.includes("Relayer initialized") ||
      log.message.includes("Decryption requested") ||
      log.message.includes("Decryption completed") ||
      log.message.includes("Vote encryption completed") ||
      log.message.includes("Failed to initialize FHEVM")
    )
  }
  if (log.category === "vote") {
    return (
      log.message.includes("Submitting vote") ||
      log.message.includes("Submitting encrypted vote") ||
      log.message.includes("Vote transaction sent") ||
      log.message.includes("Vote confirmed") ||
      log.message.includes("Vote submission failed") ||
      log.message.includes("Vote submitted successfully") ||
      log.message.includes("Voting error")
    )
  }
  if (log.category === "blockchain") {
    return (
      log.message.includes("Tx mined") ||
      log.message.includes("Decrypt call sent") ||
      log.message.includes("Contract event received") ||
      log.message.includes("Submitting vote via connected wallet") ||
      log.message.includes("Contract submission failed")
    )
  }
  if (log.category === "ui") {
    return (
      log.message.includes("Moved to next question") ||
      log.message.includes("Progress updated") ||
      log.message.includes("Decrypt button pressed") ||
      log.message.includes("Vote state saved")
    )
  }
  return false
  */
}

interface DebugPanelProps {
  logs: LogEntry[]
  onClearLogs: () => void
}

export function PollDebugPanel({ logs, onClearLogs }: DebugPanelProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const isAutoScrollingRef = useRef(false)

  const relevantLogs = logs.filter(isRelevantLog)
  const displayLogs = relevantLogs.length > 0 ? relevantLogs.slice(-20).reverse() : logs.slice(-20).reverse()


  useEffect(() => {
    // Keep scroll at top when new logs are added
    if (!containerRef.current) return

    const container = containerRef.current
    
    // Always keep scroll at the top
    isAutoScrollingRef.current = true
    requestAnimationFrame(() => {
      container.scrollTop = 0
      setTimeout(() => {
        isAutoScrollingRef.current = false
      }, 100)
    })
  }, [displayLogs.length])

  const getLevelColor = (level: LogEntry["level"]) => {
    switch (level) {
      case "success":
        return "text-green-400"
      case "warning":
        return "text-yellow-400"
      case "error":
        return "text-red-400"
      case "debug":
        return "text-blue-400"
      default:
        return "text-white"
    }
  }

  const getCategoryColor = (category: LogEntry["category"]) => {
    switch (category) {
      case "fhevm":
        return "bg-purple-600"
      case "vote":
        return "bg-[#FED217]"
      case "blockchain":
        return "bg-green-600"
      case "ui":
        return "bg-blue-600"
      default:
        return "bg-gray-600"
    }
  }

  const copyLogs = () => {
    const text = displayLogs
      .map(
        (log) =>
          `[${log.timestamp}] [${log.level.toUpperCase()}] [${log.category}] ${
            log.message
          }${log.data ? "\n" + JSON.stringify(log.data, null, 2) : ""}`,
      )
      .join("\n")
    navigator.clipboard.writeText(text)
  }

  return (
    <Card className="w-full bg-black/95 border-gray-800 text-white shadow-lg">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-mono flex items-center gap-2">
            <span className="text-green-400">●</span>
            Poll Activity Monitor
            <span className="text-xs text-gray-400 font-normal">(Live)</span>
          </CardTitle>
          <div className="flex items-center gap-1">
            <Button onClick={copyLogs} size="sm" variant="ghost" className="h-6 w-6 p-0 text-gray-400 hover:text-white">
              <Copy className="h-3 w-3" />
            </Button>
            <Button
              onClick={onClearLogs}
              size="sm"
              variant="ghost"
              className="h-6 w-6 p-0 text-gray-400 hover:text-white"
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="text-xs text-gray-400 mb-1">
          Showing {displayLogs.length} of {logs.length} logs
        </div>

        <div
          ref={containerRef}
          className="bg-gray-900/60 rounded p-3 h-64 overflow-y-auto font-mono text-xs border border-gray-800"
          style={{ overflowAnchor: 'none' }}
        >
          {displayLogs.length === 0 ? (
            <div className="text-gray-500 text-center py-10">
              🧠 No activity yet
              <div className="text-xs mt-1 text-gray-600">Submit a vote or trigger decrypt to see logs</div>
            </div>
          ) : (
            displayLogs.map((log) => (
              <div key={log.id} className="mb-2 border-l-2 border-gray-700 pl-3">
                <div className="flex items-start gap-2">
                  <span className="text-gray-500 text-xs whitespace-nowrap">[{log.timestamp}]</span>
                  <Badge
                    variant="secondary"
                    className={`text-xs px-1 py-0 ${getCategoryColor(log.category)} text-black`}
                  >
                    {log.category}
                  </Badge>
                  <span className={`text-xs ${getLevelColor(log.level)}`}>{log.level.toUpperCase()}</span>
                </div>
                <div className="ml-2 mt-1">
                  <div className="text-white">{log.message}</div>
                  {log.data && (
                    <div className="text-gray-400 mt-1 whitespace-pre-wrap text-xs">
                      {typeof log.data === "string" ? log.data : JSON.stringify(log.data, null, 2)}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Made with love for Zama */}
        <div className="mt-3 pt-2 border-t border-gray-800">
          <div className="text-center text-xs text-gray-500">
            Made with ❤️ for{" "}
            <a 
              href="https://warpcast.com/zama" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-[#fed217] hover:text-[#fed217]/80 transition-colors"
            >
              @zama
            </a>
          </div>
        </div>

      </CardContent>
    </Card>
  )
}

export function usePollLogs() {
  const [logs, setLogs] = useState<LogEntry[]>([])

  const addLog = useCallback(
    (level: LogEntry["level"], category: LogEntry["category"], message: string, data?: any) => {
      const timestamp = new Date().toLocaleTimeString()
      const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      const newLog = { id, timestamp, level, category, message, data }
      setLogs((prev) => [...prev, newLog])
    },
    [],
  )

  const clearLogs = useCallback(() => setLogs([]), [])

  return { logs, addLog, clearLogs }
}
