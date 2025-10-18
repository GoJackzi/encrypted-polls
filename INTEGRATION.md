# Zama FHEVM Integration Guide

## Overview

This app uses Zama's FHEVM (Fully Homomorphic Encryption Virtual Machine) for private, encrypted voting on Ethereum Sepolia.

## Setup Steps

### 1. Install Zama Dependencies

\`\`\`bash
npm install fhevmjs @zama-ai/fhevm-contracts
\`\`\`

### 2. Deploy Smart Contract

\`\`\`bash
# Compile contract
npx hardhat compile

# Deploy to Sepolia
npx hardhat run scripts/deploy-contract.js --network sepolia

# Note the deployed contract address
\`\`\`

### 3. Update Environment Variables

Edit \`.env.local\`:

\`\`\`env
NEXT_PUBLIC_CONTRACT_ADDRESS=<your_deployed_contract_address>
NEXT_PUBLIC_ALCHEMY_SEPOLIA_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_API_KEY_HERE
PRIVATE_KEY=your_private_key_here
\`\`\`

### 4. Initialize Zama Client

The \`lib/zama-client.ts\` file contains placeholder implementations. To use real encryption:

\`\`\`typescript
import { createInstance } from "fhevmjs"

// Initialize FHEVM instance
const instance = await createInstance({
  chainId: 11155111, // Sepolia
  publicKey: "<gateway_public_key>",
})

// Encrypt vote
const encryptedVote = instance.encrypt64(option)
\`\`\`

### 5. Configure Zama Gateway

1. Get Gateway public key from Zama documentation
2. Configure Gateway callback URL in smart contract
3. Ensure Gateway has permissions to decrypt

## Architecture

### Voting Flow

1. **User selects option** → Frontend captures choice
2. **Encrypt vote** → Zama client encrypts option (0 or 1) as euint64
3. **Submit transaction** → Encrypted vote sent to contract via Relayer
4. **Store encrypted** → Contract stores vote without revealing choice
5. **Fire-and-forget** → User doesn't wait for confirmation

### Decryption Flow

1. **User clicks decrypt** → Frontend calls decrypt API
2. **Request decryption** → Contract calls Gateway.requestDecryption()
3. **Gateway processes** → Gateway decrypts using private key
4. **Callback** → Gateway calls contract's decryptionCallback()
5. **Results updated** → Frontend polls for updated results

## API Endpoints

- \`POST /api/vote\` - Submit encrypted vote
- \`GET /api/poll/[id]\` - Get poll results
- \`POST /api/decrypt\` - Request decryption

## Testing

1. **Local Testing**: Use mock encryption (current implementation)
2. **Testnet Testing**: Deploy to Sepolia and use real FHEVM
3. **Farcaster Testing**: Embed at 375-420px width

## Production Checklist

- [ ] Deploy contract to Sepolia
- [ ] Update CONTRACT_ADDRESS in .env.local
- [ ] Replace mock Zama client with real fhevmjs
- [ ] Configure Gateway public key
- [ ] Test voting and decryption flow
- [ ] Verify Farcaster frame dimensions
- [ ] Set up monitoring for Gateway callbacks

## Resources

- [Zama FHEVM Docs](https://docs.zama.ai/fhevm)
- [fhevmjs Library](https://github.com/zama-ai/fhevmjs)
- [Gateway Documentation](https://docs.zama.ai/fhevm/guides/gateway)
- [Sepolia Faucet](https://sepoliafaucet.com/)
\`\`\`
\`\`\`

```json file="" isHidden
