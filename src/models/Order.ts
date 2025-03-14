import mongoose from 'mongoose';
import crypto from 'crypto';

const OrderSchema = new mongoose.Schema({
  userId: {
    type: String,  // Changed back to String to match your database
    required: true
  },
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true
  },
  tickets: [{
    ticketType: String,
    quantity: Number,
    price: Number,
    ticketId: {
      type: String,
      default: () => crypto.randomBytes(8).toString('hex'),
    },
    isScanned: {
      type: Boolean,
      default: false
    },
    scannedAt: {
      type: Date,
      default: null
    },
    scannedBy: {
      type: String,
      default: null
    }
  }],
  total: {
    type: Number,
    required: true
  },
  paymentReference: {
    type: String
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending'
  },
  paymentProvider: {
    type: String,
    default: 'paystack'
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed
  }
}, {
  timestamps: true
});

export default mongoose.models.Order || mongoose.model('Order', OrderSchema);
