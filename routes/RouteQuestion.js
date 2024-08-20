const express = require('express');
const router = express.Router();
const ClassModel = require('../models/ModelQuestion');

// GET API: Retrieve documents based on query parameters
router.get('/questions', async (req, res) => {
    try {
        const { className, subjectName, chapterName, questionText } = req.query;

        let query = {};

        // If a className is provided, use it to filter, else get all classes
        if (className) {
            query.className = className;
        }

        const classResults = await ClassModel.find(query);

        if (!classResults.length) {
            return res.status(404).json({ message: 'No classes found' });
        }

        let filteredClasses = classResults;

        // Filter subjects if subjectName is provided
        if (subjectName) {
            filteredClasses = filteredClasses.map(classResult => ({
                ...classResult._doc,
                subjects: classResult.subjects.filter(subject => subject.subjectName === subjectName)
            }));
        }

        // Filter chapters if chapterName is provided
        if (chapterName) {
            filteredClasses = filteredClasses.map(classResult => ({
                ...classResult._doc,
                subjects: classResult.subjects.map(subject => ({
                    ...subject._doc,
                    chapters: subject.chapters.filter(chapter => chapter.chapterName === chapterName)
                }))
            }));
        }

        // Filter questions if questionText is provided
        if (questionText) {
            filteredClasses = filteredClasses.map(classResult => ({
                ...classResult._doc,
                subjects: classResult.subjects.map(subject => ({
                    ...subject._doc,
                    chapters: subject.chapters.map(chapter => ({
                        ...chapter._doc,
                        questions: chapter.questions.filter(question => question.questionText.includes(questionText))
                    }))
                }))
            }));
        }

        res.status(200).json({
            message: 'Questions retrieved successfully',
            classes: filteredClasses
        });

    } catch (error) {
        console.error('Error fetching questions:', error);
        res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
});

// POST API: Add a new question to an existing class
router.post('/addquestion', async (req, res) => {
    try {
        const { className, subjectName, chapterName, questionText, metaData } = req.body;

        const classDoc = await ClassModel.findOne({ className });

        if (!classDoc) {
            return res.status(404).json({ message: 'Class not found' });
        }

        const subject = classDoc.subjects.find(sub => sub.subjectName === subjectName);
        if (!subject) {
            return res.status(404).json({ message: 'Subject not found' });
        }

        const chapter = subject.chapters.find(ch => ch.chapterName === chapterName);
        if (!chapter) {
            return res.status(404).json({ message: 'Chapter not found' });
        }

        const newQuestion = {
            questionText,
            metaData
        };

        chapter.questions.push(newQuestion);
        await classDoc.save();

        res.status(201).json({
            message: 'New question added successfully',
            questionData: newQuestion
        });

    } catch (error) {
        console.error('Error adding question:', error);
        res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
});

// GET API: Retrieve all class names
router.get('/classnames', async (req, res) => {
    try {
        const classNames = await ClassModel.distinct("className");

        if (!classNames.length) {
            return res.status(404).json({ message: 'No classes found' });
        }

        res.status(200).json({
            message: 'Class names retrieved successfully',
            classNames: classNames
        });

    } catch (error) {
        console.error('Error fetching class names:', error);
        res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
});

// GET API: Retrieve all classes
router.get('/allclasses', async (req, res) => {
    try {
        const allClasses = await ClassModel.find({});

        if (!allClasses.length) {
            return res.status(404).json({ message: 'No classes found' });
        }

        res.status(200).json({
            message: 'All classes retrieved successfully',
            classes: allClasses
        });

    } catch (error) {
        console.error('Error fetching all classes:', error);
        res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
});

module.exports = router;