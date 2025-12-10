import mongoose from 'mongoose';

const packageSchema = new mongoose.Schema({
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
  duration: {
    type: Number, // in days
    required: true
  },
  itinerary: [{
    day: Number,
    title: String,
    activities: [String],
    meals: [String]
  }],
  inclusions: [{
    type: String
  }],
  exclusions: [{
    type: String
  }],
  images: [{
    type: String
  }],
  price: {
    type: Number,
    required: true
  },
  maxGroupSize: {
    type: Number,
    required: true
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Moderate', 'Challenging', 'Difficult'],
    default: 'Moderate'
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  availability: {
    type: Boolean,
    default: true
  },
  destinations: [{
    name: String,
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point'
      },
      coordinates: [Number]
    }
  }]
}, {
  timestamps: true
});

export default mongoose.model('Package', packageSchema);
