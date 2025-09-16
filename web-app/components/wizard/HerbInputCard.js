import { motion } from 'framer-motion';
import { Leaf, Package } from 'lucide-react';

export default function HerbInputCard({ formData, setFormData }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-cream-50 rounded-xl p-6 shadow-lg border border-herbal-100"
    >
      <div className="flex items-center mb-6">
        <Leaf className="text-herbal-600 mr-3" size={24} />
        <h3 className="text-xl font-semibold text-herbal-800">Herb Information</h3>
      </div>

      <div className="space-y-6">
        {/* Herb Name */}
        <div>
          <label className="block text-sm font-medium text-earthy-700 mb-3">
            Select Herb Type
          </label>
          <div className="relative">
            <Leaf className="absolute left-3 top-3 text-herbal-500" size={20} />
            <select
              className="w-full pl-12 pr-4 py-3 bg-white border-2 border-herbal-200 rounded-xl focus:ring-2 focus:ring-herbal-500 focus:border-herbal-500 text-herbal-800"
              value={formData.herbName}
              onChange={(e) => setFormData(prev => ({ ...prev, herbName: e.target.value }))}
            >
              <option value="">Choose your herb...</option>
              <option value="Turmeric">🟡 Turmeric (Haldi)</option>
              <option value="Ashwagandha">🟤 Ashwagandha</option>
              <option value="Neem">🟢 Neem</option>
              <option value="Tulsi">💚 Tulsi (Holy Basil)</option>
              <option value="Ginger">🟠 Ginger (Adrak)</option>
              <option value="Brahmi">🌿 Brahmi</option>
              <option value="Amla">🟢 Amla</option>
              <option value="Giloy">💚 Giloy</option>
            </select>
          </div>
        </div>

        {/* Quantity Selection */}
        <div className="space-y-4">
          <label className="block text-sm font-medium text-earthy-700">
            <Package className="inline mr-2" size={16} />
            Select Quantity
          </label>
          
          {/* Quantity Display */}
          <div className="bg-white border-2 border-herbal-300 rounded-xl p-4 text-center">
            <div className="text-3xl font-bold text-herbal-700">{formData.quantity || '0.5'} kg</div>
            <div className="text-sm text-herbal-600">Selected Quantity</div>
          </div>
          
          {/* Slider */}
          <div className="relative mb-8">
            <input
              type="range"
              min="0.5"
              max="100"
              step="0.5"
              value={formData.quantity || 0.5}
              onChange={(e) => setFormData(prev => ({ ...prev, quantity: e.target.value }))}
              className="w-full h-4 bg-herbal-100 rounded-lg appearance-none cursor-pointer slider-herbal"
            />
            {/* Accurate markers */}
            <div className="relative mt-3 pb-4">
              <div className="absolute left-0 text-xs text-herbal-600 transform -translate-x-1/2">0.5kg</div>
              <div className="absolute left-1/4 text-xs text-herbal-600 transform -translate-x-1/2">25kg</div>
              <div className="absolute left-1/2 text-xs text-herbal-600 transform -translate-x-1/2">50kg</div>
              <div className="absolute left-3/4 text-xs text-herbal-600 transform -translate-x-1/2">75kg</div>
              <div className="absolute right-0 text-xs text-herbal-600 transform translate-x-1/2">100kg</div>
            </div>
          </div>
          
          {/* Custom Input */}
          <div className="bg-gray-50 rounded-lg p-4">
            <label className="block text-xs text-gray-600 mb-3">Custom Quantity (0.5 - 1000 kg)</label>
            <div className="flex items-center space-x-2">
              <input
                type="number"
                min="0.5"
                max="1000"
                step="0.5"
                placeholder="Enter custom amount"
                value={formData.quantity || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, quantity: e.target.value }))}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-herbal-500 focus:border-herbal-500 text-sm"
              />
              <span className="text-herbal-700 font-medium text-sm">kg</span>
            </div>
          </div>
        </div>

      </div>

      <style jsx>{`
        .slider-herbal::-webkit-slider-thumb {
          appearance: none;
          height: 24px;
          width: 24px;
          border-radius: 50%;
          background: linear-gradient(135deg, #2F855A, #22c55e);
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(47, 133, 90, 0.4);
          border: 3px solid white;
        }
        .slider-herbal::-moz-range-thumb {
          height: 24px;
          width: 24px;
          border-radius: 50%;
          background: linear-gradient(135deg, #2F855A, #22c55e);
          cursor: pointer;
          border: 3px solid white;
          box-shadow: 0 4px 12px rgba(47, 133, 90, 0.4);
        }
        .slider-herbal::-webkit-slider-track {
          height: 8px;
          border-radius: 4px;
          background: linear-gradient(to right, #dcfce7, #bbf7d0, #86efac);
        }
      `}</style>
    </motion.div>
  );
}