// lib/fhevm-config.ts
// IMPORTANT: This configuration NEVER uses mock FHEVM - only real Zama Sepolia integration
export const FHEVM_CONFIG = {
  chainId: 11155111, // Sepolia
  rpcUrl: process.env.NEXT_PUBLIC_ALCHEMY_SEPOLIA_URL || "https://eth-sepolia.g.alchemy.com/v2/YOUR_API_KEY_HERE",
  relayerUrl: "https://relayer.testnet.zama.cloud",

  executorContractAddress: "0x848B0066793BcC60346Da1F49049357399B8D595",
  aclContractAddress: "0x687820221192C5B662b25367F70076A37bc79b6c",
  hcuLimitContractAddress: "0x594BB474275918AF9609814E68C61B1587c5F838",
  kmsContractAddress: "0x1364cBBf2cDF5032C47d8226a6f6FBD2AFCDacAC",

  decryptionContractAddress: "0xa02Cda4Ca3a71D7C46997716F4283aa851C28812",
  decryptionVerifierAddress: "0xb6E160B1ff80D67Bfe90A85eE06Ce0A2613607D1",
  inputVerifierContractAddress: "0xbc91f3daD1A5F19F8390c400196e58073B6a0BC4",
  inputVerificationAddress: "0x7048C39f048125eDa9d678AEbaDfB22F7900a29F",
}

export async function createFHEVMInstanceWithFallback(walletClient?: any) {
  // Check if we're in a browser environment
  if (typeof window === 'undefined') {
    throw new Error("FHEVM can only be initialized in browser environment")
  }

  console.log("[FHEVM] Initializing REAL FHEVM instance - NO MOCK MODE")
  
  try {
    // Dynamic import to avoid SSR issues
    const { createInstance, SepoliaConfig } = await import("@zama-fhe/relayer-sdk/web")
    
    // Try using SepoliaConfig without explicit relayerUrl override first
    console.log("[FHEVM] Attempting FHEVM initialization with default SepoliaConfig...")
    const instance = await createInstance({
      ...SepoliaConfig,
      rpcUrl: FHEVM_CONFIG.rpcUrl,
    })
    
    console.log("[FHEVM] ✅ REAL FHEVM instance initialized successfully - ready for external wallet interaction")
    return instance
  } catch (err) {
    console.error("[FHEVM] ❌ Primary FHEVM initialization failed:", err)
    
    // Try alternative configuration with explicit relayer URL
    try {
      console.log("[FHEVM] Trying alternative FHEVM configuration with explicit relayer URL...")
      const { createInstance, SepoliaConfig } = await import("@zama-fhe/relayer-sdk/web")
      
      const instance = await createInstance({
        ...SepoliaConfig,
        rpcUrl: FHEVM_CONFIG.rpcUrl,
        relayerUrl: FHEVM_CONFIG.relayerUrl,
      })
      
      console.log("[FHEVM] ✅ REAL FHEVM instance initialized with alternative config")
      return instance
    } catch (err2) {
      console.error("[FHEVM] ❌ Alternative FHEVM initialization also failed:", err2)
      throw new Error(`FHEVM initialization failed: ${err instanceof Error ? err.message : 'Unknown error'}`)
    }
  }
}