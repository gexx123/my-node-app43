const express = require('express');
const router = express.Router();
const ClassModel = require('../models/ModelQuestion');

// Route to retrieve documents based on query parameters
router.get('/questions', async (req, res) => {
  try {
    const { className, subjectName, chapterName, questionText } = req.query;

    // Building a dynamic query
    let query = {};

    if (className) {
      query['className'] = className;
    }
    if (subjectName) {
      query['subjects.subjectName'] = subjectName;
    }
    if (chapterName) {
      query['subjects.chapters.chapterName'] = chapterName;
    }
    if (questionText) {
      query['subjects.chapters.questions.questionText'] = questionText;
    }

    console.log("Query:", query);

    const result = await ClassModel.find(query);
    console.log("Results:", result);

    if (result.length === 0) {
      return res.status(200).json({ message: 'No questions found', classes: [] });
    }

    res.status(200).json({ message: 'Questions retrieved successfully', classes: result });
  } catch (error) {
    console.error('Error fetching questions:', error);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
});

module.exports = router;