const express = require('express');
const router = express.Router();
const Question = require('../models/question'); // Adjust the path according to your folder structure

// Route to handle GET request to /api/questions with query parameters for filtering
router.get('/questions', async (req, res) => {
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

// Route to handle POST request to /api/questions/filter for filtering questions
router.post('/questions/filter', async (req, res) => {
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

module.exports = router;
