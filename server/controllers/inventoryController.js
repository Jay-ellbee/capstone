// controllers/inventoryController.js
const Inventory = require('../models/inventoryModel');
const { validationResult } = require('express-validator');

// Get all inventory items (batch records)
exports.getAllInventory = async (req, res) => {
    try {
        const results = await Inventory.getAllInventory();
        res.status(200).json(results);
    } catch (err) {
        console.error('Error fetching inventory:', err);
        res.status(500).json({ error: 'Failed to fetch inventory' });
    }
};

// Get all products items (batch records)
exports.getAllProducts = async (req, res) => {
    try {
        const results = await Inventory.getAllProducts();
        res.status(200).json(results);
    } catch (err) {
        console.error('Error fetching products:', err);
        res.status(500).json({ error: 'Failed to fetch products' });
    }
};

// Delete an product item (batch record)
exports.deleteProduct = async (req, res) => {
    const productId = req.params.id;

    try {
        const result = await Inventory.deleteProduct(productId);
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Inventory item not found' });
        res.status(200).json({ message: 'Product item deleted successfully' });
    } catch (err) {
        console.error('Error deleting product item:', err);
        res.status(500).json({ error: 'Failed to delete product item' });
    }
};
// Delete an product item by batch ID(batch record)
exports.deleteProductByBatch = async (req, res) => {
    const batchId = req.params.id;

    try {
        const result = await Inventory.deleteProductByBatch(batchId);
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Inventory item not found' });
        res.status(200).json({ message: 'Product item deleted successfully' });
    } catch (err) {
        console.error('Error deleting product item:', err);
        res.status(500).json({ error: 'Failed to delete product item' });
    }
};

//Get all materials items
exports.getAllMaterials = async (req, res) => {
    try {
        const results = await Inventory.getAllMaterials();
        res.status(200).json(results);
    } catch (err) {
        console.error('Error fetching materials:', err)
        res.status(500).json({ error: 'Failed to fetch materials'});
    }
};

// Delete a material item by material ID
exports.deleteMaterial = async (req, res) => {
    const materialId = req.params.id;

    try {
        const result = await Inventory.deleteMaterial(materialId);
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Material item not found' });
        res.status(200).json({ message: 'Material item deleted successfully' });
    } catch (err) {
        console.error('Error deleting Material item:', err);
        res.status(500).json({ error: 'Failed to delete Material item' });
    }
};

//Add a material item
exports.addMaterial = async (req, res) => {
    // Validate request body
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { material } = req.body;

    try {
        // Insert batch first and retrieve the new batch ID
        const mat_id = await Inventory.insertMaterial(material);

        // Check if batch_id is valid before proceeding
        if (!mat_id) {
            throw new Error('Failed to create batch');
        }

        res.status(201).json({
            message: 'Material added successfully',
            material: mat_id,
        });
    } catch (err) {
        console.error('Error creating material:', err);
        res.status(500).json({ error: 'Failed to create material' });
    }
};
//Get all arrangements items
exports.getAllArrangements = async (req,res) => {
    try {
        const results = await Inventory.getAllArrangements();
        res.status(200).json(results);
    } catch (err) {
        console.error('Error fetching materials:', err)
        res.status(500).json({error: 'Failed to fetch arrangements'});
    }
};

//Delete an arrangement item by arrangement ID
exports.deleteArrangement = async (req, res) => {
    const arrangementId = req.params.id;

    try {
        const result = await Inventory.deleteArrangement(arrangementId);
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Arrangement item not found' });
        res.status(200).json({ message: 'Arrangement item deleted successfully' });
    } catch (err) {
        console.error('Error deleting Arrangement item:', err);
        res.status(500).json({ error: 'Failed to delete arrangement item' });
    }
}

// Get a single arrangement item (batch record) by ID
exports.getArrangementById = async (req, res) => {
    const arrangementId = req.params.id;
    try {
        const result = await Inventory.getArrangementById(arrangementId);
        if (!result) return res.status(404).json({ error: 'Arrangement item not found' });
        res.status(200).json(result);
    } catch (err) {
        console.error('Error fetching arrangement item:', err);
        res.status(500).json({ error: 'Failed to fetch arrangement item' });
    }
};

// Get a single inventory item (batch record) by ID
exports.getInventoryById = async (req, res) => {
    const inventoryId = req.params.id;
    try {
        const result = await Inventory.getInventoryById(inventoryId);
        if (!result) return res.status(404).json({ error: 'Inventory item not found' });
        res.status(200).json(result);
    } catch (err) {
        console.error('Error fetching inventory item:', err);
        res.status(500).json({ error: 'Failed to fetch inventory item' });
    }
};

// Create a new inventory item (batch record)
exports.addProductWithBatch = async (req, res) => {
    // Validate request body
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { product, batch } = req.body;

    try {
        // Insert batch first and retrieve the new batch ID
        const batch_id = await Inventory.insertBatch(batch);

        // Check if batch_id is valid before proceeding
        if (!batch_id) {
            throw new Error('Failed to create batch');
        }

        // Insert product with the new batch ID
        const newProduct = await Inventory.insertProduct({ ...product, batch_id });

        res.status(201).json({
            message: 'Product and batch added successfully',
            product: newProduct,
            batch_id: batch_id,
        });
    } catch (err) {
        console.error('Error creating product and batch:', err);
        res.status(500).json({ error: 'Failed to create product and batch' });
    }
};

// Update an existing inventory item (batch record)
exports.updateInventory = async (req, res) => {
    const inventoryId = req.params.id;
    const { batch_date, stock_qty, shelf_life } = req.body;

    try {
        const result = await Inventory.updateInventory(inventoryId, { batch_date, stock_qty, shelf_life });
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Inventory item not found' });
        res.status(200).json({ message: 'Inventory item updated successfully' });
    } catch (err) {
        console.error('Error updating inventory item:', err);
        res.status(500).json({ error: 'Failed to update inventory item' });
    }
};

// Delete an inventory item (batch record)
exports.deleteInventory = async (req, res) => {
    const inventoryId = req.params.id;

    try {
        const result = await Inventory.deleteInventory(inventoryId);
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Inventory item not found' });
        res.status(200).json({ message: 'Inventory item deleted successfully' });
    } catch (err) {
        console.error('Error deleting inventory item:', err);
        res.status(500).json({ error: 'Failed to delete inventory item' });
    }
};



