const express = require('express');
const mongoose = require('mongoose');
const questionRoutes = require('./routes/questions'); // Ensure the correct path

const app = express();
const PORT = process.env.PORT || 3000; // Use process.env.PORT provided by Render or fallback to 3000

// MongoDB connection string
const MONGO_URI = 'mongodb+srv://tunwalhimanshu:kCyfmscb2spY14yG@paperbot.6vhle9d.mongodb.net/schoolData?retryWrites=true&w=majority&appName=paperbot';

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

app.use(express.json());
app.use('/api/questions', questionRoutes); // Ensure the correct endpoint

// Basic route for testing
app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
