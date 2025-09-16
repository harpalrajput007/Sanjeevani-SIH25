import { useState } from 'react';
import { useRouter } from 'next/router';

export default function ScanQR() {
  const [batchId, setBatchId] = useState('');
  const router = useRouter();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (batchId.trim()) {
      router.push(`/trace?id=${batchId}`);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <div className="text-center mb-8">
        <div className="text-6xl mb-4">📱</div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Scan QR Code</h1>
        <p className="text-gray-600">Enter batch ID to view traceability information</p>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Batch ID
            </label>
            <input
              type="text"
              placeholder="Enter batch ID (e.g., 1, 2, 3...)"
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
              value={batchId}
              onChange={(e) => setBatchId(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 font-medium text-lg"
          >
            🔍 View Traceability
          </button>
        </form>

        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-semibold text-blue-900 mb-2">How to use:</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Scan the QR code on the product packaging</li>
            <li>• Or manually enter the batch ID shown on the label</li>
            <li>• View complete supply chain journey</li>
            <li>• Verify authenticity on blockchain</li>
          </ul>
        </div>
      </div>
    </div>
  );
}