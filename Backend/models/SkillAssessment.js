/**
 * CareerSync Capstone Project
 * 
 * @module Backend/Models/SkillAssessment
 * @description Mongoose schema for Skill Assessments.
 * Designed by Vikas Yadav (Database & Backend Architecture).
 * Enables standardized skill assessments, quizzes, and automated scoring
 * to award verified skill badges to students.
 */
const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
    questionText: {
        type: String,
        required: [true, 'Question text is required'],
        trim: true
    },
    options: {
        type: [String],
        validate: {
            validator: function (v) {
                return Array.isArray(v) && v.length >= 2;
            },
            message: 'Each question must have at least two options'
        },
        required: true
    },
    correctOptionIndex: {
        type: Number,
        required: [true, 'Correct option index is required'],
        min: 0
    },
    marks: {
        type: Number,
        default: 1
    },
    explanation: {
        type: String,
        trim: true
    }
});

const SkillAssessmentSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Assessment title is required'],
        trim: true,
        index: true
    },
    skillName: {
        type: String,
        required: [true, 'Skill name is required'],
        trim: true,
        index: true
    },
    category: {
        type: String,
        enum: ['Technical', 'Soft', 'Domain', 'Tool', 'Language'],
        default: 'Technical'
    },
    difficulty: {
        type: String,
        enum: ['Beginner', 'Intermediate', 'Advanced'],
        default: 'Intermediate'
    },
    description: {
        type: String,
        trim: true
    },
    timeLimitMinutes: {
        type: Number,
        default: 20,
        min: 5,
        max: 180
    },
    passingScorePercentage: {
        type: Number,
        default: 70,
        min: 0,
        max: 100
    },
    questions: [QuestionSchema],
    totalMarks: {
        type: Number,
        default: 0
    },
    isActive: {
        type: Boolean,
        default: true,
        index: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, { timestamps: true });

// Auto-calculate totalMarks before save
SkillAssessmentSchema.pre('save', function (next) {
    if (this.questions && this.questions.length > 0) {
        this.totalMarks = this.questions.reduce((sum, q) => sum + (q.marks || 1), 0);
    }
    next();
});

// Compound indexes
SkillAssessmentSchema.index({ skillName: 1, difficulty: 1 });

module.exports = mongoose.model('SkillAssessment', SkillAssessmentSchema);
