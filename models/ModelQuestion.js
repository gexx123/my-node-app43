const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  className: String,
  subjects: [
    {
      subjectName: String,
      chapters: [
        {
          chapterName: String,
          questions: [
            {
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
            }
          ]
        }
      ]
    }
  ]
});

const ClassModel = mongoose.model('ClassModel', questionSchema);

module.exports = ClassModel;
