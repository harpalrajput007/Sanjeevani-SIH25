# Ayurvedic Herb Traceability System Features

## Core Features Implemented

### 1. Smart Contract (HerbTrace.sol)
- ✅ Batch creation with IPFS image hash
- ✅ Status update functionality
- ✅ Ownership transfer capability
- ✅ Complete batch history retrieval
- ✅ Event logging for transparency

### 2. Backend API (Node.js/Express)
- ✅ POST /api/batch - Create new batch with image upload to IPFS
- ✅ PUT /api/batch/:id/status - Update batch status
- ✅ GET /api/batch/:id - Get batch details (public endpoint)
- ✅ GET /api/batches - List all batches
- ✅ Blockchain integration with Ethers.js
- ✅ IPFS integration for image storage

### 3. Mobile App (React Native)
- ✅ Login screen (mock authentication)
- ✅ Main dashboard with register button
- ✅ Batch registration form
- ✅ Camera integration for herb photos
- ✅ GPS location capture
- ✅ API integration with backend

### 4. Web Dashboard (Next.js)
- ✅ Manufacturer login
- ✅ Batch listing dashboard
- ✅ Detailed batch view
- ✅ Status update functionality
- ✅ QR code generation for traceability
- ✅ Responsive design with Tailwind CSS

### 5. Public Traceability Page
- ✅ Consumer-facing batch information
- ✅ Complete supply chain timeline
- ✅ IPFS image display
- ✅ Location information with map link
- ✅ Blockchain verification details

## Data Flow

1. **Farmer/Collector** uses mobile app to:
   - Take photo of herbs
   - Enter herb name and quantity
   - Capture GPS location
   - Submit to blockchain via backend

2. **Backend** processes request:
   - Uploads image to IPFS
   - Calls smart contract to create batch
   - Returns batch ID to mobile app

3. **Manufacturer** uses web dashboard to:
   - View all batches
   - Update batch status (In-Transit, Processing, etc.)
   - Generate QR codes for products

4. **Consumer** scans QR code to:
   - View complete traceability information
   - See supply chain timeline
   - Verify blockchain authenticity

## Technology Stack

- **Blockchain**: Polygon (Mumbai Testnet)
- **Smart Contracts**: Solidity 0.8.19
- **Backend**: Node.js + Express.js
- **Database**: MongoDB
- **File Storage**: IPFS (Infura)
- **Mobile**: React Native
- **Web**: Next.js + Tailwind CSS
- **Blockchain Library**: Ethers.js v6

## Security Features

- Immutable blockchain records
- IPFS decentralized image storage
- Owner-only status updates
- Event logging for audit trail
- Secure wallet integration