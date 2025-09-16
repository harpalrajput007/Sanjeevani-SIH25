import { motion } from 'framer-motion';
import { Leaf, FlaskConical, Package, ShoppingBag, MapPin, CheckCircle, FileText, Award, Calendar } from 'lucide-react';

const API_BASE_URL = 'http://localhost:3001';

const timelineStages = [
  {
    id: 'collected',
    title: '🌱 Collected',
    icon: Leaf,
    color: 'green',
    bgColor: 'bg-green-500',
    lightBg: 'bg-green-50',
    borderColor: 'border-green-200',
    textColor: 'text-green-800',
    description: 'Fresh herbs collected from organic farms'
  },
  {
    id: 'certified',
    title: '🧪 Certified',
    icon: FlaskConical,
    color: 'blue',
    bgColor: 'bg-blue-500',
    lightBg: 'bg-blue-50',
    borderColor: 'border-blue-200',
    textColor: 'text-blue-800',
    description: 'Quality tested and lab certified'
  },
  {
    id: 'processed',
    title: '📦 Processed',
    icon: Package,
    color: 'purple',
    bgColor: 'bg-purple-500',
    lightBg: 'bg-purple-50',
    borderColor: 'border-purple-200',
    textColor: 'text-purple-800',
    description: 'Processed and packaged with care'
  },
  {
    id: 'available',
    title: '🛍️ Available',
    icon: ShoppingBag,
    color: 'amber',
    bgColor: 'bg-amber-500',
    lightBg: 'bg-amber-50',
    borderColor: 'border-amber-200',
    textColor: 'text-amber-800',
    description: 'Ready for consumers'
  }
];

export default function ProductJourneyTimeline({ batch, product }) {
  const getCurrentStage = () => {
    if (!batch) return 0;
    
    // Check if product is available
    if (product && product.productName) return 3;
    
    // Check if processing is completed
    if (batch.statusHistory && batch.statusHistory.length > 0) {
      const currentStatus = batch.statusHistory[batch.statusHistory.length - 1].status;
      if (currentStatus === 'Completed') return 2;
      if (currentStatus === 'Processing' || currentStatus === 'Packaging' || currentStatus === 'Quality Check') return 2;
    }
    
    // Check if certified
    if (batch.certifications && batch.certifications.length > 0) return 1;
    
    // Default to collected
    return 0;
  };

  const currentStage = getCurrentStage();

  const getStageContent = (stage, index) => {
    const isCompleted = index <= currentStage;
    if (!isCompleted) return null;

    switch (stage.id) {
      case 'collected':
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Farmer</span>
              <span className="text-sm font-semibold text-green-700">{batch.farmerName}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Date</span>
              <span className="text-sm text-gray-600">
                {new Date(batch.collectionTimestamp).toLocaleDateString()}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Quantity</span>
              <span className="text-sm text-gray-600">{batch.quantity}</span>
            </div>
            {batch.imageUrl && (
              <div className="mt-3">
                <img
                  src={`${API_BASE_URL}${batch.imageUrl}`}
                  alt="Fresh herbs"
                  className="w-full h-24 object-cover rounded-lg border"
                />
              </div>
            )}
          </div>
        );
        
      case 'certified':
        return (
          <div className="space-y-3">
            {batch.certifications && batch.certifications.length > 0 ? (
              <>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Certificates</span>
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                    {batch.certifications.length}
                  </span>
                </div>
                {batch.certifications.map((cert, idx) => (
                  <div key={idx} className="bg-white border border-blue-200 rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <FileText className="text-blue-600 mr-2" size={16} />
                        <div>
                          <div className="text-sm font-medium text-blue-900">{cert.name}</div>
                          <div className="text-xs text-blue-600">
                            {new Date(cert.uploadedAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <a
                        href={`${API_BASE_URL}${cert.fileUrl}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 text-xs font-medium"
                      >
                        View
                      </a>
                    </div>
                  </div>
                ))}
              </>
            ) : (
              <div className="text-center py-4">
                <FlaskConical className="mx-auto text-gray-400 mb-2" size={24} />
                <p className="text-sm text-gray-500">Certification in progress...</p>
              </div>
            )}
          </div>
        );
        
      case 'processed':
        return (
          <div className="space-y-3">
            {batch.statusHistory && batch.statusHistory.length > 0 ? (
              <>
                <div className="text-sm font-medium text-gray-700 mb-2">Manufacturing Steps</div>
                {batch.statusHistory.slice(-3).map((status, idx) => (
                  <div key={idx} className="flex items-center justify-between py-1">
                    <span className="text-sm text-gray-600">{status.status}</span>
                    <span className="text-xs text-gray-500">
                      {new Date(status.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </>
            ) : (
              <div className="text-center py-4">
                <Package className="mx-auto text-gray-400 mb-2" size={24} />
                <p className="text-sm text-gray-500">Processing in progress...</p>
              </div>
            )}
          </div>
        );
        
      case 'available':
        return (
          <div className="space-y-3">
            {product && product.productName ? (
              <>
                {product.productImages && product.productImages.length > 0 && (
                  <img
                    src={`${API_BASE_URL}${product.productImages[0]}`}
                    alt="Final product"
                    className="w-full h-24 object-cover rounded-lg border"
                  />
                )}
                <div>
                  <div className="text-sm font-semibold text-amber-900">{product.productName}</div>
                  <div className="text-xs text-amber-700 mb-1">{product.category}</div>
                  {product.price && (
                    <div className="text-lg font-bold text-amber-600">₹{product.price}</div>
                  )}
                </div>
              </>
            ) : (
              <div className="text-center py-4">
                <ShoppingBag className="mx-auto text-gray-400 mb-2" size={24} />
                <p className="text-sm text-gray-500">Product details being prepared...</p>
              </div>
            )}
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-white to-green-50 rounded-2xl shadow-xl p-8 border border-green-200"
    >
      <div className="text-center mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row items-center justify-center mb-3 sm:mb-4">
          <Award className="text-green-600 mr-0 sm:mr-3 mb-2 sm:mb-0" size={24} />
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-green-700 to-blue-700 bg-clip-text text-transparent">
            Product Journey
          </h2>
        </div>
        <p className="text-gray-600 text-base sm:text-lg px-4">From farm to shelf - complete traceability</p>
      </div>

      {/* Progress Bar */}
      <div className="relative mb-8 sm:mb-12">
        <div className="absolute top-6 sm:top-8 left-8 sm:left-16 right-8 sm:right-16 h-1 sm:h-2 bg-gray-200 rounded-full">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(currentStage / (timelineStages.length - 1)) * 100}%` }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="h-full bg-gradient-to-r from-green-500 via-blue-500 to-amber-500 rounded-full"
          />
        </div>
      </div>

      {/* Timeline Stages */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {timelineStages.map((stage, index) => {
          const Icon = stage.icon;
          const isCompleted = index <= currentStage;
          const isActive = index === currentStage;
          
          return (
            <motion.div
              key={stage.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              className={`relative rounded-lg sm:rounded-xl p-4 sm:p-6 border-2 transition-all duration-300 ${
                isCompleted
                  ? `${stage.lightBg} ${stage.borderColor} shadow-lg`
                  : 'bg-gray-50 border-gray-200'
              }`}
            >
              {/* Stage Icon */}
              <div className="flex justify-center mb-3 sm:mb-4">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: index * 0.2 + 0.3, type: "spring" }}
                  className={`w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center border-2 sm:border-4 ${
                    isCompleted
                      ? `${stage.bgColor} border-white text-white shadow-lg`
                      : 'bg-gray-200 border-gray-300 text-gray-400'
                  }`}
                >
                  <Icon size={20} className="sm:w-7 sm:h-7" />
                </motion.div>
              </div>

              {/* Stage Title */}
              <div className="text-center mb-3 sm:mb-4">
                <h3 className={`font-bold text-base sm:text-lg mb-1 sm:mb-2 ${
                  isCompleted ? stage.textColor : 'text-gray-400'
                }`}>
                  {stage.title}
                </h3>
                <p className={`text-xs sm:text-sm px-2 ${
                  isCompleted ? 'text-gray-600' : 'text-gray-400'
                }`}>
                  {stage.description}
                </p>
              </div>

              {/* Stage Content */}
              {isCompleted && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  transition={{ delay: index * 0.2 + 0.5 }}
                  className="bg-white rounded-lg p-4 border shadow-sm"
                >
                  {getStageContent(stage, index)}
                </motion.div>
              )}

              {/* Completion Badge */}
              {isCompleted && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: index * 0.2 + 0.7 }}
                  className="absolute -top-2 -right-2"
                >
                  <div className="bg-green-500 text-white rounded-full p-1">
                    <CheckCircle size={16} />
                  </div>
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}