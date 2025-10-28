"use client"

import { useState, useEffect } from "react"
import { PollCard } from "@/components/poll-card"
import { PollDebugPanel, usePollLogs } from "@/components/debug-panel"
import { useFHEVM } from "@/lib/useFHEVM"

const POLLS = [
  {
    id: 0,
    question: "Will Bitcoin reach $150k by end of 2025?",
    optionA: "Yes",
    optionB: "No",
  },
  {
    id: 1,
    question: "Should AI development be regulated?",
    optionA: "Yes, regulate it",
    optionB: "No, let it develop freely",
  },
  {
    id: 2,
    question: "Is remote work the future?",
    optionA: "Yes, remote is better",
    optionB: "No, office work is better",
  },
  {
    id: 3,
    question: "Should we colonize Mars?",
    optionA: "Yes, let's go to Mars",
    optionB: "No, focus on Earth",
  },
  {
    id: 4,
    question: "Is cryptocurrency the future of money?",
    optionA: "Yes, crypto will replace fiat",
    optionB: "No, traditional money will remain",
  },
]

export default function SinglePollPage() {
  const [currentPollIndex, setCurrentPollIndex] = useState(0)
  const [pendingTransactions, setPendingTransactions] = useState<Set<number>>(new Set())
  const { logs, addLog, clearLogs } = usePollLogs()
  const { fhevm, loading, error, logs: fhevmLogs } = useFHEVM()
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)
  

  const currentPoll = POLLS[currentPollIndex]
  const totalPolls = POLLS.length

  // Convert FHEVM ActivityLog to LogEntry format for display
  const convertActivityLogToLogEntry = (activityLog: any) => {
    const levelMap: { [key: string]: string } = {
      'info': 'info',
      'success': 'success', 
      'warning': 'warning',
      'error': 'error',
      'debug': 'debug',
      'encryption': 'info',
      'computation': 'info',
      'aggregation': 'info',
      'decryption': 'info',
      'result': 'success',
      'relayer': 'info',
      'contract': 'info'
    }
    
    const categoryMap: { [key: string]: string } = {
      'info': 'ui',
      'success': 'vote',
      'warning': 'ui',
      'error': 'ui',
      'debug': 'ui',
      'encryption': 'fhevm',
      'computation': 'fhevm',
      'aggregation': 'fhevm',
      'decryption': 'fhevm',
      'result': 'vote',
      'relayer': 'fhevm',
      'contract': 'blockchain'
    }

    return {
      id: activityLog.id,
      timestamp: activityLog.timestamp.toLocaleTimeString(),
      level: levelMap[activityLog.type] || 'info',
      category: categoryMap[activityLog.type] || 'ui',
      message: activityLog.message,
      data: activityLog.technical
    }
  }


  // Convert and display FHEVM logs
  useEffect(() => {
    console.log("[Debug] FHEVM logs effect triggered:", { fhevmLogsCount: fhevmLogs?.length })
    if (fhevmLogs && fhevmLogs.length > 0) {
      // Clear existing logs and add all FHEVM logs
      clearLogs()
      console.log("[Debug] Cleared logs, adding all FHEVM logs:", fhevmLogs.length)
      
      fhevmLogs.forEach(activityLog => {
        const logEntry = convertActivityLogToLogEntry(activityLog)
        console.log("[Debug] Converting and adding log:", logEntry)
        addLog(logEntry.level as any, logEntry.category as any, logEntry.message, logEntry.data)
      })
    }
  }, [fhevmLogs, addLog, clearLogs])

  // Clear logs when navigating to a different poll (but don't clear FHEVM logs)
  useEffect(() => {
    // Don't clear logs on navigation - let FHEVM logs persist
    // clearLogs()
    // addLog("info", "ui", `📱 Navigated to poll ${currentPollIndex + 1}/${totalPolls}`)
  }, [currentPollIndex, clearLogs, addLog, totalPolls])

  // Swipe gesture handlers
  const minSwipeDistance = 50

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
  }

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return
    
    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > minSwipeDistance
    const isRightSwipe = distance < -minSwipeDistance

    if (isLeftSwipe && currentPollIndex < POLLS.length - 1) {
      // Swipe left - go to next poll
      setCurrentPollIndex(currentPollIndex + 1)
    }
    if (isRightSwipe && currentPollIndex > 0) {
      // Swipe right - go to previous poll
      setCurrentPollIndex(currentPollIndex - 1)
    }
  }




  const addPendingTransaction = (pollId: number) => {
    setPendingTransactions(prev => new Set(prev).add(pollId))
  }

  const removePendingTransaction = (pollId: number) => {
    setPendingTransactions(prev => {
      const newSet = new Set(prev)
      newSet.delete(pollId)
      return newSet
    })
  }

  return (
    <div 
      className="min-h-screen bg-black text-white"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <div className="mx-auto max-w-[420px] px-4 py-6">
        {/* Header */}
        <div className="mb-6 text-center">
          <h1 className="mb-2 text-2xl font-bold text-[#fed217]">Encrypted Polls</h1>
          <p className="text-sm text-gray-400">Vote privately with Zama FHEVM encryption</p>
        </div>


        {/* Instructions */}
        <div className="mb-6 text-center text-xs text-gray-500">
          <p>💡 Vote on the poll below • Watch FHEVM operations in the activity log</p>
          <p className="mt-1 text-gray-600">📱 Swipe left/right or use buttons to navigate polls</p>
        </div>

        {/* Transaction Status */}
        <div className="mb-6 text-center">
          {pendingTransactions.size > 0 && (
            <div className="text-sm text-yellow-400">
              {pendingTransactions.size} transaction{pendingTransactions.size > 1 ? 's' : ''} pending
            </div>
          )}
        </div>

        {/* Poll Navigation */}
        <div className="mb-4 flex items-center justify-between">
          {/* Previous Button */}
          <button
            onClick={() => setCurrentPollIndex(Math.max(0, currentPollIndex - 1))}
            disabled={currentPollIndex === 0}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
              currentPollIndex === 0
                ? 'opacity-50 cursor-not-allowed'
                : 'hover:bg-gray-800 active:scale-95'
            }`}
          >
            <svg className="w-4 h-4 text-[#fed217]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <div className="w-5 h-5 bg-[#fed217] rounded flex items-center justify-center">
              <span className="text-black font-bold text-xs">Z</span>
            </div>
          </button>

          {/* Dots */}
          <div className="flex space-x-2">
            {POLLS.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentPollIndex(index)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentPollIndex
                    ? 'bg-[#fed217]'
                    : 'bg-gray-600'
                }`}
              />
            ))}
          </div>

          {/* Next Button */}
          <button
            onClick={() => setCurrentPollIndex(Math.min(POLLS.length - 1, currentPollIndex + 1))}
            disabled={currentPollIndex === POLLS.length - 1}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
              currentPollIndex === POLLS.length - 1
                ? 'opacity-50 cursor-not-allowed'
                : 'hover:bg-gray-800 active:scale-95'
            }`}
          >
            <div className="w-5 h-5 bg-[#fed217] rounded flex items-center justify-center">
              <span className="text-black font-bold text-xs">Z</span>
            </div>
            <svg className="w-4 h-4 text-[#fed217]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Single Poll Card */}
        <div className="mb-6">
          <PollCard 
            poll={currentPoll} 
            addLog={addLog}
            clearLogs={clearLogs}
            onTransactionStart={() => addPendingTransaction(currentPoll.id)}
            onTransactionComplete={() => removePendingTransaction(currentPoll.id)}
          />
        </div>



        {/* Debug Panel */}
        <PollDebugPanel logs={logs} onClearLogs={clearLogs} />
      </div>
    </div>
  )
}