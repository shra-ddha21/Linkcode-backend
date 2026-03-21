const mongoose = require('mongoose');
require('dotenv').config(); // Load environment variables from .env file

const connectDB = async () => {
  try {
    // Try to connect using the connection string in the .env file
    await mongoose.connect(process.env.MONGO_URI);
    
    // Print success message
    console.log('MongoDB Connected successfully');
  } catch (error) {
    // Print error message and stop the server process
    console.error('MongoDB connection failed:', error.message);
    process.exit(1); // 1 means exit with failure
  }
};

module.exports = connectDB;
