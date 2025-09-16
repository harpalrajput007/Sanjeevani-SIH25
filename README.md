# Ayurvedic Herb Traceability System

A blockchain-based traceability system for Ayurvedic herbs using Polygon network.

## Project Structure

```
├── smart-contracts/     # Solidity contracts & Hardhat setup
├── backend/            # Node.js/Express API server
├── web-app/            # Next.js web application
└── README.md
```

## Technology Stack

- **Blockchain**: Polygon (Solidity + Ethers.js)
- **Backend**: Node.js + Express.js + MongoDB
- **Web**: Next.js + Tailwind CSS
- **Storage**: IPFS for images
- **Development**: Hardhat for smart contracts

## Quick Start

1. Deploy smart contract: `cd smart-contracts && npm run deploy`
2. Start backend: `cd backend && npm start`
3. Run web app: `cd web-app && npm run dev`