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

// POST API: Retrieve documents based on query parameters sent in the body
router.post('/getquestions', async (req, res) => {
  try {
    const { className, subjectName, chapterName, questionText, metaData } = req.body;

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

    if (metaData) {
      subjects = subjects.map(subject => ({
        ...subject._doc,
        chapters: subject.chapters.map(chapter => ({
          ...chapter._doc,
          questions: chapter.questions.filter(question => {
            return Object.keys(metaData).every(key => question.metaData[key] === metaData[key]);
          })
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

// POST API: Add new question data
router.post('/addquestion', async (req, res) => {
  try {
    const { className, subjectName, chapterName, questionText, metaData } = req.body;

    let query = { className };
    let classResult = await ClassModel.findOne(query);

    if (!classResult) {
      return res.status(404).json({ message: 'Class not found' });
    }

    let subject = classResult.subjects.find(sub => sub.subjectName === subjectName);
    if (!subject) {
      return res.status(404).json({ message: 'Subject not found' });
    }

    let chapter = subject.chapters.find(chap => chap.chapterName === chapterName);
    if (!chapter) {
      return res.status(404).json({ message: 'Chapter not found' });
    }

    // Add the new question to the chapter
    chapter.questions.push({ questionText, metaData });

    // Save the updated class document
    await classResult.save();

    res.status(201).json({
      message: 'New question added successfully',
      questionData: {
        questionText,
        metaData
      }
    });

  } catch (error) {
    console.error('Error adding question:', error);
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