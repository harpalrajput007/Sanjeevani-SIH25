import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import QRCode from 'qrcode';
import StatusTimeline from '../../components/StatusTimeline';
import LoadingSpinner from '../../components/LoadingSpinner';

const API_BASE_URL = 'http://localhost:3001';

export default function BatchDetail() {
  const [batch, setBatch] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [qrCode, setQrCode] = useState('');
  const [userType, setUserType] = useState('');
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (!localStorage.getItem('authenticated')) {
        router.push('/');
        return;
      }
      setUserType(localStorage.getItem('userType') || 'farmer');
    }

    if (id) {
      fetchBatchDetails();
    }
  }, [id]);

  const fetchBatchDetails = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/batch/${id}`);
      const data = await response.json();
      setBatch(data);
    } catch (error) {
      console.error('Error fetching batch details:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async () => {
    if (!newStatus.trim()) {
      alert('Please enter a status');
      return;
    }

    setUpdating(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/batch/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ newStatus }),
      });

      const result = await response.json();
      if (result.success) {
        setNewStatus('');
        fetchBatchDetails(); // Refresh data
        alert('Status updated successfully!');
      } else {
        alert('Failed to update status');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status');
    } finally {
      setUpdating(false);
    }
  };

  const generateQRCode = async () => {
    try {
      const url = `${window.location.origin}/trace?id=${id}`;
      const qrCodeDataURL = await QRCode.toDataURL(url);
      setQrCode(qrCodeDataURL);
    } catch (error) {
      console.error('Error generating QR code:', error);
    }
  };

  if (loading) {
    return <LoadingSpinner size="lg" text="Loading batch details..." />;
  }

  if (!batch) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl text-gray-400 mb-4">⚠️</div>
          <div className="text-xl text-gray-600">Batch not found</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={() => router.back()}
                className="text-blue-600 hover:text-blue-800 mr-4"
              >
                ← Back
              </button>
              <h1 className="text-2xl font-bold text-green-600">Batch #{batch.id}</h1>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-xl font-semibold mb-4">Batch Information</h2>
              <div className="space-y-2">
                <p><strong>Herb Name:</strong> {batch.herbName}</p>
                <p><strong>Quantity:</strong> {batch.quantity}</p>
                <p><strong>Collection Date:</strong> {new Date(batch.collectionTimestamp).toLocaleString()}</p>
                <p><strong>Location:</strong> {batch.geoLocation}</p>
                <p><strong>Owner:</strong> {batch.owner}</p>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-2">Herb Image</h3>
              <img
                src={batch.imageUrl ? `${API_BASE_URL}${batch.imageUrl}` : `https://ipfs.io/ipfs/${batch.ipfsImageHash}`}
                alt="Herb"
                className="w-full h-48 object-cover rounded-lg"
              />
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Status History</h2>
          <StatusTimeline statusHistory={batch.statusHistory} />
        </div>

        {userType === 'manufacturer' && (
          <div className="bg-white shadow rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Update Status</h2>
            <div className="flex gap-4">
              <input
                type="text"
                placeholder="Enter new status (e.g., In-Transit, Processing)"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
              />
              <button
                onClick={updateStatus}
                disabled={updating}
                className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 disabled:bg-gray-400"
              >
                {updating ? 'Updating...' : 'Update Status'}
              </button>
            </div>
          </div>
        )}

        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">QR Code for Traceability</h2>
          <button
            onClick={generateQRCode}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 mb-4"
          >
            Generate QR Code
          </button>
          
          {qrCode && (
            <div className="text-center">
              <img src={qrCode} alt="QR Code" className="mx-auto mb-2" />
              <p className="text-sm text-gray-600">
                Scan this QR code to view public traceability information
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}