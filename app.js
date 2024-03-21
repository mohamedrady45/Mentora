const express = require('express');
const crypto = require('crypto');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');

const cors = require('cors');

const authRouter=require('./routers/authRouter')

const app = express();

require('dotenv').config();

app.use(cors())

app.use(session({
  secret: process.env.SESSION_SECRET_KEY,
  resave: false,
  saveUninitialized: true
}));

const PORT = process.env.PORT || 4000;

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);


app.use(bodyParser.json());
 


//Routes
app.get('/', (req, res) => {
  res.send('Server is running');
});
app.use('/api/user', authRouter);


//Error handling 
app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, data: data });
});


mongoose.connect(DB, {}).then(con => {
  console.log('DB connection successfully!');
  app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`);
  });
});


