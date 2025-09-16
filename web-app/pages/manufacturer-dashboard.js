import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { Factory, BarChart3, Package, FileCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import BatchTable from '../components/manufacturer/BatchTable';
import MessengerWidget from '../components/manufacturer/MessengerWidget';

const API_BASE_URL = 'http://localhost:3001';

export default function ManufacturerDashboard() {
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalBatches: 0,
    processing: 0,
    completed: 0,
    pending: 0
  });
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
      
      // Calculate stats
      const batchArray = Array.isArray(data) ? data : [];
      const total = batchArray.length;
      const processing = batchArray.filter(b => b.currentStatus === 'Processing').length;
      const completed = batchArray.filter(b => b.currentStatus === 'Completed').length;
      const pending = batchArray.filter(b => b.currentStatus === 'Collected').length;
      
      setStats({ totalBatches: total, processing, completed, pending });
    } catch (error) {
      console.error('Error fetching batches:', error);
      setBatches([]);
      setStats({ totalBatches: 0, processing: 0, completed: 0, pending: 0 });
    } finally {
      setLoading(false);
    }
  };

  const handleBatchClick = (batch) => {
    router.push(`/batch-detail/${batch.id}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="text-4xl"
        >
          ⚙️
        </motion.div>
        <span className="ml-4 text-gray-700 text-lg">Loading dashboard...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-pharma-gradient relative">
      {/* Futuristic Overlay */}
      <div className="absolute inset-0 bg-white bg-opacity-10"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto py-4 sm:py-6 px-4 sm:px-6 lg:px-8">
        {/* Header with Shimmer Effect */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 sm:mb-8 relative overflow-hidden bg-white bg-opacity-20 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-white border-opacity-30"
        >
          {/* Shimmer Animation */}
          <div className="absolute inset-0 -skew-x-12 bg-gradient-to-r from-transparent via-white via-opacity-20 to-transparent animate-shimmer"></div>
          
          <div className="relative z-10">
            <div className="flex flex-col sm:flex-row items-center mb-3 sm:mb-4">
              <Factory className="text-white mr-0 sm:mr-3 mb-2 sm:mb-0" size={24} />
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white text-center sm:text-left">Manufacturing Control Center</h1>
            </div>
            <p className="text-blue-100 text-center sm:text-left text-sm sm:text-base">Monitor and manage herb processing operations</p>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-lg shadow-xl p-3 sm:p-4 lg:p-6 border border-blue-200 hover:border-blue-400 transition-all duration-300 hover:shadow-2xl"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Total Batches</p>
                <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">{stats.totalBatches}</p>
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
            className="bg-white rounded-lg shadow-xl p-3 sm:p-4 lg:p-6 border border-amber-200 hover:border-amber-400 transition-all duration-300 hover:shadow-2xl"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Pending Review</p>
                <p className="text-3xl font-bold bg-gradient-to-r from-amber-500 to-amber-700 bg-clip-text text-transparent">{stats.pending}</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-amber-500 to-amber-600 rounded-full">
                <FileCheck className="text-white" size={24} />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-lg shadow-xl p-3 sm:p-4 lg:p-6 border border-indigo-200 hover:border-indigo-400 transition-all duration-300 hover:shadow-2xl"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">In Processing</p>
                <p className="text-3xl font-bold bg-gradient-to-r from-indigo-500 to-indigo-700 bg-clip-text text-transparent">{stats.processing}</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-full">
                <Factory className="text-white" size={24} />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-lg shadow-xl p-3 sm:p-4 lg:p-6 border border-teal-200 hover:border-teal-400 transition-all duration-300 hover:shadow-2xl"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Completed</p>
                <p className="text-3xl font-bold bg-gradient-to-r from-teal-500 to-teal-700 bg-clip-text text-transparent">{stats.completed}</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-teal-500 to-teal-600 rounded-full">
                <BarChart3 className="text-white" size={24} />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Batch Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden"
        >
          <BatchTable batches={batches} onBatchClick={handleBatchClick} />
        </motion.div>
      </div>
      
      {/* Messenger Widget */}
      <MessengerWidget />
    </div>
  );
}