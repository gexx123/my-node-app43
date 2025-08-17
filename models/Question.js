// models/Question.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

// Sub-schemas
const SearchMetadataSchema = new Schema(
  {
    synonyms: { type: [String], default: [] },
    commonPhrases: { type: [String], default: [] },
    concepts: { type: [String], default: [] },
    difficultyKeywords: { type: Schema.Types.Mixed, default: {} },
    questionStems: { type: [String], default: [] },
    contextClues: { type: [String], default: [] }
  },
  { _id: false }
);

const SourceSchema = new Schema(
  {
    type: { type: String, enum: ['book', 'manual', 'other'], required: true },
    bookId: { type: String, default: null },
    bookTitle: { type: String, required: true },
    chapterName: { type: String, default: null },
    pageNumber: { type: Schema.Types.Mixed, default: null }, // int/long/string/null
    exerciseNumber: { type: String, default: null },
    questionNumber: { type: String, default: null }
  },
  { _id: false }
);

const MediaSchema = new Schema(
  {
    hasDiagram: { type: Boolean, default: false },
    diagramPath: { type: String, default: '' },
    diagramDescription: { type: String, default: '' },
    hasTable: { type: Boolean, default: false },
    tablePath: { type: String, default: '' },
    tableHeaders: { type: [String], default: [] },
    tableData: { type: Array, default: [] }
  },
  { _id: false }
);

const ValidationSchema = new Schema(
  {
    isValidated: { type: Boolean, default: false },
    validatedBy: { type: String, default: '' },
    validatedAt: { type: Date, default: null },
    validationNotes: { type: String, default: '' }
  },
  { _id: false }
);

const AccessControlSchema = new Schema(
  {
    allowedSchools: { type: [String], default: ['*'] },
    isPublic: { type: Boolean, default: true }
  },
  { _id: false }
);

// Main schema
const QuestionSchema = new Schema(
  {
    // Identification
    id: { type: String, required: true, index: true, unique: true },
    questionType: { type: String, required: true },
    version: { type: Number, default: 1, min: 1 },
    status: { type: String, enum: ['active', 'inactive', 'archived'], default: 'active' },

    // Content
    questionText: { type: String, required: true },
    formattedText: { type: String, default: '' },
    solution: { type: String, default: '' },

    // Chatbot search helpers
    searchMetadata: { type: SearchMetadataSchema, default: () => ({}) },

    // Enhanced metadata
    marks: { type: Number, default: 1 },
    difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], default: 'Easy' },
    estimatedTime: { type: Number, default: 60 },
    bloomsTaxonomy: { type: [String], default: [] },

    // Categorization
    // Note: validator allows number/string for class; Mixed matches that flexibility
    class: { type: Schema.Types.Mixed, required: true },
    subject: { type: String, required: true },
    board: { type: String, default: 'CBSE' },
    chapter: { type: String, required: true },
    chapterNumber: { type: Number, default: null },
    topics: { type: [String], default: [] },
    subTopics: { type: [String], default: [] },
    tags: { type: [String], default: [] },
    keywords: { type: [String], default: [] },

    // Source tracking
    source: { type: SourceSchema, required: true },

    // Media
    media: { type: MediaSchema, default: () => ({}) },

    // Validation status
    validation: { type: ValidationSchema, default: () => ({}) },

    // Access control
    accessControl: { type: AccessControlSchema, default: () => ({}) },

    // Metrics/Reporting (free-form, evolve later)
    metrics: { type: Schema.Types.Mixed, default: {} },
    reporting: { type: Schema.Types.Mixed, default: {} },

    // System fields
    isVerified: { type: Boolean, default: false },
    isPremium: { type: Boolean, default: false },
    createdBy: { type: String, default: 'system' },
    lastSynced: { type: Date, default: null },
    usageCount: { type: Number, default: 0 },
    isPinned: { type: Boolean, default: false },
    lastUsed: { type: Date, default: null },

    // Offline/local
    localPath: { type: String, default: '' }
  },
  {
    timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' },
    collection: 'questions'
  }
);

// Indexes (server-side safety; Atlas already has these, but keeping here is harmless)
QuestionSchema.index(
  { class: 1, subject: 1, chapter: 1, difficulty: 1, isVerified: 1, createdAt: -1 },
  { name: 'filter_class_subject_chapter_diff_verified_createdAt' }
);

QuestionSchema.index({ tags: 1 }, { name: 'tags' });
QuestionSchema.index({ board: 1 }, { name: 'board' });
QuestionSchema.index({ chapterNumber: 1 }, { name: 'chapterNumber' });
QuestionSchema.index({ isPremium: 1 }, { name: 'isPremium' });
QuestionSchema.index({ 'accessControl.isPublic': 1 }, { name: 'isPublic' });

// Weighted text index for chatbot search
QuestionSchema.index(
  {
    questionText: 'text',
    keywords: 'text',
    'searchMetadata.concepts': 'text',
    'searchMetadata.synonyms': 'text',
    'searchMetadata.commonPhrases': 'text',
    topics: 'text',
    subTopics: 'text'
  },
  {
    name: 'chatbot_text_index',
    weights: {
      questionText: 10,
      keywords: 8,
      'searchMetadata.concepts': 6,
      'searchMetadata.synonyms': 5,
      'searchMetadata.commonPhrases': 4,
      topics: 3,
      subTopics: 2
    },
    default_language: 'english'
  }
);

module.exports = mongoose.model('Question', QuestionSchema);
