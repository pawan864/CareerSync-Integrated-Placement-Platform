/**
 * CareerSync Capstone Project
 * 
 * @module Backend/Data/IndustryRolesData
 * @description Standardized Industry Role Benchmarks for Skill-Gap Analysis & SIH Demonstrations.
 * Prepared by Vikas Yadav (Database & Backend Architecture).
 */
const industryRolesData = [
    {
        title: 'Full Stack MERN Developer',
        description: 'Designs and builds scalable full-stack web applications using MongoDB, Express, React, and Node.js.',
        industry: 'Information Technology',
        experienceLevel: 'Entry Level',
        expectedSalaryRange: { minLPA: 6, maxLPA: 12 },
        requiredSkills: [
            { name: 'React', level: 'Intermediate', category: 'Technical', isMandatory: true, weight: 5 },
            { name: 'Node.js', level: 'Intermediate', category: 'Technical', isMandatory: true, weight: 5 },
            { name: 'Express.js', level: 'Intermediate', category: 'Technical', isMandatory: true, weight: 4 },
            { name: 'MongoDB', level: 'Intermediate', category: 'Technical', isMandatory: true, weight: 4 },
            { name: 'JavaScript', level: 'Advanced', category: 'Technical', isMandatory: true, weight: 5 },
            { name: 'Tailwind CSS', level: 'Intermediate', category: 'Technical', isMandatory: false, weight: 3 },
            { name: 'Git', level: 'Intermediate', category: 'Tool', isMandatory: true, weight: 3 },
            { name: 'REST API', level: 'Intermediate', category: 'Technical', isMandatory: true, weight: 4 }
        ],
        recommendedCourses: [
            'Full Stack Web Development Bootcamp',
            'Mastering MERN Stack Production Architecture'
        ]
    },
    {
        title: 'Frontend Engineer (React)',
        description: 'Focuses on user interface performance, interactive UX, and state management in modern web apps.',
        industry: 'Information Technology',
        experienceLevel: 'Entry Level',
        expectedSalaryRange: { minLPA: 5.5, maxLPA: 10 },
        requiredSkills: [
            { name: 'React', level: 'Advanced', category: 'Technical', isMandatory: true, weight: 5 },
            { name: 'JavaScript', level: 'Advanced', category: 'Technical', isMandatory: true, weight: 5 },
            { name: 'HTML5', level: 'Advanced', category: 'Technical', isMandatory: true, weight: 4 },
            { name: 'CSS3', level: 'Advanced', category: 'Technical', isMandatory: true, weight: 4 },
            { name: 'Tailwind CSS', level: 'Intermediate', category: 'Technical', isMandatory: false, weight: 3 },
            { name: 'Redux', level: 'Intermediate', category: 'Technical', isMandatory: true, weight: 4 },
            { name: 'Framer Motion', level: 'Beginner', category: 'Technical', isMandatory: false, weight: 2 }
        ],
        recommendedCourses: [
            'Advanced React and State Management',
            'Modern Frontend UI/UX Design System'
        ]
    },
    {
        title: 'Backend & Cloud Engineer',
        description: 'Specializes in high-throughput API architecture, database optimization, and cloud microservices.',
        industry: 'Cloud & Infrastructure',
        experienceLevel: 'Entry Level',
        expectedSalaryRange: { minLPA: 6.5, maxLPA: 14 },
        requiredSkills: [
            { name: 'Node.js', level: 'Advanced', category: 'Technical', isMandatory: true, weight: 5 },
            { name: 'Express.js', level: 'Advanced', category: 'Technical', isMandatory: true, weight: 4 },
            { name: 'MongoDB', level: 'Advanced', category: 'Technical', isMandatory: true, weight: 4 },
            { name: 'SQL', level: 'Intermediate', category: 'Technical', isMandatory: true, weight: 4 },
            { name: 'Docker', level: 'Intermediate', category: 'Tool', isMandatory: false, weight: 3 },
            { name: 'JWT', level: 'Intermediate', category: 'Technical', isMandatory: true, weight: 3 },
            { name: 'System Design', level: 'Beginner', category: 'Technical', isMandatory: false, weight: 3 }
        ],
        recommendedCourses: [
            'Node.js Microservices and Cloud Deployments',
            'High Performance MongoDB Indexing & Optimization'
        ]
    },
    {
        title: 'Data Analyst & BI Specialist',
        description: 'Extracts actionable business insights through SQL queries, statistical analysis, and interactive dashboards.',
        industry: 'Data & Analytics',
        experienceLevel: 'Entry Level',
        expectedSalaryRange: { minLPA: 5, maxLPA: 9 },
        requiredSkills: [
            { name: 'SQL', level: 'Advanced', category: 'Technical', isMandatory: true, weight: 5 },
            { name: 'Python', level: 'Intermediate', category: 'Technical', isMandatory: true, weight: 4 },
            { name: 'Data Visualization', level: 'Intermediate', category: 'Domain', isMandatory: true, weight: 4 },
            { name: 'Excel', level: 'Advanced', category: 'Tool', isMandatory: true, weight: 3 },
            { name: 'Statistics', level: 'Intermediate', category: 'Domain', isMandatory: false, weight: 3 }
        ],
        recommendedCourses: [
            'Data Analytics with SQL and Python',
            'Business Intelligence and Visualization'
        ]
    }
];

module.exports = industryRolesData;
