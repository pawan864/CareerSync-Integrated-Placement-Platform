/**
 * CareerSync Capstone Project
 * 
 * @module Backend/Seeder
 * @description Database Seeder & Demo Data Population Tool for Development & SIH Evaluations.
 * Designed by Vikas Yadav (Database & Backend Architecture).
 * Usage:
 *   node seeder.js -i   (Import seed data)
 *   node seeder.js -d   (Destroy all seeded data)
 */
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const IndustryRole = require('./models/IndustryRole');
const SkillAssessment = require('./models/SkillAssessment');
const LearningResource = require('./models/LearningResource');

const industryRolesData = require('./data/industryRolesData');
const assessmentsData = require('./data/assessmentsData');
const learningData = require('./data/learningData');

const mongoUri = process.env.LOCAL_MONGO_URI || process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/careersync';

const importData = async () => {
    try {
        console.log(`Connecting to MongoDB at: ${mongoUri}`);
        await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 5000 });

        console.log('\n--- Seeding CareerSync Core Datasets ---');

        // 1. Industry Roles
        await IndustryRole.deleteMany();
        const createdRoles = await IndustryRole.insertMany(industryRolesData);
        console.log(`✓ Inserted ${createdRoles.length} Industry Roles`);

        // 2. Skill Assessments
        await SkillAssessment.deleteMany();
        const createdAssessments = await SkillAssessment.insertMany(assessmentsData);
        console.log(`✓ Inserted ${createdAssessments.length} Skill Assessments`);

        // 3. Learning Hub Resources
        await LearningResource.deleteMany();
        const createdLearning = await LearningResource.insertMany(learningData);
        console.log(`✓ Inserted ${createdLearning.length} Learning Resources`);

        console.log('\nSeed Data Imported Successfully for SIH and Project Demonstrations!\n');
        process.exit(0);
    } catch (err) {
        console.error(`Seeding error: ${err.message}`);
        process.exit(1);
    }
};

const destroyData = async () => {
    try {
        console.log(`Connecting to MongoDB at: ${mongoUri}`);
        await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 5000 });

        await IndustryRole.deleteMany();
        await SkillAssessment.deleteMany();
        await LearningResource.deleteMany();

        console.log('\nAll seeded database records cleared successfully!\n');
        process.exit(0);
    } catch (err) {
        console.error(`Destruction error: ${err.message}`);
        process.exit(1);
    }
};

if (process.argv[2] === '-i') {
    importData();
} else if (process.argv[2] === '-d') {
    destroyData();
} else {
    console.log('Usage: node seeder.js -i (import) | node seeder.js -d (destroy)');
    process.exit(0);
}
