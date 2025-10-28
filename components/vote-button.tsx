// components/vote-button.tsx
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { EducationalPopup, useEducationalPopup } from "@/components/educational-popup"
import { type ActivityLog } from "@/lib/mock-fhevm"

interface VoteButtonProps {
  option: string
  pollId: number
  onVote: (option: string, pollId: number) => Promise<void>
  addLog: (log: Omit<ActivityLog, 'id' | 'timestamp'>) => void
  disabled?: boolean
  className?: string
}

export function VoteButton({ 
  option, 
  pollId, 
  onVote, 
  addLog, 
  disabled = false,
  className = ""
}: VoteButtonProps) {
  const [isVoting, setIsVoting] = useState(false)
  const { popupState, showPopup, hidePopup } = useEducationalPopup()

  const handleVote = async (event: React.MouseEvent) => {
    if (disabled || isVoting) return

    setIsVoting(true)

    try {
      // Show educational popup for encryption step
      showPopup('encryption', event, pollId)

      // Add initial log
      addLog({
        type: 'encryption',
        message: `🔐 Starting FHEVM process for "${option}" vote`,
        technical: 'Your vote will be encrypted using homomorphic encryption to preserve privacy',
        pollId
      })

      // Simulate the voting process with educational steps
      await onVote(option, pollId)

    } catch (error) {
      console.error('Vote failed:', error)
      addLog({
        type: 'info',
        message: `❌ Vote failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        technical: 'An error occurred during the FHEVM voting process',
        pollId
      })
    } finally {
      setIsVoting(false)
    }
  }

  const getButtonVariant = () => {
    if (disabled) return "secondary"
    if (isVoting) return "default"
    return option === "Yes" || option.includes("Yes") ? "default" : "outline"
  }

  const getButtonStyle = () => {
    if (option === "Yes" || option.includes("Yes")) {
      return "bg-green-600 hover:bg-green-700 text-white border-green-600"
    }
    return "bg-red-600 hover:bg-red-700 text-white border-red-600"
  }

  return (
    <>
      <Button
        onClick={handleVote}
        disabled={disabled || isVoting}
        className={`vote-button transition-all duration-200 transform hover:scale-105 active:scale-95 ${getButtonStyle()} ${className}`}
        size="lg"
      >
        {isVoting ? (
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
            <span>Processing...</span>
          </div>
        ) : (
          <div className="flex items-center space-x-2">
            <span className="text-lg">
              {option === "Yes" || option.includes("Yes") ? "✅" : "❌"}
            </span>
            <span className="font-semibold">{option}</span>
          </div>
        )}
      </Button>

      {/* Educational Popup */}
      {popupState.show && (
        <EducationalPopup
          step={popupState.step}
          position={popupState.position}
          onClose={hidePopup}
          pollId={popupState.pollId}
        />
      )}
    </>
  )
}

// Enhanced vote button with more educational features
export function EducationalVoteButton({ 
  option, 
  pollId, 
  onVote, 
  addLog, 
  disabled = false,
  educationalFocus,
  className = ""
}: VoteButtonProps & { educationalFocus: string }) {
  const [showTooltip, setShowTooltip] = useState(false)
  const { popupState, showPopup, hidePopup } = useEducationalPopup()

  const handleVote = async (event: React.MouseEvent) => {
    if (disabled) return

    // Show educational popup
    showPopup('encryption', event, pollId)

    // Add educational context log
    addLog({
      type: 'info',
      message: `🎓 Educational Focus: ${educationalFocus}`,
      technical: 'This poll demonstrates specific FHEVM concepts through interactive voting',
      pollId
    })

    await onVote(option, pollId)
  }

  return (
    <div className="relative">
      <Button
        onClick={handleVote}
        disabled={disabled}
        className={`educational-vote-button ${className}`}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        <div className="flex items-center space-x-2">
          <span className="text-lg">
            {option === "Yes" || option.includes("Yes") ? "✅" : "❌"}
          </span>
          <span className="font-semibold">{option}</span>
          <span className="text-xs opacity-75">🎓</span>
        </div>
      </Button>

      {/* Educational Tooltip */}
      {showTooltip && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-gray-800 text-white text-xs rounded px-2 py-1 whitespace-nowrap z-10">
          {educationalFocus}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
        </div>
      )}

      {/* Educational Popup */}
      {popupState.show && (
        <EducationalPopup
          step={popupState.step}
          position={popupState.position}
          onClose={hidePopup}
          pollId={popupState.pollId}
        />
      )}
    </div>
  )
}



