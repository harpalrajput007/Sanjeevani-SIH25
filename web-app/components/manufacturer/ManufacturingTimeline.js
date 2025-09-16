import { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Clock, Upload, FileText } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const API_BASE_URL = 'http://localhost:3001';

const manufacturingSteps = [
  { id: 'Collected', name: 'Collected', description: 'Raw herbs collected from farmer' },
  { id: 'Processing', name: 'Processing', description: 'Cleaning and initial processing' },
  { id: 'Packaging', name: 'Packaging', description: 'Packaging and labeling' },
  { id: 'Quality Check', name: 'Quality Check', description: 'Quality assurance testing' },
  { id: 'Completed', name: 'Completed', description: 'Ready for distribution' }
];

export default function ManufacturingTimeline({ batch, onStatusUpdate }) {
  const [loading, setLoading] = useState(false);
  const [uploadingCert, setUploadingCert] = useState(false);
  const [certFile, setCertFile] = useState(null);
  const [certName, setCertName] = useState('');
  const { user } = useAuth();

  const getCurrentStepIndex = () => {
    if (!batch.statusHistory || batch.statusHistory.length === 0) return 0;
    const currentStatus = batch.statusHistory[batch.statusHistory.length - 1].status;
    return manufacturingSteps.findIndex(step => step.id === currentStatus);
  };

  const updateStatus = async (newStatus) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/batch/${batch.id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          newStatus,
          updatedBy: user?.name || 'manufacturer'
        }),
      });

      const result = await response.json();
      if (result.success) {
        onStatusUpdate();
        alert('Status updated successfully!');
      } else {
        alert(result.error || 'Failed to update status');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status');
    } finally {
      setLoading(false);
    }
  };

  const uploadCertification = async () => {
    if (!certFile || !certName) {
      alert('Please select a file and enter certification name');
      return;
    }

    console.log('Starting certificate upload:', {
      fileName: certFile.name,
      fileSize: certFile.size,
      certName,
      batchId: batch.id
    });

    setUploadingCert(true);
    try {
      const formData = new FormData();
      formData.append('certificate', certFile);
      formData.append('certificationName', certName);
      formData.append('uploadedBy', user?.name || 'manufacturer');

      console.log('Sending request to:', `${API_BASE_URL}/api/batch/${batch.id}/certification`);

      const response = await fetch(`${API_BASE_URL}/api/batch/${batch.id}/certification`, {
        method: 'POST',
        body: formData,
      });

      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);

      const result = await response.json();
      console.log('Response data:', result);
      
      if (result.success) {
        onStatusUpdate();
        setCertFile(null);
        setCertName('');
        document.querySelector('input[type="file"]').value = '';
        alert('Certification uploaded successfully!');
      } else {
        alert(result.error || 'Failed to upload certification');
      }
    } catch (error) {
      console.error('Error uploading certification:', error);
      alert(`Failed to upload certification: ${error.message}`);
    } finally {
      setUploadingCert(false);
    }
  };

  const currentStepIndex = getCurrentStepIndex();

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
      <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6">Manufacturing Timeline</h3>
      
      {/* Timeline Steps */}
      <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
        {manufacturingSteps.map((step, index) => {
          const isCompleted = index <= currentStepIndex;
          const isCurrent = index === currentStepIndex;
          const isNext = index === currentStepIndex + 1;
          
          return (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`flex items-center p-4 rounded-lg border-2 ${
                isCompleted 
                  ? 'bg-green-50 border-green-200' 
                  : isCurrent 
                  ? 'bg-blue-50 border-blue-200' 
                  : 'bg-gray-50 border-gray-200'
              }`}
            >
              <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                isCompleted 
                  ? 'bg-green-500 text-white' 
                  : isCurrent 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-300 text-gray-600'
              }`}>
                {isCompleted ? <CheckCircle size={16} /> : <Clock size={16} />}
              </div>
              
              <div className="ml-4 flex-1">
                <h4 className={`font-medium ${
                  isCompleted ? 'text-green-800' : isCurrent ? 'text-blue-800' : 'text-gray-600'
                }`}>
                  {step.name}
                </h4>
                <p className="text-sm text-gray-600">{step.description}</p>
              </div>
              
              {isNext && user?.userType === 'manufacturer' && (
                <button
                  onClick={() => updateStatus(step.id)}
                  disabled={loading}
                  className="ml-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 text-sm"
                >
                  {loading ? 'Updating...' : 'Mark Complete'}
                </button>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Certification Upload */}
      {user?.userType === 'manufacturer' && (
        <div className="border-t pt-6">
          <h4 className="text-lg font-medium text-gray-900 mb-4">Upload Certifications</h4>
          
          <div className="space-y-4">
            <div>
              <input
                type="text"
                placeholder="Certification Name (e.g., Quality Certificate, Lab Report)"
                value={certName}
                onChange={(e) => setCertName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) => setCertFile(e.target.files[0])}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <button
              onClick={uploadCertification}
              disabled={uploadingCert || !certFile || !certName}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400"
            >
              <Upload size={16} className="mr-2" />
              {uploadingCert ? 'Uploading...' : 'Upload Certificate'}
            </button>
          </div>
        </div>
      )}

      {/* Existing Certifications */}
      {batch.certifications && batch.certifications.length > 0 && (
        <div className="border-t pt-6 mt-6">
          <h4 className="text-lg font-medium text-gray-900 mb-4">Certifications</h4>
          <div className="space-y-2">
            {batch.certifications.map((cert, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <FileText className="text-blue-600 mr-3" size={20} />
                  <div>
                    <p className="font-medium text-gray-900">{cert.name}</p>
                    <p className="text-sm text-gray-600">
                      Uploaded by {cert.uploadedBy} on {new Date(cert.uploadedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <a
                  href={`${API_BASE_URL}${cert.fileUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                >
                  View
                </a>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}