import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, Package, Leaf, Activity, CheckCircle, Truck, Settings, Sparkles } from 'lucide-react';

const API_BASE_URL = 'http://localhost:3001';

export default function Analytics() {
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userType, setUserType] = useState('');
  const router = useRouter();

  useEffect(() => {
    fetchBatches();
  }, []);

  const fetchBatches = async () => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);
      
      const response = await fetch(`${API_BASE_URL}/api/batches`, {
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      
      const data = await response.json();
      setBatches(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching batches:', error);
      setBatches([]);
    } finally {
      setLoading(false);
    }
  };

  const getStats = () => {
    const total = batches.length;
    const collected = batches.filter(b => b.currentStatus === 'Collected').length;
    const inTransit = batches.filter(b => b.currentStatus === 'In-Transit').length;
    const processing = batches.filter(b => b.currentStatus === 'Processing').length;
    const completed = batches.filter(b => b.currentStatus === 'Completed').length;

    const herbTypes = [...new Set(batches.map(b => b.herbName))].length;
    const thisWeek = batches.filter(b => {
      const batchDate = new Date(b.collectionTimestamp);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return batchDate >= weekAgo;
    }).length;
    
    return { total, collected, inTransit, processing, completed, herbTypes, thisWeek };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cream-50 via-herbal-50 to-cream-100 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="text-4xl"
        >
          🌿
        </motion.div>
        <span className="ml-4 text-herbal-700 text-lg">Loading analytics...</span>
      </div>
    );
  }

  const stats = getStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream-50 via-herbal-50 to-cream-100">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Animated Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center"
        >
          <div className="flex items-center justify-center mb-4">
            <BarChart3 className="text-herbal-600 mr-3" size={32} />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-herbal-700 to-herbal-600 bg-clip-text text-transparent">
              Analytics Sanctuary
            </h1>
            <TrendingUp className="text-herbal-600 ml-3" size={32} />
          </div>
          <p className="text-herbal-600 text-lg">Insights into your herbal journey and impact</p>
        </motion.div>

        {/* Main Stats Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            whileHover={{ scale: 1.02 }}
            className="bg-gradient-to-br from-herbal-500 to-herbal-600 text-white p-6 rounded-xl shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-herbal-100 text-sm font-medium">Total Batches</p>
                <p className="text-3xl font-bold mt-1">{stats.total}</p>
                <p className="text-herbal-200 text-xs mt-1">All collections</p>
              </div>
              <Package className="text-herbal-200" size={32} />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            whileHover={{ scale: 1.02 }}
            className="bg-white p-6 rounded-xl shadow-lg border border-herbal-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-herbal-600 text-sm font-medium">Herb Varieties</p>
                <p className="text-3xl font-bold text-herbal-800 mt-1">{stats.herbTypes}</p>
                <p className="text-herbal-600 text-xs mt-1">Unique types</p>
              </div>
              <Leaf className="text-herbal-600" size={32} />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            whileHover={{ scale: 1.02 }}
            className="bg-white p-6 rounded-xl shadow-lg border border-herbal-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-herbal-600 text-sm font-medium">This Week</p>
                <p className="text-3xl font-bold text-herbal-800 mt-1">{stats.thisWeek}</p>
                <p className="text-herbal-600 text-xs mt-1">Recent activity</p>
              </div>
              <Activity className="text-herbal-600" size={32} />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            whileHover={{ scale: 1.02 }}
            className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-xl shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium">Completed</p>
                <p className="text-3xl font-bold mt-1">{stats.completed}</p>
                <p className="text-green-200 text-xs mt-1">Success rate</p>
              </div>
              <CheckCircle className="text-green-200" size={32} />
            </div>
          </motion.div>
        </div>

        {/* Status Overview */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-xl shadow-lg p-6 border border-herbal-200"
          >
            <div className="flex items-center mb-6">
              <Sparkles className="text-herbal-600 mr-3" size={24} />
              <h3 className="text-xl font-bold text-herbal-800">Status Distribution</h3>
            </div>
            <div className="space-y-4">
              {[
                { label: 'Collected', value: stats.collected, icon: CheckCircle, color: 'bg-green-500' },
                { label: 'In Transit', value: stats.inTransit, icon: Truck, color: 'bg-amber-500' },
                { label: 'Processing', value: stats.processing, icon: Settings, color: 'bg-blue-500' },
                { label: 'Completed', value: stats.completed, icon: Sparkles, color: 'bg-herbal-500' }
              ].map((item, index) => {
                const percentage = stats.total > 0 ? (item.value / stats.total) * 100 : 0;
                return (
                  <div key={item.label} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <item.icon size={16} className="text-herbal-600 mr-2" />
                      <span className="text-herbal-700 font-medium">{item.label}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${percentage}%` }}
                          transition={{ delay: 0.7 + index * 0.1, duration: 0.8 }}
                          className={`h-2 rounded-full ${item.color}`}
                        />
                      </div>
                      <span className="text-herbal-800 font-bold w-8">{item.value}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white rounded-xl shadow-lg p-6 border border-herbal-200"
          >
            <div className="flex items-center mb-6">
              <Activity className="text-herbal-600 mr-3" size={24} />
              <h3 className="text-xl font-bold text-herbal-800">Recent Activity</h3>
            </div>
            <div className="space-y-3">
              {batches.slice(0, 5).map((batch, index) => (
                <motion.div
                  key={batch.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                  className="flex items-center justify-between p-3 bg-cream-50 rounded-lg border border-herbal-100 hover:bg-herbal-50 transition-colors"
                >
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-herbal-100 rounded-full flex items-center justify-center mr-3">
                      <Leaf className="text-herbal-600" size={16} />
                    </div>
                    <div>
                      <p className="font-medium text-herbal-800">{batch.herbName}</p>
                      <p className="text-sm text-herbal-600">Batch #{batch.id}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-herbal-700">{batch.currentStatus}</p>
                    <p className="text-xs text-herbal-500">
                      {new Date(batch.collectionTimestamp).toLocaleDateString()}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
            {batches.length === 0 && (
              <div className="text-center py-8">
                <div className="text-4xl mb-2">🌿</div>
                <p className="text-herbal-600">No batches yet. Start collecting herbs!</p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}