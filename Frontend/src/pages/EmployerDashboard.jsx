import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import { 
    Briefcase, GraduationCap, FolderGit2, BookOpen, Plus, 
    Search, Filter, Calendar, MapPin, DollarSign, Users, 
    CheckCircle2, Clock, AlertCircle, Eye, Edit3, Trash2, 
    RefreshCw, Layers, ShieldAlert, Sparkles, Building2, 
    ChevronRight, ArrowUpRight, Check, X, Award, BarChart3
} from 'lucide-react';
import OpportunityFormModal from '../components/recruiter/OpportunityFormModal';
import OpportunityDetailsModal from '../components/recruiter/OpportunityDetailsModal';

export default function EmployerDashboard() {
    const { logout, user } = useContext(AuthContext);

    // Data States
    const [opportunities, setOpportunities] = useState([]);
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [activeTab, setActiveTab] = useState('postings'); // 'postings' | 'applications'

    // Filtering & Search
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedType, setSelectedType] = useState('All');
    const [selectedStatus, setSelectedStatus] = useState('All');
    const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'table'

    // Modals
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingOpportunity, setEditingOpportunity] = useState(null);
    const [selectedDetailOpp, setSelectedDetailOpp] = useState(null);

    // Toast & Maintenance
    const [toastMessage, setToastMessage] = useState(null);
    const [maintenanceInfo, setMaintenanceInfo] = useState({ isMaintenance: false, message: '' });

    const showToast = (text, type = 'success') => {
        setToastMessage({ text, type });
        setTimeout(() => setToastMessage(null), 4000);
    };

    const fetchMaintenance = async () => {
        try {
            const res = await api.get('/admin/access-control/public/recruiter');
            if (res.data?.success && res.data.data) {
                setMaintenanceInfo({
                    isMaintenance: Boolean(res.data.data.isMaintenance),
                    message: res.data.data.maintenanceMessage || 'Recruiter portal is currently offline for scheduled maintenance.'
                });
            }
        } catch (e) {
            // fallback
        }
    };

    const fetchOpportunities = async () => {
        try {
            const res = await api.get('/opportunities/company/my-postings');
            if (res.data?.success) {
                setOpportunities(res.data.data);
            }
        } catch (error) {
            console.error('Error fetching company opportunities:', error);
        }
    };

    const fetchApplications = async () => {
        try {
            const res = await api.get('/opportunities/company/applications');
            if (res.data?.success) {
                setApplications(res.data.data);
            }
        } catch (error) {
            console.error('Error fetching applications:', error);
        }
    };

    const loadAllData = async () => {
        setRefreshing(true);
        await Promise.all([fetchOpportunities(), fetchApplications(), fetchMaintenance()]);
        setLoading(false);
        setRefreshing(false);
    };

    useEffect(() => {
        loadAllData();
    }, []);

    const handleDisableMaintenance = async () => {
        try {
            await api.put('/admin/access-control/role/recruiter', { isMaintenance: false });
            setMaintenanceInfo(prev => ({ ...prev, isMaintenance: false }));
            showToast('Maintenance mode disabled');
        } catch (err) {
            console.error('Error disabling maintenance mode:', err);
        }
    };

    // Quick Status Toggle
    const handleStatusChange = async (oppId, newStatus) => {
        try {
            const res = await api.patch(`/opportunities/${oppId}/status`, { status: newStatus });
            if (res.data?.success) {
                setOpportunities(prev => prev.map(o => o._id === oppId ? { ...o, status: newStatus } : o));
                if (selectedDetailOpp?._id === oppId) {
                    setSelectedDetailOpp(prev => ({ ...prev, status: newStatus }));
                }
                showToast(`Status updated to "${newStatus}"`);
            }
        } catch (err) {
            console.error('Status change error:', err);
            showToast(err.response?.data?.error || 'Failed to update status', 'error');
        }
    };

    // Delete Opportunity
    const handleDeleteOpportunity = async (oppId) => {
        try {
            const res = await api.delete(`/opportunities/${oppId}`);
            if (res.data?.success) {
                setOpportunities(prev => prev.filter(o => o._id !== oppId));
                showToast('Opportunity removed successfully');
            }
        } catch (err) {
            console.error('Delete opportunity error:', err);
            showToast(err.response?.data?.error || 'Failed to delete', 'error');
        }
    };

    // Filter Logic
    const filteredOpportunities = opportunities.filter(opp => {
        const matchesSearch = 
            opp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            opp.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            opp.department?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            opp.requiredSkills?.some(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()));

        const matchesType = selectedType === 'All' || opp.type === selectedType;
        const matchesStatus = selectedStatus === 'All' || opp.status === selectedStatus;

        return matchesSearch && matchesType && matchesStatus;
    });

    // Metrics Calculation
    const totalPostings = opportunities.length;
    const activeCount = opportunities.filter(o => o.status === 'Open').length;
    const pausedCount = opportunities.filter(o => o.status === 'Paused').length;
    const totalApplicants = opportunities.reduce((acc, curr) => acc + (curr.applicantCount || 0), 0);

    const getTypeColor = (type) => {
        switch (type) {
            case 'Placement':
                return { badge: 'bg-indigo-50 text-indigo-700 border-indigo-200', dot: 'bg-indigo-500', label: 'Job' };
            case 'Internship':
                return { badge: 'bg-emerald-50 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500', label: 'Internship' };
            case 'Project':
                return { badge: 'bg-purple-50 text-purple-700 border-purple-200', dot: 'bg-purple-500', label: 'Project' };
            case 'Training':
                return { badge: 'bg-amber-50 text-amber-700 border-amber-200', dot: 'bg-amber-500', label: 'Training' };
            default:
                return { badge: 'bg-gray-50 text-gray-700 border-gray-200', dot: 'bg-gray-500', label: type };
        }
    };

    if (maintenanceInfo.isMaintenance && user?.role !== 'admin') {
        return (
            <div className="min-h-screen w-full bg-[#0a0a0a] flex flex-col items-center justify-center p-6 text-center text-white relative overflow-hidden font-sans">
                <div className="max-w-md w-full bg-[#121212]/95 border border-amber-500/30 p-8 rounded-3xl shadow-2xl relative z-10 space-y-5 backdrop-blur-xl">
                    <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto text-amber-400">
                        <ShieldAlert className="w-8 h-8 animate-bounce" />
                    </div>
                    <div>
                        <span className="px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase bg-amber-500/15 text-amber-400 border border-amber-500/30 inline-block mb-3">
                            Scheduled Maintenance
                        </span>
                        <h2 className="text-2xl font-bold text-white tracking-tight">Recruiter Portal Offline</h2>
                        <p className="text-xs text-gray-300 mt-3 leading-relaxed bg-black/40 p-3.5 rounded-xl border border-gray-800">
                            {maintenanceInfo.message}
                        </p>
                    </div>
                    <div className="pt-2 flex flex-col gap-2.5">
                        <button
                            onClick={fetchMaintenance}
                            className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-black font-bold text-xs transition-all shadow-lg flex items-center justify-center space-x-2 cursor-pointer"
                        >
                            <RefreshCw className="w-3.5 h-3.5" />
                            <span>Check Status Again</span>
                        </button>
                        <button
                            onClick={logout}
                            className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 font-semibold text-xs border border-gray-800 transition-all cursor-pointer"
                        >
                            Sign Out
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50/60 pb-16 font-sans">
            {/* Maintenance Mode Top Notification Banner for Admin */}
            {maintenanceInfo.isMaintenance && (
                <div className="bg-amber-500 text-black font-semibold text-xs px-4 py-2 flex items-center justify-between z-50 shadow-md">
                    <div className="flex items-center space-x-2">
                        <ShieldAlert className="w-4 h-4 shrink-0" />
                        <span>MAINTENANCE MODE ACTIVE: Normal recruiters are blocked. (Admin bypass active)</span>
                    </div>
                    <button
                        onClick={handleDisableMaintenance}
                        className="px-3 py-1 bg-black text-white hover:bg-gray-800 rounded-lg text-xs font-bold transition-all cursor-pointer"
                    >
                        Disable Maintenance Now
                    </button>
                </div>
            )}

            {/* Floating Toast Notification */}
            {toastMessage && (
                <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 duration-200">
                    <div className={`px-4 py-3 rounded-xl shadow-xl flex items-center space-x-2.5 border text-xs font-semibold ${
                        toastMessage.type === 'error'
                            ? 'bg-rose-900/90 text-rose-100 border-rose-700 backdrop-blur-md'
                            : 'bg-emerald-900/90 text-emerald-100 border-emerald-700 backdrop-blur-md'
                    }`}>
                        {toastMessage.type === 'error' ? <AlertCircle className="w-4 h-4 text-rose-400" /> : <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                        <span>{toastMessage.text}</span>
                    </div>
                </div>
            )}

            {/* Dashboard Header Bar */}
            <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 text-white shadow-xl border-b border-indigo-900/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                            <div className="flex items-center space-x-2.5 mb-2">
                                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center">
                                    <Building2 className="w-3 h-3 mr-1" />
                                    Industry & Recruiter Portal
                                </span>
                                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                                    ● Live System
                                </span>
                            </div>
                            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                                {user?.name ? `${user.name} Workstation` : 'Employer Opportunity Hub'}
                            </h1>
                            <p className="text-xs sm:text-sm text-blue-200/80 mt-1 max-w-2xl">
                                Manage campus placement drives, student internships, industry capstones, and training programs with ATS skill matching.
                            </p>
                        </div>

                        {/* Top CTAs */}
                        <div className="flex items-center space-x-3">
                            <button
                                onClick={loadAllData}
                                disabled={refreshing}
                                className="p-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold border border-white/10 transition-all flex items-center space-x-1.5 cursor-pointer disabled:opacity-50"
                                title="Refresh all records"
                            >
                                <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                                <span className="hidden sm:inline">Refresh</span>
                            </button>

                            <button
                                onClick={() => {
                                    setEditingOpportunity(null);
                                    setIsFormOpen(true);
                                }}
                                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 text-white text-xs sm:text-sm font-bold shadow-lg shadow-indigo-600/30 active:scale-95 transition-all flex items-center space-x-2 cursor-pointer"
                            >
                                <Plus className="w-4 h-4" />
                                <span>Post New Opportunity</span>
                            </button>
                        </div>
                    </div>

                    {/* KPI Metrics Row */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-8">
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-md">
                            <div className="flex items-center justify-between text-blue-200/80 text-xs font-medium mb-1">
                                <span>Total Opportunities</span>
                                <Briefcase className="w-4 h-4 text-indigo-400" />
                            </div>
                            <div className="text-2xl font-extrabold text-white">{totalPostings}</div>
                            <div className="text-[10px] text-blue-300/70 mt-1">Across all tracks</div>
                        </div>

                        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-md">
                            <div className="flex items-center justify-between text-emerald-200/80 text-xs font-medium mb-1">
                                <span>Active & Open</span>
                                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                            </div>
                            <div className="text-2xl font-extrabold text-emerald-400">{activeCount}</div>
                            <div className="text-[10px] text-emerald-300/70 mt-1">Receiving applications</div>
                        </div>

                        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-md">
                            <div className="flex items-center justify-between text-amber-200/80 text-xs font-medium mb-1">
                                <span>Paused / In Review</span>
                                <Clock className="w-4 h-4 text-amber-400" />
                            </div>
                            <div className="text-2xl font-extrabold text-amber-400">{pausedCount}</div>
                            <div className="text-[10px] text-amber-300/70 mt-1">Applications halted</div>
                        </div>

                        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-md">
                            <div className="flex items-center justify-between text-purple-200/80 text-xs font-medium mb-1">
                                <span>Total Candidates</span>
                                <Users className="w-4 h-4 text-purple-400" />
                            </div>
                            <div className="text-2xl font-extrabold text-purple-300">{totalApplicants}</div>
                            <div className="text-[10px] text-purple-200/70 mt-1">Student submissions</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
                {/* Navigation Tabs */}
                <div className="flex items-center justify-between border-b border-gray-200 pb-3 mb-6">
                    <div className="flex items-center space-x-2">
                        <button
                            onClick={() => setActiveTab('postings')}
                            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 cursor-pointer ${
                                activeTab === 'postings'
                                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                            }`}
                        >
                            <Layers className="w-3.5 h-3.5" />
                            <span>My Opportunities ({totalPostings})</span>
                        </button>

                        <button
                            onClick={() => setActiveTab('applications')}
                            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 cursor-pointer ${
                                activeTab === 'applications'
                                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                            }`}
                        >
                            <Users className="w-3.5 h-3.5" />
                            <span>Applicant Pipeline ({applications.length})</span>
                        </button>
                    </div>

                    {/* View Switcher for postings */}
                    {activeTab === 'postings' && (
                        <div className="hidden sm:flex items-center space-x-1 bg-white p-1 rounded-xl border border-gray-200 text-xs font-medium">
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                                    viewMode === 'grid' ? 'bg-indigo-50 text-indigo-700 font-bold' : 'text-gray-500 hover:text-gray-900'
                                }`}
                            >
                                Grid Cards
                            </button>
                            <button
                                onClick={() => setViewMode('table')}
                                className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                                    viewMode === 'table' ? 'bg-indigo-50 text-indigo-700 font-bold' : 'text-gray-500 hover:text-gray-900'
                                }`}
                            >
                                Table View
                            </button>
                        </div>
                    )}
                </div>

                {/* POSTINGS TAB */}
                {activeTab === 'postings' && (
                    <div className="space-y-6">
                        {/* Search & Filters Toolbar */}
                        <div className="bg-white p-4 rounded-2xl shadow-xs border border-gray-200/80 flex flex-col md:flex-row md:items-center justify-between gap-3">
                            <div className="relative flex-1">
                                <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search postings by role title, skill (e.g. React), location, or department..."
                                    className="w-full text-xs bg-gray-50 border border-gray-200 rounded-xl pl-9 pr-4 py-2.5 outline-none focus:bg-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                                />
                                {searchQuery && (
                                    <button 
                                        onClick={() => setSearchQuery('')}
                                        className="text-gray-400 hover:text-gray-600 absolute right-3 top-3"
                                    >
                                        <X className="w-3.5 h-3.5" />
                                    </button>
                                )}
                            </div>

                            <div className="flex flex-wrap items-center gap-2">
                                {/* Type Filter */}
                                <select
                                    value={selectedType}
                                    onChange={(e) => setSelectedType(e.target.value)}
                                    className="text-xs bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 outline-none font-medium cursor-pointer"
                                >
                                    <option value="All">All Types</option>
                                    <option value="Placement">Jobs (Placement)</option>
                                    <option value="Internship">Internships</option>
                                    <option value="Project">Industry Projects</option>
                                    <option value="Training">Corporate Trainings</option>
                                </select>

                                {/* Status Filter */}
                                <select
                                    value={selectedStatus}
                                    onChange={(e) => setSelectedStatus(e.target.value)}
                                    className="text-xs bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 outline-none font-medium cursor-pointer"
                                >
                                    <option value="All">All Statuses</option>
                                    <option value="Open">🟢 Open</option>
                                    <option value="Paused">🟡 Paused</option>
                                    <option value="Closed">🔴 Closed</option>
                                    <option value="Draft">⚪ Draft</option>
                                </select>
                            </div>
                        </div>

                        {/* List / Grid Content */}
                        {loading ? (
                            <div className="py-20 text-center">
                                <RefreshCw className="w-8 h-8 text-indigo-600 animate-spin mx-auto mb-3" />
                                <p className="text-xs text-gray-500 font-medium">Loading opportunities...</p>
                            </div>
                        ) : filteredOpportunities.length === 0 ? (
                            <div className="bg-white rounded-2xl border border-dashed border-gray-300 p-12 text-center">
                                <Briefcase className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                <h3 className="text-sm font-bold text-gray-800">No opportunities found</h3>
                                <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
                                    {searchQuery || selectedType !== 'All' || selectedStatus !== 'All'
                                        ? 'No opportunities match your current filter criteria. Try clearing filters.'
                                        : 'You have not posted any opportunities yet. Create your first listing to start receiving candidate applications!'}
                                </p>
                                <button
                                    onClick={() => {
                                        setEditingOpportunity(null);
                                        setIsFormOpen(true);
                                    }}
                                    className="mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold inline-flex items-center space-x-1.5 shadow-sm cursor-pointer"
                                >
                                    <Plus className="w-4 h-4" />
                                    <span>Post an Opportunity</span>
                                </button>
                            </div>
                        ) : viewMode === 'grid' ? (
                            /* GRID VIEW */
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                                {filteredOpportunities.map(opp => {
                                    const typeMeta = getTypeColor(opp.type);
                                    return (
                                        <div
                                            key={opp._id}
                                            className="bg-white rounded-2xl border border-gray-200/90 shadow-xs hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group"
                                        >
                                            {/* Top Card Section */}
                                            <div className="p-5">
                                                <div className="flex items-center justify-between mb-3">
                                                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${typeMeta.badge}`}>
                                                        {opp.type}
                                                    </span>

                                                    {/* Quick Status Dropdown */}
                                                    <select
                                                        value={opp.status}
                                                        onChange={(e) => handleStatusChange(opp._id, e.target.value)}
                                                        className={`text-[11px] font-bold rounded-lg px-2 py-0.5 border cursor-pointer outline-none transition-colors ${
                                                            opp.status === 'Open' ? 'bg-emerald-50 text-emerald-700 border-emerald-300' :
                                                            opp.status === 'Paused' ? 'bg-amber-50 text-amber-700 border-amber-300' :
                                                            opp.status === 'Draft' ? 'bg-gray-100 text-gray-700 border-gray-300' :
                                                            'bg-rose-50 text-rose-700 border-rose-300'
                                                        }`}
                                                    >
                                                        <option value="Open">🟢 Open</option>
                                                        <option value="Paused">🟡 Paused</option>
                                                        <option value="Closed">🔴 Closed</option>
                                                        <option value="Draft">⚪ Draft</option>
                                                    </select>
                                                </div>

                                                <h3 className="text-base font-bold text-gray-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
                                                    {opp.title}
                                                </h3>
                                                <p className="text-[11px] text-gray-500 font-medium mt-0.5 mb-3 flex items-center space-x-1">
                                                    <span>{opp.department || 'Technology'}</span>
                                                    <span>•</span>
                                                    <span className="flex items-center"><MapPin className="w-3 h-3 mr-0.5 text-gray-400" />{opp.location}</span>
                                                    <span className="text-[10px] text-indigo-600 font-semibold">({opp.workMode})</span>
                                                </p>

                                                {/* Key metrics pill row */}
                                                <div className="grid grid-cols-2 gap-2 text-xs bg-gray-50/80 p-2.5 rounded-xl border border-gray-100 mb-3.5">
                                                    <div>
                                                        <span className="text-[10px] text-gray-400 block font-medium">Compensation</span>
                                                        <span className="font-bold text-gray-800 text-[11px] truncate block">
                                                            {opp.stipendOrSalary || 'Not Disclosed'}
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <span className="text-[10px] text-gray-400 block font-medium">Duration</span>
                                                        <span className="font-bold text-gray-800 text-[11px] truncate block">
                                                            {opp.duration || 'Full-time'}
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Required Skills chips */}
                                                <div>
                                                    <span className="text-[10px] text-gray-400 font-medium block mb-1">Target Skills</span>
                                                    <div className="flex flex-wrap gap-1.5">
                                                        {opp.requiredSkills?.slice(0, 4).map((sk, i) => (
                                                            <span key={i} className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-medium">
                                                                {sk.name}
                                                            </span>
                                                        ))}
                                                        {opp.requiredSkills?.length > 4 && (
                                                            <span className="text-[10px] text-gray-400 self-center">
                                                                +{opp.requiredSkills.length - 4} more
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Bottom Card Footer with Actions */}
                                            <div className="px-5 py-3 bg-gray-50/70 border-t border-gray-100 flex items-center justify-between">
                                                <div className="flex items-center space-x-1 text-xs font-bold text-indigo-700">
                                                    <Users className="w-3.5 h-3.5 text-indigo-500" />
                                                    <span>{opp.applicantCount || 0} Applicants</span>
                                                </div>

                                                <div className="flex items-center space-x-1">
                                                    <button
                                                        onClick={() => setSelectedDetailOpp(opp)}
                                                        className="p-1.5 text-gray-500 hover:text-indigo-600 hover:bg-white rounded-lg transition-colors cursor-pointer"
                                                        title="View Details"
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            setEditingOpportunity(opp);
                                                            setIsFormOpen(true);
                                                        }}
                                                        className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-white rounded-lg transition-colors cursor-pointer"
                                                        title="Edit Opportunity"
                                                    >
                                                        <Edit3 className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            if (window.confirm(`Are you sure you want to delete "${opp.title}"?`)) {
                                                                handleDeleteOpportunity(opp._id);
                                                            }
                                                        }}
                                                        className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-white rounded-lg transition-colors cursor-pointer"
                                                        title="Delete Opportunity"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            /* TABLE VIEW */
                            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left text-xs">
                                        <thead className="bg-gray-50/80 border-b border-gray-200 text-gray-500 uppercase tracking-wider text-[10px] font-bold">
                                            <tr>
                                                <th className="py-3.5 px-4">Opportunity</th>
                                                <th className="py-3.5 px-4">Type</th>
                                                <th className="py-3.5 px-4">Compensation & Mode</th>
                                                <th className="py-3.5 px-4">Target Skills</th>
                                                <th className="py-3.5 px-4">Applicants</th>
                                                <th className="py-3.5 px-4">Status</th>
                                                <th className="py-3.5 px-4 text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            {filteredOpportunities.map(opp => (
                                                <tr key={opp._id} className="hover:bg-gray-50/50 transition-colors">
                                                    <td className="py-3.5 px-4">
                                                        <div className="font-bold text-gray-900">{opp.title}</div>
                                                        <div className="text-[11px] text-gray-500">{opp.department} • {opp.location}</div>
                                                    </td>
                                                    <td className="py-3.5 px-4">
                                                        <span className="font-semibold text-gray-700">{opp.type}</span>
                                                    </td>
                                                    <td className="py-3.5 px-4">
                                                        <div className="font-semibold text-gray-900">{opp.stipendOrSalary || 'N/A'}</div>
                                                        <div className="text-[10px] text-indigo-600">{opp.workMode}</div>
                                                    </td>
                                                    <td className="py-3.5 px-4 max-w-xs truncate">
                                                        {opp.requiredSkills?.map(s => s.name).join(', ')}
                                                    </td>
                                                    <td className="py-3.5 px-4">
                                                        <span className="font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full">
                                                            {opp.applicantCount || 0}
                                                        </span>
                                                    </td>
                                                    <td className="py-3.5 px-4">
                                                        <select
                                                            value={opp.status}
                                                            onChange={(e) => handleStatusChange(opp._id, e.target.value)}
                                                            className="text-xs font-bold rounded-md px-2 py-0.5 border cursor-pointer outline-none bg-white"
                                                        >
                                                            <option value="Open">🟢 Open</option>
                                                            <option value="Paused">🟡 Paused</option>
                                                            <option value="Closed">🔴 Closed</option>
                                                            <option value="Draft">⚪ Draft</option>
                                                        </select>
                                                    </td>
                                                    <td className="py-3.5 px-4 text-right">
                                                        <div className="inline-flex items-center space-x-1">
                                                            <button
                                                                onClick={() => setSelectedDetailOpp(opp)}
                                                                className="p-1.5 text-gray-500 hover:text-indigo-600 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                                                            >
                                                                <Eye className="w-4 h-4" />
                                                            </button>
                                                            <button
                                                                onClick={() => {
                                                                    setEditingOpportunity(opp);
                                                                    setIsFormOpen(true);
                                                                }}
                                                                className="p-1.5 text-gray-500 hover:text-blue-600 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                                                            >
                                                                <Edit3 className="w-4 h-4" />
                                                            </button>
                                                            <button
                                                                onClick={() => {
                                                                    if (window.confirm(`Delete "${opp.title}"?`)) {
                                                                        handleDeleteOpportunity(opp._id);
                                                                    }
                                                                }}
                                                                className="p-1.5 text-gray-400 hover:text-rose-600 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* APPLICATIONS TAB */}
                {activeTab === 'applications' && (
                    <div className="space-y-6">
                        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs">
                            <div className="p-4 bg-gray-50/70 border-b border-gray-200 flex items-center justify-between">
                                <div>
                                    <h3 className="text-sm font-bold text-gray-900">Applicant Submissions</h3>
                                    <p className="text-xs text-gray-500">
                                        Review student applications with calculated ATS match scores and academic qualifications.
                                    </p>
                                </div>
                                <button
                                    onClick={fetchApplications}
                                    className="px-3 py-1.5 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 rounded-lg text-xs font-semibold flex items-center space-x-1 cursor-pointer"
                                >
                                    <RefreshCw className="w-3.5 h-3.5" />
                                    <span>Refresh List</span>
                                </button>
                            </div>

                            {applications.length === 0 ? (
                                <div className="p-12 text-center text-gray-500 text-xs">
                                    No student applications received yet.
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left text-xs">
                                        <thead className="bg-gray-50/50 border-b border-gray-200 text-gray-500 uppercase tracking-wider text-[10px] font-bold">
                                            <tr>
                                                <th className="py-3 px-4">Opportunity</th>
                                                <th className="py-3 px-4">Applicant ID</th>
                                                <th className="py-3 px-4">Academic CGPA</th>
                                                <th className="py-3 px-4">ATS Skill Match</th>
                                                <th className="py-3 px-4">Status</th>
                                                <th className="py-3 px-4">Applied On</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            {applications.map(app => (
                                                <tr key={app._id} className="hover:bg-gray-50/50 transition-colors">
                                                    <td className="py-3.5 px-4 font-bold text-gray-900">
                                                        {app.opportunity?.title || 'Unknown Opportunity'}
                                                        <span className="block text-[11px] font-normal text-gray-500">
                                                            {app.opportunity?.type}
                                                        </span>
                                                    </td>
                                                    <td className="py-3.5 px-4 text-gray-600 font-mono text-[11px]">
                                                        {app.student?._id || 'Student Candidate'}
                                                    </td>
                                                    <td className="py-3.5 px-4">
                                                        <span className="font-semibold text-gray-800">
                                                            {app.student?.academicInfo?.cgpa || 'N/A'}
                                                        </span>
                                                    </td>
                                                    <td className="py-3.5 px-4">
                                                        <div className="flex items-center space-x-2">
                                                            <div className="w-16 bg-gray-200 h-2 rounded-full overflow-hidden">
                                                                <div 
                                                                    className={`h-full rounded-full ${
                                                                        (app.matchScore || 0) >= 70 ? 'bg-emerald-500' :
                                                                        (app.matchScore || 0) >= 40 ? 'bg-amber-500' : 'bg-rose-500'
                                                                    }`}
                                                                    style={{ width: `${app.matchScore || 0}%` }}
                                                                ></div>
                                                            </div>
                                                            <span className="font-bold text-xs text-gray-800">
                                                                {app.matchScore || 0}%
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="py-3.5 px-4">
                                                        <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                                                            app.status === 'Selected' ? 'bg-emerald-100 text-emerald-800' :
                                                            app.status === 'Shortlisted' ? 'bg-indigo-100 text-indigo-800' :
                                                            app.status === 'Interview' ? 'bg-purple-100 text-purple-800' :
                                                            app.status === 'Not Selected' ? 'bg-rose-100 text-rose-800' :
                                                            'bg-gray-100 text-gray-800'
                                                        }`}>
                                                            {app.status}
                                                        </span>
                                                    </td>
                                                    <td className="py-3.5 px-4 text-gray-500 text-[11px]">
                                                        {app.createdAt ? new Date(app.createdAt).toLocaleDateString() : 'Recent'}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Create / Edit Opportunity Modal */}
            <OpportunityFormModal
                isOpen={isFormOpen}
                initialData={editingOpportunity}
                onClose={() => {
                    setIsFormOpen(false);
                    setEditingOpportunity(null);
                }}
                onSuccess={(savedOpp, action) => {
                    if (action === 'created') {
                        setOpportunities(prev => [savedOpp, ...prev]);
                        showToast('Opportunity posted successfully!');
                    } else {
                        setOpportunities(prev => prev.map(o => o._id === savedOpp._id ? { ...o, ...savedOpp } : o));
                        showToast('Opportunity updated successfully!');
                    }
                }}
            />

            {/* Details Preview Modal */}
            <OpportunityDetailsModal
                isOpen={Boolean(selectedDetailOpp)}
                opportunity={selectedDetailOpp}
                onClose={() => setSelectedDetailOpp(null)}
                onEdit={(opp) => {
                    setEditingOpportunity(opp);
                    setIsFormOpen(true);
                }}
                onDelete={(oppId) => handleDeleteOpportunity(oppId)}
                onStatusChange={(oppId, newStatus) => handleStatusChange(oppId, newStatus)}
            />
        </div>
    );
}
