const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const authController = require('./controllers/authController');

const authRouter = require('./routers/authRouter');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);

mongoose.connect(DB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('DB connection successfully!');
  })
  .catch((error) => {
    console.error('Error connecting to the database:', error.message);
  });

app.use(bodyParser.json());

app.use('/api/user', authRouter);
app.get('/getAll'  ,  authController.getAllUsers)
app.get('/', (req, res) => {
  res.send('Server is running');
});
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
