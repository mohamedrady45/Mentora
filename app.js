const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const authRouter=require('./routers/authRouter')

const app = express();

require('dotenv').config();


const PORT = 3000;
const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);

app.use(bodyParser.json());

//googleAuth
import React from 'react';
import GoogleLogin from 'react-google-login';
import axios from 'axios';
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

//googleAuth
<GoogleLogin
    clientId="899300165493-hdf7qc1omn1qe8fa031t5un6mm8v3g5k.apps.googleusercontent.com"
    buttonText="Login"
    onSuccess={responseSuccessGoogle}
    onFailure={responseErrorGoogle}
    cookiePolicy={'single_host_origin'}
  />