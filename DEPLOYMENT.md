# Deployment Guide

## Prerequisites

1. Node.js 18+ installed
2. MongoDB running locally or MongoDB Atlas account
3. Infura account for IPFS and Polygon RPC
4. Wallet with MATIC tokens for deployment

## Smart Contract Deployment

1. Navigate to smart-contracts directory:
```bash
cd smart-contracts
npm install
```

2. Create `.env` file:
```
PRIVATE_KEY=your_wallet_private_key_without_0x_prefix
```

3. Deploy contract:
```bash
npm run deploy
```

4. Save the deployed contract address for backend configuration.

## Backend Deployment

1. Navigate to backend directory:
```bash
cd backend
npm install
```

2. Create `.env` file:
```
PORT=3001
MONGODB_URI=mongodb://localhost:27017/herbtrace
POLYGON_RPC_URL=https://polygon-mumbai.infura.io/v3/YOUR_PROJECT_ID
PRIVATE_KEY=your_wallet_private_key_without_0x_prefix
CONTRACT_ADDRESS=deployed_contract_address_from_step_above
IPFS_PROJECT_ID=your_infura_ipfs_project_id
IPFS_PROJECT_SECRET=your_infura_ipfs_secret
```

3. Start server:
```bash
npm start
```

## Web Dashboard Deployment

1. Navigate to web-dashboard directory:
```bash
cd web-dashboard
npm install
```

2. Start development server:
```bash
npm run dev
```

3. For production deployment on Vercel:
```bash
npm run build
```

## Mobile App Setup

1. Navigate to mobile-app directory:
```bash
cd mobile-app
npm install
```

2. For Android:
```bash
npx react-native run-android
```

3. Update API_BASE_URL in RegisterBatchScreen.js to your backend URL.

## Production Deployment

### Backend (Heroku)
1. Create Heroku app
2. Set environment variables in Heroku dashboard
3. Deploy using Git

### Frontend (Vercel)
1. Connect GitHub repository to Vercel
2. Deploy automatically on push

### Mobile App
1. Build APK for Android
2. Submit to Google Play Store