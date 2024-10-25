import express from 'express';

import errorHandler from '../utils/routeErrorHandler.js';

import {
    selectArrangement,
  } from '../middleware/products.js';

  const publicRouter = express.Router();

  // ? PRODUCTS
// * GET ALL PRODUCTS
publicRouter.get('/admin/products', selectArrangement);

// ?  ERROR HANDLER
publicRouter.use(errorHandler);

export default publicRouter;
