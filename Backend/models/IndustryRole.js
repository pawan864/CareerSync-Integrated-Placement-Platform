/**
 * CareerSync Capstone Project
 * 
 * @module Backend/Models/IndustryRole
 * @description Mongoose schema for Industry Roles & Competency Standards.
 * Designed by Vikas Yadav (Database & Backend Architecture).
 * Defines required skills, proficiency benchmarks, and industry role metadata
 * used by the Skill-Gap Analysis and Role-Matching Engine.
 */
const mongoose = require('mongoose');

const RequiredSkillSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Skill name is required'],
        trim: true
    },
    level: {
        type: String,
        enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
        default: 'Intermediate'
    },
    category: {
        type: String,
        enum: ['Technical', 'Soft', 'Domain', 'Tool', 'Language'],
        default: 'Technical'
    },
    isMandatory: {
        type: Boolean,
        default: true
    },
    weight: {
        type: Number,
        default: 1,
        min: 1,
        max: 5
    }
}, { _id: false });

const IndustryRoleSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Role title is required'],
        trim: true,
        index: true
    },
    description: {
        type: String,
        trim: true
    },
    industry: {
        type: String,
        default: 'Information Technology',
        trim: true,
        index: true
    },
    experienceLevel: {
        type: String,
        enum: ['Entry Level', 'Associate', 'Mid-Senior Level'],
        default: 'Entry Level'
    },
    expectedSalaryRange: {
        minLPA: Number,
        maxLPA: Number
    },
    requiredSkills: [RequiredSkillSchema],
    recommendedCourses: [String],
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    isActive: {
        type: Boolean,
        default: true,
        index: true
    }
}, { timestamps: true });

// Compound index
IndustryRoleSchema.index({ industry: 1, title: 1 });

module.exports = mongoose.model('IndustryRole', IndustryRoleSchema);
