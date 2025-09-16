import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { ArrowLeft, Factory } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import BatchDetailCard from '../../components/manufacturer/BatchDetailCard';
import TimelineStepper from '../../components/manufacturer/TimelineStepper';
import ManufacturingTimeline from '../../components/manufacturer/ManufacturingTimeline';
import CertificationViewer from '../../components/manufacturer/CertificationViewer';

const API_BASE_URL = 'http://localhost:3001';

export default function BatchDetail() {
  const [batch, setBatch] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (!isAuthenticated() || user?.userType !== 'manufacturer') {
      router.push('/login');
      return;
    }
    
    if (id) {
      fetchBatchDetail();
    }
  }, [id]);

  const fetchBatchDetail = async () => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);
      
      const response = await fetch(`${API_BASE_URL}/api/batch/${id}`, {
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error('Batch not found');
      }
      
      const data = await response.json();
      setBatch(data);
      
      // Set current step based on status
      const stepMap = {
        'Collected': 1,
        'Processing': 2,
        'Packaging': 3,
        'Labelling': 4,
        'Completed': 5
      };
      setCurrentStep(stepMap[data.currentStatus] || 1);
    } catch (error) {
      console.error('Error fetching batch:', error);
      setBatch(null);
    } finally {
      setLoading(false);
    }
  };

  const handleStepComplete = async (stepId) => {
    try {
      const statusMap = {
        1: 'Processing',
        2: 'Packaging', 
        3: 'Labelling',
        4: 'Completed'
      };
      
      const newStatus = statusMap[stepId];
      if (newStatus) {
        await fetch(`${API_BASE_URL}/api/batch/${id}/status`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ newStatus })
        });
        
        setCurrentStep(stepId + 1);
        fetchBatchDetail(); // Refresh data
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    console.log('Files uploaded:', files);
    // Handle file upload logic here
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="text-4xl"
        >
          ⚙️
        </motion.div>
        <span className="ml-4 text-gray-700 text-lg">Loading batch details...</span>
      </div>
    );
  }

  if (!batch) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">📦</div>
          <p className="text-gray-600">Batch not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-4 sm:py-6 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 sm:mb-8"
        >
          <button
            onClick={() => router.back()}
            className="flex items-center text-blue-600 hover:text-blue-800 mb-3 sm:mb-4 text-sm sm:text-base"
          >
            <ArrowLeft size={16} className="mr-2" />
            <span className="hidden sm:inline">Back to Dashboard</span>
            <span className="sm:hidden">Back</span>
          </button>
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center mb-3 sm:mb-4">
            <Factory className="text-blue-600 mr-0 sm:mr-3 mb-2 sm:mb-0" size={24} />
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">Batch #{batch.id}</h1>
          </div>
          <p className="text-gray-600 text-sm sm:text-base">Manufacturing process management and documentation</p>
        </motion.div>

        {/* Manufacturing Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6 sm:mb-8"
        >
          <ManufacturingTimeline 
            batch={batch} 
            onStatusUpdate={fetchBatchDetail}
          />
        </motion.div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Batch Details - Takes 2 columns */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="xl:col-span-2"
          >
            <BatchDetailCard 
              batch={batch} 
              onFileUpload={handleFileUpload}
            />
          </motion.div>
          
          {/* Farmer Certifications - Takes 1 column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <CertificationViewer batch={batch} />
          </motion.div>
        </div>
      </div>
    </div>
  );
}