const express = require('express');
const router = express.Router();
const ClassModel = require('../models/ModelQuestion');

// GET API: Retrieve documents based on query parameters
router.get('/questions', async (req, res) => {
  try {
    const { className, subjectName, chapterName, questionText } = req.query;

    let query = {};

    if (className) {
      query.className = className;
    }

    const classResult = await ClassModel.findOne(query);

    if (!classResult) {
      return res.status(404).json({ message: 'Class not found' });
    }

    let subjects = classResult.subjects;

    if (subjectName) {
      subjects = subjects.filter(subject => subject.subjectName === subjectName);
    }

    if (chapterName) {
      subjects = subjects.map(subject => ({
        ...subject._doc,
        chapters: subject.chapters.filter(chapter => chapter.chapterName === chapterName)
      }));
    }

    if (questionText) {
      subjects = subjects.map(subject => ({
        ...subject._doc,
        chapters: subject.chapters.map(chapter => ({
          ...chapter._doc,
          questions: chapter.questions.filter(question => question.questionText.includes(questionText))
        }))
      }));
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

// POST API: Add new class data
router.post('/addclass', async (req, res) => {
  try {
    const newClass = new ClassModel(req.body);

    // Save the new class to the database
    await newClass.save();

    res.status(201).json({
      message: 'New class added successfully',
      classData: newClass
    });

  } catch (error) {
    console.error('Error adding new class:', error);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
});

// GET API: Retrieve all class names
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

// GET API: Retrieve all classes
router.get('/allclasses', async (req, res) => {
  try {
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
