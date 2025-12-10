import mongoose from 'mongoose';

const hotelSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  region: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true
    }
  },
  images: [{
    type: String
  }],
  amenities: [{
    type: String
  }],
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  pricePerNight: {
    type: Number,
    required: true
  },
  rooms: [{
    type: {
      type: String,
      required: true
    },
    capacity: {
      type: Number,
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    available: {
      type: Number,
      required: true
    }
  }],
  availability: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Create a 2dsphere index for geospatial queries
hotelSchema.index({ location: '2dsphere' });

export default mongoose.model('Hotel', hotelSchema);
