// backend/server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const axios = require('axios');
const FormData = require('form-data');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// --- Connect to MongoDB ---
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/pmis';
mongoose.connect(MONGO_URI)
  .then(() => console.log('Successfully connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// --- Define Mongoose Schema and Model for Jobs ---
const jobSchema = new mongoose.Schema({
  title: String,
  org: String,
  district: String,
  sector: String,
  duration: Number,
  stipend: Number,
  tags: [String],
  keywords: [String],
  // You can add other fields from your original mock data here
  // e.g., org: String, district: String, etc.
});

// Add a virtual 'id' property that gets the string representation of '_id'
jobSchema.virtual('id').get(function() {
  return this._id.toHexString();
});

const Job = mongoose.model('Job', jobSchema);

// --- (Optional) Seed the database with some initial data ---
async function seedDatabase() {
  const count = await Job.countDocuments();
  if (count === 0) {
    console.log('No jobs found, seeding database...');
    await Job.insertMany([
      { title:'Junior Electrical Intern', org:'Bharat Power Co.', district:'Chennai', sector:'Electrical', duration:12, stipend:5000, tags:['12 months','On-site','CSR'], keywords: ['electrical engineering', 'circuits', 'autocad', 'safety protocols'] },
      { title:'Data Entry Assistant', org:'DigitServe Pvt Ltd', district:'Bengaluru Urban', sector:'IT / Software', duration:6, stipend:5000, tags:['6 months','Remote'], keywords: ['data entry', 'ms excel', 'typing', 'attention to detail', 'spreadsheets'] },
      { title:'Full Stack Developer Intern', org:'Innovate Tech', district:'Bengaluru Urban', sector:'IT / Software', duration:6, stipend:15000, tags:['6 months','Hybrid'], keywords: ['react', 'node.js', 'mongodb', 'javascript'] },
      { title:'Data Science Intern', org:'Data Insights Inc.', district:'Hyderabad', sector:'IT / Software', duration:3, stipend:12000, tags:['3 months','Remote'], keywords: ['python', 'data analysis', 'machine learning', 'scikit-learn'] },
      { title:'Accounts Support Intern', org:'Lakshmi Finance', district:'New Delhi', sector:'Finance', duration:6, stipend:5000, tags:['6 months','Hybrid'], keywords: ['accounting', 'finance', 'tally', 'bookkeeping', 'ms excel'] },
      { title:'Ward Support Trainee', org:'CityCare Hospitals', district:'Hyderabad', sector:'Healthcare', duration:3, stipend:5000, tags:['3 months','On-site'], keywords: ['patient care', 'communication', 'healthcare support', 'empathy'] }
    ]);
    console.log('Database seeded!');
  }
}
seedDatabase().catch(console.error);

// Multer setup for handling file uploads in memory
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// --- The API Endpoint for All Internships ---
app.get('/api/internships', async (req, res) => {
  try {
    const allJobs = await Job.find({});
    res.json(allJobs.map(job => job.toObject({ virtuals: true })));
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch internships.' });
  }
});

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://localhost:5001';

// --- The API Endpoint for Resume Upload ---
app.post('/api/recommend-by-resume', upload.single('resume'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No resume file uploaded.' });
  }

  try {
    // 1. Forward the resume file to the Python ML service
    const form = new FormData();
    form.append('resume', req.file.buffer, { filename: req.file.originalname });

    const mlServiceResponse = await axios.post(`${ML_SERVICE_URL}/extract-skills`, form, {
      headers: form.getHeaders(),
    });

    const userSkills = mlServiceResponse.data.skills;
    if (!userSkills || userSkills.length === 0) {
        return res.json({ recommendations: [], skills: [] });
    }

    // Fetch all jobs from the database
    const allJobs = await Job.find({});

    // 2. Use the extracted skills to find matching jobs (Rule-Based Scoring)
    const scoredJobs = allJobs.map(job => {
      let score = 0;
      job.keywords.forEach(keyword => {
        if (userSkills.includes(keyword)) {
          score++;
        }
      });
      // Calculate a match percentage
      const matchPercentage = (score / job.keywords.length) * 100;
      return {
        ...job.toObject({ virtuals: true }), // Ensure virtuals like 'id' are included
        score,
        matchPercentage: Math.min(100, Math.round(matchPercentage))
      };
    });

    // 3. Sort by score and return the top recommendations
    const recommendations = scoredJobs
      .filter(job => job.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 5); // Return top 5

    res.json({ recommendations, skills: userSkills });

  } catch (error) {
    console.error('Error processing resume:', error.message);
    res.status(500).json({ error: 'Failed to process resume.' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Node.js server running on port ${PORT}`);
});
