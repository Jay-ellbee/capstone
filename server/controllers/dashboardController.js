const Dashboard = require('../models/dashboardModel');

exports.getTotalRevenue = async (req, res) => {
    try {
        const result = await Dashboard.getTotalRevenue();
        res.status(200).json(result);
    } catch (err) {
        console.error('Error fetching total revenue:', err);
        res.status(500).json({ error: 'Failed to fetch total revenue' });
    }
};

exports.getTotalCustomers = async (req, res) => {
    try {
        const result = await Dashboard.getTotalCustomers();
        res.status(200).json(result);
    } catch (err) {
        console.error('Error fetching total customers:', err);
        res.status(500).json({ error: 'Failed to fetch total customers' });
    }
};  

exports.getProductAnalytics = async (req, res) => {
    try {
        const result = await Dashboard.getProductAnalytics();
        res.status(200).json(result);
    } catch (err) {
        console.error('Error fetching product analytics:', err);
        res.status(500).json({ error: 'Failed to fetch product analytics' });
    }
};

exports.getMaterialAnalytics = async (req, res) => {
    try {
        const result = await Dashboard.getMaterialAnalytics();
        res.status(200).json(result);
    } catch (err) {
        console.error('Error fetching material analytics:', err);
        res.status(500).json({ error: 'Failed to fetch material analytics' });
    }
};

exports.getArrangementAnalytics = async (req, res) => {
    try {
        const result = await Dashboard.getArrangementAnalytics();
        res.status(200).json(result);
    } catch (err) {
        console.error('Error fetching arrangement analytics:', err);
        res.status(500).json({ error: 'Failed to fetch arrangement analytics' });
    }
};

exports.getSalesAnalytics = async (req, res) => {
    try {
        const result = await Dashboard.getSalesAnalytics();
        res.status(200).json(result);
    } catch (err) {
        console.error('Error fetching sales analytics:', err);
        res.status(500).json({ error: 'Failed to fetch sales analytics' });
    }
};
