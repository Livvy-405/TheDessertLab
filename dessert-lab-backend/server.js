// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { Resend } = require('resend');
require('dotenv').config();

const app = express();

// Import routes
const orderRoutes = require('./routes/orders');
const contactRoutes = require('./routes/contact');
const authRoutes = require('./routes/auth');

// server.js - Add this AFTER your routes setup

// ========================================
// RENDER.COM KEEP-ALIVE SOLUTION
// ========================================

// Self-ping to prevent cold starts (Render free tier)
if (process.env.RENDER && process.env.NODE_ENV === 'production') {
  const RENDER_URL = process.env.RENDER_EXTERNAL_URL || `https://your-service.onrender.com`;
  
  // Ping every 14 minutes (Render spins down after 15 minutes of inactivity)
  const PING_INTERVAL = 14 * 60 * 1000; // 14 minutes in milliseconds
  
  setInterval(async () => {
    try {
      const response = await fetch(`${RENDER_URL}/api/health`);
      if (response.ok) {
        console.log('✅ Keep-alive ping successful at', new Date().toISOString());
      } else {
        console.warn('⚠️ Keep-alive ping returned status:', response.status);
      }
    } catch (error) {
      console.error('❌ Keep-alive ping failed:', error.message);
    }
  }, PING_INTERVAL);
  
  console.log('🔄 Keep-alive pings enabled (every 14 minutes)');
  console.log(`📡 Pinging: ${RENDER_URL}/api/health`);
}

// Improved health check endpoint
app.get('/api/health', async (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  
  // Light database check to keep connection warm
  if (mongoose.connection.readyState === 1) {
    try {
      await mongoose.connection.db.admin().ping();
    } catch (error) {
      console.error('Database ping failed:', error);
    }
  }
  
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    database: dbStatus,
    uptime: process.uptime()
  });
});

// Middleware
app.use(helmet());

// Improved CORS configuration for both production and development
const allowedOrigins = [
  process.env.FRONTEND_URL, // Firebase production URL
  'http://localhost:3000',
  'http://localhost:8080',
  'http://localhost:5173' // Vite default port
].filter(Boolean); // Remove undefined values

app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps, Postman, or server-to-server)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
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

// Email setup using Resend
const resend = new Resend(process.env.RESEND_API_KEY);

// Create a nodemailer-compatible transporter using Resend
const transporter = {
  sendMail: async (mailOptions) => {
    try {
      const data = await resend.emails.send({
        from: mailOptions.from || 'Dessert Lab <onboarding@resend.dev>',
        to: mailOptions.to,
        subject: mailOptions.subject,
        html: mailOptions.html,
        text: mailOptions.text
      });
      console.log('✅ Email sent successfully:', data);
      return { messageId: data.id };
    } catch (error) {
      console.error('❌ Resend email error:', error);
      throw error;
    }
  }
};

// Verify Resend configuration on startup
if (process.env.RESEND_API_KEY) {
  console.log('✅ Resend email service configured');
} else {
  console.warn('⚠️ RESEND_API_KEY not set - emails will not be sent');
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
});

module.exports = app;
