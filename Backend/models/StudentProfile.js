/**
 * CareerSync Capstone Project
 * 
 * @module Backend/Models/StudentProfile
 * @description Comprehensive Mongoose schema for Student Profiles in CareerSync.
 * Designed by Vikas Yadav (Database & Backend Architecture).
 * Includes detailed subdocuments for Education, Skills, Projects,
 * Certifications, Experience, Achievements, Placement Status, and ATS Resume.
 */
const mongoose = require('mongoose');

// Education Sub-Schema with Verification Support
const EducationSchema = new mongoose.Schema({
    institution: {
        type: String,
        required: [true, 'Institution name is required'],
        trim: true
    },
    degree: {
        type: String,
        required: [true, 'Degree is required'],
        trim: true
    },
    fieldOfStudy: {
        type: String,
        trim: true
    },
    startYear: {
        type: Number,
        min: 1990,
        max: 2040
    },
    endYear: {
        type: Number,
        min: 1990,
        max: 2040
    },
    current: {
        type: Boolean,
        default: false
    },
    grade: {
        type: String, // e.g. "8.8 CGPA" or "88%"
        trim: true
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    verifiedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, { timestamps: true });

// Skill Sub-Schema with Assessment Score and Verification Badges
const SkillItemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Skill name is required'],
        trim: true
    },
    level: {
        type: String,
        enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
        default: 'Beginner'
    },
    category: {
        type: String,
        enum: ['Technical', 'Soft', 'Domain', 'Tool', 'Language'],
        default: 'Technical'
    },
    proficiencyScore: {
        type: Number,
        min: 0,
        max: 100,
        default: 0
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    verifiedAt: Date
}, { _id: true });

// Project Sub-Schema
const ProjectItemSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Project title is required'],
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    technologiesUsed: [{
        type: String,
        trim: true
    }],
    githubUrl: {
        type: String,
        trim: true
    },
    liveUrl: {
        type: String,
        trim: true
    },
    startDate: Date,
    endDate: Date,
    isOngoing: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

// Certification Sub-Schema
const CertificationItemSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Certification title is required'],
        trim: true
    },
    issuer: {
        type: String,
        required: [true, 'Issuing organization is required'],
        trim: true
    },
    dateIssued: Date,
    expiryDate: Date,
    credentialId: {
        type: String,
        trim: true
    },
    url: {
        type: String,
        trim: true
    },
    isVerified: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

// Internship / Work Experience Sub-Schema
const ExperienceItemSchema = new mongoose.Schema({
    company: {
        type: String,
        required: [true, 'Company name is required'],
        trim: true
    },
    role: {
        type: String,
        required: [true, 'Job role is required'],
        trim: true
    },
    employmentType: {
        type: String,
        enum: ['Full-time', 'Part-time', 'Internship', 'Contract', 'Freelance'],
        default: 'Internship'
    },
    location: {
        type: String,
        trim: true
    },
    startDate: Date,
    endDate: Date,
    current: {
        type: Boolean,
        default: false
    },
    description: {
        type: String,
        trim: true
    }
}, { timestamps: true });

// Achievement / Contest Sub-Schema
const AchievementItemSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Achievement title is required'],
        trim: true
    },
    category: {
        type: String,
        enum: ['Hackathon', 'Competition', 'Academic', 'Publication', 'Award', 'Other'],
        default: 'Competition'
    },
    date: Date,
    description: {
        type: String,
        trim: true
    },
    certificateUrl: {
        type: String,
        trim: true
    }
}, { timestamps: true });

// Main Student Profile Schema
const StudentProfileSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true,
        index: true
    },
    personalInfo: {
        headline: {
            type: String,
            trim: true
        },
        bio: {
            type: String,
            trim: true
        },
        phone: {
            type: String,
            trim: true
        },
        address: {
            street: String,
            city: String,
            state: String,
            country: String,
            pinCode: String
        },
        portfolioUrl: {
            type: String,
            trim: true
        },
        githubUrl: {
            type: String,
            trim: true
        },
        linkedinUrl: {
            type: String,
            trim: true
        }
    },
    academicInfo: {
        college: {
            type: String,
            trim: true
        },
        department: {
            type: String,
            trim: true,
            index: true
        },
        semester: {
            type: Number,
            min: 1,
            max: 12
        },
        graduationYear: {
            type: Number,
            min: 2000,
            max: 2040,
            index: true
        },
        cgpa: {
            type: Number,
            min: 0,
            max: 10,
            index: true
        },
        rollNumber: {
            type: String,
            trim: true
        }
    },
    education: [EducationSchema],
    skills: [SkillItemSchema],
    projects: [ProjectItemSchema],
    certifications: [CertificationItemSchema],
    experience: [ExperienceItemSchema],
    achievements: [AchievementItemSchema],
    careerInterests: {
        targetRoles: [{
            type: String,
            trim: true
        }],
        preferredLocations: [{
            type: String,
            trim: true
        }],
        willingToRelocate: {
            type: Boolean,
            default: true
        },
        expectedSalaryMinLPA: Number
    },
    placementStatus: {
        status: {
            type: String,
            enum: ['Seeking Opportunities', 'Interviewing', 'Placed', 'Higher Studies', 'Opted Out'],
            default: 'Seeking Opportunities',
            index: true
        },
        placedCompany: {
            type: String,
            trim: true
        },
        packageLPA: Number,
        placedDate: Date
    },
    resumeData: {
        summary: {
            type: String,
            trim: true
        },
        customSections: [{
            heading: String,
            items: [String]
        }],
        lastUpdated: {
            type: Date,
            default: Date.now
        }
    }
}, { timestamps: true });

// Compound and Performance Indexes
StudentProfileSchema.index({ 'academicInfo.department': 1, 'academicInfo.graduationYear': 1 });
StudentProfileSchema.index({ 'skills.name': 1 });
StudentProfileSchema.index({ 'placementStatus.status': 1, 'academicInfo.cgpa': -1 });

module.exports = mongoose.model('StudentProfile', StudentProfileSchema);
