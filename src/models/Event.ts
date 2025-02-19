import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  organizer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  ticketTypes: [{
    name: String,
    price: Number,
    quantity: Number,
    quantitySold: {
      type: Number,
      default: 0,
    },
  }],
  status: {
    type: String,
    enum: ['draft', 'published', 'cancelled', 'completed'],
    default: 'draft',
  },
  category: {
    type: String,
    required: true,
    enum: [
      'Technology',
      'Music',
      'Business',
      'Fashion',
      'Food & Drink',
      'Sports',
      'Arts',
      'Education',
      'Entertainment',
      'Health'
    ]
  },
  tags: [{
    type: String,
    lowercase: true,
    trim: true
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Event || mongoose.model('Event', eventSchema);
