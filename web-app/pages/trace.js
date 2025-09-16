import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

const API_BASE_URL = 'http://localhost:3001';

export default function TracePage() {
  const [batch, setBatch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (id) {
      fetchBatchDetails();
    }
  }, [id]);

  const fetchBatchDetails = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/batch/${id}`);
      if (!response.ok) {
        throw new Error('Batch not found');
      }
      const data = await response.json();
      setBatch(data);
    } catch (error) {
      console.error('Error fetching batch details:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const parseLocation = (geoLocation) => {
    const [lat, lng] = geoLocation.split(',');
    return { lat: parseFloat(lat), lng: parseFloat(lng) };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl">Loading traceability information...</div>
      </div>
    );
  }

  if (error || !batch) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-2">Batch Not Found</h1>
          <p className="text-gray-600">The requested batch could not be found.</p>
        </div>
      </div>
    );
  }

  const location = parseLocation(batch.geoLocation);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-green-600 text-white py-8">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-3xl font-bold mb-2">Herb Traceability</h1>
          <p className="text-green-100">Transparent supply chain for Ayurvedic herbs</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-2xl font-bold mb-4 text-gray-800">
                {batch.herbName}
              </h2>
              <div className="space-y-3">
                <div>
                  <span className="font-semibold text-gray-700">Batch ID:</span>
                  <span className="ml-2 text-gray-600">#{batch.id}</span>
                </div>
                <div>
                  <span className="font-semibold text-gray-700">Quantity:</span>
                  <span className="ml-2 text-gray-600">{batch.quantity}</span>
                </div>
                <div>
                  <span className="font-semibold text-gray-700">Collection Date:</span>
                  <span className="ml-2 text-gray-600">
                    {new Date(batch.collectionTimestamp).toLocaleDateString()}
                  </span>
                </div>
                <div>
                  <span className="font-semibold text-gray-700">Location:</span>
                  <span className="ml-2 text-gray-600">
                    {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
                  </span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-3 text-gray-800">Herb Image</h3>
              <img
                src={`https://ipfs.io/ipfs/${batch.ipfsImageHash}`}
                alt={batch.herbName}
                className="w-full h-64 object-cover rounded-lg shadow-md"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Supply Chain Journey</h2>
          <div className="relative">
            {batch.statusHistory.map((status, index) => (
              <div key={index} className="flex items-start mb-6 last:mb-0">
                <div className="flex-shrink-0 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {index + 1}
                </div>
                <div className="ml-4 flex-grow">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-semibold text-lg text-gray-800 mb-1">
                      {status.status}
                    </h3>
                    <p className="text-gray-600 text-sm mb-2">
                      {new Date(status.timestamp).toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-500">
                      Verified on blockchain: {status.updatedBy.slice(0, 10)}...
                    </p>
                  </div>
                </div>
                {index < batch.statusHistory.length - 1 && (
                  <div className="absolute left-4 mt-8 w-0.5 h-6 bg-gray-300"></div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Collection Location</h2>
          <div className="bg-gray-100 rounded-lg p-4 text-center">
            <p className="text-gray-600 mb-2">
              Coordinates: {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
            </p>
            <a
              href={`https://www.openstreetmap.org/?mlat=${location.lat}&mlon=${location.lng}&zoom=15`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-200"
            >
              View on Map
            </a>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-gray-500 text-sm">
            This information is stored immutably on the Polygon blockchain
          </p>
        </div>
      </div>
    </div>
  );
}