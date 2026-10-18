/**
 * CareerSync Capstone Project
 * 
 * @module Backend/Routes/AssessmentRoutes
 * @description Route definitions for Skill Assessments, Quizzes, and Badge Issuance.
 * Designed by Vikas Yadav (Database & Backend Architecture).
 */
const express = require('express');
const {
    getAssessments,
    getAssessmentById,
    submitAssessment,
    getMyAssessmentHistory,
    createAssessment,
    deleteAssessment
} = require('../controllers/assessmentController');

const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

// Student history route (must come before /:id)
router.route('/my/history')
    .get(protect, authorize('student'), getMyAssessmentHistory);

// List and author assessments
router.route('/')
    .get(protect, getAssessments)
    .post(protect, authorize('admin', 'faculty', 'tpo'), createAssessment);

// Single assessment & submission
router.route('/:id')
    .get(protect, getAssessmentById)
    .delete(protect, authorize('admin', 'faculty'), deleteAssessment);

router.route('/:id/submit')
    .post(protect, authorize('student'), submitAssessment);

module.exports = router;
