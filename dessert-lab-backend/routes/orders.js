// routes/orders.js - OPTIMIZED VERSION (with date-only parsing + timezone-safe formatting)
const express = require('express');
const Order = require('../models/Order');
const { auth, adminAuth } = require('../middleware/auth');
const router = express.Router();

// Product pricing configuration - IN KWACHA - EXACT PRICES BY FLAVOR
const PRICING = {
  cookies: {
    "Assorted Cookie Box": { 10: 180, 20: 350 },
    "Red velvet cookies": { 10: 150, 20: 290 },
    "Choco-cheesecake cookie bites": { 10: 150, 20: 290 },
    "Matcha chocolate chip cookies": { 10: 150, 20: 290 },
    "Caramelita cookies": { 10: 150, 20: 290 },
    "Crispy butter cookies": { 10: 130, 20: 250 },
    "Chocolate chip cookies": { 10: 150, 20: 290 },
    "Double chocolate cookies with hazelnuts": { 10: 150, 20: 290 },
    "Chewy oatmeal cookies": { 10: 150, 20: 290 },
    "Peanut butter cookies": { 10: 130, 20: 250 },
    "Brookies": { 10: 150, 20: 290 },
    "Oatmeal chocolate chip cookies": { 10: 150, 20: 290 },
    "Thumbprint cookies": { 10: 130, 20: 250 }
  },
  cupcakes: {
    "Assorted Cupcake Box": { 6: 180, 12: 350 },
    "Black forest cupcakes": { 6: 150, 12: 290 },
    "Dark chocolate blackberry": { 6: 150, 12: 290 },
    "Classic vanilla": { 6: 130, 12: 250 },
    "Red velvet": { 6: 150, 12: 290 },
    "Lemon": { 6: 130, 12: 250 },
    "Banana cream cheese": { 6: 150, 12: 290 },
    "Salted caramel chocolate": { 6: 150, 12: 290 },
    "Boston cream cupcake": { 6: 130, 12: 250 },
    "Matcha milkshake cupcakes": { 6: 150, 12: 290 }
  }
};

// Updated cupcake toppings with new pricing structure
const CUPCAKE_TOPPINGS = [
  { name: "Fresh berries", price6: 20, price12: 40 },
  { name: "Premium sprinkles", price6: 10, price12: 20 },
  { name: "Edible flowers", price6: 30, price12: 60 },
  { name: "Specialty glazes", price6: 10, price12: 20 },
  { name: "Chocolates", price6: 20, price12: 40 },
  { name: "Custom edible print", price6: 30, price12: 60 }
];

// Helper function to calculate pricing
const calculateOrderPricing = (productType, quantity, toppings = [], flavor = '') => {
  let basePrice = 0;
  
  if (PRICING[productType] && PRICING[productType][flavor]) {
    basePrice = PRICING[productType][flavor][quantity] || 0;
  }
  
  if (basePrice === 0) {
    console.error(`❌ No price found for: ${productType} - ${flavor} - ${quantity}`);
  }
  
  let toppingsPrice = 0;
  
  if (productType === 'cupcakes' && toppings && toppings.length > 0) {
    toppings.forEach(toppingName => {
      const topping = CUPCAKE_TOPPINGS.find(t => t.name === toppingName);
      if (topping) {
        const price = quantity === 6 ? topping.price6 : topping.price12;
        toppingsPrice += price;
      }
    });
  }
  
  const totalPrice = basePrice + toppingsPrice;
  const depositAmount = totalPrice * 0.3;
  
  return { basePrice, toppingsPrice, totalPrice, depositAmount };
};

// Simplified email sending (NO PDF, non-blocking)
// NOTE: uses timezone-safe formatting when showing pickup dates
const sendEmailsAsync = async (transporter, order) => {
  try {
    const formatPickupDate = (d) => {
      // ensure we have a Date object
      const dateObj = d instanceof Date ? d : new Date(d);
      // explicit timezone to avoid server timezone shifts
      return dateObj.toLocaleDateString('en-GB', { timeZone: 'Africa/Lusaka' });
    };

    // Customer confirmation email
    const customerEmail = {
      from: process.env.EMAIL_USER || 'onboarding@resend.dev',
      to: order.email,
      subject: `Order Confirmation - The Dessert Lab #${order._id.toString().slice(-6)}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #8B4513;">Order Confirmation - The Dessert Lab</h2>
          
          <p>Dear ${order.customerName},</p>
          
          <p>Thank you for your order! We've received your request and will contact you within 24 hours.</p>
          
          <div style="background-color: #f9f9f9; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <h3 style="color: #8B4513;">Order Details</h3>
            <p><strong>Order ID:</strong> #${order._id.toString().slice(-6)}</p>
            <p><strong>Product:</strong> ${order.quantity} ${order.productType} - ${order.flavor}</p>
            ${order.toppings && order.toppings.length > 0 ? `<p><strong>Toppings:</strong> ${order.toppings.map(t => t.name).join(', ')}</p>` : ''}
            <p><strong>Pickup/Delivery Date:</strong> ${formatPickupDate(order.pickupDate)}</p>
            <p><strong>Method:</strong> ${order.deliveryMethod === 'pickup' ? 'Pickup' : 'Delivery'}</p>
            <p><strong>Total Amount:</strong> K${order.totalPrice.toFixed(2)}</p>
            <p><strong>Deposit Required:</strong> K${order.depositAmount.toFixed(2)} (30%)</p>
          </div>
          
          <div style="background-color: #fff3cd; padding: 15px; border-radius: 5px; border-left: 4px solid #ffc107;">
            <p><strong>Next Steps:</strong></p>
            <ul>
              <li>We'll call you at ${order.phoneNumber} within 24 hours</li>
              <li>30% deposit payment will be arranged during confirmation call</li>
              <li>Remaining balance due at pickup/delivery</li>
            </ul>
          </div>
          
          <p>If you have any questions, please contact us at:</p>
          <p>📞 +260 779721358<br>
          📧 thedessertlab44@gmail.com</p>
          
          <p>Thank you for choosing The Dessert Lab!</p>
        </div>
      `
    };

    // Admin notification email (simplified, no PDF)
    const adminEmail = {
      from: process.env.EMAIL_USER || 'onboarding@resend.dev',
      to: process.env.ADMIN_EMAIL || 'thedessertlab44@gmail.com',
      subject: `🔔 New Order - #${order._id.toString().slice(-6)}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #dc3545;">🔔 New Order Alert</h2>
          
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px;">
            <h3>Order #${order._id.toString().slice(-6)}</h3>
            
            <h4>Customer Information:</h4>
            <p><strong>Name:</strong> ${order.customerName}</p>
            <p><strong>Email:</strong> ${order.email}</p>
            <p><strong>Phone:</strong> ${order.phoneNumber}</p>
            
            <h4>Order Details:</h4>
            <p><strong>Product:</strong> ${order.quantity} ${order.productType}</p>
            <p><strong>Flavor:</strong> ${order.flavor}</p>
            ${order.toppings && order.toppings.length > 0 ? `<p><strong>Toppings:</strong> ${order.toppings.map(t => t.name).join(', ')}</p>` : ''}
            <p><strong>Date:</strong> ${formatPickupDate(order.pickupDate)}</p>
            <p><strong>Method:</strong> ${order.deliveryMethod}</p>
            <p><strong>Payment:</strong> ${order.paymentMethod}</p>
            
            ${order.deliveryMethod === 'delivery' && order.address ? `
            <h4>Delivery Address:</h4>
            <p>${order.address.street || ''}<br>
            ${order.address.city || ''}</p>
            ` : ''}
            
            <h4>Pricing:</h4>
            <p><strong>Base Price:</strong> K${order.basePrice.toFixed(2)}</p>
            <p><strong>Toppings:</strong> K${order.toppingsPrice.toFixed(2)}</p>
            <p><strong>Total:</strong> K${order.totalPrice.toFixed(2)}</p>
            <p><strong>Deposit (30%):</strong> K${order.depositAmount.toFixed(2)}</p>
            
            ${order.customizations ? `<p><strong>Customizations:</strong> ${order.customizations}</p>` : ''}
            ${order.specialInstructions ? `<p><strong>Special Instructions:</strong> ${order.specialInstructions}</p>` : ''}
          </div>
          
          <p style="color: #dc3545; font-weight: bold;">⚠️ Contact customer within 24 hours!</p>
        </div>
      `
    };

    // Send emails in parallel (don't wait for them)
    await Promise.all([
      transporter.sendMail(customerEmail),
      transporter.sendMail(adminEmail)
    ]);
    
    console.log('✅ Emails sent successfully');
  } catch (error) {
    console.error('❌ Email error:', error);
    // Don't throw - just log the error
  }
};

// Utility: parse a date-only string 'YYYY-MM-DD' into a local Date at midnight
const parseDateOnly = (input) => {
  if (!input) return null;
  if (input instanceof Date) return new Date(input.getFullYear(), input.getMonth(), input.getDate());
  // Accept strings like 'YYYY-MM-DD' (common from HTML date inputs)
  if (typeof input === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(input)) {
    const [year, month, day] = input.split('-').map(Number);
    return new Date(year, month - 1, day); // local midnight for that date
  }
  // Fallback - construct Date and normalize to local date
  const d = new Date(input);
  if (isNaN(d.getTime())) return null;
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
};

// POST /api/orders - Create a new order (OPTIMIZED)
router.post('/', async (req, res) => {
  try {
    const {
      productType,
      flavor,
      quantity,
      toppings = [],
      customizations,
      customerName,
      phoneNumber,
      email,
      pickupDate,
      deliveryMethod,
      address,
      city,
      specialInstructions,
      paymentMethod,
      depositAgreement
    } = req.body;

    // Validate required fields
    if (!productType || !flavor || !quantity || !customerName || !phoneNumber || 
        !email || !pickupDate || !deliveryMethod || !paymentMethod || !depositAgreement) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Parse pickup date into local date-only (midnight local)
    const pickupDateParsed = parseDateOnly(pickupDate);
    if (!pickupDateParsed) {
      return res.status(400).json({ error: 'Invalid pickup date format' });
    }

    // Validate pickup date (at least 2 days from today) - compare local midnights
    const now = new Date();
    const minDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 2); // local midnight + 2 days
    if (pickupDateParsed < minDate) {
      return res.status(400).json({ error: 'Pickup date must be at least 2 days from today' });
    }

    // Calculate pricing
    const { basePrice, toppingsPrice, totalPrice, depositAmount } = calculateOrderPricing(
      productType, 
      parseInt(quantity), 
      toppings,
      flavor
    );

    if (basePrice === 0) {
      return res.status(400).json({ error: 'Invalid product type or quantity' });
    }

    // Process toppings with prices (only for cupcakes)
    const processedToppings = [];
    if (productType === 'cupcakes' && toppings.length > 0) {
      toppings.forEach(toppingName => {
        const topping = CUPCAKE_TOPPINGS.find(t => t.name === toppingName);
        if (topping) {
          const price = parseInt(quantity) === 6 ? topping.price6 : topping.price12;
          processedToppings.push({ name: topping.name, price });
        }
      });
    }

    // Create order object
    const orderData = {
      productType,
      flavor,
      quantity: parseInt(quantity),
      toppings: processedToppings,
      customizations,
      customerName,
      phoneNumber,
      email: email.toLowerCase(),
      pickupDate: pickupDateParsed, // store normalized local date
      deliveryMethod,
      specialInstructions,
      paymentMethod,
      depositAgreement,
      basePrice,
      toppingsPrice,
      totalPrice,
      depositAmount,
      status: 'pending'
    };

    // Add address if delivery method
    if (deliveryMethod === 'delivery') {
      if (!address || !city) {
        return res.status(400).json({ error: 'Delivery address is required for delivery orders' });
      }
      orderData.address = { street: address, city };
    }

    // Save order to database
    const order = new Order(orderData);
    await order.save();

    // ✅ RESPOND IMMEDIATELY - Don't wait for emails
    res.status(201).json({
      message: 'Order submitted successfully',
      orderId: order._id,
      orderNumber: order._id.toString().slice(-6)
    });

    // Send emails asynchronously (fire and forget)
    const transporter = req.app.get('transporter');
    if (transporter) {
      sendEmailsAsync(transporter, order).catch(err => {
        console.error('Background email error:', err);
      });
    }

  } catch (error) {
    console.error('❌ Order creation error:', error);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        error: 'Validation Error', 
        details: Object.values(error.errors).map(err => err.message) 
      });
    }
    
    res.status(500).json({ error: 'Failed to create order', message: error.message });
  }
});

// GET /api/orders - Get all orders (admin only)
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
        { customerName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phoneNumber: { $regex: search, $options: 'i' } }
      ];
    }

    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const orders = await Order.find(filter)
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .lean() // ✅ Use lean() for faster queries
      .exec();

    const total = await Order.countDocuments(filter);

    res.json({
      orders,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });

  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// GET /api/orders/:id - Get specific order
router.get('/:id', adminAuth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).lean();
    
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json(order);
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ error: 'Failed to fetch order' });
  }
});

// PATCH /api/orders/:id/status - Update order status
router.patch('/:id/status', adminAuth, async (req, res) => {
  try {
    const { status, adminNotes } = req.body;
    
    const validStatuses = ['pending', 'confirmed', 'in_progress', 'ready', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { 
        status, 
        adminNotes,
        updatedAt: new Date()
      },
      { new: true }
    ).lean();

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json({ message: 'Order status updated', order });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ error: 'Failed to update order status' });
  }
});

// PATCH /api/orders/:id/deposit - Mark deposit as paid
router.patch('/:id/deposit', adminAuth, async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { 
        depositPaid: true,
        depositPaidDate: new Date(),
        status: 'confirmed',
        updatedAt: new Date()
      },
      { new: true }
    ).lean();

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json({ message: 'Deposit marked as paid', order });
  } catch (error) {
    console.error('Update deposit status error:', error);
    res.status(500).json({ error: 'Failed to update deposit status' });
  }
});

// GET /api/orders/stats/dashboard - Get dashboard statistics
router.get('/stats/dashboard', adminAuth, async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const [
      totalOrders,
      pendingOrders,
      todayOrders,
      totalRevenue,
      depositsPending
    ] = await Promise.all([
      Order.countDocuments(),
      Order.countDocuments({ status: 'pending' }),
      Order.countDocuments({ 
        createdAt: { $gte: today, $lt: tomorrow } 
      }),
      Order.aggregate([
        { $group: { _id: null, total: { $sum: '$totalPrice' } } }
      ]),
      Order.countDocuments({ depositPaid: false, status: { $ne: 'cancelled' } })
    ]);

    res.json({
      totalOrders,
      pendingOrders,
      todayOrders,
      totalRevenue: totalRevenue[0]?.total || 0,
      depositsPending
    });

  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard statistics' });
  }
});

module.exports = router;
