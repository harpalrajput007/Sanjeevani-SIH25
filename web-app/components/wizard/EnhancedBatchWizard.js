import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Send } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import HerbInputCard from './HerbInputCard';
import LocationCard from './LocationCard';
import PhotoBasketCard from './PhotoBasketCard';
import CertificationCard from './CertificationCard';

const API_BASE_URL = 'http://localhost:3001';

export default function EnhancedBatchWizard({ onSuccess }) {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    herbName: '',
    quantity: '',
    geoLocation: '',
    latitude: '',
    longitude: '',
    image: null,
    certifications: []
  });
  const [loading, setLoading] = useState(false);

  const steps = [
    { id: 1, title: "Herb Details", icon: "🌿" },
    { id: 2, title: "Location", icon: "📍" },
    { id: 3, title: "Photography", icon: "📸" },
    { id: 4, title: "Certifications", icon: "📜" },
    { id: 5, title: "Review", icon: "✅" }
  ];

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 5));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  const canProceed = () => {
    switch (currentStep) {
      case 1: return formData.herbName && formData.quantity;
      case 2: return formData.geoLocation;
      case 3: return formData.image;
      case 4: return true; // Certifications are optional
      case 5: return true;
      default: return false;
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    console.log('Starting batch creation...');
    console.log('API_BASE_URL:', API_BASE_URL);
    console.log('Form data:', formData);
    
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);
      
      const formDataToSend = new FormData();
      formDataToSend.append('herbName', formData.herbName);
      formDataToSend.append('quantity', formData.quantity + ' kg');
      formDataToSend.append('geoLocation', formData.geoLocation);
      formDataToSend.append('farmerName', user?.name || 'Farmer');
      formDataToSend.append('farmerEmail', user?.email || '');
      formDataToSend.append('image', formData.image);
      
      // Add certifications
      formData.certifications.forEach((cert, index) => {
        formDataToSend.append(`certifications`, cert.file);
      });

      console.log('Sending request to:', `${API_BASE_URL}/api/batch`);
      
      const response = await fetch(`${API_BASE_URL}/api/batch`, {
        method: 'POST',
        body: formDataToSend,
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Server response:', errorText);
        throw new Error(`Server error: ${response.status} - ${errorText}`);
      }
      
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Server returned HTML instead of JSON. Backend server may not be running.');
      }
      
      const result = await response.json();
      console.log('Response data:', result);
      
      if (result.success) {
        onSuccess(result.batchId);
        setFormData({ herbName: '', quantity: '', geoLocation: '', latitude: '', longitude: '', image: null, certifications: [] });
        setCurrentStep(1);
      } else {
        alert(result.error || 'Failed to create batch');
      }
    } catch (error) {
      console.error('Batch creation error:', error);
      if (error.name === 'AbortError') {
        alert('Request timed out. Please check if the backend server is running on port 3001.');
      } else if (error.message.includes('HTML instead of JSON')) {
        alert('Backend server is not running or not responding correctly. Please start the backend server on port 3001.');
      } else if (error.message.includes('Failed to fetch')) {
        alert('Cannot connect to backend server. Please ensure the backend is running on http://localhost:3001');
      } else if (error.message.includes('Server error: 500')) {
        alert('Backend server error. Please check:\n1. Database connection\n2. File upload permissions\n3. Backend server logs for details');
      } else {
        alert(`Failed to create batch: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-2xl border border-herbal-200 overflow-hidden">
      {/* Header with Steps */}
      <div className="bg-gradient-to-r from-herbal-600 to-herbal-700 p-6 text-white">
        <h2 className="text-2xl font-bold mb-4">Create New Herb Batch</h2>
        
        {/* Step Indicator */}
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <motion.div
                initial={false}
                animate={{
                  backgroundColor: currentStep >= step.id ? '#ffffff' : 'rgba(255,255,255,0.3)',
                  color: currentStep >= step.id ? '#2F855A' : '#ffffff'
                }}
                className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm border-2 border-white"
              >
                {currentStep > step.id ? '✓' : step.id}
              </motion.div>
              <div className="ml-3 hidden sm:block">
                <div className="text-sm font-medium">{step.title}</div>
                <div className="text-xs opacity-75">{step.icon}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <div className="p-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {currentStep === 1 && (
              <HerbInputCard formData={formData} setFormData={setFormData} />
            )}
            
            {currentStep === 2 && (
              <LocationCard 
                formData={formData} 
                setFormData={setFormData}
                loading={loading}
                setLoading={setLoading}
              />
            )}
            
            {currentStep === 3 && (
              <PhotoBasketCard formData={formData} setFormData={setFormData} />
            )}
            
            {currentStep === 4 && (
              <CertificationCard formData={formData} setFormData={setFormData} />
            )}
            
            {currentStep === 5 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-cream-50 rounded-xl p-6 border border-herbal-200"
              >
                <h3 className="text-xl font-semibold text-herbal-800 mb-6">Review Your Batch</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="bg-white p-4 rounded-lg border border-herbal-200">
                      <div className="text-sm text-herbal-600">Herb Type</div>
                      <div className="font-semibold text-herbal-800">{formData.herbName}</div>
                    </div>
                    <div className="bg-white p-4 rounded-lg border border-herbal-200">
                      <div className="text-sm text-herbal-600">Quantity</div>
                      <div className="font-semibold text-herbal-800">{formData.quantity} kg</div>
                    </div>
                    <div className="bg-white p-4 rounded-lg border border-herbal-200">
                      <div className="text-sm text-herbal-600">Location</div>
                      <div className="font-mono text-sm text-herbal-800">{formData.geoLocation}</div>
                    </div>
                  </div>
                  <div className="bg-white p-4 rounded-lg border border-herbal-200">
                    <div className="text-sm text-herbal-600 mb-2">Herb Photo</div>
                    {formData.image && (
                      <img
                        src={URL.createObjectURL(formData.image)}
                        alt="Herb"
                        className="w-full h-32 object-cover rounded-lg"
                      />
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="bg-gray-50 px-6 py-4 flex justify-between items-center border-t border-herbal-200">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={prevStep}
          disabled={currentStep === 1}
          className="flex items-center px-4 py-2 text-herbal-600 border border-herbal-300 rounded-lg hover:bg-herbal-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft size={16} className="mr-1" />
          Previous
        </motion.button>
        
        {currentStep < 5 ? (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={nextStep}
            disabled={!canProceed()}
            className="flex items-center px-6 py-2 bg-herbal-600 text-white rounded-lg hover:bg-herbal-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Next
            <ChevronRight size={16} className="ml-1" />
          </motion.button>
        ) : (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSubmit}
            disabled={loading}
            className="flex items-center px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="mr-2"
              >
                ⏳
              </motion.div>
            ) : (
              <Send size={16} className="mr-2" />
            )}
            {loading ? 'Submitting...' : 'Submit Batch'}
          </motion.button>
        )}
      </div>
    </div>
  );
}