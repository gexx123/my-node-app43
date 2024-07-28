const express = require('express');
const router = express.Router();
const Question = require('../models/Question');

router.get('/questions', async (req, res) => {
  try {
    const questions = await Question.find();
    console.log('Fetched Questions:', questions); // लॉगिंग जोड़ें
    res.json(questions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
