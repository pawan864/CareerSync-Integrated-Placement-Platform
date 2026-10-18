/**
 * CareerSync Capstone Project
 * 
 * @module Backend/Models/TrainingEnrollment
 * @description Mongoose schema for Student Training & Learning Enrollments.
 * Designed by Vikas Yadav (Database & Backend Architecture).
 * Tracks student enrollment, completion status, and certificates.
 */
const mongoose = require('mongoose');

const TrainingEnrollmentSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    resource: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'LearningResource',
        required: true,
        index: true
    },
    status: {
        type: String,
        enum: ['Enrolled', 'In Progress', 'Completed', 'Dropped'],
        default: 'Enrolled',
        index: true
    },
    progressPercentage: {
        type: Number,
        min: 0,
        max: 100,
        default: 0
    },
    enrolledAt: {
        type: Date,
        default: Date.now
    },
    completionDate: Date,
    certificateUrl: {
        type: String,
        trim: true
    },
    notes: String
}, { timestamps: true });

// Prevent duplicate enrollment for the same student and resource
TrainingEnrollmentSchema.index({ student: 1, resource: 1 }, { unique: true });

module.exports = mongoose.model('TrainingEnrollment', TrainingEnrollmentSchema);
