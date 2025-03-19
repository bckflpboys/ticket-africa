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
  endTime: {
    type: Date,
    required: true,
  },
  location: {
    type: String,
    required: [true, 'Location is required'],
    validate: {
      validator: function(v: string) {
        try {
          const location = JSON.parse(v);
          // Validate required venue fields
          const hasRequiredVenue = location.venue && 
                 location.venue.name && 
                 location.venue.address && 
                 location.venue.city && 
                 location.venue.state && 
                 location.venue.country;
          
          // Transport fields are optional, but if present should be strings or undefined
          const hasValidTransport = !location.transport || (
            typeof location.transport === 'object' &&
            (!location.transport.directions || typeof location.transport.directions === 'string') &&
            (!location.transport.landmarks || typeof location.transport.landmarks === 'string') &&
            (!location.transport.parking || typeof location.transport.parking === 'string')
          );

          return hasRequiredVenue && hasValidTransport;
        } catch {
          return false;
        }
      },
      message: 'Invalid location format'
    }
  },
  images: {
    type: [String],
    required: true,
    validate: {
      validator: function(v: string[]) {
        return v.length > 0 && v.length <= 6;
      },
      message: 'Event must have between 1 and 6 images'
    }
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
  tags: [String],
  coolerBoxPass: {
    type: Boolean,
    default: false
  },
  coolerBoxLiters: {
    type: Number,
    min: 1,
    max: 100,
    default: 50,
    validate: {
      validator: function(this: { coolerBoxPass: boolean }, v: number): boolean {
        // Skip validation if coolerBoxPass is false, otherwise validate the range
        return !this.coolerBoxPass || (v >= 1 && v <= 100);
      },
      message: 'Cooler box capacity must be between 1 and 100 liters when cooler box pass is enabled'
    }
  },
  coolerBoxPrice: {
    type: Number,
    min: 0,
    validate: {
      validator: function(this: { coolerBoxPass: boolean }, v: number): boolean {
        // Price must be >= 0 if cooler box pass is enabled
        return !this.coolerBoxPass || v >= 0;
      },
      message: 'Cooler box entry fee must be a non-negative number when cooler box pass is enabled'
    }
  },
  restrictions: {
    ageRestriction: {
      hasAgeLimit: {
        type: Boolean,
        default: false
      },
      minimumAge: {
        type: Number,
        min: 0,
        max: 100,
        validate: {
          validator: function(this: { 'restrictions.ageRestriction.hasAgeLimit': boolean }, v: number): boolean {
            return !this['restrictions.ageRestriction.hasAgeLimit'] || (v >= 0 && v <= 100);
          },
          message: 'Minimum age must be between 0 and 100 when age restriction is enabled'
        }
      }
    },
    noWeapons: {
      type: Boolean,
      default: true
    },
    noProfessionalCameras: {
      type: Boolean,
      default: false
    },
    noPets: {
      type: Boolean,
      default: true,
      description: 'Service animals are always excepted'
    },
    hasCustomRestrictions: {
      type: Boolean,
      default: false
    },
    customRestrictions: {
      type: [String],
      validate: {
        validator: function(this: { 'restrictions.hasCustomRestrictions': boolean }, v: string[]): boolean {
          return !this['restrictions.hasCustomRestrictions'] || (Array.isArray(v) && v.every(item => item.trim().length > 0));
        },
        message: 'Custom restrictions must not be empty when enabled'
      }
    }
  },
  highlights: [{
    title: {
      type: String,
      required: [true, 'Highlight title is required'],
      trim: true
    },
    description: {
      type: String,
      trim: true
    }
  }],
  schedule: [{
    time: {
      type: String,
      required: [true, 'Schedule time is required'],
      trim: true,
      validate: {
        validator: function(v: string) {
          // Validate time format (HH:MM)
          return /^(0[1-9]|1[0-2]):[0-5][0-9]$/.test(v);
        },
        message: 'Time must be in format HH:MM (12-hour format)'
      }
    },
    period: {
      type: String,
      enum: ['AM', 'PM'],
      required: [true, 'Time period (AM/PM) is required']
    },
    title: {
      type: String,
      required: [true, 'Schedule item title is required'],
      trim: true,
      maxlength: [100, 'Title cannot be longer than 100 characters']
    },
    description: {
      type: String,
      required: [true, 'Schedule item description is required'],
      trim: true,
      maxlength: [500, 'Description cannot be longer than 500 characters']
    },
    duration: {
      type: String,
      trim: true,
      validate: {
        validator: function(v: string) {
          // Optional field, but if provided must be in format "X hours Y minutes" or "X minutes"
          if (!v) return true;
          return /^(\d+ hours? )?(\d+ minutes?)?$/.test(v.trim());
        },
        message: 'Duration must be in format "X hours Y minutes" or "X minutes"'
      }
    }
  }],
  isFeatured: {
    type: Boolean,
    default: false
  },
  currentPromotion: {
    type: {
      type: String,
      enum: ['featured', 'banner'],
      default: null
    },
    startDate: {
      type: Date,
      default: null,
      get: function(v: any) {
        return v ? new Date(v) : null;
      }
    },
    endDate: {
      type: Date,
      default: null,
      get: function(v: any) {
        return v ? new Date(v) : null;
      }
    },
    duration: {
      type: Number,
      default: 0
    }
  },
  isBanner: {
    type: Boolean,
    default: false
  },
  featuredStartDate: {
    type: Date,
    default: null,
    get: function(v: any) {
      return v ? new Date(v) : null;
    },
    set: function(v: string | Date | null) {
      return v ? new Date(v) : null;
    }
  },
  featuredEndDate: {
    type: Date,
    default: null,
    get: function(v: any) {
      return v ? new Date(v) : null;
    },
    set: function(v: string | Date | null) {
      return v ? new Date(v) : null;
    }
  },
  bannerStartDate: {
    type: Date,
    default: null,
    get: function(v: any) {
      return v ? new Date(v) : null;
    },
    set: function(v: string | Date | null) {
      return v ? new Date(v) : null;
    }
  },
  bannerEndDate: {
    type: Date,
    default: null,
    get: function(v: any) {
      return v ? new Date(v) : null;
    },
    set: function(v: string | Date | null) {
      return v ? new Date(v) : null;
    }
  },
  promotionHistory: [{
    type: {
      type: String,
      enum: ['featured', 'banner'],
      required: true
    },
    startDate: {
      type: Date,
      required: true,
      get: function(v: any) {
        return v ? new Date(v) : null;
      },
      set: function(v: string | Date) {
        return new Date(v);
      }
    },
    endDate: {
      type: Date,
      required: true,
      get: function(v: any) {
        return v ? new Date(v) : null;
      },
      set: function(v: string | Date) {
        return new Date(v);
      }
    },
    duration: {
      type: Number,
      required: true
    }
  }],
  wasFeatured: {
    type: Boolean,
    default: false
  },
  wasBanner: {
    type: Boolean,
    default: false
  },
  lastFeaturedDate: {
    type: Date,
    default: null,
    get: function(v: any) {
      return v ? new Date(v) : null;
    },
    set: function(v: string | Date | null) {
      return v ? new Date(v) : null;
    }
  },
  lastBannerDate: {
    type: Date,
    default: null,
    get: function(v: any) {
      return v ? new Date(v) : null;
    },
    set: function(v: string | Date | null) {
      return v ? new Date(v) : null;
    }
  },
  totalFeaturedDuration: {
    type: Number,
    default: 0
  },
  totalBannerDuration: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now,
    get: function(v: any) {
      return v ? new Date(v) : null;
    }
  },
  updatedAt: {
    type: Date,
    default: Date.now,
    get: function(v: any) {
      return v ? new Date(v) : null;
    }
  },
}, {
  timestamps: true,
  toJSON: { getters: true },
  toObject: { getters: true }
});

export default mongoose.models.Event || mongoose.model('Event', eventSchema);
