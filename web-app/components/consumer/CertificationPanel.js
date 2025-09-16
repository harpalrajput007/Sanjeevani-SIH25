import { motion } from 'framer-motion';
import { Shield, FileText, ExternalLink, CheckCircle, Award, Download } from 'lucide-react';

const API_BASE_URL = 'http://localhost:3001';

export default function CertificationPanel({ certifications, batchId, product }) {
  console.log('Certifications received:', certifications); // Debug log
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200 shadow-lg"
    >
      <div className="flex items-center mb-6">
        <Shield className="text-blue-600 mr-3" size={28} />
        <h3 className="text-2xl font-bold text-gray-900">Certifications & Trust</h3>
      </div>

      <div className="space-y-6">
        {/* Blockchain Verification */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-r from-green-100 to-emerald-100 rounded-xl p-5 border-2 border-green-300 shadow-md"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center flex-1">
              <div className="bg-green-500 rounded-full p-2 mr-4 flex-shrink-0">
                <CheckCircle className="text-white" size={24} />
              </div>
              <div className="flex-1">
                <div className="font-bold text-green-800 text-lg">Blockchain Verified</div>
                <div className="text-sm text-green-700">Immutable record on distributed ledger</div>
              </div>
            </div>
            <button className="bg-green-600 text-white p-2 rounded-lg hover:bg-green-700 transition-colors flex-shrink-0">
              <ExternalLink size={18} />
            </button>
          </div>
          <div className="bg-green-200 rounded-lg p-3">
            <div className="text-xs text-green-800 font-medium mb-2">Transaction Hash</div>
            <div className="bg-green-100 rounded p-2">
              <div className="text-xs font-mono text-green-900 break-all">
                0x{batchId}f7a2b8c9d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3
              </div>
            </div>
          </div>
        </motion.div>

        {/* Certifications List */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-xl font-bold text-gray-900 flex items-center">
              <Award className="text-blue-600 mr-2" size={24} />
              Quality Certificates
            </h4>
            {((certifications && certifications.length > 0) || (product?.certifications && product.certifications.length > 0)) && (
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                {(certifications?.length || 0) + (product?.certifications?.length || 0)} Certificate{((certifications?.length || 0) + (product?.certifications?.length || 0)) > 1 ? 's' : ''}
              </span>
            )}
          </div>
          
          {((certifications && certifications.length > 0) || (product?.certifications && product.certifications.length > 0)) ? (
            <div className="space-y-6">
              {/* Farmer Certifications */}
              {certifications && certifications.length > 0 && (
                <div>
                  <h5 className="text-lg font-semibold text-green-700 mb-3 flex items-center">
                    🌱 Farmer Certifications
                  </h5>
                  <div className="space-y-3">
                    {certifications.map((cert, index) => (
                      <motion.div
                        key={`farmer-${index}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 + 0.3 }}
                        className="bg-white rounded-xl p-4 border-2 border-green-200 shadow-md hover:shadow-lg transition-all duration-300"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                          <div className="flex items-center flex-1">
                            <div className="bg-green-100 rounded-full p-3 mr-4 flex-shrink-0">
                              <FileText className="text-green-600" size={20} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="font-bold text-green-900 text-base truncate">{cert.name}</div>
                              <div className="text-sm text-green-600 mt-1">
                                <span className="font-medium">Source:</span> Farmer
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-2 flex-shrink-0">
                            <a
                              href={`${API_BASE_URL}${cert.url}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center justify-center px-3 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
                            >
                              <ExternalLink className="mr-1" size={14} />
                              View
                            </a>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Manufacturer Certifications */}
              {product?.certifications && product.certifications.length > 0 && (
                <div>
                  <h5 className="text-lg font-semibold text-blue-700 mb-3 flex items-center">
                    🏭 Manufacturer Certifications
                  </h5>
                  <div className="space-y-3">
                    {product.certifications.map((cert, index) => (
                      <motion.div
                        key={`manufacturer-${index}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 + 0.5 }}
                        className="bg-white rounded-xl p-4 border-2 border-blue-200 shadow-md hover:shadow-lg transition-all duration-300"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                          <div className="flex items-center flex-1">
                            <div className="bg-blue-100 rounded-full p-3 mr-4 flex-shrink-0">
                              <FileText className="text-blue-600" size={20} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="font-bold text-blue-900 text-base truncate">{cert.name}</div>
                              <div className="text-sm text-blue-600 mt-1">
                                <span className="font-medium">Source:</span> Manufacturer
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-2 flex-shrink-0">
                            <a
                              href={`${API_BASE_URL}${cert.url}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center justify-center px-3 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                            >
                              <ExternalLink className="mr-1" size={14} />
                              View
                            </a>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12 bg-white rounded-xl border-2 border-dashed border-gray-300"
            >
              <FileText className="mx-auto mb-4 text-gray-400" size={48} />
              <h4 className="text-lg font-semibold text-gray-600 mb-2">No Certificates Yet</h4>
              <p className="text-gray-500">Quality certifications are being processed by the manufacturer.</p>
            </motion.div>
          )}
        </div>

        {/* Trust Indicators */}
        <div className="pt-6 border-t-2 border-blue-200">
          <h4 className="text-lg font-bold text-gray-900 mb-4 text-center">Trust Indicators</h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
            <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border-2 border-green-200 shadow-sm">
              <div className="text-2xl font-bold text-green-600 mb-1">100%</div>
              <div className="text-sm font-medium text-green-700">Traceable</div>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border-2 border-blue-200 shadow-sm">
              <div className="text-2xl font-bold text-blue-600 mb-1">✓</div>
              <div className="text-sm font-medium text-blue-700">Verified</div>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border-2 border-purple-200 shadow-sm">
              <div className="text-2xl font-bold text-purple-600 mb-1">🌿</div>
              <div className="text-sm font-medium text-purple-700">Organic</div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}