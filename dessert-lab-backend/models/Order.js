// models/Order.js
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  // Product Information
  productType: {
    type: String,
    required: [true, 'Product type is required'],
    enum: ['cookies', 'cupcakes', 'doughnuts']
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
    enum: ['cash', 'card', 'airtel', 'mtn']
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
  timestamps: true // Automatically adds createdAt and updatedAt fields
});

// Create indexes for better query performance
orderSchema.index({ email: 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ pickupDate: 1 });
orderSchema.index({ createdAt: -1 });

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;