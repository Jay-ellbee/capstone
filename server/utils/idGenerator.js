// utils/idGenerator.js
const pool = require('../config/database');

// Function to generate a custom ID based on table name and prefix
const generateCustomId = async (tableName, prefix) => {
    try {
        const [rows] = await pool.query(`SELECT COUNT(*) AS count FROM ${tableName}`);
        const newId = `${prefix}${String(rows[0].count + 1).padStart(5, '0')}`;
        return newId;
    } catch (error) {
        throw new Error(`Error generating custom ID: ${error.message}`);
    }
};

module.exports = { generateCustomId };
