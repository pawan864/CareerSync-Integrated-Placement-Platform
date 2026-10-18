import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Briefcase, GraduationCap, FolderGit2, BookOpen, Search, 
    Filter, MapPin, DollarSign, Clock, Zap, Building2, 
    CheckCircle, AlertCircle, Sparkles, Send, Check
} from 'lucide-react';
import api from '../../services/api';

const MatchScoreBadge = ({ score }) => {
    let color = 'text-emerald-700 bg-emerald-50 border-emerald-300';
    if (score < 70) color = 'text-amber-700 bg-amber-50 border-amber-300';
    if (score < 40) color = 'text-rose-700 bg-rose-50 border-rose-300';

    return (
        <div className={`flex items-center px-2.5 py-1 rounded-full border text-xs font-bold shadow-xs ${color}`}>
            <Zap className="w-3 h-3 mr-1" />
            {score}% Match
        </div>
    );
};

export default function OpportunityHub() {
    const [activeTab, setActiveTab] = useState('Placement');
    const [searchQuery, setSearchQuery] = useState('');
    const [realOpps, setRealOpps] = useState([]);
    const [appliedIds, setAppliedIds] = useState(new Set());
    const [loading, setLoading] = useState(true);
    const [applyingId, setApplyingId] = useState(null);
    const [message, setMessage] = useState(null);

    // Initial curated mock fallback if no database opportunities yet
    const fallbackOpps = [
        {
            _id: 'mock-1',
            type: 'Placement',
            title: 'Associate Cloud Software Engineer',
            companyName: 'Microsoft Corporation',
            location: 'Bengaluru / Hyderabad',
            workMode: 'Hybrid',
            stipendOrSalary: '₹14 - 18 LPA',
            duration: 'Full-time',
            department: 'Cloud & Enterprise',
            matchScore: 92,
            requiredSkills: [
                { name: 'C#', level: 'Intermediate' },
                { name: '.NET', level: 'Intermediate' },
                { name: 'Azure', level: 'Beginner' },
                { name: 'SQL', level: 'Intermediate' }
            ],
            eligibilityCriteria: { minCgpa: 7.0, gradYear: [2025, 2026] }
        },
        {
            _id: 'mock-2',
            type: 'Internship',
            title: 'Frontend Engineering Intern',
            companyName: 'Google India',
            location: 'Bengaluru',
            workMode: 'On-site',
            stipendOrSalary: '₹85,000 / month',
            duration: '6 Months',
            department: 'Chrome Platforms',
            matchScore: 88,
            requiredSkills: [
                { name: 'React', level: 'Advanced' },
                { name: 'TypeScript', level: 'Intermediate' },
                { name: 'Tailwind CSS', level: 'Intermediate' }
            ],
            eligibilityCriteria: { minCgpa: 7.5, gradYear: [2026, 2027] }
        },
        {
            _id: 'mock-3',
            type: 'Project',
            title: 'Generative AI Document Summarizer Capstone',
            companyName: 'Amazon Web Services (AWS)',
            location: 'Remote',
            workMode: 'Remote',
            stipendOrSalary: 'Sponsored Research & Cloud Credits',
            duration: '3 Months',
            department: 'Applied AI Labs',
            matchScore: 78,
            requiredSkills: [
                { name: 'Python', level: 'Intermediate' },
                { name: 'PyTorch', level: 'Intermediate' },
                { name: 'NLP', level: 'Intermediate' }
            ],
            eligibilityCriteria: { minCgpa: 6.5, gradYear: [2025, 2026] }
        },
        {
            _id: 'mock-4',
            type: 'Training',
            title: 'Enterprise Full-Stack & DevOps Upskilling Cohort',
            companyName: 'Tata Consultancy Services (TCS)',
            location: 'Online',
            workMode: 'Remote',
            stipendOrSalary: 'Free with Guaranteed Placement Interview',
            duration: '8 Weeks',
            department: 'Digital Academy',
            matchScore: 95,
            requiredSkills: [
                { name: 'Java', level: 'Beginner' },
                { name: 'Spring Boot', level: 'Beginner' },
                { name: 'Docker', level: 'Beginner' }
            ],
            eligibilityCriteria: { minCgpa: 6.0, gradYear: [2025, 2026, 2027] }
        }
    ];

    const showNotification = (text, type = 'success') => {
        setMessage({ text, type });
        setTimeout(() => setMessage(null), 4000);
    };

    const fetchOpportunities = async () => {
        try {
            const res = await api.get('/opportunities');
            if (res.data?.success) {
                setRealOpps(res.data.data);
            }
        } catch (err) {
            console.error('Error fetching opportunities:', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchMyApplications = async () => {
        try {
            const res = await api.get('/opportunities/my-applications');
            if (res.data?.success) {
                const ids = new Set(res.data.data.map(app => app.opportunity?._id || app.opportunity));
                setAppliedIds(ids);
            }
        } catch (err) {
            // Student might not have applications yet
        }
    };

    useEffect(() => {
        fetchOpportunities();
        fetchMyApplications();
    }, []);

    // Handle student applying
    const handleApply = async (oppId) => {
        if (oppId.startsWith('mock-')) {
            setAppliedIds(prev => new Set([...prev, oppId]));
            showNotification('Application submitted successfully! (Demo mode)');
            return;
        }

        setApplyingId(oppId);
        try {
            const res = await api.post(`/opportunities/${oppId}/apply`);
            if (res.data?.success) {
                setAppliedIds(prev => new Set([...prev, oppId]));
                showNotification('Application submitted successfully! Check Application Tracker.');
            }
        } catch (err) {
            console.error('Apply error:', err);
            showNotification(err.response?.data?.error || 'Failed to submit application. Make sure your profile is completed.', 'error');
        } finally {
            setApplyingId(null);
        }
    };

    // Normalize records
    const normalizedData = (realOpps.length > 0 ? realOpps : fallbackOpps).map(o => ({
        id: o._id,
        type: o.type,
        title: o.title,
        company: typeof o.company === 'object' && o.company?.companyName ? o.company.companyName : (o.companyName || 'Corporate Partner'),
        location: o.location || 'Pan India',
        workMode: o.workMode || 'On-site',
        stipend: o.stipendOrSalary || 'Competitive',
        duration: o.duration || (o.type === 'Placement' ? 'Full-time' : '6 Months'),
        match: o.matchScore ?? 85,
        skills: o.requiredSkills?.map(s => (typeof s === 'string' ? s : s.name)) || [],
        description: o.description || '',
        minCgpa: o.eligibilityCriteria?.minCgpa || 0,
        deadline: o.deadline ? new Date(o.deadline).toLocaleDateString() : null
    }));

    const filteredOpps = normalizedData.filter(o => {
        const matchesTab = o.type === activeTab;
        const matchesQuery = 
            o.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
            o.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
            o.skills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
        return matchesTab && matchesQuery;
    });

    return (
        <div className="max-w-7xl mx-auto pb-12 font-sans">
            {/* Top Alert Toast */}
            {message && (
                <div className="fixed top-6 right-6 z-50 animate-in slide-in-from-top-4 duration-200">
                    <div className={`px-4 py-3 rounded-xl shadow-xl flex items-center space-x-2 text-xs font-bold border backdrop-blur-md ${
                        message.type === 'error'
                            ? 'bg-rose-900/90 text-rose-100 border-rose-700'
                            : 'bg-emerald-900/90 text-emerald-100 border-emerald-700'
                    }`}>
                        {message.type === 'error' ? <AlertCircle className="w-4 h-4 text-rose-400" /> : <CheckCircle className="w-4 h-4 text-emerald-400" />}
                        <span>{message.text}</span>
                    </div>
                </div>
            )}

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Main Content Area */}
                <div className="flex-1">
                    {/* Header */}
                    <div className="mb-6">
                        <div className="flex items-center space-x-2 mb-1">
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-100 text-blue-800 border border-blue-200">
                                Opportunity Gateway
                            </span>
                            <span className="text-xs text-gray-400">•</span>
                            <span className="text-xs text-emerald-600 font-semibold flex items-center">
                                <Sparkles className="w-3 h-3 mr-1" />
                                Real-Time Skill Matching
                            </span>
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                            Opportunity Hub
                        </h2>
                        <p className="text-xs sm:text-sm text-gray-500 mt-1">
                            Discover campus placements, internships, industry projects, and corporate training matched to your verified credentials.
                        </p>
                    </div>

                    {/* Navigation Tabs (All 4 types) */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-gray-100/80 p-1.5 rounded-2xl mb-6 border border-gray-200/70">
                        {[
                            { id: 'Placement', label: 'Full-Time Placements', icon: Briefcase },
                            { id: 'Internship', label: 'Internships', icon: GraduationCap },
                            { id: 'Project', label: 'Industry Projects', icon: FolderGit2 },
                            { id: 'Training', label: 'Corporate Training', icon: BookOpen },
                        ].map(tab => {
                            const active = activeTab === tab.id;
                            const Icon = tab.icon;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1.5 cursor-pointer ${
                                        active
                                            ? 'bg-white text-indigo-900 shadow-sm border border-gray-200/80'
                                            : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                                    }`}
                                >
                                    <Icon className={`w-3.5 h-3.5 ${active ? 'text-indigo-600' : 'text-gray-400'}`} />
                                    <span className="truncate">{tab.label}</span>
                                </button>
                            );
                        })}
                    </div>

                    {/* Search Bar */}
                    <div className="relative mb-6">
                        <Search className="w-4 h-4 text-gray-400 absolute left-4 top-3.5" />
                        <input
                            type="text"
                            placeholder={`Search ${activeTab.toLowerCase()}s by role, company name, or technology (e.g. React, Python)...`}
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            className="w-full bg-white border border-gray-200 rounded-xl pl-11 pr-4 py-3 text-xs sm:text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 shadow-xs transition-all"
                        />
                    </div>

                    {/* Opportunity Feed */}
                    <div className="space-y-4">
                        <AnimatePresence>
                            {filteredOpps.map(opp => {
                                const isApplied = appliedIds.has(opp.id);
                                const isSubmitting = applyingId === opp.id;

                                return (
                                    <motion.div
                                        key={opp.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.98 }}
                                        className="bg-white border border-gray-200/90 rounded-2xl p-5 sm:p-6 hover:border-indigo-300 hover:shadow-md transition-all group relative overflow-hidden"
                                    >
                                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
                                            <div className="flex items-start space-x-3.5">
                                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-100 flex items-center justify-center text-indigo-700 font-extrabold text-base shrink-0">
                                                    {opp.company?.charAt(0) || 'C'}
                                                </div>
                                                <div>
                                                    <h3 className="text-base sm:text-lg font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
                                                        {opp.title}
                                                    </h3>
                                                    <p className="text-xs font-semibold text-gray-600 flex items-center space-x-2 mt-0.5">
                                                        <Building2 className="w-3.5 h-3.5 text-gray-400" />
                                                        <span>{opp.company}</span>
                                                    </p>
                                                </div>
                                            </div>

                                            <MatchScoreBadge score={opp.match} />
                                        </div>

                                        {/* Key specifications row */}
                                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 bg-gray-50/70 p-3 rounded-xl border border-gray-100 mb-4 text-xs font-medium text-gray-600">
                                            <div className="flex items-center space-x-1.5">
                                                <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                                                <span className="truncate">{opp.location} ({opp.workMode})</span>
                                            </div>
                                            <div className="flex items-center space-x-1.5">
                                                <DollarSign className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                                                <span className="font-semibold text-gray-800 truncate">{opp.stipend}</span>
                                            </div>
                                            <div className="flex items-center space-x-1.5">
                                                <Clock className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                                                <span className="truncate">{opp.duration}</span>
                                            </div>
                                            {opp.minCgpa > 0 ? (
                                                <div className="flex items-center space-x-1.5">
                                                    <GraduationCap className="w-3.5 h-3.5 text-purple-500 shrink-0" />
                                                    <span>Min {opp.minCgpa} CGPA</span>
                                                </div>
                                            ) : (
                                                <div className="flex items-center space-x-1.5 text-gray-400">
                                                    <span>Open to all CGPAs</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Skills tags */}
                                        <div className="flex flex-wrap gap-1.5 mb-5">
                                            {opp.skills.map((skill, idx) => (
                                                <span
                                                    key={idx}
                                                    className="bg-slate-100 border border-slate-200 text-slate-700 px-2.5 py-0.5 rounded-lg text-xs font-medium"
                                                >
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>

                                        {/* Card Actions */}
                                        <div className="border-t border-gray-100 pt-3.5 flex items-center justify-between">
                                            <span className="text-[11px] text-gray-400">
                                                {opp.deadline ? `Deadline: ${opp.deadline}` : 'Actively Recruiting'}
                                            </span>

                                            <button
                                                onClick={() => handleApply(opp.id)}
                                                disabled={isApplied || isSubmitting}
                                                className={`px-5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer ${
                                                    isApplied
                                                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 cursor-default'
                                                        : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/20 active:scale-95'
                                                }`}
                                            >
                                                {isApplied ? (
                                                    <>
                                                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                                                        <span>Applied</span>
                                                    </>
                                                ) : isSubmitting ? (
                                                    <span>Submitting...</span>
                                                ) : (
                                                    <>
                                                        <Send className="w-3.5 h-3.5" />
                                                        <span>Apply Now</span>
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </motion.div>
                                );
                            })}

                            {filteredOpps.length === 0 && (
                                <div className="bg-white rounded-2xl border border-dashed border-gray-300 p-12 text-center text-gray-500">
                                    <Briefcase className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                                    <p className="font-bold text-sm text-gray-700">No {activeTab.toLowerCase()}s found matching your search</p>
                                    <p className="text-xs text-gray-400 mt-1">Try another search term or browse other opportunity categories.</p>
                                </div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Right Sidebar Widget */}
                <div className="w-full lg:w-80 space-y-5 shrink-0">
                    <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-xs">
                        <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-3 flex items-center space-x-1.5">
                            <Sparkles className="w-4 h-4 text-indigo-600" />
                            <span>AI Match Engine</span>
                        </h3>
                        <p className="text-xs text-gray-600 leading-relaxed">
                            Match scores are calculated dynamically by comparing your profile skills, proficiency tiers, and coursework against corporate criteria.
                        </p>
                        <div className="mt-4 p-3 bg-indigo-50/70 border border-indigo-100 rounded-xl text-xs text-indigo-900 font-medium">
                            💡 Keep your <strong>Profile Builder</strong> and <strong>Certifications</strong> updated to unlock higher-tier shortlisting!
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-indigo-900 via-blue-900 to-slate-900 text-white rounded-2xl p-5 shadow-md">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-blue-300 bg-white/10 px-2 py-0.5 rounded-full inline-block mb-2">
                            Placement Insight
                        </span>
                        <h4 className="text-sm font-bold">Comprehensive Hiring Support</h4>
                        <p className="text-xs text-blue-200/80 mt-1 leading-relaxed">
                            Opportunities posted by verified recruiters are shared across department TPOs for institutional endorsement.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
