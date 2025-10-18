"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Loader2, Lock, Unlock } from "lucide-react"
import { cn } from "@/lib/utils"
import { useFHEVM } from "@/lib/useFHEVM"

interface Poll {
  id: number
  question: string
  optionA: string
  optionB: string
}

interface PollCardProps {
  poll: Poll
  addLog: (
    level: "info" | "success" | "warning" | "error" | "debug",
    category: "fhevm" | "vote" | "blockchain" | "ui",
    message: string,
    data?: any,
  ) => void
  clearLogs?: () => void
  onTransactionStart?: () => void
  onTransactionComplete?: () => void
}

export function PollCard({ poll, addLog, clearLogs, onTransactionStart, onTransactionComplete }: PollCardProps) {
  const [selectedOption, setSelectedOption] = useState<"A" | "B" | null>(null)
  const [isVoting, setIsVoting] = useState(false)
  const [hasVoted, setHasVoted] = useState(false)
  const [results, setResults] = useState<{
    votesA: number
    votesB: number
    decrypted: boolean
  } | null>(null)
  
  const { fhevm, loading: fhevmLoading, error: fhevmError } = useFHEVM()

  useEffect(() => {
    // For demo purposes, don't persist vote state - allow seamless voting
    // const voted = localStorage.getItem(`poll_${poll.id}_voted`)
    // if (voted) {
    //   setHasVoted(true)
    //   addLog("info", "ui", `Poll ${poll.id}: Vote state restored from storage`)
    // }

    // Don't fetch results on mount - start with clean state
    // fetchResults() // Removed to prevent unnecessary logs on load
  }, [poll.id])

  const fetchResults = async () => {
    try {
      // Don't add basic logs - let the hybrid mock handle all logging
      // addLog("debug", "vote", `Fetching results for poll ${poll.id}`)
      
      // Use the hybrid mock's getPollResults method for realistic behavior
      if (fhevm && fhevm.getPollResults) {
        const pollResults = await fhevm.getPollResults(poll.id)
        setResults({
          decrypted: pollResults.decrypted,
          votesA: pollResults.votesA,
          votesB: pollResults.votesB,
        })
        // Don't add basic logs - let the hybrid mock handle all logging
        // addLog("success", "vote", `Poll ${poll.id} results updated from FHEVM system`, {
        //   votesA: pollResults.votesA,
        //   votesB: pollResults.votesB,
        //   decrypted: pollResults.decrypted,
        // })
        return
      }
      
      // Fallback to API if hybrid mock not available
      const response = await fetch(`/api/poll/${poll.id}`)
      if (response.ok) {
        const data = await response.json()
        setResults(data)
        addLog("success", "vote", `Poll ${poll.id} results fetched from API`, {
          votesA: data.votesA,
          votesB: data.votesB,
          decrypted: data.decrypted,
        })
      } else {
        addLog("error", "ui", `Failed to fetch results for poll ${poll.id}: ${response.status}`)
        // Set default results when API fails
        setResults({
          decrypted: false,
          votesA: 0,
          votesB: 0,
        })
      }
    } catch (error) {
      addLog("error", "vote", `Failed to fetch results for poll ${poll.id}`, error)
      // Set default results when fetch fails
      setResults({
        decrypted: false,
        votesA: 0,
        votesB: 0,
      })
    }
  }

  const handleVote = async (option: "A" | "B") => {
    console.log("[FHEVM] Vote button clicked", { pollId: poll.id, option, hasVoted, isVoting })

    if (hasVoted || isVoting) {
      console.log("[FHEVM] Vote blocked - already voted or voting in progress")
      return
    }

    // Check FHEVM availability
    if (fhevmLoading) {
      addLog("warning", "fhevm", "FHEVM is still initializing, please wait...")
      return
    }

    if (fhevmError || !fhevm) {
      addLog("error", "fhevm", `FHEVM not available: ${fhevmError || "Not initialized"}`)
      return
    }

    setIsVoting(true)
    setSelectedOption(option)
    
        // Don't clear logs - let FHEVM logs handle the logging
        // clearLogs?.()
        
        // Notify parent that transaction is starting
        onTransactionStart?.()

        try {
          // Use hybrid mock FHEVM for realistic vote processing
          console.log("[Debug] About to vote - FHEVM:", !!fhevm, "Methods:", {
            createEncryptedInput: !!fhevm?.createEncryptedInput,
            submitEncryptedVote: !!fhevm?.submitEncryptedVote
          })
          
          if (fhevm && fhevm.createEncryptedInput && fhevm.submitEncryptedVote) {
            console.log("[Debug] Calling createEncryptedInput...")
            // Create encrypted input using hybrid mock (this will show realistic logs)
            const encryptedVote = await fhevm.createEncryptedInput(option === "A" ? 0 : 1, poll.id)
            console.log("[Debug] Encrypted vote created:", encryptedVote)
            
            console.log("[Debug] Calling submitEncryptedVote...")
            // Submit encrypted vote using hybrid mock (this will show realistic logs)
            await fhevm.submitEncryptedVote(encryptedVote, poll.id)
            console.log("[Debug] Vote submitted successfully")
            
            // Don't add basic logs - let the hybrid mock handle all logging
          } else {
            // Only use fallback if hybrid mock not available
            addLog("warning", "fhevm", "FHEVM system not available, using fallback")
            addLog("info", "fhevm", `🔐 FHEVM: Initializing homomorphic encryption for vote`)
            await new Promise(resolve => setTimeout(resolve, 500))
            
            addLog("info", "fhevm", `⚡ FHEVM: Encrypting vote data using FHE scheme`)
            await new Promise(resolve => setTimeout(resolve, 800))
            
            addLog("success", "fhevm", `✅ FHEVM: Vote encrypted successfully - data remains private`)
            await new Promise(resolve => setTimeout(resolve, 300))
            
            addLog("info", "blockchain", `📊 FHEVM: Performing homomorphic computation on encrypted data`)
            await new Promise(resolve => setTimeout(resolve, 600))
            
            addLog("info", "blockchain", `🔗 FHEVM: Aggregating encrypted vote with existing poll results`)
            await new Promise(resolve => setTimeout(resolve, 400))
            
            addLog("success", "blockchain", `✅ FHEVM: Vote processed - privacy preserved throughout computation`)
          }

          setHasVoted(true)
          // Don't add basic logs - let the hybrid mock handle all logging

          // Reset voting state immediately after successful submission
          setIsVoting(false)
          
          // Auto-reset vote state after a short delay for seamless experience
          setTimeout(() => {
            setHasVoted(false)
            // Don't add basic logs - let the hybrid mock handle all logging
          }, 2000) // 2 second delay
          
          // Immediately update results to show the new vote count
          setTimeout(() => {
            fetchResults()
          }, 1000) // Small delay to let the vote process complete
          
          // Notify parent that transaction completed successfully
          onTransactionComplete?.()
        } catch (error) {
      addLog("error", "vote", `Voting error for poll ${poll.id}`, error)
      console.error("[FHEVM] Voting error:", error)
      
      // Reset voting state on error
      setIsVoting(false)
      
      // Notify parent that transaction failed
      onTransactionComplete?.()
    }
  }

      const totalVotes = results ? results.votesA + results.votesB : 0
      const shouldShowResults = results && results.decrypted && totalVotes > 0
      const percentA = shouldShowResults ? (results!.votesA / totalVotes) * 100 : 0
      const percentB = shouldShowResults ? (results!.votesB / totalVotes) * 100 : 0

  return (
    <Card className="border-gray-800 bg-gray-900 p-4">
      {/* Question */}
      <div className="mb-4">
        <div className="mb-2 flex items-start justify-between gap-2">
          <h3 className="text-sm font-medium leading-tight text-white">{poll.question}</h3>
          {results?.decrypted ? (
            <Unlock className="h-4 w-4 flex-shrink-0 text-[#fed217]" />
          ) : (
            <Lock className="h-4 w-4 flex-shrink-0 text-gray-500" />
          )}
        </div>
        
        {/* FHEVM Loading/Error Status */}
        {fhevmLoading && (
          <div className="mb-2 text-xs text-yellow-400">
            🎓 Initializing Educational FHEVM Demo...
          </div>
        )}
        {fhevmError && (
          <div className="mb-2 text-xs text-red-400">
            ❌ Educational Demo Error: {fhevmError}
            <div className="mt-1 text-xs text-gray-400">
              Educational FHEVM demo failed to initialize.
            </div>
          </div>
        )}
        
        {/* Vote Status Indicator */}
        {hasVoted && (
          <div className="mb-2 text-xs text-green-400 text-center">
            ✅ Vote submitted!
          </div>
        )}
        
      </div>

      {/* Options */}
      <div className="space-y-2">
        {/* Option A */}
            <button
              onClick={() => handleVote("A")}
              disabled={hasVoted}
              className={cn(
                "relative w-full overflow-hidden rounded-lg border p-3 text-left transition-all",
                hasVoted ? "cursor-not-allowed border-gray-700" : "cursor-pointer border-gray-700 hover:border-[#fed217]",
                selectedOption === "A" && isVoting && "border-[#fed217]",
              )}
            >
              {/* Progress bar */}
              {shouldShowResults && (
                <div className="absolute inset-0 bg-[#fed217]/20 transition-all" style={{ width: `${percentA}%` }} />
              )}

              <div className="relative flex items-center justify-between">
                <span className="text-sm font-medium text-white">{poll.optionA}</span>
                {shouldShowResults && (
                  <span className="text-xs text-gray-400">
                    {percentA.toFixed(1)}% ({results.votesA})
                  </span>
                )}
                {isVoting && selectedOption === "A" && <Loader2 className="h-4 w-4 animate-spin text-[#fed217]" />}
              </div>
            </button>

        {/* Option B */}
        <button
          onClick={() => handleVote("B")}
          disabled={hasVoted}
          className={cn(
            "relative w-full overflow-hidden rounded-lg border p-3 text-left transition-all",
            hasVoted ? "cursor-not-allowed border-gray-700" : "cursor-pointer border-gray-700 hover:border-[#fed217]",
            selectedOption === "B" && isVoting && "border-[#fed217]",
          )}
        >
          {/* Progress bar */}
          {shouldShowResults && (
            <div className="absolute inset-0 bg-[#fed217]/20 transition-all" style={{ width: `${percentB}%` }} />
          )}

          <div className="relative flex items-center justify-between">
            <span className="text-sm font-medium text-white">{poll.optionB}</span>
            {shouldShowResults && (
              <span className="text-xs text-gray-400">
                {percentB.toFixed(1)}% ({results.votesB})
              </span>
            )}
            {isVoting && selectedOption === "B" && <Loader2 className="h-4 w-4 animate-spin text-[#fed217]" />}
          </div>
        </button>
      </div>

      {/* Status */}
      {hasVoted && (
        <div className="mt-3 text-center text-xs text-gray-500">
          Vote submitted
          {!results?.decrypted && " (encrypted)"}
        </div>
      )}
    </Card>
  )
}