import { ethers } from "ethers";

async function testRPCConnection() {
  console.log("🚀 Testing RPC connection with your Alchemy endpoint...")
  
  // Your specific RPC URL
  const rpcUrl = 'https://eth-sepolia.g.alchemy.com/v2/RSaO0kH_yHZrcI8-GfcF4YOT3t4bSDpQ';
  const provider = new ethers.JsonRpcProvider(rpcUrl);
  
  try {
    // Test basic RPC connection
    console.log("🔗 Testing RPC connection...")
    const network = await provider.getNetwork();
    console.log("✅ RPC connected:", network.name, "Chain ID:", network.chainId.toString());
    
    // Test getting latest block
    const blockNumber = await provider.getBlockNumber();
    console.log("✅ Latest block number:", blockNumber);
    
    // Test getting gas price
    const feeData = await provider.getFeeData();
    console.log("✅ Gas price:", ethers.formatUnits(feeData.gasPrice, "gwei"), "gwei");
    
    // Test wallet connection (your deployer wallet)
    const PRIVATE_KEY = "d0a38d481f2d5406763e6769ba05af70ef7d2e6cedaa6dd21ee94720873a1c20";
    const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
    console.log("✅ Wallet address:", wallet.address);
    
    // Test wallet balance
    const balance = await provider.getBalance(wallet.address);
    console.log("✅ Wallet balance:", ethers.formatEther(balance), "ETH");
    
    console.log("🎉 RPC connection test completed successfully!")
    console.log("📋 Summary:")
    console.log("   • Network:", network.name)
    console.log("   • Chain ID:", network.chainId.toString())
    console.log("   • Latest Block:", blockNumber)
    console.log("   • Gas Price:", ethers.formatUnits(feeData.gasPrice, "gwei"), "gwei")
    console.log("   • Wallet:", wallet.address)
    console.log("   • Balance:", ethers.formatEther(balance), "ETH")
    
  } catch (error) {
    console.error("❌ RPC connection test failed:", error.message)
  }
}

testRPCConnection().catch(console.error);

async function testRPCConnection() {
  console.log("🚀 Testing RPC connection with your Alchemy endpoint...")
  
  // Your specific RPC URL
  const rpcUrl = 'https://eth-sepolia.g.alchemy.com/v2/RSaO0kH_yHZrcI8-GfcF4YOT3t4bSDpQ';
  const provider = new ethers.JsonRpcProvider(rpcUrl);
  
  try {
    // Test basic RPC connection
    console.log("🔗 Testing RPC connection...")
    const network = await provider.getNetwork();
    console.log("✅ RPC connected:", network.name, "Chain ID:", network.chainId.toString());
    
    // Test getting latest block
    const blockNumber = await provider.getBlockNumber();
    console.log("✅ Latest block number:", blockNumber);
    
    // Test getting gas price
    const feeData = await provider.getFeeData();
    console.log("✅ Gas price:", ethers.formatUnits(feeData.gasPrice, "gwei"), "gwei");
    
    // Test wallet connection (your deployer wallet)
    const PRIVATE_KEY = "d0a38d481f2d5406763e6769ba05af70ef7d2e6cedaa6dd21ee94720873a1c20";
    const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
    console.log("✅ Wallet address:", wallet.address);
    
    // Test wallet balance
    const balance = await provider.getBalance(wallet.address);
    console.log("✅ Wallet balance:", ethers.formatEther(balance), "ETH");
    
    console.log("🎉 RPC connection test completed successfully!")
    console.log("📋 Summary:")
    console.log("   • Network:", network.name)
    console.log("   • Chain ID:", network.chainId.toString())
    console.log("   • Latest Block:", blockNumber)
    console.log("   • Gas Price:", ethers.formatUnits(feeData.gasPrice, "gwei"), "gwei")
    console.log("   • Wallet:", wallet.address)
    console.log("   • Balance:", ethers.formatEther(balance), "ETH")
    
  } catch (error) {
    console.error("❌ RPC connection test failed:", error.message)
  }
}

testRPCConnection().catch(console.error);