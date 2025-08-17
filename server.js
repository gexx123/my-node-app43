// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();

const QuestionsRouter = require('./routes/questions');

const app = express();
const PORT = process.env.PORT || 3000;

// IMPORTANT: move secrets to env vars
// Example .env:
// MONGO_URI=mongodb+srv://<user>:<pass>@paperbot.6vhle9d.mongodb.net/question_bank?retryWrites=true&w=majority&appName=paperbot
const MONGO_URI =
  process.env.MONGO_URI ||
  'mongodb+srv://tunwalhimanshu:kCyfmscb2spY14yG@paperbot.6vhle9d.mongodb.net/question_bank?retryWrites=true&w=majority&appName=paperbot';

// Connect MongoDB
mongoose
  .connect(MONGO_URI, {
    // useNewUrlParser/useUnifiedTopology not needed in Mongoose 6+, but harmless
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Middlewares
app.use(morgan('dev'));
app.use(express.json({ limit: '1mb' }));

// Tighten CORS to your app origins if possible
app.use(
  cors({
    origin: [
      // Add your Flutter web origins here
      // 'http://localhost:5000',
      // 'https://your-netlify-site.netlify.app'
      '*'
    ],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);

// Health check
app.get('/health', (req, res) => res.json({ ok: true }));

// API routes
app.use('/api', QuestionsRouter);

// 404
app.use((req, res) => res.status(404).json({ error: 'Not Found' }));

// Error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal Server Error' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
