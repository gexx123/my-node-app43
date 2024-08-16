const express = require('express');
const router = express.Router();
const ClassModel = require('../models/ModelQuestion');

// Route to retrieve documents based on query parameters
router.get('/questions', async (req, res) => {
  try {
    const { className, subjectName } = req.query;

    // Logging incoming query parameters for debugging
    console.log("Received className query:", className);
    console.log("Received subjectName query:", subjectName);

    let query = {};

    // Build query to filter by className
    if (className) {
      query.className = className;
    }

    // Find class document by className
    const classResult = await ClassModel.findOne(query);

    if (!classResult) {
      console.log("Class not found for className:", className);
      return res.status(404).json({ message: 'Class not found' });
    }

    let subjects = classResult.subjects;

    // Filter subjects within the class by subjectName if provided
    if (subjectName) {
      subjects = subjects.filter(subject => subject.subjectName === subjectName);

      if (subjects.length === 0) {
        console.log("No subjects found for subjectName:", subjectName);
        return res.status(404).json({ message: 'Subject not found for the given class' });
      }
    }

    // Log the found subjects for debugging
    console.log("Subjects found:", subjects);

    // Return the filtered results
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

module.exports = router;
