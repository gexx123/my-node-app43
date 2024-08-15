const express = require('express');
const router = express.Router();
const ClassModel = require('../models/ModelQuestion'); 

// Route to handle GET request to /api/questions to retrieve all questions
router.get('/questions', async (req, res) => {
  try {
    const classes = await ClassModel.find({});
    
    res.status(200).json({ message: 'Questions retrieved successfully', classes });
  } catch (error) {
    console.error('Error fetching questions:', error);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
});

module.exports = router;
