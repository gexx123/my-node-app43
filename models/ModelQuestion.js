const mongoose = require('mongoose');

// Define the schema for questions
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

// Define the schema for chapters
const chapterSchema = new mongoose.Schema({
  chapterName: String,
  questions: [questionSchema]
});

// Define the schema for subjects
const subjectSchema = new mongoose.Schema({
  subjectName: String,
  chapters: [chapterSchema]
});

// Define the schema for classes
const classSchema = new mongoose.Schema({
  className: String,
  subjects: [subjectSchema]
});

const ClassModel = mongoose.model('ClassModel', classSchema);

module.exports = ClassModel;
