import { motion } from 'framer-motion';
import { Calendar, Clock, Leaf, Package, AlertTriangle, CheckCircle } from 'lucide-react';

export default function ImportantDates({ batch, product }) {
  // Get real dates from database
  const collectionDate = new Date(batch.collectionTimestamp);
  const manufacturingDate = product?.manufacturingDate ? new Date(product.manufacturingDate) : null;
  const expiryDate = product?.expiryDate ? new Date(product.expiryDate) : null;
  
  // Check if product is expired
  const isExpired = expiryDate && new Date() > expiryDate;
  
  const dateItems = [
    {
      icon: Leaf,
      label: 'Herb Collection',
      date: collectionDate,
      description: 'When herbs were harvested from farm',
      color: 'green'
    },
    manufacturingDate && {
      icon: Package,
      label: 'Manufacturing',
      date: manufacturingDate,
      description: 'Product manufacturing completed',
      color: 'blue'
    },
    expiryDate && {
      icon: AlertTriangle,
      label: 'Expiry Date',
      date: expiryDate,
      description: 'Product expires after this date',
      color: isExpired ? 'red' : 'amber'
    }
  ].filter(Boolean);

  const getStatusColor = (color) => {
    return `text-${color}-600 bg-${color}-100`;
  };

  const getIconColor = (color) => {
    return `text-${color}-600`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-lg p-6 border border-gray-200"
    >
      <div className="flex items-center mb-6">
        <Calendar className="text-blue-600 mr-3" size={24} />
        <h3 className="text-xl font-semibold text-gray-900">Important Dates</h3>
      </div>

      {/* Expiry Status */}
      {expiryDate && (
        <div className={`mb-6 p-4 rounded-lg border ${
          isExpired 
            ? 'bg-red-50 border-red-200' 
            : 'bg-green-50 border-green-200'
        }`}>
          <div className="flex items-center">
            {isExpired ? (
              <AlertTriangle className="text-red-600 mr-2" size={20} />
            ) : (
              <CheckCircle className="text-green-600 mr-2" size={20} />
            )}
            <span className={`font-medium ${
              isExpired ? 'text-red-800' : 'text-green-800'
            }`}>
              {isExpired ? 'Product Expired' : 'Product is Fresh'}
            </span>
          </div>
        </div>
      )}

      {/* Dates Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {dateItems.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-start p-4 bg-gray-50 rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
          >
            <div className={`p-2 rounded-lg mr-4 ${getStatusColor(item.color)}`}>
              <item.icon className={getIconColor(item.color)} size={20} />
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="font-medium text-gray-900 mb-1">{item.label}</div>
              <div className="text-sm font-mono text-gray-700 mb-1">
                {item.date.toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric'
                })}
              </div>
              <div className="text-xs text-gray-500">{item.description}</div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Additional Info */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <div className="text-sm text-blue-800">
          <strong>Note:</strong> All dates are real and sourced directly from farmers and manufacturers. 
          Always check physical product labels for additional information.
        </div>
      </div>
    </motion.div>
  );
}