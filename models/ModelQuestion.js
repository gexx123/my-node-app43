// models/Question.js
const mongoose = require('mongoose');

const SearchMetadataSchema = new mongoose.Schema({
  synonyms: [String],
  commonPhrases: [String],
  concepts: [String],
  difficultyKeywords: mongoose.Schema.Types.Mixed,
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
  hasDiagram: Boolean,
  diagramPath: String,
  diagramDescription: String,
  hasTable: Boolean,
  tablePath: String,
  tableHeaders: [String],
  tableData: [mongoose.Schema.Types.Mixed],
}, { _id: false });

const ValidationSchema = new mongoose.Schema({
  isValidated: Boolean,
  validatedBy: String,
  validatedAt: { type: Date, default: null },
  validationNotes: String,
}, { _id: false });

const AccessControlSchema = new mongoose.Schema({
  allowedSchools: [String],
  isPublic: Boolean,
}, { _id: false });

const QuestionSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true, index: true },

  questionType: { type: String, required: true },
  version: { type: Number, default: 1, min: 1 },
  status: { type: String, enum: ['active','inactive','archived'], required: true },

  questionText: { type: String, required: true },
  formattedText: { type: String, default: '' },
  solution: { type: String, default: '' },

  searchMetadata: { type: SearchMetadataSchema, default: {} },

  marks: { type: Number, default: 1 },
  difficulty: { type: String, enum: ['Easy','Medium','Hard'] },
  estimatedTime: { type: Number, default: 60 },
  bloomsTaxonomy: { type: [String], default: [] },

  class: { type: mongoose.Schema.Types.Mixed, required: true }, // number or string
  subject: { type: String, required: true },
  board: { type: String, default: 'CBSE' },
  chapter: { type: String, required: true },
  chapterNumber: { type: Number, default: null },
  topics: { type: [String], default: [] },
  subTopics: { type: [String], default: [] },
  tags: { type: [String], default: [] },
  keywords: { type: [String], default: [] },

  source: { type: SourceSchema, required: true },

  media: { type: MediaSchema, default: undefined },
  validation: { type: ValidationSchema, default: undefined },
  accessControl: { type: AccessControlSchema, default: { allowedSchools: ['*'], isPublic: true } },

  metrics: { type: mongoose.Schema.Types.Mixed, default: {} },
  reporting: { type: mongoose.Schema.Types.Mixed, default: {} },

  isVerified: { type: Boolean, default: false },
  isPremium: { type: Boolean, default: false },
  createdBy: { type: String, default: 'system' },
  lastSynced: { type: Date, default: null },
  usageCount: { type: Number, default: 0 },
  isPinned: { type: Boolean, default: false },
  lastUsed: { type: Date, default: null },
  localPath: { type: String, default: '' },
}, {
  timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' },
  strict: true
});

// Compound index to match Atlas
QuestionSchema.index(
  { class: 1, subject: 1, chapter: 1, difficulty: 1, isVerified: 1, createdAt: -1 },
  { name: 'filter_class_subject_chapter_diff_verified_createdAt' }
);

module.exports = mongoose.models.Question || mongoose.model('Question', QuestionSchema, 'questions');
