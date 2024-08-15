const mongoose = require('mongoose');

// Define the schema for resources
const resourcesSchema = new mongoose.Schema({
  imagePath: { type: String, default: "None" },
  tableDataPath: { type: String, default: "None" }
}, { _id: false });

// Define the schema for metadata
const metaDataSchema = new mongoose.Schema({
  difficultyLevel: { type: String, required: true },
  topic: { type: String, required: true },
  questionType: { type: String, required: true },
  bookTitle: { type: String, required: true },
  authors: { type: String, required: true },
  chapterPageNumber: { type: String, required: true },
  resources: { type: resourcesSchema, required: true }
}, { _id: false });

// Define the schema for questions
const questionSchema = new mongoose.Schema({
  questionText: { type: String, required: true },
  metaData: { type: metaDataSchema, required: true }
}, { _id: false });

// Define the schema for chapters
const chapterSchema = new mongoose.Schema({
  chapterName: { type: String, required: true },
  questions: { type: [questionSchema], required: true }
}, { _id: false });

// Define the schema for subjects
const subjectSchema = new mongoose.Schema({
  subjectName: { type: String, required: true },
  chapters: { type: [chapterSchema], required: true }
}, { _id: false });

// Define the schema for class
const classSchema = new mongoose.Schema({
  className: { type: String, required: true },
  subjects: { type: [subjectSchema], required: true }
});

const ClassModel = mongoose.model('ClassModel', classSchema);

module.exports = ClassModel;