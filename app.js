const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const authRouter=require('./routers/authRouter')

const app = express();


require('dotenv').config();


const PORT = 3000;
const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);

app.use(bodyParser.json());

//Routes
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
