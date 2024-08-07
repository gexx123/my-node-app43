const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Question = require('./question'); // Import the Question model

const app = express();
const PORT = process.env.PORT || 3000; // Use process.env.PORT provided by Render or fallback to 3000

// MongoDB connection string
const MONGO_URI = 'mongodb+srv://tunwalhimanshu:kCyfmscb2spY14yG@paperbot.6vhle9d.mongodb.net/schoolData?retryWrites=true&w=majority&appName=paperbot';

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

app.use(cors());
app.use(express.json());

// Route to handle GET request to /api/questions with query parameters for filtering
app.get('/api/questions', async (req, res) => {
  try {
    const { subject, chapter, difficulty, type, topic } = req.query;

    const query = {};
    if (subject) query.Subject = subject;
    if (chapter) query.Chaptername = chapter;
    if (difficulty) query.DifficultyLevel = difficulty;
    if (type) query.QuestionType = type;
    if (topic) query.Topic = topic;

    const questions = await Question.find(query);

    res.status(200).json({ message: 'Questions retrieved successfully', questions });
  } catch (error) {
    console.error('Error fetching questions:', error);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
});

// Route to handle POST request to /api/questions/filters with body parameters for filtering
app.post('/api/questions/filter', async (req, res) => {
  try {
    const { DifficultyLevel, type, Topic, chapter, Subject, ChapterPagenumber, BookTitle, Authors, Class } = req.body;

    const query = {};
    if (DifficultyLevel) query.DifficultyLevel = DifficultyLevel;
    if (type) query.QuestionType = type;
    if (Topic) query.Topic = Topic;
    if (chapter) query.Chaptername = chapter;
    if (Subject) query.Subject = Subject;
    if (ChapterPagenumber) query.ChapterPagenumber = ChapterPagenumber;
    if (BookTitle) query.BookTitle = BookTitle;
    if (Authors) query.Authors = Authors;
    if (Class) query.Class = Class;

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
