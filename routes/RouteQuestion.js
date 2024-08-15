const express = require('express');
const router = express.Router();
const ClassModel = require('../models/ModelQuestion');

// Route to retrieve documents based on query parameters
router.get('/questions', async (req, res) => {
  try {
    const { className } = req.query;

    // Debugging log to see the incoming query parameter
    console.log("Received className query:", className);

    // Find the class based on className
    const classResult = await ClassModel.findOne({ className });

    // Debugging log to see the result from MongoDB
    if (!classResult) {
      console.log("Class not found for className:", className);
      return res.status(404).json({ message: 'Class not found' });
    }

    console.log("Class found:", classResult);

    // Respond with the found class and its subjects
    res.status(200).json({
      message: 'Questions retrieved successfully',
      className: classResult.className,
      subjects: classResult.subjects
    });

  } catch (error) {
    // Catch any errors and log them for debugging
    console.error('Error fetching questions:', error);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
});

module.exports = router;
