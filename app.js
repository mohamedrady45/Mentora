const express = require('express');
const crypto = require('crypto');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');

const cors = require('cors');

const authRouter = require('./routers/authRouter')
const chatRouter = require('./routers/chat')

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
app.use('/api/chat', chatRouter);


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
  const server = app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`);
  });
  const io = require('./socket').init(server);
  const onlineUsers = [];
  //Online users
  io.on('connection', socket => {
    console.log("client connected");

    socket.on('addNewUser', userId => {
      !onlineUsers.some((user) => user.userId === userId) &&
        onlineUsers.push({
          userId: userId,
          socketId: socket.id
        })
      io.emit('getOnlineUsers', onlineUsers)
    });

   socket.on('disconnect', ()=>{
     onlineUsers = onlineUsers.filter(user => user.socketId !== socket.id)
     io.emit('getOnlineUsers', onlineUsers)
   })

  })
});


