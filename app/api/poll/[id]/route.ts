// Mock API route for educational FHEVM demo
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const pollId = Number.parseInt(id)

    if (isNaN(pollId) || pollId < 0 || pollId >= 5) { // Allow pollId 0-4 (5 polls)
      return NextResponse.json({ error: "Invalid poll ID" }, { status: 400 })
    }

    // Return mock poll results for educational demo
    const mockResults = {
      votesA: Math.floor(Math.random() * 50) + 10,
      votesB: Math.floor(Math.random() * 50) + 10,
      decrypted: true, // Always show results for demo
    }

    console.log("[Mock API] Poll results for educational demo:", { pollId, mockResults })

    return NextResponse.json(mockResults)
  } catch (error) {
    console.error("[Mock API] Poll fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch poll results" }, { status: 500 })
  }
}