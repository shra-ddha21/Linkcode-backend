
import app from "./app.js";
import mongoose from 'mongoose';
import cloudinary from "cloudinary";
import fileUpload from "express-fileupload";
import courseRouter from "./routes/course.routes.js";

import dotenv from "dotenv";

dotenv.config();



// fileuploading using express
app.use(fileUpload({
  useTempFiles: true,
  tempFileDir: '/tmp/'
}));
require('dotenv').config(); // Always load env variables first!
const app = require('./app');
const connectDB = require('./config/db'); // 1. Import the database connection

// 2. Use the imported function to connect to MongoDB
connectDB();

const PORT = process.env.PORT || 5000;
// database connection
const DB_URI = process.env.MONGO_URI;
try {
  await mongoose.connect(DB_URI)
  console.log("Connected to MongoDB")

} catch (error) {
  console.log(error);

}



// Defining routes
app.use("/api/v1/course", courseRouter);


//Cloudenaty Configuration code
cloudinary.config({
  cloud_name: process.env.cloud_name,
  api_key: process.env.api_key,
  api_secret: process.env.api_secret
});


app.get('/', (req, res) => {
  res.send('LMS Backend is running successfully!');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
