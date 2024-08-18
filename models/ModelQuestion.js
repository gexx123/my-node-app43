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

// Define the schema for classes (to be stored in `classmodels`)
const classSchema = new mongoose.Schema({
  className: String,
  subjects: [subjectSchema]
});

// Create the models
const ClassModel = mongoose.model('ClassModel', classSchema);  // This model uses the 'classmodels' collection
const QuestionModel = mongoose.model('QuestionModel', questionSchema); // This model uses the 'questions' collection

module.exports = { ClassModel, QuestionModel };