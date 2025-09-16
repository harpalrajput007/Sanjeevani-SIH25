import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { Leaf, TrendingUp, Calendar, BarChart3 } from 'lucide-react';
import EnhancedBatchWizard from '../components/wizard/EnhancedBatchWizard';
import ProgressVine from '../components/ProgressVine';
import BadgeCard from '../components/BadgeCard';
import EnhancedSuccessCard from '../components/EnhancedSuccessCard';
import MessengerWidget from '../components/farmer/MessengerWidget';

const API_BASE_URL = 'http://localhost:3001';

export default function FarmerDashboard() {
  const [stats, setStats] = useState({
    totalBatches: 0,
    weeklyBatches: 0,
    monthlyBatches: 0
  });
  const [showSuccess, setShowSuccess] = useState(false);
  const [successBatchId, setSuccessBatchId] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);
      
      const response = await fetch(`${API_BASE_URL}/api/batch-count`, {
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      
      const data = await response.json();
      setStats({
        totalBatches: data.count || 0,
        weeklyBatches: Math.floor(data.count * 0.3) || 0,
        monthlyBatches: data.count || 0
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
      setStats({ totalBatches: 0, weeklyBatches: 0, monthlyBatches: 0 });
    } finally {
      setLoading(false);
    }
  };

  const handleBatchSuccess = (batchId) => {
    setSuccessBatchId(batchId);
    setShowSuccess(true);
    fetchStats(); // Refresh stats
  };

  const closeSuccess = () => {
    setShowSuccess(false);
    setSuccessBatchId(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-amber-50 flex items-center justify-center">
        <div className="text-xl text-green-700">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream-50 via-herbal-50 to-cream-100">
      <div className="max-w-7xl mx-auto py-4 sm:py-6 px-4 sm:px-6 lg:px-8">
        {/* Animated Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 sm:mb-8 text-center"
        >
          <div className="flex flex-col sm:flex-row items-center justify-center mb-3 sm:mb-4">
            <Leaf className="text-herbal-600 mr-0 sm:mr-3 mb-2 sm:mb-0" size={24} />
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-herbal-700 to-herbal-600 bg-clip-text text-transparent">
              Farmer's Sanctuary
            </h1>
            <Leaf className="text-herbal-600 ml-0 sm:ml-3 mt-2 sm:mt-0" size={24} />
          </div>
          <p className="text-herbal-600 text-base sm:text-lg px-4">Nurture nature's gifts and preserve ancient wisdom</p>
        </motion.div>

        {/* Batch Creation Wizard */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <EnhancedBatchWizard onSuccess={handleBatchSuccess} />
        </motion.div>

        {/* Stats Cards Row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8"
        >
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-gradient-to-br from-herbal-500 to-herbal-600 text-white p-4 sm:p-6 rounded-xl shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-herbal-100 text-sm font-medium">Total Contributions</p>
                <p className="text-3xl font-bold mt-1">{stats.totalBatches}</p>
                <p className="text-herbal-200 text-xs mt-1">Herb batches collected</p>
              </div>
              <div className="text-4xl opacity-80">🌿</div>
            </div>
          </motion.div>
          
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white p-6 rounded-xl shadow-lg border border-herbal-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-herbal-600 text-sm font-medium">This Week</p>
                <p className="text-3xl font-bold text-herbal-800 mt-1">{stats.weeklyBatches}</p>
                <p className="text-herbal-600 text-xs mt-1">Weekly collections</p>
              </div>
              <Calendar className="text-herbal-600" size={32} />
            </div>
          </motion.div>
          
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white p-6 rounded-xl shadow-lg border border-herbal-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-herbal-600 text-sm font-medium">This Month</p>
                <p className="text-3xl font-bold text-herbal-800 mt-1">{stats.monthlyBatches}</p>
                <p className="text-herbal-600 text-xs mt-1">Monthly total</p>
              </div>
              <TrendingUp className="text-herbal-600" size={32} />
            </div>
          </motion.div>
        </motion.div>

        {/* Horizontal Layout for Progress, Badges, and Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {/* Progress Vines */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="space-y-4"
          >
            <ProgressVine
              current={stats.totalBatches}
              target={5}
              label="Next Badge Progress"
              icon="🏆"
            />
            <ProgressVine
              current={stats.weeklyBatches}
              target={3}
              label="Weekly Goal"
              icon="📅"
            />
          </motion.div>

          {/* Badge System */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <BadgeCard totalBatches={stats.totalBatches} />
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.0 }}
            className="bg-white rounded-xl shadow-lg p-6 border border-herbal-200 h-fit"
          >
            <div className="flex items-center mb-4">
              <BarChart3 className="text-herbal-600 mr-3" size={20} />
              <h3 className="text-lg font-bold text-herbal-800">Quick Actions</h3>
            </div>
            <div className="space-y-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => router.push('/dashboard')}
                className="w-full bg-gradient-to-r from-herbal-100 to-herbal-200 text-herbal-700 py-3 px-4 rounded-lg hover:from-herbal-200 hover:to-herbal-300 text-left font-medium transition-all duration-200"
              >
                📋 View All Batches
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => router.push('/analytics')}
                className="w-full bg-gradient-to-r from-amber-100 to-amber-200 text-amber-700 py-3 px-4 rounded-lg hover:from-amber-200 hover:to-amber-300 text-left font-medium transition-all duration-200"
              >
                📈 View Analytics
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Enhanced Success Modal */}
      {showSuccess && (
        <EnhancedSuccessCard batchId={successBatchId} onClose={closeSuccess} />
      )}
      
      {/* Messenger Widget */}
      <MessengerWidget />
    </div>
  );
}