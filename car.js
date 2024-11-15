const mongoose = require('mongoose');

const carSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  images: {
    type: [String],  // An array of image URLs
    required: true,
  },
  tags: {
    type: [String],  // Tags like "SUV", "Toyota", etc.
  },
});

const Car = mongoose.model('Car', carSchema);

module.exports = Car;
