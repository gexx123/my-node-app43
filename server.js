// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const QuestionRoutes = require('./routes/RouteQuestion');

const app = express();
const PORT = process.env.PORT || 3000;

// Expect MONGO_URI to include /question_bank as db name, e.g.:
// mongodb+srv://<user>:<pass>@paperbot.6vhle9d.mongodb.net/question_bank?retryWrites=true&w=majority&appName=paperbot
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error('Missing MONGO_URI. Set it in Render with the database name /question_bank.');
  process.exit(1);
}

mongoose.connect(MONGO_URI, {
  serverSelectionTimeoutMS: 10000,
  // You can set dbName here if your URI doesn’t include /question_bank:
  // dbName: 'question_bank',
})
  .then(() => console.log('MongoDB connected'))
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

app.use(cors());
app.use(express.json({ limit: '5mb' }));

app.use('/api', QuestionRoutes);

app.get('/', (_req, res) => res.send('Question Bank API OK'));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
