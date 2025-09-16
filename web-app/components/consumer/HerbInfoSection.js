import { motion } from 'framer-motion';
import { Leaf, Heart, Shield, Zap, Brain } from 'lucide-react';

const herbBenefits = {
  'Turmeric': {
    benefits: ['Anti-inflammatory', 'Boosts Immunity', 'Supports Digestion', 'Antioxidant Properties'],
    icons: [Shield, Heart, Zap, Leaf],
    description: 'Known as "Golden Spice" in Ayurveda, Turmeric has been used for thousands of years for its healing properties.',
    uses: 'Mix with warm milk, use in cooking, or take as supplement'
  },
  'Tulsi': {
    benefits: ['Stress Relief', 'Respiratory Health', 'Immunity Booster', 'Mental Clarity'],
    icons: [Brain, Heart, Shield, Zap],
    description: 'Sacred basil revered in Ayurveda as "Queen of Herbs" for its adaptogenic and healing properties.',
    uses: 'Brew as tea, chew fresh leaves, or use in aromatherapy'
  },
  'Ashwagandha': {
    benefits: ['Reduces Stress', 'Improves Energy', 'Better Sleep', 'Muscle Strength'],
    icons: [Brain, Zap, Heart, Shield],
    description: 'Ancient adaptogenic herb known for balancing stress hormones and enhancing vitality.',
    uses: 'Take as powder with milk, capsules, or herbal preparations'
  }
};

export default function HerbInfoSection({ herbName }) {
  const herbInfo = herbBenefits[herbName] || herbBenefits['Turmeric'];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200"
    >
      <div className="flex items-center mb-6">
        <Leaf className="text-green-600 mr-3" size={24} />
        <h3 className="text-xl font-semibold text-gray-900">About {herbName}</h3>
      </div>

      <div className="space-y-6">
        <p className="text-gray-700 leading-relaxed">{herbInfo.description}</p>

        <div>
          <h4 className="font-semibold text-gray-900 mb-3 sm:mb-4">Health Benefits</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
            {herbInfo.benefits.map((benefit, index) => {
              const Icon = herbInfo.icons[index];
              return (
                <div key={benefit} className="flex items-center bg-white p-2 sm:p-3 rounded-lg border border-green-200">
                  <Icon className="text-green-600 mr-2" size={16} />
                  <span className="text-sm font-medium text-gray-800">{benefit}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 border border-green-200">
          <h4 className="font-semibold text-gray-900 mb-2">Traditional Uses</h4>
          <p className="text-sm text-gray-700">{herbInfo.uses}</p>
        </div>
      </div>
    </motion.div>
  );
}