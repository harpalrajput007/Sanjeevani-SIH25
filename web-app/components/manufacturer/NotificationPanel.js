import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Package, CheckCircle, X, Clock } from 'lucide-react';

export default function NotificationPanel({ isOpen, onClose }) {
  const notifications = [
    {
      id: 1,
      type: 'new_batch',
      title: 'New Batch Received',
      message: 'Batch #1024 (Turmeric) has been received from Farmer F001',
      time: '2 minutes ago',
      icon: Package,
      color: 'text-blue-600 bg-blue-100'
    },
    {
      id: 2,
      type: 'verified',
      title: 'Batch Verified',
      message: 'Batch #1023 (Ashwagandha) has been successfully verified',
      time: '1 hour ago',
      icon: CheckCircle,
      color: 'text-green-600 bg-green-100'
    },
    {
      id: 3,
      type: 'pending',
      title: 'Verification Pending',
      message: 'Batch #1022 (Neem) requires lab report upload',
      time: '3 hours ago',
      icon: Clock,
      color: 'text-amber-600 bg-amber-100'
    }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-25 z-40"
            onClick={onClose}
          />
          
          {/* Panel */}
          <motion.div
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 300, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed right-0 top-0 h-full w-80 bg-white shadow-2xl z-50 overflow-y-auto"
          >
            {/* Header */}
            <div className="bg-blue-900 text-white p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Bell size={20} className="mr-2" />
                  <h3 className="text-lg font-semibold">Notifications</h3>
                </div>
                <button
                  onClick={onClose}
                  className="text-blue-200 hover:text-white transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Notifications List */}
            <div className="p-4 space-y-4">
              {notifications.map((notification, index) => {
                const IconComponent = notification.icon;
                return (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors cursor-pointer"
                  >
                    <div className="flex items-start">
                      <div className={`p-2 rounded-full ${notification.color} mr-3 flex-shrink-0`}>
                        <IconComponent size={16} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-gray-900 mb-1">
                          {notification.title}
                        </h4>
                        <p className="text-sm text-gray-600 mb-2">
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-500">
                          {notification.time}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Footer */}
            <div className="p-4 border-t">
              <button className="w-full text-center text-blue-600 hover:text-blue-800 text-sm font-medium">
                View All Notifications
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}