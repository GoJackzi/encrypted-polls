"use client"

import SinglePollPage from "@/components/single-poll-page"
import { NetworkGuide } from "@/components/network-guide"

export default function Home() {
  return (
    <div>
      <NetworkGuide />
      <SinglePollPage />
    </div>
  )
}