import { motion } from 'framer-motion';
import { Camera, Upload, CheckCircle } from 'lucide-react';

export default function PhotoBasketCard({ formData, setFormData }) {
  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setFormData(prev => ({ ...prev, image: e.target.files[0] }));
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-cream-50 rounded-xl p-6 shadow-lg border border-herbal-100"
    >
      <div className="flex items-center mb-6">
        <Camera className="text-herbal-600 mr-3" size={24} />
        <h3 className="text-xl font-semibold text-herbal-800">Herb Photography</h3>
      </div>

      <div className="relative">
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="hidden"
          id="herb-photo-upload"
        />
        
        <label htmlFor="herb-photo-upload" className="cursor-pointer block">
          {formData.image ? (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="relative"
            >
              {/* Basket-style frame */}
              <div className="bg-gradient-to-br from-earthy-100 to-earthy-200 p-4 rounded-2xl border-4 border-earthy-300 shadow-inner">
                <div className="bg-white p-2 rounded-xl shadow-lg">
                  <img
                    src={URL.createObjectURL(formData.image)}
                    alt="Herb Preview"
                    className="w-full h-64 object-cover rounded-lg"
                  />
                </div>
                
                {/* Basket handles */}
                <div className="absolute -top-2 left-8 w-6 h-4 bg-earthy-400 rounded-t-full"></div>
                <div className="absolute -top-2 right-8 w-6 h-4 bg-earthy-400 rounded-t-full"></div>
              </div>
              
              {/* Success indicator */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-2 -right-2 bg-green-500 text-white p-2 rounded-full shadow-lg"
              >
                <CheckCircle size={20} />
              </motion.div>
              
              <div className="text-center mt-4">
                <p className="text-herbal-700 font-medium">Perfect! Click to change photo</p>
                <p className="text-sm text-herbal-600">Your herb looks fresh and healthy</p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="border-4 border-dashed border-herbal-300 rounded-2xl p-12 text-center bg-gradient-to-br from-herbal-50 to-cream-50 hover:from-herbal-100 hover:to-cream-100 transition-all duration-300"
            >
              {/* Basket illustration */}
              <div className="relative mb-6">
                <div className="w-24 h-20 bg-gradient-to-br from-earthy-200 to-earthy-300 rounded-2xl mx-auto border-4 border-earthy-400 shadow-inner"></div>
                <div className="absolute -top-1 left-1/2 transform -translate-x-1/2">
                  <div className="flex space-x-8">
                    <div className="w-4 h-3 bg-earthy-400 rounded-t-full"></div>
                    <div className="w-4 h-3 bg-earthy-400 rounded-t-full"></div>
                  </div>
                </div>
                <Upload className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-herbal-600" size={24} />
              </div>
              
              <div className="space-y-2">
                <p className="text-lg font-semibold text-herbal-800">Add Your Herb to the Basket</p>
                <p className="text-herbal-600">Click to upload a clear photo of your harvested herbs</p>
                <p className="text-sm text-herbal-500">PNG, JPG up to 10MB • Best quality for verification</p>
              </div>
            </motion.div>
          )}
        </label>
      </div>

      {/* Photo tips */}
      <div className="mt-6 bg-white rounded-xl p-4 border border-herbal-200">
        <h4 className="font-semibold text-herbal-800 mb-2">📸 Photo Tips for Best Results:</h4>
        <ul className="text-sm text-herbal-700 space-y-1">
          <li>• Ensure good natural lighting</li>
          <li>• Show the herb clearly without blur</li>
          <li>• Include any distinctive features</li>
          <li>• Avoid shadows or reflections</li>
        </ul>
      </div>
    </motion.div>
  );
}