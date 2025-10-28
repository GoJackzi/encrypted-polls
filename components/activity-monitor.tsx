// components/activity-monitor.tsx
"use client"

import { useEffect, useRef, useState } from "react"
import { type ActivityLog } from "@/lib/mock-fhevm"

interface ActivityMonitorProps {
  logs: ActivityLog[]
  className?: string
}

export function ActivityMonitor({ logs, className = "" }: ActivityMonitorProps) {
  const [isExpanded, setIsExpanded] = useState(true)
  const [stats, setStats] = useState({
    encryptedOps: 0,
    computations: 0,
    aggregations: 0,
    decryptions: 0
  })
  const logsEndRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom when new logs arrive
  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [logs])

  // Update statistics
  useEffect(() => {
    const newStats = {
      encryptedOps: logs.filter(log => log.type === 'encryption').length,
      computations: logs.filter(log => log.type === 'computation').length,
      aggregations: logs.filter(log => log.type === 'aggregation').length,
      decryptions: logs.filter(log => log.type === 'decryption').length
    }
    setStats(newStats)
  }, [logs])

  const getLogIcon = (type: ActivityLog['type']) => {
    switch (type) {
      case 'encryption': return '🔐'
      case 'computation': return '⚡'
      case 'aggregation': return '📊'
      case 'decryption': return '🔓'
      case 'result': return '✅'
      case 'info': return 'ℹ️'
      default: return '📝'
    }
  }

  const getLogColor = (type: ActivityLog['type']) => {
    switch (type) {
      case 'encryption': return 'border-blue-200 bg-blue-50'
      case 'computation': return 'border-yellow-200 bg-yellow-50'
      case 'aggregation': return 'border-green-200 bg-green-50'
      case 'decryption': return 'border-purple-200 bg-purple-50'
      case 'result': return 'border-emerald-200 bg-emerald-50'
      case 'info': return 'border-gray-200 bg-gray-50'
      default: return 'border-gray-200 bg-gray-50'
    }
  }

  return (
    <div className={`activity-monitor bg-white border border-gray-200 rounded-lg shadow-lg ${className}`}>
      {/* Header */}
      <div className="monitor-header bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-t-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <span className="text-2xl">🔍</span>
              <h3 className="text-lg font-bold">Live FHEVM Activity Monitor</h3>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <span className="status-dot w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              <span>Mock FHEVM Active</span>
            </div>
          </div>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-white hover:text-gray-200 transition-colors"
          >
            {isExpanded ? '▼' : '▶'}
          </button>
        </div>
      </div>

      {/* Statistics Bar */}
      {isExpanded && (
        <div className="stats-bar bg-gray-50 border-b border-gray-200 p-3">
          <div className="grid grid-cols-4 gap-4 text-center">
            <div className="stat-item">
              <div className="text-lg font-bold text-blue-600">{stats.encryptedOps}</div>
              <div className="text-xs text-gray-600">🔐 Encryptions</div>
            </div>
            <div className="stat-item">
              <div className="text-lg font-bold text-yellow-600">{stats.computations}</div>
              <div className="text-xs text-gray-600">⚡ Computations</div>
            </div>
            <div className="stat-item">
              <div className="text-lg font-bold text-green-600">{stats.aggregations}</div>
              <div className="text-xs text-gray-600">📊 Aggregations</div>
            </div>
            <div className="stat-item">
              <div className="text-lg font-bold text-purple-600">{stats.decryptions}</div>
              <div className="text-xs text-gray-600">🔓 Decryptions</div>
            </div>
          </div>
        </div>
      )}

      {/* Logs Container */}
      {isExpanded && (
        <div className="logs-container max-h-96 overflow-y-auto p-4 space-y-3">
          {logs.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              <div className="text-4xl mb-2">🔍</div>
              <p>No FHEVM activity yet</p>
              <p className="text-sm">Vote on a poll to see live FHEVM operations!</p>
            </div>
          ) : (
            logs.map((log) => (
              <div
                key={log.id}
                className={`log-entry border-l-4 p-3 rounded-r-lg transition-all duration-300 ${getLogColor(log.type)}`}
              >
                <div className="flex items-start space-x-3">
                  <div className="text-lg flex-shrink-0 mt-0.5">
                    {getLogIcon(log.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-medium text-gray-800">
                        {log.message}
                      </p>
                      <span className="text-xs text-gray-500 flex-shrink-0 ml-2">
                        {log.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                    <div className="text-xs text-gray-600 bg-white bg-opacity-50 p-2 rounded">
                      💡 {log.technical}
                    </div>
                    {log.pollId !== undefined && (
                      <div className="text-xs text-blue-600 mt-1 font-medium">
                        Poll {log.pollId}
                      </div>
                    )}
                    {log.encryptedData && (
                      <div className="text-xs text-gray-500 mt-1 font-mono">
                        Data: {log.encryptedData.substring(0, 20)}...
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
          <div ref={logsEndRef} />
        </div>
      )}

      {/* Footer */}
      {isExpanded && (
        <div className="monitor-footer bg-gray-50 border-t border-gray-200 p-3 rounded-b-lg">
          <div className="flex items-center justify-between text-xs text-gray-600">
            <div className="flex items-center space-x-4">
              <span>📊 Total Operations: {logs.length}</span>
              <span>🕒 Last Update: {logs.length > 0 ? logs[logs.length - 1].timestamp.toLocaleTimeString() : 'Never'}</span>
            </div>
            <div className="text-blue-600 font-medium">
              Educational FHEVM Demo
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Compact version for smaller screens
export function CompactActivityMonitor({ logs }: { logs: ActivityLog[] }) {
  const recentLogs = logs.slice(-3) // Show only last 3 logs

  return (
    <div className="compact-activity-monitor bg-white border border-gray-200 rounded-lg p-3">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-sm font-bold text-gray-800">🔍 FHEVM Activity</h4>
        <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded">
          {logs.length} ops
        </span>
      </div>
      <div className="space-y-2">
        {recentLogs.length === 0 ? (
          <p className="text-xs text-gray-500">No activity yet</p>
        ) : (
          recentLogs.map((log) => (
            <div key={log.id} className="text-xs text-gray-600">
              <span className="font-medium">{log.message}</span>
            </div>
          ))
        )}
      </div>
    </div>
  )
}



