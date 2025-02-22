import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: false,
  },
  image: {
    type: String,
    default: null,
  },
  phone: {
    type: String,
    default: null,
    sparse: true
  },
  location: {
    type: String,
    default: null,
    sparse: true
  },
  bio: {
    type: String,
    default: null,
    sparse: true
  },
  role: {
    type: String,
    enum: ['user', 'organizer', 'admin'],
    default: 'user',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
}, {
  strict: true,
  toJSON: { 
    virtuals: true,
    transform: function(doc, ret) {
      ret.phone = ret.phone || '';
      ret.location = ret.location || '';
      ret.bio = ret.bio || '';
      ret.image = ret.image || '';
      return ret;
    }
  },
  toObject: { virtuals: true }
});

// Update timestamps on save
userSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Create or update the model
const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;
