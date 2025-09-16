import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Package, Calendar, Upload, Eye, Save, Award } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const API_BASE_URL = 'http://localhost:3001';

const categories = [
  'Powder', 'Capsule', 'Oil', 'Tea', 'Tablet', 'Syrup', 'Extract', 'Cream'
];

export default function ProductUpload({ batch }) {
  const [productData, setProductData] = useState({
    productName: '',
    category: 'Powder',
    description: '',
    manufacturingDate: '',
    expiryDate: '',
    price: ''
  });
  const [productImages, setProductImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [existingProduct, setExistingProduct] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    fetchExistingProduct();
  }, [batch.id]);

  const fetchExistingProduct = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/batch/${batch.id}/product`);
      const product = await response.json();
      if (product && product.productName) {
        setExistingProduct(product);
        setProductData({
          productName: product.productName || '',
          category: product.category || 'Powder',
          description: product.description || '',
          manufacturingDate: product.manufacturingDate ? product.manufacturingDate.split('T')[0] : '',
          expiryDate: product.expiryDate ? product.expiryDate.split('T')[0] : '',
          price: product.price || ''
        });
        if (product.productImages) {
          setImagePreviews(product.productImages.map(url => `${API_BASE_URL}${url}`));
        }
      }
    } catch (error) {
      console.error('Error fetching product:', error);
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setProductImages(files);
    
    // Create previews
    const previews = files.map(file => URL.createObjectURL(file));
    setImagePreviews(previews);
  };

  const handleSubmit = async () => {
    if (!productData.productName || !productData.category) {
      alert('Please fill in required fields');
      return;
    }

    console.log('Starting product upload:', {
      productData,
      imagesCount: productImages.length,
      batchId: batch.id
    });

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('productName', productData.productName);
      formData.append('category', productData.category);
      formData.append('description', productData.description);
      formData.append('manufacturingDate', productData.manufacturingDate);
      formData.append('expiryDate', productData.expiryDate);
      formData.append('price', productData.price);
      formData.append('manufacturerName', user?.name || 'manufacturer');

      productImages.forEach((file, index) => {
        formData.append('productImages', file);
        console.log(`Added image ${index}:`, file.name);
      });

      console.log('Sending request to:', `${API_BASE_URL}/api/batch/${batch.id}/product`);

      const response = await fetch(`${API_BASE_URL}/api/batch/${batch.id}/product`, {
        method: 'POST',
        body: formData,
      });

      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);

      const result = await response.json();
      console.log('Response data:', result);
      
      if (result.success) {
        alert('Product details saved successfully!');
        fetchExistingProduct();
      } else {
        alert(result.error || 'Failed to save product');
      }
    } catch (error) {
      console.error('Error saving product:', error);
      alert(`Failed to save product: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
      {/* Product Upload Form */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="bg-gradient-to-br from-green-50 to-amber-50 rounded-lg shadow-lg p-4 sm:p-6 border border-green-200"
      >
        <div className="flex items-center mb-6">
          <Package className="text-green-600 mr-3" size={24} />
          <h3 className="text-xl font-semibold text-gray-900">Upload Product Details</h3>
        </div>

        <div className="space-y-6">
          {/* Batch ID (Read-only) */}
          <div className="bg-white rounded-lg p-4 border border-green-200">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Linked Batch ID
            </label>
            <div className="text-lg font-bold text-green-600">#{batch.id}</div>
          </div>

          {/* Product Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product Name *
            </label>
            <input
              type="text"
              placeholder="e.g., Organic Tulsi Tea - 100g"
              value={productData.productName}
              onChange={(e) => setProductData({...productData, productName: e.target.value})}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product Category *
            </label>
            <select
              value={productData.category}
              onChange={(e) => setProductData({...productData, category: e.target.value})}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ayurvedic Benefits & Usage
            </label>
            <textarea
              placeholder="Describe the Ayurvedic benefits and recommended usage..."
              value={productData.description}
              onChange={(e) => setProductData({...productData, description: e.target.value})}
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="inline w-4 h-4 mr-1" />
                Manufacturing Date
              </label>
              <input
                type="date"
                value={productData.manufacturingDate}
                onChange={(e) => setProductData({...productData, manufacturingDate: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="inline w-4 h-4 mr-1" />
                Expiry Date
              </label>
              <input
                type="date"
                value={productData.expiryDate}
                onChange={(e) => setProductData({...productData, expiryDate: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Price */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Price (₹) - Optional
            </label>
            <input
              type="number"
              placeholder="0.00"
              value={productData.price}
              onChange={(e) => setProductData({...productData, price: e.target.value})}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product Images
            </label>
            <div className="border-2 border-dashed border-green-300 rounded-lg p-6 text-center hover:border-green-400 transition-colors">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="hidden"
                id="product-images"
              />
              <label htmlFor="product-images" className="cursor-pointer">
                <Upload className="mx-auto text-green-500 mb-2" size={32} />
                <p className="text-sm text-gray-600">Upload product images</p>
              </label>
            </div>
            
            {/* Image Previews */}
            {imagePreviews.length > 0 && (
              <div className="grid grid-cols-3 gap-2 mt-4">
                {imagePreviews.map((preview, index) => (
                  <img
                    key={index}
                    src={preview}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-20 object-cover rounded-lg border"
                  />
                ))}
              </div>
            )}
          </div>

          {/* Save Button */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-3 px-6 rounded-lg hover:from-green-700 hover:to-green-800 disabled:bg-gray-400 font-medium flex items-center justify-center"
          >
            <Save className="mr-2" size={20} />
            {loading ? 'Saving...' : 'Save & Publish Product'}
          </button>
        </div>
      </motion.div>

      {/* Preview Card */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="bg-white rounded-lg shadow-lg p-6 border border-gray-200"
      >
        <div className="flex items-center mb-6">
          <Eye className="text-blue-600 mr-3" size={24} />
          <h3 className="text-xl font-semibold text-gray-900">Consumer Preview</h3>
        </div>

        {/* Product Preview Card */}
        <div className="bg-gradient-to-br from-green-50 to-amber-50 rounded-lg p-6 border border-green-200">
          {/* Product Image */}
          <div className="mb-4">
            {imagePreviews.length > 0 ? (
              <img
                src={imagePreviews[0]}
                alt="Product"
                className="w-full h-48 object-cover rounded-lg"
              />
            ) : (
              <div className="w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center">
                <Package className="text-gray-400" size={48} />
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-lg font-semibold text-gray-900">
                {productData.productName || 'Product Name'}
              </h4>
              <div className="flex items-center bg-green-100 px-2 py-1 rounded-full">
                <Award className="text-green-600 mr-1" size={16} />
                <span className="text-xs text-green-700 font-medium">Certified</span>
              </div>
            </div>
            
            <div className="text-sm text-green-600 font-medium">
              {productData.category}
            </div>
            
            <p className="text-sm text-gray-600 line-clamp-3">
              {productData.description || 'Product description will appear here...'}
            </p>
            
            <div className="flex justify-between items-center pt-2 border-t border-green-200">
              <div className="text-xs text-gray-500">
                Batch #{batch.id} • {batch.farmerName}
              </div>
              {productData.price && (
                <div className="text-lg font-bold text-green-600">
                  ₹{productData.price}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-4 text-xs text-gray-500 text-center">
          This is how your product will appear to consumers
        </div>
      </motion.div>
    </div>
  );
}