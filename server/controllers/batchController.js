const Batch = require('../models/batchModel');

exports.readAllBatches = async (req, res) => {
    try {
        const batches = await Batch.readAllBatches();
        res.status(200).json(batches);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.readBatch = async (req, res) => {
    try {
        const batchId = req.params.id;  
        const batch = await Batch.readBatch(batchId);
        res.status(200).json(batch);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createBatch = async (req, res) => {
    try {
        console.log("Received payload:", req.body); // Log the payload
        const batch = await Batch.createBatch(req.body);
        res.status(201).json(batch);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

exports.deleteBatch = async (req, res) => {
    try {
        const batchId = req.params.id;  
        const batch = await Batch.deleteBatch(batchId);
        res.status(200).json(batch);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateBatchProducts = async (req, res) => {
    const { batchId } = req.params;
    const { products } = req.body;
    console.log(`Updating batch ${batchId} with products:`, products);

    if (!products || !Array.isArray(products)) {
        return res.status(400).json({ error: "Invalid product data format." });
    }

    try {
        const result = await Batch.updateBatchProducts(batchId, products);
        res.status(200).json(result);
    } catch (error) {
        console.error(`Error updating batch products: ${error.message}`);
        res.status(500).json({ error: error.message });
    }
};