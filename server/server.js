const express = require('express');
const dotenv = require('dotenv');
dotenv.config();
const cors = require('cors');
const fileUpload = require('express-fileupload');


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
const batchRoutes = require('./routes/batchRoutes');
const imageRoutes = require('./routes/imageRoutes');
//const ocrRoutes = require('./routes/ocrRoutes');


// * MIDDLEWARE
const app = express();

const PORT = process.env.PORT;

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded requests


// Enable file uploads
app.use(fileUpload());

// CUSTOMER SIDE OF THE APPLICATION
app.use('/api', landingPageRoute);
app.use('/api', requestRoutes)
//app.use('/api', ocrRoutes);


// * ROUTERS
// ROOT PATH: /api/
app.use('/api', adminRoutes);
app.use('/api', batchRoutes);
app.use('/api', orderRoutes);
app.use('/api', transactionRoutes);
app.use('/api', inventoryRoutes);
app.use('/api', dashboardRoutes);
app.use('/api', authRoute);
app.use('/api', customerRoutes) 
app.use('/api', cartRoutes)
app.use('/api', customerSearchRoutes); // Customer search route
app.use('/api', adminSearchRoutes);       // Admin search route
app.use('/api', imageRoutes);

//* CONNECTION
app.listen(PORT, () => {
    console.log(`Listening at port: ${PORT}...`);
  });