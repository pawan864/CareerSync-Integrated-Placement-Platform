/**
 * CareerSync Capstone Project
 * 
 * @module Backend/Models/Opportunity
 * @description Mongoose schema for Opportunity functionality in the MERN stack.
 */
const mongoose = require('mongoose');

const OpportunitySchema = new mongoose.Schema({
    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'CompanyProfile',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['Internship', 'Placement', 'Project', 'Training'],
        required: true
    },
    description: String,
    responsibilities: String,
    location: String,
    workMode: {
        type: String,
        enum: ['On-site', 'Hybrid', 'Remote'],
        default: 'On-site'
    },
    department: {
        type: String,
        default: 'Software & Technology'
    },
    openings: {
        type: Number,
        default: 1
    },
    deadline: Date,
    stipendOrSalary: String,
    duration: String, // e.g., "6 months" or "Full-time"
    perks: [String],
    requiredSkills: [{
        name: { type: String, required: true },
        level: {
            type: String,
            enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
            default: 'Intermediate'
        },
        isMandatory: {
            type: Boolean,
            default: true
        }
    }],
    eligibilityCriteria: {
        minCgpa: { type: Number, default: 0 },
        branches: [String],
        gradYear: [Number]
    },
    status: {
        type: String,
        enum: ['Open', 'Closed', 'Paused', 'Draft'],
        default: 'Open'
    },
    moderationStatus: {
        type: String,
        enum: ['approved', 'pending', 'flagged', 'rejected'],
        default: 'approved'
    },
    moderationReason: {
        type: String,
        default: ''
    },
    flaggedCount: {
        type: Number,
        default: 0
    },
    moderatedBy: {
        type: String,
        default: 'Administrator'
    },
    moderatedAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

module.exports = mongoose.model('Opportunity', OpportunitySchema);
