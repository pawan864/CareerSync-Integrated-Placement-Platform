/**
 * CareerSync Capstone Project
 * 
 * @module Backend/Routes/LearningRoutes
 * @description API route definitions for Learning Hub, Training Programs, and Enrollments.
 * Designed by Vikas Yadav (Database & Backend Architecture).
 */
const express = require('express');
const {
    getLearningResources,
    getLearningResourceById,
    createLearningResource,
    updateLearningResource,
    deleteLearningResource,
    enrollInResource,
    updateEnrollmentProgress,
    getMyEnrollments,
    getEnrolledStudentsForResource
} = require('../controllers/learningController');

const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

// Student-specific enrollment management (must precede /:id)
router.route('/my/enrollments')
    .get(protect, authorize('student'), getMyEnrollments);

router.route('/enrollments/:enrollmentId/progress')
    .put(protect, authorize('student'), updateEnrollmentProgress);

// Learning Resources Root
router.route('/')
    .get(protect, getLearningResources)
    .post(protect, authorize('admin', 'faculty', 'tpo', 'industry'), createLearningResource);

// Single Resource & Action routes
router.route('/:id')
    .get(protect, getLearningResourceById)
    .put(protect, authorize('admin', 'faculty', 'tpo', 'industry'), updateLearningResource)
    .delete(protect, authorize('admin', 'faculty', 'tpo'), deleteLearningResource);

router.route('/:id/enroll')
    .post(protect, authorize('student'), enrollInResource);

router.route('/:id/students')
    .get(protect, authorize('admin', 'faculty', 'tpo'), getEnrolledStudentsForResource);

module.exports = router;
