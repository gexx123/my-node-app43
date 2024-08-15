const mongoose = require('mongoose');

// Define the schema for a question
const questionSchema = new mongoose.Schema({
  questionText: String,
  metaData: {
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
  }
});

// Define the schema for a chapter
const chapterSchema = new mongoose.Schema({
  chapterName: String,
  questions: [questionSchema]
});

// Define the schema for a subject
const subjectSchema = new mongoose.Schema({
  subjectName: String,
  chapters: [chapterSchema]
});

// Define the schema for a class
const classSchema = new mongoose.Schema({
  className: String,
  subjects: [subjectSchema]
});

const ClassModel = mongoose.model('ClassModel', classSchema);

module.exports = ClassModel;
