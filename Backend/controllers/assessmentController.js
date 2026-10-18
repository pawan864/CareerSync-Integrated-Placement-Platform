/**
 * CareerSync Capstone Project
 * 
 * @module Backend/Controllers/assessmentController
 * @description Controllers for Skill Assessment, automated scoring, and verifiable badges.
 * Designed by Vikas Yadav (Database & Backend Architecture).
 */
const SkillAssessment = require('../models/SkillAssessment');
const AssessmentHistory = require('../models/AssessmentHistory');
const StudentProfile = require('../models/StudentProfile');

// @desc    Get all active assessments with optional filters
// @route   GET /api/assessments
// @access  Private
exports.getAssessments = async (req, res, next) => {
    try {
        const query = { isActive: true };

        if (req.query.skillName) {
            query.skillName = new RegExp(req.query.skillName, 'i');
        }

        if (req.query.difficulty) {
            query.difficulty = req.query.difficulty;
        }

        if (req.query.category) {
            query.category = req.query.category;
        }

        const assessments = await SkillAssessment.find(query)
            .select('-questions.correctOptionIndex -questions.explanation')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: assessments.length,
            data: assessments
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Get single assessment for taking (omits correct answers to prevent cheating)
// @route   GET /api/assessments/:id
// @access  Private
exports.getAssessmentById = async (req, res, next) => {
    try {
        const assessment = await SkillAssessment.findById(req.params.id)
            .select('-questions.correctOptionIndex -questions.explanation');

        if (!assessment || !assessment.isActive) {
            return res.status(404).json({ success: false, error: 'Assessment not found' });
        }

        res.status(200).json({ success: true, data: assessment });
    } catch (err) {
        next(err);
    }
};

// @desc    Submit assessment answers, auto-score, and award verified badge
// @route   POST /api/assessments/:id/submit
// @access  Private (Student)
exports.submitAssessment = async (req, res, next) => {
    try {
        const { answers = [], timeSpentSeconds = 0 } = req.body;
        const assessment = await SkillAssessment.findById(req.params.id);

        if (!assessment || !assessment.isActive) {
            return res.status(404).json({ success: false, error: 'Assessment not found' });
        }

        let marksObtained = 0;
        let totalMarks = 0;
        const evaluatedAnswers = [];
        const questionMap = new Map();

        assessment.questions.forEach((q) => {
            questionMap.set(q._id.toString(), q);
            totalMarks += q.marks || 1;
        });

        // Evaluate submitted answers
        answers.forEach((ans) => {
            const question = questionMap.get(ans.questionId ? ans.questionId.toString() : '');
            if (question) {
                const isCorrect = Number(ans.selectedOptionIndex) === Number(question.correctOptionIndex);
                if (isCorrect) {
                    marksObtained += question.marks || 1;
                }
                evaluatedAnswers.push({
                    questionId: question._id,
                    selectedOptionIndex: Number(ans.selectedOptionIndex),
                    isCorrect,
                    explanation: question.explanation,
                    correctOptionIndex: question.correctOptionIndex
                });
            }
        });

        const percentage = totalMarks > 0 ? Math.round((marksObtained / totalMarks) * 100) : 0;
        const passed = percentage >= assessment.passingScorePercentage;

        // Save assessment attempt in history
        const historyRecord = await AssessmentHistory.create({
            student: req.user.id,
            assessment: assessment._id,
            skillName: assessment.skillName,
            marksObtained,
            totalMarks,
            percentage,
            passed,
            answers: evaluatedAnswers.map(a => ({
                questionId: a.questionId,
                selectedOptionIndex: a.selectedOptionIndex,
                isCorrect: a.isCorrect
            })),
            timeSpentSeconds,
            completedAt: new Date()
        });

        // If passed, update student profile skills to award Verified Badge & Proficiency Score
        let badgeAwarded = false;
        if (passed) {
            let profile = await StudentProfile.findOne({ user: req.user.id });
            if (!profile) {
                profile = await StudentProfile.create({ user: req.user.id });
            }

            const existingSkill = profile.skills.find(
                s => s.name.toLowerCase() === assessment.skillName.toLowerCase()
            );

            if (existingSkill) {
                existingSkill.isVerified = true;
                existingSkill.verifiedAt = new Date();
                existingSkill.proficiencyScore = Math.max(existingSkill.proficiencyScore || 0, percentage);
                if (percentage >= 85) existingSkill.level = 'Expert';
                else if (percentage >= 70) existingSkill.level = 'Advanced';
            } else {
                profile.skills.push({
                    name: assessment.skillName,
                    level: percentage >= 85 ? 'Expert' : 'Advanced',
                    category: assessment.category || 'Technical',
                    isVerified: true,
                    verifiedAt: new Date(),
                    proficiencyScore: percentage
                });
            }

            await profile.save();
            badgeAwarded = true;
        }

        res.status(200).json({
            success: true,
            data: {
                attemptId: historyRecord._id,
                skillName: assessment.skillName,
                marksObtained,
                totalMarks,
                percentage,
                passed,
                passingScorePercentage: assessment.passingScorePercentage,
                badgeAwarded,
                feedback: passed 
                    ? `Congratulations! You scored ${percentage}% and earned a verified ${assessment.skillName} badge.` 
                    : `You scored ${percentage}%. You need ${assessment.passingScorePercentage}% to earn the verified badge. Keep practicing!`,
                details: evaluatedAnswers
            }
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Get logged in student's assessment history & earned badges
// @route   GET /api/assessments/my/history
// @access  Private (Student)
exports.getMyAssessmentHistory = async (req, res, next) => {
    try {
        const history = await AssessmentHistory.find({ student: req.user.id })
            .populate('assessment', ['title', 'difficulty', 'category'])
            .sort({ completedAt: -1 });

        const badgesEarned = history.filter(h => h.passed).map(h => ({
            skillName: h.skillName,
            percentage: h.percentage,
            earnedAt: h.completedAt
        }));

        res.status(200).json({
            success: true,
            count: history.length,
            badgesEarned,
            data: history
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Create a new assessment
// @route   POST /api/assessments
// @access  Private (Admin, Faculty, TPO)
exports.createAssessment = async (req, res, next) => {
    try {
        const {
            title,
            skillName,
            category,
            difficulty,
            description,
            timeLimitMinutes,
            passingScorePercentage,
            questions
        } = req.body;

        if (!title || !skillName || !questions || questions.length === 0) {
            return res.status(400).json({
                success: false,
                error: 'Title, skillName, and at least one question are required'
            });
        }

        const assessment = await SkillAssessment.create({
            title,
            skillName,
            category: category || 'Technical',
            difficulty: difficulty || 'Intermediate',
            description,
            timeLimitMinutes: timeLimitMinutes || 20,
            passingScorePercentage: passingScorePercentage || 70,
            questions,
            createdBy: req.user.id
        });

        res.status(201).json({ success: true, data: assessment });
    } catch (err) {
        next(err);
    }
};

// @desc    Delete or deactivate an assessment
// @route   DELETE /api/assessments/:id
// @access  Private (Admin, Faculty)
exports.deleteAssessment = async (req, res, next) => {
    try {
        const assessment = await SkillAssessment.findById(req.params.id);
        if (!assessment) {
            return res.status(404).json({ success: false, error: 'Assessment not found' });
        }

        await assessment.deleteOne();
        res.status(200).json({ success: true, message: 'Assessment removed successfully' });
    } catch (err) {
        next(err);
    }
};
