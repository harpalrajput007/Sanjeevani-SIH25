export default function StatusTimeline({ statusHistory }) {
  return (
    <div className="relative">
      {statusHistory.map((status, index) => (
        <div key={index} className="flex items-start mb-6 last:mb-0">
          <div className="flex-shrink-0 w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-sm relative">
            {index + 1}
            {index < statusHistory.length - 1 && (
              <div className="absolute top-10 left-1/2 transform -translate-x-1/2 w-0.5 h-6 bg-green-300"></div>
            )}
          </div>
          <div className="ml-4 flex-grow">
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-lg text-gray-800 mb-1">
                {status.status}
              </h3>
              <p className="text-gray-600 text-sm mb-2">
                {new Date(status.timestamp).toLocaleString()}
              </p>
              <p className="text-xs text-gray-500">
                Updated by: {status.updatedBy.slice(0, 10)}...{status.updatedBy.slice(-8)}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}