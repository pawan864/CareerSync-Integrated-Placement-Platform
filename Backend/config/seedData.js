const User = require('../models/User');

const seedDemoUsers = async () => {
    try {
        const count = await User.countDocuments();
        if (count > 0) return;

        console.log('🌱 Seeding initial demo accounts for CareerSync...');

        const demoUsers = [
            {
                name: 'System Administrator',
                email: 'admin@careersync.com',
                password: 'admin123',
                role: 'admin',
                verificationStatus: 'approved'
            },
            {
                name: 'John Doe',
                email: 'student@careersync.com',
                password: 'student123',
                role: 'student',
                studentId: 'STU2026001',
                college: 'National Institute of Technology',
                course: 'B.Tech',
                branch: 'Computer Science',
                semester: '8th Semester',
                phone: '9876543210',
                verificationStatus: 'approved'
            },
            {
                name: 'Dr. Jane Smith',
                email: 'faculty@careersync.com',
                password: 'faculty123',
                role: 'faculty',
                facultyId: 'FAC2026001',
                department: 'Computer Science and Engineering',
                designation: 'Associate Professor',
                expertise: 'Artificial Intelligence, Machine Learning',
                phone: '9876543211',
                verificationStatus: 'approved'
            },
            {
                name: 'Alex Johnson',
                email: 'recruiter@careersync.com',
                password: 'recruiter123',
                role: 'recruiter',
                companyName: 'TechCorp Solutions',
                corporateEmail: 'recruiter@careersync.com',
                website: 'https://careersync.example.com',
                industryType: 'Information Technology',
                companySize: '500-1000',
                location: 'Bangalore, India',
                phone: '9876543212',
                verificationStatus: 'approved'
            },
            {
                name: 'Prof. Robert Davis',
                email: 'tpo@careersync.com',
                password: 'tpo123',
                role: 'tpo',
                tpoId: 'TPO2026001',
                college: 'National Institute of Technology',
                institutionCode: 'INST001',
                phone: '9876543213',
                verificationStatus: 'approved'
            }
        ];

        for (const user of demoUsers) {
            await User.create(user);
        }

        console.log('✅ Demo accounts seeded successfully:');
        console.log('   - Admin:     admin@careersync.com / admin123');
        console.log('   - Student:   student@careersync.com / student123');
        console.log('   - Faculty:   faculty@careersync.com / faculty123');
        console.log('   - Recruiter: recruiter@careersync.com / recruiter123');
        console.log('   - TPO:       tpo@careersync.com / tpo123 (Code: INST001)');
    } catch (err) {
        console.error('Error seeding demo data:', err.message);
    }
};

module.exports = seedDemoUsers;
