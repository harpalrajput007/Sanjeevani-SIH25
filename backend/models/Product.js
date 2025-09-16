const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  batchId: { type: Number, required: true },
  productName: { type: String, required: true },
  category: { type: String, required: true },
  description: String,
  manufacturingDate: Date,
  expiryDate: Date,
  price: Number,
  productImages: [String],
  manufacturerName: String,
  isPublished: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Product', productSchema);