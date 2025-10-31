# The Dessert Lab - Backend API

A comprehensive backend API for The Dessert Lab baking website, built with Node.js, Express, and MongoDB.

## 🚀 Features

- **Order Management**: Complete order processing with email notifications
- **Contact Forms**: Handle customer inquiries with automated responses
- **User Authentication**: JWT-based auth with role-based access control
- **Email Integration**: Automated confirmation and notification emails
- **Rate Limiting**: Protection against spam and abuse
- **Admin Dashboard**: Full CRUD operations for orders and contacts
- **Data Validation**: Comprehensive input validation and sanitization

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- Gmail account for email notifications

## ⚡ Quick Start

### 1. Clone and Install

```bash
git clone <repository-url>
cd dessert-lab-backend
npm install
```

### 2. Environment Setup

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
# Required
MONGODB_URI=mongodb://localhost:27017/dessert_lab
JWT_SECRET=your_super_secure_jwt_secret
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASSWORD=your_gmail_app_password
ADMIN_EMAIL=admin@dessertlab.com

# Optional
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

### 3. Database Setup

```bash
# Seed database with default users and sample data
npm run seed

# Or just create default users
npm run seed -- --users-only

# Clear database (use with caution)
npm run seed -- --clear
```

### 4. Start the Server

```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

Server will be running at `http://localhost:5000`

## 📧 Email Configuration

### Gmail Setup

1. Enable 2-Factor Authentication on your Gmail account
2. Generate an App Password:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate password for "Mail"
3. Use the app password in `EMAIL_PASSWORD`

### Other Email Providers

Modify the transporter configuration in `server.js`:

```javascript
const transporter = nodemailer.createTransporter({
  host: 'your-smtp-host.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});
```

## 🗄️ Database Models

### Order Schema

```javascript
{
  productType: String,      // 'cookies', 'cupcakes', 'doughnuts'
  flavor: String,
  quantity: Number,
  toppings: [{ name: String, price: Number }],
  customerName: String,
  email: String,
  phoneNumber: String,
  pickupDate: Date,
  deliveryMethod: String,   // 'pickup', 'delivery'
  address: { street, city, zipCode },
  paymentMethod: String,
  status: String,          // 'pending', 'confirmed', 'in_progress', 'ready', 'completed', 'cancelled'
  totalPrice: Number,
  depositAmount: Number,
  depositPaid: Boolean,
  // ... more fields
}
```

### Contact Schema

```javascript
{
  name: String,
  email: String,
  phone: String,
  subject: String,
  message: String,
  status: String,          // 'new', 'read', 'replied', 'resolved'
  replied: Boolean,
  adminNotes: String,
  createdAt: Date
}
```

### User Schema

```javascript
{
  username: String,
  email: String,
  password: String,        // Hashed with bcrypt
  role: String,           // 'admin', 'staff'
  isActive: Boolean,
  lastLogin: Date,
  createdAt: Date
}
```

## 🛣️ API Endpoints

### Public Endpoints

```
POST   /api/orders          - Submit new order
POST   /api/contact         - Submit contact form
POST   /api/auth/login      - User login
GET    /api/health          - Health check
```

### Protected Endpoints (Staff/Admin)

```
GET    /api/auth/me         - Get current user info
PUT    /api/auth/profile    - Update user profile
POST   /api/auth/logout     - Logout
```

### Admin Only Endpoints

#### Orders
```
GET    /api/orders                    - Get all orders
GET    /api/orders/:id               - Get specific order
PATCH  /api/orders/:id/status        - Update order status
PATCH  /api/orders/:id/deposit       - Mark deposit as paid
GET    /api/orders/stats/dashboard   - Get order statistics
```

#### Contacts
```
GET    /api/contact                  - Get all contact messages
GET    /api/contact/:id             - Get specific contact
PATCH  /api/contact/:id/status      - Update contact status
DELETE /api/contact/:id             - Delete contact message
GET    /api/contact/stats/dashboard - Get contact statistics
```

#### User Management
```
POST   /api/auth/register           - Create new user
GET    /api/auth/users             - Get all users
PATCH  /api/auth/users/:id/toggle  - Toggle user active status
PATCH  /api/auth/users/:id/role    - Change user role
DELETE /api/auth/users/:id         - Delete user
```

## 🔒 Authentication

The API uses JWT tokens for authentication. Include the token in the Authorization header:

```
Authorization: Bearer your_jwt_token_here
```

### Default Users

After running the seed script:

- **Admin**: username: `admin`, password: `admin123`
- **Staff**: username: `staff`, password: `staff123`

⚠️ **Change these passwords in production!**

## 📝 Usage Examples

### Submit an Order

```javascript
const orderData = {
  productType: 'cupcakes',
  flavor: 'Red velvet',
  quantity: 12,
  toppings: ['Fresh berries', 'Premium sprinkles'],
  customerName: 'John Doe',
  phoneNumber: '+260 777123456',
  email: 'john@example.com',
  pickupDate: '2025-08-20',
  deliveryMethod: 'pickup',
  paymentMethod: 'card',
  depositAgreement: true
};

const response = await fetch('/api/orders', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(orderData)
});
```

### Login and Get Orders (Admin)

```javascript
// Login
const loginResponse = await fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ username: 'admin', password: 'admin123' })
});

const { token } = await loginResponse.json();

// Get orders
const ordersResponse = await fetch('/api/orders', {
  headers: { 'Authorization': `Bearer ${token}` }
});

const orders = await ordersResponse.json();
```

## 🎨 Frontend Integration

Update your React components to use the backend:

### OrderPage.tsx

```javascript
const onSubmit = async (data) => {
  try {
    const response = await fetch('http://localhost:5000/api/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    if (response.ok) {
      const result = await response.json();
      toast.success("Order submitted successfully!");
      setIsSubmitted(true);
    } else {
      const error = await response.json();
      toast.error(error.error || "Failed to submit order");
    }
  } catch (error) {
    toast.error("Network error. Please try again.");
  }
};
```

### ContactPage.tsx

```javascript
const handleSubmit = async (e) => {
  e.preventDefault();
  
  try {
    const response = await fetch('http://localhost:5000/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    });

    if (response.ok) {
      toast.success("Message sent successfully!");
      setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
    } else {
      const error = await response.json();
      toast.error(error.error || "Failed to send message");
    }
  } catch (error) {
    toast.error("Network error. Please try again.");
  }
};
```

## 🚀 Deployment

### Environment Variables for Production

```env
NODE_ENV=production
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/dessert_lab
JWT_SECRET=very_secure_production_secret
EMAIL_USER=notifications@yourdomain.com
EMAIL_PASSWORD=your_production_email_password
ADMIN_EMAIL=admin@yourdomain.com
FRONTEND_URL=https://yourdomain.com
```

### Heroku Deployment

1. Create Heroku app: `heroku create dessert-lab-api`
2. Set environment variables: `heroku config:set JWT_SECRET=your_secret`
3. Deploy: `git push heroku main`

### Railway Deployment

1. Connect your GitHub repository
2. Add environment variables in the dashboard
3. Railway will automatically deploy

### Vercel Deployment

1. Install Vercel CLI: `npm i -g vercel`
2. Deploy: `vercel`
3. Set environment variables in the dashboard

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch
```

## 📊 Monitoring

The API includes health check endpoint:

```
GET /api/health
```

Response:
```json
{
  "status": "OK",
  "timestamp": "2025-08-15T10:30:00.000Z",
  "version": "1.0.0"
}
```

## 🔧 Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Check MongoDB URI
   - Ensure MongoDB is running
   - Check firewall settings

2. **Email Not Sending**
   - Verify Gmail app password
   - Check email configuration
   - Ensure 2FA is enabled

3. **CORS Errors**
   - Update `FRONTEND_URL` in environment
   - Check CORS configuration in server.js

4. **Authentication Issues**
   - Verify JWT secret is set
   - Check token expiration
   - Ensure user is active

### Logs

Enable detailed logging by setting:
```env
LOG_LEVEL=debug
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if needed
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details.

## 📞 Support

For support, please contact:
- Email: thedessertlab44@gmail.com
- Phone: +260 779721358
