const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const RouteQuestion = require('./routes/RouteQuestion'); // Adjust the path as necessary

const app = express();
const PORT = process.env.PORT || 3000;

// MongoDB connection string
const MONGO_URI = 'mongodb+srv://your_mongo_uri_here';

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

app.use(cors());
app.use(express.json());

// Use the routes defined in RouteQuestion.js
app.use('/api', RouteQuestion);

// Basic route
app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
