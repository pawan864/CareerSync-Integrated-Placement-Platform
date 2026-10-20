/**
 * CareerSync Capstone Project
 * 
 * @module Backend/Routes/ResumeRoutes
 * @description API route definitions for ATS Resume Builder & Public Portfolios.
 * Designed by Vikas Yadav (Database & Backend Architecture).
 */
const express = require('express');
const {
    getMyResume,
    updateResumeConfig,
    togglePublicShare,
    getPublicPortfolio
} = require('../controllers/resumeController');

const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

// Public portfolio access (no auth needed)
router.get('/portfolio/:slug', getPublicPortfolio);

// Student resume builder routes (protected)
router.route('/')
    .get(protect, authorize('student'), getMyResume)
    .put(protect, authorize('student'), updateResumeConfig);

router.post('/share', protect, authorize('student'), togglePublicShare);

module.exports = router;
