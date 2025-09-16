import { useState, useEffect } from 'react';
import StatsCard from '../components/StatsCard';
import LoadingSpinner from '../components/LoadingSpinner';

const API_BASE_URL = 'http://localhost:3001';

export default function ConsumerAnalytics() {
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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

  const getConsumerStats = () => {
    const total = batches.length;
    const herbTypes = [...new Set(batches.map(b => b.herbName))].length;
    const verified = batches.filter(b => b.currentStatus !== 'Collected').length;
    const recentBatches = batches.filter(b => {
      const batchDate = new Date(b.collectionTimestamp);
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      return batchDate >= thirtyDaysAgo;
    }).length;

    return { total, herbTypes, verified, recentBatches };
  };

  if (loading) {
    return <LoadingSpinner size="lg" text="Loading herb information..." />;
  }

  const stats = getConsumerStats();

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Herb Verification System</h2>
          <p className="text-gray-600 mt-1">Transparency in Ayurvedic herb supply chain</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <StatsCard
            title="Total Herbs"
            value={stats.total}
            icon="🌿"
            color="green"
          />
          <StatsCard
            title="Herb Varieties"
            value={stats.herbTypes}
            icon="🌱"
            color="green"
          />
          <StatsCard
            title="Verified Batches"
            value={stats.verified}
            icon="✅"
            color="blue"
          />
          <StatsCard
            title="Recent (30 days)"
            value={stats.recentBatches}
            icon="📅"
            color="yellow"
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">🔍 How to Verify</h3>
            <div className="space-y-3">
              <div className="flex items-start">
                <span className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">1</span>
                <p className="text-gray-700">Look for QR code on product packaging</p>
              </div>
              <div className="flex items-start">
                <span className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">2</span>
                <p className="text-gray-700">Scan with your phone camera or QR app</p>
              </div>
              <div className="flex items-start">
                <span className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">3</span>
                <p className="text-gray-700">View complete supply chain journey</p>
              </div>
              <div className="flex items-start">
                <span className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">4</span>
                <p className="text-gray-700">Verify authenticity on blockchain</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">🌿 Available Herbs</h3>
            <div className="space-y-2">
              {[...new Set(batches.map(b => b.herbName))].slice(0, 8).map((herb, index) => (
                <div key={index} className="flex justify-between items-center p-2 bg-green-50 rounded">
                  <span className="font-medium text-green-800">{herb}</span>
                  <span className="text-sm text-green-600">
                    {batches.filter(b => b.herbName === herb).length} batches
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6">
          <div className="text-center">
            <h3 className="text-xl font-bold text-gray-900 mb-2">🔒 Blockchain Verified</h3>
            <p className="text-gray-700 mb-4">
              All herb batches are recorded on Polygon blockchain for complete transparency and immutability.
            </p>
            <div className="flex justify-center space-x-8 text-sm text-gray-600">
              <div className="text-center">
                <div className="font-bold text-lg text-green-600">{stats.total}</div>
                <div>Verified Records</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-lg text-blue-600">100%</div>
                <div>Transparency</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-lg text-purple-600">∞</div>
                <div>Immutable</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}