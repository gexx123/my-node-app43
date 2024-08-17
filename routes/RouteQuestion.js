const express = require('express');
const router = express.Router();
const ClassModel = require('../models/ModelQuestion');

// Route to retrieve documents based on query parameters (GET)
router.get('/questions', async (req, res) => {
  try {
    const { className, subjectName, chapterName, questionText, difficultyLevel, topic, questionType, bookTitle } = req.query;

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

    // If subjectName is provided, filter the subjects within the class
    if (subjectName) {
      subjects = subjects.filter(subject => subject.subjectName === subjectName);
      if (subjects.length === 0) {
        return res.status(404).json({ message: 'Subject not found' });
      }
    }

    // If chapterName is provided, filter the chapters within the subjects
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

    // Filter questions by metadata if any of the metadata parameters are provided
    subjects = subjects.map(subject => {
      const filteredChapters = subject.chapters.map(chapter => {
        let questions = chapter.questions;

        if (questionText) {
          const regex = new RegExp(questionText, 'i'); // case-insensitive search
          questions = questions.filter(question => regex.test(question.questionText));
        }

        if (difficultyLevel) {
          questions = questions.filter(question => question.metaData.difficultyLevel === difficultyLevel);
        }

        if (topic) {
          questions = questions.filter(question => question.metaData.topic === topic);
        }

        if (questionType) {
          questions = questions.filter(question => question.metaData.questionType === questionType);
        }

        if (bookTitle) {
          questions = questions.filter(question => question.metaData.bookTitle === bookTitle);
        }

        return {
          ...chapter,
          questions: questions
        };
      });

      return {
        ...subject,
        chapters: filteredChapters
      };
    });

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

// Route to retrieve documents based on request body parameters (POST)
router.post('/questions', async (req, res) => {
  try {
    const { className, subjectName, chapterName, questionText, difficultyLevel, topic, questionType, bookTitle } = req.body;

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

    // If subjectName is provided, filter the subjects within the class
    if (subjectName) {
      subjects = subjects.filter(subject => subject.subjectName === subjectName);
      if (subjects.length === 0) {
        return res.status(404).json({ message: 'Subject not found' });
      }
    }

    // If chapterName is provided, filter the chapters within the subjects
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

    // Filter questions by metadata if any of the metadata parameters are provided
    subjects = subjects.map(subject => {
      const filteredChapters = subject.chapters.map(chapter => {
        let questions = chapter.questions;

        if (questionText) {
          const regex = new RegExp(questionText, 'i'); // case-insensitive search
          questions = questions.filter(question => regex.test(question.questionText));
        }

        if (difficultyLevel) {
          questions = questions.filter(question => question.metaData.difficultyLevel === difficultyLevel);
        }

        if (topic) {
          questions = questions.filter(question => question.metaData.topic === topic);
        }

        if (questionType) {
          questions = questions.filter(question => question.metaData.questionType === questionType);
        }

        if (bookTitle) {
          questions = questions.filter(question => question.metaData.bookTitle === bookTitle);
        }

        return {
          ...chapter,
          questions: questions
        };
      });

      return {
        ...subject,
        chapters: filteredChapters
      };
    });

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