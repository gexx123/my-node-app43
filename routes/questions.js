const express = require('express');
const router = express.Router();
const Question = require('../models/question');  // Ensure the correct path

// Route to handle POST request to /api/questions
router.post('/', async (req, res) => {
  try {
    const { entities } = req.body;

    if (!entities || !Array.isArray(entities)) {
      return res.status(400).send('Bad Request: Missing or invalid "entities"');
    }

    const questions = entities.map(entity => new Question(entity));
    await Question.insertMany(questions);

    res.status(201).json({ message: 'Questions saved successfully', questions });
  } catch (error) {
    console.error('Error saving questions:', error);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
});

module.exports = router;
