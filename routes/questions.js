const express = require('express');
const router = express.Router();
const Question = require('../models/question');

// Get all questions
router.get('/questions', async (req, res) => {
  try {
    const questions = await Question.find();
    res.json(questions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get questions with filters
router.get('/questions/filter', async (req, res) => {
  try {
    const { subject, difficultyLevel, topic } = req.query;
    const filters = {};
    if (subject) filters.subject = subject;
    if (difficultyLevel) filters.difficultyLevel = difficultyLevel;
    if (topic) filters.topic = topic;

    const questions = await Question.find(filters);
    res.json(questions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new question
router.post('/questions', async (req, res) => {
  const question = new Question({
    questionText: req.body.questionText,
    difficultyLevel: req.body.difficultyLevel,
    subject: req.body.subject,
    chapterName: req.body.chapterName,
    chapterPageNumber: req.body.chapterPageNumber,
    imagePath: req.body.imagePath,
    tableDataPath: req.body.tableDataPath,
    topic: req.body.topic,
    questionType: req.body.questionType,
    bookTitle: req.body.bookTitle,
    authors: req.body.authors
  });

  try {
    const newQuestion = await question.save();
    res.status(201).json(newQuestion);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update a question
router.patch('/questions/:id', async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question) return res.status(404).json({ message: 'Question not found' });

    Object.keys(req.body).forEach(key => {
      question[key] = req.body[key];
    });

    const updatedQuestion = await question.save();
    res.json(updatedQuestion);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
