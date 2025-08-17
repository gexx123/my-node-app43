// routes/RouteQuestion.js
const express = require('express');
const router = express.Router();
const Question = require('../models/Question');

// GET /api/questions
// Filters: class, subject, chapter, difficulty, tags (comma), isVerified (true/false)
// Pagination: limit, skip | Sort: createdAt:-1 by default
router.get('/questions', async (req, res) => {
  try {
    const {
      class: cls,
      subject,
      chapter,
      difficulty,
      tags,
      isVerified,
      limit = 20,
      skip = 0,
      sort = '-createdAt',
    } = req.query;

    const q = {};

    if (cls !== undefined) q.class = isNaN(Number(cls)) ? cls : Number(cls);
    if (subject) q.subject = subject;
    if (chapter) q.chapter = chapter;
    if (difficulty) q.difficulty = difficulty;
    if (typeof isVerified !== 'undefined') q.isVerified = String(isVerified).toLowerCase() === 'true';

    if (tags) {
      const arr = String(tags).split(',').map(s => s.trim()).filter(Boolean);
      if (arr.length) q.tags = { $in: arr };
    }

    // parse sort string like "-createdAt,subject"
    const sortObj = {};
    String(sort).split(',').forEach(part => {
      part = part.trim();
      if (!part) return;
      if (part.startsWith('-')) sortObj[part.slice(1)] = -1;
      else sortObj[part] = 1;
    });

    const data = await Question
      .find(q)
      .sort(Object.keys(sortObj).length ? sortObj : { createdAt: -1 })
      .skip(Number(skip) || 0)
      .limit(Math.min(Number(limit) || 20, 100));

    res.json({ message: 'ok', count: data.length, items: data });
  } catch (err) {
    console.error('GET /questions error:', err);
    res.status(500).json({ error: 'Internal Server Error', details: err.message });
  }
});

// GET /api/questions/search?q=...&class=...&subject=... (text search)
router.get('/questions/search', async (req, res) => {
  try {
    const { q: query, class: cls, subject, limit = 20, skip = 0 } = req.query;
    if (!query || !String(query).trim()) {
      return res.status(400).json({ error: 'Missing q parameter' });
    }

    const filter = { $text: { $search: String(query) } };
    if (cls !== undefined) filter.class = isNaN(Number(cls)) ? cls : Number(cls);
    if (subject) filter.subject = subject;

    const items = await Question
      .find(filter, { score: { $meta: 'textScore' } })
      .sort({ score: { $meta: 'textScore' }, createdAt: -1 })
      .skip(Number(skip) || 0)
      .limit(Math.min(Number(limit) || 20, 100));

    res.json({ message: 'ok', count: items.length, items });
  } catch (err) {
    console.error('GET /questions/search error:', err);
    res.status(500).json({ error: 'Internal Server Error', details: err.message });
  }
});

// GET /api/questions/:id
router.get('/questions/:id', async (req, res) => {
  try {
    const doc = await Question.findOne({ id: req.params.id });
    if (!doc) return res.status(404).json({ error: 'Not found' });
    res.json(doc);
  } catch (err) {
    console.error('GET /questions/:id error:', err);
    res.status(500).json({ error: 'Internal Server Error', details: err.message });
  }
});

// POST /api/questions (upsert by id)
router.post('/questions', async (req, res) => {
  try {
    const payload = req.body || {};

    if (!payload.id) {
      return res.status(400).json({ error: 'id is required' });
    }

    // set timestamps
    const now = new Date();
    payload.updatedAt = now;
    if (!payload.createdAt) payload.createdAt = now;

    const result = await Question.findOneAndUpdate(
      { id: payload.id },
      { $set: payload },
      { new: true, upsert: true, runValidators: true }
    );

    res.status(201).json({ message: 'upserted', item: result });
  } catch (err) {
    console.error('POST /questions error:', err);
    // Duplicate id unique index or validation errors bubble here
    res.status(400).json({ error: 'Bad Request', details: err.message });
  }
});

module.exports = router;
