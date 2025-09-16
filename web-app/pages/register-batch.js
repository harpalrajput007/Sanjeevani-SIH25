import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

const API_BASE_URL = 'http://localhost:3001';

export default function RegisterBatch() {
  const [formData, setFormData] = useState({
    herbName: '',
    quantity: '',
    geoLocation: ''
  });
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined' && !localStorage.getItem('authenticated')) {
      router.push('/');
      return;
    }
  }, []);

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const getCurrentLocation = () => {
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            resolve(`${latitude},${longitude}`);
          },
          (error) => reject(error),
          { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
        );
      } else {
        reject(new Error('Geolocation not supported'));
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.herbName || !formData.quantity || !image) {
      alert('Please fill all fields and select an image');
      return;
    }

    setLoading(true);

    try {
      let geoLocation = formData.geoLocation;
      
      if (!geoLocation) {
        try {
          geoLocation = await getCurrentLocation();
        } catch (error) {
          console.error('Geolocation error:', error);
          geoLocation = '0,0'; // Default coordinates
        }
      }

      const formDataToSend = new FormData();
      formDataToSend.append('herbName', formData.herbName);
      formDataToSend.append('quantity', formData.quantity);
      formDataToSend.append('geoLocation', geoLocation);
      formDataToSend.append('image', image);

      const response = await fetch(`${API_BASE_URL}/api/batch`, {
        method: 'POST',
        body: formDataToSend,
      });

      const result = await response.json();

      if (result.success) {
        alert(`Batch registered successfully! Batch ID: ${result.batchId}`);
        router.push('/dashboard');
      } else {
        alert(result.error || 'Failed to register batch');
      }
    } catch (error) {
      console.error('Registration error:', error);
      alert('Failed to register batch. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={() => router.back()}
                className="text-blue-600 hover:text-blue-800 mr-4"
              >
                ← Back
              </button>
              <h1 className="text-2xl font-bold text-green-600">Register New Batch</h1>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg p-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Batch Information</h2>
            <p className="text-gray-600 mt-1">Fill in the details to register a new herb batch</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Herb Name *
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  value={formData.herbName}
                  onChange={(e) => setFormData({...formData, herbName: e.target.value})}
                >
                  <option value="">Select herb type</option>
                  <option value="Turmeric">Turmeric</option>
                  <option value="Ashwagandha">Ashwagandha</option>
                  <option value="Neem">Neem</option>
                  <option value="Tulsi">Tulsi</option>
                  <option value="Ginger">Ginger</option>
                  <option value="Brahmi">Brahmi</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quantity *
                </label>
                <input
                  type="text"
                  placeholder="e.g., 5kg, 100 pieces"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  value={formData.quantity}
                  onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Collection Location
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Leave empty to use current location"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  value={formData.geoLocation}
                  onChange={(e) => setFormData({...formData, geoLocation: e.target.value})}
                />
                <button
                  type="button"
                  onClick={async () => {
                    try {
                      const location = await getCurrentLocation();
                      setFormData({...formData, geoLocation: location});
                    } catch (error) {
                      alert('Could not get location');
                    }
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  📍 Get Location
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Herb Image *
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-green-500 transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  id="image-upload"
                />
                <label htmlFor="image-upload" className="cursor-pointer">
                  {image ? (
                    <div>
                      <img
                        src={URL.createObjectURL(image)}
                        alt="Preview"
                        className="w-full h-48 object-cover rounded-md mb-2"
                      />
                      <p className="text-sm text-gray-600">Click to change image</p>
                    </div>
                  ) : (
                    <div>
                      <div className="text-4xl text-gray-400 mb-2">📷</div>
                      <p className="text-gray-600">Click to upload herb image</p>
                      <p className="text-sm text-gray-500 mt-1">PNG, JPG up to 10MB</p>
                    </div>
                  )}
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 disabled:bg-gray-400 font-medium text-lg"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Registering Batch...
                </span>
              ) : (
                '🌿 Register Batch'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}