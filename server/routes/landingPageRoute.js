const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventoryController');

router.get('/arrangements', (req, res, next) => {
    console.log('Accessing /api/arrangements without auth');
    next();
  }, inventoryController.getAllArrangements);
  

module.exports = router;