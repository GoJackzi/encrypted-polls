// lib/mock-fhevm.ts
// High-fidelity mock FHEVM for educational demonstrations

export interface ActivityLog {
  id: string
  type: 'encryption' | 'computation' | 'aggregation' | 'decryption' | 'result' | 'info'
  message: string
  technical: string
  timestamp: Date
  pollId?: number
  encryptedData?: string
}

export interface EducationalStep {
  step: 'encryption' | 'computation' | 'aggregation' | 'decryption'
  title: string
  message: string
  technical: string
  icon: string
}

export class MockFHEVM {
  private logs: ActivityLog[] = []
  private onLogUpdate?: (logs: ActivityLog[]) => void

  constructor(onLogUpdate?: (logs: ActivityLog[]) => void) {
    this.onLogUpdate = onLogUpdate
    
    // Add welcome log
    this.addLog({
      type: 'info',
      message: '🎓 Welcome to the FHEVM Educational Demo!',
      technical: 'This interactive demo shows how Fully Homomorphic Encryption works in practice',
    })
  }

  private addLog(log: Omit<ActivityLog, 'id' | 'timestamp'>) {
    const newLog: ActivityLog = {
      ...log,
      id: `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date()
    }
    this.logs.push(newLog)
    this.onLogUpdate?.(this.logs)
    return newLog
  }

  private generateRealisticEncryptedData(): string {
    // Generate realistic-looking encrypted data
    const chars = '0123456789abcdef'
    let result = ''
    for (let i = 0; i < 64; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return result
  }

  private generateRealisticProof(): string {
    // Generate realistic-looking proof
    const chars = '0123456789abcdef'
    let result = ''
    for (let i = 0; i < 32; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return result
  }

  async createEncryptedInput(value: number, pollId: number): Promise<any> {
    this.addLog({
      type: 'encryption',
      message: `🔐 Encrypting vote "${value === 0 ? 'Yes' : 'No'}" for Poll ${pollId}`,
      technical: 'FHE encryption converts your vote to encrypted format while preserving privacy',
      pollId,
      encryptedData: this.generateRealisticEncryptedData()
    })

    // Simulate encryption delay
    await this.delay(800)

    const encryptedData = this.generateRealisticEncryptedData()
    
    this.addLog({
      type: 'encryption',
      message: `✅ Vote encrypted successfully: 0x${encryptedData.substring(0, 16)}...`,
      technical: 'Your vote is now in encrypted form and can be processed without revealing the original value',
      pollId,
      encryptedData
    })

    return {
      toHexString: () => `0x${encryptedData}`,
      proof: `0x${this.generateRealisticProof()}`,
      value: value,
      pollId: pollId
    }
  }

  async submitEncryptedVote(encryptedVote: any, pollId: number): Promise<any> {
    this.addLog({
      type: 'computation',
      message: `⚡ Processing encrypted vote for Poll ${pollId}`,
      technical: 'Homomorphic computation allows mathematical operations on encrypted data',
      pollId
    })

    await this.delay(1000)

    this.addLog({
      type: 'aggregation',
      message: `📊 Aggregating encrypted vote with existing poll results`,
      technical: 'Your encrypted vote is being added to the total count while maintaining privacy',
      pollId
    })

    await this.delay(1200)

    this.addLog({
      type: 'result',
      message: `✅ Vote successfully recorded! Privacy preserved throughout the process`,
      technical: 'Only the final aggregated result will be decrypted, never individual votes',
      pollId
    })

    return {
      hash: `0x${this.generateRealisticEncryptedData().substring(0, 16)}...`,
      status: 'success'
    }
  }

  async requestDecryption(pollId: number): Promise<any> {
    this.addLog({
      type: 'decryption',
      message: `🔓 Requesting decryption for Poll ${pollId} results`,
      technical: 'Decryption is requested only for the final aggregated results, not individual votes',
      pollId
    })

    await this.delay(1500)

    this.addLog({
      type: 'decryption',
      message: `🎯 Poll ${pollId} results decrypted successfully`,
      technical: 'The system reveals only the total vote counts while preserving individual privacy',
      pollId
    })

    return {
      hash: `0x${this.generateRealisticEncryptedData().substring(0, 16)}...`,
      status: 'success'
    }
  }

  async getPollResults(pollId: number): Promise<any> {
    // Simulate realistic poll results
    const votesA = Math.floor(Math.random() * 50) + 10
    const votesB = Math.floor(Math.random() * 50) + 10
    
    return {
      question: this.getPollQuestion(pollId),
      optionA: this.getPollOptionA(pollId),
      optionB: this.getPollOptionB(pollId),
      decrypted: true,
      votesA,
      votesB
    }
  }

  private getPollQuestion(pollId: number): string {
    const questions = [
      "Will Bitcoin reach $150k by end of 2025?",
      "Should AI development be regulated?",
      "Is remote work the future?",
      "Should we colonize Mars?",
      "Is cryptocurrency the future of money?",
      "Should we invest in renewable energy?",
      "Is artificial general intelligence achievable?"
    ]
    return questions[pollId] || "Sample poll question"
  }

  private getPollOptionA(pollId: number): string {
    const options = ["Yes", "Yes, regulate it", "Yes, remote is better", "Yes, let's go to Mars", 
                    "Yes, crypto will replace fiat", "Yes, go green now", "Yes, AGI is possible"]
    return options[pollId] || "Option A"
  }

  private getPollOptionB(pollId: number): string {
    const options = ["No", "No, let it develop freely", "No, office work is better", "No, focus on Earth",
                    "No, traditional money will remain", "No, stick with fossil fuels", "No, AGI is impossible"]
    return options[pollId] || "Option B"
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  getLogs(): ActivityLog[] {
    return [...this.logs]
  }

  clearLogs(): void {
    this.logs = []
    this.onLogUpdate?.(this.logs)
  }
}

// Educational step definitions
export const EDUCATIONAL_STEPS: Record<string, EducationalStep> = {
  encryption: {
    step: 'encryption',
    title: '🔐 Homomorphic Encryption',
    message: 'Your vote is being encrypted using FHE. The data remains private even during computation!',
    technical: 'FHE allows mathematical operations on encrypted data without revealing the original values.',
    icon: '🔐'
  },
  computation: {
    step: 'computation',
    title: '⚡ FHE Magic Happening',
    message: 'Watch the live log below! Your encrypted vote is being processed without decryption.',
    technical: 'The system can add your vote to the total count while keeping your choice secret.',
    icon: '⚡'
  },
  aggregation: {
    step: 'aggregation',
    title: '📊 Secure Aggregation',
    message: 'Your encrypted vote is being combined with others using homomorphic addition.',
    technical: 'Multiple encrypted votes are summed together while maintaining privacy.',
    icon: '📊'
  },
  decryption: {
    step: 'decryption',
    title: '🔓 Final Decryption',
    message: 'Only the final aggregated result is decrypted, never individual votes!',
    technical: 'The system reveals only the total counts, preserving individual privacy.',
    icon: '🔓'
  }
}

// Global mock FHEVM instance
let mockFHEVMInstance: MockFHEVM | null = null

export function getMockFHEVM(onLogUpdate?: (logs: ActivityLog[]) => void): MockFHEVM {
  if (!mockFHEVMInstance) {
    mockFHEVMInstance = new MockFHEVM(onLogUpdate)
  }
  return mockFHEVMInstance
}
