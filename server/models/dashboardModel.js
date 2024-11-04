//models/dashboardModel.js
const pool = require('../config/database');

//Function for getting total revenue for the current year
const getTotalRevenue = async () => {
    try {
        const [result] = await pool.query('SELECT SUM(price*ord_qty) AS Revenue FROM \`order\`, arrangement WHERE status = "completed"');
        return result;
    } catch (err) {
        throw new Error(`Error fetching total revenue: ${err.message}`);
    }
};

const getTotalCustomers = async () => {
    try {
        const [result] = await pool.query('SELECT COUNT(DISTINCT registered_customer_id) AS customers FROM registered_customer');
        return result;
    } catch (err) {
        throw new Error(`Error fetching total customers: ${err.message}`);
    }
};

const getProductAnalytics = async () => {
    try { 
        const [result] = await pool.query('SELECT COUNT(CASE WHEN prod_type = "flower" THEN 1 END) AS Flowers, COUNT(CASE WHEN prod_type = "filler" THEN 1 END) AS Fillers, COUNT(CASE WHEN prod_type = "leaves" THEN 1 END) AS Leaves FROM product')
        return result;  
    } catch (err) {
        throw new Error(`Error fetching product analytics: ${err.message}`);
    }
};

const getMaterialAnalytics = async () => {
    try {
        const [result] = await pool.query('SELECT COUNT(CASE WHEN material_type_id = "MT00001" THEN 1 END) AS Cellophane, COUNT(CASE WHEN material_type_id = "MT00002" THEN 1 END) AS Tissue, COUNT(CASE WHEN material_type_id = "MT00003" THEN 1 END) AS Sinamay, COUNT(CASE WHEN material_type_id = "MT00004" THEN 1 END) AS Kraft, COUNT(CASE WHEN material_type_id = "MT00005" THEN 1 END) AS Item, COUNT(CASE WHEN material_type_id = "MT00006" THEN 1 END) AS Taupe, COUNT(CASE WHEN material_type_id = "MT00007" THEN 1 END) AS Nylon, COUNT(CASE WHEN material_type_id = "MT00008" THEN 1 END) AS Fabric, COUNT(CASE WHEN material_type_id = "MT00009" THEN 1 END) AS Silk, COUNT(CASE WHEN material_type_id = "MT00010" THEN 1 END) AS Mesh FROM material')
        return result;
    } catch (err) {
        throw new Error(`Error fetching material analytics: ${err.message}`);
    }
};

const getArrangementAnalytics = async () => {
    try { 
        const [result] = await pool.query('SELECT COUNT(CASE WHEN arrangement_type_id = "AT00001" THEN 1 END) AS Bouquet, COUNT(CASE WHEN arrangement_type_id = "AT00002" THEN 1 END) AS Funeral, COUNT(CASE WHEN arrangement_type_id = "AT00003" THEN 1 END) AS Entourage, COUNT(CASE WHEN arrangement_type_id = "AT00004" THEN 1 END) AS "Bridal Bouquet", COUNT(CASE WHEN arrangement_type_id = "AT00005" THEN 1 END) AS "Funeral Basket" FROM arrangement')
        return result;  
    } catch (err) {
        throw new Error(`Error fetching arrangement analytics: ${err.message}`);
    }
};

const getSalesAnalytics = async () => {
    try {
        const [result] = await pool.query('SELECT COUNT(CASE WHEN MONTH(ord_date) = 1 AND YEAR(ord_date) = 2024 AND status = "completed" THEN 1 END) AS January, COUNT(CASE WHEN MONTH(ord_date) = 2 AND YEAR(ord_date) = 2024 AND status = "completed" THEN 1 END) AS February, COUNT(CASE WHEN MONTH(ord_date) = 3 AND YEAR(ord_date) = 2024 AND status = "completed" THEN 1 END) AS March, COUNT(CASE WHEN MONTH(ord_date) = 4 AND YEAR(ord_date) = 2024 AND status = "completed" THEN 1 END) AS April, COUNT(CASE WHEN MONTH(ord_date) = 5 AND YEAR(ord_date) = 2024 AND status = "completed" THEN 1 END) AS May, COUNT(CASE WHEN MONTH(ord_date) = 6 AND YEAR(ord_date) = 2024 AND status = "completed" THEN 1 END) AS June, COUNT(CASE WHEN MONTH(ord_date) = 7 AND YEAR(ord_date) = 2024 AND status = "completed" THEN 1 END) AS July, COUNT(CASE WHEN MONTH(ord_date) = 8 AND YEAR(ord_date) = 2024 AND status = "completed" THEN 1 END) AS August, COUNT(CASE WHEN MONTH(ord_date) = 9 AND YEAR(ord_date) = 2024 AND status = "completed" THEN 1 END) AS September, COUNT(CASE WHEN MONTH(ord_date) = 10 AND YEAR(ord_date) = 2024 AND status = "completed" THEN 1 END) AS October, COUNT(CASE WHEN MONTH(ord_date) = 11 AND YEAR(ord_date) = 2024 AND status = "completed" THEN 1 END) AS November, COUNT(CASE WHEN MONTH(ord_date) = 12 AND YEAR(ord_date) = 2024 AND status = "completed" THEN 1 END) AS December FROM \`order\`')
        return result;
    } catch (err) {
        throw new Error(`Error fetching sales analytics: ${err.message}`);
    }
};

module.exports = {
    getTotalRevenue,
    getTotalCustomers,
    getProductAnalytics,
    getMaterialAnalytics,
    getArrangementAnalytics,
    getSalesAnalytics
}