// models/Question.js
const mongoose = require('mongoose');

const SearchMetadataSchema = new mongoose.Schema({
  synonyms: [String],
  commonPhrases: [String],
  concepts: [String],
  difficultyKeywords: { type: mongoose.Schema.Types.Mixed, default: {} },
  questionStems: [String],
  contextClues: [String],
}, { _id: false });

const SourceSchema = new mongoose.Schema({
  type: { type: String, enum: ['book','manual','other'], required: true },
  bookId: { type: String, default: null },
  bookTitle: { type: String, required: true },
  chapterName: { type: String, default: null },
  pageNumber: { type: mongoose.Schema.Types.Mixed, default: null },
  exerciseNumber: { type: String, default: null },
  questionNumber: { type: String, default: null },
}, { _id: false });

const MediaSchema = new mongoose.Schema({
  hasDiagram: { type: Boolean, default: false },
  diagramPath: { type: String, default: '' },
  diagramDescription: { type: String, default: '' },
  hasTable: { type: Boolean, default: false },
  tablePath: { type: String, default: '' },
  tableHeaders: { type: [String], default: [] },
  tableData: { type: Array, default: [] },
}, { _id: false });

const ValidationSchema = new mongoose.Schema({
  isValidated: { type: Boolean, default: false },
  validatedBy: { type: String, default: '' },
  validatedAt: { type: Date, default: null },
  validationNotes: { type: String, default: '' },
}, { _id: false });

const AccessControlSchema = new mongoose.Schema({
  allowedSchools: { type: [String], default: ['*'] },
  isPublic: { type: Boolean, default: true },
}, { _id: false });

const QuestionSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true, index: true },

  questionType: { type: String, required: true },
  version: { type: Number, default: 1, min: 1 },
  status: { type: String, enum: ['active','inactive','archived'], default: 'active' },

  questionText: { type: String, required: true },
  formattedText: { type: String, default: '' },
  solution: { type: String, default: '' },

  searchMetadata: { type: SearchMetadataSchema, default: {} },

  marks: { type: Number, default: 1 },
  difficulty: { type: String, enum: ['Easy','Medium','Hard'], default: 'Easy' },
  estimatedTime: { type: Number, default: 60 },
  bloomsTaxonomy: { type: [String], default: [] },

  class: { type: mongoose.Schema.Types.Mixed, required: true }, // int or string
  subject: { type: String, required: true },
  board: { type: String, default: 'CBSE' },
  chapter: { type: String, required: true },
  chapterNumber: { type: Number, default: null },
  topics: { type: [String], default: [] },
  subTopics: { type: [String], default: [] },
  tags: { type: [String], default: [] },
  keywords: { type: [String], default: [] },

  source: { type: SourceSchema, required: true },

  media: { type: MediaSchema, default: {} },
  validation: { type: ValidationSchema, default: {} },
  accessControl: { type: AccessControlSchema, default: {} },

  metrics: { type: mongoose.Schema.Types.Mixed, default: {} },
  reporting: { type: mongoose.Schema.Types.Mixed, default: {} },

  isVerified: { type: Boolean, default: false },
  isPremium: { type: Boolean, default: false },
  createdBy: { type: String, default: 'system' },

  createdAt: { type: Date, default: () => new Date() },
  updatedAt: { type: Date, default: () => new Date() },
  lastSynced: { type: Date, default: null },
  usageCount: { type: Number, default: 0 },

  isPinned: { type: Boolean, default: false },
  lastUsed: { type: Date, default: null },
  localPath: { type: String, default: '' },
}, {
  collection: 'questions',
});

// helpful compound index mirroring Atlas one (safe if already exists)
QuestionSchema.index({ class: 1, subject: 1, chapter: 1, difficulty: 1, isVerified: 1, createdAt: -1 });

const Question = mongoose.model('Question', QuestionSchema);
module.exports = Question;
