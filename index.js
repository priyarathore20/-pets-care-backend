import cors from 'cors';
import express, { json, urlencoded } from 'express';
import helmet from 'helmet';
import mongoose from 'mongoose';
import { URL } from './src/config.js';
import router from './src/routes/index.js';

const app = express();
app.use(json());
app.use(urlencoded({ extends: true }));

app.use(cors());

app.use(helmet());

app.get('/', (req, res) => {
  try {
    res.status(200).json({ message: 'The page is connected.' });
  } catch (error) {
    res.status(500).send('Internal Server Error');
  }
});

mongoose
  .connect(URL)
  .then(() => {
    console.log('App connected to database');
    app.use(router);
  })
  .catch((error) => {
    console.log(error);
  });

export default app;
