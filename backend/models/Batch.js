const mongoose = require('mongoose');

const batchSchema = new mongoose.Schema({
  batchId: {
    type: String,
    required: true,
    unique: true
  },
  herbName: {
    type: String,
    required: true
  },
  quantity: {
    type: String,
    required: true
  },
  geoLocation: {
    type: String,
    required: true
  },
  ipfsImageHash: {
    type: String,
    required: true
  },
  owner: {
    type: String,
    default: 'farmer'
  },
  farmerName: {
    type: String,
    required: true
  },
  currentStatus: {
    type: String,
    default: 'Collected'
  },
  collectionTimestamp: {
    type: Date,
    default: Date.now
  },
  statusHistory: [{
    status: String,
    timestamp: Date,
    updatedBy: String
  }]
});

module.exports = mongoose.model('Batch', batchSchema);