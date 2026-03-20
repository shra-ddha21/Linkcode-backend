require('dotenv').config(); // Always load env variables first!
const app = require('./app');
const connectDB = require('./config/db'); // 1. Import the database connection

// 2. Use the imported function to connect to MongoDB
connectDB();

const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
  res.send('LMS Backend is running successfully!');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
