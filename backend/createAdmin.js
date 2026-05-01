const bcrypt = require('bcrypt');
const pool = require('./db');

const createAdminUsers = async () => {
  try {
    // Admin user details with your specific emails and passwords
    const adminUsers = [
      {
        email: 'admin1@stallion.com',
        password: 'Rehman_123',
        first_name: 'Admin',
        last_name: 'One'
      },
      {
        email: 'admin2@stallion.com',
        password: 'AliHaider_123',
        first_name: 'Admin',
        last_name: 'Two'
      },
      {
        email: 'admin3@stallion.com',
        password: 'Saadat_123',
        first_name: 'Admin',
        last_name: 'Three'
      }
    ];

    for (const admin of adminUsers) {
      // Hash the password
      const password_hash = await bcrypt.hash(admin.password, 10);

      // Check if admin already exists
      const existingAdmin = await pool.query(
        'SELECT * FROM Users WHERE email = $1',
        [admin.email]
      );

      if (existingAdmin.rows.length === 0) {
        // Insert new admin user
        await pool.query(
          `INSERT INTO Users (
            email, 
            password_hash, 
            first_name, 
            last_name, 
            is_admin
          ) VALUES ($1, $2, $3, $4, $5)`,
          [
            admin.email,
            password_hash,
            admin.first_name,
            admin.last_name,
            true
          ]
        );
        console.log(`Admin user created: ${admin.email}`);
      } else {
        // Update existing admin user
        await pool.query(
          `UPDATE Users 
           SET password_hash = $1, is_admin = true 
           WHERE email = $2`,
          [password_hash, admin.email]
        );
        console.log(`Admin user updated: ${admin.email}`);
      }
    }

    console.log('Admin users creation/update completed');
  } catch (error) {
    console.error('Error creating/updating admin users:', error);
  } finally {
    await pool.end();
  }
};

// Run the function
createAdminUsers();