import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, PieChart as PieChartIcon } from 'lucide-react';

export default function AnalyticsChart({ batches }) {
  // Monthly data
  const monthlyData = [
    { month: 'Jan', batches: 12 },
    { month: 'Feb', batches: 19 },
    { month: 'Mar', batches: 15 },
    { month: 'Apr', batches: 22 },
    { month: 'May', batches: 18 },
    { month: 'Jun', batches: batches.length }
  ];

  // Status distribution
  const statusData = [
    { name: 'Verified', value: batches.filter(b => b.currentStatus === 'Completed').length, color: '#10B981' },
    { name: 'Processing', value: batches.filter(b => b.currentStatus === 'Processing').length, color: '#3B82F6' },
    { name: 'Pending', value: batches.filter(b => b.currentStatus === 'Collected').length, color: '#F59E0B' }
  ];

  const verificationRate = batches.length > 0 
    ? Math.round((batches.filter(b => b.currentStatus === 'Completed').length / batches.length) * 100)
    : 0;

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      {/* Monthly Batches Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-lg p-6"
      >
        <div className="flex items-center mb-6">
          <TrendingUp className="text-blue-600 mr-3" size={20} />
          <h3 className="text-lg font-semibold text-gray-900">Monthly Processing</h3>
        </div>
        
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="month" stroke="#6b7280" />
            <YAxis stroke="#6b7280" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#1e3a8a', 
                border: 'none', 
                borderRadius: '8px',
                color: 'white'
              }}
            />
            <Bar dataKey="batches" fill="#3b82f6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Status Distribution */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-lg shadow-lg p-6"
      >
        <div className="flex items-center mb-6">
          <PieChartIcon className="text-blue-600 mr-3" size={20} />
          <h3 className="text-lg font-semibold text-gray-900">Verification Status</h3>
        </div>
        
        <div className="flex items-center justify-between">
          <ResponsiveContainer width="60%" height={200}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={80}
                dataKey="value"
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          
          <div className="space-y-3">
            {statusData.map((item, index) => (
              <div key={index} className="flex items-center">
                <div 
                  className="w-3 h-3 rounded-full mr-2"
                  style={{ backgroundColor: item.color }}
                ></div>
                <span className="text-sm text-gray-600">{item.name}: {item.value}</span>
              </div>
            ))}
            
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <div className="text-sm text-blue-600">Verification Rate</div>
              <div className="text-2xl font-bold text-blue-800">{verificationRate}%</div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}