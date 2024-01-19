const express = require('express');
const app = express();
const mongoose = require('mongoose');
require ( 'dotenv').config();
const PORT = 3000 ;
const DB = process.env.DATABASE.replace('<PASSWORD>' , process.env.DATABASE_PASSWORD);
mongoose.connect(DB , {}).then(con =>{
  console.log('DB connection successfully!');
});
app.listen(PORT ,  () => {
    console.log ( `listening on port ${PORT}` );
}) ;