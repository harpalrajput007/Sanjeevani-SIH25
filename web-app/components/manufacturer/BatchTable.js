import { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, Clock, CheckCircle, AlertCircle, Search, Filter } from 'lucide-react';

export default function BatchTable({ batches, onBatchClick }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const filteredBatches = batches.filter(batch => {
    const matchesSearch = batch.herbName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         batch.id.toString().includes(searchTerm);
    const matchesStatus = statusFilter === 'All' || batch.currentStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });
  const getStatusIcon = (status) => {
    switch (status) {
      case 'Collected': return <Clock className="text-amber-500" size={16} />;
      case 'Processing': return <AlertCircle className="text-blue-500" size={16} />;
      case 'Completed': return <CheckCircle className="text-green-500" size={16} />;
      default: return <Clock className="text-gray-500" size={16} />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Collected': return 'bg-amber-100 text-amber-800';
      case 'Processing': return 'bg-blue-100 text-blue-800';
      case 'Completed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="overflow-hidden">
      <div className="bg-blue-900 text-white px-6 py-4">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-xl font-semibold">Batch Overview</h2>
            <p className="text-blue-200 text-sm">Manage and track herb batches</p>
          </div>
          <div className="text-blue-200 text-sm">
            {filteredBatches.length} of {batches.length} batches
          </div>
        </div>
        
        {/* Search and Filter */}
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-300" size={16} />
            <input
              type="text"
              placeholder="Search by Batch ID or Herb Name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-blue-800 border border-blue-700 rounded-lg text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-300" size={16} />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="pl-10 pr-8 py-2 bg-blue-800 border border-blue-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="All">All Status</option>
              <option value="Collected">Collected</option>
              <option value="Processing">Processing</option>
              <option value="Packaging">Packaging</option>
              <option value="Labelling">Labelling</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-blue-800 text-white">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Batch ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Herb Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Date Received</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Last Update</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredBatches.map((batch, index) => (
              <motion.tr
                key={batch.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-blue-50 cursor-pointer transition-colors`}
                onClick={() => onBatchClick(batch)}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">#{batch.id}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{batch.herbName}</div>
                  <div className="text-sm text-gray-500">{batch.quantity}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(batch.collectionTimestamp).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    {getStatusIcon(batch.currentStatus)}
                    <span className={`ml-2 px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(batch.currentStatus)}`}>
                      {batch.currentStatus}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(batch.collectionTimestamp).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button className="text-blue-600 hover:text-blue-900 flex items-center">
                    <Eye size={16} className="mr-1" />
                    View
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {filteredBatches.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-4xl mb-4">{batches.length === 0 ? '📦' : '🔍'}</div>
          <p className="text-gray-500 mb-2">
            {batches.length === 0 ? 'No batches available from farmers/collectors' : 'No batches match your search criteria'}
          </p>
          {batches.length === 0 && (
            <p className="text-gray-400 text-sm">
              Batches created by farmers will appear here for processing
            </p>
          )}
        </div>
      )}
    </div>
  );
}