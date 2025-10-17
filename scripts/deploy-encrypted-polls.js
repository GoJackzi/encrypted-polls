import { ethers } from "ethers";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const RPC_URL = "https://eth-sepolia.g.alchemy.com/v2/RSaO0kH_yHZrcI8-GfcF4YOT3t4bSDpQ";
const PRIVATE_KEY = "d0a38d481f2d5406763e6769ba05af70ef7d2e6cedaa6dd21ee94720873a1c20";
const CHAIN_ID = 11155111; // Sepolia

async function deployEncryptedPolls() {
    console.log("🚀 Deploying EncryptedPolls FHEVM contract to Sepolia...");
    
    try {
        // 1. Setup provider and wallet
        console.log("📡 Setting up provider and wallet...");
        const provider = new ethers.JsonRpcProvider(RPC_URL);
        const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
        
        console.log("✅ Provider connected");
        console.log("✅ Wallet address:", wallet.address);
        
        // 2. Check balance
        const balance = await provider.getBalance(wallet.address);
        console.log("💰 Balance:", ethers.formatEther(balance), "ETH");
        
        if (balance === 0n) {
            throw new Error("Insufficient balance for deployment");
        }
        
        // 3. Load contract ABI and bytecode from Hardhat artifacts
        console.log("📄 Loading contract artifacts...");
        const artifactPath = path.join(__dirname, "..", "artifacts", "contracts", "EncryptedPolls.sol", "EncryptedPolls.json");
        const artifact = JSON.parse(fs.readFileSync(artifactPath, "utf8"));
        
        const abi = artifact.abi;
        const bytecode = artifact.bytecode;
        
        console.log("✅ Contract artifacts loaded");
        console.log("📊 ABI functions:", abi.filter(item => item.type === "function").length);
        
        // 4. Deploy contract
        console.log("🚀 Deploying contract...");
        const factory = new ethers.ContractFactory(abi, bytecode, wallet);
        const contract = await factory.deploy();
        
        console.log("⏳ Waiting for deployment confirmation...");
        await contract.waitForDeployment();
        
        const contractAddress = await contract.getAddress();
        console.log("✅ Contract deployed at:", contractAddress);
        
        // 5. Test contract
        console.log("🧪 Testing contract...");
        try {
            const poll0 = await contract.getPoll(0);
            console.log("✅ Poll 0 retrieved:", poll0.question);
            console.log("✅ Poll 0 options:", poll0.optionA, "vs", poll0.optionB);
        } catch (error) {
            console.log("⚠️  Contract test failed:", error.message);
        }
        
        // 6. Save deployment info
        const deploymentInfo = {
            contractAddress: contractAddress,
            deployer: wallet.address,
            network: "sepolia",
            chainId: CHAIN_ID,
            rpcUrl: RPC_URL,
            deploymentTime: new Date().toISOString(),
            contractName: "EncryptedPolls",
            pollCount: 7,
            abi: abi
        };
        
        const deploymentPath = path.join(__dirname, "..", "deployed-encrypted-polls.json");
        fs.writeFileSync(deploymentPath, JSON.stringify(deploymentInfo, null, 2));
        
        console.log("💾 Deployment info saved to:", deploymentPath);
        
        console.log("\n🎉 EncryptedPolls FHEVM contract deployment completed!");
        console.log("📍 Contract Address:", contractAddress);
        console.log("🌐 Network: Sepolia Testnet");
        console.log("🔗 Explorer: https://sepolia.etherscan.io/address/" + contractAddress);
        console.log("📊 Polls: 7 (Bitcoin, Ethereum, AI, DeFi, AGI, Quantum, EVs)");
        
        return contractAddress;
        
    } catch (error) {
        console.error("❌ Deployment failed:", error);
        throw error;
    }
}

// Run deployment
deployEncryptedPolls()
    .then((address) => {
        console.log("\n✅ Deployment successful!");
        console.log("📍 Contract Address:", address);
        process.exit(0);
    })
    .catch((error) => {
        console.error("\n❌ Deployment failed:", error);
        process.exit(1);
    });
