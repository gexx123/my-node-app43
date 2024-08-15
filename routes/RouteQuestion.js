const express = require('express');
const router = express.Router();
const ClassModel = require('../models/ModelQuestion');

// Route to retrieve questions based on className
router.get('/questions', async (req, res) => {
  try {
    const { className } = req.query;

    const query = {};
    if (className) query.className = className;

    const classes = await ClassModel.find(query);
    
    res.status(200).json({ message: 'Questions retrieved successfully', classes });
  } catch (error) {
    console.error('Error fetching questions:', error);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
});

module.exports = router;
