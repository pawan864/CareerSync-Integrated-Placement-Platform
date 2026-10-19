import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { 
    MessageSquare, 
    Send, 
    CheckCircle2, 
    AlertCircle, 
    GraduationCap, 
    Handshake, 
    Briefcase, 
    HelpCircle, 
    Phone, 
    Mail, 
    Clock, 
    ShieldCheck, 
    Sparkles, 
    ChevronDown, 
    Search,
    Building2,
    Calendar,
    ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Support = ({ defaultType }) => {
    const location = useLocation();
    
    // Parse query parameter or prop
    const getInitialTab = () => {
        const params = new URLSearchParams(location.search);
        const type = params.get('type') || defaultType;
        if (type === 'partnerships') return 'partnerships';
        if (type === 'sales') return 'sales';
        if (type === 'faq') return 'faq';
        return 'helpdesk';
    };

    const [activeTab, setActiveTab] = useState(getInitialTab);

    // Sync with query param updates
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const type = params.get('type') || defaultType;
        if (type) {
            setActiveTab(type);
        }
    }, [location.search, defaultType]);

    // -------------------------------------------------------------------------
    // FORM 1: TECHNICAL SUPPORT HELPDESK
    // -------------------------------------------------------------------------
    const [helpdeskData, setHelpdeskData] = useState({
        name: '',
        email: '',
        role: 'student',
        category: 'login',
        description: ''
    });
    const [helpdeskStatus, setHelpdeskStatus] = useState('idle');

    const handleHelpdeskSubmit = (e) => {
        e.preventDefault();
        setHelpdeskStatus('submitting');
        setTimeout(() => {
            setHelpdeskStatus('success');
            setHelpdeskData({ name: '', email: '', role: 'student', category: 'login', description: '' });
        }, 1200);
    };

    // -------------------------------------------------------------------------
    // FORM 2: PARTNERSHIP INQUIRIES
    // -------------------------------------------------------------------------
    const [partnerData, setPartnerData] = useState({
        orgName: '',
        contactName: '',
        email: '',
        phone: '',
        type: 'university',
        studentCount: '1000-5000',
        proposal: ''
    });
    const [partnerStatus, setPartnerStatus] = useState('idle');

    const handlePartnerSubmit = (e) => {
        e.preventDefault();
        setPartnerStatus('submitting');
        setTimeout(() => {
            setPartnerStatus('success');
            setPartnerData({ orgName: '', contactName: '', email: '', phone: '', type: 'university', studentCount: '1000-5000', proposal: '' });
        }, 1200);
    };

    // -------------------------------------------------------------------------
    // FORM 3: ENTERPRISE SALES & DEMO
    // -------------------------------------------------------------------------
    const [salesData, setSalesData] = useState({
        fullName: '',
        workEmail: '',
        companyOrCollege: '',
        phone: '',
        planInterested: 'campus-pro',
        preferredTime: 'morning'
    });
    const [salesStatus, setSalesStatus] = useState('idle');

    const handleSalesSubmit = (e) => {
        e.preventDefault();
        setSalesStatus('submitting');
        setTimeout(() => {
            setSalesStatus('success');
            setSalesData({ fullName: '', workEmail: '', companyOrCollege: '', phone: '', planInterested: 'campus-pro', preferredTime: 'morning' });
        }, 1200);
    };

    // -------------------------------------------------------------------------
    // TAB 4: FAQ SEARCH & ACCORDION
    // -------------------------------------------------------------------------
    const [faqCategory, setFaqCategory] = useState('all');
    const [faqSearch, setFaqSearch] = useState('');
    const [openFaqIndex, setOpenFaqIndex] = useState(null);

    const faqList = [
        {
            category: 'students',
            q: 'Is CareerSync free for students to use?',
            a: 'Yes, CareerSync is 100% free for all students. You can create an AI-optimized profile, upload and parse your resume, access skill gap diagnostic analytics, and apply for campus and national drives without any charges.'
        },
        {
            category: 'students',
            q: 'How does the AI Skill Matching algorithm work?',
            a: 'Our intelligent matching engine extracts core technical skills, projects, and coursework from your resume and benchmarks them against real-time job descriptions from active recruiters. It computes an match percentage and provides targeted learning modules to close gaps.'
        },
        {
            category: 'institutions',
            q: 'How do Training & Placement Officers (TPOs) manage campus drives?',
            a: 'TPOs receive an integrated Institution Portal where they can bulk import student batches, verify eligibility criteria, broadcast drive notifications, conduct test rounds, and download NAAC/NIRF-ready placement audit reports in one click.'
        },
        {
            category: 'institutions',
            q: 'Can colleges export placement reports for NAAC and NIRF accreditations?',
            a: 'Absolutely. CareerSync generates standardized, pre-formatted PDF and Excel dossiers detailing median CTC, highest package, department-wise placement percentages, and company footfall ready for accreditation submission.'
        },
        {
            category: 'employers',
            q: 'How do recruiters verify student transcripts and achievements?',
            a: 'All student GPAs and degree credentials on CareerSync are directly validated by university placement departments. Each profile features a verified tamper-proof credential badge and verified GitHub/portfolio links.'
        },
        {
            category: 'employers',
            q: 'Can employers schedule multi-stage interviews directly through CareerSync?',
            a: 'Yes! Recruiters can filter candidates by tech stack, trigger automated coding assessments, schedule technical video interviews, and release digital offer letters seamlessly from the Employer Dashboard.'
        },
        {
            category: 'security',
            q: 'How is student and university data protected?',
            a: 'CareerSync employs 256-bit AES encryption at rest and TLS 1.3 in transit. We strictly adhere to data residency standards and never sell candidate data to third-party marketing brokers.'
        },
        {
            category: 'technical',
            q: 'What should I do if I cannot log into my account or didn\'t receive OTP?',
            a: 'Please use the Support Helpdesk form on this page or our password recovery flow. Our automated system handles OTP delivery via verified email and SMS gateways within 30 seconds.'
        }
    ];

    const filteredFaqs = faqList.filter(item => {
        const matchesCategory = faqCategory === 'all' || item.category === faqCategory;
        const matchesSearch = item.q.toLowerCase().includes(faqSearch.toLowerCase()) || item.a.toLowerCase().includes(faqSearch.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <div className="min-h-screen bg-slate-50 text-gray-900 pt-20 md:pt-24 pb-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                {/* Header Banner */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-bold uppercase tracking-wider mb-3">
                        <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                        <span>Central Communications & Assistance Hub</span>
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900 sm:leading-none">
                        How Can We <span className="text-blue-600">Help You Today?</span>
                    </h1>
                    <p className="mt-3 text-base text-gray-500 max-w-2xl mx-auto">
                        Whether you need immediate technical help, wish to partner with our campus placement network, or want to explore enterprise solutions, we are here for you.
                    </p>
                </div>

                {/* 4 Interactive Section Tabs */}
                <div className="flex flex-wrap justify-center gap-2 mb-10 bg-white p-2 rounded-2xl shadow-sm border border-gray-200/80 max-w-3xl mx-auto">
                    <button
                        onClick={() => setActiveTab('helpdesk')}
                        className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                            activeTab === 'helpdesk'
                                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
                                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                        }`}
                    >
                        <MessageSquare className="w-4 h-4" />
                        <span>Support Helpdesk</span>
                    </button>

                    <button
                        onClick={() => setActiveTab('partnerships')}
                        className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                            activeTab === 'partnerships'
                                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
                                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                        }`}
                    >
                        <Handshake className="w-4 h-4" />
                        <span>Partnerships & MoUs</span>
                    </button>

                    <button
                        onClick={() => setActiveTab('sales')}
                        className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                            activeTab === 'sales'
                                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
                                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                        }`}
                    >
                        <Briefcase className="w-4 h-4" />
                        <span>Enterprise Sales & Demo</span>
                    </button>

                    <button
                        onClick={() => setActiveTab('faq')}
                        className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                            activeTab === 'faq'
                                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
                                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                        }`}
                    >
                        <HelpCircle className="w-4 h-4" />
                        <span>Frequently Asked Questions</span>
                    </button>
                </div>

                {/* =============================================================
                    TAB 1: SUPPORT HELPDESK
                   ============================================================= */}
                {activeTab === 'helpdesk' && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="grid grid-cols-1 lg:grid-cols-3 gap-8"
                    >
                        {/* Left 2 Columns: Ticket Form */}
                        <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-200/80">
                            <div className="flex items-center space-x-3 mb-6">
                                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                                    <MessageSquare className="w-5 h-5" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900">Submit a Technical Support Ticket</h2>
                                    <p className="text-xs text-gray-500">Our engineering support team replies within an average of 4 business hours.</p>
                                </div>
                            </div>

                            {helpdeskStatus === 'success' ? (
                                <div className="text-center py-12 px-4">
                                    <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
                                        <CheckCircle2 className="w-8 h-8" />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">Support Ticket Successfully Raised!</h3>
                                    <p className="text-sm text-gray-600 max-w-md mx-auto mb-6">
                                        Your ticket has been assigned to a senior technical support engineer. You will receive progress updates and resolution directly at your email.
                                    </p>
                                    <button
                                        onClick={() => setHelpdeskStatus('idle')}
                                        className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-md shadow-blue-500/25 transition-all cursor-pointer"
                                    >
                                        Submit Another Inquiry
                                    </button>
                                </div>
                            ) : (
                                <form onSubmit={handleHelpdeskSubmit} className="space-y-4">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wider">Full Name</label>
                                            <input
                                                type="text"
                                                required
                                                placeholder="e.g. Rahul Sharma"
                                                value={helpdeskData.name}
                                                onChange={(e) => setHelpdeskData({ ...helpdeskData, name: e.target.value })}
                                                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all bg-gray-50/50"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wider">Email Address</label>
                                            <input
                                                type="email"
                                                required
                                                placeholder="rahul@example.com"
                                                value={helpdeskData.email}
                                                onChange={(e) => setHelpdeskData({ ...helpdeskData, email: e.target.value })}
                                                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all bg-gray-50/50"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wider">Your Platform Role</label>
                                            <select
                                                value={helpdeskData.role}
                                                onChange={(e) => setHelpdeskData({ ...helpdeskData, role: e.target.value })}
                                                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all bg-gray-50/50"
                                            >
                                                <option value="student">Student / Candidate</option>
                                                <option value="faculty">Faculty Member</option>
                                                <option value="tpo">Training & Placement Officer (TPO)</option>
                                                <option value="recruiter">Corporate Recruiter</option>
                                                <option value="other">Other Inquirer</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wider">Issue Category</label>
                                            <select
                                                value={helpdeskData.category}
                                                onChange={(e) => setHelpdeskData({ ...helpdeskData, category: e.target.value })}
                                                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all bg-gray-50/50"
                                            >
                                                <option value="login">Login & Authentication</option>
                                                <option value="registration">Registration & Verification</option>
                                                <option value="skill-gap">AI Skill Gap Engine</option>
                                                <option value="job-board">Job Applications & Test Links</option>
                                                <option value="tpo-roster">TPO Roster / Portal Sync</option>
                                                <option value="bug">Technical Bug / Glitch</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wider">Describe the Problem in Detail</label>
                                        <textarea
                                            rows="4"
                                            required
                                            placeholder="Please describe what happened, steps to reproduce, or any error message you encountered..."
                                            value={helpdeskData.description}
                                            onChange={(e) => setHelpdeskData({ ...helpdeskData, description: e.target.value })}
                                            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all bg-gray-50/50 resize-none"
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={helpdeskStatus === 'submitting'}
                                        className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-98 text-white font-semibold text-sm flex items-center justify-center space-x-2 shadow-md shadow-blue-500/25 transition-all cursor-pointer disabled:opacity-50"
                                    >
                                        <Send className="w-4 h-4" />
                                        <span>{helpdeskStatus === 'submitting' ? 'Submitting Ticket...' : 'Dispatch Ticket to Support'}</span>
                                    </button>
                                </form>
                            )}
                        </div>

                        {/* Right Column: Contact Channels & Live Status */}
                        <div className="space-y-6">
                            {/* Live System Status Card */}
                            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-200/80">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-sm font-bold text-gray-900">Platform Systems Status</h3>
                                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                        All Systems Operational
                                    </span>
                                </div>
                                <div className="space-y-2.5 text-xs">
                                    <div className="flex justify-between items-center py-1.5 border-b border-gray-100">
                                        <span className="text-gray-600">Authentication & SSO</span>
                                        <span className="text-emerald-600 font-semibold">100% Uptime</span>
                                    </div>
                                    <div className="flex justify-between items-center py-1.5 border-b border-gray-100">
                                        <span className="text-gray-600">AI Skill Diagnostic Engine</span>
                                        <span className="text-emerald-600 font-semibold">Operational (120ms)</span>
                                    </div>
                                    <div className="flex justify-between items-center py-1.5 border-b border-gray-100">
                                        <span className="text-gray-600">TPO Portal & Drive Broadcasts</span>
                                        <span className="text-emerald-600 font-semibold">Operational</span>
                                    </div>
                                    <div className="flex justify-between items-center py-1.5">
                                        <span className="text-gray-600">Recruiter ATS & Video API</span>
                                        <span className="text-emerald-600 font-semibold">Operational</span>
                                    </div>
                                </div>
                            </div>

                            {/* Direct Support Points */}
                            <div className="bg-gradient-to-br from-slate-900 to-blue-950 text-white rounded-3xl p-6 shadow-sm">
                                <h3 className="text-base font-bold mb-4 flex items-center space-x-2">
                                    <Phone className="w-4 h-4 text-blue-400" />
                                    <span>Direct Contact Channels</span>
                                </h3>
                                <div className="space-y-4 text-xs text-slate-300">
                                    <div className="flex items-start space-x-3">
                                        <Mail className="w-4 h-4 text-blue-400 mt-0.5 shrink-0" />
                                        <div>
                                            <div className="text-white font-semibold">Email Technical Desk</div>
                                            <div className="text-blue-300 font-mono mt-0.5">support@careersync.com</div>
                                        </div>
                                    </div>
                                    <div className="flex items-start space-x-3">
                                        <Phone className="w-4 h-4 text-blue-400 mt-0.5 shrink-0" />
                                        <div>
                                            <div className="text-white font-semibold">National Support Helpline</div>
                                            <div className="text-blue-300 font-mono mt-0.5">+91 (0) 120-456-7890</div>
                                        </div>
                                    </div>
                                    <div className="flex items-start space-x-3">
                                        <Clock className="w-4 h-4 text-blue-400 mt-0.5 shrink-0" />
                                        <div>
                                            <div className="text-white font-semibold">Live Operational Hours</div>
                                            <div className="mt-0.5 text-slate-400">Monday to Saturday: 9:00 AM – 7:00 PM IST</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* =============================================================
                    TAB 2: PARTNERSHIPS & COLLABORATIONS
                   ============================================================= */}
                {activeTab === 'partnerships' && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-8"
                    >
                        {/* Partnership Value Proposition Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-white p-6 rounded-3xl border border-gray-200/80 shadow-sm">
                                <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
                                    <GraduationCap className="w-5 h-5" />
                                </div>
                                <h3 className="text-base font-bold text-gray-900 mb-2">For Colleges & Universities</h3>
                                <p className="text-xs text-gray-500 leading-relaxed">
                                    Sign an official institutional MoU to equip your campus TPO cell with zero-cost placement automation, NIRF accreditation exports, and nationwide recruiter drives.
                                </p>
                            </div>

                            <div className="bg-white p-6 rounded-3xl border border-gray-200/80 shadow-sm">
                                <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4">
                                    <Building2 className="w-5 h-5" />
                                </div>
                                <h3 className="text-base font-bold text-gray-900 mb-2">For Corporate Hiring Partners</h3>
                                <p className="text-xs text-gray-500 leading-relaxed">
                                    Partner with CareerSync to establish preferred campus hiring pipelines, co-branded hackathons, and early-access internship conclaves across 24 states.
                                </p>
                            </div>

                            <div className="bg-white p-6 rounded-3xl border border-gray-200/80 shadow-sm">
                                <div className="w-10 h-10 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center mb-4">
                                    <Handshake className="w-5 h-5" />
                                </div>
                                <h3 className="text-base font-bold text-gray-900 mb-2">For EdTech & Skill Providers</h3>
                                <p className="text-xs text-gray-500 leading-relaxed">
                                    Integrate your specialized certifications and coding courses into our AI Skill Gap engine to recommend your curriculums directly to students in need.
                                </p>
                            </div>
                        </div>

                        {/* Partnership Proposal Submission Form */}
                        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-200/80 max-w-3xl mx-auto">
                            <div className="text-center mb-6">
                                <h2 className="text-xl font-bold text-gray-900">Initiate an Institutional or Corporate Collaboration</h2>
                                <p className="text-xs text-gray-500 mt-1">Submit your partnership proposal and our University Relations Director will contact you within 24 hours.</p>
                            </div>

                            {partnerStatus === 'success' ? (
                                <div className="text-center py-10 px-4">
                                    <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-3">
                                        <CheckCircle2 className="w-7 h-7" />
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-1">Partnership Proposal Received!</h3>
                                    <p className="text-xs text-gray-600 max-w-md mx-auto mb-5">
                                        Thank you for your interest in collaborating with CareerSync. Our Institutional Partnership desk has logged your request and will schedule a formal introductory call.
                                    </p>
                                    <button
                                        onClick={() => setPartnerStatus('idle')}
                                        className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-md transition-all cursor-pointer"
                                    >
                                        Submit Another Proposal
                                    </button>
                                </div>
                            ) : (
                                <form onSubmit={handlePartnerSubmit} className="space-y-4">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wider">Institution / Organization Name</label>
                                            <input
                                                type="text"
                                                required
                                                placeholder="e.g. National Institute of Technology"
                                                value={partnerData.orgName}
                                                onChange={(e) => setPartnerData({ ...partnerData, orgName: e.target.value })}
                                                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-blue-600 transition-all bg-gray-50/50"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wider">Contact Person Name</label>
                                            <input
                                                type="text"
                                                required
                                                placeholder="e.g. Dr. A. K. Sharma (Dean/TPO)"
                                                value={partnerData.contactName}
                                                onChange={(e) => setPartnerData({ ...partnerData, contactName: e.target.value })}
                                                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-blue-600 transition-all bg-gray-50/50"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wider">Official Email Address</label>
                                            <input
                                                type="email"
                                                required
                                                placeholder="tpo@university.edu.in"
                                                value={partnerData.email}
                                                onChange={(e) => setPartnerData({ ...partnerData, email: e.target.value })}
                                                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-blue-600 transition-all bg-gray-50/50"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wider">Phone / WhatsApp Number</label>
                                            <input
                                                type="tel"
                                                required
                                                placeholder="+91 98765 43210"
                                                value={partnerData.phone}
                                                onChange={(e) => setPartnerData({ ...partnerData, phone: e.target.value })}
                                                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-blue-600 transition-all bg-gray-50/50"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wider">Partnership Scope</label>
                                            <select
                                                value={partnerData.type}
                                                onChange={(e) => setPartnerData({ ...partnerData, type: e.target.value })}
                                                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-blue-600 transition-all bg-gray-50/50"
                                            >
                                                <option value="university">University Placement MoU</option>
                                                <option value="corporate">Corporate Recruitment Alliance</option>
                                                <option value="hackathon">Campus Hackathon Sponsorship</option>
                                                <option value="edtech">Skill Training Curriculum Integration</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wider">Annual Student / Hiring Volume</label>
                                            <select
                                                value={partnerData.studentCount}
                                                onChange={(e) => setPartnerData({ ...partnerData, studentCount: e.target.value })}
                                                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-blue-600 transition-all bg-gray-50/50"
                                            >
                                                <option value="under-1000">Under 1,000 Candidates</option>
                                                <option value="1000-5000">1,000 – 5,000 Candidates</option>
                                                <option value="5000-plus">5,000+ Candidates (Group Institution)</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wider">Proposed Collaboration Details</label>
                                        <textarea
                                            rows="3"
                                            required
                                            placeholder="Provide brief details on your institution's placement goals or recruitment requirements..."
                                            value={partnerData.proposal}
                                            onChange={(e) => setPartnerData({ ...partnerData, proposal: e.target.value })}
                                            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-blue-600 transition-all bg-gray-50/50 resize-none"
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={partnerStatus === 'submitting'}
                                        className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm flex items-center justify-center space-x-2 shadow-md shadow-blue-500/25 transition-all cursor-pointer disabled:opacity-50"
                                    >
                                        <Handshake className="w-4 h-4" />
                                        <span>{partnerStatus === 'submitting' ? 'Submitting Proposal...' : 'Submit Partnership Proposal'}</span>
                                    </button>
                                </form>
                            )}
                        </div>
                    </motion.div>
                )}

                {/* =============================================================
                    TAB 3: ENTERPRISE SALES & DEMO
                   ============================================================= */}
                {activeTab === 'sales' && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-8"
                    >
                        {/* Tier Comparison Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-sm flex flex-col justify-between">
                                <div>
                                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Standard Campus</span>
                                    <h3 className="text-xl font-bold text-gray-900 mt-1">University Starter</h3>
                                    <div className="text-3xl font-extrabold text-blue-600 my-3">Free <span className="text-xs font-normal text-gray-500">/ forever</span></div>
                                    <p className="text-xs text-gray-500 mb-4">Ideal for standalone technical colleges managing initial digital drives.</p>
                                    <ul className="space-y-2 text-xs text-gray-600">
                                        <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Up to 1,500 active students</li>
                                        <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> AI Resume Skill Mapping</li>
                                        <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Standard TPO Roster & Broadcasts</li>
                                    </ul>
                                </div>
                                <button
                                    onClick={() => setSalesData({ ...salesData, planInterested: 'starter' })}
                                    className="mt-6 w-full py-2.5 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 font-semibold text-xs cursor-pointer"
                                >
                                    Select Starter
                                </button>
                            </div>

                            <div className="bg-gradient-to-b from-blue-900 to-indigo-950 text-white rounded-3xl p-6 shadow-xl relative overflow-hidden flex flex-col justify-between">
                                <div className="absolute top-4 right-4 bg-amber-400 text-gray-900 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase">
                                    Most Popular
                                </div>
                                <div>
                                    <span className="text-xs font-bold text-blue-300 uppercase tracking-wider">Autonomous / Universities</span>
                                    <h3 className="text-xl font-bold text-white mt-1">Campus Pro Enterprise</h3>
                                    <div className="text-3xl font-extrabold text-white my-3">Custom <span className="text-xs font-normal text-blue-200">/ institutional grant</span></div>
                                    <p className="text-xs text-blue-200 mb-4">Complete end-to-end placement suite with NIRF compliance automation.</p>
                                    <ul className="space-y-2 text-xs text-slate-200">
                                        <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-amber-400" /> Unlimited student rosters</li>
                                        <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-amber-400" /> 1-Click NAAC & NIRF Report Generator</li>
                                        <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-amber-400" /> Tamper-Proof Credential Verification</li>
                                        <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-amber-400" /> Priority 24/7 Dedicated Account Manager</li>
                                    </ul>
                                </div>
                                <button
                                    onClick={() => setSalesData({ ...salesData, planInterested: 'campus-pro' })}
                                    className="mt-6 w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-lg shadow-blue-600/30 cursor-pointer"
                                >
                                    Request Pro Demo
                                </button>
                            </div>

                            <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-sm flex flex-col justify-between">
                                <div>
                                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Corporate Recruiters</span>
                                    <h3 className="text-xl font-bold text-gray-900 mt-1">Recruiter ATS Suite</h3>
                                    <div className="text-3xl font-extrabold text-gray-900 my-3">Tailored <span className="text-xs font-normal text-gray-500">/ hiring volume</span></div>
                                    <p className="text-xs text-gray-500 mb-4">Direct access to verified national talent with integrated video assessment.</p>
                                    <ul className="space-y-2 text-xs text-gray-600">
                                        <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Unlimited Verified Candidate Searches</li>
                                        <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Automated Code Execution Assessments</li>
                                        <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Digital Offer Letter Management</li>
                                    </ul>
                                </div>
                                <button
                                    onClick={() => setSalesData({ ...salesData, planInterested: 'recruiter-suite' })}
                                    className="mt-6 w-full py-2.5 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 font-semibold text-xs cursor-pointer"
                                >
                                    Contact Recruiter Sales
                                </button>
                            </div>
                        </div>

                        {/* Schedule Live Demo Form */}
                        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-200/80 max-w-3xl mx-auto">
                            <div className="text-center mb-6">
                                <h2 className="text-xl font-bold text-gray-900">Schedule a Live 30-Minute Product Walkthrough</h2>
                                <p className="text-xs text-gray-500 mt-1">Our enterprise product specialist will showcase real-time features tailored to your workflow.</p>
                            </div>

                            {salesStatus === 'success' ? (
                                <div className="text-center py-10 px-4">
                                    <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-3">
                                        <CheckCircle2 className="w-7 h-7" />
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-1">Live Demo Request Confirmed!</h3>
                                    <p className="text-xs text-gray-600 max-w-md mx-auto mb-5">
                                        We have received your demo request. A calendar invitation with video conference credentials has been dispatched to your work email.
                                    </p>
                                    <button
                                        onClick={() => setSalesStatus('idle')}
                                        className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-md transition-all cursor-pointer"
                                    >
                                        Schedule Another Session
                                    </button>
                                </div>
                            ) : (
                                <form onSubmit={handleSalesSubmit} className="space-y-4">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wider">Your Full Name</label>
                                            <input
                                                type="text"
                                                required
                                                placeholder="e.g. Vikramaditya Singh"
                                                value={salesData.fullName}
                                                onChange={(e) => setSalesData({ ...salesData, fullName: e.target.value })}
                                                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-blue-600 transition-all bg-gray-50/50"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wider">Corporate / Institutional Email</label>
                                            <input
                                                type="email"
                                                required
                                                placeholder="vikram@company.com"
                                                value={salesData.workEmail}
                                                onChange={(e) => setSalesData({ ...salesData, workEmail: e.target.value })}
                                                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-blue-600 transition-all bg-gray-50/50"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wider">Organization / University Name</label>
                                            <input
                                                type="text"
                                                required
                                                placeholder="e.g. TechCorp Systems"
                                                value={salesData.companyOrCollege}
                                                onChange={(e) => setSalesData({ ...salesData, companyOrCollege: e.target.value })}
                                                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-blue-600 transition-all bg-gray-50/50"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wider">Contact Phone Number</label>
                                            <input
                                                type="tel"
                                                required
                                                placeholder="+91 99887 76655"
                                                value={salesData.phone}
                                                onChange={(e) => setSalesData({ ...salesData, phone: e.target.value })}
                                                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-blue-600 transition-all bg-gray-50/50"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wider">Plan of Interest</label>
                                            <select
                                                value={salesData.planInterested}
                                                onChange={(e) => setSalesData({ ...salesData, planInterested: e.target.value })}
                                                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-blue-600 transition-all bg-gray-50/50"
                                            >
                                                <option value="campus-pro">Campus Pro Enterprise (University)</option>
                                                <option value="recruiter-suite">Recruiter ATS & Talent Search (Corporate)</option>
                                                <option value="starter">University Starter (Basic)</option>
                                                <option value="custom">Custom Multi-Campus Deployment</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wider">Preferred Demo Slot</label>
                                            <select
                                                value={salesData.preferredTime}
                                                onChange={(e) => setSalesData({ ...salesData, preferredTime: e.target.value })}
                                                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-blue-600 transition-all bg-gray-50/50"
                                            >
                                                <option value="morning">Morning (10:00 AM – 1:00 PM IST)</option>
                                                <option value="afternoon">Afternoon (2:00 PM – 5:00 PM IST)</option>
                                                <option value="evening">Evening (5:00 PM – 7:30 PM IST)</option>
                                            </select>
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={salesStatus === 'submitting'}
                                        className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm flex items-center justify-center space-x-2 shadow-md shadow-blue-500/25 transition-all cursor-pointer disabled:opacity-50"
                                    >
                                        <Calendar className="w-4 h-4" />
                                        <span>{salesStatus === 'submitting' ? 'Confirming Demo Slot...' : 'Confirm Live Demo Booking'}</span>
                                    </button>
                                </form>
                            )}
                        </div>
                    </motion.div>
                )}

                {/* =============================================================
                    TAB 4: FREQUENTLY ASKED QUESTIONS (FAQ)
                   ============================================================= */}
                {activeTab === 'faq' && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-6 max-w-4xl mx-auto"
                    >
                        {/* Search Bar & Filter Pills */}
                        <div className="bg-white p-4 rounded-3xl border border-gray-200/80 shadow-sm space-y-3">
                            <div className="relative">
                                <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                                <input
                                    type="text"
                                    placeholder="Search answers (e.g. AI skill match, NIRF reports, interview rounds)..."
                                    value={faqSearch}
                                    onChange={(e) => setFaqSearch(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-blue-600 transition-all bg-gray-50/50"
                                />
                            </div>

                            <div className="flex flex-wrap gap-2 pt-1">
                                {[
                                    { id: 'all', label: 'All Questions' },
                                    { id: 'students', label: 'Students' },
                                    { id: 'institutions', label: 'Colleges & TPOs' },
                                    { id: 'employers', label: 'Corporate Recruiters' },
                                    { id: 'security', label: 'Security & Privacy' },
                                    { id: 'technical', label: 'Technical Issues' }
                                ].map((cat) => (
                                    <button
                                        key={cat.id}
                                        onClick={() => setFaqCategory(cat.id)}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                                            faqCategory === cat.id
                                                ? 'bg-blue-600 text-white shadow-sm'
                                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                        }`}
                                    >
                                        {cat.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Accordion Items */}
                        <div className="space-y-3">
                            {filteredFaqs.length === 0 ? (
                                <div className="text-center py-12 bg-white rounded-3xl border border-gray-200/80 p-6">
                                    <HelpCircle className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                    <div className="text-sm font-bold text-gray-800">No matching questions found</div>
                                    <p className="text-xs text-gray-500 mt-1">Try refining your search keyword or submit a ticket on our Support Helpdesk.</p>
                                </div>
                            ) : (
                                filteredFaqs.map((faq, idx) => {
                                    const isOpen = openFaqIndex === idx;
                                    return (
                                        <div
                                            key={idx}
                                            className="bg-white rounded-2xl border border-gray-200/80 shadow-sm overflow-hidden transition-all"
                                        >
                                            <button
                                                onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                                                className="w-full p-4 sm:p-5 text-left flex items-center justify-between space-x-3 cursor-pointer hover:bg-gray-50/50 transition-colors"
                                            >
                                                <span className="text-sm font-bold text-gray-900">{faq.q}</span>
                                                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 shrink-0 ${isOpen ? 'rotate-180 text-blue-600' : ''}`} />
                                            </button>
                                            <AnimatePresence>
                                                {isOpen && (
                                                    <motion.div
                                                        initial={{ opacity: 0, height: 0 }}
                                                        animate={{ opacity: 1, height: 'auto' }}
                                                        exit={{ opacity: 0, height: 0 }}
                                                        className="px-4 sm:px-5 pb-4 sm:pb-5 text-xs sm:text-sm text-gray-600 leading-relaxed border-t border-gray-100 pt-3"
                                                    >
                                                        {faq.a}
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default Support;
