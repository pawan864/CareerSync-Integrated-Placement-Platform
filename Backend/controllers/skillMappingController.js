/**
 * CareerSync Capstone Project
 * 
 * @module Backend/Controllers/skillMappingController
 * @description Advanced Skill-Gap Analysis & Target-Role Matching Engine.
 * Designed by Vikas Yadav (Database & Backend Architecture).
 * Computes multi-level skill alignment, competency gaps, placement readiness scores,
 * and dynamically recommends database courses and skill assessments.
 */
const StudentProfile = require('../models/StudentProfile');
const IndustryRole = require('../models/IndustryRole');
const LearningResource = require('../models/LearningResource');
const SkillAssessment = require('../models/SkillAssessment');

const skillLevelMap = {
    'Beginner': 1,
    'Intermediate': 2,
    'Advanced': 3,
    'Expert': 4
};

// Helper function to calculate gap between a student and a role
const calculateRoleGap = (studentSkills = [], requiredSkills = []) => {
    let matchedSkills = [];
    let missingSkills = [];
    let upgradeNeededSkills = [];
    let totalScore = 0;
    let maxPossibleScore = 0;

    requiredSkills.forEach(reqSkill => {
        const weight = reqSkill.weight || 1;
        const reqLevelVal = skillLevelMap[reqSkill.level] || 2;
        maxPossibleScore += (reqLevelVal * weight * 10);

        const studentSkill = studentSkills.find(
            s => s.name.trim().toLowerCase() === reqSkill.name.trim().toLowerCase()
        );

        if (!studentSkill) {
            missingSkills.push({
                name: reqSkill.name,
                requiredLevel: reqSkill.level,
                category: reqSkill.category || 'Technical',
                isMandatory: reqSkill.isMandatory !== false,
                weight
            });
        } else {
            const stuLevelVal = skillLevelMap[studentSkill.level] || 1;
            const verifiedMultiplier = studentSkill.isVerified ? 1.1 : 1.0;
            const pointsEarned = Math.min(stuLevelVal, reqLevelVal) * weight * 10 * verifiedMultiplier;
            totalScore += pointsEarned;

            if (stuLevelVal >= reqLevelVal) {
                matchedSkills.push({
                    name: reqSkill.name,
                    requiredLevel: reqSkill.level,
                    currentLevel: studentSkill.level,
                    isVerified: studentSkill.isVerified || false,
                    proficiencyScore: studentSkill.proficiencyScore || 0
                });
            } else {
                upgradeNeededSkills.push({
                    name: reqSkill.name,
                    requiredLevel: reqSkill.level,
                    currentLevel: studentSkill.level,
                    isVerified: studentSkill.isVerified || false,
                    proficiencyScore: studentSkill.proficiencyScore || 0
                });
            }
        }
    });

    const readinessScore = maxPossibleScore > 0 
        ? Math.min(100, Math.round((totalScore / maxPossibleScore) * 100))
        : 100;

    return {
        readinessScore,
        matchedCount: matchedSkills.length,
        totalRequiredCount: requiredSkills.length,
        matchedSkills,
        upgradeNeededSkills,
        missingSkills
    };
};

// @desc    Get detailed skill gap analysis for a student against a target role
// @route   GET /api/skills/gap/:roleId
// @access  Private
exports.getSkillGap = async (req, res, next) => {
    try {
        const targetRole = await IndustryRole.findById(req.params.roleId);
        if (!targetRole) {
            return res.status(404).json({ success: false, error: 'Target role not found' });
        }

        const userId = (req.query.studentId && ['faculty', 'tpo', 'admin'].includes(req.user.role)) 
            ? req.query.studentId 
            : req.user.id;

        const profile = await StudentProfile.findOne({ user: userId });
        if (!profile) {
            return res.status(404).json({ success: false, error: 'Student profile not found' });
        }

        const gapAnalysis = calculateRoleGap(profile.skills, targetRole.requiredSkills);

        // Gather all skills where the student has a gap
        const deficitSkillNames = [
            ...gapAnalysis.missingSkills.map(s => s.name),
            ...gapAnalysis.upgradeNeededSkills.map(s => s.name)
        ];

        // Fetch dynamic learning recommendations from LearningResource DB
        const recommendedResources = await LearningResource.find({
            isActive: true,
            skillsCovered: { $in: deficitSkillNames }
        }).limit(6).select('title type provider durationHours difficulty url skillsCovered');

        // Fetch corresponding Skill Assessments from DB to help close the gap
        const recommendedAssessments = await SkillAssessment.find({
            isActive: true,
            skillName: { $in: deficitSkillNames }
        }).limit(4).select('title skillName difficulty timeLimitMinutes passingScorePercentage');

        res.status(200).json({
            success: true,
            data: {
                roleInfo: {
                    id: targetRole._id,
                    title: targetRole.title,
                    industry: targetRole.industry,
                    experienceLevel: targetRole.experienceLevel,
                    expectedSalaryRange: targetRole.expectedSalaryRange
                },
                readinessScore: gapAnalysis.readinessScore,
                matchedCount: gapAnalysis.matchedCount,
                totalRequiredCount: gapAnalysis.totalRequiredCount,
                analysis: {
                    matchedSkills: gapAnalysis.matchedSkills,
                    upgradeNeededSkills: gapAnalysis.upgradeNeededSkills,
                    missingSkills: gapAnalysis.missingSkills
                },
                actionPlan: {
                    recommendedResources,
                    recommendedAssessments
                }
            }
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Match student against ALL industry roles and rank by readiness score
// @route   GET /api/skills/matching-roles
// @access  Private (Student)
exports.getMatchingRoles = async (req, res, next) => {
    try {
        const profile = await StudentProfile.findOne({ user: req.user.id });
        if (!profile) {
            return res.status(404).json({ success: false, error: 'Profile not found' });
        }

        const roles = await IndustryRole.find({ isActive: true });
        const studentSkills = profile.skills || [];

        const matchedRoles = roles.map(role => {
            const gap = calculateRoleGap(studentSkills, role.requiredSkills);
            return {
                id: role._id,
                title: role.title,
                industry: role.industry,
                experienceLevel: role.experienceLevel,
                expectedSalaryRange: role.expectedSalaryRange,
                readinessScore: gap.readinessScore,
                matchedCount: gap.matchedCount,
                totalRequired: gap.totalRequiredCount,
                missingCount: gap.missingSkills.length,
                upgradeNeededCount: gap.upgradeNeededSkills.length
            };
        });

        // Sort descending by readiness score
        matchedRoles.sort((a, b) => b.readinessScore - a.readinessScore);

        res.status(200).json({
            success: true,
            count: matchedRoles.length,
            data: matchedRoles
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Set or update target roles in student profile
// @route   PUT /api/skills/target-roles
// @access  Private (Student)
exports.setTargetRoles = async (req, res, next) => {
    try {
        const { targetRoles = [] } = req.body;

        let profile = await StudentProfile.findOne({ user: req.user.id });
        if (!profile) {
            profile = await StudentProfile.create({ user: req.user.id });
        }

        profile.careerInterests.targetRoles = targetRoles;
        await profile.save();

        res.status(200).json({
            success: true,
            targetRoles: profile.careerInterests.targetRoles
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Get skill readiness for all roles currently in student's target list
// @route   GET /api/skills/my-target-gaps
// @access  Private (Student)
exports.getMyTargetRoleGaps = async (req, res, next) => {
    try {
        const profile = await StudentProfile.findOne({ user: req.user.id });
        if (!profile) {
            return res.status(404).json({ success: false, error: 'Profile not found' });
        }

        const targetRoleTitles = profile.careerInterests?.targetRoles || [];
        if (targetRoleTitles.length === 0) {
            return res.status(200).json({
                success: true,
                message: 'No target roles selected yet',
                data: []
            });
        }

        const roles = await IndustryRole.find({
            title: { $in: targetRoleTitles.map(t => new RegExp(`^${t}$`, 'i')) },
            isActive: true
        });

        const targetGaps = roles.map(role => {
            const gap = calculateRoleGap(profile.skills, role.requiredSkills);
            return {
                roleId: role._id,
                title: role.title,
                industry: role.industry,
                readinessScore: gap.readinessScore,
                matchedCount: gap.matchedCount,
                totalRequired: gap.totalRequiredCount,
                missingSkills: gap.missingSkills.map(s => s.name),
                upgradeNeededSkills: gap.upgradeNeededSkills.map(s => s.name)
            };
        });

        res.status(200).json({
            success: true,
            data: targetGaps
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Institutional Department-level skill gap overview (for Faculty & TPO)
// @route   GET /api/skills/analytics/department-gap
// @access  Private (Faculty, TPO, Admin)
exports.getDepartmentSkillGapAnalytics = async (req, res, next) => {
    try {
        const { department, graduationYear } = req.query;
        const matchQuery = {};

        if (department) matchQuery['academicInfo.department'] = new RegExp(department, 'i');
        if (graduationYear) matchQuery['academicInfo.graduationYear'] = Number(graduationYear);

        const profiles = await StudentProfile.find(matchQuery).select('skills academicInfo placementStatus');

        // Aggregate frequency of all student skills
        const skillFrequencies = {};
        profiles.forEach(p => {
            (p.skills || []).forEach(s => {
                const name = s.name.toLowerCase();
                skillFrequencies[name] = (skillFrequencies[name] || 0) + 1;
            });
        });

        // Compare against all active Industry Roles to identify top deficit skills
        const allRoles = await IndustryRole.find({ isActive: true });
        const deficitCounter = {};

        allRoles.forEach(r => {
            (r.requiredSkills || []).forEach(reqS => {
                const name = reqS.name.toLowerCase();
                const studentCountWithSkill = skillFrequencies[name] || 0;
                const deficit = Math.max(0, profiles.length - studentCountWithSkill);
                deficitCounter[reqS.name] = (deficitCounter[reqS.name] || 0) + deficit;
            });
        });

        const topDeficitSkills = Object.keys(deficitCounter)
            .map(skill => ({
                skill,
                deficitStudentCount: deficitCounter[skill],
                deficitPercentage: profiles.length > 0 ? Math.round((deficitCounter[skill] / profiles.length) * 100) : 0
            }))
            .sort((a, b) => b.deficitStudentCount - a.deficitStudentCount)
            .slice(0, 10);

        res.status(200).json({
            success: true,
            totalStudentsAnalyzed: profiles.length,
            topDeficitSkills
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Get all predefined industry roles with optional filters
// @route   GET /api/skills/roles
// @access  Private
exports.getIndustryRoles = async (req, res, next) => {
    try {
        const query = { isActive: true };

        if (req.query.industry) {
            query.industry = new RegExp(req.query.industry, 'i');
        }

        if (req.query.experienceLevel) {
            query.experienceLevel = req.query.experienceLevel;
        }

        if (req.query.search) {
            query.title = new RegExp(req.query.search, 'i');
        }

        const roles = await IndustryRole.find(query).sort({ title: 1 });
        res.status(200).json({ success: true, count: roles.length, data: roles });
    } catch (err) {
        next(err);
    }
};

// @desc    Get single industry role by ID
// @route   GET /api/skills/roles/:id
// @access  Private
exports.getIndustryRoleById = async (req, res, next) => {
    try {
        const role = await IndustryRole.findById(req.params.id);
        if (!role) {
            return res.status(404).json({ success: false, error: 'Industry role not found' });
        }
        res.status(200).json({ success: true, data: role });
    } catch (err) {
        next(err);
    }
};

// @desc    Create an industry role
// @route   POST /api/skills/roles
// @access  Private (Admin, TPO, Industry)
exports.createIndustryRole = async (req, res, next) => {
    try {
        req.body.createdBy = req.user.id;
        const role = await IndustryRole.create(req.body);
        res.status(201).json({ success: true, data: role });
    } catch (err) {
        next(err);
    }
};

// @desc    Update an industry role
// @route   PUT /api/skills/roles/:id
// @access  Private (Admin, TPO, Industry)
exports.updateIndustryRole = async (req, res, next) => {
    try {
        const role = await IndustryRole.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!role) {
            return res.status(404).json({ success: false, error: 'Industry role not found' });
        }
        res.status(200).json({ success: true, data: role });
    } catch (err) {
        next(err);
    }
};

// @desc    Delete an industry role
// @route   DELETE /api/skills/roles/:id
// @access  Private (Admin, TPO)
exports.deleteIndustryRole = async (req, res, next) => {
    try {
        const role = await IndustryRole.findById(req.params.id);
        if (!role) {
            return res.status(404).json({ success: false, error: 'Industry role not found' });
        }
        await role.deleteOne();
        res.status(200).json({ success: true, message: 'Role removed successfully' });
    } catch (err) {
        next(err);
    }
};
