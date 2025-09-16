import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import BatchCard from '../components/BatchCard';
import ConsumerBatchCard from '../components/ConsumerBatchCard';
import LoadingSpinner from '../components/LoadingSpinner';

const API_BASE_URL = 'http://localhost:3001';

export default function Dashboard() {
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userType, setUserType] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setUserType(localStorage.getItem('userType') || 'farmer');
    }
    fetchBatches();
  }, []);

  const fetchBatches = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/batches`);
      const data = await response.json();
      setBatches(data);
    } catch (error) {
      console.error('Error fetching batches:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredBatches = batches.filter(batch => 
    batch.herbName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    batch.id.toString().includes(searchTerm)
  );

  if (loading) {
    return <LoadingSpinner size="lg" text="Loading batches..." />;
  }

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {userType === 'consumer' ? 'Available Herbs' : 'Herb Batches'}
            </h2>
            <p className="text-gray-600 mt-1">
              {userType === 'consumer' 
                ? `${batches.length} herbs available for verification` 
                : `${batches.length} total batches`
              }
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              placeholder="Search batches..."
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {userType === 'farmer' && (
              <Link
                href="/register-batch"
                className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 text-center whitespace-nowrap"
              >
                + Register New Batch
              </Link>
            )}
            {userType === 'consumer' && (
              <Link
                href="/scan-qr"
                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 text-center whitespace-nowrap"
              >
                📱 Scan QR Code
              </Link>
            )}
          </div>
        </div>
        
        {filteredBatches.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📦</div>
            <p className="text-gray-500 text-lg">
              {searchTerm ? 'No batches match your search' : 'No batches found'}
            </p>
            {userType === 'farmer' && !searchTerm && (
              <Link
                href="/register-batch"
                className="inline-block mt-4 bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700"
              >
                Register Your First Batch
              </Link>
            )}
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredBatches.map((batch) => (
              userType === 'consumer' ? (
                <ConsumerBatchCard key={batch.id} batch={batch} />
              ) : (
                <BatchCard key={batch.id} batch={batch} />
              )
            ))}
          </div>
        )}
      </div>
    </div>
  );
}