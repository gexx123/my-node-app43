const express = require('express');
const router = express.Router();
const ClassModel = require('../models/ModelQuestion');

// Route to retrieve all documents
router.get('/questions', async (req, res) => {
  try {
    const classes = await ClassModel.find({});
    console.log('Retrieved Classes:', JSON.stringify(classes, null, 2));  // Log retrieved classes

    res.status(200).json({ message: 'Questions retrieved successfully', classes });
  } catch (error) {
    console.error('Error fetching questions:', error);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
});

// Route to retrieve questions based on className
router.get('/questions/filter', async (req, res) => {
  try {
    const { className } = req.query;
    const classes = await ClassModel.find({ className });

    res.status(200).json({ message: 'Questions retrieved successfully', classes });
  } catch (error) {
    console.error('Error fetching questions:', error);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
});

module.exports = router;
