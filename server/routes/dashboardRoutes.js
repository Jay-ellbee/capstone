const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');

console.log(dashboardController);

router.get('/dashboard/revenue', dashboardController.getTotalRevenue);
router.get('/dashboard/customers', dashboardController.getTotalCustomers);
router.get('/dashboard/sales', dashboardController.getSalesAnalytics);
router.get('/dashboard/products', dashboardController.getProductAnalytics);
router.get('/dashboard/materials', dashboardController.getMaterialAnalytics);
router.get('/dashboard/arrangements', dashboardController.getArrangementAnalytics);

module.exports = router;