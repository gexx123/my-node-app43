const express = require('express');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 3000;

// MongoDB connection string
const MONGO_URI = 'mongodb+srv://tunwalhimanshu:kCyfmscb2spY14yG@paperbot.6vhle9d.mongodb.net/schoolData?retryWrites=true&w=majority&appName=paperbot';

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

app.use(express.json());

// API Key for authentication
const API_KEY = 'paperbotAPI43@25';

const checkApiKey = (req, res, next) => {
  const apiKey = req.header('x-api-key');
  if (apiKey && apiKey === API_KEY) {
    next();
  } else {
    res.status(403).json({ message: 'Forbidden - Invalid API Key' });
  }
};

app.use(checkApiKey);

// Importing and using the questions route
const questionRoutes = require('./routes/questions');
app.use('/api', questionRoutes);

// Basic route
app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
