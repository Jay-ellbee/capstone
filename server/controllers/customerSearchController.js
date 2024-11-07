const pool = require('../config/database');

// Customer search function for arrangements only
exports.customerSearch = async (req, res) => {
  const { keyword, minPrice, maxPrice, sortBy } = req.query;

  if (!keyword) {
    return res.status(400).json({ message: "Search keyword is required" });
  }

  let query = `
    SELECT 
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
            a.arrangement_type_id = at.arrangement_type_id
    WHERE MATCH(arrangement_name, a.description) AGAINST (? IN NATURAL LANGUAGE MODE)
  `;

  const params = [keyword];

  // Optional filtering
  if (minPrice) {
    query += ` AND price >= ?`;
    params.push(minPrice);
  }
  if (maxPrice) {
    query += ` AND price <= ?`;
    params.push(maxPrice);
  }

  // Optional sorting
  if (sortBy === 'priceAsc') {
    query += ` ORDER BY price ASC`;
  } else if (sortBy === 'priceDesc') {
    query += ` ORDER BY price DESC`;
  } else if (sortBy === 'popularity') {
    query += ` ORDER BY num_sold DESC`;
  }

  try {
    const [results] = await pool.query(query, params);
    res.status(200).json(results);
  } catch (error) {
    console.error("Customer search error:", error);
    res.status(500).json({ message: "Server error during search" });
  }
};
