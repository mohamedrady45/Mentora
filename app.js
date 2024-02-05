const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const authRouter=require('./routers/authRouter')

const app = express();

require('dotenv').config();

app.use(cors())

const PORT = process.env.PORT || 4000;
const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);


app.use(bodyParser.json());
 

//googleAuth
const responseSuccessGoogle = (response) => {
  console.log(response);
  axios({
    method: "POST",
    url: "http://localhost:3000/api/googlelogin",
    data: {tokenId: response.tokenId}
  }).then(response => {
    console.log("Google login success",response);
  })
}
const responseErrorGoogle = (response) => {
  
}

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


