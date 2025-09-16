import Link from 'next/link';

export default function ConsumerBatchCard({ batch }) {
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'collected': return 'bg-blue-100 text-blue-800';
      case 'in-transit': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-orange-100 text-orange-800';
      case 'completed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow border-l-4 border-blue-500">
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-lg font-semibold text-gray-900">🌿 {batch.herbName}</h3>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(batch.currentStatus)}`}>
          {batch.currentStatus}
        </span>
      </div>
      
      <div className="space-y-2 mb-4">
        <p className="text-sm text-gray-600">
          <span className="font-medium">Batch ID:</span> #{batch.id}
        </p>
        <p className="text-sm text-gray-600">
          <span className="font-medium">Quantity:</span> {batch.quantity}
        </p>
        <p className="text-sm text-gray-600">
          <span className="font-medium">Collected:</span> {new Date(batch.collectionTimestamp).toLocaleDateString()}
        </p>
      </div>
      
      <Link
        href={`/trace?id=${batch.id}`}
        className="inline-block w-full text-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
      >
        🔍 View Traceability
      </Link>
    </div>
  );
}