import { ethers } from "hardhat";

async function main() {
  console.log("🚀 Deploying EncryptedPolls contract to Sepolia...");

  // Get the contract factory
  const EncryptedPolls = await ethers.getContractFactory("EncryptedPolls");

  // Deploy the contract
  console.log("📦 Deploying contract...");
  const encryptedPolls = await EncryptedPolls.deploy();

  // Wait for deployment
  console.log("⏳ Waiting for deployment...");
  await encryptedPolls.waitForDeployment();

  const contractAddress = await encryptedPolls.getAddress();
  console.log("✅ EncryptedPolls deployed to:", contractAddress);

  // Save deployment info
  const deploymentInfo = {
    contractAddress: contractAddress,
    network: "sepolia",
    deployedAt: new Date().toISOString(),
    deployer: (await ethers.getSigners())[0].address,
    contractName: "EncryptedPolls"
  };

  // Write to file
  const fs = await import('fs');
  fs.writeFileSync('deployment-info.json', JSON.stringify(deploymentInfo, null, 2));
  console.log("💾 Deployment info saved to deployment-info.json");

  // Verify contract on Etherscan (optional)
  if (process.env.ETHERSCAN_API_KEY) {
    console.log("🔍 Verifying contract on Etherscan...");
    try {
      await hre.run("verify:verify", {
        address: contractAddress,
        constructorArguments: [],
      });
      console.log("✅ Contract verified on Etherscan");
    } catch (error) {
      console.log("⚠️ Verification failed:", error.message);
    }
  }

  console.log("🎉 Deployment completed successfully!");
  console.log("📋 Contract Address:", contractAddress);
  console.log("🌐 View on Etherscan: https://sepolia.etherscan.io/address/" + contractAddress);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
