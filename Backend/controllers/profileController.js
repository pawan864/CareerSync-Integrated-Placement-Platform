/**
 * CareerSync Capstone Project
 * 
 * @module Backend/Controllers/profileController
 * @description Modular Express controllers for Student Profile CRUD functionality.
 * Designed by Vikas Yadav (Database & Backend Architecture).
 * Supports granular subdocument management for Education, Skills, Projects,
 * Certifications, Experience, Achievements, and Placement Status.
 */
const StudentProfile = require('../models/StudentProfile');

// Helper to ensure student profile exists
const getOrCreateProfile = async (userId) => {
    let profile = await StudentProfile.findOne({ user: userId });
    if (!profile) {
        profile = await StudentProfile.create({
            user: userId,
            personalInfo: {},
            academicInfo: {},
            skills: [],
            education: [],
            projects: [],
            certifications: [],
            experience: [],
            achievements: []
        });
    }
    return profile;
};

// @desc    Get current user's profile
// @route   GET /api/profile/me
// @access  Private (Student)
exports.getMyProfile = async (req, res, next) => {
    try {
        let profile = await StudentProfile.findOne({ user: req.user.id })
            .populate('user', ['name', 'email', 'role']);

        if (!profile) {
            profile = await getOrCreateProfile(req.user.id);
            await profile.populate('user', ['name', 'email', 'role']);
        }

        res.status(200).json({ success: true, data: profile });
    } catch (err) {
        next(err);
    }
};

// @desc    Create or update full student profile
// @route   POST /api/profile
// @access  Private (Student)
exports.createOrUpdateProfile = async (req, res, next) => {
    try {
        const {
            personalInfo,
            academicInfo,
            skills,
            education,
            certifications,
            projects,
            experience,
            achievements,
            careerInterests,
            placementStatus,
            resumeData
        } = req.body;

        const profileFields = {
            user: req.user.id
        };

        if (personalInfo !== undefined) profileFields.personalInfo = personalInfo;
        if (academicInfo !== undefined) profileFields.academicInfo = academicInfo;
        if (skills !== undefined) profileFields.skills = skills;
        if (education !== undefined) profileFields.education = education;
        if (certifications !== undefined) profileFields.certifications = certifications;
        if (projects !== undefined) profileFields.projects = projects;
        if (experience !== undefined) profileFields.experience = experience;
        if (achievements !== undefined) profileFields.achievements = achievements;
        if (careerInterests !== undefined) profileFields.careerInterests = careerInterests;
        if (placementStatus !== undefined) profileFields.placementStatus = placementStatus;
        if (resumeData !== undefined) profileFields.resumeData = resumeData;

        let profile = await StudentProfile.findOneAndUpdate(
            { user: req.user.id },
            { $set: profileFields },
            { new: true, upsert: true, runValidators: true }
        ).populate('user', ['name', 'email', 'role']);

        res.status(200).json({ success: true, data: profile });
    } catch (err) {
        next(err);
    }
};

// ----------------------------------------------------
// EDUCATION SUBDOCUMENT CRUD
// ----------------------------------------------------

// @desc    Add education entry
// @route   POST /api/profile/education
// @access  Private (Student)
exports.addEducation = async (req, res, next) => {
    try {
        const profile = await getOrCreateProfile(req.user.id);
        const { institution, degree, fieldOfStudy, startYear, endYear, current, grade } = req.body;

        if (!institution || !degree) {
            return res.status(400).json({ success: false, error: 'Institution and degree are required' });
        }

        profile.education.unshift({
            institution,
            degree,
            fieldOfStudy,
            startYear,
            endYear,
            current: current || false,
            grade
        });

        await profile.save();
        res.status(201).json({ success: true, data: profile.education });
    } catch (err) {
        next(err);
    }
};

// @desc    Update education entry
// @route   PUT /api/profile/education/:eduId
// @access  Private (Student)
exports.updateEducation = async (req, res, next) => {
    try {
        const profile = await StudentProfile.findOne({ user: req.user.id });
        if (!profile) {
            return res.status(404).json({ success: false, error: 'Profile not found' });
        }

        const edu = profile.education.id(req.params.eduId);
        if (!edu) {
            return res.status(404).json({ success: false, error: 'Education record not found' });
        }

        Object.assign(edu, req.body);
        await profile.save();

        res.status(200).json({ success: true, data: profile.education });
    } catch (err) {
        next(err);
    }
};

// @desc    Delete education entry
// @route   DELETE /api/profile/education/:eduId
// @access  Private (Student)
exports.deleteEducation = async (req, res, next) => {
    try {
        const profile = await StudentProfile.findOne({ user: req.user.id });
        if (!profile) {
            return res.status(404).json({ success: false, error: 'Profile not found' });
        }

        profile.education.pull({ _id: req.params.eduId });
        await profile.save();

        res.status(200).json({ success: true, data: profile.education });
    } catch (err) {
        next(err);
    }
};

// ----------------------------------------------------
// SKILLS SUBDOCUMENT CRUD
// ----------------------------------------------------

// @desc    Add or update skill in profile
// @route   POST /api/profile/skills
// @access  Private (Student)
exports.addSkill = async (req, res, next) => {
    try {
        const { name, level, category } = req.body;
        if (!name) {
            return res.status(400).json({ success: false, error: 'Skill name is required' });
        }

        const profile = await getOrCreateProfile(req.user.id);
        const existingSkillIndex = profile.skills.findIndex(
            s => s.name.toLowerCase() === name.trim().toLowerCase()
        );

        if (existingSkillIndex > -1) {
            // Update existing skill
            if (level) profile.skills[existingSkillIndex].level = level;
            if (category) profile.skills[existingSkillIndex].category = category;
        } else {
            profile.skills.push({
                name: name.trim(),
                level: level || 'Beginner',
                category: category || 'Technical'
            });
        }

        await profile.save();
        res.status(200).json({ success: true, data: profile.skills });
    } catch (err) {
        next(err);
    }
};

// @desc    Delete skill from profile
// @route   DELETE /api/profile/skills/:skillId
// @access  Private (Student)
exports.deleteSkill = async (req, res, next) => {
    try {
        const profile = await StudentProfile.findOne({ user: req.user.id });
        if (!profile) {
            return res.status(404).json({ success: false, error: 'Profile not found' });
        }

        profile.skills.pull({ _id: req.params.skillId });
        await profile.save();

        res.status(200).json({ success: true, data: profile.skills });
    } catch (err) {
        next(err);
    }
};

// ----------------------------------------------------
// PROJECTS SUBDOCUMENT CRUD
// ----------------------------------------------------

// @desc    Add project
// @route   POST /api/profile/projects
// @access  Private (Student)
exports.addProject = async (req, res, next) => {
    try {
        const profile = await getOrCreateProfile(req.user.id);
        const { title, description, technologiesUsed, githubUrl, liveUrl, startDate, endDate, isOngoing } = req.body;

        if (!title) {
            return res.status(400).json({ success: false, error: 'Project title is required' });
        }

        profile.projects.unshift({
            title,
            description,
            technologiesUsed: Array.isArray(technologiesUsed) ? technologiesUsed : [],
            githubUrl,
            liveUrl,
            startDate,
            endDate,
            isOngoing: isOngoing || false
        });

        await profile.save();
        res.status(201).json({ success: true, data: profile.projects });
    } catch (err) {
        next(err);
    }
};

// @desc    Update project
// @route   PUT /api/profile/projects/:projectId
// @access  Private (Student)
exports.updateProject = async (req, res, next) => {
    try {
        const profile = await StudentProfile.findOne({ user: req.user.id });
        if (!profile) {
            return res.status(404).json({ success: false, error: 'Profile not found' });
        }

        const project = profile.projects.id(req.params.projectId);
        if (!project) {
            return res.status(404).json({ success: false, error: 'Project not found' });
        }

        Object.assign(project, req.body);
        await profile.save();

        res.status(200).json({ success: true, data: profile.projects });
    } catch (err) {
        next(err);
    }
};

// @desc    Delete project
// @route   DELETE /api/profile/projects/:projectId
// @access  Private (Student)
exports.deleteProject = async (req, res, next) => {
    try {
        const profile = await StudentProfile.findOne({ user: req.user.id });
        if (!profile) {
            return res.status(404).json({ success: false, error: 'Profile not found' });
        }

        profile.projects.pull({ _id: req.params.projectId });
        await profile.save();

        res.status(200).json({ success: true, data: profile.projects });
    } catch (err) {
        next(err);
    }
};

// ----------------------------------------------------
// CERTIFICATIONS SUBDOCUMENT CRUD
// ----------------------------------------------------

// @desc    Add certification
// @route   POST /api/profile/certifications
// @access  Private (Student)
exports.addCertification = async (req, res, next) => {
    try {
        const profile = await getOrCreateProfile(req.user.id);
        const { title, issuer, dateIssued, expiryDate, credentialId, url } = req.body;

        if (!title || !issuer) {
            return res.status(400).json({ success: false, error: 'Certification title and issuer are required' });
        }

        profile.certifications.unshift({
            title,
            issuer,
            dateIssued,
            expiryDate,
            credentialId,
            url
        });

        await profile.save();
        res.status(201).json({ success: true, data: profile.certifications });
    } catch (err) {
        next(err);
    }
};

// @desc    Delete certification
// @route   DELETE /api/profile/certifications/:certId
// @access  Private (Student)
exports.deleteCertification = async (req, res, next) => {
    try {
        const profile = await StudentProfile.findOne({ user: req.user.id });
        if (!profile) {
            return res.status(404).json({ success: false, error: 'Profile not found' });
        }

        profile.certifications.pull({ _id: req.params.certId });
        await profile.save();

        res.status(200).json({ success: true, data: profile.certifications });
    } catch (err) {
        next(err);
    }
};

// ----------------------------------------------------
// EXPERIENCE SUBDOCUMENT CRUD
// ----------------------------------------------------

// @desc    Add experience
// @route   POST /api/profile/experience
// @access  Private (Student)
exports.addExperience = async (req, res, next) => {
    try {
        const profile = await getOrCreateProfile(req.user.id);
        const { company, role, employmentType, location, startDate, endDate, current, description } = req.body;

        if (!company || !role) {
            return res.status(400).json({ success: false, error: 'Company and role are required' });
        }

        profile.experience.unshift({
            company,
            role,
            employmentType,
            location,
            startDate,
            endDate,
            current: current || false,
            description
        });

        await profile.save();
        res.status(201).json({ success: true, data: profile.experience });
    } catch (err) {
        next(err);
    }
};

// @desc    Update experience
// @route   PUT /api/profile/experience/:expId
// @access  Private (Student)
exports.updateExperience = async (req, res, next) => {
    try {
        const profile = await StudentProfile.findOne({ user: req.user.id });
        if (!profile) {
            return res.status(404).json({ success: false, error: 'Profile not found' });
        }

        const exp = profile.experience.id(req.params.expId);
        if (!exp) {
            return res.status(404).json({ success: false, error: 'Experience record not found' });
        }

        Object.assign(exp, req.body);
        await profile.save();

        res.status(200).json({ success: true, data: profile.experience });
    } catch (err) {
        next(err);
    }
};

// @desc    Delete experience
// @route   DELETE /api/profile/experience/:expId
// @access  Private (Student)
exports.deleteExperience = async (req, res, next) => {
    try {
        const profile = await StudentProfile.findOne({ user: req.user.id });
        if (!profile) {
            return res.status(404).json({ success: false, error: 'Profile not found' });
        }

        profile.experience.pull({ _id: req.params.expId });
        await profile.save();

        res.status(200).json({ success: true, data: profile.experience });
    } catch (err) {
        next(err);
    }
};

// ----------------------------------------------------
// ACHIEVEMENTS SUBDOCUMENT CRUD
// ----------------------------------------------------

// @desc    Add achievement
// @route   POST /api/profile/achievements
// @access  Private (Student)
exports.addAchievement = async (req, res, next) => {
    try {
        const profile = await getOrCreateProfile(req.user.id);
        const { title, category, date, description, certificateUrl } = req.body;

        if (!title) {
            return res.status(400).json({ success: false, error: 'Achievement title is required' });
        }

        profile.achievements.unshift({
            title,
            category: category || 'Competition',
            date,
            description,
            certificateUrl
        });

        await profile.save();
        res.status(201).json({ success: true, data: profile.achievements });
    } catch (err) {
        next(err);
    }
};

// @desc    Delete achievement
// @route   DELETE /api/profile/achievements/:achId
// @access  Private (Student)
exports.deleteAchievement = async (req, res, next) => {
    try {
        const profile = await StudentProfile.findOne({ user: req.user.id });
        if (!profile) {
            return res.status(404).json({ success: false, error: 'Profile not found' });
        }

        profile.achievements.pull({ _id: req.params.achId });
        await profile.save();

        res.status(200).json({ success: true, data: profile.achievements });
    } catch (err) {
        next(err);
    }
};

// ----------------------------------------------------
// PLACEMENT STATUS & QUERY APIS
// ----------------------------------------------------

// @desc    Update student placement status
// @route   PUT /api/profile/placement-status
// @access  Private (Student, TPO, Admin)
exports.updatePlacementStatus = async (req, res, next) => {
    try {
        const targetUserId = req.body.userId && ['tpo', 'admin'].includes(req.user.role) 
            ? req.body.userId 
            : req.user.id;

        const profile = await StudentProfile.findOne({ user: targetUserId });
        if (!profile) {
            return res.status(404).json({ success: false, error: 'Profile not found' });
        }

        const { status, placedCompany, packageLPA, placedDate } = req.body;
        if (status) profile.placementStatus.status = status;
        if (placedCompany !== undefined) profile.placementStatus.placedCompany = placedCompany;
        if (packageLPA !== undefined) profile.placementStatus.packageLPA = packageLPA;
        if (placedDate !== undefined) profile.placementStatus.placedDate = placedDate;

        await profile.save();
        res.status(200).json({ success: true, data: profile.placementStatus });
    } catch (err) {
        next(err);
    }
};

// @desc    Get profile by user ID (for Faculty / Recruiters / TPO)
// @route   GET /api/profile/user/:userId
// @access  Private
exports.getProfileByUserId = async (req, res, next) => {
    try {
        const profile = await StudentProfile.findOne({ user: req.params.userId })
            .populate('user', ['name', 'email', 'role']);

        if (!profile) {
            return res.status(404).json({ success: false, error: 'Profile not found for this user' });
        }

        res.status(200).json({ success: true, data: profile });
    } catch (err) {
        next(err);
    }
};

// @desc    Get all student profiles with filtering & search
// @route   GET /api/profile
// @access  Private (Faculty, Industry, TPO, Admin)
exports.getProfiles = async (req, res, next) => {
    try {
        const query = {};

        // Department filter
        if (req.query.department) {
            query['academicInfo.department'] = new RegExp(req.query.department, 'i');
        }

        // Graduation Year filter
        if (req.query.graduationYear) {
            query['academicInfo.graduationYear'] = Number(req.query.graduationYear);
        }

        // Minimum CGPA filter
        if (req.query.minCgpa) {
            query['academicInfo.cgpa'] = { $gte: Number(req.query.minCgpa) };
        }

        // Placement Status filter
        if (req.query.placementStatus) {
            query['placementStatus.status'] = req.query.placementStatus;
        }

        // Skill filter
        if (req.query.skill) {
            query['skills.name'] = new RegExp(req.query.skill, 'i');
        }

        const profiles = await StudentProfile.find(query)
            .populate('user', ['name', 'email', 'role'])
            .sort({ 'academicInfo.cgpa': -1 });

        res.status(200).json({ success: true, count: profiles.length, data: profiles });
    } catch (err) {
        next(err);
    }
};
