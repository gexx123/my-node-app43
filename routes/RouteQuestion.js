// routes/RouteQuestion.js
const express = require('express');
const router = express.Router();
const Question = require('../models/Question');

// GET /api/questions
// Filters: class, subject, chapter, difficulty, tags (comma), isVerified, q (text),
// Pagination: limit, skip; Sort by createdAt desc by default
router.get('/questions', async (req, res) => {
  try {
    const {
      class: classFilter,
      subject,
      chapter,
      difficulty,
      tags,
      isVerified,
      q,
      limit = 20,
      skip = 0,
      sort = '-createdAt'
    } = req.query;

    const query = {};

    if (classFilter !== undefined) query.class = isNaN(Number(classFilter)) ? classFilter : Number(classFilter);
    if (subject) query.subject = subject;
    if (chapter) query.chapter = chapter;
    if (difficulty) query.difficulty = difficulty;
    if (typeof isVerified !== 'undefined') query.isVerified = isVerified === 'true';

    if (tags) {
      const arr = Array.isArray(tags) ? tags : String(tags).split(',').map(t => t.trim()).filter(Boolean);
      if (arr.length) query.tags = { $in: arr };
    }

    // Text search (requires text index)
    if (q) {
      query.$text = { $search: q };
    }

    const cursor = Question.find(query)
      .sort(sort)
      .skip(Number(skip))
      .limit(Math.min(Number(limit), 100)); // cap to avoid abuse

    // For textScore sorting if q is used
    if (q) cursor.select({ score: { $meta: 'textScore' } }).sort({ score: { $meta: 'textScore' }, createdAt: -1 });

    const [items, total] = await Promise.all([
      cursor.lean(),
      Question.countDocuments(query)
    ]);

    res.json({
      message: 'Questions retrieved successfully',
      total,
      limit: Number(limit),
      skip: Number(skip),
      data: items
    });
  } catch (error) {
    console.error('GET /questions error:', error);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
});

// GET /api/questions/:id
router.get('/questions/:id', async (req, res) => {
  try {
    const doc = await Question.findOne({ id: req.params.id }).lean();
    if (!doc) return res.status(404).json({ message: 'Not found' });
    res.json(doc);
  } catch (error) {
    console.error('GET /questions/:id error:', error);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
});

// POST /api/questions
// Upsert by id (create or update); server sets timestamps
router.post('/questions', async (req, res) => {
  try {
    const payload = req.body;
    if (!payload || !payload.id) {
      return res.status(400).json({ message: 'id is required' });
    }

    const now = new Date();
    payload.updatedAt = now;
    if (!payload.createdAt) payload.createdAt = now;

    const result = await Question.findOneAndUpdate(
      { id: payload.id },
      { $set: payload },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    ).lean();

    res.status(201).json({ message: 'Upsert successful', data: result });
  } catch (error) {
    console.error('POST /questions error:', error);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
});

module.exports = router;
