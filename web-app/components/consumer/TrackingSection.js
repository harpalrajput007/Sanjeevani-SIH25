import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Shield, Award, Share2 } from 'lucide-react';
import ProductJourneyTimeline from './ProductJourneyTimeline';
import HerbInfoSection from './HerbInfoSection';
import CertificationPanel from './CertificationPanel';
import FarmerProfile from './FarmerProfile';
import ImportantDates from './ImportantDates';

const API_BASE_URL = 'http://localhost:3001';

export default function TrackingSection({ trackBatchId }) {
  const [batchId, setBatchId] = useState('');
  const [batchData, setBatchData] = useState(null);
  const [productData, setProductData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  // Auto-fill and search when trackBatchId prop changes
  useEffect(() => {
    if (trackBatchId) {
      setBatchId(trackBatchId);
      setTimeout(() => {
        handleSearchWithId(trackBatchId);
      }, 100);
    }
  }, [trackBatchId]);

  const handleSearchWithId = async (searchBatchId) => {
    const idToSearch = searchBatchId || batchId;
    
    if (!idToSearch.trim()) {
      alert('Please enter a Batch ID');
      return;
    }

    setLoading(true);
    setSearched(true);
    
    try {
      // Fetch batch data
      const batchResponse = await fetch(`${API_BASE_URL}/api/batch/${idToSearch}`);
      if (batchResponse.ok) {
        const batch = await batchResponse.json();
        setBatchData(batch);
        
        // Fetch product data
        try {
          const productResponse = await fetch(`${API_BASE_URL}/api/batch/${idToSearch}/product`);
          const product = await productResponse.json();
          setProductData(product);
        } catch (productError) {
          console.log('No product data found');
          setProductData(null);
        }
      } else {
        setBatchData(null);
        setProductData(null);
        alert('Batch not found. Please check the Batch ID.');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      alert('Error fetching batch information');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    handleSearchWithId();
  };

  const handleShare = () => {
    const shareText = `Check out the complete traceability of my Ayurvedic product! Batch #${batchId} - From farm to shelf, fully verified on blockchain. 🌿✅`;
    const shareUrl = `${window.location.origin}/consumer-portal?batch=${batchId}`;
    
    if (navigator.share) {
      navigator.share({
        title: 'Ayurvedic Product Traceability',
        text: shareText,
        url: shareUrl,
      });
    } else {
      // Fallback to copying to clipboard
      navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
      alert('Link copied to clipboard!');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Track Your Product</h2>
        <p className="text-gray-600">Enter your Batch ID to see the complete journey from farm to shelf</p>
        
        {/* Powered by Blockchain Badge */}
        <div className="inline-flex items-center bg-green-100 px-4 py-2 rounded-full border border-green-200 mt-4">
          <Shield className="text-green-600 mr-2" size={20} />
          <span className="text-green-800 font-medium">Powered by Blockchain</span>
        </div>
      </div>

      {/* Search Section */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-green-200">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Enter Batch ID (e.g., 12345)"
              value={batchId}
              onChange={(e) => setBatchId(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-lg"
            />
          </div>
          <button
            onClick={handleSearch}
            disabled={loading}
            className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 disabled:bg-gray-400 font-medium flex items-center justify-center min-w-[120px]"
          >
            {loading ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                ⏳
              </motion.div>
            ) : (
              <>
                <Search size={20} className="mr-2" />
                Track
              </>
            )}
          </button>
        </div>
      </div>

      {/* Results Section */}
      <AnimatePresence>
        {searched && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {batchData ? (
              <>
                {/* Share Button */}
                <div className="flex justify-end">
                  <button
                    onClick={handleShare}
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Share2 className="mr-2" size={16} />
                    Share Journey
                  </button>
                </div>

                {/* Product Journey Timeline */}
                <ProductJourneyTimeline 
                  batch={batchData} 
                  product={productData} 
                />

                {/* Important Dates Section */}
                <ImportantDates 
                  batch={batchData} 
                  product={productData} 
                />

                {/* Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Left Column */}
                  <div className="space-y-6">
                    {/* Herb Information */}
                    <HerbInfoSection herbName={batchData.herbName} />
                    
                    {/* Farmer Profile */}
                    <FarmerProfile batch={batchData} />
                  </div>

                  {/* Right Column */}
                  <div className="space-y-6">
                    {/* Certification Panel */}
                    <CertificationPanel 
                      certifications={batchData.certifications || []} 
                      batchId={batchData.id}
                      product={productData}
                    />
                    
                    {/* Impact Story */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-6 border border-amber-200"
                    >
                      <div className="flex items-center mb-4">
                        <Award className="text-amber-600 mr-3" size={24} />
                        <h3 className="text-xl font-semibold text-gray-900">
                          Your Impact
                        </h3>
                      </div>
                      <div className="space-y-4">
                        <div className="bg-white rounded-lg p-4 border border-amber-200">
                          <div className="text-sm text-amber-700 font-medium mb-1">
                            Supporting Sustainable Farming
                          </div>
                          <div className="text-2xl font-bold text-amber-800">
                            🌱 +1 Eco-Friendly Purchase
                          </div>
                        </div>
                        <div className="bg-white rounded-lg p-4 border border-amber-200">
                          <div className="text-sm text-amber-700 font-medium mb-1">
                            Farmer Livelihood Support
                          </div>
                          <div className="text-lg font-semibold text-amber-800">
                            Direct support to {batchData.farmerName}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Batch Not Found
                </h3>
                <p className="text-gray-600">
                  Please check your Batch ID and try again
                </p>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}