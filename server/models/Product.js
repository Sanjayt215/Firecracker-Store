const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  category: {
    type: String,
    required: true,
    enum: ['Day Crackers', 'Night Crackers', 'Accessories', 'Display Boxes'],
    trim: true
  },
  stock: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  productImageURLs: {
    type: [String],
    required: true,
    validate: {
      validator: function(v) {
        return v.length > 0;
      },
      message: 'At least one product image is required'
    }
  },
  safetyWarningText: {
    type: String,
    required: true,
    default: '⚠️ SAFETY WARNING: Use firecrackers safely. Keep away from children. Use in open spaces only. Read instructions carefully. Not responsible for misuse.'
  },
  demoVideoURL: {
    type: String,
    default: 'https://www.youtube.com/embed/example'
  },
  featured: {
    type: Boolean,
    default: false
  },
  bestSeller: {
    type: Boolean,
    default: false
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  numReviews: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Product', productSchema);



