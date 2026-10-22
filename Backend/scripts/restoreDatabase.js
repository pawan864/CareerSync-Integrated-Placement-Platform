/**
 * CareerSync Capstone Project
 * 
 * @module Backend/Scripts/RestoreDatabase
 * @description Disaster Recovery & Backup Restoration Utility.
 * Designed by Vikas Yadav (Database & Backend Architecture).
 * Usage: node scripts/restoreDatabase.js [snapshotDirectoryPath]
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

const restoreDatabase = async () => {
    try {
        const mongoUri = process.env.LOCAL_MONGO_URI || process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/careersync';
        console.log(`Connecting to MongoDB for restoration: ${mongoUri}`);
        await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 5000 });

        const backupsRoot = path.join(__dirname, '..', 'backups');
        let targetDir = process.argv[2];

        if (!targetDir) {
            if (!fs.existsSync(backupsRoot)) {
                throw new Error('No backups directory found. Run backupDatabase.js first.');
            }
            const snapshots = fs.readdirSync(backupsRoot)
                .filter(f => f.startsWith('snapshot-'))
                .sort()
                .reverse();

            if (snapshots.length === 0) {
                throw new Error('No backup snapshots available to restore.');
            }
            targetDir = path.join(backupsRoot, snapshots[0]);
        }

        console.log(`\nRestoring database from snapshot: ${targetDir}\n`);

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

        for (const col of collections) {
            const filePath = path.join(targetDir, `${col.name}.json`);
            if (fs.existsSync(filePath)) {
                const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
                if (data.length > 0) {
                    await col.model.deleteMany();
                    await col.model.insertMany(data);
                    console.log(`✓ Restored ${col.name} (${data.length} records)`);
                } else {
                    console.log(`- Skipped ${col.name} (0 records in snapshot)`);
                }
            }
        }

        console.log('\n--- Database Restoration Complete & Verified! ---\n');
        process.exit(0);
    } catch (err) {
        console.error(`Restoration failed: ${err.message}`);
        process.exit(1);
    }
};

if (require.main === module) {
    restoreDatabase();
}

module.exports = restoreDatabase;
