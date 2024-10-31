// controllers/transactionController.js
const Transaction = require('../models/transactionModel');
const { validationResult } = require('express-validator');

// Get all transactions
exports.getAllTransactions = async (req, res) => {
    try {
        const results = await Transaction.getAllTransactions();
        res.status(200).json(results);
    } catch (err) {
        console.error('Error fetching transactions:', err);
        res.status(500).json({ error: 'Failed to fetch transactions' });
    }
};

// Get a single transaction by ID
exports.getTransactionById = async (req, res) => {
    const transactionId = req.params.id;
    try {
        const result = await Transaction.getTransactionById(transactionId);
        if (!result) {
            return res.status(404).json({ error: 'Transaction not found' });
        }
        res.status(200).json(result);
    } catch (err) {
        console.error('Error fetching transaction:', err);
        res.status(500).json({ error: 'Failed to fetch transaction' });
    }
};

// Create a new transaction
exports.createTransaction = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { date, reference_id, registered_customer_id, rec_name, address } = req.body;
    const newTransaction = { date, reference_id, registered_customer_id, rec_name, address };

    try {
        const result = await Transaction.createTransaction(newTransaction);
        res.status(201).json(result);
    } catch (err) {
        console.error('Error creating transaction:', err);
        res.status(500).json({ error: 'Failed to create transaction' });
    }
};

// Update an existing transaction
exports.updateTransaction = async (req, res) => {
    const transactionId = req.params.id;
    const { rec_name, address } = req.body;

    try {
        const result = await Transaction.updateTransaction(transactionId, { rec_name, address });
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Transaction not found' });
        }
        res.status(200).json({ message: 'Transaction updated successfully' });
    } catch (err) {
        console.error('Error updating transaction:', err);
        res.status(500).json({ error: 'Failed to update transaction' });
    }
};

// Delete a transaction
exports.deleteTransaction = async (req, res) => {
    const transactionId = req.params.id;

    try {
        const result = await Transaction.deleteTransaction(transactionId);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Transaction not found' });
        }
        res.status(200).json({ message: 'Transaction deleted successfully' });
    } catch (err) {
        console.error('Error deleting transaction:', err);
        res.status(500).json({ error: 'Failed to delete transaction' });
    }
};

exports.getCurrentMonthSales = async (req, res) => {
    try {
        const results = await Transaction.getCurrentMonthSales();
        res.status(200).json(results);
    } catch (err) {
        console.error('Error fetching transactions:', err);
        res.status(500).json({ error: 'Failed to fetch transactions' });
    }
};

exports.getCurrentWeekSales = async (req, res) => {
    try {
        const results = await Transaction.getCurrentWeekSales();
        res.status(200).json(results);
    } catch (err) {
        console.error('Error fetching transactions:', err);
        res.status(500).json({ error: 'Failed to fetch transactions' });
    }
};
