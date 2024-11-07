const pool = require('../config/database');
const { generateCustomId } = require('../utils/idGenerator');

const getRequests = async () => {
    console.log("Checking database connection...");
    if (pool) {
      console.log("Database connection is active.");
    } else {
      console.log("Database connection is NOT active.");
      return [];
    }
  
    try {
      const [rows] = await pool.query('SELECT * FROM request');
      console.log("Rows returned:", rows);  // Log data returned by the query
      return rows;
    } catch(err) {
      console.error("Error fetching requests:", err);  // Log any errors
      throw new Error(`Error fetching requests: ${err.message}`);
    }
  };

const createRequest = async (requestData) => {

    try {
        const {customer_name, email, phone, req_msg} = requestData;
        const id = await generateCustomId('request', 'REQ');

        const [result] = await pool.query('INSERT INTO request (request_id, customer_name, email, phone, req_msg, sent_at) VALUES (?, ?, ?, ?, ?, NOW())', [id, customer_name, email, phone, req_msg]);

        return result;
    }
    catch(err) {
        throw new Error(`Error creating request: ${err.message}`);
    }
};

module.exports = {
    getRequests,
    createRequest,
    
}