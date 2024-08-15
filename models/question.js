const mongoose = require('mongoose');

// Define the schema for the metadata of each question
const metaDataSchema = new mongoose.Schema({
  difficultyLevel: String,
  topic: String,
  questionType: String,
  bookTitle: String,
  authors: String,
  chapterPageNumber: String,
  resources: {
    imagePath: String,
    tableDataPath: String
  }
});

// Define the schema for each question
const questionSchema = new mongoose.Schema({
  questionText: String,
  metaData: metaDataSchema
});

// Define the schema for each chapter
const chapterSchema = new mongoose.Schema({
  chapterName: String,
  questions: [questionSchema]
});

// Define the schema for each subject
const subjectSchema = new mongoose.Schema({
  subjectName: String,
  chapters: [chapterSchema]
});

// Define the main class schema that includes all subjects
const classSchema = new mongoose.Schema({
  className: String,
  subjects: [subjectSchema]
});

// Create the model based on the class schema
const ClassModel = mongoose.model('ClassModel', classSchema);

module.exports = ClassModel;