const mongoose = require('mongoose');

// Define your Mongoose schema and model
const questionSchema = new mongoose.Schema({
  chapter: String,
  questionText: String,
  DifficultyLevel: String,
  Subject: String,
  Chaptername: String,
  ChapterPagenumber: String,
  ImagePath: String,
  TableDataPath: String,
  Topic: String,
  QuestionType: String,
  BookTitle: String,
  Authors: String,
  Class: String
});

const Question = mongoose.model('Question', questionSchema);

module.exports = Question;
