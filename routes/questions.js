const express = require('express');
const router = express.Router();
const Question = require('../models/Question');

// Route to handle POST request to /api/questions
router.post('/', async (req, res) => {
  try {
    const { entities } = req.body;

    if (!entities || !Array.isArray(entities)) {
      return res.status(400).send('Bad Request: Missing or invalid "entities"');
    }

    // Example logic to handle the incoming entities and save to MongoDB
    const questions = await Question.find({
      $or: entities.map(entity => {
        let key;
        switch (entity.label) {
          case 'SUBJECT':
            key = 'Subject';
            break;
          case 'CHAPTER':
            key = 'chapter';
            break;
          case 'DIFFICULTYLEVEL':
            key = 'DifficultyLevel';
            break;
          case 'TOPIC':
            key = 'Topic';
            break;
          case 'QUESTIONTYPE':
            key = 'QuestionType';
            break;
          case 'BOOKTITLE':
            key = 'BookTitle';
            break;
          case 'AUTHORS':
            key = 'Authors';
            break;
          case 'CLASS':
            key = 'Class';
            break;
          default:
            key = entity.label.toLowerCase();
        }
        return { [key]: entity.text };
      })
    });

    res.status(201).json({ message: 'Questions retrieved successfully', questions });
  } catch (error) {
    console.error('Error retrieving questions:', error);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
});

module.exports = router;
