/**
 * CareerSync Capstone Project
 * 
 * @module Backend/Scripts/OptimizeIndexes
 * @description Database Performance Optimization & Index Management Script.
 * Designed by Vikas Yadav (Database & Backend Architecture).
 * Ensures compound indexes are generated and analyzes collection query performance.
 */
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const StudentProfile = require('../models/StudentProfile');
const SkillAssessment = require('../models/SkillAssessment');
const AssessmentHistory = require('../models/AssessmentHistory');
const LearningResource = require('../models/LearningResource');
const TrainingEnrollment = require('../models/TrainingEnrollment');
const IndustryRole = require('../models/IndustryRole');
const Resume = require('../models/Resume');

const optimizeDatabaseIndexes = async () => {
    try {
        const mongoUri = process.env.LOCAL_MONGO_URI || 'mongodb://127.0.0.1:27017/careersync';
        console.log(`Connecting to MongoDB for index optimization: ${mongoUri}`);
        await mongoose.connect(mongoUri);

        console.log('\n--- Syncing & Verifying Collection Indexes ---');

        // 1. Student Profiles
        await StudentProfile.syncIndexes();
        console.log('✓ StudentProfile indexes synchronized:');
        const profileIndexes = await StudentProfile.collection.indexes();
        profileIndexes.forEach(idx => console.log(`   - ${JSON.stringify(idx.key)}`));

        // 2. Skill Assessments
        await SkillAssessment.syncIndexes();
        console.log('✓ SkillAssessment indexes synchronized:');
        const assessmentIndexes = await SkillAssessment.collection.indexes();
        assessmentIndexes.forEach(idx => console.log(`   - ${JSON.stringify(idx.key)}`));

        // 3. Assessment History
        await AssessmentHistory.syncIndexes();
        console.log('✓ AssessmentHistory indexes synchronized:');
        const historyIndexes = await AssessmentHistory.collection.indexes();
        historyIndexes.forEach(idx => console.log(`   - ${JSON.stringify(idx.key)}`));

        // 4. Learning Resources
        await LearningResource.syncIndexes();
        console.log('✓ LearningResource indexes synchronized:');
        const learningIndexes = await LearningResource.collection.indexes();
        learningIndexes.forEach(idx => console.log(`   - ${JSON.stringify(idx.key)}`));

        // 5. Training Enrollments
        await TrainingEnrollment.syncIndexes();
        console.log('✓ TrainingEnrollment indexes synchronized:');
        const enrollmentIndexes = await TrainingEnrollment.collection.indexes();
        enrollmentIndexes.forEach(idx => console.log(`   - ${JSON.stringify(idx.key)}`));

        // 6. Industry Roles
        await IndustryRole.syncIndexes();
        console.log('✓ IndustryRole indexes synchronized');

        // 7. Resumes
        await Resume.syncIndexes();
        console.log('✓ Resume indexes synchronized');

        console.log('\nAll database indexes successfully created and verified for production performance!\n');
        process.exit(0);
    } catch (err) {
        console.error(`Index optimization failed: ${err.message}`);
        process.exit(1);
    }
};

if (require.main === module) {
    optimizeDatabaseIndexes();
}

module.exports = optimizeDatabaseIndexes;
