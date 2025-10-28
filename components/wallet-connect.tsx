'use client'

import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { Button } from '@/components/ui/button'

export function WalletConnect() {
  const { isConnected, address } = useAccount()
  const { connect, connectors } = useConnect()
  const { disconnect } = useDisconnect()

  if (isConnected) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-400">
          {address?.slice(0, 6)}...{address?.slice(-4)}
        </span>
        <Button 
          onClick={() => disconnect()} 
          size="sm" 
          variant="outline"
          className="text-xs border-gray-600 text-gray-300 hover:bg-gray-800"
        >
          Disconnect
        </Button>
      </div>
    )
  }

  return (
    <Button
      onClick={() => connect({ connector: connectors[0] })}
      className="bg-[#fed217] text-black hover:bg-[#fed217]/90"
    >
      Connect Wallet
    </Button>
  )
}
