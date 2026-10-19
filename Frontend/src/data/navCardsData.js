/**
 * Domain Metadata for Navbar Showcase Cards
 * Grounded, practical, human-written copy representing an Indian campus recruitment platform.
 */

export const navCardsData = {
    // -------------------------------------------------------------------------
    // 1. HOME: PLATFORM FEATURES
    // -------------------------------------------------------------------------
    'home-features': {
        id: 'home-features',
        cardType: 'platform-features',
        category: 'Platform Overview',
        badge: 'All-in-One Campus Portal',
        title: 'How CareerSync Connects Students, Colleges & Companies',
        tagline: 'A single place where students prepare, placement cells coordinate drives, and companies hire fresh talent.',
        description: 'Instead of juggling WhatsApp groups, multiple Google Sheets, and job portals, CareerSync keeps everyone on the same page throughout campus placement season.',
        accentColor: 'blue',
        keyStats: [
            { label: 'Colleges Active', value: '120+', sub: 'Across 18 states' },
            { label: 'Registered Students', value: '50,000+', sub: 'Final & pre-final years' },
            { label: 'Visiting Companies', value: '450+', sub: 'Startups to MNCs' },
            { label: 'Campus Placement', value: '84%', sub: 'Average batch placement' }
        ],
        rolesData: {
            student: {
                id: 'student',
                label: 'For Students',
                tag: 'Interview Prep & Drives',
                badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-400/30',
                title: 'Check Your Resume & Learn What Companies Look For',
                desc: 'Upload your resume to see which skills match current campus openings and what topics you should brush up on before test day.',
                roleTarget: 'Target Role: Full-Stack Developer / SDE-1',
                matchScore: 87,
                matchedSkills: ['React', 'JavaScript', 'Node.js', 'SQL', 'Git', 'Data Structures', 'REST APIs'],
                missingSkills: ['Docker Basics', 'Redis Caching', 'System Design Fundamentals'],
                metrics: [
                    { label: 'Resume Match', value: '87%' },
                    { label: 'Eligible Drives', value: '24 Companies' },
                    { label: 'Practice Tests Done', value: '12 Tests' }
                ],
                primaryBtn: { label: 'Check Your Skill Match', link: '/skill-gap' }
            },
            tpo: {
                id: 'tpo',
                label: 'For Placement Cells (TPO)',
                tag: 'Placement Cell Management',
                badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30',
                title: 'Manage Drives, Check Eligibility & Generate Reports',
                desc: 'Filter eligible students by marks and branch in seconds, send drive announcements, enforce dream-offer limits, and download placement data for NAAC and NIRF records.',
                roleTarget: 'Batch 2026: 1,480 Registered Candidates',
                matchScore: 84.2,
                tools: [
                    { name: 'NAAC & NIRF Reports', detail: 'Download clean Excel and PDF reports with median salary and placement percentages' },
                    { name: 'Dream-Offer Rules', detail: 'Automatically prevent placed students from blocking opportunities for others' },
                    { name: 'Drive Announcements', detail: 'Send test links, hall tickets, and timing updates directly to eligible students' },
                    { name: 'Unplaced Students List', detail: 'Quickly find students who still need an offer to arrange extra practice rounds' }
                ],
                metrics: [
                    { label: 'Batch Placed', value: '84.2%' },
                    { label: 'Average Package', value: '₹7.8 LPA' },
                    { label: 'Drives Completed', value: '38 Companies' }
                ],
                primaryBtn: { label: 'Go to Placement Portal', link: '/institution' }
            },
            recruiter: {
                id: 'recruiter',
                label: 'For Hiring Teams',
                tag: 'Fresher Recruitment',
                badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-400/30',
                title: 'Shortlist Students & Schedule Campus Rounds',
                desc: 'Filter candidates by verified college marks, branch, and programming skills. Send online coding tests and schedule interviews without going through messy resume piles.',
                roleTarget: 'Campus Pipeline: Graduate Engineer Trainee (SDE)',
                matchScore: 68,
                tools: [
                    { name: 'College-Verified Marks', detail: 'Student CGPA and active backlogs verified by the university placement cell' },
                    { name: 'Online Coding Tests', detail: 'Built-in coding assessments with test cases in C++, Java, Python, and JavaScript' },
                    { name: 'Interview Schedules', detail: 'Coordinate multi-round interview slots directly with the college placement office' },
                    { name: 'Digital Offer Letters', detail: 'Send offer letters through the portal and track candidate acceptance in real time' }
                ],
                metrics: [
                    { label: 'Shortlisted Pool', value: '140 Students' },
                    { label: 'Test Clear Rate', value: '68%' },
                    { label: 'Time to Close Drive', value: '4 Days' }
                ],
                primaryBtn: { label: 'Go to Recruiter Dashboard', link: '/employer' }
            }
        },
        primaryBtn: { label: 'Check Your Skill Match', link: '/skill-gap' },
        secondaryBtn: { label: 'Browse Campus Openings', link: '/jobs' }
    },

    // -------------------------------------------------------------------------
    // 2. HOME: SUCCESS STORIES (HALL OF FAME)
    // -------------------------------------------------------------------------
    'home-success': {
        id: 'home-success',
        cardType: 'platform-success',
        category: 'Student Placements',
        badge: 'Placement Season 2025-26',
        title: 'Real Students. Dream Jobs. Practical Journeys.',
        tagline: 'How students from state and private engineering colleges prepared for and cracked top campus drives.',
        description: 'See where our students landed their first jobs, the projects they built, and what they focused on during preparation.',
        accentColor: 'blue',
        keyStats: [
            { label: 'Highest Package', value: '₹44.5 LPA', sub: 'Cloud SDE Role' },
            { label: 'Median Package', value: '₹8.4 LPA', sub: 'Across all placed batches' },
            { label: 'Total Placed', value: '18,400+', sub: 'In the last academic year' },
            { label: 'Core Technical Roles', value: '78%', sub: 'Software & engineering' }
        ],
        heroCandidate: {
            name: 'Meera Nambiar',
            college: 'Amrita Vishwa Vidyapeetham • CSE 2025',
            company: 'NVIDIA',
            role: 'Software Engineer',
            package: '₹32.0 LPA',
            badge: 'Featured Placement',
            quote: 'The skill gap tool showed me exactly what GPU and deep learning libraries NVIDIA expected for their campus test. Fixing those gaps in my projects helped me answer questions confidently during the technical round.',
            skills: ['Python', 'CUDA Basics', 'PyTorch', 'Data Structures'],
            metrics: 'Selected through on-campus technical drive'
        },
        ctcDistribution: [
            { range: '₹15+ LPA (Product & R&D)', pct: 22, count: '4,048 Offers' },
            { range: '₹8 – ₹15 LPA (High-Growth Tech)', pct: 44, count: '8,096 Offers' },
            { range: '₹4.5 – ₹8 LPA (IT Services & Core)', pct: 34, count: '6,256 Offers' }
        ],
        alumniProfiles: [
            {
                id: 'rohan',
                category: 'tier1',
                name: 'Rohan Sharma',
                initials: 'RS',
                role: 'Software Engineer',
                company: 'Google',
                package: '₹28.5 LPA',
                college: 'Chandigarh University (CSE 2025)',
                quote: 'Practicing system design basics and distributed systems mock questions 2 months before Google\'s drive gave me a huge advantage.',
                skills: ['Go', 'System Design', 'Algorithms'],
                badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
            },
            {
                id: 'priya',
                category: 'tier23',
                name: 'Priya Patel',
                initials: 'PP',
                role: 'Associate Consultant',
                company: 'Microsoft',
                package: '₹18.5 LPA',
                college: 'Sardar Patel Institute of Tech (IT 2025)',
                quote: 'Coming from a state college, getting noticed was tough. Having my projects and verified marks on CareerSync helped the campus team review my profile properly.',
                skills: ['Azure Basics', 'C#', 'SQL'],
                badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/30'
            },
            {
                id: 'aniket',
                category: 'interns',
                name: 'Aniket Deshmukh',
                initials: 'AD',
                role: 'Intern to Full-Time SDE',
                company: 'Amazon',
                package: '₹1.1L / mo (Stipend)',
                college: 'Pune Institute of Computer Tech (ECE 2026)',
                quote: 'I applied through my college drive on CareerSync. The entire screening test and interview slot were handled without any confusion.',
                skills: ['Java', 'Spring Boot', 'AWS'],
                badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30'
            },
            {
                id: 'vikram',
                category: 'tier1',
                name: 'Vikram Joshi',
                initials: 'VJ',
                role: 'Backend Developer',
                company: 'Razorpay',
                package: '₹22.0 LPA',
                college: 'Jadavpur University (EE 2025)',
                quote: 'A senior engineer on CareerSync looked at my backend project and recommended using Redis caching. The Razorpay interviewer asked about that exact topic.',
                skills: ['Node.js', 'PostgreSQL', 'Redis'],
                badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30'
            }
        ],
        primaryBtn: { label: 'Start Your Skill Check', link: '/skill-gap' },
        secondaryBtn: { label: 'Complete Your Profile', link: '/profile' }
    },

    // -------------------------------------------------------------------------
    // 3. HOME: TESTIMONIALS (CAMPUS FEEDBACK)
    // -------------------------------------------------------------------------
    'home-testimonials': {
        id: 'home-testimonials',
        cardType: 'platform-testimonials',
        category: 'Campus Feedback',
        badge: 'TPOs & Recruiters',
        title: 'Trusted by College Placement Officers & Hiring Leads',
        tagline: 'Making placement season manageable for colleges and straightforward for companies.',
        description: 'Read how college placement directors simplified student tracking and how hiring managers closed their campus drives faster.',
        accentColor: 'indigo',
        keyStats: [
            { label: 'Partner Colleges', value: '120+', sub: 'Universities & colleges' },
            { label: 'Corporate Recruiters', value: '450+', sub: 'Participating companies' },
            { label: 'Admin Time Saved', value: '60%', sub: 'Less spreadsheet work' },
            { label: 'Student Rating', value: '4.8 / 5', sub: 'From verified users' }
        ],
        trustBadges: [
            'NAAC & NIRF Data Ready',
            'College Verified Credentials',
            'Secure Student Privacy',
            'Covers All Indian Branches'
        ],
        sectionsData: {
            deans: {
                label: 'Placement Officers & Deans',
                subtitle: 'Accurate student data, automated eligibility, and smooth drive days',
                testimonials: [
                    {
                        quote: 'Before CareerSync, our placement team spent whole nights updating Excel sheets for company shortlists. Now we filter eligible students and send the list to recruiters in five minutes.',
                        author: 'Dr. R. K. Verma',
                        title: 'Head of Corporate Relations & Placements',
                        institution: 'State Engineering College, Roorkee',
                        avatarInitials: 'RV',
                        rating: 5,
                        verifiedBadge: 'College Placement Head'
                    },
                    {
                        quote: 'The dream-offer rule works automatically. Once a student accepts an offer above 10 LPA, they cannot apply for smaller packages, which gives other deserving students a fair chance.',
                        author: 'Prof. Suresh Nair',
                        title: 'Training & Placement Officer',
                        institution: 'Govt. Model Engineering College',
                        avatarInitials: 'SN',
                        rating: 5,
                        verifiedBadge: 'Verified TPO'
                    }
                ],
                metrics: [
                    { label: 'Partner Colleges', value: '120+' },
                    { label: 'Time Saved per Drive', value: '60%' },
                    { label: 'Error-Free Lists', value: '100%' }
                ],
                primaryBtn: { label: 'Get CareerSync for Your College', link: '/support?type=partnerships' }
            },
            recruiters: {
                label: 'Campus Recruiters',
                subtitle: 'Verified candidate marks, quick shortlisting, and easy test scheduling',
                testimonials: [
                    {
                        quote: 'We wanted 50 backend freshers who genuinely understood SQL and Node.js. Filtering by college marks and real project experience helped us wrap up our drive in under a week.',
                        author: 'Ananya Sen',
                        title: 'Lead Campus Recruiter',
                        institution: 'Enterprise Tech Solutions',
                        avatarInitials: 'AS',
                        rating: 5,
                        verifiedBadge: 'Campus Hiring Lead'
                    },
                    {
                        quote: 'Having verified college marks and no fake resumes saves our technical interviewers hours of frustration. The students we interviewed were well-prepared.',
                        author: 'Kunal Singhania',
                        title: 'Senior Talent Acquisition Specialist',
                        institution: 'FinTech Startup Hub',
                        avatarInitials: 'KS',
                        rating: 5,
                        verifiedBadge: 'Technical Recruiter'
                    }
                ],
                metrics: [
                    { label: 'Active Companies', value: '450+' },
                    { label: 'Average Drive Length', value: '4 Days' },
                    { label: 'Screening Time Saved', value: '75%' }
                ],
                primaryBtn: { label: 'Hire from Campuses', link: '/support?type=sales' }
            },
            students: {
                label: 'Students & Alumni',
                subtitle: 'Fair interview chances, clear job criteria, and practical guidance',
                testimonials: [
                    {
                        quote: 'I used to worry that being from a non-metro college meant my resume would never get opened. The skill assessment showed my coding strengths, and I got my first interview shortlist with a cloud firm.',
                        author: 'Rohan Sharma',
                        title: 'Software Engineer @ Google',
                        institution: 'Chandigarh University Alum',
                        avatarInitials: 'RS',
                        rating: 5,
                        verifiedBadge: 'Placed Student'
                    },
                    {
                        quote: 'Having all drive notifications, syllabus details, and test links in one place reduced placement anxiety completely. You always know what is coming next.',
                        author: 'Pooja Hegde',
                        title: 'Hardware Engineer @ Qualcomm',
                        institution: 'ECE Graduate 2025',
                        avatarInitials: 'PH',
                        rating: 5,
                        verifiedBadge: 'Placed Student'
                    }
                ],
                metrics: [
                    { label: 'Students Placed', value: '18,400+' },
                    { label: 'Student Satisfaction', value: '98%' },
                    { label: 'Cost to Students', value: 'Free' }
                ],
                primaryBtn: { label: 'Check Your Resume Match', link: '/skill-gap' }
            }
        },
        primaryBtn: { label: 'Partner with CareerSync', link: '/support?type=partnerships' },
        secondaryBtn: { label: 'Contact Support', link: '/support?type=helpdesk' }
    },

    // -------------------------------------------------------------------------
    // 4. ABOUT: OUR MISSION
    // -------------------------------------------------------------------------
    'about-mission': {
        id: 'about-mission',
        cardType: 'mission',
        category: 'Why We Built This',
        badge: 'Our Mission',
        title: 'Equal Campus Opportunities for Every Student',
        tagline: 'Hard work and genuine programming skills should matter more than college location.',
        description: 'Over 15 lakh engineering students graduate in India each year. Too many miss out on good opportunities because of outdated placement systems and lack of proper guidance. CareerSync was created to fix that.',
        accentColor: 'blue',
        transformationMatrix: {
            broken: {
                title: 'How Traditional Campus Placements Usually Run',
                subtitle: 'Manual spreadsheets, confusing notices, and missed deadlines',
                points: [
                    { title: 'Dozens of Confusing Spreadsheets', desc: 'Placement cells juggle multiple Excel files and WhatsApp chats, often leading to missed deadlines and incorrect student lists.' },
                    { title: 'College Tier Bias', desc: 'Good coders at smaller colleges often get ignored simply because tier-1 tech companies only visit a handful of metro campuses.' },
                    { title: 'Unverified Resume Claims', desc: 'Resumes with exaggerated projects make it hard for recruiters to find students who actually know how to code.' },
                    { title: 'No Preparation Feedback', desc: 'Students who get rejected in coding rounds rarely get feedback on what topics they need to improve.' }
                ]
            },
            future: {
                title: 'How CareerSync Simplifies the Process',
                subtitle: 'Clear criteria, verified records, and transparent drive schedules',
                points: [
                    { title: 'One Organized Campus Directory', desc: 'Student marks and branch details are verified once by the college, keeping all company shortlists clean and accurate.' },
                    { title: 'Focus on Real Coding Skills', desc: 'Recruiters evaluate candidates on practical programming questions and actual project work rather than resume buzzwords.' },
                    { title: 'Trusted College Records', desc: 'Marks, backlogs, and degrees are verified directly through the college placement office, giving employers confidence.' },
                    { title: 'Clear Skill Guidance for Students', desc: 'Shows students which concepts they are missing for specific jobs, giving them clear direction on what to practice.' }
                ]
            }
        },
        primaryBtn: { label: 'Browse Campus Openings', link: '/jobs' },
        secondaryBtn: { label: 'Read Student FAQs', link: '/support?type=faq' }
    },

    // -------------------------------------------------------------------------
    // 5. ABOUT: OUR TEAM
    // -------------------------------------------------------------------------
    'about-team': {
        id: 'about-team',
        cardType: 'team',
        category: 'Core Team',
        badge: 'Engineering & Campus Relations',
        title: 'The People Building CareerSync',
        tagline: 'Built by software engineers and former college placement officers who understand campus recruitment.',
        description: 'Our team combines hands-on engineering experience with years of coordinating on-ground placement drives across Indian universities.',
        accentColor: 'slate',
        keyStats: [
            { label: 'Engineers', value: '18 Members', sub: 'Full-stack & backend' },
            { label: 'Campus Advisors', value: '6 Ex-TPOs', sub: 'College coordinators' },
            { label: 'Platform Uptime', value: '99.9%', sub: 'Reliable on drive days' },
            { label: 'Support Response', value: '< 2 Hours', sub: 'During active drives' }
        ],
        teamMembers: [
            {
                name: 'Dr. Sameer Kulkarni',
                role: 'Head of Product & Matching',
                pedigree: 'IIT Bombay Alum • 12+ yrs experience',
                focus: 'Focuses on matching student skills with company job descriptions to give students realistic preparation roadmaps.',
                avatar: 'SK',
                badge: 'Product'
            },
            {
                name: 'Aarav Singhania',
                role: 'Lead Systems Architect',
                pedigree: 'Former Backend Lead at Flipkart',
                focus: 'Ensures the platform runs smoothly without crashing when 10,000+ students take online coding tests on campus drive days.',
                avatar: 'AS',
                badge: 'Infrastructure'
            },
            {
                name: 'Deepika Ramanathan',
                role: 'Head of University Relations',
                pedigree: 'Former TPO Head (NIT Trichy Network)',
                focus: 'Works closely with college placement directors across India to ensure CareerSync meets real college compliance and NAAC requirements.',
                avatar: 'DR',
                badge: 'Campus Strategy'
            },
            {
                name: 'Kabir Mehta',
                role: 'Lead Security Engineer',
                pedigree: '10+ yrs in Student Data Privacy',
                focus: 'Ensures student phone numbers, resumes, and academic grades remain strictly private and secure at all times.',
                avatar: 'KM',
                badge: 'Security & Privacy'
            }
        ],
        primaryBtn: { label: 'See Openings at CareerSync', link: '/jobs' },
        secondaryBtn: { label: 'Contact Our Team', link: '/support?type=helpdesk' }
    },

    // -------------------------------------------------------------------------
    // 6. STUDENTS: MOCK INTERVIEWS
    // -------------------------------------------------------------------------
    'student-mock-interviews': {
        id: 'student-mock-interviews',
        cardType: 'interview',
        category: 'Interview Preparation',
        badge: 'Coding Practice Sandbox',
        title: 'Technical Coding Practice & Mock Interview Rounds',
        tagline: 'Practice real coding problems asked in technical rounds with instant test case feedback.',
        description: 'Solve frequently asked data structure questions in an integrated code editor. Check edge cases, time complexity, and memory limits before taking actual campus screening tests.',
        accentColor: 'indigo',
        keyStats: [
            { label: 'Coding Questions', value: '1,200+', sub: 'Campus drive patterns' },
            { label: 'Languages', value: 'C++, Java, Python, JS', sub: 'Standard compilers' },
            { label: 'Test Feedback', value: 'Instant', sub: 'Hidden test cases' },
            { label: 'Students Practicing', value: '25,000+', sub: 'Active monthly' }
        ],
        interviewRounds: [
            {
                title: 'Round 1: Data Structures & Algorithms (45 mins)',
                desc: 'Practice arrays, strings, two-pointers, trees, and dynamic programming with automated test suites.',
                tag: 'Online Test'
            },
            {
                title: 'Round 2: System Design & Backend Basics (45 mins)',
                desc: 'Understand how real apps handle databases, indexing, API caching, and server architecture.',
                tag: 'Technical Round'
            },
            {
                title: 'Round 3: HR & Behavioral Questions (30 mins)',
                desc: 'Learn how to answer questions about college projects, team conflicts, and personal strengths calmly.',
                tag: 'HR Discussion'
            }
        ],
        codeSnippet: `// Example: Finding the median of two sorted arrays
function findMedianSortedArrays(nums1: number[], nums2: number[]): number {
    if (nums1.length > nums2.length) return findMedianSortedArrays(nums2, nums1);
    const m = nums1.length, n = nums2.length;
    let low = 0, high = m;
    while (low <= high) {
        const partitionX = (low + high) >> 1;
        const partitionY = ((m + n + 1) >> 1) - partitionX;
        const maxLeftX = partitionX === 0 ? -Infinity : nums1[partitionX - 1];
        const minRightX = partitionX === m ? Infinity : nums1[partitionX];
        if (maxLeftX <= minRightX) return (maxLeftX + minRightX) / 2;
    }
    return 0.0;
}`,
        primaryBtn: { label: 'Start Practicing Coding', link: '/register' },
        secondaryBtn: { label: 'Check Your Skill Match', link: '/skill-gap' }
    },

    // -------------------------------------------------------------------------
    // 7. INSTITUTIONS: STUDENT ROSTER
    // -------------------------------------------------------------------------
    'institution-roster': {
        id: 'institution-roster',
        cardType: 'roster',
        category: 'Campus Directory',
        badge: 'Placement Cell Tool',
        title: 'Student Directory & Drive Eligibility Lists',
        tagline: 'Track students across CSE, IT, ECE, and other branches with verified CGPAs and current offer status.',
        description: 'Placement coordinators can quickly check who is eligible for an upcoming drive, see who has already accepted an offer, and identify students who still need interview calls.',
        accentColor: 'blue',
        keyStats: [
            { label: 'Excel Import', value: 'Supported', sub: 'Upload full college lists' },
            { label: 'Branch Filters', value: '1-Click', sub: 'CSE, IT, ECE, Mech, etc.' },
            { label: 'Backlog Check', value: 'Automatic', sub: 'Filter by live backlogs' },
            { label: 'Unplaced Tracking', value: 'Live', sub: 'Spot students needing help' }
        ],
        rosterSample: [
            { name: 'Aditya Varma', roll: '21CS104', branch: 'CSE', cgpa: '9.4', offer: '₹28.5 LPA (Google)', status: 'Offer Accepted', statusColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' },
            { name: 'Sneha Kulkarni', roll: '21IT088', branch: 'IT', cgpa: '8.9', offer: 'Technical Round 2', status: 'Interviewing (Microsoft)', statusColor: 'bg-blue-500/20 text-blue-300 border-blue-500/30' },
            { name: 'Manish Rawat', roll: '21EC042', branch: 'ECE', cgpa: '8.2', offer: 'Online Test Cleared', status: 'Shortlisted (Amazon)', statusColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30' },
            { name: 'Kavya Nair', roll: '21CS205', branch: 'CSE', cgpa: '8.6', offer: 'Drive Eligible', status: 'Ready for Test', statusColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30' },
            { name: 'Tanmay Deshmukh', roll: '21IT112', branch: 'IT', cgpa: '9.1', offer: '₹21.0 LPA (Razorpay)', status: 'Offer Accepted', statusColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' },
            { name: 'Pooja Hegde', roll: '21EC079', branch: 'ECE', cgpa: '8.5', offer: 'Final Discussion', status: 'Interviewing (Qualcomm)', statusColor: 'bg-blue-500/20 text-blue-300 border-blue-500/30' }
        ],
        primaryBtn: { label: 'Open Placement Portal', link: '/institution' },
        secondaryBtn: { label: 'Request College Access', link: '/support?type=sales' }
    },

    // -------------------------------------------------------------------------
    // 8. INSTITUTIONS: PLACEMENT REPORTS
    // -------------------------------------------------------------------------
    'institution-reports': {
        id: 'institution-reports',
        cardType: 'feature',
        category: 'Accreditation Reports',
        badge: 'NIRF & NAAC Ready',
        title: 'Placement Statistics & Accreditation Reports',
        tagline: 'Download clean Excel and PDF reports with median salary and branch placement percentages.',
        description: 'Compiling placement data for NAAC or NIRF visits usually takes weeks of manual work. CareerSync exports verified placement records and salary distributions in minutes.',
        accentColor: 'indigo',
        keyStats: [
            { label: 'Export Formats', value: 'PDF & Excel', sub: 'Ready for review' },
            { label: 'NIRF Fields', value: 'Complete', sub: 'Median package & count' },
            { label: 'Branch Reports', value: 'Separate', sub: 'Per department view' },
            { label: 'Preparation Time', value: 'Minutes', sub: 'No manual counting' }
        ],
        featurePillars: [
            {
                tag: 'Salary Distribution',
                title: 'Package Breakdown by Range',
                desc: 'See the highest, median, and average compensation offered across all engineering branches for the academic year.',
                metric: 'Accurate Numbers'
            },
            {
                tag: 'Company Trends',
                title: 'Visiting Companies History',
                desc: 'Review which companies visit regularly, average hires per firm, and package growth across past placement seasons.',
                metric: 'Yearly Comparison'
            },
            {
                tag: 'Policy Adherence',
                title: 'Dream Offer Rule Tracking',
                desc: 'Ensure students follow college placement guidelines regarding single offers, dream packages, and core firm eligibility.',
                metric: 'Zero Disputes'
            },
            {
                tag: 'Accreditation Sheets',
                title: 'Formatted Summary for NAAC / NIRF',
                desc: 'Pre-formatted placement summary tables ready for college committee meetings and accreditation documentation.',
                metric: 'Clean Exports'
            }
        ],
        primaryBtn: { label: 'View Placement Reports', link: '/institution' },
        secondaryBtn: { label: 'Contact Support', link: '/support?type=helpdesk' }
    },

    // -------------------------------------------------------------------------
    // 9. INSTITUTIONS: ALUMNI NETWORK
    // -------------------------------------------------------------------------
    'institution-alumni': {
        id: 'institution-alumni',
        cardType: 'team',
        category: 'Alumni Network',
        badge: 'College Community',
        title: 'Alumni Mentorship & Senior Referrals',
        tagline: 'Connect graduated seniors working at top software companies with final-year campus students.',
        description: 'Alumni can share honest advice about company culture, review junior resumes, and share internal job referrals when their teams are hiring.',
        accentColor: 'teal',
        keyStats: [
            { label: 'Alumni Registered', value: '12,000+', sub: 'Across top IT firms' },
            { label: 'Junior Referrals', value: '3,800+', sub: 'For fresher roles' },
            { label: 'Active Companies', value: '850+ Firms', sub: 'Startups & MNCs' },
            { label: 'Mock Sessions', value: 'Regular', sub: 'Conducted on weekends' }
        ],
        teamMembers: [
            {
                name: 'Kunal Singhania (Batch 2021)',
                role: 'Software Engineer @ Uber',
                pedigree: 'Referred 12 college juniors in 2025',
                focus: 'Helps students prepare for backend technical rounds and reviews their database project architectures.',
                avatar: 'KS',
                badge: 'Active Referrer'
            },
            {
                name: 'Tanvi Deshmukh (Batch 2022)',
                role: 'Product Specialist @ Swiggy',
                pedigree: 'Mentored 25+ final-year students',
                focus: 'Helps students explain college projects clearly and prepares them for product analyst interviews.',
                avatar: 'TD',
                badge: 'Project Mentor'
            },
            {
                name: 'Harsh Vardhan (Batch 2020)',
                role: 'Senior Backend SDE @ Atlassian',
                pedigree: 'Hosted 3 campus code workshops',
                focus: 'Reviews real-world microservices projects and explains what production code looks like.',
                avatar: 'HV',
                badge: 'Tech Mentor'
            },
            {
                name: 'Ananya Roy (Batch 2023)',
                role: 'AI Engineer @ Microsoft',
                pedigree: 'Published research papers in college',
                focus: 'Guides students interested in computer vision and machine learning on building practical portfolio projects.',
                avatar: 'AR',
                badge: 'AI Mentor'
            }
        ],
        primaryBtn: { label: 'Explore Alumni Network', link: '/institution' },
        secondaryBtn: { label: 'Register as College Alum', link: '/register' }
    },

    // -------------------------------------------------------------------------
    // 10. EMPLOYERS: TALENT SEARCH
    // -------------------------------------------------------------------------
    'employer-talent-search': {
        id: 'employer-talent-search',
        cardType: 'talent-search',
        category: 'Fresher Hiring',
        badge: 'Verified Candidates',
        title: 'Search Students by Branch, Marks & Technical Skills',
        tagline: 'Find college students who actually know the technologies you use, backed by college-verified marks.',
        description: 'Filter candidates by specific programming stacks, academic thresholds, and branch. Send online test links directly to shortlisted students.',
        accentColor: 'blue',
        keyStats: [
            { label: 'Student Profiles', value: '50,000+', sub: 'Verified by colleges' },
            { label: 'Shortlisting Time', value: 'Fast', sub: 'Filter by stack & CGPA' },
            { label: 'Direct Test Invites', value: '1-Click', sub: 'Send test links easily' },
            { label: 'No Fake Marks', value: 'Verified', sub: 'Checked by TPO cells' }
        ],
        talentCandidates: [
            { name: 'Siddharth Iyer', college: 'IIT Madras (CSE 2025)', stack: ['React', 'Go', 'Docker', 'PostgreSQL'], cgpa: '9.3', githubRank: 'Active Open Source', leetcode: '450+ Solved', status: 'Available' },
            { name: 'Ritu Sen', college: 'BITS Pilani (EEE 2025)', stack: ['Python', 'FastAPI', 'Redis', 'SQL'], cgpa: '8.8', githubRank: '32 Repositories', leetcode: '380+ Solved', status: 'Available' },
            { name: 'Abhishek Roy', college: 'NIT Trichy (IT 2025)', stack: ['Python', 'PyTorch', 'Data Analysis'], cgpa: '9.1', githubRank: 'Kaggle Competitions', leetcode: '400+ Solved', status: 'Available' },
            { name: 'Nisha Pillai', college: 'DTU Delhi (COE 2025)', stack: ['Node.js', 'AWS Basics', 'Docker', 'Linux'], cgpa: '8.7', githubRank: 'Full-Stack Apps', leetcode: '320+ Solved', status: 'Available' }
        ],
        primaryBtn: { label: 'Start Shortlisting Talent', link: '/employer' },
        secondaryBtn: { label: 'Schedule a Recruiter Demo', link: '/support?type=sales' }
    },

    // -------------------------------------------------------------------------
    // 11. EMPLOYERS: HIRING ANALYTICS
    // -------------------------------------------------------------------------
    'employer-analytics': {
        id: 'employer-analytics',
        cardType: 'feature',
        category: 'Campus Analytics',
        badge: 'Hiring Funnel',
        title: 'Campus Drive Progress & Hiring Funnel',
        tagline: 'Track test completion rates, technical interview feedback, and offer acceptance in one dashboard.',
        description: 'See how many candidates applied, cleared the online screening, and accepted offer letters across all the colleges you are visiting this year.',
        accentColor: 'purple',
        keyStats: [
            { label: 'Offer Acceptance', value: '88%', sub: 'Healthy join ratio' },
            { label: 'Average Drive Length', value: '4 Days', sub: 'From test to rollout' },
            { label: 'Campus Visits', value: 'Tracked', sub: 'Compare college results' },
            { label: 'No-Show Rate', value: '< 5%', sub: 'Accurate attendance' }
        ],
        featurePillars: [
            {
                tag: 'Screening Funnel',
                title: 'Track Candidate Progress',
                desc: 'See how many candidates passed each stage: online assessment, technical interview, and final offer rollout.',
                metric: 'Stage-by-Stage View'
            },
            {
                tag: 'Test Calibration',
                title: 'Review Coding Test Difficulty',
                desc: 'Check if your test was too tough or too easy based on score distributions across visiting colleges.',
                metric: 'Score Analytics'
            },
            {
                tag: 'College Comparison',
                title: 'Compare Performance by College',
                desc: 'See which campuses had the highest test pass rates and offer acceptances to plan next year\'s recruitment schedule.',
                metric: 'Campus Insights'
            },
            {
                tag: 'Offer Management',
                title: 'Digital Offers & Acceptance',
                desc: 'Send formal offer letters through the portal and see candidate responses without waiting for days of email back-and-forth.',
                metric: 'Fast Turnaround'
            }
        ],
        primaryBtn: { label: 'Open Recruiter Dashboard', link: '/employer' },
        secondaryBtn: { label: 'Contact Hiring Support', link: '/support?type=sales' }
    },

    // -------------------------------------------------------------------------
    // 12. MENTORSHIP: FIND A MENTOR
    // -------------------------------------------------------------------------
    'mentorship-find': {
        id: 'mentorship-find',
        cardType: 'mentor',
        category: '1-on-1 Guidance',
        badge: 'Working Developers',
        title: 'Book a 1-on-1 Session with a Working Software Engineer',
        tagline: 'Get practical resume feedback, interview advice, and honest career guidance from people in the industry.',
        description: 'Talk directly with software engineers from companies like Amazon, Atlassian, Swiggy, and Razorpay. They will review your projects and help you prepare for technical interviews.',
        accentColor: 'amber',
        keyStats: [
            { label: 'Active Mentors', value: '600+', sub: 'From startups & MNCs' },
            { label: 'Sessions Completed', value: '14,000+', sub: '1-on-1 video calls' },
            { label: 'Student Rating', value: '4.9 / 5', sub: 'From verified reviews' },
            { label: 'Session Length', value: '45 mins', sub: 'Dedicated time' }
        ],
        featuredMentors: [
            {
                name: 'Aditya Nair',
                role: 'Senior SDE @ Atlassian',
                exp: '8+ yrs experience',
                focus: 'Reviews backend projects, explains microservices concepts, and helps with technical interview prep.',
                rating: '4.9',
                reviews: 142,
                tags: ['Backend', 'Java', 'System Design'],
                slots: ['Today 6:00 PM', 'Tomorrow 4:30 PM', 'Sat 11:00 AM']
            },
            {
                name: 'Shruti Sen',
                role: 'Engineering Manager @ Swiggy',
                exp: '10+ yrs experience',
                focus: 'Gives honest resume feedback, helps with career roadmaps, and prepares students for HR rounds.',
                rating: '4.9',
                reviews: 98,
                tags: ['Resume Review', 'Career Advice', 'HR Prep'],
                slots: ['Today 7:30 PM', 'Tomorrow 6:00 PM', 'Sun 10:00 AM']
            },
            {
                name: 'Vikas Bansal',
                role: 'Senior Applied Scientist @ Amazon',
                exp: '7+ yrs experience',
                focus: 'Explains real-world machine learning pipelines, Python projects, and data science interview questions.',
                rating: '5.0',
                reviews: 215,
                tags: ['Python', 'Machine Learning', 'Data Science'],
                slots: ['Tomorrow 5:00 PM', 'Sat 2:00 PM', 'Sun 4:00 PM']
            }
        ],
        primaryBtn: { label: 'Book a Mentorship Session', link: '/register' },
        secondaryBtn: { label: 'Browse Open Jobs', link: '/jobs' }
    },

    // -------------------------------------------------------------------------
    // 13. MENTORSHIP: BECOME A MENTOR
    // -------------------------------------------------------------------------
    'mentorship-become': {
        id: 'mentorship-become',
        cardType: 'feature',
        category: 'Give Back',
        badge: 'Mentor Community',
        title: 'Become a Mentor for Engineering Students',
        tagline: 'Help hardworking students from colleges across India prepare for their first tech jobs.',
        description: 'If you have a couple of years of industry experience, you can help students who have the dedication to learn but lack exposure to real-world software practices.',
        accentColor: 'orange',
        keyStats: [
            { label: 'Time Needed', value: '1-2 hrs / week', sub: 'Flexible schedule' },
            { label: 'Schedule Control', value: '100% Yours', sub: 'Choose your own slots' },
            { label: 'Honorarium', value: 'Available', sub: 'Or donate to student funds' },
            { label: 'Community', value: '600+ Mentors', sub: 'Working tech leads' }
        ],
        featurePillars: [
            {
                tag: 'Flexible Timings',
                title: 'You Pick Your Availability',
                desc: 'Open slots only when you are free on evenings or weekends. Reschedule easily if your work schedule changes.',
                metric: 'Zero Hassle'
            },
            {
                tag: 'Student Referrals',
                title: 'Spot Good Coders Early',
                desc: 'When you meet bright, hardworking students, you can refer them directly for open fresher openings at your company.',
                metric: 'Direct Referrals'
            },
            {
                tag: 'Real Impact',
                title: 'Help Tier-2/3 Students Succeed',
                desc: 'A 45-minute resume review or code explanation can make a life-changing difference for a student preparing for campus drives.',
                metric: 'Genuine Help'
            },
            {
                tag: 'Fair Compensation',
                title: 'Optional Honorarium',
                desc: 'Receive standard compensation for your time or choose to donate session fees to student learning scholarships.',
                metric: 'Transparent Process'
            }
        ],
        primaryBtn: { label: 'Apply to Become a Mentor', link: '/support?type=partnerships' },
        secondaryBtn: { label: 'Mentor Guidelines & FAQs', link: '/support?type=faq' }
    },

    // -------------------------------------------------------------------------
    // 14. MENTORSHIP: PROGRAMS
    // -------------------------------------------------------------------------
    'mentorship-programs': {
        id: 'mentorship-programs',
        cardType: 'event',
        category: 'Guided Cohorts',
        badge: '6-Week Weekend Sprints',
        title: '6-Week Weekend Learning Cohorts with Working Developers',
        tagline: 'Small groups of 10 students guided step-by-step from code fundamentals to working projects.',
        description: 'Studying alone can get confusing. Our 6-week weekend batches combine weekly coding tasks, live problem-solving, and personal code reviews from senior developers.',
        accentColor: 'rose',
        keyStats: [
            { label: 'Group Size', value: '10 Students Max', sub: 'Personal attention' },
            { label: 'Duration', value: '6 Weeks', sub: 'Weekend sessions' },
            { label: 'Projects Built', value: '2 Working Apps', sub: 'Added to portfolio' },
            { label: 'Drive Readiness', value: 'High', sub: 'Interview-focused' }
        ],
        eventMeta: {
            date: 'Next Cohort Starts: Nov 15, 2026',
            mode: 'Live Weekend Sessions on Google Meet',
            time: 'Sat & Sun (10:00 AM - 12:30 PM IST)',
            status: 'Admissions Open (12 Seats Remaining)'
        },
        tracks: [
            { title: 'Track 1: Full-Stack Web Development', tech: 'React, Node.js, Express, PostgreSQL, REST APIs' },
            { title: 'Track 2: Data Structures & Problem Solving', tech: 'Arrays, Two Pointers, Trees, Graphs, DP' },
            { title: 'Track 3: Cloud & Backend Basics', tech: 'Docker basics, Linux commands, Redis, AWS deployment' }
        ],
        primaryBtn: { label: 'Apply for Next Cohort', link: '/register' },
        secondaryBtn: { label: 'Check Your Skill Match First', link: '/skill-gap' }
    },

    // -------------------------------------------------------------------------
    // 15. MENTORSHIP: SUCCESS
    // -------------------------------------------------------------------------
    'mentorship-success': {
        id: 'mentorship-success',
        cardType: 'success',
        category: 'Student Stories',
        badge: 'Placement Journeys',
        title: 'How Targeted Guidance Helped Students Crack Campus Drives',
        tagline: 'Read how students fixed their resumes, improved their code, and secured multiple placement offers.',
        description: 'Simple adjustments to resume projects, learning how to write clean code, and practicing mock interviews helped these students turn campus rejections into multiple offers.',
        accentColor: 'pink',
        keyStats: [
            { label: 'Students Guided', value: '3,200+', sub: 'Placed in good firms' },
            { label: 'Multiple Offers', value: '42%', sub: 'More than one offer' },
            { label: 'Average Package Lift', value: '+35%', sub: 'Vs earlier attempts' },
            { label: 'Student Rating', value: '4.9 / 5', sub: 'Verified reviews' }
        ],
        alumniProfiles: [
            {
                name: 'Vikram Joshi',
                initials: 'VJ',
                role: 'Backend SDE',
                company: 'Razorpay',
                package: '₹22.0 LPA',
                college: 'Jadavpur University (EE 2025)',
                quote: 'My mentor helped me add connection pooling and Redis caching to my college project. During my Razorpay technical round, the interviewer spent 20 minutes discussing that exact design.',
                skills: ['Node.js', 'PostgreSQL', 'Redis'],
                badgeColor: 'bg-blue-50 text-blue-700 border-blue-200'
            },
            {
                name: 'Shreya Mukherjee',
                initials: 'SM',
                role: 'Software Engineer',
                company: 'Atlassian',
                package: '₹26.5 LPA',
                college: 'KIIT Bhubaneswar (CSE 2025)',
                quote: 'I used to get nervous during live coding rounds and freeze up. Doing two mock interviews with a working engineer taught me to think out loud and stay calm.',
                skills: ['React', 'TypeScript', 'Data Structures'],
                badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200'
            }
        ],
        primaryBtn: { label: 'Explore Active Mentors', link: '/register' },
        secondaryBtn: { label: 'Check Your Skill Match', link: '/skill-gap' }
    },

    // -------------------------------------------------------------------------
    // 16. EVENTS: CAREER FAIRS
    // -------------------------------------------------------------------------
    'events-fairs': {
        id: 'events-fairs',
        cardType: 'event',
        category: 'Campus Mega Drives',
        badge: 'Annual Hiring Fair',
        title: 'Virtual & Campus Mega Placement Drives 2026',
        tagline: 'Connect directly with 100+ participating tech companies hiring fresh engineering graduates.',
        description: 'Apply with your verified college profile in one click, participate in online screening tests, and attend scheduled technical interviews from home or college labs.',
        accentColor: 'blue',
        keyStats: [
            { label: 'Visiting Companies', value: '100+ Brands', sub: 'Product firms & MNCs' },
            { label: 'Fresher Openings', value: '5,000+ Jobs', sub: 'Full-time & Internships' },
            { label: 'Student Cost', value: '100% Free', sub: 'No hidden fees' },
            { label: 'Expected Offers', value: '1,200+', sub: 'Across tech branches' }
        ],
        eventMeta: {
            date: 'November 20 – 22, 2026',
            mode: 'Virtual Online Drives & College Centers',
            time: '9:30 AM – 6:00 PM IST Daily',
            status: 'Student Registrations Open • Free Access'
        },
        tracks: [
            { title: 'Track 1: Software Engineering & Development', tech: 'Adobe, Salesforce, Razorpay, Swiggy, Atlassian' },
            { title: 'Track 2: Summer 2027 Internships (Pre-Final Year)', tech: 'Amazon, Microsoft, Zomato, Uber' },
            { title: 'Track 3: Core Engineering & Embedded Systems', tech: 'Qualcomm, Texas Instruments, Bosch' }
        ],
        agenda: [
            { time: '09:30 AM', title: 'Drive Introduction & Eligibility Check', speaker: 'College Placement Officers & HR Leads', room: 'Main Virtual Hall' },
            { time: '11:00 AM', title: 'Round 1: Online Coding & Aptitude Test', speaker: 'Automated 60-Minute Assessment', room: 'Online Test Portal' },
            { time: '02:00 PM', title: 'Round 2: Technical Interview Slots', speaker: 'One-on-One Technical Panels', room: 'Interview Rooms 1-10' },
            { time: '05:30 PM', title: 'Result Announcements & Next Steps', speaker: 'Campus Placement Office', room: 'Main Virtual Hall' }
        ],
        primaryBtn: { label: 'Register for Campus Drive', link: '/jobs' },
        secondaryBtn: { label: 'College Partnerships (TPO)', link: '/support?type=partnerships' }
    },

    // -------------------------------------------------------------------------
    // 17. EVENTS: WORKSHOPS
    // -------------------------------------------------------------------------
    'events-workshops': {
        id: 'events-workshops',
        cardType: 'event',
        category: 'Weekend Workshops',
        badge: 'Hands-on Coding',
        title: 'Weekend Technical Coding Workshops & Masterclasses',
        tagline: 'Practical weekend sessions on building APIs, containerizing apps, and cracking interview patterns.',
        description: 'Taught by working software engineers. Skip boring slides and write actual code, build working endpoints, and deploy apps during the session.',
        accentColor: 'teal',
        keyStats: [
            { label: 'Workshops Done', value: '180+ Sessions', sub: 'Practical focus' },
            { label: 'Students Attended', value: '45,000+', sub: 'Hands-on coders' },
            { label: 'Live Coding Time', value: '80% of Time', sub: 'Interactive practice' },
            { label: 'Workshop Notes', value: 'Free Access', sub: 'Code repos provided' }
        ],
        eventMeta: {
            date: 'Every Saturday & Sunday',
            mode: 'Live Coding on Zoom with Q&A',
            time: '2:30 PM – 5:30 PM IST',
            status: 'Upcoming: Building REST APIs with Node & SQL'
        },
        tracks: [
            { title: 'Workshop 1: REST APIs & SQL Database Design', tech: 'Node.js, Express, PostgreSQL, migrations, indexing' },
            { title: 'Workshop 2: Docker Basics for Beginners', tech: 'Containers, Dockerfiles, compose files, local setups' },
            { title: 'Workshop 3: Top 25 Campus Coding Patterns', tech: 'Two pointers, sliding window, binary search, trees' }
        ],
        primaryBtn: { label: 'Join Next Free Workshop', link: '/jobs' },
        secondaryBtn: { label: 'Check Your Skill Match', link: '/skill-gap' }
    },

    // -------------------------------------------------------------------------
    // 18. EVENTS: WEBINARS
    // -------------------------------------------------------------------------
    'events-webinars': {
        id: 'events-webinars',
        cardType: 'event',
        category: 'Live Q&A Talks',
        badge: 'Career Conversations',
        title: 'Weekly Tech Talks: Salaries, Interviews & Fresher Tips',
        tagline: 'Honest conversations with engineering leads and hiring managers about what to expect on campus drive days.',
        description: 'Ask questions live without hesitation. Learn what hiring teams look for in freshers, how compensation structures work, and what mistakes to avoid during interviews.',
        accentColor: 'purple',
        keyStats: [
            { label: 'Frequency', value: 'Every Weekend', sub: 'Saturday evening' },
            { label: 'Live Attendees', value: '2,000+ Students', sub: 'Interactive audience' },
            { label: 'Open Q&A', value: '30 Minutes', sub: 'Direct student questions' },
            { label: 'Recordings', value: 'Free on Portal', sub: 'Review anytime' }
        ],
        eventMeta: {
            date: 'Every Saturday, 7:00 PM – 8:30 PM IST',
            mode: 'YouTube Live & CareerSync Portal',
            time: '90 Minutes Interactive Session',
            status: 'Upcoming: What Interviewers Expect from Freshers'
        },
        tracks: [
            { title: 'Session A: Understanding Fresher Salary Packages', tech: 'Base salary, bonuses, PF, and how appraisals work' },
            { title: 'Session B: How to Answer "Tell Me About Yourself" Confidently', tech: 'Simple frameworks for HR and technical introductions' },
            { title: 'Session C: Surviving Your First 90 Days at a Tech Company', tech: 'Understanding codebases, pull requests, and asking questions' }
        ],
        primaryBtn: { label: 'Register for Next Talk', link: '/register' },
        secondaryBtn: { label: 'Submit a Question Early', link: '/support?type=helpdesk' }
    },

    // -------------------------------------------------------------------------
    // 19. EVENTS: HACKATHONS
    // -------------------------------------------------------------------------
    'events-hackathons': {
        id: 'events-hackathons',
        cardType: 'event',
        category: 'Project Challenge',
        badge: 'Campus Hackathon 2026',
        title: 'CareerSync National Campus Project Hackathon',
        tagline: 'Team up with your college friends, build a working web app in 36 hours, and win interview shortlists.',
        description: 'Build practical software that solves real college or community problems. Winning teams get cash prizes, cloud credits, and direct interview calls from sponsor companies.',
        accentColor: 'rose',
        keyStats: [
            { label: 'Prize Pool', value: '₹3,00,000', sub: 'Plus cloud credits' },
            { label: 'College Teams', value: '2,500+ Teams', sub: 'Across 250+ campuses' },
            { label: 'Direct Shortlists', value: '120+ Students', sub: 'Interview passes' },
            { label: 'Sponsor Firms', value: '15 Tech Startups', sub: 'Looking for builders' }
        ],
        eventMeta: {
            date: 'December 12 – 14, 2026',
            mode: '36-Hour Online Weekend Hackathon',
            time: 'Starts Friday 6:00 PM IST',
            status: 'Team Registrations Open (1 to 4 Members)'
        },
        tracks: [
            { title: 'Track 1: College & Campus Productivity Tools', tech: 'Attendance, notes sharing, placement coordination' },
            { title: 'Track 2: Useful Web & Mobile Applications', tech: 'Clean UI, responsive design, practical daily use' },
            { title: 'Track 3: Open Innovation & Helpful Developer Tools', tech: 'Open-source utilities, developer CLI tools, APIs' }
        ],
        primaryBtn: { label: 'Register Your Team (Free)', link: '/jobs' },
        secondaryBtn: { label: 'Read Hackathon Rules', link: '/support?type=faq' }
    },

    // -------------------------------------------------------------------------
    // 20. CAREERS: CAMPUS DRIVES
    // -------------------------------------------------------------------------
    'careers-drives': {
        id: 'careers-drives',
        cardType: 'roster',
        category: 'Upcoming Drives',
        badge: 'Active Placement Season',
        title: 'Upcoming Campus Recruitment Drives & Eligibility',
        tagline: 'Check company visiting dates, minimum CGPA requirements, and application deadlines.',
        description: 'Keep track of all upcoming campus placement drives in one place. Review the job profile, eligibility rules, online test syllabus, and expected interview dates in advance.',
        accentColor: 'blue',
        keyStats: [
            { label: 'Upcoming Drives', value: '45+ Companies', sub: 'Scheduled this month' },
            { label: 'Average Package', value: '₹8.2 LPA', sub: 'Across scheduled firms' },
            { label: 'Core Software Roles', value: '80%', sub: 'SDE, QA, Analyst' },
            { label: 'Drive Alerts', value: 'SMS & Email', sub: 'Never miss a test' }
        ],
        rosterSample: [
            { name: 'Adobe Systems', roll: 'SDE-1 (Full-Time)', branch: 'Min CGPA: 8.0 • CSE / IT', cgpa: '₹22.5 LPA', status: 'Online Test: Oct 28', statusColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' },
            { name: 'Salesforce', roll: 'Associate Engineer', branch: 'Min CGPA: 7.5 • All Tech', cgpa: '₹18.0 LPA', status: 'Online Test: Nov 02', statusColor: 'bg-blue-500/20 text-blue-300 border-blue-500/30' },
            { name: 'JPMorgan Chase', roll: 'Software Engineer', branch: 'Min CGPA: 8.0 • CSE / ECE', cgpa: '₹16.0 LPA', status: 'Applications Open', statusColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30' },
            { name: 'Zomato Engineering', roll: 'Backend Developer', branch: 'Min CGPA: 7.0 • Any Branch', cgpa: '₹14.5 LPA', status: 'Drive Date: Nov 10', statusColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30' }
        ],
        primaryBtn: { label: 'View All Live Campus Drives', link: '/jobs' },
        secondaryBtn: { label: 'Update Your Resume', link: '/profile' }
    }
};
