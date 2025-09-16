import { motion } from 'framer-motion';
import { CheckCircle, Award, Sparkles } from 'lucide-react';

export default function EnhancedSuccessCard({ batchId, onClose }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
    >
      <motion.div
        initial={{ scale: 0.5, opacity: 0, y: 50 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.5, opacity: 0, y: 50 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
      >
        {/* Celebration Header */}
        <div className="bg-gradient-to-br from-green-400 via-herbal-500 to-herbal-600 p-8 text-white text-center relative overflow-hidden">
          {/* Floating particles */}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0, y: 20 }}
              animate={{ 
                opacity: [0, 1, 0], 
                scale: [0, 1, 0], 
                y: [20, -60, -100],
                x: [0, Math.random() * 40 - 20, Math.random() * 80 - 40]
              }}
              transition={{ 
                duration: 2, 
                delay: i * 0.2,
                repeat: Infinity,
                repeatDelay: 3
              }}
              className="absolute"
              style={{ 
                left: `${20 + i * 12}%`,
                top: '60%'
              }}
            >
              <Sparkles size={16} className="text-yellow-300" />
            </motion.div>
          ))}
          
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="relative z-10"
          >
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <CheckCircle size={40} className="text-green-500" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Batch Created Successfully!</h2>
            <p className="opacity-90">Your herbs are now part of the blockchain</p>
          </motion.div>
        </div>

        {/* Content */}
        <div className="p-8">
          {/* Batch ID Display */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-center mb-6"
          >
            <div className="bg-gradient-to-br from-herbal-50 to-cream-50 border-2 border-herbal-200 rounded-xl p-6 relative overflow-hidden">
              {/* Decorative elements */}
              <div className="absolute top-2 left-2 text-herbal-200">🌿</div>
              <div className="absolute top-2 right-2 text-herbal-200">🌿</div>
              <div className="absolute bottom-2 left-2 text-herbal-200">🍃</div>
              <div className="absolute bottom-2 right-2 text-herbal-200">🍃</div>
              
              <div className="relative z-10">
                <p className="text-sm text-herbal-600 mb-2 font-medium">Your Batch ID</p>
                <motion.div
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.6, type: "spring" }}
                  className="inline-flex items-center bg-gradient-to-r from-herbal-600 to-herbal-700 text-white px-6 py-3 rounded-full shadow-lg"
                >
                  <Award size={20} className="mr-2" />
                  <span className="text-xl font-bold">#{batchId}</span>
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Achievement Message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="text-center mb-6"
          >
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center justify-center mb-2">
                <span className="text-2xl mr-2">🏆</span>
                <span className="font-semibold text-green-800">Achievement Unlocked!</span>
              </div>
              <p className="text-green-700 text-sm">
                You've contributed to preserving Ayurvedic heritage and earned points toward your next badge!
              </p>
            </div>
          </motion.div>

          {/* Action Button */}
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClose}
            className="w-full bg-gradient-to-r from-herbal-600 to-herbal-700 text-white py-4 px-6 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Continue Your Journey 🌿
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}