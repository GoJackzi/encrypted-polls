// lib/zama-client.ts
// IMPORTANT: This client NEVER uses mock FHEVM - only real Zama Sepolia contract interaction
import { createFHEVMInstanceWithFallback } from "./fhevm-config"
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "./contract"

export class ZamaClient {
  fhevm: any

  constructor(fhevm: any) {
    this.fhevm = fhevm
  }

  static async initialize() {
    const fhevm = await createFHEVMInstanceWithFallback()
    return new ZamaClient(fhevm)
  }

  async encryptVote({ pollId, option }: { pollId: number; option: number }) {
    if (!this.fhevm) throw new Error("[FHEVM] FHEVM instance not initialized")
    console.log("[FHEVM] Encrypting vote for real contract:", { pollId, option })
    try {
      // Use FHEVM's createEncryptedInput for proper encryption
      const encryptedInput = await this.fhevm.createEncryptedInput(option)
      return { 
        pollId, 
        encryptedVote: encryptedInput.toHexString(),
        proof: encryptedInput.proof || "0x"
      }
    } catch (err) {
      console.error("[FHEVM] Encryption failed:", err)
      throw err
    }
  }

  async submitEncryptedVote({
    pollId,
    encryptedVote,
    proof,
  }: {
    pollId: number
    encryptedVote: string
    proof: string
  }) {
    if (!this.fhevm) throw new Error("[FHEVM] FHEVM instance not initialized")

    console.log("[FHEVM] Submitting encrypted vote to real contract:", {
      pollId,
      encryptedVote,
      contractAddress: CONTRACT_ADDRESS,
    })

    try {
      // Use FHEVM's sendTransaction with proper contract interaction
      const tx = await this.fhevm.sendTransaction({
        contractAddress: CONTRACT_ADDRESS,
        functionName: "submitVote",
        args: [pollId, encryptedVote],
      })
      console.log("[FHEVM] ✅ Real contract submission successful:", tx.hash)
      return tx
    } catch (err) {
      console.error("[FHEVM] ❌ Real contract submission failed:", err)
      throw err
    }
  }

  async requestDecryption(pollId: number) {
    if (!this.fhevm) throw new Error("[FHEVM] FHEVM instance not initialized")

    console.log("[FHEVM] Requesting decryption from real contract:", pollId)

    try {
      // Use FHEVM's sendTransaction for contract interaction
      const tx = await this.fhevm.sendTransaction({
        contractAddress: CONTRACT_ADDRESS,
        functionName: "requestDecryption",
        args: [pollId],
      })
      console.log("[FHEVM] ✅ Real contract decryption request successful:", tx.hash)
      return tx
    } catch (err) {
      console.error("[FHEVM] ❌ Real contract decryption request failed:", err)
      throw err
    }
  }

  async getPollResults(pollId: number) {
    if (!this.fhevm) throw new Error("[FHEVM] FHEVM instance not initialized")

    console.log("[FHEVM] Fetching poll results from real contract:", pollId)

    try {
      // Use FHEVM's getContract to interact with the deployed contract
      const contract = this.fhevm.getContract(CONTRACT_ADDRESS, CONTRACT_ABI)
      const result = await contract.getPoll(pollId)
      
      return {
        question: result[0],
        optionA: result[1],
        optionB: result[2],
        decrypted: result[3],
        votesA: Number(result[4]),
        votesB: Number(result[5]),
      }
    } catch (err) {
      console.error("[FHEVM] ❌ Failed to fetch poll results from contract:", err)
      throw err
    }
  }
}

// Global instance for easy access
let zamaClientInstance: ZamaClient | null = null

export async function getZamaClient(): Promise<ZamaClient> {
  if (!zamaClientInstance) {
    zamaClientInstance = await ZamaClient.initialize()
  }
  return zamaClientInstance
}