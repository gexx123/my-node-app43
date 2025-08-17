// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const QuestionRoutes = require('./routes/RouteQuestion');

const app = express();
const PORT = process.env.PORT || 3000;

// Use env var; fallback to your current string but switch DB to question_bank
const MONGO_URI =
  process.env.MONGO_URI ||
  'mongodb+srv://tunwalhimanshu:kCyfmscb2spY14yG@paperbot.6vhle9d.mongodb.net/schoolData?retryWrites=true&w=majority&appName=paperbot';

mongoose
  .connect(MONGO_URI, { })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

app.use(cors());
app.use(express.json());

// Health
app.get('/', (_req, res) => res.send('OK'));

// API
app.use('/api', QuestionRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
