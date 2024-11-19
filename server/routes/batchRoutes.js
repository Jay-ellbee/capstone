const batchController = require('../controllers/batchController');
const express = require('express');
const router = express.Router();

router.get('/batches', batchController.readAllBatches);

router.get('/batches/:id', batchController.readBatch);

router.post('/batches', batchController.createBatch);

router.delete('/batches/:id', batchController.deleteBatch);

router.put("/:batchId", batchController.updateBatchProducts);

module.exports = router;