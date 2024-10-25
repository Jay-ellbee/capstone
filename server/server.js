import express from 'express';

import dotenv from 'dotenv';
dotenv.config();

import cors from 'cors';

// * IMPORTS
import authRouter from './routes/authRoute.js';
import publicRouter from './routes/publicRoute.js';

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
app.use('/api', authRouter);
app.use('/api', publicRouter)

//* CONNECTION
app.listen(PORT, () => {
    console.log(`Listening at port: ${PORT}...`);
  });