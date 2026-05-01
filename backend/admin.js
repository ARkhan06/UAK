const mongoose = require('mongoose');
const User = require('./models/User');
const dotenv = require('dotenv');

dotenv.config();

async function addAdminUsers() {
  try {
    // Connect to MongoDB with timeout options
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/stallions', {
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 10000,
    });
    
    console.log('✅ MongoDB Connected');

    // Check if admins already exist
    const adminCount = await User.countDocuments({ role: 'admin' });
    
    if (adminCount >= 3) {
      console.log('✓ 3 admin users already exist');
      await mongoose.connection.close();
      return;
    }

    // Admin users to create
    const admins = [
      {
        firstname: 'Usman Azam',
        lastname: 'Khan',
        email: 'usman@uaktransport.com',
        password: 'Usman@786',
        role: 'admin'
      },
      {
        firstname: 'Abdul Rehman',
        lastname: 'Khan',
        email: 'ark@uaktransport.com',
        password: 'Arkhan@786',
        role: 'admin'
      },
      {
        firstname: 'Yaseen',
        lastname: 'Khan',
        email: 'yaseen@uaktransport.com',
        password: 'Yaseen@786',
        role: 'admin'
      }
    ];

    // Insert admins
    const result = await User.insertMany(admins, { ordered: false });
    
    console.log(`\n✓ Added ${result.length} admin users successfully`);
    console.log('\n📋 Admin Credentials:');
    console.log('================================');
    admins.forEach((admin, index) => {
      console.log(`${index + 1}. Email: ${admin.email}`);
      console.log(`   Password: ${admin.password}\n`);
    });

    await mongoose.connection.close();
    console.log('✅ Connection closed');

  } catch (error) {
    if (error.code === 11000) {
      console.log('⚠️  Some admin users already exist (duplicate email)');
      await mongoose.connection.close();
    } else if (error.message.includes('ECONNREFUSED')) {
      console.error('❌ MongoDB Connection Error:');
      console.error('   Make sure MongoDB is running!');
      console.error('   Windows: Press Win+R, type "services.msc", search for MongoDB and start it');
      console.error('   Or run: mongod');
    } else {
      console.error('❌ Error adding admin users:', error.message);
    }
    process.exit(1);
  }
}

addAdminUsers();  