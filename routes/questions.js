// routes/questions.js
const express = require('express');
const router = express.Router();
const Question = require('../models/Question');

// Helpers
function parseBool(v) {
  if (v === undefined) return undefined;
  if (typeof v === 'boolean') return v;
  const s = String(v).toLowerCase();
  if (['true', '1', 'yes'].includes(s)) return true;
  if (['false', '0', 'no'].includes(s)) return false;
  return undefined;
}

function toInt(v, def) {
  const n = parseInt(v, 10);
  return Number.isFinite(n) ? n : def;
}

// GET /api/questions
// Filters: class, subject, chapter, difficulty, tags (comma), isVerified, isPublic, board, chapterNumber
// Pagination: limit, skip
// Sort: sortBy=createdAt|updatedAt|usageCount, order=asc|desc
router.get('/questions', async (req, res) => {
  try {
    const {
      class: klass,
      subject,
      chapter,
      difficulty,
      board,
      chapterNumber,
      tags,
      isVerified,
      isPublic,
      limit,
      skip,
      sortBy,
      order
    } = req.query;

    const q = {};

    if (klass !== undefined) q.class = isNaN(Number(klass)) ? klass : Number(klass);
    if (subject) q.subject = subject;
    if (chapter) q.chapter = chapter;
    if (difficulty) q.difficulty = difficulty;
    if (board) q.board = board;
    if (chapterNumber !== undefined && chapterNumber !== '') q.chapterNumber = Number(chapterNumber);
    if (tags) q.tags = { $in: String(tags).split(',').map(t => t.trim()).filter(Boolean) };

    const v = parseBool(isVerified);
    if (v !== undefined) q.isVerified = v;

    const p = parseBool(isPublic);
    if (p !== undefined) q['accessControl.isPublic'] = p;

    const lim = Math.min(toInt(limit, 20), 100);
    const sk = toInt(skip, 0);

    const sortField = ['createdAt', 'updatedAt', 'usageCount'].includes(String(sortBy))
      ? String(sortBy)
      : 'createdAt';
    const sortOrder = String(order).toLowerCase() === 'asc' ? 1 : -1;
    const sort = { [sortField]: sortOrder };

    const [total, items] = await Promise.all([
      Question.countDocuments(q),
      Question.find(q).sort(sort).skip(sk).limit(lim).lean()
    ]);

    res.json({ total, count: items.length, items });
  } catch (err) {
    console.error('GET /questions error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// GET /api/questions/:id
router.get('/questions/:id', async (req, res) => {
  try {
    const doc = await Question.findOne({ id: req.params.id }).lean();
    if (!doc) return res.status(404).json({ error: 'Not found' });
    res.json(doc);
  } catch (err) {
    console.error('GET /questions/:id error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// GET /api/questions/search?q=...&class=...&subject=... (text search + filters)
router.get('/questions/search', async (req, res) => {
  try {
    const { q: query, class: klass, subject, chapter, limit, skip } = req.query;

    if (!query || !String(query).trim()) {
      return res.status(400).json({ error: 'Missing q parameter' });
    }

    const filter = { $text: { $search: query } };
    if (klass !== undefined) filter.class = isNaN(Number(klass)) ? klass : Number(klass);
    if (subject) filter.subject = subject;
    if (chapter) filter.chapter = chapter;

    const lim = Math.min(toInt(limit, 20), 50);
    const sk = toInt(skip, 0);

    const items = await Question.find(filter, { score: { $meta: 'textScore' } })
      .sort({ score: { $meta: 'textScore' }, createdAt: -1 })
      .skip(sk)
      .limit(lim)
      .lean();

    res.json({ count: items.length, items });
  } catch (err) {
    console.error('GET /questions/search error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// POST /api/questions  (upsert by id with timestamps for validator)
router.post('/questions', async (req, res) => {
  try {
    const payload = { ...req.body };

    if (!payload?.id) {
      return res.status(400).json({ error: 'id is required' });
    }

    // Ensure class type matches your validator flexibility (number or string)
    if (payload.class !== undefined && typeof payload.class === 'string' && !isNaN(Number(payload.class))) {
      payload.class = Number(payload.class);
    }

    // Ensure Date types for validator-required fields
    const now = new Date();
    const updatedAt = payload.updatedAt ? new Date(payload.updatedAt) : now;
    const createdAt = payload.createdAt ? new Date(payload.createdAt) : now;

    const updated = await Question.findOneAndUpdate(
      { id: payload.id },
      {
        $set: { ...payload, updatedAt },
        $setOnInsert: { createdAt }
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    ).lean();

    res.status(201).json({ message: 'Upserted', item: updated });
  } catch (err) {
    console.error('POST /questions error:', err);
    if (err?.code === 11000) {
      return res.status(409).json({ error: 'Duplicate id' });
    }
    res.status(500).json({ error: 'Internal Server Error', details: err.message });
  }
});

module.exports = router;
