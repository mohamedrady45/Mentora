const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const specs = require('./docs/swagger');

const requestRouter = require('./routers/RequestMentor');
const communityRouter = require('./routers/communityRouter');
const authRouter = require('./routers/authRouter');
const ApplyAsMentorRouter = require('./routers/ApplyAsMentorRouter');
const postRouter = require('./routers/postRouter');
const notificationRouter = require('./routers/notification');
const userRouter = require('./routers/userRouter');
const chatRouter = require('./routers/chat');
const RequestMentorRouter = require('./routers/RequestMentor');
const sessionRouter = require('./routers/session');
const TrainingRouter = require('./routers/TrainingRouter');
const TaskRouter = require('./routers/TaskRouter');
const TestRouter = require('./routers/testRouter');

const { app, server } = require('./Socket/socket');

require('dotenv').config();

const allowedOrigins = ['http://localhost:4000', 'http://localhost:3000']; // Replace with your actual allowed origins

const corsOptions = {
    origin: (origin, callback) => {
        if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    optionsSuccessStatus: 200,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(express.json());
app.use(cors(corsOptions));

// Swagger setup
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

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

// Error handling
app.use((error, req, res, next) => {
  console.error(error);
  const status = error.statusCode || 500;
  const message = error.message || 'Internal Server Error';
  res.status(status).json({ message });
});

const PORT = process.env.PORT || 4000;
const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);

mongoose.connect(DB, {}).then(() => {
  console.log('DB connection successfully!');
  server.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
  });
}).catch(err => {
  console.error('DB connection error:', err);
});
