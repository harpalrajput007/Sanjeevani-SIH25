export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';
export const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;

export const API_ENDPOINTS = {
  BATCH: '/api/batch',
  BATCHES: '/api/batches',
  BATCH_COUNT: '/api/batch-count',
  BATCH_STATUS: (id) => `/api/batch/${id}/status`,
  BATCH_DETAILS: (id) => `/api/batch/${id}`
};