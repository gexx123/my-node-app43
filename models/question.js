const mongoose = require('mongoose');

// Define your Mongoose schema and model
const questionSchema = new mongoose.Schema({
  questionText: String,
  metaData: {
    difficultyLevel: String,
    topic: String,
    questionType: String,
    bookTitle: String,
    authors: String,
    resources: {
      imagePath: String,
      tableDataPath: String
    }
  }
});

const chapterSchema = new mongoose.Schema({
  chapterName: String,
  chapterPageNumbers: [String],
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
