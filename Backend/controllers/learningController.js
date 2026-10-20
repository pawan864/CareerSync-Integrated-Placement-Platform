/**
 * CareerSync Capstone Project
 * 
 * @module Backend/Controllers/learningController
 * @description Controllers for Learning Hub, Training Enrollments, Progress, and Completion.
 * Designed by Vikas Yadav (Database & Backend Architecture).
 */
const LearningResource = require('../models/LearningResource');
const TrainingEnrollment = require('../models/TrainingEnrollment');
const StudentProfile = require('../models/StudentProfile');

// @desc    Get all active learning resources with filters & pagination
// @route   GET /api/learning
// @access  Private
exports.getLearningResources = async (req, res, next) => {
    try {
        const {
            type,
            category,
            difficulty,
            skill,
            search,
            isFree,
            page = 1,
            limit = 12
        } = req.query;

        const query = { isActive: true };

        if (type) query.type = type;
        if (category) query.category = category;
        if (difficulty) query.difficulty = difficulty;
        if (isFree !== undefined) query.isFree = isFree === 'true';

        if (skill) {
            query.skillsCovered = { $in: [new RegExp(skill.trim(), 'i')] };
        }

        if (search) {
            query.$or = [
                { title: new RegExp(search.trim(), 'i') },
                { description: new RegExp(search.trim(), 'i') },
                { provider: new RegExp(search.trim(), 'i') }
            ];
        }

        const skip = (Number(page) - 1) * Number(limit);
        const total = await LearningResource.countDocuments(query);
        const resources = await LearningResource.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(Number(limit));

        res.status(200).json({
            success: true,
            total,
            page: Number(page),
            pages: Math.ceil(total / Number(limit)),
            count: resources.length,
            data: resources
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Get single learning resource by ID with student enrollment check
// @route   GET /api/learning/:id
// @access  Private
exports.getLearningResourceById = async (req, res, next) => {
    try {
        const resource = await LearningResource.findById(req.params.id);
        if (!resource || !resource.isActive) {
            return res.status(404).json({ success: false, error: 'Learning resource not found' });
        }

        let userEnrollment = null;
        if (req.user && req.user.role === 'student') {
            userEnrollment = await TrainingEnrollment.findOne({
                student: req.user.id,
                resource: resource._id
            });
        }

        res.status(200).json({
            success: true,
            data: resource,
            enrollment: userEnrollment
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Create a learning resource
// @route   POST /api/learning
// @access  Private (Faculty, TPO, Admin, Industry)
exports.createLearningResource = async (req, res, next) => {
    try {
        const {
            title,
            description,
            type,
            category,
            skillsCovered,
            provider,
            instructor,
            url,
            durationHours,
            difficulty,
            startDate,
            endDate,
            capacity,
            isFree
        } = req.body;

        if (!title || !type || !provider) {
            return res.status(400).json({
                success: false,
                error: 'Title, type, and provider are required'
            });
        }

        const resource = await LearningResource.create({
            title,
            description,
            type,
            category: category || 'Technical',
            skillsCovered: Array.isArray(skillsCovered) ? skillsCovered : [],
            provider,
            instructor,
            url,
            durationHours,
            difficulty: difficulty || 'Beginner',
            startDate,
            endDate,
            capacity,
            isFree: isFree !== undefined ? isFree : true,
            createdBy: req.user.id
        });

        res.status(201).json({ success: true, data: resource });
    } catch (err) {
        next(err);
    }
};

// @desc    Update a learning resource
// @route   PUT /api/learning/:id
// @access  Private (Faculty, TPO, Admin, Industry)
exports.updateLearningResource = async (req, res, next) => {
    try {
        const resource = await LearningResource.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!resource) {
            return res.status(404).json({ success: false, error: 'Learning resource not found' });
        }

        res.status(200).json({ success: true, data: resource });
    } catch (err) {
        next(err);
    }
};

// @desc    Delete / deactivate a learning resource
// @route   DELETE /api/learning/:id
// @access  Private (Faculty, TPO, Admin)
exports.deleteLearningResource = async (req, res, next) => {
    try {
        const resource = await LearningResource.findById(req.params.id);
        if (!resource) {
            return res.status(404).json({ success: false, error: 'Learning resource not found' });
        }

        await resource.deleteOne();
        res.status(200).json({ success: true, message: 'Learning resource removed' });
    } catch (err) {
        next(err);
    }
};

// @desc    Enroll logged in student in a learning resource
// @route   POST /api/learning/:id/enroll
// @access  Private (Student)
exports.enrollInResource = async (req, res, next) => {
    try {
        const resource = await LearningResource.findById(req.params.id);
        if (!resource || !resource.isActive) {
            return res.status(404).json({ success: false, error: 'Learning resource not found' });
        }

        if (resource.capacity && resource.enrolledCount >= resource.capacity) {
            return res.status(400).json({ success: false, error: 'Enrollment capacity full for this resource' });
        }

        const existingEnrollment = await TrainingEnrollment.findOne({
            student: req.user.id,
            resource: resource._id
        });

        if (existingEnrollment) {
            return res.status(400).json({ success: false, error: 'Already enrolled in this learning resource' });
        }

        const enrollment = await TrainingEnrollment.create({
            student: req.user.id,
            resource: resource._id,
            status: 'Enrolled',
            progressPercentage: 0,
            enrolledAt: new Date()
        });

        // Increment enrolled count
        resource.enrolledCount += 1;
        await resource.save();

        res.status(201).json({
            success: true,
            message: `Successfully enrolled in ${resource.title}`,
            data: enrollment
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Update enrollment progress percentage & auto-mark completion
// @route   PUT /api/learning/enrollments/:enrollmentId/progress
// @access  Private (Student)
exports.updateEnrollmentProgress = async (req, res, next) => {
    try {
        const { progressPercentage, certificateUrl } = req.body;
        const progress = Math.min(100, Math.max(0, Number(progressPercentage || 0)));

        const enrollment = await TrainingEnrollment.findOne({
            _id: req.params.enrollmentId,
            student: req.user.id
        }).populate('resource');

        if (!enrollment) {
            return res.status(404).json({ success: false, error: 'Enrollment record not found' });
        }

        enrollment.progressPercentage = progress;

        if (progress === 100) {
            enrollment.status = 'Completed';
            enrollment.completionDate = new Date();
            if (certificateUrl) enrollment.certificateUrl = certificateUrl;

            // Automatically add completed certification to StudentProfile
            let profile = await StudentProfile.findOne({ user: req.user.id });
            if (profile && enrollment.resource) {
                const alreadyCertified = profile.certifications.some(
                    c => c.title.toLowerCase() === enrollment.resource.title.toLowerCase()
                );

                if (!alreadyCertified) {
                    profile.certifications.unshift({
                        title: enrollment.resource.title,
                        issuer: enrollment.resource.provider,
                        dateIssued: new Date(),
                        credentialId: `CERT-${Date.now().toString(36).toUpperCase()}`,
                        url: certificateUrl || enrollment.resource.url,
                        isVerified: true
                    });
                    await profile.save();
                }
            }
        } else if (progress > 0) {
            enrollment.status = 'In Progress';
        }

        await enrollment.save();

        res.status(200).json({
            success: true,
            message: progress === 100 ? 'Congratulations on completing this training program!' : 'Progress updated',
            data: enrollment
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Get all learning enrollments for current student
// @route   GET /api/learning/my/enrollments
// @access  Private (Student)
exports.getMyEnrollments = async (req, res, next) => {
    try {
        const { status } = req.query;
        const query = { student: req.user.id };
        if (status) query.status = status;

        const enrollments = await TrainingEnrollment.find(query)
            .populate('resource', ['title', 'type', 'category', 'provider', 'durationHours', 'skillsCovered', 'url', 'difficulty'])
            .sort({ enrolledAt: -1 });

        const summary = {
            totalEnrolled: enrollments.length,
            inProgress: enrollments.filter(e => e.status === 'In Progress').length,
            completed: enrollments.filter(e => e.status === 'Completed').length
        };

        res.status(200).json({
            success: true,
            summary,
            count: enrollments.length,
            data: enrollments
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Get student enrollments for a specific resource (for Faculty & TPO)
// @route   GET /api/learning/:id/students
// @access  Private (Faculty, TPO, Admin)
exports.getEnrolledStudentsForResource = async (req, res, next) => {
    try {
        const enrollments = await TrainingEnrollment.find({ resource: req.params.id })
            .populate('student', ['name', 'email', 'rollNumber'])
            .sort({ enrolledAt: -1 });

        res.status(200).json({
            success: true,
            count: enrollments.length,
            data: enrollments
        });
    } catch (err) {
        next(err);
    }
};
