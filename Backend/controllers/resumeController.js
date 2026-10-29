/**
 * CareerSync Capstone Project
 * 
 * @module Backend/Controllers/resumeController
 * @description Controllers for ATS Resume compilation, ATS scoring, and public portfolio.
 * Designed by Vikas Yadav (Database & Backend Architecture).
 */
const Resume = require('../models/Resume');
const StudentProfile = require('../models/StudentProfile');
const crypto = require('crypto');

// Helper to calculate ATS Score based on best-practice criteria
const evaluateAtsResume = (profile, resumeConfig) => {
    let score = 50; // Base score
    const strengths = [];
    const improvements = [];

    // Check summary
    if (resumeConfig?.professionalSummary && resumeConfig.professionalSummary.length > 50) {
        score += 10;
        strengths.push('Concise and professional summary present');
    } else {
        improvements.push('Add a 3-4 sentence professional summary highlighting your career goals');
    }

    // Check skills count
    const skillsCount = profile?.skills?.length || 0;
    if (skillsCount >= 5) {
        score += 10;
        strengths.push(`Good skill density (${skillsCount} skills mapped)`);
    } else {
        improvements.push('Add at least 5-8 relevant technical and soft skills to pass keyword filters');
    }

    // Check projects
    const projectsCount = profile?.projects?.length || 0;
    if (projectsCount >= 2) {
        score += 10;
        strengths.push(`Strong project portfolio (${projectsCount} projects included)`);
    } else {
        improvements.push('Include at least 2 detailed technical projects with technologies listed');
    }

    // Check education
    if (profile?.education?.length > 0) {
        score += 10;
        strengths.push('Academic credentials clearly listed');
    } else {
        improvements.push('Add your degree and university details under Education');
    }

    // Check certifications & experience
    if ((profile?.certifications?.length || 0) > 0 || (profile?.experience?.length || 0) > 0) {
        score += 10;
        strengths.push('Verified certifications or internships present');
    } else {
        improvements.push('Complete a certified course or internship to demonstrate industry experience');
    }

    return {
        score: Math.min(100, score),
        strengths,
        improvements
    };
};

// @desc    Get compiled ATS Resume Data for logged-in student
// @route   GET /api/resume
// @access  Private (Student)
exports.getMyResume = async (req, res, next) => {
    try {
        let resumeConfig = await Resume.findOne({ student: req.user.id });
        if (!resumeConfig) {
            resumeConfig = await Resume.create({
                student: req.user.id,
                theme: { template: 'modern', primaryColor: '#2563eb' }
            });
        }

        const profile = await StudentProfile.findOne({ user: req.user.id })
            .populate('user', ['name', 'email']);

        // Real-time ATS Evaluation
        const atsEvaluation = evaluateAtsResume(profile, resumeConfig);
        resumeConfig.atsScore = {
            score: atsEvaluation.score,
            strengths: atsEvaluation.strengths,
            improvements: atsEvaluation.improvements,
            lastAnalyzedAt: new Date()
        };
        await resumeConfig.save();

        res.status(200).json({
            success: true,
            data: {
                config: resumeConfig,
                compiledResume: {
                    personal: {
                        name: profile?.user?.name,
                        email: profile?.user?.email,
                        phone: profile?.personalInfo?.phone,
                        headline: resumeConfig.headline || profile?.personalInfo?.headline,
                        portfolioUrl: profile?.personalInfo?.portfolioUrl,
                        githubUrl: profile?.personalInfo?.githubUrl,
                        linkedinUrl: profile?.personalInfo?.linkedinUrl,
                        address: profile?.personalInfo?.address
                    },
                    summary: resumeConfig.professionalSummary || profile?.personalInfo?.bio,
                    education: resumeConfig.sectionsVisibility.education ? profile?.education : [],
                    skills: resumeConfig.sectionsVisibility.skills ? profile?.skills : [],
                    projects: resumeConfig.sectionsVisibility.projects ? profile?.projects : [],
                    experience: resumeConfig.sectionsVisibility.experience ? profile?.experience : [],
                    certifications: resumeConfig.sectionsVisibility.certifications ? profile?.certifications : [],
                    achievements: resumeConfig.sectionsVisibility.achievements ? profile?.achievements : [],
                    customSections: resumeConfig.customSections || []
                },
                atsScore: resumeConfig.atsScore
            }
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Update Resume configuration, theme & sections visibility
// @route   PUT /api/resume
// @access  Private (Student)
exports.updateResumeConfig = async (req, res, next) => {
    try {
        const {
            headline,
            targetRole,
            professionalSummary,
            theme,
            sectionsVisibility,
            customSections
        } = req.body;

        const updateFields = {};
        if (headline !== undefined) updateFields.headline = headline;
        if (targetRole !== undefined) updateFields.targetRole = targetRole;
        if (professionalSummary !== undefined) updateFields.professionalSummary = professionalSummary;
        if (theme) updateFields.theme = theme;
        if (sectionsVisibility) updateFields.sectionsVisibility = sectionsVisibility;
        if (customSections) updateFields.customSections = customSections;

        const resumeConfig = await Resume.findOneAndUpdate(
            { student: req.user.id },
            { $set: updateFields },
            { new: true, upsert: true, runValidators: true }
        );

        res.status(200).json({
            success: true,
            message: 'Resume settings updated successfully',
            data: resumeConfig
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Toggle public portfolio share link
// @route   POST /api/resume/share
// @access  Private (Student)
exports.togglePublicShare = async (req, res, next) => {
    try {
        let resumeConfig = await Resume.findOne({ student: req.user.id });
        if (!resumeConfig) {
            resumeConfig = await Resume.create({ student: req.user.id });
        }

        const isPublic = req.body.isPublic !== undefined ? req.body.isPublic : !resumeConfig.publicShare.isPublic;
        resumeConfig.publicShare.isPublic = isPublic;

        if (isPublic && !resumeConfig.publicShare.shareSlug) {
            const randomCode = crypto.randomBytes(4).toString('hex');
            const sanitizedName = (req.user.name || 'student')
                .toLowerCase()
                .replace(/[^a-z0-9]/g, '-');
            resumeConfig.publicShare.shareSlug = `${sanitizedName}-${randomCode}`;
        }

        await resumeConfig.save();

        const shareUrlPath = resumeConfig.publicShare.isPublic 
            ? `/portfolio/${resumeConfig.publicShare.shareSlug}` 
            : null;

        res.status(200).json({
            success: true,
            isPublic: resumeConfig.publicShare.isPublic,
            isShared: resumeConfig.publicShare.isPublic,
            shareUrl: shareUrlPath,
            shareableUrl: shareUrlPath,
            shareSlug: resumeConfig.publicShare.shareSlug,
            sharedToken: resumeConfig.publicShare.shareSlug,
            data: {
                isPublic: resumeConfig.publicShare.isPublic,
                isShared: resumeConfig.publicShare.isPublic,
                shareUrl: shareUrlPath,
                shareableUrl: shareUrlPath,
                shareSlug: resumeConfig.publicShare.shareSlug,
                sharedToken: resumeConfig.publicShare.shareSlug
            }
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Get public portfolio view by share slug
// @route   GET /api/resume/portfolio/:slug
// @access  Public
exports.getPublicPortfolio = async (req, res, next) => {
    try {
        const resumeConfig = await Resume.findOne({
            'publicShare.shareSlug': req.params.slug,
            'publicShare.isPublic': true
        });

        if (!resumeConfig) {
            return res.status(404).json({ success: false, error: 'Public portfolio not found or private' });
        }

        const profile = await StudentProfile.findOne({ user: resumeConfig.student })
            .populate('user', ['name', 'email']);

        res.status(200).json({
            success: true,
            data: {
                studentName: profile?.user?.name,
                email: profile?.user?.email,
                headline: resumeConfig.headline || profile?.personalInfo?.headline,
                targetRole: resumeConfig.targetRole || 'Software Engineer',
                summary: resumeConfig.professionalSummary || profile?.personalInfo?.bio,
                theme: resumeConfig.theme,
                atsScore: resumeConfig.atsScore,
                personalInfo: profile?.personalInfo,
                academicInfo: profile?.academicInfo,
                education: resumeConfig.sectionsVisibility?.education 
                    ? ((profile?.education && profile.education.length > 0) ? profile.education : [
                        {
                            institution: profile?.academicInfo?.college || 'University Institute of Technology',
                            degree: profile?.academicInfo?.department || 'Computer Science & Engineering',
                            fieldOfStudy: profile?.academicInfo?.department || 'Software Engineering',
                            startYear: 2022,
                            endYear: profile?.academicInfo?.graduationYear || 2026,
                            grade: profile?.academicInfo?.cgpa ? `${profile.academicInfo.cgpa} CGPA` : '8.8 CGPA',
                            current: true
                        }
                    ]) 
                    : [],
                skills: resumeConfig.sectionsVisibility?.skills ? (profile?.skills || []) : [],
                projects: resumeConfig.sectionsVisibility?.projects ? (profile?.projects || []) : [],
                experience: resumeConfig.sectionsVisibility?.experience ? (profile?.experience || []) : [],
                certifications: resumeConfig.sectionsVisibility?.certifications ? (profile?.certifications || []) : [],
                achievements: resumeConfig.sectionsVisibility?.achievements ? (profile?.achievements || []) : []
            }
        });
    } catch (err) {
        next(err);
    }
};
