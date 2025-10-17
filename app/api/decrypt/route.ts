import { type NextRequest, NextResponse } from "next/server"
import { getZamaClient } from "@/lib/zama-client"

export async function POST(request: NextRequest) {
  try {
    const { pollId } = await request.json()

    if (typeof pollId !== "number" || pollId < 0 || pollId >= 7) {
      return NextResponse.json({ error: "Invalid poll ID" }, { status: 400 })
    }

    const zamaClient = await getZamaClient()
    const txHash = await zamaClient.requestDecryption(pollId)

    console.log("[v0] Decryption requested:", { pollId, txHash })

    return NextResponse.json({
      success: true,
      message: "Decryption requested",
      txHash,
    })
  } catch (error) {
    console.error("[v0] Decryption error:", error)
    return NextResponse.json({ error: "Failed to request decryption" }, { status: 500 })
  }
}
