import { motion } from 'framer-motion';
import { MapPin, Navigation, Globe } from 'lucide-react';

export default function LocationCard({ formData, setFormData, loading, setLoading }) {
  const getCurrentLocation = () => {
    setLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setFormData(prev => ({
            ...prev,
            geoLocation: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`,
            latitude: latitude.toFixed(6),
            longitude: longitude.toFixed(6)
          }));
          setLoading(false);
        },
        (error) => {
          alert('Could not get location. Please enable GPS.');
          setLoading(false);
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-cream-50 rounded-xl p-6 shadow-lg border border-herbal-100"
    >
      <div className="flex items-center mb-6">
        <MapPin className="text-herbal-600 mr-3" size={24} />
        <h3 className="text-xl font-semibold text-herbal-800">Collection Location</h3>
      </div>

      <div className="text-center space-y-6">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={getCurrentLocation}
          disabled={loading}
          className="bg-herbal-600 text-white px-8 py-4 rounded-xl hover:bg-herbal-700 disabled:bg-herbal-300 font-semibold shadow-lg flex items-center mx-auto"
        >
          {loading ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="mr-3"
            >
              <Navigation size={20} />
            </motion.div>
          ) : (
            <Globe className="mr-3" size={20} />
          )}
          {loading ? 'Capturing Location...' : 'Capture GPS Location'}
        </motion.button>

        {formData.geoLocation && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-xl p-6 border-2 border-herbal-200 shadow-inner"
          >
            <div className="grid md:grid-cols-2 gap-4">
              {/* Coordinates Display */}
              <div className="space-y-3">
                <div className="flex items-center text-herbal-700">
                  <MapPin size={16} className="mr-2" />
                  <span className="font-semibold">Coordinates Captured</span>
                </div>
                <div className="bg-herbal-50 p-3 rounded-lg">
                  <div className="text-sm text-herbal-600">Latitude</div>
                  <div className="font-mono text-herbal-800">{formData.latitude}</div>
                </div>
                <div className="bg-herbal-50 p-3 rounded-lg">
                  <div className="text-sm text-herbal-600">Longitude</div>
                  <div className="font-mono text-herbal-800">{formData.longitude}</div>
                </div>
              </div>

              {/* Mini Map Preview */}
              <div className="bg-herbal-100 rounded-lg p-4 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-4xl mb-2">🗺️</div>
                  <div className="text-sm text-herbal-700">Location Marked</div>
                  <div className="text-xs text-herbal-600 mt-1">
                    Lat: {formData.latitude}<br/>
                    Lng: {formData.longitude}
                  </div>
                </div>
              </div>
            </div>

            {/* Accuracy Indicator */}
            <div className="mt-4 flex items-center justify-center">
              <div className="flex items-center bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                High Accuracy GPS Lock
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}