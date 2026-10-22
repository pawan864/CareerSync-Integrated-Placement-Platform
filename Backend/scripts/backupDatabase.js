/**
 * CareerSync Capstone Project
 * 
 * @module Backend/Scripts/BackupDatabase
 * @description Automated Database Backup & Snapshot Utility.
 * Designed by Vikas Yadav (Database & Backend Architecture).
 * Usage: node scripts/backupDatabase.js
 */
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const StudentProfile = require('../models/StudentProfile');
const SkillAssessment = require('../models/SkillAssessment');
const AssessmentHistory = require('../models/AssessmentHistory');
const LearningResource = require('../models/LearningResource');
const TrainingEnrollment = require('../models/TrainingEnrollment');
const IndustryRole = require('../models/IndustryRole');
const Resume = require('../models/Resume');
const User = require('../models/User');

const backupDatabase = async () => {
    try {
        const mongoUri = process.env.LOCAL_MONGO_URI || process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/careersync';
        console.log(`Connecting to MongoDB for backup: ${mongoUri}`);
        await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 5000 });

        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const backupDir = path.join(__dirname, '..', 'backups', `snapshot-${timestamp}`);

        if (!fs.existsSync(backupDir)) {
            fs.mkdirSync(backupDir, { recursive: true });
        }

        console.log(`\nStarting Database Backup -> Target: ${backupDir}\n`);

        const collections = [
            { name: 'users', model: User },
            { name: 'studentprofiles', model: StudentProfile },
            { name: 'industryroles', model: IndustryRole },
            { name: 'skillassessments', model: SkillAssessment },
            { name: 'assessmenthistories', model: AssessmentHistory },
            { name: 'learningresources', model: LearningResource },
            { name: 'trainingenrollments', model: TrainingEnrollment },
            { name: 'resumes', model: Resume }
        ];

        const manifest = {
            timestamp: new Date().toISOString(),
            database: mongoose.connection.name,
            collections: {}
        };

        for (const col of collections) {
            const data = await col.model.find().lean();
            const filePath = path.join(backupDir, `${col.name}.json`);
            fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
            manifest.collections[col.name] = data.length;
            console.log(`✓ Backed up ${col.name} (${data.length} records)`);
        }

        fs.writeFileSync(path.join(backupDir, 'manifest.json'), JSON.stringify(manifest, null, 2));

        console.log('\n--- Backup Completed Successfully! ---');
        console.log(`Manifest saved at: ${path.join(backupDir, 'manifest.json')}\n`);

        process.exit(0);
    } catch (err) {
        console.error(`Backup failed: ${err.message}`);
        process.exit(1);
    }
};

if (require.main === module) {
    backupDatabase();
}

module.exports = backupDatabase;
