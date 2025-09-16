import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, ShoppingBag, Leaf } from 'lucide-react';
import ProductCard from './ProductCard';

const API_BASE_URL = 'http://localhost:3001';

export default function BuyingSection() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);

  // Dynamic categories based on products
  const categories = ['All', ...new Set(products.map(p => p.category))];

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [products, searchTerm, selectedCategory]);

  const fetchProducts = async () => {
    try {
      // Fetch all batches that have products
      const batchesResponse = await fetch(`${API_BASE_URL}/api/batches`);
      const batches = await batchesResponse.json();
      
      const productsData = [];
      
      // For each batch, try to get product details
      for (const batch of batches) {
        try {
          const productResponse = await fetch(`${API_BASE_URL}/api/batch/${batch.id}/product`);
          if (productResponse.ok) {
            const product = await productResponse.json();
            
            // Transform data to match our product card format
            const transformedProduct = {
              id: product.id || batch.id,
              batchId: batch.id,
              name: product.productName || batch.herbName,
              description: product.description || `High-quality ${batch.herbName} sourced from certified farms.`,
              price: product.price || Math.floor(Math.random() * 500) + 100, // Random price if not set
              unit: product.category || 'pack',
              rating: parseFloat((4.5 + Math.random() * 0.5).toFixed(1)), // Single decimal rating
              manufacturingDate: product.manufacturingDate || batch.collectionTimestamp,
              imageUrl: product.productImages?.[0] ? `${API_BASE_URL}${product.productImages[0]}` : batch.imageUrl ? `${API_BASE_URL}${batch.imageUrl}` : null,
              category: product.category || 'Herbs',
              herbName: batch.herbName,
              farmerName: batch.farmerName || batch.owner
            };
            
            productsData.push(transformedProduct);
          }
        } catch (productError) {
          // Skip batches without products
          continue;
        }
      }
      
      setProducts(productsData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts([]);
      setLoading(false);
    }
  };

  const filterProducts = () => {
    let filtered = products;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    setFilteredProducts(filtered);
  };

  const handleBuyProduct = (product) => {
    // Handle purchase logic here
    alert(`Purchasing ${product.name} for ₹${product.price}`);
  };

  const handleTrackProduct = (batchId) => {
    // Switch to track tab and auto-search
    window.dispatchEvent(new CustomEvent('trackProduct', { detail: { batchId } }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="text-4xl"
        >
          🌿
        </motion.div>
        <span className="ml-4 text-gray-700">Loading products...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <ShoppingBag className="mr-3 text-green-600" size={28} />
            Ayurvedic Products
          </h2>
          <p className="text-gray-600 mt-1">Discover authentic, certified Ayurvedic products</p>
        </div>
        
        <div className="flex items-center bg-green-100 px-3 py-2 rounded-full">
          <Leaf className="text-green-600 mr-2" size={16} />
          <span className="text-green-800 text-sm font-medium">{filteredProducts.length} Products</span>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-2">
          <Filter className="text-gray-500" size={20} />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <ProductCard product={product} onBuy={handleBuyProduct} onTrack={handleTrackProduct} />
          </motion.div>
        ))}
      </div>

      {/* No Products Found */}
      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
          <p className="text-gray-600">Try adjusting your search or filter criteria</p>
        </div>
      )}
    </div>
  );
}