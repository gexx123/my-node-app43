const express = require('express');
const router = express.Router();
const ClassModel = require('../models/ModelQuestion');

router.get('/questions', async (req, res) => {
    try {
        const { className, subjectName, chapterName, questionText } = req.query;

        const matchConditions = [];

        if (className) {
            matchConditions.push({ className: className });
        }

        if (subjectName) {
            matchConditions.push({ 'subjects.subjectName': subjectName });
        }

        if (chapterName) {
            matchConditions.push({ 'subjects.chapters.chapterName': chapterName });
        }

        if (questionText) {
            matchConditions.push({ 'subjects.chapters.questions.questionText': questionText });
        }

        const classes = await ClassModel.aggregate([
            { $match: matchConditions.length > 0 ? { $and: matchConditions } : {} },
            { $unwind: '$subjects' },
            { $unwind: '$subjects.chapters' },
            { $unwind: '$subjects.chapters.questions' },
            { $group: {
                _id: '$className',
                subjects: { $push: '$subjects' }
            }}
        ]);

        res.status(200).json({ message: 'Questions retrieved successfully', classes });
    } catch (error) {
        console.error('Error fetching questions:', error);
        res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
});

module.exports = router;
