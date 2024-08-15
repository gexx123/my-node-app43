const express = require('express');
const router = express.Router();
const ClassModel = require('../models/ModelQuestion');

// Route to retrieve documents based on query parameters
router.get('/questions', async (req, res) => {
  try {
    const { 
      className, 
      subjectName, 
      chapterName, 
      questionText,
      difficultyLevel,
      topic,
      questionType,
      bookTitle,
      authors,
      chapterPageNumber,
      imagePath,
      tableDataPath 
    } = req.query;

    const query = {};

    if (className) {
      query.className = className;
    }

    if (subjectName) {
      query['subjects'] = { $elemMatch: { subjectName: subjectName } };
    }

    if (chapterName) {
      query['subjects.chapters'] = { $elemMatch: { chapterName: chapterName } };
    }

    if (questionText) {
      query['subjects.chapters.questions'] = { $elemMatch: { questionText: questionText } };
    }

    if (difficultyLevel) {
      query['subjects.chapters.questions.metaData.difficultyLevel'] = difficultyLevel;
    }

    if (topic) {
      query['subjects.chapters.questions.metaData.topic'] = topic;
    }

    if (questionType) {
      query['subjects.chapters.questions.metaData.questionType'] = questionType;
    }

    if (bookTitle) {
      query['subjects.chapters.questions.metaData.bookTitle'] = bookTitle;
    }

    if (authors) {
      query['subjects.chapters.questions.metaData.authors'] = authors;
    }

    if (chapterPageNumber) {
      query['subjects.chapters.questions.metaData.chapterPageNumber'] = chapterPageNumber;
    }

    if (imagePath) {
      query['subjects.chapters.questions.metaData.resources.imagePath'] = imagePath;
    }

    if (tableDataPath) {
      query['subjects.chapters.questions.metaData.resources.tableDataPath'] = tableDataPath;
    }

    const classes = await ClassModel.find(query);

    res.status(200).json({ message: 'Questions retrieved successfully', classes });
  } catch (error) {
    console.error('Error fetching questions:', error);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
});

module.exports = router;
