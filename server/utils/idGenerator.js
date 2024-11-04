const pool = require('../config/database'); // Ensure this points to the correct database config

const generateCustomId = async (tableName, prefix, counter = 0) => {
    try {
        if (!tableName || !prefix) {
            throw new Error('Table name and prefix are required');
        }

        const idColumn = `${tableName}_id`;
        const query = `SELECT MAX(CAST(SUBSTRING(${idColumn}, LENGTH(?) + 1) AS UNSIGNED)) AS maxId FROM ??;`;
        const [rows] = await pool.query(query, [prefix, tableName]);

        const nextIdNumber = (rows[0].maxId || 0) + 1 + counter; // Increment based on counter if provided
        const newId = `${prefix}${String(nextIdNumber).padStart(5, '0')}`;
        return newId;
    } catch (error) {
        throw new Error(`Error generating custom ID: ${error.message}`);
    }
};


module.exports = { generateCustomId };
