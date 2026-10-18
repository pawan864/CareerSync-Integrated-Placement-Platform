const express = require('express');
const { 
    getOpportunities, 
    createOpportunity, 
    applyForOpportunity, 
    getCompanyApplications,
    getMyApplications,
    getCompanyOpportunities,
    getOpportunityById,
    updateOpportunity,
    toggleOpportunityStatus,
    deleteOpportunity
} = require('../controllers/opportunityController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/')
    .get(protect, getOpportunities)
    .post(protect, authorize('industry', 'admin', 'tpo'), createOpportunity);

// Specific routes first to prevent collision with :id
router.get('/company/my-postings', protect, authorize('industry', 'admin', 'tpo'), getCompanyOpportunities);
router.get('/company/applications', protect, authorize('industry'), getCompanyApplications);
router.get('/my-applications', protect, authorize('student'), getMyApplications);

router.post('/:id/apply', protect, authorize('student'), applyForOpportunity);
router.patch('/:id/status', protect, authorize('industry', 'admin', 'tpo'), toggleOpportunityStatus);

router.route('/:id')
    .get(protect, getOpportunityById)
    .put(protect, authorize('industry', 'admin', 'tpo'), updateOpportunity)
    .delete(protect, authorize('industry', 'admin', 'tpo'), deleteOpportunity);

module.exports = router;

