// routes/RouteQuestion.js
const express = require('express');
const router = express.Router();
const Question = require('../models/Question');

// Build filters from query
function buildFilters(q) {
  const filter = {};
  if (q.class !== undefined) filter.class = isNaN(Number(q.class)) ? q.class : Number(q.class);
  if (q.subject) filter.subject = q.subject;
  if (q.chapter) filter.chapter = q.chapter;
  if (q.difficulty) filter.difficulty = q.difficulty;
  if (q.board) filter.board = q.board;
  if (q.isVerified !== undefined) filter.isVerified = q.isVerified === 'true';
  if (q.tags) filter.tags = { $in: q.tags.split(',').map(s => s.trim()).filter(Boolean) };
  if (q.isPublic !== undefined) filter['accessControl.isPublic'] = q.isPublic === 'true';
  return filter;
}

// GET /api/questions
router.get('/questions', async (req, res) => {
  try {
    const filter = buildFilters(req.query);
    const limit = Math.min(parseInt(req.query.limit || '20', 10), 100);
    const skip = parseInt(req.query.skip || '0', 10);
    const sort = req.query.sort || '-createdAt'; // e.g., '-createdAt' or 'createdAt'

    const projection = req.query.fields
      ? req.query.fields.split(',').reduce((p, f) => (p[f] = 1, p), {})
      : undefined;

    const [items, total] = await Promise.all([
      Question.find(filter, projection).sort(sort).skip(skip).limit(limit).lean(),
      Question.countDocuments(filter),
    ]);

    res.json({ total, limit, skip, items });
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error', details: err.message });
  }
});

// GET /api/questions/search?q=...
router.get('/questions/search', async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.status(400).json({ error: 'Missing q' });

    const filter = buildFilters(req.query);
    const limit = Math.min(parseInt(req.query.limit || '20', 10), 50);
    const skip = parseInt(req.query.skip || '0', 10);

    const items = await Question
      .find({ $text: { $search: q }, ...filter }, { score: { $meta: 'textScore' } })
      .sort({ score: { $meta: 'textScore' }, createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    res.json({ total: items.length, limit, skip, items });
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error', details: err.message });
  }
});

// GET /api/questions/:id
router.get('/questions/:id', async (req, res) => {
  try {
    const doc = await Question.findOne({ id: req.params.id }).lean();
    if (!doc) return res.status(404).json({ error: 'Not found' });
    res.json(doc);
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error', details: err.message });
  }
});

// POST /api/questions (upsert by id)
router.post('/questions', async (req, res) => {
  try {
    const payload = req.body;
    if (!payload || !payload.id) {
      return res.status(400).json({ error: 'Missing id in body' });
    }

    // Ensure minimal required fields for validator
    if (!payload.createdBy) payload.createdBy = 'system';

    const doc = await Question.findOneAndUpdate(
      { id: payload.id },
      { $set: payload },
      { upsert: true, new: true, runValidators: true }
    );

    res.status(201).json({ message: 'Upserted', item: doc });
  } catch (err) {
    res.status(400).json({ error: 'Validation/Write error', details: err.message });
  }
});

// POST /api/questions/bulk (bulk upsert by id)
router.post('/questions/bulk', async (req, res) => {
  try {
    const items = Array.isArray(req.body) ? req.body : [];
    if (!items.length) return res.status(400).json({ error: 'Body must be an array of questions' });

    const ops = items.map(d => ({
      updateOne: {
        filter: { id: d.id },
        update: { $set: { createdBy: 'system', ...d } },
        upsert: true,
      }
    }));

    const result = await Question.bulkWrite(ops, { ordered: false });
    res.status(201).json({ message: 'Bulk upsert complete', result });
  } catch (err) {
    res.status(400).json({ error: 'Bulk write error', details: err.message });
  }
});

module.exports = router;
