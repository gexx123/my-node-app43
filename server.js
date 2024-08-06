const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000; // Use process.env.PORT provided by Render or fallback to 3000

// MongoDB connection string
const MONGO_URI = 'mongodb+srv://tunwalhimanshu:kCyfmscb2spY14yG@paperbot.6vhle9d.mongodb.net/schoolData?retryWrites=true&w=majority&appName=paperbot';

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

app.use(cors());
app.use(express.json());

// Define your Mongoose schema and model
const questionSchema = new mongoose.Schema({
  chapter: String,
  questionText: String,
  DifficultyLevel: String,
  Subject: String,
  Chaptername: String,
  ChapterPagenumber: String,
  ImagePath: String,
  TableDataPath: String,
  Topic: String,
  QuestionType: String,
  BookTitle: String,
  Authors: String,
  Class: String
});
const Question = mongoose.model('Question', questionSchema);

// Route to handle POST request to /api/questions
app.post('/api/questions', async (req, res) => {
  try {
    const { entities } = req.body;

    if (!entities || !Array.isArray(entities)) {
      return res.status(400).send('Bad Request: Missing or invalid "entities"');
    }

    // Example logic to handle the incoming entities and fetch from MongoDB
    const subject = entities.find(e => e.label === 'SUBJECT')?.text;
    const chapter = entities.find(e => e.label === 'CHAPTER')?.text;

    const query = {};
    if (subject) query.Subject = subject;
    if (chapter) query.Chaptername = chapter;

    const questions = await Question.find(query);

    res.status(200).json({ message: 'Questions retrieved successfully', questions });
  } catch (error) {
    console.error('Error fetching questions:', error);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
});

// Basic route
app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
