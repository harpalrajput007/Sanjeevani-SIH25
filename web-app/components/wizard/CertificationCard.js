import { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, X, FileText, Award } from 'lucide-react';

export default function CertificationCard({ formData, setFormData }) {
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = (files) => {
    const newCertifications = [...formData.certifications];
    
    Array.from(files).forEach(file => {
      if (file.type.includes('image') || file.type.includes('pdf')) {
        newCertifications.push({
          id: Date.now() + Math.random(),
          file: file,
          name: file.name,
          type: file.type
        });
      }
    });
    
    setFormData({ ...formData, certifications: newCertifications });
  };

  const removeCertification = (id) => {
    const updatedCertifications = formData.certifications.filter(cert => cert.id !== id);
    setFormData({ ...formData, certifications: updatedCertifications });
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <Award className="mx-auto text-herbal-600 mb-4" size={48} />
        <h3 className="text-2xl font-bold text-herbal-800 mb-2">Upload Certifications</h3>
        <p className="text-herbal-600">Add quality certificates, organic certifications, or lab reports (Optional)</p>
      </div>

      {/* Upload Area */}
      <motion.div
        className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
          dragActive 
            ? 'border-herbal-500 bg-herbal-50' 
            : 'border-herbal-300 hover:border-herbal-400 hover:bg-herbal-25'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          multiple
          accept="image/*,.pdf"
          onChange={handleChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        
        <Upload className="mx-auto text-herbal-500 mb-4" size={48} />
        <h4 className="text-lg font-semibold text-herbal-800 mb-2">
          Drop certification files here
        </h4>
        <p className="text-herbal-600 mb-4">
          or click to browse (Images and PDFs only)
        </p>
        <div className="text-sm text-herbal-500">
          Supported formats: JPG, PNG, PDF • Max 10MB per file
        </div>
      </motion.div>

      {/* Uploaded Certifications */}
      {formData.certifications.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-semibold text-herbal-800">Uploaded Certifications:</h4>
          <div className="grid gap-3">
            {formData.certifications.map((cert) => (
              <motion.div
                key={cert.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between bg-white p-4 rounded-lg border border-herbal-200"
              >
                <div className="flex items-center">
                  <FileText className="text-herbal-600 mr-3" size={20} />
                  <div>
                    <div className="font-medium text-herbal-800">{cert.name}</div>
                    <div className="text-sm text-herbal-600">
                      {cert.type.includes('pdf') ? 'PDF Document' : 'Image File'}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => removeCertification(cert.id)}
                  className="text-red-500 hover:text-red-700 p-1"
                >
                  <X size={16} />
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}