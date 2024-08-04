const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
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
  Class: String // Added class key
});

module.exports = mongoose.model('Question', QuestionSchema);
