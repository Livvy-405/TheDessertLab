// routes/contact.js - OPTIMIZED VERSION (NO PDF, FAST RESPONSE)
const express = require('express');
const Contact  = require('../models/Contact');
const { adminAuth } = require('../middleware/auth');
const router = express.Router();

// Simplified email sending (NO PDF, non-blocking)
const sendEmailsAsync = async (transporter, contact) => {
  try {
    // Admin notification email (no PDF)
    const adminEmail = {
      from: process.env.EMAIL_USER || 'onboarding@resend.dev',
      to: process.env.ADMIN_EMAIL || 'thedessertlab44@gmail.com',
      subject: `New Contact Form - ${contact.subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #dc3545;">New Contact Form Submission</h2>
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px;">
            <h3>Contact Details</h3>
            <p><strong>Name:</strong> ${contact.name}</p>
            <p><strong>Email:</strong> ${contact.email}</p>
            ${contact.phone ? `<p><strong>Phone:</strong> ${contact.phone}</p>` : ''}
            <p><strong>Subject:</strong> ${contact.subject}</p>
            <p><strong>Submitted:</strong> ${new Date(contact.createdAt).toLocaleString()}</p>
            <h4>Message:</h4>
            <div style="background-color: white; padding: 15px; border-radius: 3px; border-left: 4px solid #007bff;">
              ${contact.message.replace(/\n/g, '<br>')}
            </div>
          </div>
          <p style="color: #dc3545; font-weight: bold;">📧 Please respond promptly!</p>
        </div>
      `
    };

    // Customer auto-reply
    const customerEmail = {
      from: process.env.EMAIL_USER || 'onboarding@resend.dev',
      to: contact.email,
      subject: `Thank you for contacting The Dessert Lab - ${contact.subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #8B4513;">Thank You for Contacting Us!</h2>
          
          <p>Dear ${contact.name},</p>
          
          <p>Thank you for reaching out to The Dessert Lab! We've received your message and will get back to you within 24 hours.</p>
          
          <div style="background-color: #f9f9f9; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <h3 style="color: #8B4513;">Your Message</h3>
            <p><strong>Subject:</strong> ${contact.subject}</p>
            <p><strong>Message:</strong></p>
            <div style="background-color: white; padding: 15px; border-radius: 3px; border-left: 4px solid #8B4513;">
              ${contact.message.replace(/\n/g, '<br>')}
            </div>
          </div>
          
          <div style="background-color: #fff3cd; padding: 15px; border-radius: 5px; border-left: 4px solid #ffc107;">
            <p><strong>In the meantime:</strong></p>
            <ul>
              <li>Check out our menu and pricing on our website</li>
              <li>Remember that custom orders require 3 days advance notice</li>
              <li>All orders require a 30% deposit to secure booking</li>
            </ul>
          </div>
          
          <p>If you have an urgent inquiry, please call us directly at:</p>
          <p>📞 +260 779721358</p>
          
          <p>Thank you for choosing The Dessert Lab!</p>
          
          <hr style="margin: 30px 0;">
          <p style="color: #666; font-size: 12px;">This is an automated response. We'll reply personally within 24 hours.</p>
        </div>
      `
    };

    // Send both emails in parallel
    await Promise.all([
      transporter.sendMail(adminEmail),
      transporter.sendMail(customerEmail)
    ]);
    
    console.log('✅ Contact emails sent successfully');
  } catch (error) {
    console.error('❌ Email error:', error);
    // Don't throw - just log
  }
};

// POST /api/contact - Submit contact form (OPTIMIZED)
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Validate email format
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Validate message length
    if (message.trim().length < 10) {
      return res.status(400).json({ error: 'Message must be at least 10 characters long' });
    }

    // Create contact record
    const contactData = {
      name: name.trim(),
      email: email.toLowerCase().trim(),
      phone: phone ? phone.trim() : undefined,
      subject: subject.trim(),
      message: message.trim(),
      status: 'new'
    };

    const contact = new Contact(contactData);
    await contact.save();

    // ✅ RESPOND IMMEDIATELY
    res.status(201).json({
      message: 'Message sent successfully',
      contactId: contact._id
    });

    // Send emails asynchronously (fire and forget)
    const transporter = req.app.get('transporter');
    if (transporter) {
      sendEmailsAsync(transporter, contact).catch(err => {
        console.error('Background email error:', err);
      });
    }

  } catch (error) {
    console.error('Contact form submission error:', error);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        error: 'Validation Error', 
        details: Object.values(error.errors).map(err => err.message) 
      });
    }
    
    res.status(500).json({ error: 'Failed to send message' });
  }
});

// GET /api/contact - Get all contact messages (admin only)
router.get('/', adminAuth, async (req, res) => {
  try {
    const { 
      status, 
      page = 1, 
      limit = 10, 
      sortBy = 'createdAt', 
      sortOrder = 'desc',
      search
    } = req.query;

    const filter = {};
    if (status) filter.status = status;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { subject: { $regex: search, $options: 'i' } },
        { message: { $regex: search, $options: 'i' } }
      ];
    }

    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const contacts = await Contact.find(filter)
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .lean() // ✅ Use lean() for faster queries
      .exec();

    const total = await Contact.countDocuments(filter);

    res.json({
      contacts,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });

  } catch (error) {
    console.error('Get contacts error:', error);
    res.status(500).json({ error: 'Failed to fetch contact messages' });
  }
});

// GET /api/contact/:id - Get specific contact message
router.get('/:id', adminAuth, async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);
    
    if (!contact) {
      return res.status(404).json({ error: 'Contact message not found' });
    }

    // Mark as read if it's new
    if (contact.status === 'new') {
      contact.status = 'read';
      await contact.save();
    }

    res.json(contact);
  } catch (error) {
    console.error('Get contact error:', error);
    res.status(500).json({ error: 'Failed to fetch contact message' });
  }
});

// PATCH /api/contact/:id/status - Update contact message status
router.patch('/:id/status', adminAuth, async (req, res) => {
  try {
    const { status, adminNotes } = req.body;
    
    const validStatuses = ['new', 'read', 'replied', 'resolved'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const updateData = { status };
    if (adminNotes !== undefined) updateData.adminNotes = adminNotes;
    if (status === 'replied') updateData.replied = true;

    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    ).lean();

    if (!contact) {
      return res.status(404).json({ error: 'Contact message not found' });
    }

    res.json({ message: 'Contact status updated', contact });
  } catch (error) {
    console.error('Update contact status error:', error);
    res.status(500).json({ error: 'Failed to update contact status' });
  }
});

// DELETE /api/contact/:id - Delete contact message (admin only)
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);
    
    if (!contact) {
      return res.status(404).json({ error: 'Contact message not found' });
    }

    res.json({ message: 'Contact message deleted successfully' });
  } catch (error) {
    console.error('Delete contact error:', error);
    res.status(500).json({ error: 'Failed to delete contact message' });
  }
});

// GET /api/contact/stats/dashboard - Get contact statistics
router.get('/stats/dashboard', adminAuth, async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const [
      totalMessages,
      newMessages,
      todayMessages,
      unrepliedMessages
    ] = await Promise.all([
      Contact.countDocuments(),
      Contact.countDocuments({ status: 'new' }),
      Contact.countDocuments({ 
        createdAt: { $gte: today, $lt: tomorrow } 
      }),
      Contact.countDocuments({ replied: false })
    ]);

    res.json({
      totalMessages,
      newMessages,
      todayMessages,
      unrepliedMessages
    });

  } catch (error) {
    console.error('Contact stats error:', error);
    res.status(500).json({ error: 'Failed to fetch contact statistics' });
  }
});

module.exports = router;
