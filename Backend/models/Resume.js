/**
 * CareerSync Capstone Project
 * 
 * @module Backend/Models/Resume
 * @description Mongoose schema for ATS-Compliant Resumes & Public Portfolios.
 * Designed by Vikas Yadav (Database & Backend Architecture).
 */
const mongoose = require('mongoose');

const ResumeSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true,
        index: true
    },
    headline: {
        type: String,
        trim: true
    },
    targetRole: {
        type: String,
        trim: true,
        index: true
    },
    professionalSummary: {
        type: String,
        trim: true
    },
    theme: {
        template: {
            type: String,
            enum: ['classic', 'modern', 'minimal', 'executive'],
            default: 'modern'
        },
        primaryColor: {
            type: String,
            default: '#2563eb'
        },
        fontFamily: {
            type: String,
            default: 'Inter'
        }
    },
    sectionsVisibility: {
        education: { type: Boolean, default: true },
        skills: { type: Boolean, default: true },
        projects: { type: Boolean, default: true },
        experience: { type: Boolean, default: true },
        certifications: { type: Boolean, default: true },
        achievements: { type: Boolean, default: true }
    },
    customSections: [{
        title: {
            type: String,
            required: true,
            trim: true
        },
        items: [{
            type: String,
            trim: true
        }]
    }],
    publicShare: {
        isPublic: {
            type: Boolean,
            default: false,
            index: true
        },
        shareSlug: {
            type: String,
            unique: true,
            sparse: true,
            trim: true
        }
    },
    atsScore: {
        score: {
            type: Number,
            min: 0,
            max: 100,
            default: 75
        },
        strengths: [String],
        improvements: [String],
        lastAnalyzedAt: {
            type: Date,
            default: Date.now
        }
    }
}, { timestamps: true });

module.exports = mongoose.model('Resume', ResumeSchema);
