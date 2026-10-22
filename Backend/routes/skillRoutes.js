/**
 * CareerSync Capstone Project
 * 
 * @module Backend/Routes/SkillRoutes
 * @description API route definitions for Skill Mapping, Skill-Gap Analysis, and Role Matching.
 * Designed by Vikas Yadav (Database & Backend Architecture).
 */
const express = require('express');
const {
    getSkillGap,
    getMatchingRoles,
    setTargetRoles,
    getMyTargetRoleGaps,
    getDepartmentSkillGapAnalytics,
    getSkillLeaderboard,
    getIndustryRoles,
    getIndustryRoleById,
    createIndustryRole,
    updateIndustryRole,
    deleteIndustryRole
} = require('../controllers/skillMappingController');

const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

// Student Skill Leaderboard
router.route('/leaderboard')
    .get(protect, getSkillLeaderboard);

// Role-matching and target-role endpoints (must come before /:roleId)
router.route('/matching-roles')
    .get(protect, authorize('student'), getMatchingRoles);

router.route('/target-roles')
    .put(protect, authorize('student'), setTargetRoles);

router.route('/my-target-gaps')
    .get(protect, authorize('student'), getMyTargetRoleGaps);

router.route('/analytics/department-gap')
    .get(protect, authorize('faculty', 'tpo', 'admin'), getDepartmentSkillGapAnalytics);

// Skill gap against a specific role
router.route('/gap/:roleId')
    .get(protect, getSkillGap);

// Industry Roles CRUD
router.route('/roles')
    .get(protect, getIndustryRoles)
    .post(protect, authorize('admin', 'tpo', 'industry'), createIndustryRole);

router.route('/roles/:id')
    .get(protect, getIndustryRoleById)
    .put(protect, authorize('admin', 'tpo', 'industry'), updateIndustryRole)
    .delete(protect, authorize('admin', 'tpo'), deleteIndustryRole);

module.exports = router;
