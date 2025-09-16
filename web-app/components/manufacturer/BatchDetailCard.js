import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, User, Calendar, Upload, FileText, CheckCircle, XCircle, Clock, MessageCircle } from 'lucide-react';
import ProductUpload from './ProductUpload';
import ChatModal from './ChatModal';

export default function BatchDetailCard({ batch, onFileUpload }) {
  const [showChat, setShowChat] = useState(false);
  
  const getVerificationStatus = () => {
    // Mock verification status - replace with actual logic
    const statuses = ['Pending', 'Verified', 'Rejected'];
    return statuses[Math.floor(Math.random() * statuses.length)];
  };

  const verificationStatus = getVerificationStatus();

  const getStatusIcon = () => {
    switch (verificationStatus) {
      case 'Verified': return <CheckCircle className="text-green-500" size={20} />;
      case 'Rejected': return <XCircle className="text-red-500" size={20} />;
      default: return <Clock className="text-amber-500" size={20} />;
    }
  };

  const getStatusColor = () => {
    switch (verificationStatus) {
      case 'Verified': return 'bg-green-100 text-green-800 border-green-200';
      case 'Rejected': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-amber-100 text-amber-800 border-amber-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Batch Information */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="bg-white rounded-lg shadow-lg p-6"
      >
        <div className="flex items-center mb-6">
          <div className="w-3 h-3 bg-blue-600 rounded-full mr-3"></div>
          <h3 className="text-xl font-semibold text-gray-900">Batch Information</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Batch ID */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-sm text-gray-600 mb-1">Batch ID</div>
            <div className="text-2xl font-bold text-blue-600">#{batch.id}</div>
          </div>

          {/* Herb Details */}
          <div>
            <div className="text-sm text-gray-600 mb-1">Herb Type</div>
            <div className="font-semibold text-gray-900">{batch.herbName}</div>
          </div>
          <div>
            <div className="text-sm text-gray-600 mb-1">Quantity</div>
            <div className="font-semibold text-gray-900">{batch.quantity}</div>
          </div>
        </div>

        {/* Farmer Information */}
        <div className="border-t pt-6 mt-6">
          <div className="flex items-center mb-4">
            <User className="text-gray-500 mr-2" size={16} />
            <span className="text-sm font-medium text-gray-700">Farmer Information</span>
          </div>
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-gray-600">Collected by</div>
                <div className="font-medium text-gray-900">{batch.farmerName || batch.owner || 'Unknown Farmer'}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Contribution Score</div>
                <div className="flex items-center">
                  <div className="text-lg font-bold text-green-600">4.8</div>
                  <div className="text-yellow-400 ml-1">⭐</div>
                </div>
              </div>
            </div>
            
            {/* Contact Farmer Button */}
            <div className="mt-4 pt-4 border-t border-blue-200">
              <button
                onClick={() => setShowChat(true)}
                className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white px-4 py-2 rounded-lg hover:from-green-700 hover:to-green-800 transition-all flex items-center justify-center font-medium"
              >
                <MessageCircle size={16} className="mr-2" />
                Contact Farmer
              </button>
            </div>
            
            {/* Herb Image Preview */}
            {batch.imageUrl && (
              <div className="mt-4">
                <div className="text-sm text-gray-600 mb-2">Herb Sample</div>
                <img
                  src={`http://localhost:3001${batch.imageUrl}`}
                  alt="Herb sample"
                  className="w-full max-w-xs h-32 object-cover rounded-lg border"
                />
              </div>
            )}
          </div>
        </div>

        {/* Location & Date */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div>
            <div className="flex items-center mb-3">
              <MapPin className="text-gray-500 mr-2" size={16} />
              <span className="text-sm font-medium text-gray-700">Origin Location</span>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="font-mono text-sm text-gray-800">{batch.geoLocation}</div>
            </div>
          </div>

          <div>
            <div className="flex items-center mb-3">
              <Calendar className="text-gray-500 mr-2" size={16} />
              <span className="text-sm font-medium text-gray-700">Collection Date</span>
            </div>
            <div className="text-gray-900">{new Date(batch.collectionTimestamp).toLocaleDateString()}</div>
          </div>
        </div>

        {/* Verification Status */}
        <div className="border-t pt-4 mt-6">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Verification Status</span>
            <div className={`flex items-center px-3 py-1 rounded-full border ${getStatusColor()}`}>
              {getStatusIcon()}
              <span className="ml-2 text-sm font-medium">{verificationStatus}</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Product Upload Section */}
      <ProductUpload batch={batch} />
      
      {/* Chat Modal */}
      {showChat && (
        <ChatModal
          isOpen={showChat}
          onClose={() => setShowChat(false)}
          farmerName={batch.farmerName || batch.owner || 'Unknown Farmer'}
          batchId={batch.id}
        />
      )}
    </div>
  );
}