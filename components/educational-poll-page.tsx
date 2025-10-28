// components/educational-poll-page.tsx
"use client"

import { useState, useEffect } from "react"
import { POLLS, getPoll, getPollEducationalFocus, getPollDescription } from "@/data/polls"
import { VoteButton } from "@/components/vote-button"
import { ActivityMonitor } from "@/components/activity-monitor"
import { useFHEVM } from "@/lib/useFHEVM"
import { type ActivityLog } from "@/lib/mock-fhevm"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function EducationalPollPage() {
  const [currentPollIndex, setCurrentPollIndex] = useState(0)
  const { fhevm, loading, error, logs } = useFHEVM()
  const [hasVoted, setHasVoted] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [pollResults, setPollResults] = useState<{ votesA: number; votesB: number } | null>(null)

  const currentPoll = POLLS[currentPollIndex]
  const isLastPoll = currentPollIndex === POLLS.length - 1

  // Show loading state while FHEVM initializes
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-700">🎓 Initializing FHEVM Educational Demo...</h2>
          <p className="text-gray-500 mt-2">Setting up the mock FHEVM system</p>
        </div>
      </div>
    )
  }

  // Show error state if FHEVM failed to initialize
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-xl font-semibold text-red-700 mb-2">FHEVM Initialization Failed</h2>
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  const handleVote = async (option: string, pollId: number) => {
    if (hasVoted || !fhevm) return

    setHasVoted(true)

    try {
      // Step 1: Encrypt the vote
      const encryptedVote = await fhevm.createEncryptedInput(
        option === currentPoll.optionA ? 0 : 1,
        pollId
      )

      // Step 2: Submit encrypted vote
      await fhevm.submitEncryptedVote(encryptedVote, pollId)

      // Step 3: Request decryption (only for demonstration)
      if (isLastPoll) {
        await fhevm.requestDecryption(pollId)
        
        // Get results
        const results = await fhevm.getPollResults(pollId)
        setPollResults({ votesA: results.votesA, votesB: results.votesB })
        setShowResults(true)
      }

    } catch (error) {
      console.error('Vote process failed:', error)
    }
  }

  const handleNextPoll = () => {
    if (currentPollIndex < POLLS.length - 1) {
      setCurrentPollIndex(prev => prev + 1)
      setHasVoted(false)
      setShowResults(false)
      setPollResults(null)
    }
  }

  const handlePreviousPoll = () => {
    if (currentPollIndex > 0) {
      setCurrentPollIndex(prev => prev - 1)
      setHasVoted(false)
      setShowResults(false)
      setPollResults(null)
    }
  }

  const handleResetDemo = () => {
    setCurrentPollIndex(0)
    setHasVoted(false)
    setShowResults(false)
    setPollResults(null)
    if (fhevm) {
      fhevm.clearLogs()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            🔐 FHEVM Educational Demo
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Experience Fully Homomorphic Encryption through interactive voting. 
            Watch the live activity monitor to see how your votes are processed privately!
          </p>
          <div className="flex items-center justify-center space-x-4">
            <Badge variant="outline" className="text-blue-600">
              Poll {currentPollIndex + 1} of {POLLS.length}
            </Badge>
            <Badge variant="secondary" className="text-purple-600">
              {getPollEducationalFocus(currentPollIndex)}
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Poll Section */}
          <div className="space-y-4">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl text-center">
                  {currentPoll.question}
                </CardTitle>
                <CardDescription className="text-center">
                  {getPollDescription(currentPollIndex)}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                
                {/* Vote Buttons */}
                <div className="flex flex-col space-y-4">
                  <VoteButton
                    option={currentPoll.optionA}
                    pollId={currentPollIndex}
                    onVote={handleVote}
                    addLog={() => {}} // Mock FHEVM handles logging automatically
                    disabled={hasVoted}
                    className="w-full"
                  />
                  
                  <VoteButton
                    option={currentPoll.optionB}
                    pollId={currentPollIndex}
                    onVote={handleVote}
                    addLog={() => {}} // Mock FHEVM handles logging automatically
                    disabled={hasVoted}
                    className="w-full"
                  />
                </div>

                {/* Results Display */}
                {showResults && pollResults && (
                  <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <h3 className="font-semibold text-green-800 mb-2">📊 Poll Results</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>{currentPoll.optionA}:</span>
                        <span className="font-bold text-green-600">{pollResults.votesA} votes</span>
                      </div>
                      <div className="flex justify-between">
                        <span>{currentPoll.optionB}:</span>
                        <span className="font-bold text-red-600">{pollResults.votesB} votes</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Navigation */}
                <div className="flex justify-between items-center pt-4 border-t">
                  <Button
                    onClick={handlePreviousPoll}
                    disabled={currentPollIndex === 0}
                    variant="outline"
                  >
                    ← Previous
                  </Button>
                  
                  <div className="flex space-x-2">
                    {POLLS.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setCurrentPollIndex(index)
                          setHasVoted(false)
                          setShowResults(false)
                          setPollResults(null)
                        }}
                        className={`w-3 h-3 rounded-full transition-colors ${
                          index === currentPollIndex
                            ? 'bg-blue-600'
                            : index < currentPollIndex
                            ? 'bg-green-400'
                            : 'bg-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  
                  <Button
                    onClick={handleNextPoll}
                    disabled={currentPollIndex === POLLS.length - 1}
                    variant="outline"
                  >
                    Next →
                  </Button>
                </div>

                {/* Reset Button */}
                <div className="text-center">
                  <Button
                    onClick={handleResetDemo}
                    variant="ghost"
                    size="sm"
                    className="text-gray-500 hover:text-gray-700"
                  >
                    🔄 Reset Demo
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Activity Monitor */}
          <div className="space-y-4">
            <ActivityMonitor logs={logs} className="h-full" />
          </div>
        </div>

        {/* Educational Footer */}
        <div className="text-center text-sm text-gray-600 space-y-2">
          <p>
            🎓 This is an educational demonstration of FHEVM (Fully Homomorphic Encryption Virtual Machine)
          </p>
          <p>
            Each poll teaches different aspects of homomorphic encryption through interactive voting
          </p>
        </div>
      </div>
    </div>
  )
}
