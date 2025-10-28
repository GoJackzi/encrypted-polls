# Encrypted Polls

A Farcaster Mini-App for private voting using Fully Homomorphic Encryption (FHE).

## What is this?

Vote on polls while keeping your vote completely private. Your choice is encrypted before leaving your device, counted while still encrypted, and only the final results are revealed.

## Features

- 5 interactive polls
- Encrypted voting with FHEVM
- Real-time activity monitor
- Swipe navigation
- No wallet needed

## How it works

1. Your vote gets encrypted using Zama's FHEVM
2. The encrypted vote is sent to the smart contract
3. Votes are counted without ever being decrypted
4. Only final results are shown

## Why it matters

Traditional voting is either public (no privacy) or private (no verifiability). FHEVM gives you both - completely private votes with publicly verifiable results.

## Try it

Live at: [encrypted-polls.vercel.app](https://encrypted-polls.vercel.app)

## Tech

- Next.js, React, TypeScript
- Zama FHEVM SDK
- Solidity smart contracts
- Deployed on Sepolia testnet

---

Built with ❤️ by Musky for [@zama](https://farcaster.xyz/zama)
