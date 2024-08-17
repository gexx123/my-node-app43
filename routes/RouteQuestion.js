const express = require('express');
const router = express.Router();
const ClassModel = require('../models/ModelQuestion');

// Route to retrieve documents based on query parameters
router.get('/questions', async (req, res) => {
  try {
    const { className, subjectName, chapterName, questionText } = req.query;

    let query = {};

    if (className) {
      query.className = className;
    }

    // Find the class based on className (if provided)
    const classResult = await ClassModel.findOne(query).lean();

    if (!classResult) {
      return res.status(404).json({ message: 'Class not found' });
    }

    let subjects = classResult.subjects;

    // Filter subjects if subjectName is provided
    if (subjectName) {
      subjects = subjects.filter(subject => subject.subjectName === subjectName);
      if (subjects.length === 0) {
        return res.status(404).json({ message: 'Subject not found' });
      }
    }

    // Filter chapters if chapterName is provided
    if (chapterName) {
      subjects = subjects.map(subject => {
        const filteredChapters = subject.chapters.filter(chapter => chapter.chapterName === chapterName);
        if (filteredChapters.length === 0) {
          return res.status(404).json({ message: 'Chapter not found' });
        }
        return {
          ...subject,
          chapters: filteredChapters
        };
      });
    }

    // Filter questions if questionText is provided
    if (questionText) {
      const regex = new RegExp(questionText, 'i'); // case-insensitive search
      subjects = subjects.map(subject => {
        const filteredChapters = subject.chapters.map(chapter => {
          const filteredQuestions = chapter.questions.filter(question => regex.test(question.questionText));
          if (filteredQuestions.length === 0) {
            return res.status(404).json({ message: 'No questions matching the text found' });
          }
          return {
            ...chapter,
            questions: filteredQuestions
          };
        });
        return {
          ...subject,
          chapters: filteredChapters
        };
      });
    }

    res.status(200).json({
      message: 'Questions retrieved successfully',
      className: classResult.className,
      subjects: subjects
    });

  } catch (error) {
    console.error('Error fetching questions:', error);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
});

// Route to retrieve all distinct class names
router.get('/classnames', async (req, res) => {
  try {
    const classNames = await ClassModel.distinct("className");

    if (!classNames.length) {
      return res.status(404).json({ message: 'No classes found' });
    }

    res.status(200).json({
      message: 'Class names retrieved successfully',
      classNames: classNames
    });

  } catch (error) {
    console.error('Error fetching class names:', error);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
});

// Route to retrieve all documents from the collection
router.get('/allclasses', async (req, res) => {
  try {
    const allClasses = await ClassModel.find({}).lean();

    if (!allClasses.length) {
      return res.status(404).json({ message: 'No classes found' });
    }

    res.status(200).json({
      message: 'All classes retrieved successfully',
      classes: allClasses
    });

  } catch (error) {
    console.error('Error fetching all classes:', error);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
});

module.exports = router;