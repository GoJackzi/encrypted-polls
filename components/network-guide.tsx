"use client"

import { useAccount, useChainId, useSwitchChain } from "wagmi"
import { sepolia } from "viem/chains"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, CheckCircle, AlertTriangle } from "lucide-react"

export function NetworkGuide() {
  const { isConnected } = useAccount()
  const chainId = useChainId()
  const { switchChain, isPending } = useSwitchChain()

  if (!isConnected) return null

  if (chainId !== sepolia.id) {
    return (
      <Alert className="mb-4 border-orange-200 bg-orange-50">
        <AlertTriangle className="h-4 w-4 text-orange-600" />
        <AlertDescription className="flex items-center justify-between">
          <div>
            <strong>Network Switch Required</strong>
            <br />
            <span className="text-sm text-muted-foreground">
              Please switch to Sepolia testnet to use FHEVM features. FHEVM is currently only available on Sepolia testnet.
            </span>
          </div>
          <Button 
            onClick={() => switchChain({ chainId: sepolia.id })}
            size="sm"
            disabled={isPending}
            className="ml-4"
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Switching...
              </>
            ) : (
              "Switch to Sepolia"
            )}
          </Button>
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <Alert className="mb-4 border-green-200 bg-green-50">
      <CheckCircle className="h-4 w-4 text-green-600" />
      <AlertDescription>
        <strong>✅ Connected to Sepolia Testnet</strong>
        <br />
        <span className="text-sm text-muted-foreground">
          FHEVM features are now available! You can vote on encrypted polls.
        </span>
      </AlertDescription>
    </Alert>
  )
}



