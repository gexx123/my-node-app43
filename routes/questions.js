// routes/questions.js

const express = require('express');
const router = express.Router();
const Question = require('../question'); // Adjust the path if necessary

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

module.exports = router;
