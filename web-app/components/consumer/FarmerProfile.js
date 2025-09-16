import { motion } from 'framer-motion';
import { User, MapPin, Star, Calendar, Award } from 'lucide-react';

const API_BASE_URL = 'http://localhost:3001';

export default function FarmerProfile({ batch }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-xl p-6 border border-amber-200"
    >
      <div className="flex items-center mb-6">
        <User className="text-amber-600 mr-3" size={24} />
        <h3 className="text-xl font-semibold text-gray-900">Meet the Farmer</h3>
      </div>

      <div className="space-y-6">
        {/* Farmer Info Card */}
        <div className="bg-white rounded-lg p-4 border border-amber-200">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="text-lg font-semibold text-gray-900">{batch.farmerName}</h4>
              <div className="flex items-center text-sm text-gray-600">
                <MapPin className="mr-1" size={14} />
                Organic Farmer
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center text-amber-600">
                <Star className="mr-1" size={16} fill="currentColor" />
                <span className="font-semibold">4.8</span>
              </div>
              <div className="text-xs text-gray-500">Quality Rating</div>
            </div>
          </div>

          {/* Farmer Stats */}
          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-amber-200">
            <div className="text-center">
              <div className="text-lg font-bold text-amber-600">5+</div>
              <div className="text-xs text-gray-600">Years Experience</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-amber-600">100+</div>
              <div className="text-xs text-gray-600">Batches Supplied</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-amber-600">98%</div>
              <div className="text-xs text-gray-600">Quality Score</div>
            </div>
          </div>
        </div>

        {/* Collection Details */}
        <div className="bg-white rounded-lg p-4 border border-amber-200">
          <h4 className="font-semibold text-gray-900 mb-3">Collection Details</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Collection Date</span>
              <span className="text-sm font-medium">
                {new Date(batch.collectionTimestamp).toLocaleDateString()}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Quantity Collected</span>
              <span className="text-sm font-medium">{batch.quantity}</span>
            </div>
            {batch.geoLocation && (
              <div>
                <span className="text-sm text-gray-600">Farm Location</span>
                <div className="text-xs font-mono bg-gray-100 p-2 rounded mt-1">
                  {batch.geoLocation}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Herb Sample Image */}
        {batch.imageUrl && (
          <div className="bg-white rounded-lg p-4 border border-amber-200">
            <h4 className="font-semibold text-gray-900 mb-3">Fresh Herb Sample</h4>
            <img
              src={`${API_BASE_URL}${batch.imageUrl}`}
              alt="Fresh herb sample"
              className="w-full h-40 object-cover rounded-lg border"
            />
          </div>
        )}

        {/* Support Message */}
        <div className="bg-gradient-to-r from-green-100 to-emerald-100 rounded-lg p-4 border border-green-200">
          <div className="flex items-center mb-2">
            <Award className="text-green-600 mr-2" size={20} />
            <span className="font-semibold text-green-800">Supporting Sustainable Farming</span>
          </div>
          <p className="text-sm text-green-700">
            Your purchase directly supports {batch.farmerName} and promotes sustainable, 
            organic farming practices in rural communities.
          </p>
        </div>
      </div>
    </motion.div>
  );
}