const express = require('express');
const router = express.Router();
const ClassModel = require('../models/ModelQuestion');

// Route to retrieve documents based on query parameters
router.get('/questions', async (req, res) => {
  try {
    const { className, subjectName, chapterName, questionText } = req.query;

    // Find the class based on className
    const classResult = await ClassModel.findOne({ className });

    if (!classResult) {
      return res.status(404).json({ message: 'Class not found' });
    }

    let filteredSubjects = classResult.subjects;

    // Filter by subjectName if provided
    if (subjectName) {
      filteredSubjects = filteredSubjects.filter(subject => subject.subjectName === subjectName);
    }

    // Filter chapters within the filtered subjects if chapterName is provided
    if (chapterName) {
      filteredSubjects = filteredSubjects.map(subject => {
        return {
          ...subject._doc,
          chapters: subject.chapters.filter(chapter => chapter.chapterName === chapterName)
        };
      });
    }

    // Filter questions within the filtered chapters if questionText is provided
    if (questionText) {
      filteredSubjects = filteredSubjects.map(subject => {
        return {
          ...subject._doc,
          chapters: subject.chapters.map(chapter => {
            return {
              ...chapter._doc,
              questions: chapter.questions.filter(question => question.questionText.includes(questionText))
            };
          })
        };
      });
    }

    // Return the filtered results
    res.status(200).json({
      message: 'Questions retrieved successfully',
      className: classResult.className,
      subjects: filteredSubjects
    });

  } catch (error) {
    console.error('Error fetching questions:', error);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
});

module.exports = router;
