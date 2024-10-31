const express = require('express');
const dotenv = require('dotenv');
dotenv.config();
const cors = require('cors');

// * IMPORTS
// import authRouter from './routes/authRoute.js';
// import publicRouter from './routes/publicRoute.js';
const adminRoutes = require('./routes/adminRoutes');
const orderRoutes = require('./routes/orderRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const inventoryRoutes = require('./routes/inventoryRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
// const adminRoutes = require('./routes/adminRoutes');
// const orderRoutes = require('./routes/orderRoutes');
// const transactionRoutes = require('./routes/transactionRoutes');
// const inventoryRoutes = require('./routes/inventoryRoutes');

// * MIDDLEWARE
const app = express();

const PORT = process.env.PORT;

app.use(express.json());
app.use(cors());

app.use((err, req, res, next) => {
  console.log('MIDDLEWARE');
  console.error(err.stack);
  res.status(500).send('Something broke!');
    next();
});

// * DATABASE INITIALIZATION
// createSchema()
//   .then((res) => {
//     console.log(res);
//   })
//   .catch((err) => {
//     console.log(err);
//   });

// * ROUTERS
// ROOT PATH: /api/
//app.use('/api', authRouter);
//app.use('/api', publicRouter)
app.use('/api', adminRoutes);
app.use('/api', orderRoutes);
app.use('/api', transactionRoutes);
app.use('/api', inventoryRoutes);
app.use('/api', dashboardRoutes);

//* CONNECTION
app.listen(PORT, () => {
    console.log(`Listening at port: ${PORT}...`);
  });