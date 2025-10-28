import { type NextRequest, NextResponse } from "next/server"
import { getZamaClient } from "@/lib/zama-client"

export async function POST(request: NextRequest) {
  try {
    const { pollId, option } = await request.json()

    // Validate input
    if (typeof pollId !== "number" || (option !== 0 && option !== 1)) {
      return NextResponse.json({ error: "Invalid poll ID or option" }, { status: 400 })
    }

    const zamaClient = await getZamaClient()

    // Encrypt the vote
    const { encryptedVote, proof } = await zamaClient.encryptVote(pollId, option)

    // Submit encrypted vote to contract
    const txHash = await zamaClient.submitEncryptedVote(pollId, encryptedVote, proof)

    console.log("[v0] Vote submitted successfully:", { pollId, txHash })

    return NextResponse.json({
      success: true,
      message: "Vote submitted successfully",
      txHash,
    })
  } catch (error) {
    console.error("[v0] Vote error:", error)
    return NextResponse.json({ error: "Failed to submit vote" }, { status: 500 })
  }
}
