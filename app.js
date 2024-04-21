// app.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const { dbURI } = require('./config');
const authRoutes = require('./routes/authRoutes');
const cors = require('cors');

const app = express();

// Connect to MongoDB
mongoose.connect(dbURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('Database connection error:', err));

app.use(cors()); // Enable CORS for all routes

// Middleware
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
