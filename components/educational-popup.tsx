// components/educational-popup.tsx
"use client"

import { useEffect, useState } from "react"
import { EDUCATIONAL_STEPS, type EducationalStep } from "@/lib/mock-fhevm"

interface EducationalPopupProps {
  step: 'encryption' | 'computation' | 'aggregation' | 'decryption'
  position: { x: number; y: number }
  onClose: () => void
  pollId?: number
}

export function EducationalPopup({ step, position, onClose, pollId }: EducationalPopupProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [showTechnical, setShowTechnical] = useState(false)

  useEffect(() => {
    // Show popup with animation
    const timer = setTimeout(() => setIsVisible(true), 100)
    
    // Auto-hide after 4 seconds
    const hideTimer = setTimeout(() => {
      setIsVisible(false)
      setTimeout(onClose, 300) // Wait for animation to complete
    }, 4000)

    return () => {
      clearTimeout(timer)
      clearTimeout(hideTimer)
    }
  }, [onClose])

  const educationalData = EDUCATIONAL_STEPS[step]

  if (!educationalData) return null

  return (
    <div
      className={`fixed z-50 transition-all duration-300 ${
        isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
      }`}
      style={{
        left: Math.min(position.x, window.innerWidth - 350),
        top: Math.max(position.y - 100, 10),
      }}
    >
      <div className="bg-white border-2 border-blue-200 rounded-lg shadow-xl p-4 max-w-sm">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">{educationalData.icon}</span>
            <h3 className="font-bold text-blue-800 text-sm">
              {educationalData.title}
            </h3>
          </div>
          <button
            onClick={() => {
              setIsVisible(false)
              setTimeout(onClose, 300)
            }}
            className="text-gray-400 hover:text-gray-600 text-lg"
          >
            ×
          </button>
        </div>

        {/* Main Message */}
        <div className="mb-3">
          <p className="text-gray-700 text-sm leading-relaxed">
            {educationalData.message}
          </p>
          {pollId !== undefined && (
            <p className="text-xs text-blue-600 mt-1 font-medium">
              Poll {pollId} • Watch the live log below!
            </p>
          )}
        </div>

        {/* Technical Details Toggle */}
        <div className="border-t pt-3">
          <button
            onClick={() => setShowTechnical(!showTechnical)}
            className="flex items-center space-x-1 text-xs text-blue-600 hover:text-blue-800 transition-colors"
          >
            <span>💡</span>
            <span>{showTechnical ? 'Hide' : 'Show'} Technical Details</span>
            <span className={`transform transition-transform ${showTechnical ? 'rotate-180' : ''}`}>
              ▼
            </span>
          </button>
          
          {showTechnical && (
            <div className="mt-2 p-2 bg-blue-50 rounded text-xs text-blue-800">
              {educationalData.technical}
            </div>
          )}
        </div>

        {/* Progress Indicator */}
        <div className="mt-3 flex space-x-1">
          {Object.keys(EDUCATIONAL_STEPS).map((stepKey, index) => (
            <div
              key={stepKey}
              className={`h-1 flex-1 rounded ${
                stepKey === step
                  ? 'bg-blue-500'
                  : Object.keys(EDUCATIONAL_STEPS).indexOf(step) > index
                  ? 'bg-green-400'
                  : 'bg-gray-200'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Arrow pointing to the vote button */}
      <div
        className="absolute w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-blue-200"
        style={{
          left: '50%',
          top: '100%',
          transform: 'translateX(-50%)',
        }}
      />
    </div>
  )
}

// Popup trigger hook for vote buttons
export function useEducationalPopup() {
  const [popupState, setPopupState] = useState<{
    show: boolean
    step: 'encryption' | 'computation' | 'aggregation' | 'decryption'
    position: { x: number; y: number }
    pollId?: number
  }>({
    show: false,
    step: 'encryption',
    position: { x: 0, y: 0 }
  })

  const showPopup = (
    step: 'encryption' | 'computation' | 'aggregation' | 'decryption',
    event: React.MouseEvent,
    pollId?: number
  ) => {
    const rect = event.currentTarget.getBoundingClientRect()
    setPopupState({
      show: true,
      step,
      position: {
        x: rect.left + rect.width / 2,
        y: rect.top
      },
      pollId
    })
  }

  const hidePopup = () => {
    setPopupState(prev => ({ ...prev, show: false }))
  }

  return {
    popupState,
    showPopup,
    hidePopup
  }
}



