require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const multer = require('multer');
const { ethers } = require('ethers');
// const { create } = require('ipfs-http-client'); // Disabled
const Batch = require('./models/Batch');
const Herb = require('./models/Herb');
const User = require('./models/User');

// Try to load Product model, create simple fallback if it fails
let Product;
try {
  Product = require('./models/Product');
} catch (error) {
  console.log('Product model not found, creating simple schema');
  const mongoose = require('mongoose');
  const productSchema = new mongoose.Schema({
    batchId: Number,
    productName: String,
    category: String,
    description: String,
    manufacturingDate: Date,
    expiryDate: Date,
    price: Number,
    productImages: [String],
    manufacturerName: String,
    isPublished: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
  });
  Product = mongoose.model('Product', productSchema);
}

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use('/uploads', express.static('uploads'));

// MongoDB connection with SSL options
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/herbtrace', {
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
}).catch(err => {
  console.error('MongoDB connection error:', err);
});

// IPFS client setup (disabled for local development)
// const ipfs = create({
//   host: 'ipfs.infura.io',
//   port: 5001,
//   protocol: 'https'
// });

// Blockchain setup (disabled for local development)
// const provider = new ethers.JsonRpcProvider(process.env.POLYGON_RPC_URL);
// const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
// const contract = new ethers.Contract(process.env.CONTRACT_ADDRESS, contractABI, wallet);

// Multer setup for file uploads
const upload = multer({ storage: multer.memoryStorage() });

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    service: 'Herb Trace Backend'
  });
});

// Test endpoint
app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend is working!' });
});

// Test batch creation endpoint
app.post('/api/test-batch', (req, res) => {
  console.log('Test batch endpoint hit');
  console.log('Body:', req.body);
  res.json({ success: true, message: 'Test endpoint working' });
});

// Test product endpoint
app.post('/api/test-product', (req, res) => {
  console.log('Test product endpoint hit');
  res.json({ success: true, message: 'Product endpoint working' });
});

// Authentication endpoints
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('Login attempt:', { email });
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
    
    // Find user by email
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    
    // Check password (in production, use bcrypt)
    if (user.password !== password) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    
    console.log('Login successful for user:', user._id);
    
    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        userType: user.userType
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed: ' + error.message });
  }
});

app.post('/api/auth/signup', async (req, res) => {
  try {
    const { name, email, password, userType } = req.body;
    console.log('Signup attempt:', { name, email, userType });
    
    // Validate required fields
    if (!name || !email || !password || !userType) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists with this email' });
    }
    
    // Create new user
    const user = new User({
      name,
      email,
      password, // In production, hash this with bcrypt
      userType
    });
    
    const savedUser = await user.save();
    console.log('Created user successfully:', savedUser._id);
    
    res.json({
      success: true,
      user: {
        id: savedUser._id,
        name: savedUser.name,
        email: savedUser.email,
        userType: savedUser.userType
      }
    });
  } catch (error) {
    console.error('Signup error:', error);
    if (error.code === 11000) {
      res.status(400).json({ error: 'Email already exists' });
    } else {
      res.status(500).json({ error: 'Signup failed: ' + error.message });
    }
  }
});

// Routes
app.post('/api/batch', upload.fields([{ name: 'image', maxCount: 1 }, { name: 'certifications', maxCount: 10 }]), async (req, res) => {
  try {
    console.log('=== BATCH CREATION DEBUG START ===');
    console.log('Request body:', req.body);
    console.log('Request files:', req.files);
    console.log('Request headers:', req.headers);
    
    const { herbName, quantity, geoLocation, farmerName } = req.body;
    
    console.log('Extracted data:', { herbName, quantity, geoLocation, farmerName });
    console.log('Files received:', req.files);
    
    if (!req.files || !req.files.image || !req.files.image[0]) {
      return res.status(400).json({ error: 'Image is required' });
    }

    // Generate batch ID
    const batchId = Date.now();
    const imageFile = req.files.image[0];
    const imageUrl = `/uploads/${batchId}-${imageFile.originalname}`;
    
    // Save image locally
    const fs = require('fs');
    const path = require('path');
    const uploadsDir = path.join(__dirname, 'uploads');
    
    // Ensure uploads directory exists
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
    
    const imagePath = path.join(uploadsDir, `${batchId}-${imageFile.originalname}`);
    fs.writeFileSync(imagePath, imageFile.buffer);

    // Process certifications
    const certifications = [];
    if (req.files.certifications && req.files.certifications.length > 0) {
      req.files.certifications.forEach((certFile, index) => {
        const certFileName = `cert-${batchId}-${index}-${certFile.originalname}`;
        const certPath = path.join(uploadsDir, certFileName);
        fs.writeFileSync(certPath, certFile.buffer);
        
        certifications.push({
          name: certFile.originalname,
          fileUrl: `/uploads/${certFileName}`,
          uploadedAt: new Date(),
          uploadedBy: farmerName || 'farmer'
        });
      });
    }

    // Store in Herb model
    const herb = new Herb({
      batchId: batchId,
      herbName,
      quantity,
      imageUrl,
      geoLocation,
      farmerName: farmerName || 'Unknown Farmer',
      farmerEmail: req.body.farmerEmail || '',
      certifications: certifications,
      statusHistory: [{
        status: 'Collected',
        timestamp: new Date()
      }]
    });
    
    const savedHerb = await herb.save();
    console.log('Herb saved successfully:', savedHerb._id);
    console.log('Certifications saved:', certifications.length);

    console.log('About to send success response');
    res.json({ 
      success: true, 
      batchId: batchId.toString(),
      ipfsHash: imageUrl,
      transactionHash: 'local-' + batchId,
      certificationsCount: certifications.length
    });
    console.log('=== BATCH CREATION DEBUG END (SUCCESS) ===');
  } catch (error) {
    console.error('=== BATCH CREATION ERROR ===');
    console.error('Error type:', error.constructor.name);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    console.error('=== END ERROR DEBUG ===');
    res.status(500).json({ error: 'Failed to create batch: ' + error.message });
  }
});

app.put('/api/batch/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { newStatus, updatedBy } = req.body;
    
    console.log('Updating batch status:', { id, newStatus, updatedBy });

    // Update in Herb model
    const herb = await Herb.findOne({ batchId: parseInt(id) });
    if (herb) {
      herb.statusHistory.push({
        status: newStatus,
        timestamp: new Date(),
        updatedBy: updatedBy || 'manufacturer'
      });
      await herb.save();
      console.log('Status updated in Herb model');
    }

    res.json({ success: true, message: 'Status updated successfully' });
  } catch (error) {
    console.error('Error updating status:', error);
    res.status(500).json({ error: 'Failed to update status: ' + error.message });
  }
});

app.get('/api/batch/:id', async (req, res) => {
  try {
    const { id } = req.params;
    let formattedBatch = null;
    
    try {
      // Try blockchain first
      const batchDetails = await contract.getBatchDetails(id);
      
      formattedBatch = {
        id: batchDetails[0].toString(),
        herbName: batchDetails[1],
        quantity: batchDetails[2],
        ipfsImageHash: batchDetails[3],
        geoLocation: batchDetails[4],
        collectionTimestamp: new Date(Number(batchDetails[5]) * 1000).toISOString(),
        owner: batchDetails[6],
        farmerName: 'Farmer Smith', // Default name for blockchain batches
        statusHistory: batchDetails[7].map(status => ({
          status: status[0],
          timestamp: new Date(Number(status[1]) * 1000).toISOString(),
          updatedBy: status[2]
        }))
      };
    } catch (blockchainError) {
      console.log('Blockchain not available, fetching from MongoDB');
      
      // Try Batch model first
      let batch = await Batch.findOne({ batchId: id });
      
      if (!batch) {
        // Try Herb model
        const herb = await Herb.findOne({ batchId: parseInt(id) });
        if (!herb) {
          return res.status(404).json({ error: 'Batch not found' });
        }
        
        formattedBatch = {
          id: herb.batchId.toString(),
          herbName: herb.herbName,
          quantity: herb.quantity,
          ipfsImageHash: herb.imageUrl,
          imageUrl: herb.imageUrl,
          geoLocation: herb.geoLocation,
          collectionTimestamp: herb.collectionTimestamp.toISOString(),
          owner: 'farmer',
          farmerName: herb.farmerName || 'Unknown Farmer',
          farmerEmail: herb.farmerEmail || '',
          currentStatus: herb.statusHistory && herb.statusHistory.length > 0 
            ? herb.statusHistory[herb.statusHistory.length - 1].status 
            : 'Collected',
          statusHistory: herb.statusHistory || [],
          certifications: herb.certifications || []
        };
      } else {
        formattedBatch = {
          id: batch.batchId,
          herbName: batch.herbName,
          quantity: batch.quantity,
          ipfsImageHash: batch.ipfsImageHash,
          geoLocation: batch.geoLocation,
          collectionTimestamp: batch.collectionTimestamp.toISOString(),
          owner: batch.owner,
          farmerName: batch.farmerName || 'Farmer John',
          currentStatus: batch.currentStatus,
          statusHistory: batch.statusHistory
        };
      }
    }

    res.json(formattedBatch);
  } catch (error) {
    console.error('Error fetching batch:', error);
    res.status(500).json({ error: 'Failed to fetch batch details' });
  }
});

app.get('/api/batches', async (req, res) => {
  try {
    console.log('Fetching batches from Herb model');
    
    const herbData = await Herb.find().sort({ collectionTimestamp: -1 });
    const batches = herbData.map(herb => ({
      id: herb.batchId.toString(),
      herbName: herb.herbName,
      quantity: herb.quantity,
      collectionTimestamp: herb.collectionTimestamp.toISOString(),
      currentStatus: herb.statusHistory && herb.statusHistory.length > 0 
        ? herb.statusHistory[herb.statusHistory.length - 1].status 
        : 'Collected',
      owner: 'farmer',
      imageUrl: herb.imageUrl
    }));
    
    console.log(`Found ${batches.length} batches`);
    res.json(batches);
  } catch (error) {
    console.error('Error fetching batches:', error);
    res.json([]);
  }
});

app.get('/api/batch-count', async (req, res) => {
  try {
    const count = await Herb.countDocuments();
    res.json({ count });
  } catch (error) {
    console.error('Error fetching batch count:', error);
    res.json({ count: 0 });
  }
});

// Upload certification endpoint
app.post('/api/batch/:id/certification', upload.single('certificate'), async (req, res) => {
  try {
    const { id } = req.params;
    const { certificationName, uploadedBy } = req.body;
    
    console.log('Certificate upload request:', {
      batchId: id,
      certificationName,
      uploadedBy,
      hasFile: !!req.file
    });
    
    if (!req.file) {
      console.log('No file received in request');
      return res.status(400).json({ error: 'Certificate file is required' });
    }

    console.log('File details:', {
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size
    });

    // Save certificate file
    const certId = Date.now();
    const fileName = `cert-${certId}-${req.file.originalname}`;
    const certUrl = `/uploads/${fileName}`;
    
    const fs = require('fs');
    const path = require('path');
    const uploadsDir = path.join(__dirname, 'uploads');
    
    // Ensure uploads directory exists
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
      console.log('Created uploads directory');
    }
    
    const certPath = path.join(uploadsDir, fileName);
    fs.writeFileSync(certPath, req.file.buffer);
    console.log('File saved to:', certPath);

    // Update herb with certification
    const herb = await Herb.findOne({ batchId: parseInt(id) });
    if (!herb) {
      console.log('Batch not found:', id);
      return res.status(404).json({ error: 'Batch not found' });
    }

    console.log('Found herb batch:', herb.batchId);

    herb.certifications.push({
      name: certificationName || 'Quality Certificate',
      fileUrl: certUrl,
      uploadedAt: new Date(),
      uploadedBy: uploadedBy || 'manufacturer'
    });
    
    const savedHerb = await herb.save();
    console.log('Certification saved. Total certifications:', savedHerb.certifications.length);

    res.json({ 
      success: true, 
      message: 'Certification uploaded successfully',
      certification: {
        name: certificationName || 'Quality Certificate',
        fileUrl: certUrl,
        uploadedAt: new Date(),
        uploadedBy: uploadedBy || 'manufacturer'
      }
    });
  } catch (error) {
    console.error('Error uploading certification:', error);
    res.status(500).json({ error: 'Failed to upload certification: ' + error.message });
  }
});

// Product upload endpoint
app.post('/api/batch/:id/product', upload.array('productImages', 5), async (req, res) => {
  try {
    const { id } = req.params;
    const { productName, category, description, manufacturingDate, expiryDate, price, manufacturerName } = req.body;
    
    console.log('Product upload request:', {
      batchId: id,
      productName,
      category,
      description,
      manufacturingDate,
      expiryDate,
      price,
      manufacturerName,
      filesCount: req.files ? req.files.length : 0
    });
    
    // Validate required fields
    if (!productName || !category) {
      console.log('Missing required fields');
      return res.status(400).json({ error: 'Product name and category are required' });
    }
    
    // Save product images
    const imageUrls = [];
    if (req.files && req.files.length > 0) {
      const fs = require('fs');
      const path = require('path');
      const uploadsDir = path.join(__dirname, 'uploads');
      
      // Ensure uploads directory exists
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }
      
      req.files.forEach((file, index) => {
        const fileName = `product-${id}-${Date.now()}-${index}-${file.originalname}`;
        const filePath = path.join(uploadsDir, fileName);
        fs.writeFileSync(filePath, file.buffer);
        imageUrls.push(`/uploads/${fileName}`);
        console.log('Saved image:', fileName);
      });
    }

    // Create or update product
    let product = await Product.findOne({ batchId: parseInt(id) });
    console.log('Existing product found:', !!product);
    
    const productData = {
      batchId: parseInt(id),
      productName,
      category,
      description: description || '',
      manufacturingDate: manufacturingDate || null,
      expiryDate: expiryDate || null,
      price: price ? parseFloat(price) : null,
      manufacturerName: manufacturerName || 'manufacturer'
    };
    
    if (imageUrls.length > 0) {
      productData.productImages = imageUrls;
    }
    
    console.log('Product data to save:', productData);
    
    if (product) {
      // Update existing product
      Object.assign(product, productData);
      if (imageUrls.length > 0) {
        product.productImages = imageUrls;
      }
    } else {
      // Create new product
      product = new Product(productData);
    }
    
    const savedProduct = await product.save();
    console.log('Product saved successfully:', savedProduct._id);

    res.json({ success: true, message: 'Product details saved successfully', product: savedProduct });
  } catch (error) {
    console.error('Error saving product:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ error: 'Failed to save product: ' + error.message });
  }
});

// Get product details
app.get('/api/batch/:id/product', async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findOne({ batchId: parseInt(id) });
    res.json(product || {});
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

// Update existing batches with farmer names (run once)
app.get('/api/update-batches', async (req, res) => {
  try {
    const result = await Batch.updateMany(
      { farmerName: { $exists: false } },
      { $set: { farmerName: 'Farmer John' } }
    );
    res.json({ message: `Updated ${result.modifiedCount} batches with farmer names` });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update batches' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});