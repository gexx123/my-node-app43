const express = require('express');
const router = express.Router();
const ClassModel = require('../models/ModelQuestion');

// Route to retrieve documents based on query parameters (Existing route)
router.get('/questions', async (req, res) => {
  try {
    const { className, subjectName } = req.query;

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

module.exports = router;
