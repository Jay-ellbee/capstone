const pool = require('../config/database');
const { generateCustomId } = require('../utils/idGenerator');

const createBatch = async (batch) => {
    try {
        console.log("Batch received:", JSON.stringify(batch, null, 2));
        const batch_id = await generateCustomId('batch', 'BA');

        // Insert into batch table
        await pool.query('INSERT INTO batch (batch_id, batch_date) VALUES (?, NOW())', [batch_id]);

        // Insert related products into batch_product
        if (!batch.products || !Array.isArray(batch.products)) {
            throw new Error("Invalid or missing products array in batch");
        }

        for (const product of batch.products) {
            await pool.query(
                `INSERT INTO batch_product (
                    batch_id, product_id, buying_price_per_bundle, bundle_count, 
                    pc_per_bundle, selling_price_per_bundle, stock_qty, 
                    price_per_pc, expiration_date
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    batch_id,
                    product.product_id,
                    product.buying_price_per_bundle,
                    product.bundle_count,
                    product.pc_per_bundle,
                    product.selling_price_per_bundle,
                    product.bundle_count * product.pc_per_bundle, // stock_qty
                    product.selling_price_per_bundle / product.pc_per_bundle, // price_per_pc
                    product.expiration_date
                ]
            );
        }

        return batch_id;
    } catch (error) {
        throw new Error(`Error creating batch: ${error.message}`);
    }
};

  

const readBatch = async (batchId) => {
    try {
        const [results] = await pool.query('SELECT *,DATEDIFF(expiration_date, curdate()) as shelf_life FROM batch JOIN batch_product ON batch.batch_id = batch_product.batch_id WHERE batch_product.batch_id = ?', [batchId]);
        return results;
    } catch (error) {
        throw new Error(`Error reading batch: ${error.message}`);
    }
};

const readAllBatches = async () => {
    try {
        const connection = await pool.getConnection();

        // Step 1: Update expired products in `batch_product`
        const [updateResults] = await connection.query(`
            UPDATE batch_product
            SET is_expired = 1
            WHERE expiration_date = CURDATE() AND is_expired = 0
        `);
        console.log(`Updated ${updateResults.affectedRows} expired products.`);

        // Step 2: Identify and move expired products to `losses`
        const [expiredProducts] = await connection.query(`
            SELECT 
                bp.batch_id,
                bp.product_id,
                bp.stock_qty,
                bp.expiration_date
            FROM 
                batch_product bp
            WHERE 
                bp.is_expired = TRUE AND bp.stock_qty > 0
        `);

        if (expiredProducts.length > 0) {
            const lossEntries = await Promise.all(
                expiredProducts.map(async (product) => {
                    const losses_id = await generateCustomId("losses", "LS");
                    return [
                        losses_id,
                        product.batch_id,
                        product.product_id,
                        product.stock_qty,
                        product.expiration_date,
                    ];
                })
            );

            // Insert expired products into the `losses` table
            await connection.query(
                `INSERT INTO losses (losses_id, batch_id, product_id, qty_lost, expiration_date)
                 VALUES ?`,
                [lossEntries]
            );

            // Remove expired products from `batch_product`
            const batchProductConditions = expiredProducts.map(
                (product) => `('${product.batch_id}', '${product.product_id}')`
            ).join(", ");

            await connection.query(`
                DELETE FROM batch_product
                WHERE (batch_id, product_id) IN (${batchProductConditions})
            `);

            console.log(`${expiredProducts.length} expired products moved to losses.`);
        }

        // Step 3: Fetch remaining batches and products
        const [results] = await connection.query(`
            SELECT 
                b.batch_id,
                b.batch_date,
                bp.product_id,
                bp.buying_price_per_bundle,
                bp.bundle_count,
                bp.pc_per_bundle,
                bp.selling_price_per_bundle,
                bp.price_per_pc,
                bp.stock_qty,
                DATEDIFF(bp.expiration_date, CURDATE()) AS shelf_life,
                bp.is_expired
            FROM 
                batch b
            JOIN 
                batch_product bp 
            ON 
                b.batch_id = bp.batch_id
            WHERE 
                bp.stock_qty > 0 -- Include only products with stock
        `);

        // Step 4: Transform the flat result into the nested structure
        const batches = results.reduce((acc, row) => {
            const batchIndex = acc.findIndex(batch => batch.batch_id === row.batch_id);

            const product = {
                product_id: row.product_id,
                buying_price_per_bundle: row.buying_price_per_bundle,
                bundle_count: row.bundle_count,
                pc_per_bundle: row.pc_per_bundle,
                selling_price_per_bundle: row.selling_price_per_bundle,
                price_per_pc: row.price_per_pc,
                stock_qty: row.stock_qty,
                shelf_life: row.shelf_life > 0 ? row.shelf_life : 0, // Prevent negative shelf life
                is_expired: row.is_expired === 1 // Ensure `is_expired` is properly flagged
            };

            if (batchIndex > -1) {
                // Batch already exists, push product to its products array
                acc[batchIndex].products.push(product);
            } else {
                // Create a new batch entry
                acc.push({
                    batch_id: row.batch_id,
                    batch_date: row.batch_date,
                    products: [product]
                });
            }

            return acc;
        }, []);

        connection.release();
        return batches;
    } catch (error) {
        console.error(`Error reading and updating batches: ${error.message}`);
        throw new Error(`Error reading and updating batches: ${error.message}`);
    }
};




const updateBatchProducts = async (batchId, products) => {
    try {
        const connection = await pool.getConnection();

        // Update each product in the batch
        for (const product of products) {
            const {
                product_id,
                buying_price_per_bundle,
                bundle_count,
                pc_per_bundle,
                selling_price_per_bundle,
                stock_qty,
                expiration_date,
            } = product;

            //  expiration_date = expiration_date
            //    ? new Date(Date.now() + expiration_date * 24 * 60 * 60 * 1000).toISOString().split("T")[0]
            //     : null;

            await connection.query(
                `
                UPDATE batch_product
                SET 
                    buying_price_per_bundle = ?,
                    bundle_count = ?,
                    pc_per_bundle = ?,
                    selling_price_per_bundle = ?,
                    price_per_pc = (selling_price_per_bundle / pc_per_bundle),
                    stock_qty = ?,
                    expiration_date = ?
                WHERE 
                    batch_id = ? AND product_id = ?
                `,
                [
                    buying_price_per_bundle,
                    bundle_count,
                    pc_per_bundle,
                    selling_price_per_bundle,
                    stock_qty,
                    expiration_date,
                    batchId,
                    product_id,
                ]
            );
        }

        connection.release();
        return { success: true, message: `Batch ${batchId} updated successfully.` };
    } catch (error) {
        console.error(`Error updating batch products: ${error.message}`);
        throw new Error(`Error updating batch products: ${error.message}`);
    }
};

const deleteBatch = async (batchId) => {
    try {
      const query = `
        DELETE batch, batch_product
        FROM batch
        JOIN batch_product ON batch.batch_id = batch_product.batch_id
        WHERE batch.batch_id = ?
      `;
  
      await pool.query(query, [batchId]);
      return { message: "Batch deleted successfully" };
    } catch (error) {
      throw new Error(`Error deleting batch: ${error.message}`);
    }
  };
  

module.exports = {
    createBatch,
    readBatch,
    readAllBatches,
    updateBatchProducts,
    deleteBatch
};