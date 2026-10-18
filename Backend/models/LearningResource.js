/**
 * CareerSync Capstone Project
 * 
 * @module Backend/Models/LearningResource
 * @description Mongoose schema for Learning Hub Resources.
 * Designed by Vikas Yadav (Database & Backend Architecture).
 * Supports courses, bootcamps, workshops, hackathons, and certifications
 * to bridge student skill gaps identified during assessments.
 */
const mongoose = require('mongoose');

const LearningResourceSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Resource title is required'],
        trim: true,
        index: true
    },
    description: {
        type: String,
        trim: true
    },
    type: {
        type: String,
        enum: ['Course', 'Workshop', 'Bootcamp', 'Certification', 'Hackathon', 'Practice Resource'],
        required: [true, 'Resource type is required'],
        index: true
    },
    category: {
        type: String,
        enum: ['Technical', 'Soft Skills', 'Aptitude', 'Domain Specific', 'Interview Prep'],
        default: 'Technical'
    },
    skillsCovered: [{
        type: String,
        trim: true
    }],
    provider: {
        type: String,
        required: [true, 'Provider name is required'],
        trim: true
    },
    instructor: {
        type: String,
        trim: true
    },
    url: {
        type: String,
        trim: true
    },
    durationHours: {
        type: Number,
        min: 1
    },
    difficulty: {
        type: String,
        enum: ['Beginner', 'Intermediate', 'Advanced'],
        default: 'Beginner'
    },
    startDate: Date,
    endDate: Date,
    capacity: Number,
    enrolledCount: {
        type: Number,
        default: 0
    },
    isFree: {
        type: Boolean,
        default: true
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

// Compound indexes for searching resources by skills and type
LearningResourceSchema.index({ type: 1, difficulty: 1, isActive: 1 });
LearningResourceSchema.index({ skillsCovered: 1 });

module.exports = mongoose.model('LearningResource', LearningResourceSchema);
