# Encrypted Polls MiniApp

A privacy-preserving prediction poll application built with Zama's FHEVM (Fully Homomorphic Encryption Virtual Machine) on Ethereum Sepolia.

## Features

- **15 Prediction Polls** covering crypto, AI, tech, and world events
- **Encrypted Voting** using Zama FHEVM - votes are encrypted on-chain
- **Manual Decryption** - results can be decrypted on demand
- **Async Submission** - fire-and-forget voting experience
- **Farcaster Optimized** - designed for 375-420px width embedding

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS v4, shadcn/ui components
- **Blockchain**: Ethereum Sepolia testnet
- **Encryption**: Zama FHEVM (euint64 encrypted integers)
- **Smart Contract**: Solidity 0.8.24 with FHEVM library

## Quick Start

### 1. Install Dependencies

\`\`\`bash
npm install
\`\`\`

### 2. Configure Environment

Copy \`.env.local\` and update with your deployed contract address:

\`\`\`env
NEXT_PUBLIC_CONTRACT_ADDRESS=<your_contract_address>
NEXT_PUBLIC_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/RSaO0kH_yHZrcI8-GfcF4YOT3t4bSDpQ
PRIVATE_KEY=d0a38d481f2d5406763e6769ba05af70ef7d2e6cedaa6dd21ee94720873a1c20
\`\`\`

### 3. Deploy Smart Contract

\`\`\`bash
# Compile contract
npx hardhat compile

# Deploy to Sepolia
npm run deploy:contract
\`\`\`

### 4. Run Development Server

\`\`\`bash
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) to see the app.

## Project Structure

\`\`\`
├── app/
│   ├── page.tsx              # Main poll listing page
│   ├── api/
│   │   ├── vote/route.ts     # Vote submission endpoint
│   │   ├── poll/[id]/route.ts # Poll results endpoint
│   │   └── decrypt/route.ts  # Decryption request endpoint
│   └── globals.css           # Global styles with Zama-orange theme
├── components/
│   └── poll-card.tsx         # Individual poll component
├── contracts/
│   └── EncryptedPolls.sol    # FHEVM smart contract
├── lib/
│   ├── contract.ts           # Contract configuration
│   └── zama-client.ts        # Zama encryption client
├── scripts/
│   └── deploy-contract.js    # Deployment script
└── INTEGRATION.md            # Detailed integration guide
\`\`\`

## How It Works

### Voting Flow

1. User selects an option (Yes/No)
2. Vote is encrypted client-side using Zama's encryption
3. Encrypted vote submitted to smart contract
4. Contract stores encrypted vote without revealing choice
5. User receives instant confirmation (fire-and-forget)

### Decryption Flow

1. User clicks "Decrypt All Results" button
2. Frontend requests decryption for each poll
3. Smart contract calls Zama Gateway for decryption
4. Gateway decrypts using private key and calls back
5. Results are updated and displayed with percentages

## Smart Contract

The \`EncryptedPolls.sol\` contract uses:

- **euint64** for encrypted vote storage
- **TFHE library** for homomorphic operations
- **Gateway pattern** for decryption callbacks
- **Vote tracking** to prevent double voting

## Design

- **Color Scheme**: Black background with Zama-orange (#FF7A00) accents
- **Typography**: Geist Sans for clean, modern look
- **Layout**: Optimized for Farcaster's 375-420px width constraint
- **Interactions**: Smooth transitions and loading states

## Deployment

### Deploy to Vercel

\`\`\`bash
vercel deploy
\`\`\`

### Embed in Farcaster

The app is designed to work as a Farcaster frame at 375-420px width.

## Security Notes

- Private key is stored in environment variables (development only)
- For production, use secure key management solutions
- All votes are encrypted on-chain using FHEVM
- Decryption requires explicit user action

## Resources

- [Zama FHEVM Documentation](https://docs.zama.ai/fhevm)
- [Sepolia Testnet Faucet](https://sepoliafaucet.com/)
- [Next.js Documentation](https://nextjs.org/docs)
- [Hardhat Documentation](https://hardhat.org/docs)

## License

MIT
\`\`\`
