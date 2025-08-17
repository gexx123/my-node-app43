// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const QuestionRoutes = require('./routes/RouteQuestion.js');

const app = express();
const PORT = process.env.PORT || 3000;

// Hardcoded MongoDB connection string pointing to question_bank DB
const MONGO_URI = 'mongodb+srv://tunwalhimanshu:kCyfmscb2spY14yG@paperbot.6vhle9d.mongodb.net/question_bank?retryWrites=true&w=majority&appName=paperbot';

mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 10000 })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => {
    console.error('MongoDB connection error:', err?.message || err);
    process.exit(1);
  });

app.use(cors());
app.use(express.json({ limit: '5mb' }));

// Simple health and diag
app.get('/health', (_req, res) => res.json({ ok: true, cwd: __dirname }));

// Routes
app.use('/api', QuestionRoutes);

// Root
app.get('/', (_req, res) => res.send('Question Bank API OK'));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('Expect models at:', path.join(__dirname, 'models', 'Question.js'));
  console.log('Expect routes at:', path.join(__dirname, 'routes', 'RouteQuestion.js'));
});
