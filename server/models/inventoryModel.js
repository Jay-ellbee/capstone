// models/inventoryModel.js
const pool = require('../config/database');
const { generateCustomId } = require('../utils/idGenerator');

//Get all inventory items
const getAllInventory = async () => {
    try {
      const [results] = await pool.query('SELECT * FROM batch');
      return results;
    } catch (err) {
      throw new Error(`Error fetching inventory: ${err.message}`);
    }
  };
  
// Get all of the products via batch ID
const getAllProducts = async () => {
  try {
    const [results] = await pool.query(`
      SELECT product_id, prod_name, variant_name, var_color, prod_type FROM product
    `);
    return results;
  } catch (err) {
    throw new Error(`Error fetching products: ${err.message}`);
  }
};

// Delete a single product item
const deleteProduct = async (productId) => {
  try {
    const [result] = await pool.query('DELETE FROM product WHERE product_id = ?', [productId]);
    return result;
  } catch (err) {
    throw new Error(`Error deleting inventory item with ID ${productId}: ${err.message}`);
  }
};

// Delete a single product item
const deleteProductByBatch = async (batchId) => {
  try {
    const [result] = await pool.query('DELETE FROM product WHERE batch_id = ?', [batchId]);
    return result;
  } catch (err) {
    throw new Error(`Error deleting inventory item with ID ${batchId}: ${err.message}`);
  }
};

// Create a new inventory item
const insertBatch = async (batch) => {
  try {
      const batch_id = await generateCustomId('batch', 'BA');
      const query = 'INSERT INTO batch (batch_id, batch_date, stock_qty, shelf_life) VALUES (?, NOW(), ?, ?)';
      await pool.query(query, [batch_id, batch.stock_qty, batch.shelf_life]);
      return batch_id; // Return generated batch_id
  } catch (error) {
      throw new Error(`Error inserting batch: ${error.message}`);
  }
};

const insertProduct = async (product) => {
  try {
      const product_id = await generateCustomId('product', 'PR');
      const query = 'INSERT INTO product (product_id, prod_name, prod_type, batch_id, variant_name, var_color, price_per_qty, timestamp_crt) VALUES (?, ?, ?, ?, ?, ?, ?, NOW())';
      await pool.query(query, [product_id, product.prod_name, product.prod_type, product.batch_id, product.variant_name, product.var_color, product.price_per_qty]);
      return { product_id, ...product };
  } catch (error) {
      throw new Error(`Error inserting product: ${error.message}`);
  }
};

//Get all of the materials 
const getAllMaterials = async () => {
  try {
    const [results] = await pool.query(`SELECT material_id, mat_name, type_name, color, stock_qty FROM material, material_type WHERE material.material_type_id = material_type.material_type_id;`);
    return results;
  } catch (err) {
    throw new Error(`Error fetching materials: ${err.message}`);
  }
}; 

const deleteMaterial = async (materialId) => {
  try {
    const [result] = await pool.query('DELETE FROM material WHERE material_id = ?', [materialId]);
    return result;
  } catch (err) {
    throw new Error(`Error deleting material item with ID ${materialId}: ${err.message}`);
  }
};

const insertMaterial = async (material) => {
  try {
      const material_id = await generateCustomId('material', 'MA');
      const query = 'INSERT INTO material (material_id, mat_name, material_type_id, color, stock_qty) VALUES (?, ?, ?, ?, ?)';
      await pool.query(query, [material_id, material.mat_name, material.material_type_id, material.color, material.stock_qty]);
      return material_id; // Return generated batch_id
  } catch (error) {
      throw new Error(`Error inserting material: ${error.message}`);
  }
};

//Get all of the arrangements
const getAllArrangements = async () => {
  try {
    const [results] = await pool.query(
      `SELECT 
            a.arrangement_id,
            a.arrangement_name,
            at.type_name AS arrangement_type,
            a.price,
            a.description,
            a.num_reviews,
            a.img_link,
            a.num_sold
        FROM 
            arrangement AS a
        JOIN 
            arrangement_type AS at
        ON 
            a.arrangement_type_id = at.arrangement_type_id;`);
    return results;
  } catch (err) {
    throw new Error(`Error fetching arrangements: ${err.message}`);
  }
};

const deleteArrangement = async (arrangementId) => {
  try {
    const [result] = await pool.query('DELETE FROM arrangement WHERE arrangement_id = ?', [arrangementId]);
    return result;
  } catch (err) {
    throw new Error(`Error deleting arrangement item with ID ${arrangementId}: ${err.message}`);
  }
};

// Get a single arrangement item by ID
const getArrangementById = async (arrangementId) => {
  try {
    const [result] = await pool.query('SELECT * FROM arrangement WHERE arrangement_id = ?', [arrangementId]);
    return result[0];
  } catch (err) {
    throw new Error(`Error fetching inventory item with ID ${arrangementId}: ${err.message}`);
  }
 };

  // Get a single inventory item by ID
  const getInventoryById = async (inventoryId) => {
    try {
      const [result] = await pool.query('SELECT * FROM batch WHERE inventory_id = ?', [inventoryId]);
      return result[0];
    } catch (err) {
      throw new Error(`Error fetching inventory item with ID ${inventoryId}: ${err.message}`);
    }
   };
    
  // Create a new inventory item
  const createInventory = async (inventoryData) => {
    try {
      const { name, quantity, price } = inventoryData;
      const inventory_id = await generateCustomId('inventory', 'INV');
      const [result] = await pool.query(
        'INSERT INTO inventory (inventory_id, name, quantity, price) VALUES (?, ?, ?, ?)',
        [inventory_id, name, quantity, price]
      );
      return { inventory_id, ...inventoryData };
    } catch (err) {
      throw new Error(`Error creating inventory item: ${err.message}`);
    }
   };
    
  // Update an existing inventory item
  const updateInventory = async (inventoryId, inventoryData) => {
    try {
      const { name, quantity, price } = inventoryData;
      const [result] = await pool.query(
        'UPDATE batch SET name = ?, quantity = ?, price = ? WHERE inventory_id = ?',
        [name, quantity, price, inventoryId]
      );
      return result;
    } catch (err) {
      throw new Error(`Error updating inventory item with ID ${inventoryId}: ${err.message}`);
    }
  };
    
  // Delete an inventory item
  const deleteInventory = async (inventoryId) => {
    try {
      const [result] = await pool.query('DELETE FROM batch WHERE inventory_id = ?', [inventoryId]);
      return result;
    } catch (err) {
      throw new Error(`Error deleting inventory item with ID ${inventoryId}: ${err.message}`);
    }
  };



module.exports = {
    getAllInventory,
    getAllProducts,
    deleteProduct,
    deleteProductByBatch,
    insertProduct,
    insertBatch,
    getAllMaterials,
    deleteMaterial,
    insertMaterial,
    getAllArrangements,
    deleteArrangement,
    getArrangementById,
    getInventoryById,
    createInventory,
    updateInventory,
    deleteInventory
};
