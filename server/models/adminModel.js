//models/adminModel.js
const pool = require('../config/database.js');

// Function to find a super admin by email
const findSuperAdmin = async () => {
  try {
    const [rows] = await pool.query('SELECT * FROM admin WHERE email = ?', ['superadmin@example.com']);
    return rows[0];
  } catch (error) {
    console.error('Error finding super admin:', error.message);
    throw error;
  }
};
  
  // Function to create a super admin
  const createSuperAdmin = async () => {
    const superAdminData = {
      admin_id: 'SA0001', // Use a static ID for the super admin or generate one
      user_fname: 'Super',
      user_lname: 'Admin',
      email: 'superadmin@example.com',
      password: bcrypt.hashSync('superadminpassword', 10), // Hash the password with bcrypt
      role: 'super_admin'
    };
  
    try {
      const [result] = await pool.query(
        'INSERT INTO admin (admin_id, user_fname, user_lname, email, password, role) VALUES (?, ?, ?, ?, ?, ?)',
        [
          superAdminData.admin_id,
          superAdminData.user_fname,
          superAdminData.user_lname,
          superAdminData.email,
          superAdminData.password,
          superAdminData.role
        ]
      );
      return result;
    } catch (error) {
      console.error('Error creating super admin:', error.message);
      throw error;
    }
  };


// Find admin by email (for login)
const findAdminByEmail = async (email) => {
  try {
    const [rows] = await pool.query('SELECT * FROM admin WHERE email = ?', [email]);
    return rows[0];
  } catch (error) {
    console.error('Error finding admin by email:', error.message);
    throw error;
  }
};

// Create a new admin (for signup)
const createAdmin = async (adminData) => {
  const { admin_id, user_fname, user_lname, email, password, role } = adminData;

  try {
    const [result] = await pool.query(
      'INSERT INTO admin (admin_id, user_fname, user_lname, email, password, role) VALUES (?, ?, ?, ?, ?, ?)',
      [admin_id, user_fname, user_lname, email, password, role]
    );
    return result;
  } catch (error) {
    console.error('Error creating admin:', error.message);
    throw error;
  }
};

// Count total number of admins (for generating new admin_id)
const countAdmins = async () => {
  try {
    const [result] = await pool.query('SELECT COUNT(*) AS count FROM admin');
    return result[0].count;
  } catch (error) {
    console.error('Error counting admins:', error.message);
    throw error;
  }
};

const getCustomers = async () => {
  try {
    const [rows] = await pool.query('SELECT registered_customer_id, CONCAT(user_fname, " ", user_lname) AS customer_name, address, phone, email FROM registered_customer');
    return rows;
  } catch (error) {
    console.error('Error fetching customers:', error.message);
    throw error;
  }
};

module.exports = {
  findAdminByEmail,
  createAdmin,
  countAdmins,
  findSuperAdmin,
  createSuperAdmin,
  getCustomers
};

