const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();

// Connect to MongoDB
// Note: If MONGODB_URI is not set in .env, it will fail gracefully and just log an error
if (process.env.MONGODB_URI) {
  connectDB();
} else {
  console.log('MongoDB connection skipped: MONGODB_URI not provided in .env');
}

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Basic health check route
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend is running' });
});

// Import routes
const admissionsRoute = require('./routes/admissions');
const contactRoute = require('./routes/contact');
const chatbotRoute = require('./routes/chatbot');

// Use routes
app.use('/api/admissions', admissionsRoute);
app.use('/api/contact', contactRoute);
app.use('/api/chatbot', chatbotRoute);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
