// models/Contact.js
const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    lowercase: true,
    trim: true,
    match: [/^[\w.+\-]+@gmail\.com$/, 'Only @gmail.com emails are allowed']
  },
  phone: {
    type: String,
    trim: true,
    match: [/^\+260\d{9}$/, 'Phone number must be in format +260XXXXXXXXX']
  },
  subject: {
    type: String,
    required: [true, 'Subject is required'],
    trim: true
  },
  message: {
    type: String,
    required: [true, 'Message is required'],
    trim: true,
    minlength: [10, 'Message must be at least 10 characters long']
  },
  status: {
    type: String,
    enum: ['new', 'read', 'replied', 'resolved'],
    default: 'new'
  },
  replied: {
    type: Boolean,
    default: false
  },
  adminNotes: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

// Create indexes
contactSchema.index({ email: 1 });
contactSchema.index({ status: 1 });
contactSchema.index({ createdAt: -1 });

const Contact = mongoose.model('Contact', contactSchema);

module.exports = Contact;