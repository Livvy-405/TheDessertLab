// routes/orders.js - UPDATED VERSION WITHOUT DOUGHNUTS
const express = require('express');
const Order = require('../models/Order');
const { auth, adminAuth } = require('../middleware/auth');
const PDFDocument = require('pdfkit');
const { Readable } = require('stream');
const router = express.Router();

// Product pricing configuration - IN KWACHA - EXACT PRICES BY FLAVOR
const PRICING = {
  cookies: {
    "Assorted Cookie Box": { 10: 100, 20: 190 },
    "Red velvet cookies": { 10: 70, 20: 130 },
    "Choco-cheesecake cookie bites": { 10: 70, 20: 130 },
    "Matcha chocolate chip cookies": { 10: 70, 20: 130 },
    "Caramelita cookies": { 10: 70, 20: 130 },
    "Crispy butter cookies": { 10: 60, 20: 110 },
    "Chocolate chip cookies": { 10: 70, 20: 130 },
    "Double chocolate cookies with hazelnuts": { 10: 70, 20: 130 },
    "Chewy oatmeal cookies": { 10: 60, 20: 110 },
    "Peanut butter cookies": { 10: 60, 20: 110 },
    "Brookies": { 10: 90, 20: 170 },
    "Oatmeal chocolate chip cookies": { 10: 70, 20: 130 },
    "Thumbprint cookies": { 10: 60, 20: 110 }
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
  // Get price based on product type, flavor, and quantity
  let basePrice = 0;
  
  if (PRICING[productType] && PRICING[productType][flavor]) {
    basePrice = PRICING[productType][flavor][quantity] || 0;
  }
  
  // If no exact match found, return error
  if (basePrice === 0) {
    console.error(`❌ No price found for: ${productType} - ${flavor} - ${quantity}`);
  }
  
  let toppingsPrice = 0;
  
  // Calculate toppings price for cupcakes only
  if (productType === 'cupcakes' && toppings && toppings.length > 0) {
    toppings.forEach(toppingName => {
      const topping = CUPCAKE_TOPPINGS.find(t => t.name === toppingName);
      if (topping) {
        // Use the appropriate price based on quantity (not multiplied)
        const price = quantity === 6 ? topping.price6 : topping.price12;
        toppingsPrice += price;
      }
    });
  }
  
  const totalPrice = basePrice + toppingsPrice;
  const depositAmount = totalPrice * 0.3; // 30% deposit
  
  return { basePrice, toppingsPrice, totalPrice, depositAmount };
};

// Helper to generate PDF for order
function generateOrderPDF(orderData) {
  const doc = new PDFDocument();
  let buffers = [];
  doc.on('data', buffers.push.bind(buffers));
  doc.on('end', () => {});

  doc.fontSize(20).text('Order Details - The Dessert Lab', { align: 'center' });
  doc.moveDown();
  doc.fontSize(12).text(`Order ID: #${orderData._id.toString().slice(-6)}`);
  doc.text(`Customer: ${orderData.customerName}`);
  doc.text(`Email: ${orderData.email}`);
  doc.text(`Phone: ${orderData.phoneNumber}`);
  doc.text(`Product: ${orderData.quantity} ${orderData.productType} - ${orderData.flavor}`);
  if (orderData.toppings.length > 0) doc.text(`Toppings: ${orderData.toppings.map(t => t.name).join(', ')}`);
  doc.text(`Pickup/Delivery Date: ${new Date(orderData.pickupDate).toLocaleDateString()}`);
  doc.text(`Method: ${orderData.deliveryMethod}`);
  if (orderData.deliveryMethod === 'delivery' && orderData.address) {
    doc.text(`Address: ${orderData.address.street}, ${orderData.address.city}, ${orderData.address.zipCode}`);
  }
  doc.text(`Payment: ${orderData.paymentMethod}`);
  doc.text(`Base Price: K${orderData.basePrice.toFixed(2)}`);
  doc.text(`Toppings Price: K${orderData.toppingsPrice.toFixed(2)}`);
  doc.text(`Total Price: K${orderData.totalPrice.toFixed(2)}`);
  doc.text(`Deposit (30%): K${orderData.depositAmount.toFixed(2)}`);
  if (orderData.customizations) doc.text(`Customizations: ${orderData.customizations}`);
  if (orderData.specialInstructions) doc.text(`Special Instructions: ${orderData.specialInstructions}`);
  doc.end();
  return new Promise(resolve => {
    doc.on('end', () => {
      const pdfBuffer = Buffer.concat(buffers);
      resolve(pdfBuffer);
    });
  });
}

// Helper function to send confirmation email
const sendConfirmationEmail = async (transporter, orderData) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: orderData.email,
    subject: `Order Confirmation - The Dessert Lab #${orderData._id.toString().slice(-6)}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #8B4513;">Order Confirmation - The Dessert Lab</h2>
        
        <p>Dear ${orderData.customerName},</p>
        
        <p>Thank you for your order! We've received your request and will contact you within 24 hours to confirm details and arrange payment.</p>
        
        <div style="background-color: #f9f9f9; padding: 20px; border-radius: 5px; margin: 20px 0;">
          <h3 style="color: #8B4513;">Order Details</h3>
          <p><strong>Order ID:</strong> #${orderData._id.toString().slice(-6)}</p>
          <p><strong>Product:</strong> ${orderData.quantity} ${orderData.productType} - ${orderData.flavor}</p>
          ${orderData.toppings.length > 0 ? `<p><strong>Toppings:</strong> ${orderData.toppings.map(t => t.name).join(', ')}</p>` : ''}
          <p><strong>Pickup/Delivery Date:</strong> ${new Date(orderData.pickupDate).toLocaleDateString()}</p>
          <p><strong>Method:</strong> ${orderData.deliveryMethod === 'pickup' ? 'Pickup' : 'Delivery'}</p>
          <p><strong>Total Amount:</strong> K${orderData.totalPrice.toFixed(2)}</p>
          <p><strong>Deposit Required:</strong> K${orderData.depositAmount.toFixed(2)} (30%)</p>
        </div>
        
        <div style="background-color: #fff3cd; padding: 15px; border-radius: 5px; border-left: 4px solid #ffc107;">
          <p><strong>Next Steps:</strong></p>
          <ul>
            <li>We'll call you at ${orderData.phoneNumber} within 24 hours</li>
            <li>30% deposit payment will be arranged during confirmation call</li>
            <li>Remaining balance due at pickup/delivery</li>
          </ul>
        </div>
        
        <p>If you have any questions, please don't hesitate to contact us at:</p>
        <p>📞 +260 779721358<br>
        📧 thedessertlab44@gmail.com</p>
        
        <p>Thank you for choosing The Dessert Lab!</p>
        
        <hr style="margin: 30px 0;">
        <p style="color: #666; font-size: 12px;">This is an automated email. Please do not reply directly to this message.</p>
      </div>
    `
  };
  
  return transporter.sendMail(mailOptions);
};

// Helper function to send admin notification
const sendAdminNotification = async (transporter, orderData) => {
  const pdfBuffer = await generateOrderPDF(orderData);
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: "thedessertlab44@gmail.com",
    subject: `New Order Received - #${orderData._id.toString().slice(-6)}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #dc3545;">New Order Alert</h2>
        
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px;">
          <h3>Order #${orderData._id.toString().slice(-6)}</h3>
          
          <h4>Customer Information:</h4>
          <p><strong>Name:</strong> ${orderData.customerName}</p>
          <p><strong>Email:</strong> ${orderData.email}</p>
          <p><strong>Phone:</strong> ${orderData.phoneNumber}</p>
          
          <h4>Order Details:</h4>
          <p><strong>Product:</strong> ${orderData.quantity} ${orderData.productType}</p>
          <p><strong>Flavor:</strong> ${orderData.flavor}</p>
          ${orderData.toppings.length > 0 ? `<p><strong>Toppings:</strong> ${orderData.toppings.map(t => t.name).join(', ')}</p>` : ''}
          <p><strong>Date:</strong> ${new Date(orderData.pickupDate).toLocaleDateString()}</p>
          <p><strong>Method:</strong> ${orderData.deliveryMethod}</p>
          <p><strong>Payment:</strong> ${orderData.paymentMethod}</p>
          
          ${orderData.deliveryMethod === 'delivery' ? `
          <h4>Delivery Address:</h4>
          <p>${orderData.address.street}<br>
          ${orderData.address.city}, ${orderData.address.zipCode}</p>
          ` : ''}
          
          <h4>Pricing:</h4>
          <p><strong>Base Price:</strong> K${orderData.basePrice.toFixed(2)}</p>
          <p><strong>Toppings:</strong> K${orderData.toppingsPrice.toFixed(2)}</p>
          <p><strong>Total:</strong> K${orderData.totalPrice.toFixed(2)}</p>
          <p><strong>Deposit (30%):</strong> K${orderData.depositAmount.toFixed(2)}</p>
          
          ${orderData.customizations ? `<p><strong>Customizations:</strong> ${orderData.customizations}</p>` : ''}
          ${orderData.specialInstructions ? `<p><strong>Special Instructions:</strong> ${orderData.specialInstructions}</p>` : ''}
        </div>
        
        <p style="color: #dc3545; font-weight: bold;">⚠️ Contact customer within 24 hours to confirm order and arrange deposit payment!</p>
      </div>
    `,
    attachments: [
      {
        filename: `Order-${orderData._id.toString().slice(-6)}.pdf`,
        content: pdfBuffer
      }
    ]
  };
  
  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Admin email sent:', info.messageId);
    return info;
  } catch (err) {
    console.error('❌ Error sending admin email:', err);
    throw err;
  }
};

// POST /api/orders - Create a new order
router.post('/', async (req, res) => {
  try {
    console.log('🔥 Received order request');

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
      zipCode,
      specialInstructions,
      paymentMethod,
      depositAgreement
    } = req.body;

    // Validate required fields
    if (!productType || !flavor || !quantity || !customerName || !phoneNumber || !email || !pickupDate || !deliveryMethod || !paymentMethod || !depositAgreement) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Validate pickup date (at least 3 days from today)
    const minDate = new Date();
    minDate.setDate(minDate.getDate() + 3);
    if (new Date(pickupDate) < minDate) {
      return res.status(400).json({ error: 'Pickup date must be at least 3 days from today' });
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

    console.log('💰 Pricing calculated:', { basePrice, toppingsPrice, totalPrice, depositAmount });

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
      pickupDate: new Date(pickupDate),
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

    console.log('💾 Saving order to database...');

    // Save order to database
    const order = new Order(orderData);
    await order.save();

    console.log('✅ Order saved:', order._id);

    // Send confirmation emails
    const transporter = req.app.get('transporter');
    
    if (!transporter) {
      console.error('❌ Email transporter not configured');
      return res.status(201).json({
        message: 'Order submitted (email notification failed)',
        orderId: order._id,
        orderNumber: order._id.toString().slice(-6)
      });
    }

    try {
      console.log('📧 Sending confirmation emails...');
      await sendConfirmationEmail(transporter, order);
      console.log('✅ Customer email sent');
      
      await sendAdminNotification(transporter, order);
      console.log('✅ Admin email sent');
    } catch (emailError) {
      console.error('❌ Email sending failed:', emailError);
      // Don't fail the request if email fails
    }

    res.status(201).json({
      message: 'Order submitted successfully',
      orderId: order._id,
      orderNumber: order._id.toString().slice(-6)
    });

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
    const order = await Order.findById(req.params.id);
    
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
    );

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
    );

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
