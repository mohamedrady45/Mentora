const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const cors = require('cors');
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

const { app, server } = require('./Socket/socket')

require('dotenv').config();
app.use(bodyParser.json());
app.use(cors());



const PORT = process.env.PORT || 4000;
const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);

// Routes
app.get('/', (req, res) => {
  res.send('Server is running');
});
app.use('/api/user', authRouter, userRouter);
app.use('/api/communities', communityRouter);
app.use('/api/notification', notificationRouter);
app.use('/api/chat', chatRouter);
app.use('/api/user/request', requestRouter);
app.use('/api/Application', ApplyAsMentorRouter);
app.use('/api/post', postRouter);
app.use('/api/communities', communityRouter);
app.use('/api/request', RequestMentorRouter);
app.use('/api/session', sessionRouter);
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
  //run server.
  server.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
  });
  // //web socket
  // const io = require('./socket').init(server);
  // let onlineUsers = [];
  // //Online users
  // io.on('connection', socket => {
  //   console.log("client connected",socket.id);

  //   socket.on('addNewUser', userId => {
  //     !onlineUsers.some((user) => user.userId === userId) &&
  //       onlineUsers.push({
  //         userId: userId,
  //         socketId: socket.id
  //       })
  //     io.emit('getOnlineUsers', onlineUsers)
  //   });

  //   socket.on('message', (data) => {
  //     console.log('Received message:', data);

  //     // Broadcast message to all connected clients
  //     io.emit('message', data); // Emit the message to all connected clients
  //   });

  //   socket.on('disconnect', () => {
  //     onlineUsers = onlineUsers.filter(user => user.socketId !== socket.id);
  //     io.emit('getOnlineUsers', onlineUsers);
  //     console.log("client disconnected");
  //   })
  // })
}).catch(err => {
  console.error('DB connection error:', err);


});

//testing
app.use(express.json());


app.post('/register', (req, res) => {
  const { email, password, otp, personalDetails } = req.body;
  // Dummy data for the correct OTP
  const correctOtp = '123456';
  if (!email || !password || !otp) {
    return res.status(400).send({ error: 'Missing required fields' });
  }
  if (otp !== correctOtp) {
    return res.status(400).send({ error: 'Invalid OTP' });
  }
  // Assume user registration is successful
  res.status(201).send({ message: 'User registered successfully' });
});

app.post('/login', (req, res) => {
  console.log('Received login request:', req.body);
  const { email, password } = req.body;
  if (email === 'test@example.com' && password === 'p@ssword123') {
    res.status(200).send({ message: 'Login successful' });
  } else {
    res.status(401).send({ error: 'Invalid email or password' });
  }
});

app.post('/requestMentor', (req, res) => {
  const { userId, mentorDetails } = req.body;
  if (!userId || !mentorDetails || !mentorDetails.track || !mentorDetails.language || !mentorDetails.type) {
    return res.status(400).send({ error: 'Required fields are missing' });
  }
  res.status(201).send({ message: 'Mentor requested successfully' });
});

const communities = [];

app.post('/create-community', (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name || !description) {
      console.error('Validation error: name or description missing');
      return res.status(400).send({ message: 'error' });
    }
    const newCommunity = { id: communities.length + 1, name, description };
    communities.push(newCommunity);
    return res.status(201).send({ name, description });
  } catch (error) {
    console.error('Internal server error:', error);
    return res.status(500).send({ message: 'Internal Server Error' });
  }
});

app.post('/create-training', (req, res) => {
  const { mentor_id, title, description } = req.body;
  if (!mentor_id || !title || !description) {
    return res.status(400).send({ message: 'error' });
  }
  res.status(201).send({ mentor_id, title, description });
});

app.post('/login', (req, res) => {
  // Implement your login logic here
  const { email, password } = req.body;
  // Example validation
  if (email === 'testuser@example.com' && password === 'password123') {
    res.status(200).json({ message: 'Login successful', token: 'mocktoken' });
  } else {
    res.status(401).json({ error: 'Unauthorized' });
  }
});

// Example route for applying as a mentor
app.post('/applyAsMentor', (req, res) => {
  // Implement your mentor application logic here
  const { personalDetails } = req.body;
  if (!personalDetails.name || !personalDetails.email || !personalDetails.track || !personalDetails.experience) {
    res.status(400).json({ error: 'Please provide correct data' });
  } else {
    // Process valid application
    res.status(201).json({ message: 'Application submitted successfully' });
  }
});

// Example route for admin to review applications
app.post('/admin/reviewApplication', (req, res) => {
  // Implement admin review logic here
  const { applicationId, status, feedback } = req.body;
  // Example validation and processing
  if (status === 'accepted' || status === 'rejected') {
    res.status(200).json({ message: 'Application reviewed successfully' });
  } else {
    res.status(400).json({ error: 'Invalid status' });
  }
});

// Export the app for testing
module.exports = app;