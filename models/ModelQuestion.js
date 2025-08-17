// models/Question.js
const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true }, // deterministic unique id

    questionType: { type: String, required: true },
    version: { type: Number, default: 1 },
    status: { type: String, enum: ['active', 'inactive', 'archived'], default: 'active' },

    questionText: { type: String, required: true },
    formattedText: { type: String, default: '' },
    solution: { type: String, default: '' },

    searchMetadata: {
      synonyms: { type: [String], default: [] },
      commonPhrases: { type: [String], default: [] },
      concepts: { type: [String], default: [] },
      difficultyKeywords: { type: mongoose.Schema.Types.Mixed, default: {} },
      questionStems: { type: [String], default: [] },
      contextClues: { type: [String], default: [] }
    },

    marks: { type: Number, default: 1 },
    difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], default: 'Easy' },
    estimatedTime: { type: Number, default: 60 },
    bloomsTaxonomy: { type: [String], default: [] },

    class: { type: mongoose.Schema.Types.Mixed, required: true }, // allow number or string
    subject: { type: String, required: true },
    board: { type: String, default: '' },
    chapter: { type: String, required: true },
    chapterNumber: { type: Number, default: null },
    topics: { type: [String], default: [] },
    subTopics: { type: [String], default: [] },
    tags: { type: [String], default: [] },
    keywords: { type: [String], default: [] },

    source: {
      type: {
        type: String,
        enum: ['book', 'manual', 'other'],
        default: 'book'
      },
      bookId: { type: String, default: null },
      bookTitle: { type: String, required: true },
      chapterName: { type: String, default: null },
      pageNumber: { type: mongoose.Schema.Types.Mixed, default: null },
      exerciseNumber: { type: String, default: null },
      questionNumber: { type: String, default: null }
    },

    media: {
      hasDiagram: { type: Boolean, default: false },
      diagramPath: { type: String, default: '' },
      diagramDescription: { type: String, default: '' },
      hasTable: { type: Boolean, default: false },
      tablePath: { type: String, default: '' },
      tableHeaders: { type: [String], default: [] },
      tableData: { type: Array, default: [] }
    },

    validation: {
      isValidated: { type: Boolean, default: false },
      validatedBy: { type: String, default: '' },
      validatedAt: { type: Date, default: null },
      validationNotes: { type: String, default: '' }
    },

    accessControl: {
      allowedSchools: { type: [String], default: ['*'] },
      isPublic: { type: Boolean, default: true }
    },

    metrics: { type: Object, default: {} },
    reporting: { type: Object, default: {} },

    isVerified: { type: Boolean, default: false },
    isPremium: { type: Boolean, default: false },
    createdBy: { type: String, default: 'system' },
    createdAt: { type: Date, default: () => new Date() },
    updatedAt: { type: Date, default: () => new Date() },
    lastSynced: { type: Date, default: null },
    usageCount: { type: Number, default: 0 },
    isPinned: { type: Boolean, default: false },
    lastUsed: { type: Date, default: null },
    localPath: { type: String, default: '' }
  },
  { collection: 'questions' }
);

// Helpful secondary indexes in code (safe if already created in Atlas)
QuestionSchema.index({ id: 1 }, { unique: true });
QuestionSchema.index({ class: 1, subject: 1, chapter: 1, difficulty: 1, isVerified: 1, createdAt: -1 });
QuestionSchema.index({ tags: 1 });
QuestionSchema.index({ board: 1 });
QuestionSchema.index({ chapterNumber: 1 });
QuestionSchema.index({ isPremium: 1 });
QuestionSchema.index({ 'accessControl.isPublic': 1 });

// NOTE: Text index with weights is better created in Atlas UI/Playground.

module.exports = mongoose.model('Question', QuestionSchema);
