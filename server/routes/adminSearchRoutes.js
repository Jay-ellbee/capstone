const express = require('express');
const router = express.Router();
const adminSearchController = require('../controllers/adminSearchController');

router.get('/search/admin', adminSearchController.adminSearch);

module.exports = router;
