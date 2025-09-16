import { motion } from 'framer-motion';
import { ShoppingCart, Star, Leaf, MapPin, Calendar } from 'lucide-react';
import { useRouter } from 'next/router';

export default function ProductCard({ product, onBuy, onTrack }) {
  const router = useRouter();
  
  const handleBuy = () => {
    onBuy(product);
  };
  
  const handleTrack = () => {
    if (onTrack) {
      onTrack(product.batchId);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className="bg-white rounded-xl shadow-lg border border-green-200 overflow-hidden hover:shadow-xl transition-all duration-300"
    >
      {/* Product Image */}
      <div className="relative h-48 bg-gradient-to-br from-green-100 to-amber-100">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <Leaf className="text-green-500" size={48} />
          </div>
        )}
        
        {/* Badge */}
        <div className="absolute top-3 left-3 bg-green-600 text-white px-2 py-1 rounded-full text-xs font-medium">
          Certified
        </div>
        
        {/* Rating */}
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full flex items-center">
          <Star className="text-yellow-500 fill-current" size={14} />
          <span className="text-xs font-medium ml-1">{product.rating || '4.8'}</span>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4">
        <h3 className="text-lg font-bold text-gray-900 mb-2">{product.name}</h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
        
        {/* Details */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-xs text-gray-500">
            <MapPin size={12} className="mr-1" />
            <span>Batch #{product.batchId}</span>
          </div>
          <div className="flex items-center text-xs text-gray-500">
            <Calendar size={12} className="mr-1" />
            <span>Mfg: {new Date(product.manufacturingDate).toLocaleDateString()}</span>
          </div>
          {product.herbName && (
            <div className="flex items-center text-xs text-green-600">
              <Leaf size={12} className="mr-1" />
              <span>Source: {product.herbName}</span>
            </div>
          )}
        </div>

        {/* Price & Actions */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-2xl font-bold text-green-600">₹{product.price}</span>
              <span className="text-sm text-gray-500 ml-1">/{product.unit || 'pack'}</span>
            </div>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleBuy}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center text-sm font-medium"
            >
              <ShoppingCart size={16} className="mr-1" />
              Buy Now
            </motion.button>
          </div>
          
          {/* Traceability Link */}
          <button
            onClick={handleTrack}
            className="w-full text-blue-600 hover:text-blue-700 text-sm font-medium py-1 border border-blue-200 rounded hover:bg-blue-50 transition-colors"
          >
            🔍 View Traceability
          </button>
        </div>
      </div>
    </motion.div>
  );
}