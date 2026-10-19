import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    X, 
    ArrowRight, 
    ExternalLink, 
    Calendar, 
    Clock, 
    MapPin, 
    Building2, 
    GraduationCap, 
    Trophy, 
    Star, 
    CheckCircle2, 
    Terminal, 
    Code2, 
    Users, 
    Sparkles, 
    ShieldCheck, 
    TrendingUp,
    FileCheck,
    Briefcase,
    AlertCircle,
    Check,
    Award,
    HeartHandshake,
    Search,
    Play,
    Timer,
    Ticket,
    Share2,
    Download
} from 'lucide-react';

const NavShowcaseModal = ({ isOpen, onClose, cardData }) => {
    const [activeRoleView, setActiveRoleView] = useState('student');
    const [successFilter, setSuccessFilter] = useState('all');
    const [activeAudienceView, setActiveAudienceView] = useState('deans');
    const [rosterSearch, setRosterSearch] = useState('');
    const [rosterBranch, setRosterBranch] = useState('all');
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [ideRunning, setIdeRunning] = useState(false);

    // Reset views when modal opens with new cardData
    useEffect(() => {
        if (cardData?.rolesData) setActiveRoleView('student');
        if (cardData?.sectionsData) setActiveAudienceView('deans');
        setSuccessFilter('all');
        setRosterSearch('');
        setRosterBranch('all');
        setSelectedSlot(null);
        setIdeRunning(false);
    }, [cardData]);

    // Close on ESC key and freeze body scroll
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') onClose();
        };
        if (isOpen) {
            window.addEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'hidden';
        }
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    if (!isOpen || !cardData) return null;

    const isPlatformFeatures = cardData.cardType === 'platform-features';
    const isPlatformSuccess = cardData.cardType === 'platform-success';
    const isPlatformTestimonials = cardData.cardType === 'platform-testimonials';
    const isInterview = cardData.cardType === 'interview';
    const isRoster = cardData.cardType === 'roster';
    const isMission = cardData.cardType === 'mission';
    const isEvent = cardData.cardType === 'event';
    const isMentor = cardData.cardType === 'mentor';
    const isTalentSearch = cardData.cardType === 'talent-search';
    const isTeam = cardData.cardType === 'team';

    // Role data for features modal
    const activeRoleData = isPlatformFeatures && cardData.rolesData ? cardData.rolesData[activeRoleView] : null;

    // Audience data for testimonials modal
    const activeAudienceData = isPlatformTestimonials && cardData.sectionsData ? cardData.sectionsData[activeAudienceView] : null;

    // Filtered alumni profiles for success stories
    const filteredAlumni = isPlatformSuccess && cardData.alumniProfiles 
        ? cardData.alumniProfiles.filter(p => successFilter === 'all' || p.category === successFilter)
        : [];

    // Filtered student roster
    const filteredRoster = isRoster && cardData.rosterSample
        ? cardData.rosterSample.filter(item => {
            const matchesBranch = rosterBranch === 'all' || item.branch === rosterBranch;
            const matchesSearch = !rosterSearch || 
                item.name.toLowerCase().includes(rosterSearch.toLowerCase()) ||
                item.roll.toLowerCase().includes(rosterSearch.toLowerCase()) ||
                item.status.toLowerCase().includes(rosterSearch.toLowerCase());
            return matchesBranch && matchesSearch;
        })
        : [];

    // Dynamic modal container sizing and styling based on content type
    const getModalContainerStyle = () => {
        if (isEvent) {
            // Authentic VIP Event Ticket / Pass: Tall, sleek ticket pass
            return 'max-w-md sm:max-w-lg rounded-2xl sm:rounded-3xl border border-blue-500/40 shadow-[0_0_80px_rgba(37,99,235,0.3)] ring-1 ring-blue-400/30';
        }
        if (isRoster) {
            // Ultra-wide panoramic data spreadsheet table
            return 'max-w-6xl rounded-2xl sm:rounded-3xl border border-blue-500/30 shadow-[0_0_70px_rgba(37,99,235,0.25)] ring-1 ring-blue-500/20';
        }
        if (isTeam) {
            // Compact, elegant leadership pedigree grid
            return 'max-w-3xl rounded-2xl sm:rounded-3xl border border-blue-500/30 shadow-[0_0_60px_rgba(37,99,235,0.25)] ring-1 ring-blue-500/20';
        }
        if (isMission) {
            // Long horizontal comparison dossier
            return 'max-w-4xl rounded-2xl sm:rounded-3xl border border-blue-500/30 shadow-[0_0_60px_rgba(37,99,235,0.25)] ring-1 ring-blue-500/20';
        }
        if (isMentor || isTalentSearch || isPlatformTestimonials) {
            // Balanced 4xl grid
            return 'max-w-4xl rounded-2xl sm:rounded-3xl border border-blue-500/30 shadow-[0_0_60px_rgba(37,99,235,0.25)] ring-1 ring-blue-500/20';
        }
        // Flagship Features, Success, Mock Interviews
        return 'max-w-5xl rounded-2xl sm:rounded-3xl border border-blue-500/30 shadow-[0_0_60px_rgba(37,99,235,0.25)] ring-1 ring-blue-500/20';
    };

    // Show telemetry bar only for select cards that don't have their own specialized top bar
    const showTopTelemetry = !isInterview && !isRoster && !isMission && !isEvent && cardData.keyStats;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-2.5 sm:p-4 md:p-6 overscroll-contain">
                {/* Backdrop with blur */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
                />

                {/* Main Card Modal Container with Dynamic Size & Style */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.96, y: 12 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.96, y: 12 }}
                    transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                    className={`relative w-full overflow-hidden z-10 max-h-[92dvh] sm:max-h-[90vh] my-auto flex flex-col text-left transition-all bg-[#080d1a] text-white ${getModalContainerStyle()}`}
                >
                    {/* -------------------------------------------------------------
                        1. BESPOKE HEADER (Customized by Card Type)
                       ------------------------------------------------------------- */}
                    {isEvent ? (
                        /* VIP Ticket Pass Header */
                        <div className="p-5 sm:p-6 pb-4 border-b border-dashed border-slate-700/80 bg-gradient-to-b from-blue-950/40 via-[#0c1527] to-[#080d1a] relative">
                            <button
                                onClick={onClose}
                                className="absolute top-4 right-4 p-1.5 rounded-full transition-colors cursor-pointer bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white"
                                aria-label="Close modal"
                            >
                                <X className="w-4 h-4" />
                            </button>

                            <div className="flex items-center space-x-2 mb-2">
                                <span className="px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                                    Campus Drive Pass
                                </span>
                                <span className="text-[11px] font-mono text-slate-400">#CS-EVT-9842</span>
                            </div>

                            <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                                {cardData.title}
                            </h2>

                            <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-slate-300 font-mono">
                                <span className="flex items-center gap-1 text-blue-300 font-medium">
                                    <Calendar className="w-3.5 h-3.5" /> {cardData.eventMeta?.date}
                                </span>
                                <span>•</span>
                                <span className="flex items-center gap-1 text-slate-400">
                                    <Clock className="w-3.5 h-3.5" /> {cardData.eventMeta?.time}
                                </span>
                                <span>•</span>
                                <span className="text-emerald-400 font-medium">
                                    {cardData.eventMeta?.mode}
                                </span>
                            </div>

                            {/* Live Countdown Box */}
                            <div className="mt-3.5 p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <div className="text-[10px] font-medium uppercase tracking-wider text-slate-400">Drive Starts In</div>
                                    <div className="text-sm sm:text-base font-bold text-amber-400 font-mono">02d : 14h : 36m : 18s</div>
                                </div>
                                <div className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 text-xs font-medium border border-emerald-500/30">
                                    Verified Entry Pass
                                </div>
                            </div>
                        </div>
                    ) : isInterview ? (
                        /* macOS Developer IDE Terminal Window Header */
                        <div className="px-4 sm:px-5 py-3 border-b border-slate-800 bg-[#0d121f] flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <div className="flex space-x-1.5">
                                    <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]"></div>
                                    <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]"></div>
                                    <div className="w-2.5 h-2.5 rounded-full bg-[#27c93f]"></div>
                                </div>
                                <div className="h-3.5 w-px bg-slate-800 mx-1 hidden sm:block"></div>
                                <div className="flex items-center space-x-2 text-xs font-mono">
                                    <Terminal className="w-3.5 h-3.5 text-blue-400" />
                                    <span className="font-semibold text-white">technical-interview.ts</span>
                                    <span className="text-slate-500 hidden md:inline">•</span>
                                    <span className="text-slate-400 font-normal hidden md:inline">Practice Coding Environment</span>
                                </div>
                            </div>
                            <div className="flex items-center space-x-2.5">
                                <span className="hidden sm:inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-mono bg-blue-500/10 text-blue-300 border border-blue-500/20">
                                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-ping"></span>
                                    PRACTICE ACTIVE
                                </span>
                                <button
                                    onClick={onClose}
                                    className="p-1 rounded-md bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors cursor-pointer"
                                    aria-label="Close modal"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ) : isRoster ? (
                        /* Enterprise Campus ERP Spreadsheet Header */
                        <div className="p-5 sm:p-6 pb-4 border-b border-slate-800 bg-gradient-to-r from-blue-950/40 via-[#0d1629] to-[#080d1a] relative">
                            <button
                                onClick={onClose}
                                className="absolute top-4 right-4 p-1.5 rounded-full transition-colors cursor-pointer bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white"
                                aria-label="Close modal"
                            >
                                <X className="w-4 h-4" />
                            </button>

                            <div className="flex flex-wrap items-center gap-2 mb-1.5">
                                <span className="px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider bg-blue-500/20 text-blue-300 border border-blue-500/30 flex items-center gap-1.5">
                                    <Building2 className="w-3 h-3 text-blue-400" />
                                    CAMPUS PLACEMENT DIRECTORY
                                </span>
                                <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1.5 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                                    Student Database
                                </span>
                                <span className="text-[11px] font-mono text-slate-400">
                                    1,480 Registered Candidates
                                </span>
                            </div>

                            <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                                {cardData.title}
                            </h2>
                            <p className="mt-1 text-xs text-slate-300 max-w-2xl leading-relaxed">
                                {cardData.tagline}
                            </p>
                        </div>
                    ) : isMission ? (
                        /* Transformation Blueprint Dossier Header */
                        <div className="p-5 sm:p-6 pb-4 border-b border-slate-800 bg-gradient-to-r from-slate-900 via-[#0c1527] to-[#080d1a] relative">
                            <button
                                onClick={onClose}
                                className="absolute top-4 right-4 p-1.5 rounded-full transition-colors cursor-pointer bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white"
                                aria-label="Close modal"
                            >
                                <X className="w-4 h-4" />
                            </button>

                            <div className="flex items-center space-x-2 mb-1.5">
                                <span className="px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 flex items-center gap-1.5">
                                    <Sparkles className="w-3 h-3 text-cyan-400" />
                                    CAREERSYNC VS TRADITIONAL SYSTEM
                                </span>
                                <span className="text-[11px] font-mono text-slate-400">Platform Overview</span>
                            </div>

                            <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                                {cardData.title}
                            </h2>
                            <p className="mt-1 text-xs text-slate-300 max-w-2xl leading-relaxed">
                                {cardData.tagline}
                            </p>
                        </div>
                    ) : isTeam ? (
                        /* Compact Executive Pedigree Header */
                        <div className="p-4 sm:p-5 pb-3 border-b border-slate-800 bg-gradient-to-b from-[#0e1628] to-[#080d1a] relative">
                            <button
                                onClick={onClose}
                                className="absolute top-4 right-4 p-1.5 rounded-full transition-colors cursor-pointer bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white"
                                aria-label="Close modal"
                            >
                                <X className="w-4 h-4" />
                            </button>

                            <div className="flex items-center space-x-2 mb-1">
                                <span className="px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center gap-1.5">
                                    <Users className="w-3 h-3 text-purple-400" />
                                    FOUNDING TEAM
                                </span>
                            </div>

                            <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                                {cardData.title}
                            </h2>
                            <p className="text-xs text-slate-400 mt-0.5">
                                {cardData.tagline}
                            </p>
                        </div>
                    ) : isMentor ? (
                        /* 1-on-1 Mentorship Booking Header */
                        <div className="p-5 sm:p-6 pb-4 border-b border-slate-800 bg-gradient-to-r from-teal-950/40 via-[#0d1629] to-[#080d1a] relative">
                            <button
                                onClick={onClose}
                                className="absolute top-4 right-4 p-1.5 rounded-full transition-colors cursor-pointer bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white"
                                aria-label="Close modal"
                            >
                                <X className="w-4 h-4" />
                            </button>

                            <div className="flex flex-wrap items-center gap-2 mb-1.5">
                                <span className="px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider bg-teal-500/20 text-teal-300 border border-teal-500/30 flex items-center gap-1.5">
                                    <HeartHandshake className="w-3 h-3 text-teal-400" />
                                    1-ON-1 MENTOR SESSIONS
                                </span>
                                <span className="text-[11px] font-mono text-emerald-400 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                                    Free for Students
                                </span>
                            </div>

                            <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                                {cardData.title}
                            </h2>
                            <p className="mt-1 text-xs text-slate-300 max-w-2xl leading-relaxed">
                                {cardData.tagline}
                            </p>
                        </div>
                    ) : (
                        /* Standard Unified & Flagship Header */
                        <div className="p-5 sm:p-7 pb-4 border-b relative border-slate-800 bg-gradient-to-b from-blue-950/30 via-[#0c1527] to-[#080d1a]">
                            <button
                                onClick={onClose}
                                className="absolute top-5 right-5 p-1.5 rounded-full transition-colors cursor-pointer bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white"
                                aria-label="Close modal"
                            >
                                <X className="w-4 h-4" />
                            </button>

                            <div className="flex flex-wrap items-center gap-2 mb-2">
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider border bg-blue-500/20 text-blue-300 border-blue-400/40">
                                    <Sparkles className="w-3 h-3 mr-1 text-blue-400" />
                                    {cardData.category}
                                </span>
                                {cardData.badge && (
                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium border bg-slate-800/80 text-emerald-300 border-emerald-500/30">
                                        <ShieldCheck className="w-3 h-3 mr-1 text-emerald-400" />
                                        {cardData.badge}
                                    </span>
                                )}
                            </div>

                            <h2 className="text-base sm:text-lg font-bold tracking-tight text-white">
                                {cardData.title}
                            </h2>
                            <p className="mt-1 text-xs sm:text-sm max-w-2xl leading-relaxed text-slate-300">
                                {cardData.tagline}
                            </p>
                        </div>
                    )}

                    {/* -------------------------------------------------------------
                        2. KEY STATS TELEMETRY BAR (Rendered only on relevant cards)
                       ------------------------------------------------------------- */}
                    {showTopTelemetry && (
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-px border-b bg-slate-800 border-slate-800">
                            {cardData.keyStats.map((stat, idx) => (
                                <div key={idx} className="p-2.5 sm:p-3.5 text-left bg-[#0d1629]">
                                    <div className="text-sm sm:text-base md:text-lg font-bold tracking-tight text-blue-300">
                                        {stat.value}
                                    </div>
                                    <div className="text-[11px] sm:text-xs font-medium mt-0.5 text-slate-200 truncate">
                                        {stat.label}
                                    </div>
                                    <div className="text-[10px] mt-0.5 font-normal truncate text-slate-400">
                                        {stat.sub}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* -------------------------------------------------------------
                        3. BESPOKE STRUCTURAL CONTENT AREA (Scrollable Body)
                       ------------------------------------------------------------- */}
                    <div className="p-3.5 sm:p-6 md:p-8 overflow-y-auto space-y-4 sm:space-y-6 flex-1 overscroll-contain">
                        
                        {/* =========================================================
                            STRUCTURE 1: PLATFORM FEATURES (Command Center Console)
                           ========================================================= */}
                        {isPlatformFeatures && cardData.rolesData && activeRoleData && (
                            <div className="space-y-4 sm:space-y-6">
                                {/* Segmented Role Switcher */}
                                <div className="p-1 sm:p-1.5 bg-[#0e172a] rounded-xl sm:rounded-2xl border border-slate-800 grid grid-cols-3 gap-1 sm:gap-1.5">
                                    {[
                                        { id: 'student', label: 'For Students', icon: GraduationCap, color: 'blue' },
                                        { id: 'tpo', label: 'Placement Cells', icon: Building2, color: 'emerald' },
                                        { id: 'recruiter', label: 'Hiring Teams', icon: Briefcase, color: 'purple' }
                                    ].map((tab) => {
                                        const Icon = tab.icon;
                                        const isActive = activeRoleView === tab.id;
                                        return (
                                            <button
                                                key={tab.id}
                                                onClick={() => setActiveRoleView(tab.id)}
                                                className={`py-2 px-1 sm:px-3 rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-semibold flex items-center justify-center space-x-1 sm:space-x-1.5 transition-all cursor-pointer ${
                                                    isActive 
                                                        ? tab.color === 'blue' 
                                                            ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                                                            : tab.color === 'emerald'
                                                            ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                                                            : 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                                                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                                                }`}
                                            >
                                                <Icon className="w-3.5 h-3.5 shrink-0" />
                                                <span className="truncate">{tab.label}</span>
                                            </button>
                                        );
                                    })}
                                </div>

                                {/* Active Role Live Visualizer Display */}
                                <div className="p-3.5 sm:p-6 rounded-xl sm:rounded-2xl bg-[#0d1629] border border-slate-800 space-y-4 sm:space-y-5">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 sm:pb-4 border-b border-slate-800">
                                        <div>
                                            <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border uppercase tracking-wider ${activeRoleData.badgeColor}`}>
                                                {activeRoleData.tag}
                                            </span>
                                            <h3 className="text-sm sm:text-base font-semibold text-white mt-1">
                                                {activeRoleData.title}
                                            </h3>
                                        </div>
                                        <div className="text-[11px] sm:text-xs font-mono text-slate-400 bg-slate-900 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg border border-slate-800 self-start sm:self-auto">
                                            {activeRoleData.roleTarget}
                                        </div>
                                    </div>

                                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                                        {activeRoleData.desc}
                                    </p>

                                    {/* Student Specific Sub-view */}
                                    {activeRoleView === 'student' && (
                                        <div className="space-y-4">
                                            <div className="space-y-1.5">
                                                <div className="flex justify-between items-center text-xs">
                                                    <span className="font-medium text-slate-300">Skill Alignment for Target Role</span>
                                                    <span className="font-semibold text-emerald-400 font-mono">{activeRoleData.matchScore}% Match</span>
                                                </div>
                                                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                                                    <div 
                                                        className="h-full bg-gradient-to-r from-blue-500 to-emerald-400 rounded-full transition-all duration-700" 
                                                        style={{ width: `${activeRoleData.matchScore}%` }}
                                                    ></div>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                                                <div className="p-3.5 rounded-xl bg-slate-900/90 border border-emerald-500/20 space-y-2">
                                                    <div className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
                                                        <Check className="w-3.5 h-3.5" /> Skills Found on Resume
                                                    </div>
                                                    <div className="flex flex-wrap gap-1.5">
                                                        {activeRoleData.matchedSkills?.map((s, idx) => (
                                                            <span key={idx} className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 text-[11px] font-mono border border-emerald-500/20">
                                                                {s}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>

                                                <div className="p-3.5 rounded-xl bg-slate-900/90 border border-amber-500/20 space-y-2">
                                                    <div className="text-xs font-semibold text-amber-400 flex items-center gap-1.5">
                                                        <AlertCircle className="w-3.5 h-3.5" /> Skills to Add or Learn
                                                    </div>
                                                    <div className="flex flex-wrap gap-1.5">
                                                        {activeRoleData.missingSkills?.map((s, idx) => (
                                                            <span key={idx} className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 text-[11px] font-mono border border-amber-500/20">
                                                                {s}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* TPO & Recruiter Specific Tools Grid */}
                                    {(activeRoleView === 'tpo' || activeRoleView === 'recruiter') && activeRoleData.tools && (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                                            {activeRoleData.tools.map((tool, idx) => (
                                                <div key={idx} className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1">
                                                    <div className="text-xs font-semibold text-slate-100 flex items-center gap-1.5">
                                                        <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
                                                        <span>{tool.name}</span>
                                                    </div>
                                                    <p className="text-[11px] text-slate-400 leading-relaxed pl-5">
                                                        {tool.detail}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {/* Live Telemetry Chips */}
                                    <div className="grid grid-cols-3 gap-1.5 sm:gap-2 pt-3 border-t border-slate-800">
                                        {activeRoleData.metrics?.map((m, idx) => (
                                            <div key={idx} className="bg-slate-900/80 p-2 sm:p-2.5 rounded-lg sm:rounded-xl text-center border border-slate-800">
                                                <div className="text-xs sm:text-sm font-semibold text-white">{m.value}</div>
                                                <div className="text-[9px] sm:text-[10px] text-slate-400 font-normal truncate">{m.label}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* =========================================================
                            STRUCTURE 2: SUCCESS STORIES (Hall of Fame Spotlight)
                           ========================================================= */}
                        {isPlatformSuccess && (
                            <div className="space-y-4 sm:space-y-6">
                                {/* Featured Candidate Spotlight Hero Card */}
                                {cardData.heroCandidate && (
                                    <div className="p-4 sm:p-6 rounded-xl sm:rounded-2xl bg-gradient-to-r from-[#0d1629] via-[#101b33] to-[#0a1220] border border-blue-500/30 shadow-lg shadow-blue-950/40 relative overflow-hidden">
                                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 sm:gap-4">
                                            <div className="space-y-2">
                                                <div className="flex items-center gap-2">
                                                    <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-wider bg-blue-500/20 text-blue-300 border border-blue-400/40 flex items-center gap-1">
                                                        <Trophy className="w-3 h-3 text-blue-400" />
                                                        {cardData.heroCandidate.badge}
                                                    </span>
                                                    <span className="text-[11px] font-medium text-slate-300 font-mono">
                                                        {cardData.heroCandidate.metrics}
                                                    </span>
                                                </div>
                                                <h3 className="text-base sm:text-lg font-semibold text-white">
                                                    {cardData.heroCandidate.name} • <span className="text-emerald-400 font-bold">{cardData.heroCandidate.package}</span>
                                                </h3>
                                                <div className="text-xs text-slate-300 font-medium">
                                                    {cardData.heroCandidate.role} @ <span className="text-white font-medium">{cardData.heroCandidate.company}</span> • <span className="text-blue-300/80">{cardData.heroCandidate.college}</span>
                                                </div>
                                            </div>

                                            <div className="px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 text-right shrink-0">
                                                <div className="text-[11px] font-mono text-emerald-400">Offer Verified</div>
                                                <div className="text-base font-bold text-white">{cardData.heroCandidate.package}</div>
                                            </div>
                                        </div>

                                        <p className="mt-3 text-xs sm:text-sm text-slate-200 italic bg-slate-950/60 p-3 rounded-xl border border-slate-800 leading-relaxed">
                                            "{cardData.heroCandidate.quote}"
                                        </p>

                                        <div className="flex flex-wrap items-center gap-1.5 mt-3 pt-3 border-t border-slate-800">
                                            <span className="text-[11px] font-medium text-slate-400 mr-1">Skills Used:</span>
                                            {cardData.heroCandidate.skills?.map((sk, idx) => (
                                                <span key={idx} className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-300 font-mono text-[10px] border border-blue-500/20">
                                                    {sk}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Package Distribution Bar */}
                                {cardData.ctcDistribution && (
                                    <div className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-[#0d1629] border border-slate-800 space-y-2">
                                        <div className="flex justify-between items-center text-xs">
                                            <span className="font-semibold text-blue-300 uppercase tracking-wider text-[10px]">2025-26 Package Spread</span>
                                            <span className="text-slate-400 font-mono text-[11px]">18,400+ Total Placements</span>
                                        </div>
                                        <div className="h-2.5 w-full bg-slate-900 rounded-full overflow-hidden flex">
                                            <div style={{ width: '18%' }} className="bg-blue-500 h-full" title="₹25+ LPA (18%)"></div>
                                            <div style={{ width: '34%' }} className="bg-indigo-500 h-full" title="₹15-25 LPA (34%)"></div>
                                            <div style={{ width: '48%' }} className="bg-slate-700 h-full" title="₹8-15 LPA (48%)"></div>
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5 sm:gap-2 pt-1 text-[11px] text-slate-300">
                                            {cardData.ctcDistribution.map((item, idx) => (
                                                <div key={idx} className="truncate">
                                                    <span className="font-semibold text-white">{item.pct}%</span> {item.range}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Interactive Placement Category Filter */}
                                <div className="space-y-3">
                                    <div className="flex flex-wrap items-center justify-between gap-2">
                                        <div className="text-xs font-semibold text-blue-400 uppercase tracking-wider">
                                            Recent Candidate Placements
                                        </div>
                                        <div className="flex flex-wrap gap-1.5">
                                            {[
                                                { id: 'all', label: 'All (4)' },
                                                { id: 'tier1', label: 'Tier-1 Roles' },
                                                { id: 'tier23', label: 'Tier-2/3 Colleges' },
                                                { id: 'interns', label: 'Interns to PPO' }
                                            ].map((f) => (
                                                <button
                                                    key={f.id}
                                                    onClick={() => setSuccessFilter(f.id)}
                                                    className={`px-3 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                                                        successFilter === f.id
                                                            ? 'bg-blue-600 text-white font-semibold shadow-md shadow-blue-600/30'
                                                            : 'bg-slate-900/90 text-slate-300 hover:bg-slate-800 border border-slate-800'
                                                    }`}
                                                >
                                                    {f.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Filtered Student Cards Grid */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                                        {filteredAlumni.map((profile, idx) => (
                                            <div key={idx} className="p-4 rounded-2xl bg-[#0d1629] border border-slate-800 hover:border-blue-500/40 transition-all space-y-2.5">
                                                <div className="flex items-start justify-between gap-2">
                                                    <div className="flex items-center space-x-3">
                                                        <div className="w-9 h-9 rounded-xl bg-blue-500/20 text-blue-300 font-semibold flex items-center justify-center text-xs shrink-0 border border-blue-500/30">
                                                            {profile.initials}
                                                        </div>
                                                        <div>
                                                            <div className="text-xs sm:text-sm font-semibold text-white">{profile.name}</div>
                                                            <div className="text-xs text-slate-300 font-medium">
                                                                {profile.role} • <span className="font-medium text-white">{profile.company}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="px-2 py-0.5 rounded-lg text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shrink-0">
                                                        {profile.package}
                                                    </div>
                                                </div>

                                                <p className="text-xs text-slate-300 italic bg-slate-950/50 p-2.5 rounded-xl border border-slate-800/80 leading-relaxed">
                                                    "{profile.quote}"
                                                </p>

                                                <div className="flex items-center justify-between pt-1 text-[11px] text-slate-400">
                                                    <span className="truncate">{profile.college}</span>
                                                    <div className="flex gap-1 shrink-0">
                                                        {profile.skills?.map((sk, sIdx) => (
                                                            <span key={sIdx} className="px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-300 font-mono text-[10px] border border-blue-500/20">
                                                                {sk}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* =========================================================
                            STRUCTURE 3: TESTIMONIALS (Executive Stakeholder Boardroom)
                           ========================================================= */}
                        {isPlatformTestimonials && cardData.sectionsData && activeAudienceData && (
                            <div className="space-y-6">
                                {/* Segmented Stakeholder Switcher */}
                                <div className="p-1 sm:p-1.5 bg-[#0e172a] rounded-xl sm:rounded-2xl border border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-1 sm:gap-1.5">
                                    {[
                                        { id: 'deans', label: 'University Deans & TPOs', icon: Building2 },
                                        { id: 'recruiters', label: 'Corporate Talent Heads', icon: Briefcase },
                                        { id: 'students', label: 'Student Alumni & Parents', icon: Users }
                                    ].map((tab) => {
                                        const Icon = tab.icon;
                                        const isActive = activeAudienceView === tab.id;
                                        return (
                                            <button
                                                key={tab.id}
                                                onClick={() => setActiveAudienceView(tab.id)}
                                                className={`py-2 px-2.5 sm:px-3 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium flex items-center justify-center space-x-2 transition-all cursor-pointer ${
                                                    isActive 
                                                        ? 'bg-blue-600 text-white font-semibold shadow-lg shadow-blue-600/30 ring-1 ring-blue-400/40'
                                                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                                                }`}
                                            >
                                                <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                                                <span className="truncate">{tab.label}</span>
                                            </button>
                                        );
                                    })}
                                </div>

                                {/* Active Stakeholder Testimonial Showcase */}
                                <div className="p-3.5 sm:p-6 rounded-xl sm:rounded-2xl bg-[#0d1629] border border-slate-800 space-y-4">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
                                        <div>
                                            <h3 className="text-sm sm:text-base font-semibold text-white">
                                                {activeAudienceData.label}
                                            </h3>
                                            <p className="text-xs text-slate-300 mt-0.5">
                                                {activeAudienceData.subtitle}
                                            </p>
                                        </div>
                                        <div className="flex items-center space-x-1 text-amber-400">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                                            ))}
                                            <span className="text-xs font-semibold text-white ml-1.5 font-mono">5.0 / 5.0</span>
                                        </div>
                                    </div>

                                    {/* Testimonial Cards */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                                        {activeAudienceData.testimonials?.map((t, idx) => (
                                            <div key={idx} className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col justify-between space-y-3">
                                                <div>
                                                    <div className="flex justify-between items-center mb-2">
                                                        <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-blue-500/20 text-blue-300 border border-blue-500/30">
                                                            {t.verifiedBadge}
                                                        </span>
                                                        <div className="flex gap-0.5 text-amber-400">
                                                            {[...Array(t.rating)].map((_, r) => (
                                                                <Star key={r} className="w-3 h-3 fill-amber-400" />
                                                            ))}
                                                        </div>
                                                    </div>
                                                    <p className="text-xs sm:text-sm text-slate-200 leading-relaxed italic">
                                                        "{t.quote}"
                                                    </p>
                                                </div>

                                                <div className="pt-3 border-t border-slate-800 flex items-center space-x-3">
                                                    <div className="w-9 h-9 rounded-xl bg-blue-600/30 text-blue-300 font-semibold flex items-center justify-center text-xs shrink-0 border border-blue-500/30">
                                                        {t.avatarInitials}
                                                    </div>
                                                    <div>
                                                        <div className="text-xs font-semibold text-white">{t.author}</div>
                                                        <div className="text-[11px] text-slate-400">{t.title}</div>
                                                        <div className="text-[11px] font-medium text-blue-300">{t.institution}</div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Stakeholder Metrics Bar */}
                                    <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-800">
                                        {activeAudienceData.metrics?.map((m, idx) => (
                                            <div key={idx} className="bg-slate-900/80 p-2.5 rounded-xl text-center border border-slate-800">
                                                <div className="text-xs sm:text-sm font-semibold text-white">{m.value}</div>
                                                <div className="text-[10px] text-slate-400 font-normal truncate">{m.label}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Trust Accreditations Badges Ticker */}
                                {cardData.trustBadges && (
                                    <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                                        {cardData.trustBadges.map((badge, idx) => (
                                            <span key={idx} className="px-3 py-1 rounded-full text-[11px] font-medium bg-[#0e172a] text-slate-300 border border-slate-800 flex items-center gap-1.5">
                                                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                                                {badge}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* =========================================================
                            STRUCTURE 4: MOCK INTERVIEWS (IDE Sandbox Monitor)
                           ========================================================= */}
                        {isInterview && (
                            <div className="space-y-4">
                                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                                    {/* Left Pane (5 Cols): Problem & Test Suite */}
                                    <div className="lg:col-span-5 space-y-3.5 flex flex-col justify-between">
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between">
                                                <span className="px-2.5 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider bg-red-500/20 text-red-400 border border-red-500/30">
                                                    Hard • Technical Screening Round
                                                </span>
                                                <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
                                                    <Timer className="w-3.5 h-3.5 text-amber-400" />
                                                    00:38:42 Left
                                                </span>
                                            </div>
                                            <h3 className="text-sm sm:text-base font-semibold text-white">Median of Two Sorted Arrays</h3>
                                            <p className="text-xs text-slate-300 leading-relaxed bg-[#0d1629] p-3 rounded-xl border border-slate-800">
                                                Given two sorted arrays nums1 and nums2 of size m and n respectively, return the median of the two sorted arrays. The overall run time complexity should be O(log (m+n)).
                                            </p>

                                            {/* Constraints box */}
                                            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1 text-xs font-mono text-slate-400">
                                                <div className="text-[10px] uppercase font-semibold text-slate-500">Execution Constraints</div>
                                                <div>• nums1.length == m, nums2.length == n</div>
                                                <div>• 0 &le; m &le; 1000, 0 &le; n &le; 1000</div>
                                                <div>• Memory Limit: &lt; 64 MB</div>
                                            </div>
                                        </div>

                                        {/* Test Suites */}
                                        <div className="space-y-2">
                                            <div className="text-xs font-semibold text-blue-400 uppercase tracking-wider">
                                                Automated Test Verification
                                            </div>
                                            <div className="p-3 rounded-xl bg-[#0d1629] border border-slate-800 space-y-2 text-xs">
                                                <div className="flex items-center justify-between text-[11px] text-emerald-400 font-mono">
                                                    <span className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5" /> Case 1: [1, 3], [2]</span>
                                                    <span className="text-slate-400 font-mono">Passed (14ms)</span>
                                                </div>
                                                <div className="flex items-center justify-between text-[11px] text-emerald-400 font-mono pt-1.5 border-t border-slate-800">
                                                    <span className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5" /> Case 2: [1, 2], [3, 4]</span>
                                                    <span className="text-slate-400 font-mono">Passed (18ms)</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right Pane (7 Cols): Monaco-style IDE Terminal */}
                                    <div className="lg:col-span-7 flex flex-col rounded-xl sm:rounded-2xl overflow-hidden border border-slate-800 bg-[#0d1117] shadow-xl min-w-0 w-full">
                                        {/* IDE Tab Header */}
                                        <div className="px-3 sm:px-4 py-2 sm:py-2.5 bg-[#161b22] border-b border-slate-800 flex items-center justify-between text-xs text-slate-400">
                                            <div className="flex items-center space-x-2">
                                                <Code2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                                                <span className="font-mono text-slate-200 text-xs font-medium">solution.ts</span>
                                                <span className="px-1.5 py-0.5 rounded text-[10px] bg-blue-500/20 text-blue-300 font-mono">TS 5.4</span>
                                                <span className="text-[10px] text-slate-500 font-mono hidden sm:inline">• git:(main)</span>
                                            </div>
                                            <button 
                                                onClick={() => { setIdeRunning(true); setTimeout(() => setIdeRunning(false), 500); }}
                                                className="px-2.5 py-1 sm:px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-semibold text-xs flex items-center space-x-1.5 shadow-md shadow-emerald-600/30 transition-all cursor-pointer"
                                            >
                                                <Play className="w-3 h-3 fill-white" />
                                                <span>{ideRunning ? 'Testing...' : 'Run Tests'}</span>
                                            </button>
                                        </div>

                                        {/* Editor Content */}
                                        <pre className="p-3 sm:p-4 text-xs font-mono overflow-x-auto text-emerald-300/90 leading-relaxed bg-[#0a0d14] flex-1 min-w-0 max-w-full overscroll-contain">
                                            {cardData.codeSnippet}
                                        </pre>

                                        {/* Console Output Footer */}
                                        <div className="p-2.5 sm:p-3 bg-[#0d121d] border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between text-xs font-mono gap-1.5 sm:gap-2">
                                            <div className="flex items-center space-x-2 text-emerald-400">
                                                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                                                <span>3/3 Hidden Test Cases Passed</span>
                                            </div>
                                            <div className="text-slate-400 text-[11px]">
                                                Runtime: 24ms (94.2% faster) • Memory: 41.2 MB
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* =========================================================
                            STRUCTURE 5: STUDENT ROSTER (Panoramic Widescreen Registry)
                           ========================================================= */}
                        {isRoster && (
                            <div className="space-y-3 sm:space-y-4">
                                {/* Search and Branch Filter Controls */}
                                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 sm:gap-3 p-2.5 sm:p-3 bg-[#0d1629] rounded-xl sm:rounded-2xl border border-slate-800">
                                    <div className="relative flex-1">
                                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                        <input 
                                            type="text" 
                                            value={rosterSearch}
                                            onChange={(e) => setRosterSearch(e.target.value)}
                                            placeholder="Search candidate name, roll no, or offer..."
                                            className="w-full pl-8 sm:pl-9 pr-3 py-2 bg-slate-900 border border-slate-800 rounded-lg sm:rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                                        />
                                    </div>
                                    <div className="flex gap-1 sm:gap-1.5 shrink-0 overflow-x-auto pb-0.5 sm:pb-0">
                                        {['all', 'CSE', 'IT', 'ECE'].map((branch) => (
                                            <button
                                                key={branch}
                                                onClick={() => setRosterBranch(branch)}
                                                className={`px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
                                                    rosterBranch === branch
                                                        ? 'bg-blue-600 text-white font-semibold shadow-md shadow-blue-600/30'
                                                        : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                                                }`}
                                            >
                                                {branch === 'all' ? 'All (1,480)' : branch}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Full Interactive Registry Table with Mobile Horizontal Scroll */}
                                <div className="space-y-1.5">
                                    <div className="sm:hidden flex items-center justify-between text-[11px] text-slate-400 px-1 font-mono">
                                        <span>← Scroll table horizontally →</span>
                                        <span className="text-blue-400 font-semibold">{filteredRoster.length} candidates</span>
                                    </div>
                                    <div className="rounded-xl sm:rounded-2xl border border-slate-800 overflow-x-auto bg-[#0d1629] overscroll-contain">
                                        <table className="w-full text-left text-xs min-w-[580px]">
                                            <thead className="bg-[#080d1a] border-b border-slate-800 text-slate-400 font-semibold">
                                                <tr>
                                                    <th className="p-3 pl-4">Candidate Name</th>
                                                    <th className="p-3">Roll No</th>
                                                    <th className="p-3">Branch</th>
                                                    <th className="p-3">Verified CGPA</th>
                                                    <th className="p-3">Drive Package / Status</th>
                                                    <th className="p-3 pr-4 text-right">Audit Status</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-800/80 font-medium text-slate-300">
                                                {filteredRoster.map((row, idx) => (
                                                    <tr key={idx} className="hover:bg-slate-900/60 transition-colors">
                                                        <td className="p-3 pl-4 font-semibold text-white flex items-center gap-2">
                                                            <span className="w-7 h-7 rounded-lg bg-blue-500/20 text-blue-300 font-semibold flex items-center justify-center text-[10px]">
                                                                {row.name.split(' ').map(n=>n[0]).join('')}
                                                            </span>
                                                            <span>{row.name}</span>
                                                        </td>
                                                        <td className="p-3 font-mono text-slate-400">{row.roll}</td>
                                                        <td className="p-3">
                                                            <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-800 text-slate-300 border border-slate-700">
                                                                {row.branch}
                                                            </span>
                                                        </td>
                                                        <td className="p-3">
                                                            <span className="font-semibold text-emerald-400">{row.cgpa}</span> / 10.0
                                                        </td>
                                                        <td className="p-3 font-semibold text-white font-mono">{row.offer || 'In Screening'}</td>
                                                        <td className="p-3 pr-4 text-right">
                                                            <span className={`px-2.5 py-1 rounded-md text-[11px] font-medium border ${row.statusColor || 'bg-slate-800 text-slate-300'}`}>
                                                                {row.status}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* =========================================================
                            STRUCTURE 6: OUR MISSION (Transformation Dossier)
                           ========================================================= */}
                        {isMission && cardData.transformationMatrix && (
                            <div className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* Broken Traditional Model */}
                                    <div className="p-5 rounded-2xl bg-gradient-to-b from-red-950/20 via-[#140b0d] to-[#0d090a] border border-red-500/30 space-y-4">
                                        <div className="flex items-center space-x-2 text-red-400 text-xs font-semibold uppercase tracking-wider">
                                            <AlertCircle className="w-4 h-4" />
                                            <span>{cardData.transformationMatrix.broken.title}</span>
                                        </div>
                                        <p className="text-xs text-red-200/80">
                                            {cardData.transformationMatrix.broken.subtitle}
                                        </p>
                                        <div className="space-y-3">
                                            {cardData.transformationMatrix.broken.points.map((pt, idx) => (
                                                <div key={idx} className="p-3 rounded-xl bg-black/40 border border-red-900/30 space-y-1">
                                                    <div className="text-xs font-semibold text-red-300 flex items-center gap-1.5">
                                                        <span>✕</span> {pt.title}
                                                    </div>
                                                    <p className="text-[11px] text-slate-400 leading-relaxed pl-4">{pt.desc}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* CareerSync Platform Solution */}
                                    <div className="p-5 rounded-2xl bg-gradient-to-b from-blue-950/30 via-[#0a1426] to-[#070e1c] border border-blue-500/40 shadow-lg shadow-blue-950/30 space-y-4">
                                        <div className="flex items-center space-x-2 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
                                            <CheckCircle2 className="w-4 h-4" />
                                            <span>{cardData.transformationMatrix.future.title}</span>
                                        </div>
                                        <p className="text-xs text-slate-300">
                                            {cardData.transformationMatrix.future.subtitle}
                                        </p>
                                        <div className="space-y-3">
                                            {cardData.transformationMatrix.future.points.map((pt, idx) => (
                                                <div key={idx} className="p-3 rounded-xl bg-slate-900/80 border border-blue-500/20 space-y-1">
                                                    <div className="text-xs font-semibold text-emerald-300 flex items-center gap-1.5">
                                                        <Check className="w-3.5 h-3.5 text-emerald-400" /> {pt.title}
                                                    </div>
                                                    <p className="text-[11px] text-slate-300 leading-relaxed pl-5">{pt.desc}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* =========================================================
                            STRUCTURE 7: EVENTS (VIP Ticket Pass & Timeline)
                           ========================================================= */}
                        {isEvent && (
                            <div className="space-y-5">
                                {/* Agenda Hour-by-Hour Timeline */}
                                {cardData.agenda ? (
                                    <div className="space-y-3">
                                        <div className="text-xs font-semibold text-blue-400 uppercase tracking-wider flex items-center justify-between">
                                            <span>Drive Schedule & Milestones</span>
                                            <span className="text-slate-400 font-normal text-[11px]">Indian Standard Time (IST)</span>
                                        </div>
                                        <div className="grid grid-cols-1 gap-2.5">
                                            {cardData.agenda.map((slot, idx) => (
                                                <div key={idx} className="p-3.5 rounded-xl bg-[#0d1629] border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:border-blue-500/30 transition-all">
                                                    <div className="flex items-start sm:items-center space-x-3">
                                                        <div className="px-2.5 py-1 rounded-lg bg-blue-500/10 text-blue-300 font-mono font-semibold text-xs shrink-0 border border-blue-500/20">
                                                            {slot.time}
                                                        </div>
                                                        <div>
                                                            <div className="text-xs font-semibold text-white">{slot.title}</div>
                                                            <div className="text-[11px] text-slate-400 mt-0.5">{slot.speaker}</div>
                                                        </div>
                                                    </div>
                                                    <div className="text-[11px] font-mono text-slate-400 bg-slate-900 px-2.5 py-1 rounded border border-slate-800 self-start sm:self-auto">
                                                        {slot.room}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ) : cardData.tracks ? (
                                    <div className="space-y-2.5">
                                        <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                            Participating Sectors & Tracks
                                        </div>
                                        <div className="grid grid-cols-1 gap-2.5">
                                            {cardData.tracks.map((track, idx) => (
                                                <div key={idx} className="p-3.5 rounded-xl bg-[#0d1629] border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                                    <div>
                                                        <div className="text-xs font-semibold text-white">{track.title}</div>
                                                        <div className="text-xs text-blue-300 font-mono mt-0.5">{track.tech}</div>
                                                    </div>
                                                    <span className="text-[11px] font-medium text-slate-400 bg-slate-900 px-2 py-1 rounded border border-slate-800">
                                                        Open Track
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ) : null}
                            </div>
                        )}

                        {/* =========================================================
                            STRUCTURE 8: MENTORSHIP (Appointment Booking Grid)
                           ========================================================= */}
                        {isMentor && cardData.featuredMentors && (
                            <div className="space-y-4">
                                <div className="text-xs font-semibold text-blue-400 uppercase tracking-wider flex items-center justify-between">
                                    <span>Verified Working Engineers • Select an Available Session Slot</span>
                                    <span className="text-emerald-400 text-[11px] font-mono">100% Free for Students</span>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                                    {cardData.featuredMentors.map((m, idx) => (
                                        <div key={idx} className="p-4 rounded-2xl bg-[#0d1629] border border-slate-800 hover:border-blue-500/40 transition-all flex flex-col justify-between space-y-3">
                                            <div className="space-y-2">
                                                <div className="flex items-center justify-between">
                                                    <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                                                        <Star className="w-3 h-3 fill-amber-400" />
                                                        {m.rating} ({m.reviews || 120})
                                                    </span>
                                                    <span className="text-[11px] text-slate-400 font-medium">{m.exp}</span>
                                                </div>

                                                <div className="text-xs sm:text-sm font-semibold text-white">{m.name}</div>
                                                <div className="text-xs font-medium text-blue-400">{m.role}</div>
                                                <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
                                                    {m.focus}
                                                </p>

                                                <div className="flex flex-wrap gap-1 pt-1">
                                                    {m.tags?.map((t, tIdx) => (
                                                        <span key={tIdx} className="px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-300 text-[10px] font-mono border border-blue-500/20">
                                                            {t}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Live Slot Picker */}
                                            <div className="pt-3 border-t border-slate-800 space-y-1.5">
                                                <div className="text-[11px] font-medium text-slate-400">Available Slots:</div>
                                                <div className="grid grid-cols-1 gap-1">
                                                    {m.slots?.map((s, sIdx) => {
                                                        const isSelected = selectedSlot === `${m.name}-${s}`;
                                                        return (
                                                            <button
                                                                key={sIdx}
                                                                onClick={() => setSelectedSlot(`${m.name}-${s}`)}
                                                                className={`px-2 py-1.5 rounded-lg text-[11px] font-mono flex items-center justify-between transition-all cursor-pointer ${
                                                                    isSelected
                                                                        ? 'bg-blue-600 text-white font-semibold shadow-md shadow-blue-600/30'
                                                                        : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
                                                                }`}
                                                            >
                                                                <span>{s}</span>
                                                                {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* =========================================================
                            STRUCTURE 9: TALENT SEARCH (ATS Query Console)
                           ========================================================= */}
                        {isTalentSearch && cardData.talentCandidates && (
                            <div className="space-y-4">
                                {/* Query Bar Simulator */}
                                <div className="p-3.5 bg-[#0d1629] rounded-2xl border border-slate-800 space-y-2">
                                    <div className="flex items-center justify-between text-xs text-slate-400">
                                        <span className="font-semibold text-blue-400 flex items-center gap-1.5"><Search className="w-3.5 h-3.5" /> Candidate Search & Filter Example</span>
                                        <span className="font-mono text-emerald-400 text-[11px]">140 Verified Matches</span>
                                    </div>
                                    <div className="flex flex-wrap gap-1.5 p-2 bg-slate-900 rounded-xl border border-slate-800 text-xs font-mono">
                                        <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">role: "Backend Engineer"</span>
                                        <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">skills: (Go, React, Docker)</span>
                                        <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">minCGPA: 8.5</span>
                                        <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">verifiedCollege: true</span>
                                    </div>
                                </div>

                                {/* Sourcing Candidate Cards */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                                    {cardData.talentCandidates.map((c, idx) => (
                                        <div key={idx} className="p-4 rounded-2xl bg-[#0d1629] border border-slate-800 hover:border-blue-500/40 transition-all space-y-2.5">
                                            <div className="flex items-start justify-between">
                                                <div>
                                                    <div className="text-xs sm:text-sm font-semibold text-white">{c.name}</div>
                                                    <div className="text-xs text-slate-400">{c.college}</div>
                                                </div>
                                                <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                                                    CGPA {c.cgpa}
                                                </span>
                                            </div>

                                            <div className="flex flex-wrap gap-1">
                                                {c.stack.map((s, sIdx) => (
                                                    <span key={sIdx} className="px-2 py-0.5 rounded bg-slate-900 text-blue-300 text-[10px] font-mono border border-slate-800">
                                                        {s}
                                                    </span>
                                                ))}
                                            </div>

                                            <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-[11px] font-mono text-slate-400">
                                                <span>{c.githubRank}</span>
                                                <span className="text-amber-400">{c.leetcode}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* =========================================================
                            STRUCTURE 10: TEAM (Leadership Org Matrix)
                           ========================================================= */}
                        {isTeam && cardData.teamMembers && (
                            <div className="space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                                    {cardData.teamMembers.map((member, idx) => (
                                        <div key={idx} className="p-4 rounded-2xl bg-[#0d1629] border border-slate-800 hover:border-blue-500/30 transition-all space-y-2">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center space-x-3">
                                                    <div className="w-10 h-10 rounded-xl bg-blue-600/20 text-blue-300 font-semibold flex items-center justify-center text-xs border border-blue-500/30">
                                                        {member.avatar}
                                                    </div>
                                                    <div>
                                                        <div className="text-xs sm:text-sm font-semibold text-white">{member.name}</div>
                                                        <div className="text-xs font-medium text-blue-400">{member.role}</div>
                                                    </div>
                                                </div>
                                                <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-800 text-slate-300 border border-slate-700">
                                                    {member.badge}
                                                </span>
                                            </div>
                                            <div className="text-[11px] font-mono text-emerald-400">{member.pedigree}</div>
                                            <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
                                                {member.focus}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Fallback for other standard cards */}
                        {!isPlatformFeatures && !isPlatformSuccess && !isPlatformTestimonials && !isInterview && !isRoster && !isMission && !isEvent && !isMentor && !isTalentSearch && !isTeam && cardData.featurePillars && (
                            <div className="space-y-3">
                                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                    Core System Capabilities
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                                    {cardData.featurePillars.map((p, idx) => (
                                        <div key={idx} className="p-4 rounded-2xl bg-[#0d1629] border border-slate-800 space-y-1.5">
                                            <div className="flex items-center justify-between">
                                                <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-blue-500/20 text-blue-300 border border-blue-500/30">
                                                    {p.tag}
                                                </span>
                                                <span className="text-[11px] font-mono font-medium text-emerald-400">
                                                    {p.metric}
                                                </span>
                                            </div>
                                            <div className="text-xs font-semibold text-white">{p.title}</div>
                                            <p className="text-xs text-slate-300 leading-relaxed">{p.desc}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* -------------------------------------------------------------
                        4. BESPOKE FOOTER ACTION BAR
                       ------------------------------------------------------------- */}
                    {isEvent ? (
                        /* VIP Ticket Pass Footer with Barcode */
                        <div className="p-3 sm:p-4 px-4 sm:px-6 border-t border-dashed border-slate-700/80 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-[#050811]">
                            <div className="flex items-center justify-between sm:justify-start space-x-3 w-full sm:w-auto">
                                {/* Barcode Graphic */}
                                <div className="h-7 sm:h-8 flex items-center space-x-0.5 opacity-70 shrink-0">
                                    {[4, 2, 6, 3, 5, 2, 8, 3, 6, 2, 4, 3, 7, 2, 5, 3, 6, 2, 4, 3, 5, 2].map((w, i) => (
                                        <div key={i} className="bg-slate-300 h-full" style={{ width: `${(w % 3) + 1.5}px` }}></div>
                                    ))}
                                </div>
                                <div className="text-[10px] font-mono text-slate-500 text-right sm:text-left">
                                    <div>PASS: #CS-PASS-2026</div>
                                    <div className="text-emerald-400 font-semibold">100% Free Campus Access</div>
                                </div>
                            </div>

                            <div className="flex items-center space-x-2 w-full sm:w-auto">
                                <Link
                                    to={cardData.primaryBtn?.link || '/jobs'}
                                    onClick={onClose}
                                    className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 active:scale-95 text-white font-semibold text-xs flex items-center justify-center space-x-1.5 shadow-lg shadow-blue-600/30 transition-all cursor-pointer"
                                >
                                    <span>{cardData.primaryBtn?.label || 'Download Pass'}</span>
                                    <ArrowRight className="w-3.5 h-3.5" />
                                </Link>
                                <button
                                    onClick={onClose}
                                    className="px-3 py-2.5 rounded-xl text-xs font-medium text-slate-400 hover:text-white transition-colors cursor-pointer"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    ) : (
                        /* Standard Action Bar */
                        <div className="p-3 sm:p-4 px-4 sm:px-8 border-t flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 sm:gap-3 bg-[#060a14] border-slate-800">
                            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-2.5 w-full sm:w-auto">
                                {/* Dynamic Primary Button */}
                                {isPlatformFeatures && activeRoleData?.primaryBtn ? (
                                    <Link
                                        to={activeRoleData.primaryBtn.link}
                                        onClick={onClose}
                                        className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 active:scale-95 text-white font-semibold text-xs flex items-center justify-center space-x-2 shadow-lg shadow-blue-600/30 transition-all cursor-pointer"
                                    >
                                        <span>{activeRoleData.primaryBtn.label}</span>
                                        <ArrowRight className="w-3.5 h-3.5" />
                                    </Link>
                                ) : isPlatformSuccess ? (
                                    <Link
                                        to={cardData.primaryBtn?.link || '/skill-gap'}
                                        onClick={onClose}
                                        className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 active:scale-95 text-white font-semibold text-xs flex items-center justify-center space-x-2 shadow-lg shadow-blue-600/30 transition-all cursor-pointer"
                                    >
                                        <span>{cardData.primaryBtn?.label || 'Start Skill Diagnostic'}</span>
                                        <ArrowRight className="w-3.5 h-3.5" />
                                    </Link>
                                ) : isPlatformTestimonials && activeAudienceData?.primaryBtn ? (
                                    <Link
                                        to={activeAudienceData.primaryBtn.link}
                                        onClick={onClose}
                                        className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 active:scale-95 text-white font-semibold text-xs flex items-center justify-center space-x-2 shadow-lg shadow-blue-600/30 transition-all cursor-pointer"
                                    >
                                        <span>{activeAudienceData.primaryBtn.label}</span>
                                        <ArrowRight className="w-3.5 h-3.5" />
                                    </Link>
                                ) : cardData.primaryBtn ? (
                                    <Link
                                        to={cardData.primaryBtn.link}
                                        onClick={onClose}
                                        className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-semibold text-xs flex items-center justify-center space-x-2 shadow-md shadow-blue-500/20 transition-all cursor-pointer"
                                    >
                                        <span>{cardData.primaryBtn.label}</span>
                                        <ArrowRight className="w-3.5 h-3.5" />
                                    </Link>
                                ) : null}

                                {/* Secondary Button */}
                                {cardData.secondaryBtn && (
                                    <Link
                                        to={cardData.secondaryBtn.link}
                                        onClick={onClose}
                                        className="w-full sm:w-auto px-4 py-2.5 rounded-xl font-semibold text-xs flex items-center justify-center space-x-1.5 transition-all cursor-pointer border bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-700"
                                    >
                                        <span>{cardData.secondaryBtn.label}</span>
                                        <ExternalLink className="w-3 h-3 text-slate-400" />
                                    </Link>
                                )}
                            </div>

                            <button
                                onClick={onClose}
                                className="text-xs font-medium py-1.5 px-3 cursor-pointer transition-colors text-slate-400 hover:text-slate-200 text-center sm:text-right"
                            >
                                Close Preview
                            </button>
                        </div>
                    )}
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default NavShowcaseModal;
