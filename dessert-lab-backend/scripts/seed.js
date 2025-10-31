// scripts/seed.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import models
const { Order, Contact, User } = require('../models/Order');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/dessert_lab');
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

const seedUsers = async () => {
  try {
    // Check if admin user already exists
    const existingAdmin = await User.findOne({ role: 'admin' });
    
    if (!existingAdmin) {
      // Create default admin user
      const adminUser = new User({
        username: 'admin',
        email: 'admin@dessertlab.com',
        password: 'admin123', // This will be hashed by the pre-save middleware
        role: 'admin'
      });
      
      await adminUser.save();
      console.log('✅ Default admin user created');
      console.log('   Username: admin');
      console.log('   Email: admin@dessertlab.com');
      console.log('   Password: admin123');
      console.log('   ⚠️  Please change the password after first login!');
    } else {
      console.log('ℹ️  Admin user already exists');
    }

    // Create a staff user for testing
    const existingStaff = await User.findOne({ username: 'staff' });
    if (!existingStaff) {
      const staffUser = new User({
        username: 'staff',
        email: 'staff@dessertlab.com',
        password: 'staff123',
        role: 'staff'
      });
      
      await staffUser.save();
      console.log('✅ Default staff user created');
      console.log('   Username: staff');
      console.log('   Email: staff@dessertlab.com');
      console.log('   Password: staff123');
    } else {
      console.log('ℹ️  Staff user already exists');
    }

  } catch (error) {
    console.error('❌ Error seeding users:', error);
  }
};

const seedSampleData = async () => {
  try {
    // Seed sample orders
    const orderCount = await Order.countDocuments();
    if (orderCount === 0) {
      const sampleOrders = [
        {
          productType: 'cupcakes',
          flavor: 'Red velvet',
          quantity: 12,
          toppings: [
            { name: 'Fresh berries', price: 2.50 },
            { name: 'Premium sprinkles', price: 1.00 }
          ],
          customizations: 'Please add happy birthday message',
          customerName: 'Sarah Johnson',
          phoneNumber: '+260 777123456',
          email: 'sarah.johnson@email.com',
          pickupDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000), // 4 days from now
          deliveryMethod: 'pickup',
          paymentMethod: 'card',
          depositAgreement: true,
          basePrice: 12,
          toppingsPrice: 42, // (2.50 + 1.00) * 12
          totalPrice: 54,
          depositAmount: 16.2,
          status: 'pending'
        },
        {
          productType: 'cookies',
          flavor: 'Chocolate chip cookies',
          quantity: 20,
          toppings: [],
          customerName: 'Michael Brown',
          phoneNumber: '+260 779987654',
          email: 'michael.brown@email.com',
          pickupDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
          deliveryMethod: 'delivery',
          address: {
            street: '123 Kabulonga Road',
            city: 'Lusaka',
            zipCode: '10101'
          },
          paymentMethod: 'cash',
          depositAgreement: true,
          basePrice: 18,
          toppingsPrice: 0,
          totalPrice: 18,
          depositAmount: 5.4,
          status: 'confirmed',
          depositPaid: true,
          depositPaidDate: new Date()
        },
        {
          productType: 'doughnuts',
          flavor: 'Glazed doughnuts',
          quantity: 6,
          toppings: [
            { name: 'Chocolate shavings', price: 1.50 }
          ],
          customerName: 'Emily Davis',
          phoneNumber: '+260 776555444',
          email: 'emily.davis@email.com',
          pickupDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
          deliveryMethod: 'pickup',
          paymentMethod: 'venmo',
          depositAgreement: true,
          basePrice: 6,
          toppingsPrice: 9, // 1.50 * 6
          totalPrice: 15,
          depositAmount: 4.5,
          status: 'in_progress'
        }
      ];

      await Order.insertMany(sampleOrders);
      console.log('✅ Sample orders created');
    } else {
      console.log('ℹ️  Orders already exist in database');
    }

    // Seed sample contact messages
    const contactCount = await Contact.countDocuments();
    if (contactCount === 0) {
      const sampleContacts = [
        {
          name: 'Alice Wilson',
          email: 'alice.wilson@email.com',
          phone: '+260 778111222',
          subject: 'Wedding cake inquiry',
          message: 'Hi! I\'m planning my wedding for next month and would love to discuss custom cake options. Could you please send me your wedding cake portfolio and pricing information?',
          status: 'new'
        },
        {
          name: 'David Thompson',
          email: 'david.thompson@email.com',
          subject: 'Dietary restrictions',
          message: 'Do you offer gluten-free and sugar-free options? I have celiac disease and diabetes, but I\'d love to try your products. What alternatives do you have available?',
          status: 'read'
        },
        {
          name: 'Lisa Martinez',
          email: 'lisa.martinez@email.com',
          phone: '+260 779333555',
          subject: 'Bulk order for office event',
          message: 'We\'re organizing a company event for 50 people and would like to place a large order for mixed cookies and cupcakes. What would be the best pricing for bulk orders?',
          status: 'replied',
          replied: true
        }
      ];

      await Contact.insertMany(sampleContacts);
      console.log('✅ Sample contact messages created');
    } else {
      console.log('ℹ️  Contact messages already exist in database');
    }

  } catch (error) {
    console.error('❌ Error seeding sample data:', error);
  }
};

const clearDatabase = async () => {
  try {
    await Order.deleteMany({});
    await Contact.deleteMany({});
    await User.deleteMany({});
    console.log('✅ Database cleared');
  } catch (error) {
    console.error('❌ Error clearing database:', error);
  }
};

const main = async () => {
  await connectDB();

  const args = process.argv.slice(2);
  
  if (args.includes('--clear')) {
    console.log('🗑️  Clearing database...');
    await clearDatabase();
  }

  if (args.includes('--users-only')) {
    console.log('👥 Seeding users only...');
    await seedUsers();
  } else {
    console.log('🌱 Seeding database...');
    await seedUsers();
    await seedSampleData();
  }

  console.log('✅ Seeding completed!');
  console.log('\n📋 Summary:');
  console.log(`   👥 Users: ${await User.countDocuments()}`);
  console.log(`   📦 Orders: ${await Order.countDocuments()}`);
  console.log(`   📧 Contacts: ${await Contact.countDocuments()}`);
  
  console.log('\n🔐 Default Login Credentials:');
  console.log('   Admin - Username: admin, Password: admin123');
  console.log('   Staff - Username: staff, Password: staff123');
  console.log('\n⚠️  Please change default passwords in production!');

  mongoose.connection.close();
};

// Handle command line arguments
if (require.main === module) {
  main().catch(error => {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  });
}

module.exports = { seedUsers, seedSampleData, clearDatabase };
