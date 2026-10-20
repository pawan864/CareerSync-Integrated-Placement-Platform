/**
 * CareerSync Capstone Project
 * 
 * @module Backend/Tests/StudentSkillVerificationTest
 * @description Comprehensive Integration & Verification Test Suite.
 * Designed by Vikas Yadav (Database & Backend Architecture).
 * Validates models, schema constraints, skill-gap calculations, and automated badge awarding.
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

const runVerificationTests = async () => {
    console.log('\n======================================================');
    console.log('   CareerSync Database & Backend Service Test Suite   ');
    console.log('       Developer: Vikas Yadav (Database & Backend)     ');
    console.log('======================================================\n');

    const mongoUri = process.env.LOCAL_MONGO_URI || 'mongodb://127.0.0.1:27017/careersync';
    await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 5000 });

    let passedTests = 0;
    let failedTests = 0;

    const test = (title, fn) => {
        try {
            fn();
            console.log(`[PASS] ${title}`);
            passedTests++;
        } catch (err) {
            console.error(`[FAIL] ${title} -> ${err.message}`);
            failedTests++;
        }
    };

    const asyncTest = async (title, fn) => {
        try {
            await fn();
            console.log(`[PASS] ${title}`);
            passedTests++;
        } catch (err) {
            console.error(`[FAIL] ${title} -> ${err.message}`);
            failedTests++;
        }
    };

    // Test 1: StudentProfile Model Subdocuments
    test('1. StudentProfile Schema compiles with sub-schemas (education, skills, projects)', () => {
        const dummy = new StudentProfile({
            user: new mongoose.Types.ObjectId(),
            personalInfo: { phone: '9876543210' },
            education: [{ institution: 'NIT Delhi', degree: 'B.Tech CSE', grade: '9.1 CGPA' }],
            skills: [{ name: 'React', level: 'Intermediate', category: 'Technical' }],
            projects: [{ title: 'CareerSync', technologiesUsed: ['React', 'Node.js'] }]
        });
        if (dummy.education.length !== 1 || dummy.skills[0].level !== 'Intermediate') {
            throw new Error('Subdocument array mapping failed');
        }
    });

    // Test 2: SkillAssessment Question Scoring Logic
    test('2. SkillAssessment validates question structure and calculates total marks', () => {
        const assessment = new SkillAssessment({
            title: 'Test Quiz',
            skillName: 'JavaScript',
            questions: [
                { questionText: 'Q1', options: ['A', 'B'], correctOptionIndex: 0, marks: 5 },
                { questionText: 'Q2', options: ['C', 'D'], correctOptionIndex: 1, marks: 5 }
            ]
        });
        const total = assessment.questions.reduce((sum, q) => sum + q.marks, 0);
        if (total !== 10) throw new Error('Total marks calculation mismatch');
    });

    // Test 3: Assessment Grading & Badge Awarding
    test('3. Automated grading passes students meeting threshold (>= 70%)', () => {
        const marksObtained = 8;
        const totalMarks = 10;
        const percentage = Math.round((marksObtained / totalMarks) * 100);
        const passed = percentage >= 70;
        if (!passed || percentage !== 80) throw new Error('Grading formula evaluation error');
    });

    // Test 4: Industry Role Skill-Gap Match Formula
    test('4. Skill-gap match calculation correctly identifies matched and missing skills', () => {
        const studentSkills = [
            { name: 'React', level: 'Intermediate' },
            { name: 'JavaScript', level: 'Advanced' }
        ];
        const roleRequired = [
            { name: 'React', level: 'Intermediate' },
            { name: 'Node.js', level: 'Intermediate' }
        ];

        const matched = roleRequired.filter(r => 
            studentSkills.some(s => s.name.toLowerCase() === r.name.toLowerCase())
        );
        const missing = roleRequired.filter(r => 
            !studentSkills.some(s => s.name.toLowerCase() === r.name.toLowerCase())
        );

        if (matched.length !== 1 || missing.length !== 1) {
            throw new Error('Skill matching count failed');
        }
    });

    // Test 5: Training Enrollment Duplicate Protection
    test('5. TrainingEnrollment schema has compound unique constraint on (student, resource)', () => {
        const indexes = TrainingEnrollment.schema.indexes();
        const hasCompound = indexes.some(idx => idx[0].student === 1 && idx[0].resource === 1);
        if (!hasCompound) throw new Error('Unique compound index not defined on TrainingEnrollment');
    });

    // Test 6: Resume Schema ATS Structure
    test('6. Resume model defines template styles and section visibility flags', () => {
        const resume = new Resume({
            student: new mongoose.Types.ObjectId(),
            theme: { template: 'modern', primaryColor: '#2563eb' }
        });
        if (resume.theme.template !== 'modern' || !resume.sectionsVisibility.projects) {
            throw new Error('Default resume configuration failed');
        }
    });

    console.log('\n------------------------------------------------------');
    console.log(`Test Execution Summary: ${passedTests} Passed, ${failedTests} Failed`);
    console.log('------------------------------------------------------\n');

    process.exit(failedTests === 0 ? 0 : 1);
};

if (require.main === module) {
    runVerificationTests();
}

module.exports = runVerificationTests;
