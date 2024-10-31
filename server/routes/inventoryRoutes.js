// routes/inventoryRoutes.js
const express = require('express');
const { check } = require('express-validator');
const router = express.Router();
const inventoryController = require('../controllers/inventoryController');
const { verifyToken, verifyAdmin } = require('../middlewares/authMiddleware');

console.log(inventoryController);

// Get all inventory items (accessible by admin)
router.get('/inventory/', inventoryController.getAllInventory);

// Get all products
router.get('/inventory/products', inventoryController.getAllProducts);

//Delete a product
router.delete('/inventory/products/:id', inventoryController.deleteProduct);

//Delete a product by batch ID
router.delete('/inventory/products-batch/:id', inventoryController.deleteProductByBatch);

//Add a product
router.post(
    '/inventory/add-product-with-batch',
    [
        // Batch validations
        check('batch.stock_qty')
            .isInt({ min: 0 })
            .withMessage('Stock quantity must be a non-negative integer'),
        check('batch.shelf_life')
            .isISO8601()
            .withMessage('Invalid shelf life format'),

        // Product validations
        check('product.prod_name')
            .notEmpty()
            .withMessage('Product name is required')
            .isString()
            .withMessage('Invalid value'),
        check('product.prod_type')
            .notEmpty()
            .withMessage('Product type is required')
            .isString()
            .withMessage('Invalid value'),
        check('product.price_per_qty')
            .isFloat({ min: 0 })
            .withMessage('Price per quantity must be a non-negative number'),
        check('product.variant_name')
            .notEmpty()
            .withMessage('Variant name is required')
            .isString()
            .withMessage('Invalid value'),
        check('product.var_color')
            .notEmpty()
            .withMessage('Variant color is required')
            .isString()
            .withMessage('Invalid value')

    ],
    inventoryController.addProductWithBatch
);

//Get all materials
router.get('/inventory/materials', inventoryController.getAllMaterials);
//Delete all materials
router.delete('/inventory/materials/:id', inventoryController.deleteMaterial);
//Add a material
router.post(
    '/inventory/add-material',
    [
        // Material validations
        check('material.mat_name')
            .notEmpty()
            .withMessage('Material name is required')
            .isString()
            .withMessage('Invalid value'),
        check('material.material_type_id')
            .notEmpty()
            .withMessage('Material type is required')
            .isString()
            .withMessage('Invalid value'),
        check('material.color')
            .notEmpty()
            .withMessage('Material color is required')
            .isString()
            .withMessage('Invalid value'),
        check('material.stock_qty')
            .isInt({ min: 0 })
            .withMessage('Stock quantity must be a non-negative integer'),
    ],
    inventoryController.addMaterial
)


//Get all arrangements
router.get('/inventory/arrangements', inventoryController.getAllArrangements)
// Delete an arrangement
router.delete('/inventory/arrangements/:id', inventoryController.deleteArrangement);


// Get a single inventory item by ID (accessible by admin)
router.get('/inventory/arrangements/:id', inventoryController.getArrangementById);

// Get a single inventory item by ID (accessible by admin)
router.get('/inventory/:id', inventoryController.getInventoryById);

// Create a new inventory item (accessible by admin) with validation
// router.post(
//     '/inventory/',
//     [
//         check('batch_date').isISO8601().withMessage('Invalid batch date format'),
//         check('stock_qty').isInt({ min: 0 }).withMessage('Stock quantity must be a non-negative integer'),
//         check('shelf_life').isISO8601().withMessage('Invalid shelf life format')
//     ],
//     inventoryController.createInventory
// );

// Update an existing inventory item (accessible by admin) with validation
router.put(
    '/inventory/:id',
    [
        check('batch_date').optional().isISO8601().withMessage('Invalid batch date format'),
        check('stock_qty').optional().isInt({ min: 0 }).withMessage('Stock quantity must be a non-negative integer'),
        check('shelf_life').optional().isISO8601().withMessage('Invalid shelf life format')
    ],
    inventoryController.updateInventory
);

// Delete an inventory item (accessible by admin)
router.delete('/inventory/:id', inventoryController.deleteInventory);

module.exports = router;