const express = require('express');
const router = express.Router();
const ClassModel = require('../models/ModelQuestion');

// Route to retrieve documents based on query parameters (Existing route)
router.get('/questions', async (req, res) => {
  try {
    const { className, subjectName, chapterName, questionText } = req.query;

    let query = {};

    if (className) {
      query.className = className;
    }

    // Find the class based on className (if provided)
    const classResult = await ClassModel.findOne(query);

    if (!classResult) {
      return res.status(404).json({ message: 'Class not found' });
    }

    let subjects = classResult.subjects;

    // If subjectName is provided, filter the subjects within the class
    if (subjectName) {
      subjects = subjects.filter(subject => subject.subjectName === subjectName);
    }

    // If chapterName is provided, filter the chapters within the subjects
    if (chapterName) {
      subjects = subjects.map(subject => {
        return {
          ...subject._doc,
          chapters: subject.chapters.filter(chapter => chapter.chapterName === chapterName)
        };
      });
    }

    // If questionText is provided, filter the questions within the chapters
    if (questionText) {
      subjects = subjects.map(subject => {
        return {
          ...subject._doc,
          chapters: subject.chapters.map(chapter => {
            return {
              ...chapter._doc,
              questions: chapter.questions.filter(question => question.questionText.includes(questionText))
            };
          })
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

// Route to retrieve all distinct class names (New route)
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

// Route to retrieve all documents from the collection (New route)
router.get('/allclasses', async (req, res) => {
  try {
    // Fetch all documents from the collection
    const allClasses = await ClassModel.find({});

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
