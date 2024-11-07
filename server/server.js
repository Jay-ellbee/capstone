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
const landingPageRoute = require('./routes/landingPageRoute');
const authRoute = require('./routes/authRoute');
const customerRoutes = require('./routes/customerRoutes');
const cartRoutes = require('./routes/cartRoutes');
const requestRoutes = require('./routes/requestRoutes');
const customerSearchRoutes = require('./routes/customerSearchRoutes');
const adminSearchRoutes = require('./routes/adminSearchRoutes');


// * MIDDLEWARE
const app = express();

const PORT = process.env.PORT;

app.use(express.json());
app.use(cors());

// CUSTOMER SIDE OF THE APPLICATION
app.use('/api', landingPageRoute);
app.use('/api', requestRoutes)


// * ROUTERS
// ROOT PATH: /api/
app.use('/api', adminRoutes);
app.use('/api', orderRoutes);
app.use('/api', transactionRoutes);
app.use('/api', inventoryRoutes);
app.use('/api', dashboardRoutes);
app.use('/api', authRoute);
app.use('/api', customerRoutes) 
app.use('/api', cartRoutes)
app.use('/api', customerSearchRoutes); // Customer search route
app.use('/api', adminSearchRoutes);       // Admin search route

//* CONNECTION
app.listen(PORT, () => {
    console.log(`Listening at port: ${PORT}...`);
  });