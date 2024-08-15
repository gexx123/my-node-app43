const mongoose = require('mongoose');

// Define the Question Schema
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

const chapterSchema = new mongoose.Schema({
  chapterName: String,
  questions: [questionSchema]
});

const subjectSchema = new mongoose.Schema({
  subjectName: String,
  chapters: [chapterSchema]
});

const classSchema = new mongoose.Schema({
  className: String,
  subjects: [subjectSchema]
});

const ClassModel = mongoose.model('ClassModel', classSchema);

module.exports = ClassModel;
