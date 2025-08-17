// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const QuestionRoutes = require('./routes/RouteQuestion');

const app = express();
const PORT = process.env.PORT || 3000;

// Prefer env var; fallback uses question_bank DB as required
const MONGO_URI = process.env.MONGODB_URI
  || 'mongodb+srv://tunwalhimanshu:kCyfmscb2spY14yG@paperbot.6vhle9d.mongodb.net/schoolData?retryWrites=true&w=majority&appName=paperbot';

mongoose.connect(MONGO_URI, {
  // mongoose v6+ ignores useNewUrlParser/useUnifiedTopology but safe
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

app.use(cors());
app.use(express.json({ limit: '2mb' }));

// Mount flat questions routes
app.use('/api', QuestionRoutes);

app.get('/', (_req, res) => {
  res.send('Question Bank API is running');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
