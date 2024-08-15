const express = require('express');
const router = express.Router();
const ClassModel = require('../models/ModelQuestion');

// Route to retrieve documents based on query parameters
router.get('/questions', async (req, res) => {
  try {
    const { className, subjectName, chapterName, questionText } = req.query;

    // Build the aggregation pipeline
    const pipeline = [];

    if (className) {
      pipeline.push({ $match: { className: className } });
    }

    if (subjectName) {
      pipeline.push({ $unwind: '$subjects' });
      pipeline.push({ $match: { 'subjects.subjectName': subjectName } });
    }

    if (chapterName) {
      pipeline.push({ $unwind: '$subjects.chapters' });
      pipeline.push({ $match: { 'subjects.chapters.chapterName': chapterName } });
    }

    if (questionText) {
      pipeline.push({ $unwind: '$subjects.chapters.questions' });
      pipeline.push({ $match: { 'subjects.chapters.questions.questionText': questionText } });
    }

    // Optionally, if you want to return only the matching questions
    pipeline.push({
      $group: {
        _id: '$_id',
        className: { $first: '$className' },
        subjects: { $push: '$subjects' }
      }
    });

    console.log("Aggregation Pipeline:", JSON.stringify(pipeline, null, 2));

    const classes = await ClassModel.aggregate(pipeline);

    if (classes.length === 0) {
      return res.status(200).json({ message: 'No questions found', classes: [] });
    }

    res.status(200).json({ message: 'Questions retrieved successfully', classes });
  } catch (error) {
    console.error('Error fetching questions:', error);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
});

module.exports = router;