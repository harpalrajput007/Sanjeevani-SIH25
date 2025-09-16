const mongoose = require('mongoose');

const herbSchema = new mongoose.Schema({
  batchId: { type: Number, required: true, unique: true },
  herbName: { type: String, required: true },
  quantity: { type: String, required: true },
  imageUrl: String,
  geoLocation: String,
  collectionTimestamp: { type: Date, default: Date.now },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  farmerName: { type: String, default: 'Unknown Farmer' },
  farmerEmail: String,
  statusHistory: [{
    status: String,
    timestamp: { type: Date, default: Date.now },
    updatedBy: String
  }],
  certifications: [{
    name: String,
    fileUrl: String,
    uploadedAt: { type: Date, default: Date.now },
    uploadedBy: String
  }]
});

module.exports = mongoose.model('Herb', herbSchema);