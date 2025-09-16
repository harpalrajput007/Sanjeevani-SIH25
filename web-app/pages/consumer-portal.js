import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Leaf, ShoppingBag, Search } from 'lucide-react';
import BuyingSection from '../components/consumer/BuyingSection';
import TrackingSection from '../components/consumer/TrackingSection';

export default function ConsumerPortal() {
  const [activeTab, setActiveTab] = useState('buy');
  const [trackBatchId, setTrackBatchId] = useState('');

  // Listen for track product events to switch tabs
  useEffect(() => {
    const handleTrackProduct = (event) => {
      const { batchId } = event.detail;
      setTrackBatchId(batchId.toString());
      setActiveTab('track');
    };

    window.addEventListener('trackProduct', handleTrackProduct);
    return () => window.removeEventListener('trackProduct', handleTrackProduct);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-amber-50 to-green-100">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23059669' fill-opacity='0.1'%3E%3Cpath d='M30 30c0-11.046-8.954-20-20-20s-20 8.954-20-20 8.954 20 20 20 20-8.954 20-20zm0 0c0 11.046 8.954 20 20 20s20-8.954 20-20-8.954-20-20-20-20 8.954-20 20z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-6 sm:py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center mb-4">
            <Leaf className="text-green-600 mr-3" size={32} />
            <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-green-700 to-amber-700 bg-clip-text text-transparent">
              HerbsTrace Portal
            </h1>
          </div>
          <p className="text-lg text-gray-600">
            Buy authentic Ayurvedic products and track their complete journey
          </p>
        </motion.div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-lg p-1 shadow-lg border border-green-200">
            <button
              onClick={() => setActiveTab('buy')}
              className={`px-6 py-3 rounded-md font-medium transition-all duration-200 flex items-center ${
                activeTab === 'buy'
                  ? 'bg-green-600 text-white shadow-md'
                  : 'text-gray-600 hover:text-green-600'
              }`}
            >
              <ShoppingBag className="mr-2" size={20} />
              Buy Products
            </button>
            <button
              onClick={() => setActiveTab('track')}
              className={`px-6 py-3 rounded-md font-medium transition-all duration-200 flex items-center ${
                activeTab === 'track'
                  ? 'bg-green-600 text-white shadow-md'
                  : 'text-gray-600 hover:text-green-600'
              }`}
            >
              <Search className="mr-2" size={20} />
              Track Product
            </button>
          </div>
        </div>

        {/* Content Sections */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'buy' ? (
            <BuyingSection />
          ) : (
            <TrackingSection trackBatchId={trackBatchId} />
          )}
        </motion.div>
      </div>
    </div>
  );
}