const pool = require('../config/database');

// Admin search function for all tables
exports.adminSearch = async (req, res) => {
  const { keyword } = req.query;

  if (!keyword) {
    return res.status(400).json({ message: "Search keyword is required" });
  }

  try {
    const [results] = await pool.query(`
      SELECT 'arrangement' AS source, arrangement_id AS id, arrangement_name AS name, description, price
      FROM arrangement
      WHERE MATCH(arrangement_name, description) AGAINST (? IN NATURAL LANGUAGE MODE)

      UNION

      SELECT 'material' AS source, mat_id AS id, mat_name AS name, color AS description, NULL AS price
      FROM material
      WHERE MATCH(mat_name, color) AGAINST (? IN NATURAL LANGUAGE MODE)

      UNION

      SELECT 'product' AS source, prod_id AS id, prod_name AS name, variant_name AS description, price_per_qty AS price
      FROM product
      WHERE MATCH(prod_name, variant_name, var_color) AGAINST (? IN NATURAL LANGUAGE MODE);
    `, [keyword, keyword, keyword]);

    res.status(200).json(results);
  } catch (error) {
    console.error("Admin search error:", error);
    res.status(500).json({ message: "Server error during search" });
  }
};
