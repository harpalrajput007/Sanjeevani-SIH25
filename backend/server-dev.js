require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Import models
const User = require('./models/User');
const Herb = require('./models/Herb');
const Manufacturer = require('./models/Manufacturer');

const app = express();
const PORT = process.env.PORT || 3001;

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use('/uploads', express.static('uploads'));

// Create uploads directory
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    service: 'Herb Trace Backend (Dev Mode)'
  });
});

// User signup
app.post('/api/signup', async (req, res) => {
  try {
    const { name, email, password, userType } = req.body;
    
    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Create new user
    const user = new User({ name, email, userType });
    await user.save();

    res.json({ 
      success: true, 
      user: { id: user._id, name: user.name, email: user.email, userType: user.userType }
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Failed to create user' });
  }
});

// User signin
app.post('/api/signin', async (req, res) => {
  try {
    const { email, password, userType } = req.body;
    
    // Find user
    const user = await User.findOne({ email, userType });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    res.json({ 
      success: true, 
      user: { id: user._id, name: user.name, email: user.email, userType: user.userType }
    });
  } catch (error) {
    console.error('Signin error:', error);
    res.status(500).json({ error: 'Failed to sign in' });
  }
});

// Routes
app.post('/api/batch', upload.single('image'), async (req, res) => {
  try {
    const { herbName, quantity, geoLocation } = req.body;
    
    if (!req.file) {
      return res.status(400).json({ error: 'Image is required' });
    }

    const lastHerb = await Herb.findOne().sort({ batchId: -1 });
    const batchId = lastHerb ? lastHerb.batchId + 1 : 1;

    const herb = new Herb({
      batchId,
      herbName,
      quantity,
      imageUrl: `/uploads/${req.file.filename}`,
      geoLocation,
      statusHistory: [{
        status: 'Collected',
        timestamp: new Date()
      }]
    });

    await herb.save();

    res.json({ 
      success: true, 
      batchId: batchId,
      imageUrl: herb.imageUrl
    });
  } catch (error) {
    console.error('Error creating batch:', error);
    res.status(500).json({ error: 'Failed to create batch' });
  }
});

app.put('/api/batch/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { newStatus } = req.body;

    const herb = await Herb.findOne({ batchId: id });
    if (!herb) {
      return res.status(404).json({ error: 'Batch not found' });
    }

    herb.statusHistory.push({
      status: newStatus,
      timestamp: new Date()
    });

    await herb.save();
    res.json({ success: true });
  } catch (error) {
    console.error('Error updating status:', error);
    res.status(500).json({ error: 'Failed to update status' });
  }
});

app.get('/api/batch/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const herb = await Herb.findOne({ batchId: id });
    if (!herb) {
      return res.status(404).json({ error: 'Batch not found' });
    }

    const batch = {
      id: herb.batchId,
      herbName: herb.herbName,
      quantity: herb.quantity,
      imageUrl: herb.imageUrl,
      geoLocation: herb.geoLocation,
      collectionTimestamp: herb.collectionTimestamp,
      owner: herb.owner || 'dev-user',
      statusHistory: herb.statusHistory
    };

    res.json(batch);
  } catch (error) {
    console.error('Error fetching batch:', error);
    res.status(500).json({ error: 'Failed to fetch batch details' });
  }
});

app.get('/api/batches', async (req, res) => {
  try {
    const herbs = await Herb.find().sort({ batchId: -1 });
    
    const batchList = herbs.map(herb => ({
      id: herb.batchId,
      herbName: herb.herbName,
      quantity: herb.quantity,
      collectionTimestamp: herb.collectionTimestamp,
      currentStatus: herb.statusHistory[herb.statusHistory.length - 1].status
    }));

    res.json(batchList);
  } catch (error) {
    console.error('Error fetching batches:', error);
    res.status(500).json({ error: 'Failed to fetch batches' });
  }
});

app.get('/api/batch-count', async (req, res) => {
  try {
    const count = await Herb.countDocuments();
    res.json({ count });
  } catch (error) {
    console.error('Error fetching batch count:', error);
    res.status(500).json({ error: 'Failed to fetch batch count' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('Development mode - No blockchain connectivity');
});