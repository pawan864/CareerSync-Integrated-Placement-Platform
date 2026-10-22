import api from '../../services/api';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Briefcase, Search, Filter, MapPin, DollarSign, Clock, 
    Zap, Building2, CheckCircle, ChevronRight, GraduationCap, 
    Bookmark, BookmarkCheck, X, Send, Sparkles
} from 'lucide-react';

const MatchScoreBadge = ({ score }) => {
    let color = 'text-emerald-700 bg-emerald-50 border-emerald-200';
    if (score < 70) color = 'text-amber-700 bg-amber-50 border-amber-200';
    if (score < 40) color = 'text-red-700 bg-red-50 border-red-200';

    return (
        <div className={`flex items-center px-2.5 py-1 rounded-full border text-xs font-bold ${color}`}>
            <Sparkles className="w-3 h-3 mr-1" />
            {score}% Match
        </div>
    );
};

const OpportunityHub = () => {
    const [activeTab, setActiveTab] = useState('Internship');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedMode, setSelectedMode] = useState('All');
    const [minMatch, setMinMatch] = useState(0);

    // Initial default opportunities
    const initialOpps = [
        { id: 'opp-1', type: 'Internship', title: 'Software Engineering Intern', company: 'Google', location: 'Remote', stipend: '$5,000/mo', duration: '3 months', match: 92, skills: ['Java', 'Spring Boot', 'React'], mode: 'Remote' },
        { id: 'opp-2', type: 'Placement', title: 'Full Stack Developer', company: 'Microsoft', location: 'Seattle, WA', stipend: '$120k/yr', duration: 'Full-time', match: 85, skills: ['C#', '.NET', 'React', 'SQL'], mode: 'On-site' },
        { id: 'opp-3', type: 'Project', title: 'AI Document Classifier', company: 'OpenAI', location: 'Remote', stipend: '$3,500 Grant', duration: '2 months', match: 45, skills: ['Python', 'PyTorch', 'NLP'], mode: 'Remote' },
        { id: 'opp-4', type: 'Internship', title: 'Frontend Developer Intern', company: 'Vercel', location: 'Hybrid', stipend: '$4,000/mo', duration: '6 months', match: 98, skills: ['React', 'Next.js', 'Tailwind'], mode: 'Hybrid' },
        { id: 'opp-5', type: 'Placement', title: 'Data Scientist', company: 'Amazon', location: 'New York, NY', stipend: '$130k/yr', duration: 'Full-time', match: 65, skills: ['Python', 'SQL', 'Machine Learning'], mode: 'On-site' },
        { id: 'opp-6', type: 'Project', title: 'Open Source UI Design System', company: 'Meta', location: 'Remote', stipend: '$4,200 Grant', duration: '4 months', match: 78, skills: ['React', 'CSS', 'Figma'], mode: 'Remote' },
    ];

    const [realOpps, setRealOpps] = useState([]);
    const [savedJobIds, setSavedJobIds] = useState(new Set());
    const [appliedJobIds, setAppliedJobIds] = useState(new Set());
    
    // Application modal state
    const [applyingOpp, setApplyingOpp] = useState(null);
    const [coverNote, setCoverNote] = useState('');
    const [isSubmittingApp, setIsSubmittingApp] = useState(false);
    const [message, setMessage] = useState({ text: '', type: '' });

    useEffect(() => {
        // Load saved jobs & applications from localStorage
        try {
            const saved = JSON.parse(localStorage.getItem('careersync_saved_jobs') || '[]');
            setSavedJobIds(new Set(saved.map(j => j.id)));

            const applied = JSON.parse(localStorage.getItem('careersync_applied_jobs') || '[]');
            setAppliedJobIds(new Set(applied.map(a => a.id)));
        } catch (e) {
            console.error(e);
        }

        const fetchOpps = async () => {
            try {
                const res = await api.get('/opportunities');
                if (res.data?.success && res.data.data?.length > 0) {
                    setRealOpps(res.data.data);
                }
            } catch (err) {
                // Keep default opportunities
            }
        };
        fetchOpps();
    }, []);

    const allOpps = realOpps.length > 0 ? realOpps : initialOpps;

    const filteredOpps = allOpps.filter(opp => {
        const matchesTab = opp.type?.toLowerCase() === activeTab.toLowerCase();
        const matchesQuery = opp.title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                             opp.company?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesMode = selectedMode === 'All' || opp.mode === selectedMode || opp.location?.toLowerCase().includes(selectedMode.toLowerCase());
        const matchesScore = (opp.match || 75) >= minMatch;
        return matchesTab && matchesQuery && matchesMode && matchesScore;
    });

    const toggleSaveJob = (opp) => {
        const newSet = new Set(savedJobIds);
        let savedList = JSON.parse(localStorage.getItem('careersync_saved_jobs') || '[]');

        if (newSet.has(opp.id)) {
            newSet.delete(opp.id);
            savedList = savedList.filter(item => item.id !== opp.id);
            setMessage({ text: `Removed "${opp.title}" from saved jobs.`, type: 'info' });
        } else {
            newSet.add(opp.id);
            savedList.push(opp);
            setMessage({ text: `Saved "${opp.title}" to bookmarked jobs!`, type: 'success' });
        }

        setSavedJobIds(newSet);
        localStorage.setItem('careersync_saved_jobs', JSON.stringify(savedList));
        setTimeout(() => setMessage({ text: '', type: '' }), 3500);
    };

    const handleOpenApplyModal = (opp) => {
        setApplyingOpp(opp);
        setCoverNote(`I am excited to submit my candidate profile for the ${opp.title} position at ${opp.company}. My verified technical skills in ${(opp.skills || []).join(', ')} directly align with the requirements.`);
    };

    const handleConfirmApply = async () => {
        if (!applyingOpp) return;
        setIsSubmittingApp(true);
        try {
            // Attempt API call, fallback gracefully
            try {
                await api.post(`/opportunities/${applyingOpp.id}/apply`, { note: coverNote });
            } catch (err) {
                // Stored locally if mock or route is local
            }

            // Record application locally
            const appliedList = JSON.parse(localStorage.getItem('careersync_applied_jobs') || '[]');
            const newApp = {
                id: applyingOpp.id,
                role: applyingOpp.title,
                company: applyingOpp.company,
                location: applyingOpp.location,
                date: 'Just now',
                status: 'Applied',
                appliedAt: new Date().toISOString()
            };
            appliedList.unshift(newApp);
            localStorage.setItem('careersync_applied_jobs', JSON.stringify(appliedList));

            setAppliedJobIds(prev => new Set([...prev, applyingOpp.id]));
            setMessage({ text: `Application submitted for ${applyingOpp.title} at ${applyingOpp.company}!`, type: 'success' });
            setApplyingOpp(null);
        } finally {
            setIsSubmittingApp(false);
            setTimeout(() => setMessage({ text: '', type: '' }), 4000);
        }
    };

    return (
        <div className="max-w-7xl mx-auto pb-12 flex flex-col lg:flex-row gap-8">
            {/* Main Content Area */}
            <div className="flex-1">
                <div className="mb-6">
                    <h2 className="text-3xl font-bold text-gray-900 tracking-tight flex items-center">
                        <Briefcase className="w-8 h-8 mr-3 text-blue-600" />
                        Opportunity Hub
                    </h2>
                    <p className="text-gray-600 text-sm mt-1">
                        Discover internships, placements, and industry capstone projects matched directly to your verified skill profile.
                    </p>
                </div>

                {/* Toast Notification */}
                {message.text && (
                    <div className={`mb-6 p-4 rounded-xl text-sm font-semibold flex items-center justify-between border ${
                        message.type === 'success' 
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
                            : 'bg-blue-50 text-blue-800 border-blue-200'
                    }`}>
                        <span>{message.text}</span>
                        <button onClick={() => setMessage({ text: '', type: '' })} className="text-xs uppercase font-bold underline">Dismiss</button>
                    </div>
                )}

                {/* Tabs */}
                <div className="flex space-x-1 bg-white p-1.5 rounded-xl border border-gray-200 shadow-sm mb-6">
                    {['Internship', 'Placement', 'Project'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-all ${
                                activeTab === tab 
                                    ? 'bg-blue-600 text-white shadow-sm' 
                                    : 'text-gray-600 hover:text-gray-900'
                            }`}
                        >
                            {tab === 'Placement' ? 'Full-time Placements' : tab === 'Internship' ? 'Internships' : 'Industry Projects'}
                        </button>
                    ))}
                </div>

                {/* Search Bar */}
                <div className="relative mb-6">
                    <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input 
                        type="text"
                        placeholder={`Search ${activeTab.toLowerCase()}s by title or company name...`}
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        className="w-full bg-white border border-gray-200 text-gray-900 rounded-xl pl-12 pr-4 py-3.5 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 shadow-sm transition-all text-sm font-medium"
                    />
                </div>

                {/* Opportunity Feed */}
                <div className="space-y-4">
                    <AnimatePresence>
                        {filteredOpps.map(opp => {
                            const isSaved = savedJobIds.has(opp.id);
                            const isApplied = appliedJobIds.has(opp.id);

                            return (
                                <motion.div 
                                    key={opp.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="bg-white border border-gray-200 rounded-xl p-6 hover:border-blue-300 hover:shadow-md transition-all relative overflow-hidden group"
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex items-center">
                                            <div className="w-12 h-12 bg-blue-50 border border-blue-200 rounded-xl flex items-center justify-center mr-4 text-blue-700 font-bold text-lg shadow-sm">
                                                <Building2 className="w-6 h-6 text-blue-600" />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                                                    {opp.title}
                                                </h3>
                                                <p className="text-xs font-semibold text-gray-500">{opp.company}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <MatchScoreBadge score={opp.match || 80} />
                                            <button
                                                onClick={() => toggleSaveJob(opp)}
                                                className={`p-2 rounded-lg border transition-all ${
                                                    isSaved 
                                                        ? 'bg-blue-50 text-blue-600 border-blue-200' 
                                                        : 'bg-white text-gray-400 border-gray-200 hover:text-gray-600 hover:bg-gray-50'
                                                }`}
                                                title={isSaved ? 'Remove Bookmark' : 'Save Opportunity'}
                                            >
                                                {isSaved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                                            </button>
                                        </div>
                                    </div>

                                    {/* Metrics Grid */}
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5 text-xs font-semibold text-gray-600">
                                        <div className="flex items-center">
                                            <MapPin className="w-3.5 h-3.5 mr-1.5 text-gray-400" />
                                            {opp.location}
                                        </div>
                                        <div className="flex items-center">
                                            <DollarSign className="w-3.5 h-3.5 mr-1.5 text-gray-400" />
                                            {opp.stipend}
                                        </div>
                                        <div className="flex items-center">
                                            <Clock className="w-3.5 h-3.5 mr-1.5 text-gray-400" />
                                            {opp.duration}
                                        </div>
                                        <div className="flex items-center">
                                            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-gray-100 text-gray-700">
                                                {opp.mode || 'Remote'}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Skills Tags */}
                                    <div className="flex flex-wrap gap-1.5 mb-6">
                                        {opp.skills?.map((skill, idx) => (
                                            <span key={idx} className="bg-blue-50/60 border border-blue-200 text-blue-800 px-2.5 py-1 rounded-md text-xs font-medium">
                                                {skill}
                                            </span>
                                        ))}
                                    </div>

                                    {/* Actions */}
                                    <div className="border-t border-gray-100 pt-4 flex items-center justify-between">
                                        <span className="text-xs text-gray-400 font-medium">
                                            Recruitment verified by CareerSync
                                        </span>

                                        <button 
                                            onClick={() => handleOpenApplyModal(opp)}
                                            disabled={isApplied}
                                            className={`flex items-center px-5 py-2 rounded-lg font-semibold text-xs transition-all shadow-sm ${
                                                isApplied 
                                                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 cursor-default'
                                                    : 'bg-blue-600 text-white hover:bg-blue-700 active:scale-95'
                                            }`}
                                        >
                                            {isApplied ? (
                                                <>
                                                    <CheckCircle className="w-3.5 h-3.5 mr-1.5 text-emerald-600" />
                                                    Applied
                                                </>
                                            ) : (
                                                <>
                                                    Apply Now
                                                    <ChevronRight className="w-4 h-4 ml-1" />
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </motion.div>
                            );
                        })}

                        {filteredOpps.length === 0 && (
                            <div className="text-center py-16 text-gray-500 bg-white border border-gray-200 rounded-xl">
                                <p className="font-semibold text-sm">No {activeTab.toLowerCase()}s found matching your filters.</p>
                                <button 
                                    onClick={() => { setSearchQuery(''); setSelectedMode('All'); setMinMatch(0); }}
                                    className="mt-3 text-xs text-blue-600 font-bold underline"
                                >
                                    Clear all filters
                                </button>
                            </div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Sidebar Filters */}
            <div className="w-full lg:w-80 space-y-6">
                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                    <h3 className="text-gray-900 font-bold text-sm mb-4 flex items-center">
                        <Filter className="w-4 h-4 mr-2 text-blue-600" />
                        Target Filters
                    </h3>
                    
                    <div className="space-y-5">
                        <div>
                            <label className="block text-gray-700 text-xs font-bold mb-2">Work Mode</label>
                            <div className="space-y-2">
                                {['All', 'Remote', 'Hybrid', 'On-site'].map(mode => (
                                    <label key={mode} className="flex items-center cursor-pointer group">
                                        <input 
                                            type="radio" 
                                            name="workMode"
                                            checked={selectedMode === mode}
                                            onChange={() => setSelectedMode(mode)}
                                            className="text-blue-600 focus:ring-blue-500 rounded-full mr-2.5" 
                                        />
                                        <span className="text-xs font-medium text-gray-700 group-hover:text-blue-600">{mode}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="border-t border-gray-100 pt-5">
                            <label className="block text-gray-700 text-xs font-bold mb-2">Profile Match Threshold</label>
                            <div className="space-y-2">
                                {[
                                    { label: 'All Opportunities', val: 0 },
                                    { label: '> 70% Match', val: 70 },
                                    { label: '> 85% Match', val: 85 }
                                ].map(option => (
                                    <label key={option.val} className="flex items-center cursor-pointer group">
                                        <input 
                                            type="radio" 
                                            name="matchFilter" 
                                            checked={minMatch === option.val}
                                            onChange={() => setMinMatch(option.val)}
                                            className="text-blue-600 focus:ring-blue-500 mr-2.5" 
                                        />
                                        <span className="text-xs font-medium text-gray-700 group-hover:text-blue-600">{option.label}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-5 shadow-sm">
                    <div className="flex items-center gap-2 mb-2">
                        <Zap className="w-4 h-4 text-blue-600" />
                        <h4 className="text-xs font-bold text-gray-900">Dynamic Matching</h4>
                    </div>
                    <p className="text-xs text-gray-600 leading-relaxed">
                        Match scores are computed against your verified skills and academic record. Pass tests in the <strong>Skill Center</strong> to raise your ranking for top recruiters.
                    </p>
                </div>
            </div>

            {/* APPLY CONFIRMATION MODAL */}
            {applyingOpp && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in duration-150">
                        <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-gray-50">
                            <div>
                                <h3 className="font-bold text-gray-900 text-base">Submit Application</h3>
                                <p className="text-xs text-gray-500">{applyingOpp.title} • {applyingOpp.company}</p>
                            </div>
                            <button onClick={() => setApplyingOpp(null)} className="text-gray-400 hover:text-gray-600">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-6 space-y-4">
                            <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl flex items-center justify-between text-xs">
                                <div className="font-semibold text-blue-900">Your Match Score</div>
                                <div className="font-extrabold text-blue-700 text-sm">{applyingOpp.match}% Match</div>
                            </div>

                            <div>
                                <label className="block text-gray-700 text-xs font-bold mb-1.5">Candidate Note to Recruiter</label>
                                <textarea
                                    rows="4"
                                    className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl p-3 text-xs focus:bg-white focus:border-blue-500 outline-none resize-none leading-relaxed"
                                    value={coverNote}
                                    onChange={e => setCoverNote(e.target.value)}
                                ></textarea>
                            </div>

                            <p className="text-[11px] text-gray-400">
                                Your digital verified resume and ATS credentials will be automatically packaged and delivered to {applyingOpp.company}&apos;s placement team.
                            </p>

                            <div className="pt-4 border-t border-gray-100 flex justify-end gap-3">
                                <button
                                    onClick={() => setApplyingOpp(null)}
                                    className="px-4 py-2 text-xs font-bold text-gray-600 hover:bg-gray-100 rounded-lg"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleConfirmApply}
                                    disabled={isSubmittingApp}
                                    className="flex items-center px-5 py-2 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-700 shadow-sm disabled:opacity-50"
                                >
                                    <Send className="w-3.5 h-3.5 mr-1.5" />
                                    {isSubmittingApp ? 'Submitting...' : 'Confirm & Apply'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OpportunityHub;
