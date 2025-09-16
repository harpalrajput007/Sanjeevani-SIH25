import { useState } from 'react';

const API_BASE_URL = 'http://localhost:3001';

export default function BatchWizard({ onSuccess }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    herbName: '',
    quantity: '',
    geoLocation: '',
    image: null
  });
  const [loading, setLoading] = useState(false);

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 4));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  const getCurrentLocation = () => {
    setLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setFormData(prev => ({
            ...prev,
            geoLocation: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`
          }));
          setLoading(false);
        },
        (error) => {
          alert('Could not get location');
          setLoading(false);
        }
      );
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('herbName', formData.herbName);
      formDataToSend.append('quantity', formData.quantity);
      formDataToSend.append('geoLocation', formData.geoLocation);
      formDataToSend.append('image', formData.image);

      const response = await fetch(`${API_BASE_URL}/api/batch`, {
        method: 'POST',
        body: formDataToSend,
      });

      const result = await response.json();
      if (result.success) {
        onSuccess(result.batchId);
        setFormData({ herbName: '', quantity: '', geoLocation: '', image: null });
        setCurrentStep(1);
      } else {
        alert(result.error || 'Failed to create batch');
      }
    } catch (error) {
      alert('Failed to create batch');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-green-800">Create New Batch</h2>
          <span className="text-sm text-gray-500">Step {currentStep} of 4</span>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-green-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / 4) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Step 1: Herb Details */}
      {currentStep === 1 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-green-700">Herb Information</h3>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Herb Name</label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
              value={formData.herbName}
              onChange={(e) => setFormData(prev => ({ ...prev, herbName: e.target.value }))}
            >
              <option value="">Select herb type</option>
              <option value="Turmeric">Turmeric</option>
              <option value="Ashwagandha">Ashwagandha</option>
              <option value="Neem">Neem</option>
              <option value="Tulsi">Tulsi</option>
              <option value="Ginger">Ginger</option>
              <option value="Brahmi">Brahmi</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
            <input
              type="text"
              placeholder="e.g., 5kg, 100 pieces"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
              value={formData.quantity}
              onChange={(e) => setFormData(prev => ({ ...prev, quantity: e.target.value }))}
            />
          </div>
        </div>
      )}

      {/* Step 2: Location */}
      {currentStep === 2 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-green-700">Collection Location</h3>
          <div className="text-center">
            <button
              onClick={getCurrentLocation}
              disabled={loading}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
            >
              {loading ? 'Getting Location...' : '📍 Capture GPS Location'}
            </button>
            {formData.geoLocation && (
              <div className="mt-4 p-3 bg-green-50 rounded-lg">
                <p className="text-sm text-green-700">Location captured:</p>
                <p className="font-mono text-green-800">{formData.geoLocation}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Step 3: Image Upload */}
      {currentStep === 3 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-green-700">Herb Photo</h3>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.files[0] }))}
              className="hidden"
              id="image-upload"
            />
            <label htmlFor="image-upload" className="cursor-pointer">
              {formData.image ? (
                <div>
                  <img
                    src={URL.createObjectURL(formData.image)}
                    alt="Preview"
                    className="w-full h-48 object-cover rounded-md mb-2"
                  />
                  <p className="text-sm text-gray-600">Click to change image</p>
                </div>
              ) : (
                <div>
                  <div className="text-4xl text-gray-400 mb-2">📷</div>
                  <p className="text-gray-600">Click to upload herb image</p>
                </div>
              )}
            </label>
          </div>
        </div>
      )}

      {/* Step 4: Review & Submit */}
      {currentStep === 4 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-green-700">Review & Submit</h3>
          <div className="bg-gray-50 p-4 rounded-lg space-y-2">
            <p><strong>Herb:</strong> {formData.herbName}</p>
            <p><strong>Quantity:</strong> {formData.quantity}</p>
            <p><strong>Location:</strong> {formData.geoLocation}</p>
            <p><strong>Image:</strong> {formData.image ? 'Uploaded' : 'None'}</p>
          </div>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-6">
        <button
          onClick={prevStep}
          disabled={currentStep === 1}
          className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
        >
          Previous
        </button>
        
        {currentStep < 4 ? (
          <button
            onClick={nextStep}
            disabled={
              (currentStep === 1 && (!formData.herbName || !formData.quantity)) ||
              (currentStep === 2 && !formData.geoLocation) ||
              (currentStep === 3 && !formData.image)
            }
            className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400"
          >
            Next
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400"
          >
            {loading ? 'Submitting...' : 'Submit Batch'}
          </button>
        )}
      </div>
    </div>
  );
}