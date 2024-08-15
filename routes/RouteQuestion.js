const express = require('express');
const router = express.Router();
const ClassModel = require('../models/ModelQuestion');

// Route to handle GET request to /api/questions with query parameters for filtering
router.get('/questions', async (req, res) => {
  try {
    const { subject, chapter, difficulty, type, topic, className } = req.query;

    const query = {};
    if (className) query['className'] = className;
    if (subject) {
      query['subjects'] = { $elemMatch: { subjectName: subject } };
    }
    if (chapter) {
      query['subjects.chapters'] = { $elemMatch: { chapterName: chapter } };
    }
    if (difficulty || type || topic) {
      query['subjects.chapters.questions'] = {
        $elemMatch: {
          'metaData.difficultyLevel': difficulty,
          'metaData.questionType': type,
          'metaData.topic': topic,
        }
      };
    }

    console.log('Query:', JSON.stringify(query, null, 2));  // Log the query for debugging

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
