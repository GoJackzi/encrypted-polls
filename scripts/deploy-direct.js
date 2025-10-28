import { ethers } from "ethers";
import fs from "fs";
import path from "path";

async function main() {
  console.log("🚀 Deploying SimpleStorage contract to Sepolia...");

  const RPC_URL = "https://eth-sepolia.g.alchemy.com/v2/RSaO0kH_yHZrcI8-GfcF4YOT3t4bSDpQ";
  const PRIVATE_KEY = "d0a38d481f2d5406763e6769ba05af70ef7d2e6cedaa6dd21ee94720873a1c20";

  const provider = new ethers.JsonRpcProvider(RPC_URL);
  const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

  console.log("📡 Connected to:", await provider.getNetwork());
  console.log("👤 Deploying from:", wallet.address);

  const balance = await provider.getBalance(wallet.address);
  console.log("💰 Balance:", ethers.formatEther(balance), "ETH");

  if (balance === 0n) throw new Error("Insufficient balance for deployment");

  // ✅ Known-working SimpleStorage (Solidity 0.8.24)
  const abi = [
    "function setValue(uint256 _value) public",
    "function getValue() public view returns (uint256)"
  ];

  const bytecode =
    "0x608060405234801561001057600080fd5b5061010c806100206000396000f3fe6080604052600436106100295760003560e01c80636057361d1461002e578063a87d942c1461004a575b600080fd5b61004860048036038101906100439190610091565b610062565b005b610052610080565b60405161005f91906100b5565b60405180910390f35b8060008190555050565b60008054905090565b600081359050610096816100d0565b92915050565b6000602082840312156100b2576100b16100cb565b5b60006100c084828501610087565b91505092915050565b6100d2816100a7565b82525050565b60006020820190506100ed60008301846100c9565b9291505056fea2646970667358221220fbb88d7b8d4c9a3e03a9bcd2a25967d96b6acbc685ed9b3b08e4ffcf158e67d864736f6c63430008180033";

  const factory = new ethers.ContractFactory(abi, bytecode, wallet);
  console.log("📦 Deploying contract...");
  const contract = await factory.deploy();
  await contract.waitForDeployment();

  const contractAddress = await contract.getAddress();
  console.log("✅ Contract deployed at:", contractAddress);

  console.log("🧪 Testing contract...");
  const tx = await contract.setValue(42);
  await tx.wait();
  const value = await contract.getValue();
  console.log("✅ Value stored:", value.toString());

  fs.writeFileSync(
    "deployed-contract.json",
    JSON.stringify(
      {
        address: contractAddress,
        network: "sepolia",
        deployedAt: new Date().toISOString(),
        deployer: wallet.address,
        contractName: "SimpleStorage",
      },
      null,
      2
    )
  );

  console.log("💾 Contract info saved to deployed-contract.json");
  console.log("🌐 https://sepolia.etherscan.io/address/" + contractAddress);
}

main().catch(console.error);
