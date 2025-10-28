// data/polls.ts
// 7 educational polls with FHEVM learning progression

export interface Poll {
  id: number
  question: string
  optionA: string
  optionB: string
  educationalFocus: string
  description: string
  votesA: number
  votesB: number
  decrypted: boolean
}

export const POLLS: Poll[] = [
  {
    id: 0,
    question: "Will Bitcoin reach $150k by end of 2025?",
    optionA: "Yes",
    optionB: "No",
    educationalFocus: "Basic FHE encryption demonstration",
    description: "Learn how your vote gets encrypted using homomorphic encryption",
    votesA: 0,
    votesB: 0,
    decrypted: false
  },
  {
    id: 1,
    question: "Should AI development be regulated?",
    optionA: "Yes, regulate it",
    optionB: "No, let it develop freely",
    educationalFocus: "FHE computation on encrypted data",
    description: "See how mathematical operations work on encrypted votes",
    votesA: 0,
    votesB: 0,
    decrypted: false
  },
  {
    id: 2,
    question: "Is remote work the future?",
    optionA: "Yes, remote is better",
    optionB: "No, office work is better",
    educationalFocus: "Homomorphic addition of encrypted votes",
    description: "Watch encrypted votes being added together securely",
    votesA: 0,
    votesB: 0,
    decrypted: false
  },
  {
    id: 3,
    question: "Should we colonize Mars?",
    optionA: "Yes, let's go to Mars",
    optionB: "No, focus on Earth",
    educationalFocus: "Secure aggregation without revealing individual choices",
    description: "Understand how privacy is preserved during vote aggregation",
    votesA: 0,
    votesB: 0,
    decrypted: false
  },
  {
    id: 4,
    question: "Is cryptocurrency the future of money?",
    optionA: "Yes, crypto will replace fiat",
    optionB: "No, traditional money will remain",
    educationalFocus: "Privacy-preserving voting systems",
    description: "Explore how FHEVM enables private voting in blockchain",
    votesA: 0,
    votesB: 0,
    decrypted: false
  },
  {
    id: 5,
    question: "Should we invest in renewable energy?",
    optionA: "Yes, go green now",
    optionB: "No, stick with fossil fuels",
    educationalFocus: "FHE decryption of final results only",
    description: "See how only final results are decrypted, never individual votes",
    votesA: 0,
    votesB: 0,
    decrypted: false
  },
  {
    id: 6,
    question: "Is artificial general intelligence achievable?",
    optionA: "Yes, AGI is possible",
    optionB: "No, AGI is impossible",
    educationalFocus: "Complete FHEVM workflow demonstration",
    description: "Experience the full FHEVM process from encryption to decryption",
    votesA: 0,
    votesB: 0,
    decrypted: false
  }
]

export const POLL_COUNT = POLLS.length

export function getPoll(pollId: number): Poll | null {
  return POLLS.find(poll => poll.id === pollId) || null
}

export function getPollEducationalFocus(pollId: number): string {
  const poll = getPoll(pollId)
  return poll?.educationalFocus || "FHEVM demonstration"
}

export function getPollDescription(pollId: number): string {
  const poll = getPoll(pollId)
  return poll?.description || "Learn about FHEVM through interactive voting"
}



