const express = require('express');
const router = express.Router();
const ClassModel = require('../models/ModelQuestion');

// Route to retrieve documents based on query parameters
router.get('/questions', async (req, res) => {
  try {
    const { className, subjectName } = req.query;

    // Debugging log to see the incoming query parameter
    console.log("Received className query:", className);
    console.log("Received subjectName query:", subjectName);

    let query = {};

    // If className is provided, use it to filter the results
    if (className) {
      query.className = className;
    }

    // Find the class based on className (if provided)
    const classResult = await ClassModel.findOne(query);

    if (!classResult) {
      console.log("Class not found for className:", className);
      return res.status(404).json({ message: 'Class not found' });
    }

    let subjects = classResult.subjects;

    // If subjectName is provided, filter the subjects within the class
    if (subjectName) {
      subjects = subjects.filter(subject => subject.subjectName === subjectName);
    }

    console.log("Subjects found:", subjects);

    // Return only the relevant subjects
    res.status(200).json({
      message: 'Questions retrieved successfully',
      className: classResult.className,
      subjects: subjects
    });

  } catch (error) {
    // Catch any errors and log them for debugging
    console.error('Error fetching questions:', error);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
});

module.exports = router;
