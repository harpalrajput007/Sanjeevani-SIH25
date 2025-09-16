import { motion } from 'framer-motion';
import { Award, Lock } from 'lucide-react';

export default function BadgeCard({ totalBatches }) {
  const badges = [
    { 
      id: 1, 
      name: "Herb Starter", 
      icon: "🌱", 
      requirement: 1, 
      unlocked: totalBatches >= 1,
      color: "from-green-400 to-green-600",
      description: "First steps into herbal collection"
    },
    { 
      id: 2, 
      name: "Green Grower", 
      icon: "🌿", 
      requirement: 5, 
      unlocked: totalBatches >= 5,
      color: "from-herbal-400 to-herbal-600",
      description: "Growing your herbal knowledge"
    },
    { 
      id: 3, 
      name: "Nature Guardian", 
      icon: "🌳", 
      requirement: 15, 
      unlocked: totalBatches >= 15,
      color: "from-emerald-400 to-emerald-600",
      description: "Protecting nature's treasures"
    },
    { 
      id: 4, 
      name: "Ayurveda Master", 
      icon: "🏆", 
      requirement: 50, 
      unlocked: totalBatches >= 50,
      color: "from-yellow-400 to-amber-600",
      description: "Master of ancient wisdom"
    }
  ];

  return (
    <div className="bg-cream-50 rounded-xl p-6 shadow-lg border border-herbal-100">
      <div className="flex items-center mb-6">
        <Award className="text-herbal-600 mr-3" size={24} />
        <h3 className="text-xl font-bold text-herbal-800">Achievement Badges</h3>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        {badges.map((badge, index) => (
          <motion.div
            key={badge.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`relative p-4 rounded-xl border-2 text-center transition-all duration-300 ${
              badge.unlocked 
                ? 'bg-white border-herbal-300 shadow-lg hover:shadow-xl' 
                : 'bg-gray-50 border-gray-200'
            }`}
          >
            {/* Badge Icon */}
            <div className="relative mb-3">
              {badge.unlocked ? (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, delay: index * 0.2 }}
                  className={`w-16 h-16 mx-auto rounded-full bg-gradient-to-br ${badge.color} flex items-center justify-center shadow-lg`}
                >
                  <span className="text-2xl">{badge.icon}</span>
                </motion.div>
              ) : (
                <div className="w-16 h-16 mx-auto rounded-full bg-gray-200 flex items-center justify-center relative">
                  <span className="text-2xl grayscale opacity-50">{badge.icon}</span>
                  <div className="absolute inset-0 bg-gray-400/20 rounded-full flex items-center justify-center">
                    <Lock size={16} className="text-gray-500" />
                  </div>
                </div>
              )}
              
              {/* Unlock animation */}
              {badge.unlocked && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: [0, 1.2, 1], opacity: [0, 1, 1] }}
                  transition={{ delay: index * 0.3, duration: 0.6 }}
                  className="absolute -top-1 -right-1 bg-green-500 text-white rounded-full p-1"
                >
                  <Award size={12} />
                </motion.div>
              )}
            </div>
            
            {/* Badge Info */}
            <div className={badge.unlocked ? 'text-herbal-800' : 'text-gray-500'}>
              <p className="font-semibold text-sm mb-1">{badge.name}</p>
              <p className="text-xs mb-2">{badge.description}</p>
              <div className={`text-xs px-2 py-1 rounded-full ${
                badge.unlocked 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-gray-100 text-gray-500'
              }`}>
                {badge.unlocked 
                  ? '✓ Unlocked!' 
                  : `${badge.requirement - totalBatches} more needed`
                }
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      
      {/* Next Badge Progress */}
      <div className="mt-6 p-4 bg-white rounded-lg border border-herbal-200">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-herbal-700">Next Badge Progress</span>
          <span className="text-xs text-herbal-600">
            {totalBatches}/{badges.find(b => !b.unlocked)?.requirement || badges[badges.length - 1].requirement}
          </span>
        </div>
        <div className="w-full bg-herbal-100 rounded-full h-2">
          <motion.div
            initial={{ width: 0 }}
            animate={{ 
              width: `${Math.min((totalBatches / (badges.find(b => !b.unlocked)?.requirement || badges[badges.length - 1].requirement)) * 100, 100)}%` 
            }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="bg-gradient-to-r from-herbal-500 to-herbal-600 h-2 rounded-full"
          />
        </div>
      </div>
    </div>
  );
}