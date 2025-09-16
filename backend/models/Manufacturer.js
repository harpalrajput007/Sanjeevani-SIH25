const mongoose = require('mongoose');

const manufacturerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  licenseNumber: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  phone: String,
  address: String,
  certifications: [String],
  products: [String],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Manufacturer', manufacturerSchema);