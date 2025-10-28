import { useAccount, useWalletClient } from 'wagmi'
import { CONTRACT_ADDRESS, CONTRACT_ABI } from './contract'

export function useWalletContract() {
  const { data: walletClient } = useWalletClient()
  const { isConnected } = useAccount()

  const submitVote = async (pollId: number, encryptedVote: string) => {
    if (!walletClient || !isConnected) {
      throw new Error("Wallet not connected")
    }

    if (!CONTRACT_ADDRESS) {
      throw new Error("Contract not deployed")
    }

    console.log("[FHEVM] Submitting vote with args:", { pollId, encryptedVote, contractAddress: CONTRACT_ADDRESS })

    try {
      // For FHEVM contracts, we need to use the FHEVM SDK's contract interaction
      // The encryptedVote parameter is already in the correct format from the FHEVM SDK
      const tx = await walletClient.writeContract({
        address: CONTRACT_ADDRESS as `0x${string}`,
        abi: CONTRACT_ABI,
        functionName: 'submitVote',
        args: [BigInt(pollId), encryptedVote],
        gas: 500000n, // Set explicit gas limit
      })
      
      console.log("[FHEVM] Transaction submitted:", tx)
      return tx
    } catch (error) {
      console.error("[FHEVM] Contract submission failed:", error)
      console.error("[FHEVM] Error details:", {
        message: error.message,
        code: error.code,
        data: error.data
      })
      throw error
    }
  }

  const requestDecryption = async (pollId: number) => {
    if (!walletClient || !isConnected) {
      throw new Error("Wallet not connected")
    }

    if (!CONTRACT_ADDRESS) {
      throw new Error("Contract not deployed")
    }

    console.log("[FHEVM] Requesting decryption for poll:", { pollId, contractAddress: CONTRACT_ADDRESS })

    try {
      const tx = await walletClient.writeContract({
        address: CONTRACT_ADDRESS as `0x${string}`,
        abi: CONTRACT_ABI,
        functionName: 'requestDecryption',
        args: [BigInt(pollId)],
        gas: 300000n, // Set explicit gas limit
      })
      
      console.log("[FHEVM] Decryption transaction submitted:", tx)
      return tx
    } catch (error) {
      console.error("[FHEVM] Decryption request failed:", error)
      console.error("[FHEVM] Error details:", {
        message: error.message,
        code: error.code,
        data: error.data
      })
      throw error
    }
  }

  return {
    submitVote,
    requestDecryption,
    isConnected,
    walletClient
  }
}
