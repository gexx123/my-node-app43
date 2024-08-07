const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  questionText: { type: String, required: true },
  difficultyLevel: { type: String, required: true },
  subject: { type: String, required: true },
  chapterName: { type: String, required: true },
  chapterPageNumber: { type: String },
  imagePath: { type: String },
  tableDataPath: { type: String },
  topic: { type: String },
  questionType: { type: String },
  bookTitle: { type: String },
  authors: { type: String },
  class: { type: String, required: true } // Added Class field
});

module.exports = mongoose.model('Question', questionSchema);
