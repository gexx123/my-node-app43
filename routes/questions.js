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

    // Ensure the incoming entities have all the required fields
    const questions = entities.map(entity => new Question({
      chapter: entity.chapter,
      questionText: entity.questionText,
      DifficultyLevel: entity.DifficultyLevel,
      Subject: entity.Subject,
      Chaptername: entity.Chaptername,
      ChapterPagenumber: entity.ChapterPagenumber,
      ImagePath: entity.ImagePath,
      TableDataPath: entity.TableDataPath,
      Topic: entity.Topic,
      QuestionType: entity.QuestionType,
      BookTitle: entity.BookTitle,
      Authors: entity.Authors
    }));
    await Question.insertMany(questions);

    res.status(201).json({ message: 'Questions saved successfully', questions });
  } catch (error) {
    console.error('Error saving questions:', error);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
});

module.exports = router;
