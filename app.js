const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const cors = require('cors');
const http = require('http');
const requestRouter = require('./routers/RequestMentor')

const communityRouter = require('./routers/communityRouter');
const authRouter = require('./routers/authRouter')
//const chatRouter = require('./routers/chat')
//const messageRouter = require('./routers/message')
const ApplyAsMentorRouter = require('./routers/ApplyAsMentorRouter')
const postRouter = require('./routers/postRouter')
const notificationRouter = require('./routers/notification')
const userRouter = require('./routers/userRouter')
const chatRouter = require('./routers/chat')
const RequestMentorRouter = require('./routers/RequestMentor')
const sessionRouter = require('./routers/session')
const TrainingRouter = require('./routers/TrainingRouter')
const TaskRouter = require('./routers/TaskRouter')
const TestRouter = require('./routers/testRouter')

const app = express();

// const server = http.createServer(app);

require('dotenv').config();
app.use(bodyParser.json());
app.use(cors());



const PORT = process.env.PORT || 4000;
const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);

// Routes
app.get('/', (req, res) => {
  res.send('Server is running');
});
app.use('/api/user', authRouter,userRouter);
app.use('/api/communities', communityRouter);
app.use('/api/notification', notificationRouter);
app.use('/api/chat', chatRouter);
app.use('/api/user/request', requestRouter);
app.use('/api/Application', ApplyAsMentorRouter);
app.use('/api/post', postRouter);
app.use('/api/communities' , communityRouter);
app.use('/api/request' , RequestMentorRouter);
app.use('/api/session' , sessionRouter);
app.use('/api/training', TrainingRouter);
app.use('/api/task', TaskRouter);
app.use('/api/test', TestRouter);

//Error handling 
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
  const io = require('./Socket/socket').init(server);
  require('./Socket/onlineUser')(io);
}).catch(err => {
  console.error('DB connection error:', err);


});
