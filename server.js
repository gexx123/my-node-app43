// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const QuestionRoutes = require('./routes/RouteQuestion');

const app = express();
const PORT = process.env.PORT || 3000;

// Use env: MONGO_URI should include /question_bank as the default db
// Example: mongodb+srv://<user>:<pass>@cluster.mongodb.net/question_bank?retryWrites=true&w=majority&appName=paperbot
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error('MONGO_URI env var is required and must point to the question_bank database');
  process.exit(1);
}

mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 10000 })
  .then(() => console.log('MongoDB connected'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

app.use(cors());
app.use(express.json({ limit: '5mb' }));

app.use('/api', QuestionRoutes);

app.get('/', (_, res) => res.send('Question Bank API OK'));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
