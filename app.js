const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const cors = require('cors');

const authRouter = require('./routers/authRouter');
const communityRouter = require('./routers/communityRouter');

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

// Error handling middleware
app.use((error, req, res, next) => {
  console.error(error);
  const status = error.statusCode || 500;
  const message = error.message || 'Internal Server Error';
  res.status(status).json({ message });
});

mongoose.connect(DB, {}).then(() => {
  console.log('DB connection successfully!');
  app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
  });
}).catch(err => {
  console.error('DB connection error:', err);
});
