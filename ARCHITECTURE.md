# System Architecture

## Overview
Blockchain-based traceability system for Ayurvedic herbs using a 3-tier architecture: Smart Contract (Polygon), Backend API (Node.js), and Web Frontend (Next.js).

## Architecture Diagram
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Web Frontend  │◄──►│   Backend API   │◄──►│ Smart Contract  │
│    (Next.js)    │    │   (Node.js)     │    │   (Polygon)     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   User Browser  │    │   IPFS Storage  │    │  Blockchain     │
│                 │    │   (Images)      │    │  (Immutable)    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## Components

### 1. Smart Contract Layer (Polygon Blockchain)
**File**: `smart-contracts/contracts/HerbTrace.sol`

**Purpose**: Immutable data storage and business logic
- Stores batch metadata (herb name, quantity, location, timestamps)
- Manages status updates with ownership verification
- Maintains complete audit trail
- Emits events for transparency

**Key Functions**:
- `createBatch()` - Creates new herb batch record
- `updateBatchStatus()` - Updates batch status (manufacturer only)
- `getBatchDetails()` - Retrieves complete batch information

### 2. Backend API Layer (Node.js/Express)
**File**: `backend/server.js`

**Purpose**: Bridge between frontend and blockchain/IPFS
- Handles file uploads to IPFS
- Manages blockchain transactions
- Provides REST API endpoints
- Formats data for frontend consumption

**Key Endpoints**:
- `POST /api/batch` - Create batch (uploads image to IPFS, calls smart contract)
- `PUT /api/batch/:id/status` - Update status (calls smart contract)
- `GET /api/batch/:id` - Get batch details (reads from blockchain)
- `GET /api/batches` - List all batches

**Dependencies**:
- **Ethers.js**: Blockchain interaction
- **IPFS Client**: Decentralized image storage
- **Multer**: File upload handling
- **MongoDB**: Off-chain data (optional)

### 3. Frontend Layer (Next.js)
**Files**: `web-app/pages/*`

**Purpose**: User interface for all stakeholders
- Role-based authentication (Farmer/Manufacturer)
- Batch registration and management
- QR code generation
- Public traceability display

**Key Pages**:
- `/` - Login with role selection
- `/dashboard` - Role-based batch listing
- `/register-batch` - Batch creation form (farmers)
- `/batch/[id]` - Batch details and status updates
- `/trace` - Public traceability page

## Data Flow

### Batch Creation Flow
```
Farmer → Web Form → Backend API → IPFS (image) → Smart Contract → Blockchain
```

1. Farmer fills registration form with herb details and image
2. Frontend sends multipart form data to backend
3. Backend uploads image to IPFS, gets hash
4. Backend calls `createBatch()` on smart contract
5. Smart contract stores data on blockchain
6. Transaction hash returned to frontend

### Status Update Flow
```
Manufacturer → Web Interface → Backend API → Smart Contract → Blockchain
```

1. Manufacturer enters new status
2. Frontend sends status update to backend
3. Backend calls `updateBatchStatus()` on smart contract
4. Smart contract verifies ownership and updates status
5. New status added to blockchain history

### Traceability Query Flow
```
Consumer → QR Code → Public Page → Backend API → Smart Contract → Display
```

1. Consumer scans QR code
2. Redirected to public traceability page
3. Frontend fetches batch details from backend
4. Backend queries smart contract for complete history
5. Data displayed with IPFS images

## Security Model

### Blockchain Security
- **Immutable Records**: All data stored permanently on blockchain
- **Ownership Verification**: Only batch owner can update status
- **Event Logging**: All actions logged for audit trail
- **Decentralized**: No single point of failure

### Access Control
- **Role-Based**: Farmers register, manufacturers update
- **Wallet-Based**: Smart contract uses wallet addresses for ownership
- **Public Verification**: Anyone can verify batch authenticity

## Storage Strategy

### On-Chain (Blockchain)
- Batch metadata (name, quantity, location, timestamps)
- Status history with timestamps
- Ownership information
- IPFS hash references

### Off-Chain (IPFS)
- Herb images (decentralized storage)
- Large files that don't need blockchain immutability

### Local Storage (Optional)
- User authentication state
- UI preferences
- Cached data for performance

## Deployment Architecture

### Development
- Local blockchain (Hardhat network)
- Local IPFS node or Infura
- Local MongoDB instance

### Production
- Polygon Mumbai/Mainnet
- Infura IPFS service
- MongoDB Atlas
- Vercel (Frontend) + Heroku (Backend)

## Scalability Considerations

### Blockchain
- Layer 2 solution (Polygon) for low gas fees
- Batch operations to reduce transaction costs
- Event-based data retrieval

### Storage
- IPFS for distributed image storage
- CDN for faster image delivery
- Database indexing for quick queries

### Frontend
- Static generation for public pages
- Client-side caching
- Responsive design for all devices