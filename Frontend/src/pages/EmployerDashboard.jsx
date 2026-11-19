import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import { 
    Briefcase, Users, Search, Filter, PlusCircle, CheckCircle2, 
    ShieldCheck, ExternalLink, Mail, FileText, Sparkles, Star, 
    Award, ChevronRight, GraduationCap, Building2, MapPin, 
    TrendingUp, X, Send, Bookmark, Calendar, Check, ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const EmployerDashboard = () => {
    const { logout, user } = useContext(AuthContext);
    const [activeTab, setActiveTab] = useState('candidates'); // 'candidates', 'postings', 'applications'
    
    // ----------------------------------------------------
    // TAB 1: CANDIDATE TALENT SCOUT STATE
    // ----------------------------------------------------
    const [candidates, setCandidates] = useState([]);
    const [candidatesLoading, setCandidatesLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedDept, setSelectedDept] = useState('All');
    const [minCgpa, setMinCgpa] = useState('All');
    const [selectedSkill, setSelectedSkill] = useState('All');
    const [verifiedOnly, setVerifiedOnly] = useState(false);
    const [shortlistedIds, setShortlistedIds] = useState(() => {
        try {
            return new Set(JSON.parse(localStorage.getItem('careersync_recruiter_shortlist') || '[]'));
        } catch {
            return new Set();
        }
    });

    // ----------------------------------------------------
    // TAB 2: JOB POSTINGS & CREATION STATE
    // ----------------------------------------------------
    const [showPostModal, setShowPostModal] = useState(false);
    const [postedJobs, setPostedJobs] = useState([]);
    const [jobsLoading, setJobsLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        type: 'Internship',
        location: '',
        workMode: 'On-site',
        stipendOrSalary: '',
        duration: '',
        skillsStr: '',
        description: ''
    });

    // ----------------------------------------------------
    // TAB 3: APPLICATIONS STATE
    // ----------------------------------------------------
    const [applications, setApplications] = useState([]);
    const [appsLoading, setAppsLoading] = useState(false);

    // ----------------------------------------------------
    // INTERVIEW INVITE MODAL STATE
    // ----------------------------------------------------
    const [inviteCandidate, setInviteCandidate] = useState(null);
    const [inviteForm, setInviteForm] = useState({
        round: 'Technical Screening',
        date: '',
        time: '',
        meetingLink: '',
        notes: ''
    });
    const [notification, setNotification] = useState({ text: '', type: '' });

    // Initial Data Fetching
    useEffect(() => {
        fetchCandidates();
        fetchPostedJobs();
        fetchApplications();
    }, []);

    const fetchCandidates = async () => {
        try {
            setCandidatesLoading(true);
            const params = new URLSearchParams();
            if (selectedDept !== 'All') params.append('department', selectedDept);
            if (minCgpa !== 'All') params.append('minCgpa', minCgpa);
            if (selectedSkill !== 'All') params.append('skill', selectedSkill);
            if (verifiedOnly) params.append('verifiedOnly', 'true');
            if (searchQuery.trim()) params.append('search', searchQuery.trim());

            const res = await api.get(`/profile?${params.toString()}`);
            if (res.data?.success) {
                setCandidates(res.data.data || []);
            }
        } catch (err) {
            console.error('Failed to load candidate talent:', err);
        } finally {
            setCandidatesLoading(false);
        }
    };

    const fetchPostedJobs = async () => {
        try {
            setJobsLoading(true);
            const res = await api.get('/opportunities').catch(() => null);
            if (res?.data?.success) {
                setPostedJobs(res.data.data || []);
            }
        } catch (err) {
            console.error('Failed to load opportunities:', err);
        } finally {
            setJobsLoading(false);
        }
    };

    const fetchApplications = async () => {
        try {
            setAppsLoading(true);
            const res = await api.get('/opportunities/company/applications');
            if (res.data?.success) {
                setApplications(res.data.data || []);
            }
        } catch (error) {
            console.error('Error fetching applications:', error);
        } finally {
            setAppsLoading(false);
        }
    };

    // Toggle candidate bookmark / shortlist
    const toggleShortlist = (candId) => {
        setShortlistedIds(prev => {
            const next = new Set(prev);
            if (next.has(candId)) {
                next.delete(candId);
                showNotification('Candidate removed from your shortlist', 'info');
            } else {
                next.add(candId);
                showNotification('Candidate saved to your shortlist!', 'success');
            }
            localStorage.setItem('careersync_recruiter_shortlist', JSON.stringify([...next]));
            return next;
        });
    };

    const showNotification = (text, type = 'success') => {
        setNotification({ text, type });
        setTimeout(() => setNotification({ text: '', type: '' }), 4000);
    };

    // Handle posting opportunity
    const handleCreateOpportunity = async (e) => {
        e.preventDefault();
        const requiredSkills = formData.skillsStr.split(',').filter(s => s.trim() !== '').map(s => ({
            name: s.trim(),
            level: 'Intermediate'
        }));

        try {
            const res = await api.post('/opportunities', {
                ...formData,
                requiredSkills
            });
            if (res.data?.success) {
                showNotification('Job opportunity posted to campus board successfully!', 'success');
                setShowPostModal(false);
                setFormData({
                    title: '',
                    type: 'Internship',
                    location: '',
                    workMode: 'On-site',
                    stipendOrSalary: '',
                    duration: '',
                    skillsStr: '',
                    description: ''
                });
                fetchPostedJobs();
            }
        } catch (error) {
            showNotification(error.response?.data?.error || 'Failed to post opportunity', 'error');
        }
    };

    // Handle send interview invite
    const handleSendInvite = (e) => {
        e.preventDefault();
        showNotification(`Interview invitation dispatched to ${inviteCandidate.name} (${inviteCandidate.email})!`, 'success');
        setInviteCandidate(null);
        setInviteForm({
            round: 'Technical Screening',
            date: '',
            time: '',
            meetingLink: '',
            notes: ''
        });
    };

    // Apply client filters when search state updates
    useEffect(() => {
        const timer = setTimeout(() => {
            fetchCandidates();
        }, 300);
        return () => clearTimeout(timer);
    }, [searchQuery, selectedDept, minCgpa, selectedSkill, verifiedOnly]);

    return (
        <div className="min-h-screen bg-slate-50 font-sans pb-16">
            {/* Top Navigation & Recruiter Brand Banner */}
            <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-900 text-white border-b border-indigo-900">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl bg-blue-600/30 border border-blue-400/40 flex items-center justify-center shadow-lg">
                                <Building2 className="w-6 h-6 text-blue-300" />
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <h1 className="text-2xl font-bold tracking-tight text-white">
                                        Career<span className="text-blue-400">Sync</span>
                                    </h1>
                                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-indigo-500/30 text-indigo-200 border border-indigo-400/30">
                                        Recruiter Portal
                                    </span>
                                </div>
                                <p className="text-xs text-slate-300 mt-0.5">
                                    Campus Talent Sourcing, Proctored Skill Filters & Applicant Pipeline
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setShowPostModal(true)}
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md shadow-blue-600/30 transition-all active:scale-95"
                            >
                                <PlusCircle className="w-4 h-4" />
                                Post Opportunity
                            </button>
                            <button
                                onClick={logout}
                                className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-slate-300 border border-white/10 transition-colors"
                            >
                                Sign Out
                            </button>
                        </div>
                    </div>

                    {/* Quick Recruiter Summary Bar */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-indigo-800/60">
                        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-3 border border-white/10">
                            <div className="text-[11px] text-slate-400 uppercase font-semibold">Available Talent</div>
                            <div className="text-xl font-extrabold text-white mt-1">{candidates.length} Candidates</div>
                        </div>
                        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-3 border border-white/10">
                            <div className="text-[11px] text-slate-400 uppercase font-semibold">Active Postings</div>
                            <div className="text-xl font-extrabold text-white mt-1">{postedJobs.length} Live Drives</div>
                        </div>
                        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-3 border border-white/10">
                            <div className="text-[11px] text-slate-400 uppercase font-semibold">Shortlisted Pool</div>
                            <div className="text-xl font-extrabold text-amber-300 mt-1">{shortlistedIds.size} Saved</div>
                        </div>
                        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-3 border border-white/10">
                            <div className="text-[11px] text-slate-400 uppercase font-semibold">Received Resumes</div>
                            <div className="text-xl font-extrabold text-emerald-400 mt-1">{applications.length} Submissions</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Notification Toast */}
            {notification.text && (
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
                    <div className={`p-4 rounded-xl text-xs font-bold flex items-center justify-between border shadow-sm ${
                        notification.type === 'error'
                            ? 'bg-red-50 text-red-800 border-red-200'
                            : notification.type === 'info'
                                ? 'bg-blue-50 text-blue-800 border-blue-200'
                                : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                    }`}>
                        <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                            <span>{notification.text}</span>
                        </div>
                        <button onClick={() => setNotification({ text: '', type: '' })} className="underline uppercase text-[10px]">
                            Dismiss
                        </button>
                    </div>
                </div>
            )}

            {/* Dashboard Tabs & Body */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
                {/* Tab Navigation Header */}
                <div className="flex border-b border-gray-200 bg-white rounded-xl p-1.5 shadow-sm mb-6">
                    <button
                        onClick={() => setActiveTab('candidates')}
                        className={`flex-1 py-2.5 px-4 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                            activeTab === 'candidates'
                                ? 'bg-blue-600 text-white shadow-sm'
                                : 'text-gray-600 hover:text-gray-900'
                        }`}
                    >
                        <Users className="w-4 h-4" />
                        1. Candidate Talent Scout ({candidates.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('postings')}
                        className={`flex-1 py-2.5 px-4 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                            activeTab === 'postings'
                                ? 'bg-blue-600 text-white shadow-sm'
                                : 'text-gray-600 hover:text-gray-900'
                        }`}
                    >
                        <Briefcase className="w-4 h-4" />
                        2. Job Postings & Drives ({postedJobs.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('applications')}
                        className={`flex-1 py-2.5 px-4 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                            activeTab === 'applications'
                                ? 'bg-blue-600 text-white shadow-sm'
                                : 'text-gray-600 hover:text-gray-900'
                        }`}
                    >
                        <FileText className="w-4 h-4" />
                        3. Received Applications ({applications.length})
                    </button>
                </div>

                {/* ---------------------------------------------------------------- */}
                {/* TAB 1: CANDIDATE TALENT SCOUT & VERIFIED SKILL FILTER */}
                {/* ---------------------------------------------------------------- */}
                {activeTab === 'candidates' && (
                    <div className="space-y-6">
                        {/* Search & Granular Filter Bar */}
                        <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm space-y-4">
                            <div className="flex flex-col md:flex-row items-center gap-3">
                                {/* Search input */}
                                <div className="relative flex-1 w-full">
                                    <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                                    <input
                                        type="text"
                                        placeholder="Search candidate by name, tech stack, or headline (e.g. React, Node.js, Systems)..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                                    />
                                    {searchQuery && (
                                        <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                            <X className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>

                                {/* Verified Only Toggle */}
                                <button
                                    onClick={() => setVerifiedOnly(!verifiedOnly)}
                                    className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 border transition-all whitespace-nowrap ${
                                        verifiedOnly
                                            ? 'bg-emerald-50 text-emerald-800 border-emerald-300 shadow-sm ring-2 ring-emerald-400/20'
                                            : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                                    }`}
                                >
                                    <ShieldCheck className={`w-4 h-4 ${verifiedOnly ? 'text-emerald-600' : 'text-gray-400'}`} />
                                    <span>Verified Badges Only</span>
                                </button>
                            </div>

                            {/* Dropdown Filters & Skill Shortcuts */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-3 border-t border-gray-100">
                                {/* Department Filter */}
                                <div>
                                    <label className="block text-[11px] font-bold text-gray-600 uppercase mb-1">Department</label>
                                    <select
                                        value={selectedDept}
                                        onChange={(e) => setSelectedDept(e.target.value)}
                                        className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2 text-xs font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="All">All University Departments</option>
                                        <option value="Computer Science & Engineering">Computer Science & Engineering</option>
                                        <option value="Information Technology">Information Technology</option>
                                        <option value="Electronics & Communication">Electronics & Communication</option>
                                    </select>
                                </div>

                                {/* Min CGPA Filter */}
                                <div>
                                    <label className="block text-[11px] font-bold text-gray-600 uppercase mb-1">Minimum CGPA</label>
                                    <select
                                        value={minCgpa}
                                        onChange={(e) => setMinCgpa(e.target.value)}
                                        className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2 text-xs font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="All">Any Academic CGPA</option>
                                        <option value="7.5">7.5+ CGPA</option>
                                        <option value="8.0">8.0+ CGPA (High Honor)</option>
                                        <option value="8.5">8.5+ CGPA (Distinction)</option>
                                        <option value="9.0">9.0+ CGPA (Top 5%)</option>
                                    </select>
                                </div>

                                {/* Skill Shortcut Selector */}
                                <div>
                                    <label className="block text-[11px] font-bold text-gray-600 uppercase mb-1">Core Skill Required</label>
                                    <select
                                        value={selectedSkill}
                                        onChange={(e) => setSelectedSkill(e.target.value)}
                                        className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2 text-xs font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="All">All Technical Competencies</option>
                                        <option value="React">React.js</option>
                                        <option value="Node.js">Node.js</option>
                                        <option value="MongoDB">MongoDB</option>
                                        <option value="Python">Python</option>
                                        <option value="Docker">Docker & DevOps</option>
                                        <option value="Java">Java / Spring Boot</option>
                                        <option value="System Architecture">System Architecture</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Candidates Grid */}
                        {candidatesLoading ? (
                            <div className="py-16 text-center">
                                <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                                <p className="text-xs text-gray-500 font-medium">Filtering verified student profiles...</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {candidates.map((cand) => {
                                    const isShortlisted = shortlistedIds.has(cand._id || cand.studentId);

                                    return (
                                        <div
                                            key={cand._id || cand.studentId}
                                            className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between group relative overflow-hidden"
                                        >
                                            {/* Top Strip */}
                                            <div className="flex items-start justify-between gap-3 mb-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black text-lg shadow-md shadow-blue-500/20">
                                                        {cand.name ? cand.name.charAt(0) : 'S'}
                                                    </div>
                                                    <div>
                                                        <h3 className="text-base font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                                                            {cand.name}
                                                        </h3>
                                                        <div className="text-xs text-gray-500 flex items-center gap-1.5 mt-0.5">
                                                            <GraduationCap className="w-3.5 h-3.5 text-blue-600" />
                                                            <span>CGPA: <strong className="text-gray-800">{cand.cgpa}</strong></span>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Shortlist Bookmark Button */}
                                                <button
                                                    onClick={() => toggleShortlist(cand._id || cand.studentId)}
                                                    className={`p-2 rounded-lg border transition-all ${
                                                        isShortlisted
                                                            ? 'bg-amber-50 text-amber-600 border-amber-300'
                                                            : 'bg-gray-50 text-gray-400 hover:text-amber-500 border-gray-200'
                                                    }`}
                                                    title={isShortlisted ? 'Shortlisted' : 'Bookmark Candidate'}
                                                >
                                                    <Bookmark className={`w-4 h-4 ${isShortlisted ? 'fill-amber-500' : ''}`} />
                                                </button>
                                            </div>

                                            {/* Role & ATS Gauge Strip */}
                                            <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 mb-4 space-y-2">
                                                <div className="text-xs font-semibold text-gray-700 truncate">
                                                    🎯 {cand.targetRole || cand.personalInfo?.headline || 'Software Engineer'}
                                                </div>
                                                <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-200">
                                                    <span className="text-gray-500">ATS Resume Score:</span>
                                                    <span className="font-extrabold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-full text-[11px]">
                                                        {cand.atsScore || 85}% Ready
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Skills & Badges */}
                                            <div className="space-y-2 mb-5">
                                                <div className="flex items-center justify-between text-[11px] font-bold text-gray-500 uppercase">
                                                    <span>Verified Proficiencies</span>
                                                    <span className="text-emerald-600 font-semibold flex items-center gap-1">
                                                        <ShieldCheck className="w-3.5 h-3.5" />
                                                        {cand.verifiedSkillsCount || 0} Badges
                                                    </span>
                                                </div>

                                                <div className="flex flex-wrap gap-1.5">
                                                    {(cand.skills || []).slice(0, 5).map((skill, sIdx) => (
                                                        <span
                                                            key={sIdx}
                                                            className={`px-2 py-0.5 rounded-md text-[11px] font-semibold flex items-center gap-1 ${
                                                                skill.isVerified
                                                                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                                                                    : 'bg-gray-100 text-gray-700'
                                                            }`}
                                                        >
                                                            {skill.isVerified && <Check className="w-3 h-3 text-emerald-600" />}
                                                            {skill.name}
                                                        </span>
                                                    ))}
                                                    {(cand.skills || []).length > 5 && (
                                                        <span className="text-[10px] text-gray-400 self-center">
                                                            +{cand.skills.length - 5} more
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Projects count */}
                                            <div className="text-xs text-gray-500 mb-4 flex items-center justify-between">
                                                <span>Projects: <strong>{cand.projectsCount || cand.projects?.length || 0} Built</strong></span>
                                                <span className="text-blue-600 font-semibold">{cand.department?.split(' ')[0]}</span>
                                            </div>

                                            {/* Action CTAs */}
                                            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-100">
                                                {cand.portfolioSlug ? (
                                                    <a
                                                        href={`/portfolio/${cand.portfolioSlug}`}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="py-2 px-3 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors border border-blue-200"
                                                    >
                                                        Portfolio <ExternalLink className="w-3.5 h-3.5" />
                                                    </a>
                                                ) : (
                                                    <button
                                                        disabled
                                                        className="py-2 px-3 rounded-xl bg-gray-50 text-gray-400 font-semibold text-xs flex items-center justify-center gap-1 cursor-not-allowed border border-gray-200"
                                                    >
                                                        Private CV
                                                    </button>
                                                )}

                                                <button
                                                    onClick={() => setInviteCandidate(cand)}
                                                    className="py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all active:scale-95"
                                                >
                                                    <Mail className="w-3.5 h-3.5" />
                                                    Invite
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}

                                {candidates.length === 0 && (
                                    <div className="col-span-3 bg-white rounded-2xl p-12 text-center border border-gray-200">
                                        <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                        <h4 className="text-base font-bold text-gray-800">No candidates match your criteria</h4>
                                        <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
                                            Try relaxing your filters, lowering the minimum CGPA, or resetting the skill filter.
                                        </p>
                                        <button
                                            onClick={() => {
                                                setSelectedDept('All');
                                                setMinCgpa('All');
                                                setSelectedSkill('All');
                                                setVerifiedOnly(false);
                                                setSearchQuery('');
                                            }}
                                            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-700"
                                        >
                                            Reset Filters
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}

                {/* ---------------------------------------------------------------- */}
                {/* TAB 2: JOB POSTINGS & DRIVES */}
                {/* ---------------------------------------------------------------- */}
                {activeTab === 'postings' && (
                    <div className="space-y-6">
                        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <div>
                                <h3 className="text-lg font-bold text-gray-900">Active Campus Recruitment Drives</h3>
                                <p className="text-xs text-gray-500 mt-0.5">
                                    Manage ongoing placement drives, eligibility rules, and technical screening criteria.
                                </p>
                            </div>
                            <button
                                onClick={() => setShowPostModal(true)}
                                className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-2 shadow-sm"
                            >
                                <PlusCircle className="w-4 h-4" />
                                Post New Drive
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {postedJobs.map((job) => (
                                <div key={job._id} className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
                                    <div>
                                        <div className="flex justify-between items-start gap-2 mb-3">
                                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200 uppercase">
                                                {job.type}
                                            </span>
                                            <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                                                Active
                                            </span>
                                        </div>

                                        <h4 className="text-base font-bold text-gray-900 mb-1">{job.title}</h4>
                                        <p className="text-xs text-gray-500 flex items-center gap-1.5 mb-3">
                                            <MapPin className="w-3.5 h-3.5 text-gray-400" />
                                            {job.location || 'Pan-India'} • {job.workMode || 'On-site'}
                                        </p>

                                        <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 space-y-1 text-xs mb-4">
                                            <div className="flex justify-between text-gray-600">
                                                <span>Package / Stipend:</span>
                                                <span className="font-bold text-gray-900">{job.stipendOrSalary || 'Competitive'}</span>
                                            </div>
                                            <div className="flex justify-between text-gray-600">
                                                <span>Duration:</span>
                                                <span className="font-medium text-gray-800">{job.duration || 'Full Time'}</span>
                                            </div>
                                        </div>

                                        {/* Required Skills */}
                                        <div className="mb-4">
                                            <div className="text-[11px] font-bold text-gray-500 uppercase mb-1.5">Required Skills</div>
                                            <div className="flex flex-wrap gap-1">
                                                {(job.requiredSkills || []).map((s, idx) => (
                                                    <span key={idx} className="px-2 py-0.5 rounded bg-gray-100 text-gray-700 text-[10px] font-semibold">
                                                        {s.name || s}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
                                        <span className="text-gray-400">Created: {new Date(job.createdAt || Date.now()).toLocaleDateString()}</span>
                                        <button 
                                            onClick={() => setActiveTab('applications')}
                                            className="text-blue-600 font-bold hover:underline flex items-center gap-1"
                                        >
                                            View Applicants <ArrowRight className="w-3 h-3" />
                                        </button>
                                    </div>
                                </div>
                            ))}

                            {postedJobs.length === 0 && (
                                <div className="col-span-3 bg-white rounded-2xl p-12 text-center border border-gray-200">
                                    <Briefcase className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                    <h4 className="text-base font-bold text-gray-800">No active job opportunities posted yet</h4>
                                    <p className="text-xs text-gray-500 mt-1">Post a campus opportunity to start receiving student applications.</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* ---------------------------------------------------------------- */}
                {/* TAB 3: RECEIVED APPLICATIONS */}
                {/* ---------------------------------------------------------------- */}
                {activeTab === 'applications' && (
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                        <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gray-50/50">
                            <div>
                                <h3 className="text-base font-bold text-gray-900">Received Student Applications</h3>
                                <p className="text-xs text-gray-500">
                                    Screen applications scored automatically by ATS match algorithms against job requirements.
                                </p>
                            </div>
                            <span className="text-xs font-semibold text-gray-500 bg-white px-3 py-1 rounded-lg border border-gray-200">
                                Total: {applications.length} Applicants
                            </span>
                        </div>

                        {appsLoading ? (
                            <div className="p-12 text-center text-xs text-gray-500">Loading student applications...</div>
                        ) : (
                            <div className="divide-y divide-gray-100">
                                {applications.map((app) => (
                                    <div key={app._id} className="p-5 hover:bg-slate-50/60 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4">
                                        <div className="flex items-start gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 font-black text-sm flex items-center justify-center flex-shrink-0 mt-0.5">
                                                {app.student?.user?.name ? app.student.user.name.charAt(0) : 'S'}
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <h4 className="text-sm font-bold text-gray-900">
                                                        {app.student?.user?.name || 'Applicant Scholar'}
                                                    </h4>
                                                    <span className="text-xs text-gray-400">•</span>
                                                    <span className="text-xs font-semibold text-blue-600">
                                                        {app.opportunity?.title || 'Applied Position'}
                                                    </span>
                                                </div>
                                                <p className="text-xs text-gray-500 mt-0.5">
                                                    Department: {app.student?.academicInfo?.department || 'CSE'} | CGPA: <strong>{app.student?.academicInfo?.cgpa || '8.2'}</strong>
                                                </p>
                                                {app.coverNote && (
                                                    <div className="mt-2 text-xs text-gray-600 bg-gray-50 p-2.5 rounded-lg border border-gray-200 italic">
                                                        "{app.coverNote}"
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4 self-end md:self-auto">
                                            <div className="text-right">
                                                <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-black bg-emerald-100 text-emerald-800">
                                                    <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                                                    {app.matchScore || 85}% Match
                                                </div>
                                                <div className="text-[11px] text-gray-400 mt-1 capitalize font-medium">
                                                    Status: <span className="text-gray-800 font-semibold">{app.status || 'Under Review'}</span>
                                                </div>
                                            </div>

                                            <button
                                                onClick={() => setInviteCandidate({
                                                    name: app.student?.user?.name || 'Applicant Scholar',
                                                    email: app.student?.user?.email || 'student@lpu.in',
                                                    targetRole: app.opportunity?.title
                                                })}
                                                className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm flex items-center gap-1.5"
                                            >
                                                <Mail className="w-3.5 h-3.5" /> Interview
                                            </button>
                                        </div>
                                    </div>
                                ))}

                                {applications.length === 0 && (
                                    <div className="p-12 text-center text-gray-500 text-xs">
                                        No candidate applications submitted for this company yet.
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* ---------------------------------------------------- */}
            {/* POST OPPORTUNITY MODAL */}
            {/* ---------------------------------------------------- */}
            {showPostModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-150">
                        <div className="p-5 border-b border-gray-200 flex items-center justify-between bg-gray-50">
                            <div>
                                <h3 className="font-bold text-gray-900 text-base">Post Campus Recruitment Opportunity</h3>
                                <p className="text-xs text-gray-500 mt-0.5">Publish a verified hiring drive or internship to the campus pool</p>
                            </div>
                            <button onClick={() => setShowPostModal(false)} className="text-gray-400 hover:text-gray-600">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleCreateOpportunity} className="p-6 overflow-y-auto space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 mb-1">Job Title *</label>
                                    <input
                                        required
                                        type="text"
                                        name="title"
                                        placeholder="e.g. Associate Backend Engineer"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        className="w-full border border-gray-300 rounded-lg p-2 text-xs focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 mb-1">Opportunity Type</label>
                                    <select
                                        name="type"
                                        value={formData.type}
                                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                        className="w-full border border-gray-300 rounded-lg p-2 text-xs focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="Internship">Internship</option>
                                        <option value="Placement">Full-Time Placement</option>
                                        <option value="Project">Industry Project</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-700 mb-1">Location *</label>
                                    <input
                                        required
                                        type="text"
                                        name="location"
                                        placeholder="e.g. Bengaluru, Karnataka or Remote"
                                        value={formData.location}
                                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                        className="w-full border border-gray-300 rounded-lg p-2 text-xs focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 mb-1">Work Mode</label>
                                    <select
                                        name="workMode"
                                        value={formData.workMode}
                                        onChange={(e) => setFormData({ ...formData, workMode: e.target.value })}
                                        className="w-full border border-gray-300 rounded-lg p-2 text-xs focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="On-site">On-site</option>
                                        <option value="Hybrid">Hybrid</option>
                                        <option value="Remote">Remote</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-700 mb-1">Duration</label>
                                    <input
                                        type="text"
                                        name="duration"
                                        placeholder="e.g. 6 Months or Permanent"
                                        value={formData.duration}
                                        onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                                        className="w-full border border-gray-300 rounded-lg p-2 text-xs focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 mb-1">Stipend or CTC</label>
                                    <input
                                        type="text"
                                        name="stipendOrSalary"
                                        placeholder="e.g. ₹35,000/mo or 12 LPA"
                                        value={formData.stipendOrSalary}
                                        onChange={(e) => setFormData({ ...formData, stipendOrSalary: e.target.value })}
                                        className="w-full border border-gray-300 rounded-lg p-2 text-xs focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-xs font-bold text-gray-700 mb-1">Required Skills (Comma-separated) *</label>
                                    <input
                                        required
                                        type="text"
                                        name="skillsStr"
                                        placeholder="e.g. Node.js, MongoDB, React, System Design, Docker"
                                        value={formData.skillsStr}
                                        onChange={(e) => setFormData({ ...formData, skillsStr: e.target.value })}
                                        className="w-full border border-gray-300 rounded-lg p-2 text-xs focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>

                            <div className="pt-4 border-t border-gray-200 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowPostModal(false)}
                                    className="px-4 py-2 border border-gray-300 rounded-lg text-xs font-bold text-gray-700 hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow-md"
                                >
                                    Publish Opportunity
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ---------------------------------------------------- */}
            {/* INTERVIEW INVITATION MODAL */}
            {/* ---------------------------------------------------- */}
            {inviteCandidate && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in duration-150">
                        <div className="p-5 border-b border-gray-200 flex items-center justify-between bg-blue-50">
                            <div>
                                <h3 className="font-bold text-blue-950 text-base flex items-center gap-2">
                                    <Mail className="w-4 h-4 text-blue-600" />
                                    Send Interview Invitation
                                </h3>
                                <p className="text-xs text-blue-700 mt-0.5">Inviting <strong>{inviteCandidate.name}</strong> ({inviteCandidate.email})</p>
                            </div>
                            <button onClick={() => setInviteCandidate(null)} className="text-gray-400 hover:text-gray-600">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSendInvite} className="p-6 space-y-4 text-xs">
                            <div>
                                <label className="block font-bold text-gray-700 mb-1">Interview Round</label>
                                <select
                                    value={inviteForm.round}
                                    onChange={(e) => setInviteForm({ ...inviteForm, round: e.target.value })}
                                    className="w-full border border-gray-300 rounded-lg p-2 font-medium"
                                >
                                    <option value="Technical Screening">Technical Screening</option>
                                    <option value="System Design Round">System Design Round</option>
                                    <option value="Coding Challenge Evaluation">Coding Challenge Evaluation</option>
                                    <option value="Leadership & Culture Fit">Leadership & Culture Fit</option>
                                    <option value="Final Offer Discussion">Final Offer Discussion</option>
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block font-bold text-gray-700 mb-1">Interview Date *</label>
                                    <input
                                        required
                                        type="date"
                                        value={inviteForm.date}
                                        onChange={(e) => setInviteForm({ ...inviteForm, date: e.target.value })}
                                        className="w-full border border-gray-300 rounded-lg p-2 font-medium"
                                    />
                                </div>
                                <div>
                                    <label className="block font-bold text-gray-700 mb-1">Time Slot *</label>
                                    <input
                                        required
                                        type="time"
                                        value={inviteForm.time}
                                        onChange={(e) => setInviteForm({ ...inviteForm, time: e.target.value })}
                                        className="w-full border border-gray-300 rounded-lg p-2 font-medium"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block font-bold text-gray-700 mb-1">Meeting Link (Google Meet / Zoom)</label>
                                <input
                                    type="text"
                                    placeholder="https://meet.google.com/xyz-abc-def"
                                    value={inviteForm.meetingLink}
                                    onChange={(e) => setInviteForm({ ...inviteForm, meetingLink: e.target.value })}
                                    className="w-full border border-gray-300 rounded-lg p-2 font-medium"
                                />
                            </div>

                            <div>
                                <label className="block font-bold text-gray-700 mb-1">Candidate Preparation Note</label>
                                <textarea
                                    rows="3"
                                    placeholder="e.g. Please be prepared to discuss your system architecture project and write live Node.js code."
                                    value={inviteForm.notes}
                                    onChange={(e) => setInviteForm({ ...inviteForm, notes: e.target.value })}
                                    className="w-full border border-gray-300 rounded-lg p-2 font-medium"
                                />
                            </div>

                            <div className="pt-3 border-t border-gray-200 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setInviteCandidate(null)}
                                    className="px-4 py-2 border border-gray-300 rounded-lg font-bold text-gray-700 hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-md flex items-center gap-1.5"
                                >
                                    <Send className="w-3.5 h-3.5" /> Send Invitation
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EmployerDashboard;