const express = require('express');
const router = express.Router();
const ClassModel = require('../models/ModelQuestion'); // Adjust the path according to your folder structure

// Route to handle GET request to /api/questions with query parameters for filtering
router.get('/questions', async (req, res) => {
  try {
    const { subject, chapter, difficulty, type, topic, className } = req.query;

    const query = {};
    if (className) query['className'] = className;
    if (subject) query['subjects.subjectName'] = subject;
    if (chapter) query['subjects.chapters.chapterName'] = chapter;
    if (difficulty) query['subjects.chapters.questions.metaData.difficultyLevel'] = difficulty;
    if (type) query['subjects.chapters.questions.metaData.questionType'] = type;
    if (topic) query['subjects.chapters.questions.metaData.topic'] = topic;

    const classes = await ClassModel.find(query);

    // Extract the questions from the nested structure
    const questions = [];
    classes.forEach(cls => {
      cls.subjects.forEach(sub => {
        sub.chapters.forEach(ch => {
          ch.questions.forEach(q => {
            questions.push({
              questionText: q.questionText,
              metaData: q.metaData
            });
          });
        });
      });
    });

    res.status(200).json({ message: 'Questions retrieved successfully', questions });
  } catch (error) {
    console.error('Error fetching questions:', error);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
});

// Route to handle POST request to /api/questions/filter with query parameters for filtering
router.post('/questions/filter', async (req, res) => {
  try {
    const { difficultyLevel, type, topic, chapter, subject, chapterPageNumber, bookTitle, authors, className } = req.body;

    const query = {};
    if (className) query['className'] = className;
    if (subject) query['subjects.subjectName'] = subject;
    if (chapter) query['subjects.chapters.chapterName'] = chapter;
    if (difficultyLevel) query['subjects.chapters.questions.metaData.difficultyLevel'] = difficultyLevel;
    if (type) query['subjects.chapters.questions.metaData.questionType'] = type;
    if (topic) query['subjects.chapters.questions.metaData.topic'] = topic;
    if (chapterPageNumber) query['subjects.chapters.questions.metaData.chapterPageNumber'] = chapterPageNumber;
    if (bookTitle) query['subjects.chapters.questions.metaData.bookTitle'] = bookTitle;
    if (authors) query['subjects.chapters.questions.metaData.authors'] = authors;

    const classes = await ClassModel.find(query);

    // Extract the questions from the nested structure
    const questions = [];
    classes.forEach(cls => {
      cls.subjects.forEach(sub => {
        sub.chapters.forEach(ch => {
          ch.questions.forEach(q => {
            questions.push({
              questionText: q.questionText,
              metaData: q.metaData
            });
          });
        });
      });
    });

    res.status(200).json({ message: 'Questions retrieved successfully', questions });
  } catch (error) {
    console.error('Error fetching questions:', error);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
});

module.exports = router;