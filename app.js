const express = require('express');
const mongoose = require('mongoose');
const mainRouter = require('./src/routes/main');
const { User } = require('./src/models/users');

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
  const user = new User({
    id: 123123,
    firstName: 'moshe',
    lastName: 'israeli',
    birthday: new Date(1990, 0, 10, 02),
  });
  user.save();
});
