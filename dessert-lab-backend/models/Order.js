// models/Order.js - UPDATED WITH MUFFINS SUPPORT
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const orderSchema = new mongoose.Schema({
  // Product Information
  productType: {
    type: String,
    required: [true, 'Product type is required'],
    enum: ['cookies', 'cupcakes', 'doughnuts', 'muffins']
  },
  flavor: {
    type: String,
    required: [true, 'Flavor is required']
  },
  quantity: {
    type: Number,
    required: [true, 'Quantity is required'],
    min: [1, 'Quantity must be at least 1']
  },
  toppings: [{
    name: String,
    price: Number
  }],
  customizations: {
    type: String,
    default: ''
  },

  // Customer Information
  customerName: {
    type: String,
    required: [true, 'Customer name is required'],
    trim: true
  },
  phoneNumber: {
    type: String,
    required: [true, 'Phone number is required'],
    match: [/^\+260\d{9}$/, 'Phone number must be in format +260XXXXXXXXX']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    lowercase: true,
    trim: true,
    match: [/^[\w.+\-]+@gmail\.com$/, 'Only @gmail.com emails are allowed']
  },

  // Order Details
  pickupDate: {
    type: Date,
    required: [true, 'Pickup/delivery date is required']
  },
  deliveryMethod: {
    type: String,
    required: [true, 'Delivery method is required'],
    enum: ['pickup', 'delivery']
  },
  address: {
    street: String,
    city: String
  },
  specialInstructions: {
    type: String,
    default: ''
  },

  // Payment Information
  paymentMethod: {
    type: String,
    required: [true, 'Payment method is required'],
    enum: ['mobile_money', 'bank_transfer', 'cash']
  },
  depositAgreement: {
    type: Boolean,
    required: [true, 'Deposit agreement is required'],
    validate: {
      validator: function(v) {
        return v === true;
      },
      message: 'Deposit agreement must be accepted'
    }
  },

  // Pricing
  basePrice: {
    type: Number,
    required: true,
    min: 0
  },
  toppingsPrice: {
    type: Number,
    default: 0,
    min: 0
  },
  totalPrice: {
    type: Number,
    required: true,
    min: 0
  },
  depositAmount: {
    type: Number,
    required: true,
    min: 0
  },
  depositPaid: {
    type: Boolean,
    default: false
  },
  depositPaidDate: {
    type: Date
  },

  // Order Status
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'in_progress', 'ready', 'completed', 'cancelled'],
    default: 'pending'
  },
  adminNotes: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

// Create indexes for better query performance
orderSchema.index({ email: 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ pickupDate: 1 });
orderSchema.index({ createdAt: -1 });

// User Schema for authentication
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true,
    lowercase: true,
    minlength: [3, 'Username must be at least 3 characters long']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters long']
  },
  role: {
    type: String,
    enum: ['admin', 'staff'],
    default: 'staff'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Generate JWT token
userSchema.methods.generateToken = function() {
  return jwt.sign(
    { 
      id: this._id, 
      username: this.username, 
      role: this.role 
    },
    process.env.JWT_SECRET || 'your_jwt_secret_key',
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  );
};

const Order = mongoose.model('Order', orderSchema);
const User = mongoose.model('User', userSchema);

module.exports = Order;
module.exports.User = User;
