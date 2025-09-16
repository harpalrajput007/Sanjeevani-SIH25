# API Documentation

## Base URL
```
http://localhost:3001
```

## Endpoints

### 1. Create New Batch
**POST** `/api/batch`

Creates a new herb batch on the blockchain with image upload to IPFS.

**Request:**
- Content-Type: `multipart/form-data`
- Body:
  - `herbName` (string): Name of the herb
  - `quantity` (string): Quantity collected
  - `geoLocation` (string): GPS coordinates "latitude,longitude"
  - `image` (file): Image file of the herb

**Response:**
```json
{
  "success": true,
  "batchId": "1",
  "ipfsHash": "QmXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  "transactionHash": "0xXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
}
```

### 2. Update Batch Status
**PUT** `/api/batch/:id/status`

Updates the status of an existing batch.

**Request:**
- Content-Type: `application/json`
- Body:
```json
{
  "newStatus": "In-Transit"
}
```

**Response:**
```json
{
  "success": true,
  "transactionHash": "0xXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
}
```

### 3. Get Batch Details
**GET** `/api/batch/:id`

Retrieves complete details of a specific batch (public endpoint).

**Response:**
```json
{
  "id": "1",
  "herbName": "Turmeric",
  "quantity": "5kg",
  "ipfsImageHash": "QmXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  "geoLocation": "12.9716,77.5946",
  "collectionTimestamp": "2024-01-15T10:30:00.000Z",
  "owner": "0xXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  "statusHistory": [
    {
      "status": "Collected",
      "timestamp": "2024-01-15T10:30:00.000Z",
      "updatedBy": "0xXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
    },
    {
      "status": "In-Transit",
      "timestamp": "2024-01-15T14:20:00.000Z",
      "updatedBy": "0xXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
    }
  ]
}
```

### 4. List All Batches
**GET** `/api/batches`

Retrieves a list of all batches with basic information.

**Response:**
```json
[
  {
    "id": "1",
    "herbName": "Turmeric",
    "quantity": "5kg",
    "collectionTimestamp": "2024-01-15T10:30:00.000Z",
    "currentStatus": "In-Transit"
  },
  {
    "id": "2",
    "herbName": "Ashwagandha",
    "quantity": "3kg",
    "collectionTimestamp": "2024-01-16T09:15:00.000Z",
    "currentStatus": "Collected"
  }
]
```

## Error Responses

All endpoints return error responses in the following format:

```json
{
  "error": "Error message description"
}
```

Common HTTP status codes:
- `400` - Bad Request (missing required fields)
- `404` - Not Found (batch doesn't exist)
- `500` - Internal Server Error (blockchain/IPFS issues)

## Smart Contract Integration

The API interacts with the HerbTrace smart contract deployed on Polygon Mumbai testnet. All batch data is stored immutably on the blockchain, with images stored on IPFS for decentralized access.