import { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Download, Eye, Award, X } from 'lucide-react';

const API_BASE_URL = 'http://localhost:3001';

export default function CertificationViewer({ batch }) {
  const [selectedCert, setSelectedCert] = useState(null);

  const handleViewCertification = (cert) => {
    setSelectedCert(cert);
  };

  const handleDownload = (cert) => {
    const link = document.createElement('a');
    link.href = `${API_BASE_URL}${cert.url}`;
    link.download = cert.name;
    link.click();
  };

  if (!batch.certifications || batch.certifications.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 h-fit">
        <div className="flex items-center mb-4">
          <Award className="text-blue-600 mr-3" size={20} />
          <h3 className="text-lg font-semibold text-gray-900">Farmer Certifications</h3>
        </div>
        <div className="text-center py-8 text-gray-500">
          <Award className="mx-auto mb-3 text-gray-300" size={48} />
          <p className="text-sm">No certifications uploaded</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 h-fit">
        <div className="flex items-center mb-6">
          <Award className="text-blue-600 mr-3" size={20} />
          <h3 className="text-lg font-semibold text-gray-900">Farmer Certifications</h3>
        </div>

        <div className="space-y-3">
          {batch.certifications.map((cert, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-3 bg-gray-50 rounded-lg border border-gray-200 hover:shadow-sm transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start flex-1 min-w-0">
                  <FileText className="text-blue-600 mr-2 mt-0.5 flex-shrink-0" size={16} />
                  <div className="min-w-0 flex-1">
                    <div className="font-medium text-gray-900 text-sm truncate">{cert.name}</div>
                    <div className="text-xs text-gray-500 mt-1">
                      {cert.type?.includes('pdf') ? 'PDF Document' : 'Image File'}
                    </div>
                  </div>
                </div>
                
                <div className="flex space-x-1 ml-2">
                  <button
                    onClick={() => handleViewCertification(cert)}
                    className="p-1.5 text-blue-600 hover:bg-blue-100 rounded transition-colors"
                    title="View Certificate"
                  >
                    <Eye size={14} />
                  </button>
                  <button
                    onClick={() => handleDownload(cert)}
                    className="p-1.5 text-green-600 hover:bg-green-100 rounded transition-colors"
                    title="Download Certificate"
                  >
                    <Download size={14} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="text-xs text-gray-500 text-center">
            {batch.certifications.length} certificate{batch.certifications.length !== 1 ? 's' : ''} available
          </div>
        </div>
      </div>

      {/* Certificate Modal */}
      {selectedCert && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl max-w-4xl max-h-[90vh] overflow-hidden w-full"
          >
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">{selectedCert.name}</h3>
              <button
                onClick={() => setSelectedCert(null)}
                className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-4 max-h-[70vh] overflow-auto">
              {selectedCert.type?.includes('pdf') ? (
                <iframe
                  src={`${API_BASE_URL}${selectedCert.url}`}
                  className="w-full h-96 border border-gray-300 rounded"
                  title={selectedCert.name}
                />
              ) : (
                <img
                  src={`${API_BASE_URL}${selectedCert.url}`}
                  alt={selectedCert.name}
                  className="max-w-full h-auto rounded"
                />
              )}
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
}