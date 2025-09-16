export default function SuccessCard({ batchId, onClose }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full mx-4">
        <div className="text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold text-green-800 mb-2">Batch Created Successfully!</h2>
          <p className="text-gray-600 mb-4">Your herb batch has been registered on the blockchain</p>
          
          <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-green-700 mb-1">Batch ID</p>
            <p className="text-2xl font-bold text-green-800">#{batchId}</p>
          </div>
          
          <button
            onClick={onClose}
            className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 font-semibold"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}