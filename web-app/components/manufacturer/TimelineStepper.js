import { motion } from 'framer-motion';
import { Settings, Package, Tag, Truck, CheckCircle } from 'lucide-react';

export default function TimelineStepper({ currentStep, onStepComplete }) {
  const steps = [
    { id: 1, name: 'Processing', icon: Settings, description: 'Quality testing and processing' },
    { id: 2, name: 'Packaging', icon: Package, description: 'Product packaging and sealing' },
    { id: 3, name: 'Labelling', icon: Tag, description: 'Product labeling and documentation' },
    { id: 4, name: 'Shipping', icon: Truck, description: 'Ready for distribution' }
  ];

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center mb-6">
        <div className="w-3 h-3 bg-blue-600 rounded-full mr-3"></div>
        <h3 className="text-xl font-semibold text-gray-900">Manufacturing Timeline</h3>
      </div>
      
      <div className="relative">
        {/* Progress Line */}
        <div className="absolute top-8 left-8 right-8 h-0.5 bg-gray-200">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="h-full bg-blue-600"
          />
        </div>
        
        <div className="flex justify-between relative">
          {steps.map((step, index) => {
            const isCompleted = currentStep > step.id;
            const isCurrent = currentStep === step.id;
            const IconComponent = step.icon;
            
            return (
              <div key={step.id} className="flex flex-col items-center relative">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: index * 0.2 }}
                  className={`w-16 h-16 rounded-full flex items-center justify-center border-4 transition-all duration-300 ${
                    isCompleted 
                      ? 'bg-blue-600 border-blue-600 text-white' 
                      : isCurrent 
                        ? 'bg-white border-blue-600 text-blue-600 shadow-lg' 
                        : 'bg-white border-gray-300 text-gray-400'
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle size={24} />
                  ) : (
                    <IconComponent size={24} />
                  )}
                </motion.div>
                
                <div className="mt-4 text-center max-w-24">
                  <p className={`text-sm font-medium ${
                    isCompleted || isCurrent ? 'text-blue-600' : 'text-gray-500'
                  }`}>
                    {step.name}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">{step.description}</p>
                </div>
                
                {isCurrent && !isCompleted && (
                  <motion.button
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    onClick={() => onStepComplete(step.id)}
                    className="mt-3 px-4 py-2 bg-blue-600 text-white text-xs rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Complete
                  </motion.button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}