const express = require('express');
const router = express.Router();
const Question = require('../model/question'); // Adjust the path according to your folder structure

// Route to handle GET request to /api/questions with query parameters for filtering
router.get('/api/questions', async (req, res) => {
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

// Route to handle POST request to /api/questions/filter with query parameters for filtering
router.post('/api/questions/filter', async (req, res) => {
  try {
    const { difficultyLevel, type, topic, chapter, subject, chapterPagenumber, bookTitle, authors, class: classFilter } = req.body;

    const query = {};
    if (difficultyLevel) query.DifficultyLevel = difficultyLevel;
    if (type) query.QuestionType = type;
    if (topic) query.Topic = topic;
    if (chapter) query.Chaptername = chapter;
    if (subject) query.Subject = subject;
    if (chapterPagenumber) query.ChapterPagenumber = chapterPagenumber;
    if (bookTitle) query.BookTitle = bookTitle;
    if (authors) query.Authors = authors;
    if (classFilter) query.Class = classFilter;

    const questions = await Question.find(query);

    res.status(200).json({ message: 'Questions retrieved successfully', questions });
  } catch (error) {
    console.error('Error fetching questions:', error);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
});

module.exports = router;
