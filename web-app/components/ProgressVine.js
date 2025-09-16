import { motion } from 'framer-motion';

export default function ProgressVine({ current, target, label, icon = "🌿" }) {
  const percentage = Math.min((current / target) * 100, 100);
  
  return (
    <div className="bg-cream-50 rounded-xl p-6 border border-herbal-200 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <span className="text-2xl mr-3">{icon}</span>
          <span className="font-semibold text-herbal-800">{label}</span>
        </div>
        <span className="text-herbal-600 font-medium">{current}/{target}</span>
      </div>
      
      {/* Vine-style progress container */}
      <div className="relative">
        {/* Background vine path */}
        <div className="w-full h-6 bg-herbal-100 rounded-full relative overflow-hidden border-2 border-herbal-200">
          {/* Animated vine growth */}
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="h-full bg-gradient-to-r from-herbal-500 to-herbal-600 rounded-full relative"
          >
            {/* Vine texture overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
          </motion.div>
          
          {/* Leaves along the vine */}
          {[...Array(5)].map((_, i) => {
            const leafPosition = (i + 1) * 20;
            const isActive = percentage >= leafPosition;
            
            return (
              <motion.div
                key={i}
                initial={{ scale: 0, rotate: -45 }}
                animate={{ 
                  scale: isActive ? 1 : 0.3, 
                  rotate: isActive ? 0 : -45,
                  opacity: isActive ? 1 : 0.3
                }}
                transition={{ delay: i * 0.2, duration: 0.5 }}
                className="absolute top-1/2 transform -translate-y-1/2"
                style={{ left: `${leafPosition}%` }}
              >
                <span className={`text-lg ${isActive ? 'text-green-600' : 'text-herbal-300'}`}>
                  🍃
                </span>
              </motion.div>
            );
          })}
        </div>
        
        {/* Progress percentage */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-center mt-3"
        >
          <span className="text-2xl font-bold text-herbal-700">{Math.round(percentage)}%</span>
          <p className="text-sm text-herbal-600">Progress to next milestone</p>
        </motion.div>
      </div>
    </div>
  );
}