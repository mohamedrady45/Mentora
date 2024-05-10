const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const cors = require('cors');

const communityRouter = require('./routers/communityRouter');
const authRouter = require('./routers/authRouter')
const chatRouter = require('./routers/chat')
const postRouter = require('./routers/postRouter')
const notificationRouter = require('./routers/notification')


const app = express();

require('dotenv').config();
app.use(bodyParser.json());
app.use(cors());

app.use(session({
  secret: process.env.SESSION_SECRET_KEY,
  resave: true,
  saveUninitialized: true,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  }
}));

const PORT = process.env.PORT || 4000;
const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);

// Routes
app.get('/', (req, res) => {
  res.send('Server is running');
});
app.use('/api/user', authRouter);
app.use('/api/communities', communityRouter);
app.use('/api/post', postRouter);
app.use('/api/chat', chatRouter);
app.use('/api/notification', notificationRouter);

// Error handling middleware
app.use((error, req, res, next) => {
  console.error(error);
  const status = error.statusCode || 500;
  const message = error.message || 'Internal Server Error';
  res.status(status).json({ message });
});

mongoose.connect(DB, {}).then(() => {
  console.log('DB connection successfully!');
  const server = app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
  });
  const io = require('./socket').init(server);
  let onlineUsers = [];
  //Online users
  io.on('connection', socket => {
    console.log("client connected",socket.id);

    socket.on('addNewUser', userId => {
      !onlineUsers.some((user) => user.userId === userId) &&
        onlineUsers.push({
          userId: userId,
          socketId: socket.id
        })
      io.emit('getOnlineUsers', onlineUsers)
    });

    socket.on('message', (data) => {
      console.log('Received message:', data);

      // Broadcast message to all connected clients
      io.emit('message', data); // Emit the message to all connected clients
    });

    socket.on('disconnect', () => {
      onlineUsers = onlineUsers.filter(user => user.socketId !== socket.id);
      io.emit('getOnlineUsers', onlineUsers);
      console.log("client disconnected");
    })
  })
}).catch(err => {
  console.error('DB connection error:', err);


});
