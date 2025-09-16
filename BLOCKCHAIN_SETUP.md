# Blockchain Setup Guide

## Prerequisites

1. **Install Ganache**
   - Download from: https://trufflesuite.com/ganache/
   - Or install CLI: `npm install -g ganache-cli`

2. **Install MetaMask**
   - Browser extension: https://metamask.io/

## Setup Steps

### 1. Start Ganache

**Option A: Ganache GUI**
- Open Ganache application
- Click "New Workspace"
- Set RPC Server to `HTTP://127.0.0.1:7545`
- Set Network ID to `1337`
- Click "Save Workspace"

**Option B: Ganache CLI**
```bash
ganache-cli --host 127.0.0.1 --port 7545 --networkId 1337
```

### 2. Configure MetaMask

1. Open MetaMask
2. Click network dropdown (top center)
3. Click "Add Network" → "Add a network manually"
4. Enter these details:
   - **Network Name**: Ganache Local
   - **New RPC URL**: http://127.0.0.1:7545
   - **Chain ID**: 1337
   - **Currency Symbol**: ETH
5. Click "Save"

### 3. Import Ganache Account to MetaMask

1. In Ganache, copy a private key from the "Accounts" tab
2. In MetaMask, click account icon → "Import Account"
3. Paste the private key
4. Click "Import"

### 4. Deploy Smart Contract

```bash
cd smart-contracts
npm install
npx hardhat compile
npx hardhat run scripts/deploy.js --network ganache
```

### 5. Update Web App Configuration

1. Copy the contract address from deployment output
2. Create/update `.env.local` in web-app folder:
```
NEXT_PUBLIC_CONTRACT_ADDRESS=0x... (your contract address)
```

### 6. Install Web App Dependencies

```bash
cd web-app
npm install ethers
```

### 7. Test Connection

1. Start the web app: `npm run dev`
2. Go to login/signup page
3. Click "Connect Wallet"
4. MetaMask should prompt to connect
5. Select your imported Ganache account

## Troubleshooting

### MetaMask Connection Issues
- Make sure you're on the Ganache network in MetaMask
- Check that Ganache is running on port 7545
- Try refreshing the page after connecting

### Contract Deployment Issues
- Ensure Ganache is running
- Check that you have ETH in your account
- Verify the contract address in .env.local

### Network Errors
- Reset MetaMask account: Settings → Advanced → Reset Account
- Clear browser cache
- Restart Ganache

## Smart Contract Functions

The deployed contract supports:
- `createBatch()` - Create new herb batch
- `getBatchDetails()` - Get batch information
- `updateBatchStatus()` - Update batch status
- `getBatchCount()` - Get total batches

## Testing

You can test the blockchain integration by:
1. Connecting your wallet
2. Creating a new batch (farmer dashboard)
3. Viewing batch details (consumer portal)
4. Updating batch status (manufacturer dashboard)

All transactions will be recorded on your local Ganache blockchain!