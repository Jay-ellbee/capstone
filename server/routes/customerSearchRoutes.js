const express = require('express');
const router = express.Router();
const customerSearchController = require('../controllers/customerSearchController');

router.get('/search/customer', customerSearchController.customerSearch);

module.exports = router;
