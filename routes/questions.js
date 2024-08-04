const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Define your Mongoose schema and model
const questionSchema = new mongoose.Schema({
  text: String,
  label: String
});
const Question = mongoose.model('Question', questionSchema);

// Route to handle POST request to /api/questions
router.post('/questions', async (req, res) => {
  try {
    const { entities } = req.body;

    if (!entities || !Array.isArray(entities)) {
      return res.status(400).send('Bad Request: Missing or invalid "entities"');
    }

    // Example logic to handle the incoming entities and save to MongoDB
    const questions = entities.map(entity => new Question(entity));
    await Question.insertMany(questions);

    res.status(201).json({ message: 'Questions saved successfully', questions });
  } catch (error) {
    console.error('Error saving questions:', error);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
});

module.exports = router;
