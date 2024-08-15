const mongoose = require('mongoose');

// Define the schema for resources
const resourcesSchema = new mongoose.Schema({
  imagePath: String,
  tableDataPath: String
}, { _id: false });

// Define the schema for metadata
const metaDataSchema = new mongoose.Schema({
  difficultyLevel: String,
  topic: String,
  questionType: String,
  bookTitle: String,
  authors: String,
  chapterPageNumber: String,
  resources: resourcesSchema
}, { _id: false });

// Define the schema for questions
const questionSchema = new mongoose.Schema({
  questionText: String,
  metaData: metaDataSchema
}, { _id: false });

// Define the schema for chapters
const chapterSchema = new mongoose.Schema({
  chapterName: String,
  questions: [questionSchema]
}, { _id: false });

// Define the schema for subjects
const subjectSchema = new mongoose.Schema({
  subjectName: String,
  chapters: [chapterSchema]
}, { _id: false });

// Define the schema for class
const classSchema = new mongoose.Schema({
  className: String,
  subjects: [subjectSchema]
});

const ClassModel = mongoose.model('ClassModel', classSchema);

module.exports = ClassModel;