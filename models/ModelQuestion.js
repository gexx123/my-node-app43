const mongoose = require('mongoose');

// Define the schema for resources associated with questions
const resourceSchema = new mongoose.Schema({
  imagePath: { type: String, default: "None" },
  tableDataPath: { type: String, default: "None" }
});

// Define the schema for metadata associated with questions
const metaDataSchema = new mongoose.Schema({
  difficultyLevel: { type: String },
  topic: { type: String },
  questionType: { type: String },
  bookTitle: { type: String },
  authors: { type: String },
  chapterPageNumber: { type: String },
  resources: resourceSchema
});

// Define the schema for questions within a chapter
const questionSchema = new mongoose.Schema({
  questionText: { type: String },
  metaData: metaDataSchema
});

// Define the schema for chapters within a subject
const chapterSchema = new mongoose.Schema({
  chapterName: { type: String },
  questions: [questionSchema]
});

// Define the schema for subjects within a class
const subjectSchema = new mongoose.Schema({
  subjectName: { type: String },
  chapters: [chapterSchema]
});

// Define the top-level schema for school data
const schoolDataSchema = new mongoose.Schema({
  className: { type: String },
  subjects: [subjectSchema]
});

// Create the model from the schema and export it
const SchoolData = mongoose.model('SchoolData', schoolDataSchema);

module.exports = SchoolData;
