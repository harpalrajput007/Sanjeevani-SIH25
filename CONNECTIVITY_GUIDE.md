# Connectivity Guide

## System Architecture

```
Frontend (Next.js) ←→ Backend (Express) ←→ Blockchain (Polygon)
     ↓                      ↓
  Port 3000            Port 3001
                           ↓
                    MongoDB + IPFS
```

## Quick Setup

1. **Install Dependencies**
   ```bash
   # Run setup script
   setup.bat
   
   # Or manually:
   cd smart-contracts && npm install
   cd ../backend && npm install  
   cd ../web-app && npm install
   ```

2. **Configure Environment**
   - Update `backend/.env` with your credentials
   - Update `smart-contracts/.env` with wallet private key
   - Update `web-app/.env.local` if needed

3. **Deploy Smart Contract**
   ```bash
   cd smart-contracts
   npm run deploy
   # Copy contract address to backend/.env
   ```

4. **Start Services**
   ```bash
   # Use development script
   start-dev.bat
   
   # Or manually:
   cd backend && npm run dev     # Port 3001
   cd web-app && npm run dev     # Port 3000
   ```

## Testing Connectivity

```bash
node test-connection.js
```

## API Endpoints

- `GET /api/health` - Health check
- `POST /api/batch` - Create new batch
- `GET /api/batches` - Get all batches
- `GET /api/batch/:id` - Get batch details
- `PUT /api/batch/:id/status` - Update batch status
- `GET /api/batch-count` - Get total batch count

## Frontend Pages

- `/` - Login page
- `/dashboard` - Main dashboard
- `/register-batch` - Register new batch
- `/batch/[id]` - Batch details
- `/trace` - Public traceability
- `/analytics` - Analytics dashboard

## Troubleshooting

1. **Backend not starting**: Check MongoDB connection and .env file
2. **Frontend API errors**: Verify backend is running on port 3001
3. **Blockchain errors**: Check contract address and network configuration
4. **IPFS upload fails**: Verify IPFS credentials in .env file