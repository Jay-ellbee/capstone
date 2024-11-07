const express = require('express');
const router = express.Router();
const requestController = require('../controllers/requestController');

router.get('/requests/', requestController.getRequests);

// Send a request
router.post('/request', requestController.createRequest);

module.exports = router;