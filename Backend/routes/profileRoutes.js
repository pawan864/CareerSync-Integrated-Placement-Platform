/**
 * CareerSync Capstone Project
 * 
 * @module Backend/Routes/ProfileRoutes
 * @description API route definitions for Student Profile management.
 * Designed by Vikas Yadav (Database & Backend Architecture).
 * Exposes granular endpoints for Education, Skills, Projects,
 * Certifications, Experience, Achievements, and Placement Status.
 */
const express = require('express');
const {
    getMyProfile,
    createOrUpdateProfile,
    getProfiles,
    getProfileByUserId,
    addEducation,
    updateEducation,
    deleteEducation,
    addSkill,
    deleteSkill,
    addProject,
    updateProject,
    deleteProject,
    addCertification,
    deleteCertification,
    addExperience,
    updateExperience,
    deleteExperience,
    addAchievement,
    deleteAchievement,
    updatePlacementStatus
} = require('../controllers/profileController');

const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

// Root Profile routes
router.route('/me')
    .get(protect, getMyProfile);

router.route('/')
    .post(protect, authorize('student'), createOrUpdateProfile)
    .get(protect, authorize('faculty', 'industry', 'tpo', 'admin'), getProfiles);

router.route('/user/:userId')
    .get(protect, getProfileByUserId);

router.route('/placement-status')
    .put(protect, authorize('student', 'tpo', 'admin'), updatePlacementStatus);

// Education routes
router.route('/education')
    .post(protect, authorize('student'), addEducation);

router.route('/education/:eduId')
    .put(protect, authorize('student'), updateEducation)
    .delete(protect, authorize('student'), deleteEducation);

// Skills routes
router.route('/skills')
    .post(protect, authorize('student'), addSkill);

router.route('/skills/:skillId')
    .delete(protect, authorize('student'), deleteSkill);

// Projects routes
router.route('/projects')
    .post(protect, authorize('student'), addProject);

router.route('/projects/:projectId')
    .put(protect, authorize('student'), updateProject)
    .delete(protect, authorize('student'), deleteProject);

// Certifications routes
router.route('/certifications')
    .post(protect, authorize('student'), addCertification);

router.route('/certifications/:certId')
    .delete(protect, authorize('student'), deleteCertification);

// Experience routes
router.route('/experience')
    .post(protect, authorize('student'), addExperience);

router.route('/experience/:expId')
    .put(protect, authorize('student'), updateExperience)
    .delete(protect, authorize('student'), deleteExperience);

// Achievements routes
router.route('/achievements')
    .post(protect, authorize('student'), addAchievement);

router.route('/achievements/:achId')
    .delete(protect, authorize('student'), deleteAchievement);

module.exports = router;
