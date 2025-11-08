// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();

// Import routes
const orderRoutes = require('./routes/orders');
const contactRoutes = require('./routes/contact');
const authRoutes = require('./routes/auth');

// Middleware
app.use(helmet());

// Improved CORS configuration for both production and development
const allowedOrigins = [
  'https://thedessertlab-48733.web.app',
  'https://thedessertlab-48733.web.app/',
  'https://thedessertlab-48733.firebaseapp.com',
  'https://thedessertlab-48733.firebaseapp.com/',
  'http://localhost:3000',
  'http://localhost:8080',
  'http://localhost:5173'
].filter(Boolean);

app.use(cors({
  origin: function(origin, callback) {
    console.log('📨 Request from origin:', origin);
    
    // Allow requests with no origin (like mobile apps, Postman, or server-to-server)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      console.log('✅ Origin allowed:', origin);
      callback(null, true);
    } else {
      console.log('❌ Origin blocked:', origin);
      console.log('📋 Allowed origins:', allowedOrigins);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use(limiter);

// Stricter rate limiting for order and contact forms
const formLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // limit each IP to 5 form submissions per hour
  message: 'Too many form submissions, please try again later.'
});

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/dessert_lab', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ Connected to MongoDB'))
.catch((error) => console.error('❌ MongoDB connection error:', error));

// Email setup using Gmail SMTP with explicit port for Render compatibility
   const transporter = nodemailer.createTransport({
     host: 'smtp.gmail.com',
     port: 587, // Use port 587 (TLS) instead of 465 (SSL) - required for Render
     secure: false, // true for 465, false for other ports
     auth: {
       user: process.env.GMAIL_USER || 'thedessertlab44@gmail.com',
       pass: process.env.GMAIL_APP_PASSWORD
     },
     tls: {
       rejectUnauthorized: false // Accept self-signed certificates
     }
   });

// Verify Gmail configuration on startup
if (process.env.GMAIL_APP_PASSWORD) {
  transporter.verify(function(error, success) {
    if (error) {
      console.error('❌ Gmail SMTP configuration error:', error);
    } else {
      console.log('✅ Gmail SMTP is ready to send emails');
    }
  });
} else {
  console.warn('⚠️ GMAIL_APP_PASSWORD not set - emails will not be sent');
}

// Make transporter available to routes
app.set('transporter', transporter);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development'
  });
});

// Routes
app.use('/api/orders', formLimiter, orderRoutes);
app.use('/api/contact', formLimiter, contactRoutes);
app.use('/api/auth', authRoutes);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Global error handler
app.use((error, req, res, next) => {
  console.error('Global error handler:', error);
  
  if (error.name === 'ValidationError') {
    return res.status(400).json({
      error: 'Validation Error',
      details: Object.values(error.errors).map(err => err.message)
    });
  }
  
  if (error.name === 'CastError') {
    return res.status(400).json({
      error: 'Invalid ID format'
    });
  }
  
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'production' ? 'Something went wrong' : error.message
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Allowed origins: ${allowedOrigins.join(', ')}`);
  console.log(`📧 Email service: Gmail SMTP (${process.env.GMAIL_USER || 'thedessertlab44@gmail.com'})`);
});

module.exports = app;
