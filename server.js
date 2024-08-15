const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const QuestionRoutes = require('./routes/RouteQuestion');

const app = express();
const PORT = process.env.PORT || 3000;

// MongoDB connection string
const MONGO_URI = 'mongodb+srv://tunwalhimanshu:kCyfmscb2spY14yG@paperbot.6vhle9d.mongodb.net/schoolData?retryWrites=true&w=majority&appName=paperbot';

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB connection error:', err));

app.use(cors());
app.use(express.json());

app.use('/api', QuestionRoutes);

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});