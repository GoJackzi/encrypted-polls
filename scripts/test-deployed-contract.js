import { ethers } from "ethers";

async function main() {
  console.log("🧪 Testing deployed contract...");

  const RPC_URL = "https://eth-sepolia.g.alchemy.com/v2/RSaO0kH_yHZrcI8-GfcF4YOT3t4bSDpQ";
  const PRIVATE_KEY = "d0a38d481f2d5406763e6769ba05af70ef7d2e6cedaa6dd21ee94720873a1c20";
  const CONTRACT_ADDRESS = "0xC9a60d360938Ecb4D95a6E093F43C418952DD33D";

  const provider = new ethers.JsonRpcProvider(RPC_URL);
  const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

  console.log("📡 Connected to:", await provider.getNetwork());
  console.log("👤 Testing from:", wallet.address);
  console.log("📋 Contract address:", CONTRACT_ADDRESS);

  // Try different ABI variations
  const abiVariations = [
    // Standard SimpleStorage ABI
    [
      "function setValue(uint256 _value) public",
      "function getValue() public view returns (uint256)"
    ],
    // Alternative ABI
    [
      "function setValue(uint256) external",
      "function getValue() external view returns (uint256)"
    ],
    // Minimal ABI
    [
      "function setValue(uint256)",
      "function getValue() view returns (uint256)"
    ]
  ];

  for (let i = 0; i < abiVariations.length; i++) {
    try {
      console.log(`\n🔄 Trying ABI variation ${i + 1}...`);
      
      const contract = new ethers.Contract(CONTRACT_ADDRESS, abiVariations[i], wallet);
      
      // Try to read the current value
      console.log("📖 Reading current value...");
      const currentValue = await contract.getValue();
      console.log("✅ Current value:", currentValue.toString());
      
      // Try to set a new value
      console.log("✏️ Setting new value to 123...");
      const tx = await contract.setValue(123);
      await tx.wait();
      console.log("✅ Transaction successful:", tx.hash);
      
      // Read the new value
      const newValue = await contract.getValue();
      console.log("✅ New value:", newValue.toString());
      
      console.log("🎉 Contract test successful with ABI variation", i + 1);
      break;
      
    } catch (error) {
      console.log(`❌ ABI variation ${i + 1} failed:`, error.message);
    }
  }

  console.log("\n🌐 View contract on Etherscan:");
  console.log(`https://sepolia.etherscan.io/address/${CONTRACT_ADDRESS}`);
}

main().catch(console.error);
