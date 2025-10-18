import { ethers } from "ethers"
import fs from "fs"
import path from "path"

async function deployUpdatedContract() {
  console.log("🚀 DEPLOYING UPDATED FHEVM CONTRACT TO SEPOLIA...")
  
  // Your private key and RPC URL
  const PRIVATE_KEY = "d0a38d481f2d5406763e6769ba05af70ef7d2e6cedaa6dd21ee94720873a1c20"
  const RPC_URL = "https://eth-sepolia.g.alchemy.com/v2/RSaO0kH_yHZrcI8-GfcF4YOT3t4bSDpQ"
  
  try {
    // Setup provider and wallet
    const provider = new ethers.JsonRpcProvider(RPC_URL)
    const wallet = new ethers.Wallet(PRIVATE_KEY, provider)
    
    console.log("📍 Deployer address:", wallet.address)
    
    // Get balance
    const balance = await provider.getBalance(wallet.address)
    console.log("💰 Balance:", ethers.formatEther(balance), "ETH")
    
    if (balance === 0n) {
      throw new Error("❌ Insufficient balance!")
    }
    
    // Test connection
    const network = await provider.getNetwork()
    console.log("🌐 Network:", network.name, "Chain ID:", network.chainId)
    
    // Check if we have compiled contract
    const artifactsPath = path.join(process.cwd(), "artifacts", "contracts", "EncryptedPolls.sol", "EncryptedPolls.json")
    
    if (!fs.existsSync(artifactsPath)) {
      console.log("📦 Compiling contract first...")
      console.log("⚠️  Please run: npx hardhat compile")
      throw new Error("Contract not compiled. Run 'npx hardhat compile' first.")
    }
    
    // Read compiled contract
    const contractArtifact = JSON.parse(fs.readFileSync(artifactsPath, "utf8"))
    console.log("✅ Contract artifact loaded")
    
    // Create contract factory
    const contractFactory = new ethers.ContractFactory(
      contractArtifact.abi,
      contractArtifact.bytecode,
      wallet
    )
    
    console.log("📦 Deploying updated EncryptedPolls contract...")
    
    // Deploy contract
    const contract = await contractFactory.deploy()
    console.log("⏳ Deployment transaction sent:", contract.deploymentTransaction().hash)
    
    // Wait for deployment
    await contract.waitForDeployment()
    const contractAddress = await contract.getAddress()
    
    console.log("✅ UPDATED CONTRACT DEPLOYED!")
    console.log("📍 Contract address:", contractAddress)
    console.log("🔗 Explorer:", `https://sepolia.etherscan.io/address/${contractAddress}`)
    
    // Save contract address
    const contractInfo = {
      address: contractAddress,
      deployer: wallet.address,
      network: "sepolia",
      chainId: 11155111,
      deployedAt: new Date().toISOString(),
      contractName: "EncryptedPolls",
      version: "updated-single-poll"
    }
    
    fs.writeFileSync(
      path.join(process.cwd(), "deployed-contract.json"),
      JSON.stringify(contractInfo, null, 2)
    )
    
    console.log("💾 Contract info saved to deployed-contract.json")
    
    // Test contract functions
    console.log("🧪 Testing contract functions...")
    
    try {
      // Test getPoll
      const poll = await contract.getPoll(0)
      console.log("✅ getPoll(0) works:", {
        question: poll[0],
        optionA: poll[1],
        optionB: poll[2],
        decrypted: poll[3]
      })
      
      // Test hasUserVoted
      const hasVoted = await contract.hasUserVoted(0, wallet.address)
      console.log("✅ hasUserVoted works:", hasVoted)
      
      console.log("🎉 Contract is working correctly!")
      
    } catch (testError) {
      console.warn("⚠️  Contract deployed but testing failed:", testError.message)
    }
    
    return contractAddress
    
  } catch (error) {
    console.error("❌ Deployment failed:", error)
    throw error
  }
}

deployUpdatedContract()
  .then((address) => {
    console.log("🎉 UPDATED CONTRACT DEPLOYED SUCCESSFULLY!")
    console.log("📍 Address:", address)
    console.log("🔗 View on Etherscan:", `https://sepolia.etherscan.io/address/${address}`)
    process.exit(0)
  })
  .catch((error) => {
    console.error("💥 Deployment failed:", error)
    process.exit(1)
  })


