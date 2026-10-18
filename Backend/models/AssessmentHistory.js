/**
 * CareerSync Capstone Project
 * 
 * @module Backend/Models/AssessmentHistory
 * @description Mongoose schema for Student Assessment Attempts & History.
 * Designed by Vikas Yadav (Database & Backend Architecture).
 * Records each student assessment attempt, answers, scores, and pass/fail outcome.
 */
const mongoose = require('mongoose');

const AnswerRecordSchema = new mongoose.Schema({
    questionId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    selectedOptionIndex: {
        type: Number,
        required: true
    },
    isCorrect: {
        type: Boolean,
        default: false
    }
}, { _id: false });

const AssessmentHistorySchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    assessment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SkillAssessment',
        required: true,
        index: true
    },
    skillName: {
        type: String,
        required: true,
        trim: true,
        index: true
    },
    marksObtained: {
        type: Number,
        required: true,
        default: 0
    },
    totalMarks: {
        type: Number,
        required: true,
        default: 0
    },
    percentage: {
        type: Number,
        required: true,
        min: 0,
        max: 100
    },
    passed: {
        type: Boolean,
        required: true,
        default: false,
        index: true
    },
    answers: [AnswerRecordSchema],
    timeSpentSeconds: {
        type: Number,
        default: 0
    },
    completedAt: {
        type: Date,
        default: Date.now,
        index: true
    }
}, { timestamps: true });

// Compound index for querying a student's history on a specific skill/assessment
AssessmentHistorySchema.index({ student: 1, assessment: 1 });
AssessmentHistorySchema.index({ student: 1, skillName: 1, passed: 1 });

module.exports = mongoose.model('AssessmentHistory', AssessmentHistorySchema);
