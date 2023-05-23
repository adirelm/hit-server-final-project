/**
 * first name: Adir
 * last name: Elmakais
 * id: 316413640
 *
 * first name: Idan
 * last name: Refaeli
 * id: 207351941
 *
 * first name: Ron
 * last name: Kipnis
 * id: 207275371
 */

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const mainRouter = require('./src/routes/main');

const PORT = process.env.PORT || 3000;

const app = express();

// Parse JSON bodies
app.use(express.json());
// Parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

const DATABASE_URL =
  process.env.DATABASE_URL || 'mongodb://localhost/hit-server';

mongoose
  .connect(DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Connected to MongoDB');
  });

// Mount the main router for handling routes
app.use(mainRouter);

app.use((err, req, res, next) => {
  // Error handling middleware
  const status = err.status || 500;
  res.status(status).json({ status, error: err.message });
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
