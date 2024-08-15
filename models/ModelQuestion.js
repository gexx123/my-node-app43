const mongoose = require('mongoose');

// Define a flexible schema for any object structure
const questionSchema = new mongoose.Schema({}, { strict: false });

const ClassModel = mongoose.model('ClassModel', questionSchema);

module.exports = ClassModel;