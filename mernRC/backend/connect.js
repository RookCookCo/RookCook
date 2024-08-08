// connect.js
require('dotenv').config(); // Load environment variables from .env file

const mongoose = require('mongoose');

// MongoDB connection URI from environment variables
const uri = process.env.MONGO_URI;

const connectDB = async () => {
  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected');
  } catch (err) {
    console.error('Error connecting to MongoDB:', err);
    process.exit(1); // Exit process if connection fails
  }
};

module.exports = connectDB;
