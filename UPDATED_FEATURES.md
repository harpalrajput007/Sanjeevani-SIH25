# Web-Only Herb Traceability System

## Updated Architecture

The system now consists of three main components:

1. **Smart Contract** - Polygon blockchain for immutable records
2. **Backend API** - Node.js/Express server with IPFS integration  
3. **Web Application** - Next.js app for both farmers and manufacturers

## User Roles & Features

### Farmers/Collectors
- Login with farmer role selection
- Register new herb batches with:
  - Herb name and quantity
  - Image upload (stored on IPFS)
  - GPS location (auto-detect or manual entry)
- View all registered batches
- View detailed batch information

### Manufacturers  
- Login with manufacturer role selection
- View all herb batches in system
- Update batch status (In-Transit, Processing, etc.)
- Generate QR codes for consumer traceability
- View complete batch history

### Consumers (Public Access)
- Scan QR codes to view batch traceability
- See complete supply chain journey
- View herb images and collection location
- Verify blockchain authenticity

## Simplified Workflow

1. **Farmer** logs into web app and registers herb batch
2. **Backend** uploads image to IPFS and creates blockchain record
3. **Manufacturer** logs in and updates batch status as needed
4. **QR Code** generated for final product packaging
5. **Consumer** scans QR code to view complete traceability

## Technology Stack

- **Frontend**: Next.js + Tailwind CSS (single web app)
- **Backend**: Node.js + Express.js + MongoDB
- **Blockchain**: Polygon (Solidity + Ethers.js)
- **Storage**: IPFS for decentralized image storage
- **Development**: Hardhat for smart contracts

## Key Benefits

- Single web application for all users
- No mobile app development needed
- Responsive design works on all devices
- Simplified deployment and maintenance
- Complete blockchain traceability maintained