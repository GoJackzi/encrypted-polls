# Encrypted Polls Deployment Guide

## Prerequisites

1. **Install FHEVM Development Tools**
   \`\`\`bash
   npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox
   npm install fhevm
   \`\`\`

2. **Verify Wallet Balance**
   - Address: (derived from provided private key)
   - Network: Sepolia Testnet
   - Get test ETH from: https://sepoliafaucet.com/

## Deployment Steps

### 1. Compile Contract
\`\`\`bash
npx hardhat compile
\`\`\`

### 2. Deploy to Sepolia
\`\`\`bash
npx hardhat run scripts/deploy-contract.js --network sepolia
\`\`\`

### 3. Verify Contract (Optional)
\`\`\`bash
npx hardhat verify --network sepolia <CONTRACT_ADDRESS>
\`\`\`

## Configuration

- **Network**: Ethereum Sepolia Testnet
- **RPC URL**: https://eth-sepolia.g.alchemy.com/v2/RSaO0kH_yHZrcI8-GfcF4YOT3t4bSDpQ
- **Private Key**: Configured in hardhat.config.json

## Contract Features

- 15 prediction polls on crypto, AI, tech, and world events
- Encrypted voting using Zama's FHEVM
- Manual decryption of results
- Vote tracking per user

## Security Notes

- Private key is stored in config (for development only)
- For production, use environment variables or hardware wallets
- Ensure sufficient Sepolia ETH for deployment gas costs

## Next Steps

After deployment:
1. Note the deployed contract address
2. Update frontend environment variables
3. Test voting and decryption functionality
