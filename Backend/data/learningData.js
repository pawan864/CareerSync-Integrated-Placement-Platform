/**
 * CareerSync Capstone Project
 * 
 * @module Backend/Data/LearningData
 * @description Standardized Learning Hub Programs, Workshops, and Bootcamps.
 * Prepared by Vikas Yadav (Database & Backend Architecture).
 */
const learningData = [
    {
        title: 'Full Stack MERN Placement Bootcamp',
        description: 'Comprehensive 8-week intensive bootcamp covering end-to-end full stack architecture, auth flows, state management, and production deployments.',
        type: 'Bootcamp',
        category: 'Technical',
        skillsCovered: ['React', 'Node.js', 'Express.js', 'MongoDB', 'JavaScript', 'REST API'],
        provider: 'CareerSync Academy',
        instructor: 'Senior Industry Engineers',
        url: 'https://careersync.edu/bootcamp/mern-stack',
        durationHours: 60,
        difficulty: 'Intermediate',
        capacity: 100,
        isFree: true
    },
    {
        title: 'Advanced Data Structures & Algorithms in C++',
        description: 'Master core competitive programming, dynamic programming, graph algorithms, and system-level memory optimization.',
        type: 'Course',
        category: 'Technical',
        skillsCovered: ['C++', 'Data Structures', 'Algorithms', 'Problem Solving'],
        provider: 'Department of Computer Science',
        instructor: 'Faculty Mentors',
        url: 'https://careersync.edu/courses/dsa-cpp',
        durationHours: 45,
        difficulty: 'Advanced',
        capacity: 150,
        isFree: true
    },
    {
        title: 'Modern Frontend Development with React & Tailwind',
        description: 'Build fast, responsive, and animated user interfaces using React, Tailwind CSS, and Framer Motion.',
        type: 'Workshop',
        category: 'Technical',
        skillsCovered: ['React', 'Tailwind CSS', 'Framer Motion', 'HTML5', 'CSS3'],
        provider: 'Frontend Guild',
        instructor: 'UI/UX Architects',
        url: 'https://careersync.edu/workshops/react-tailwind',
        durationHours: 12,
        difficulty: 'Beginner',
        capacity: 80,
        isFree: true
    },
    {
        title: 'MongoDB Query Optimization & High-Scale Indexing',
        description: 'Hands-on masterclass on compound indexing, aggregation pipelines, replica sets, and query execution plans.',
        type: 'Workshop',
        category: 'Technical',
        skillsCovered: ['MongoDB', 'Database Design', 'Indexing', 'Performance'],
        provider: 'Database Systems Group',
        instructor: 'Vikas Yadav & Faculty',
        url: 'https://careersync.edu/workshops/mongodb-indexing',
        durationHours: 8,
        difficulty: 'Intermediate',
        capacity: 60,
        isFree: true
    },
    {
        title: 'Campus Placement & Technical Interview Masterclass',
        description: 'Resume reviews, mock technical rounds, system design essentials, and HR interview preparation.',
        type: 'Practice Resource',
        category: 'Interview Prep',
        skillsCovered: ['Interview Prep', 'Communication', 'Resume Building', 'Soft Skills'],
        provider: 'Training and Placement Office (TPO)',
        instructor: 'TPO Placement Leads',
        url: 'https://careersync.edu/tpo/interview-masterclass',
        durationHours: 20,
        difficulty: 'Beginner',
        capacity: 250,
        isFree: true
    }
];

module.exports = learningData;
