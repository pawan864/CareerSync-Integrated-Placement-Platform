/**
 * CareerSync Capstone Project
 * 
 * @module Backend/Controllers/opportunityController
 * @description Express controller for opportunityController functionality in the MERN stack.
 */
const Opportunity = require('../models/Opportunity');
const CompanyProfile = require('../models/CompanyProfile');
const Application = require('../models/Application');
const StudentProfile = require('../models/StudentProfile');

// Helper for skill mapping logic
const calculateMatchScore = (studentSkills, requiredSkills) => {
    if (!requiredSkills || requiredSkills.length === 0) return 100;
    
    let matched = 0;
    requiredSkills.forEach(reqSkill => {
        const hasSkill = studentSkills?.some(s => s.name.toLowerCase() === reqSkill.name.toLowerCase());
        if (hasSkill) matched++;
    });
    
    return Math.round((matched / requiredSkills.length) * 100);
};

// @desc    Get all open opportunities (with optional filtering)
// @route   GET /api/opportunities
// @access  Private (All)
exports.getOpportunities = async (req, res, next) => {
    try {
        let query = { status: 'Open' };
        
        // Simple filtering
        if (req.query.type) query.type = req.query.type;
        if (req.query.workMode) query.workMode = req.query.workMode;

        let opportunities = await Opportunity.find(query).populate('company', 'companyName website');
        
        // If student, calculate dynamic match score for each opportunity
        if (req.user.role === 'student') {
            const profile = await StudentProfile.findOne({ user: req.user.id });
            if (profile) {
                opportunities = opportunities.map(opp => {
                    const oppObj = opp.toObject();
                    oppObj.matchScore = calculateMatchScore(profile.skills, opp.requiredSkills);
                    return oppObj;
                });
            }
        }

        res.status(200).json({ success: true, count: opportunities.length, data: opportunities });
    } catch (err) {
        next(err);
    }
};

// @desc    Create an opportunity
// @route   POST /api/opportunities
// @access  Private (Industry)
exports.createOpportunity = async (req, res, next) => {
    try {
        // Find company profile for this user
        let company = await CompanyProfile.findOne({ user: req.user.id });
        
        // Auto-create a basic company profile if it doesn't exist
        if (!company) {
            company = await CompanyProfile.create({
                user: req.user.id,
                companyName: req.user.name || 'My Company'
            });
        }

        req.body.company = company._id;
        const opp = await Opportunity.create(req.body);
        
        res.status(201).json({ success: true, data: opp });
    } catch (err) {
        next(err);
    }
};

// @desc    Apply for an opportunity
// @route   POST /api/opportunities/:id/apply
// @access  Private (Student)
exports.applyForOpportunity = async (req, res, next) => {
    try {
        const student = await StudentProfile.findOne({ user: req.user.id });
        if (!student) {
            return res.status(400).json({ success: false, error: 'Please complete your student profile first' });
        }

        const opportunity = await Opportunity.findById(req.params.id);
        if (!opportunity) {
            return res.status(404).json({ success: false, error: 'Opportunity not found' });
        }

        // Check if already applied
        const existingApp = await Application.findOne({ student: student._id, opportunity: opportunity._id });
        if (existingApp) {
            return res.status(400).json({ success: false, error: 'You have already applied for this opportunity' });
        }

        const matchScore = calculateMatchScore(student.skills, opportunity.requiredSkills);

        const application = await Application.create({
            student: student._id,
            opportunity: opportunity._id,
            matchScore,
            resumeUrl: req.body.resumeUrl || ''
        });

        res.status(201).json({ success: true, data: application });
    } catch (err) {
        next(err);
    }
};

// @desc    Get applications for my company's opportunities
// @route   GET /api/opportunities/applications
// @access  Private (Industry)
exports.getCompanyApplications = async (req, res, next) => {
    try {
        const company = await CompanyProfile.findOne({ user: req.user.id });
        if (!company) {
            return res.status(200).json({ success: true, count: 0, data: [] });
        }

        // Find all opportunities for this company
        const opportunities = await Opportunity.find({ company: company._id }).select('_id');
        const oppIds = opportunities.map(o => o._id);

        const applications = await Application.find({ opportunity: { $in: oppIds } })
            .populate('student', 'personalInfo academicInfo skills')
            .populate('opportunity', 'title type');

        res.status(200).json({ success: true, count: applications.length, data: applications });
    } catch (err) {
        next(err);
    }
};

// @desc    Get my applications
// @route   GET /api/opportunities/my-applications
// @access  Private (Student)
exports.getMyApplications = async (req, res, next) => {
    try {
        const student = await StudentProfile.findOne({ user: req.user.id });
        if (!student) return res.status(404).json({ success: false, error: 'Student profile not found' });

        const applications = await Application.find({ student: student._id })
            .populate({
                path: 'opportunity',
                populate: { path: 'company', select: 'companyName' }
            });

        res.status(200).json({ success: true, count: applications.length, data: applications });
    } catch (err) {
        next(err);
    }
};
