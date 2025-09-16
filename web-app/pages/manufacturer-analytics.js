import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { Factory, TrendingUp, Package, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import AnalyticsChart from '../components/manufacturer/AnalyticsChart';

const API_BASE_URL = 'http://localhost:3001';

export default function ManufacturerAnalytics() {
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated() || user?.userType !== 'manufacturer') {
      router.push('/login');
      return;
    }
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

  const getManufacturingStats = () => {
    const batchArray = Array.isArray(batches) ? batches : [];
    const total = batchArray.length;
    const processing = batchArray.filter(b => b.currentStatus === 'Processing').length;
    const packaging = batchArray.filter(b => b.currentStatus === 'Packaging').length;
    const labelling = batchArray.filter(b => b.currentStatus === 'Labelling').length;
    const completed = batchArray.filter(b => b.currentStatus === 'Completed').length;
    const pending = batchArray.filter(b => b.currentStatus === 'Collected').length;
    
    const processingRate = total > 0 ? Math.round((completed / total) * 100) : 0;
    const avgProcessingTime = '3.2 days'; // Mock data
    
    return { total, processing, packaging, labelling, completed, pending, processingRate, avgProcessingTime };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-pharma-gradient flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="text-4xl"
        >
          ⚙️
        </motion.div>
        <span className="ml-4 text-white text-lg">Loading analytics...</span>
      </div>
    );
  }

  const stats = getManufacturingStats();

  return (
    <div className="min-h-screen bg-pharma-gradient relative">
      {/* Futuristic Overlay */}
      <div className="absolute inset-0 bg-white bg-opacity-10"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 relative overflow-hidden bg-white bg-opacity-20 backdrop-blur-sm rounded-xl p-6 border border-white border-opacity-30"
        >
          {/* Shimmer Animation */}
          <div className="absolute inset-0 -skew-x-12 bg-gradient-to-r from-transparent via-white via-opacity-20 to-transparent animate-shimmer"></div>
          
          <div className="relative z-10">
            <div className="flex items-center mb-4">
              <Factory className="text-white mr-3" size={32} />
              <h1 className="text-3xl font-bold text-white">Manufacturing Analytics</h1>
            </div>
            <p className="text-blue-100">Production insights and performance metrics</p>
          </div>
        </motion.div>

        {/* Key Metrics */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-lg shadow-xl p-6 border border-blue-200 hover:border-blue-400 transition-all duration-300"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Total Processed</p>
                <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">{stats.total}</p>
                <p className="text-xs text-blue-600 mt-1">All time batches</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full">
                <Package className="text-white" size={24} />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-lg shadow-xl p-6 border border-green-200 hover:border-green-400 transition-all duration-300"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Success Rate</p>
                <p className="text-3xl font-bold bg-gradient-to-r from-green-500 to-green-700 bg-clip-text text-transparent">{stats.processingRate}%</p>
                <p className="text-xs text-green-600 mt-1">Completion rate</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-full">
                <CheckCircle className="text-white" size={24} />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-lg shadow-xl p-6 border border-amber-200 hover:border-amber-400 transition-all duration-300"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Avg Processing</p>
                <p className="text-3xl font-bold bg-gradient-to-r from-amber-500 to-amber-700 bg-clip-text text-transparent">{stats.avgProcessingTime}</p>
                <p className="text-xs text-amber-600 mt-1">Per batch</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-amber-500 to-amber-600 rounded-full">
                <Clock className="text-white" size={24} />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-lg shadow-xl p-6 border border-red-200 hover:border-red-400 transition-all duration-300"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Pending Review</p>
                <p className="text-3xl font-bold bg-gradient-to-r from-red-500 to-red-700 bg-clip-text text-transparent">{stats.pending}</p>
                <p className="text-xs text-red-600 mt-1">Awaiting processing</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-red-500 to-red-600 rounded-full">
                <AlertTriangle className="text-white" size={24} />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Charts Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-8"
        >
          <AnalyticsChart batches={Array.isArray(batches) ? batches : []} />
        </motion.div>

        {/* Manufacturing Pipeline Status */}
        <div className="grid lg:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white rounded-lg shadow-xl p-6 border border-gray-200"
          >
            <div className="flex items-center mb-6">
              <TrendingUp className="text-blue-600 mr-3" size={20} />
              <h3 className="text-xl font-semibold text-gray-900">Production Pipeline</h3>
            </div>
            
            <div className="space-y-4">
              {[
                { stage: 'Processing', count: stats.processing, color: 'bg-blue-500', icon: '⚗️' },
                { stage: 'Packaging', count: stats.packaging, color: 'bg-purple-500', icon: '📦' },
                { stage: 'Labelling', count: stats.labelling, color: 'bg-indigo-500', icon: '🏷️' },
                { stage: 'Completed', count: stats.completed, color: 'bg-green-500', icon: '✅' }
              ].map((item, index) => {
                const percentage = stats.total > 0 ? (item.count / stats.total) * 100 : 0;
                return (
                  <div key={item.stage} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <span className="text-lg mr-3">{item.icon}</span>
                      <span className="font-medium text-gray-700">{item.stage}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${percentage}%` }}
                          transition={{ delay: 0.8 + index * 0.1, duration: 0.8 }}
                          className={`h-2 rounded-full ${item.color}`}
                        />
                      </div>
                      <span className="font-bold text-gray-900 w-8">{item.count}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* Quality Metrics */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-white rounded-lg shadow-xl p-6 border border-gray-200"
          >
            <div className="flex items-center mb-6">
              <CheckCircle className="text-green-600 mr-3" size={20} />
              <h3 className="text-xl font-semibold text-gray-900">Quality Metrics</h3>
            </div>
            
            <div className="space-y-6">
              <div className="bg-green-50 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-green-700">Quality Pass Rate</span>
                  <span className="text-lg font-bold text-green-800">98.5%</span>
                </div>
                <div className="w-full bg-green-200 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{ width: '98.5%' }}></div>
                </div>
              </div>
              
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-blue-700">On-Time Delivery</span>
                  <span className="text-lg font-bold text-blue-800">94.2%</span>
                </div>
                <div className="w-full bg-blue-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: '94.2%' }}></div>
                </div>
              </div>
              
              <div className="bg-purple-50 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-purple-700">Batch Efficiency</span>
                  <span className="text-lg font-bold text-purple-800">91.8%</span>
                </div>
                <div className="w-full bg-purple-200 rounded-full h-2">
                  <div className="bg-purple-600 h-2 rounded-full" style={{ width: '91.8%' }}></div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}