const express = require('express');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/care4u', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch((error) => console.error('MongoDB connection error:', error));

// Define a Mongoose schema for the form data
const formDataSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    // Add email validation using regex or a library like validator.js
  },
});

const FormData = mongoose.model('FormData', formDataSchema);

// Route to handle form submission
app.post('/submit-form', async (req, res) => {
  try {
    // Create a new FormData document using the submitted data
    const formData = new FormData(req.body);
    await formData.save();
    res.status(201).send('Form data saved successfully');
  } catch (error) {
    console.error('Error saving form data:', error.message);
    res.status(500).send('Internal Server Error');
  }
});

// Start the server
app.listen(PORT, () => {
  console.log('Server is running on port ${PORT}');
});