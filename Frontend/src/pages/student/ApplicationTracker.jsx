import api from '../../services/api';
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
    Clock, CheckCircle, XCircle, ChevronRight, Building2, MapPin, 
    FileText, Calendar, Filter, ExternalLink, RefreshCw
} from 'lucide-react';

const ApplicationTracker = () => {
    // Default sample applications if DB is empty
    const initialApps = [
        { id: 'app-1', role: 'Software Engineering Intern', company: 'Google', date: '2 days ago', status: 'Applied', location: 'Remote' },
        { id: 'app-2', role: 'Frontend Developer Intern', company: 'Vercel', date: '1 week ago', status: 'Shortlisted', location: 'Hybrid' },
        { id: 'app-3', role: 'Data Scientist', company: 'Amazon', date: '2 weeks ago', status: 'Interview', location: 'New York, NY' },
        { id: 'app-4', role: 'Full Stack Developer', company: 'Microsoft', date: '1 month ago', status: 'Selected', location: 'Seattle, WA' },
        { id: 'app-5', role: 'Backend Engineer', company: 'Netflix', date: '1 month ago', status: 'Not Selected', location: 'Los Gatos, CA' },
    ];

    const [applications, setApplications] = useState([]);
    const [selectedStatus, setSelectedStatus] = useState('All');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchApplications = async () => {
            setLoading(true);
            try {
                // Fetch from backend
                const res = await api.get('/opportunities/my-applications').catch(() => ({ data: { data: [] } }));
                const backendApps = res.data?.data || [];

                // Fetch local applied jobs
                const localApplied = JSON.parse(localStorage.getItem('careersync_applied_jobs') || '[]');

                // Merge without duplicates
                const combined = [...localApplied, ...backendApps];
                if (combined.length > 0) {
                    const uniqueMap = new Map();
                    combined.forEach(item => {
                        const key = (item.role || item.title || '') + (item.company || '');
                        if (!uniqueMap.has(key)) {
                            uniqueMap.set(key, item);
                        }
                    });
                    setApplications(Array.from(uniqueMap.values()));
                } else {
                    setApplications(initialApps);
                }
            } catch (err) {
                setApplications(initialApps);
            } finally {
                setLoading(false);
            }
        };

        fetchApplications();
    }, []);

    const stages = ['Applied', 'Shortlisted', 'Interview', 'Selected'];

    const getStatusBadge = (status) => {
        switch (status) {
            case 'Applied': return 'text-blue-700 bg-blue-50 border-blue-200';
            case 'Shortlisted': return 'text-purple-700 bg-purple-50 border-purple-200';
            case 'Interview': return 'text-amber-700 bg-amber-50 border-amber-200';
            case 'Selected': return 'text-emerald-700 bg-emerald-50 border-emerald-200';
            case 'Not Selected': return 'text-red-700 bg-red-50 border-red-200';
            default: return 'text-gray-700 bg-gray-50 border-gray-200';
        }
    };

    const filteredApps = selectedStatus === 'All' 
        ? applications 
        : applications.filter(a => a.status === selectedStatus);

    return (
        <div className="max-w-7xl mx-auto pb-12">
            {/* Header */}
            <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-gray-900 tracking-tight flex items-center">
                        <FileText className="w-8 h-8 mr-3 text-blue-600" />
                        Application Lifecycle Tracker
                    </h2>
                    <p className="text-gray-600 text-sm mt-1">
                        Monitor the real-time hiring stage, round progress, and corporate recruiter feedback.
                    </p>
                </div>

                {/* Filter Pills */}
                <div className="flex flex-wrap gap-1 bg-white p-1 rounded-xl border border-gray-200 shadow-sm text-xs">
                    {['All', 'Applied', 'Shortlisted', 'Interview', 'Selected'].map(status => (
                        <button
                            key={status}
                            onClick={() => setSelectedStatus(status)}
                            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                                selectedStatus === status 
                                    ? 'bg-blue-600 text-white shadow-sm' 
                                    : 'text-gray-600 hover:text-gray-900'
                            }`}
                        >
                            {status}
                        </button>
                    ))}
                </div>
            </div>

            {/* Applications Table Card */}
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/80 border-b border-gray-200 text-gray-600 text-xs font-semibold uppercase tracking-wider">
                                <th className="py-4 px-6">Company & Position</th>
                                <th className="py-4 px-6">Applied Date</th>
                                <th className="py-4 px-6">Location</th>
                                <th className="py-4 px-6">Live Stage Tracker</th>
                                <th className="py-4 px-6 text-right">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 text-sm">
                            {filteredApps.map(app => (
                                <tr key={app.id} className="hover:bg-blue-50/30 transition-colors group">
                                    <td className="py-4 px-6">
                                        <div className="flex items-center">
                                            <div className="w-11 h-11 bg-blue-50 border border-blue-200 rounded-xl flex items-center justify-center mr-3.5 text-blue-700 shadow-sm">
                                                <Building2 className="w-5 h-5 text-blue-600" />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-gray-900 text-sm group-hover:text-blue-600 transition-colors">
                                                    {app.role || app.title}
                                                </h4>
                                                <p className="text-xs text-gray-500 font-semibold">{app.company}</p>
                                            </div>
                                        </div>
                                    </td>

                                    <td className="py-4 px-6 text-xs text-gray-500 font-medium">
                                        <div className="flex items-center">
                                            <Clock className="w-3.5 h-3.5 mr-1.5 text-gray-400" />
                                            {app.date || 'Recent'}
                                        </div>
                                    </td>

                                    <td className="py-4 px-6 text-xs text-gray-500 font-medium">
                                        <div className="flex items-center">
                                            <MapPin className="w-3.5 h-3.5 mr-1.5 text-gray-400" />
                                            {app.location || 'Remote'}
                                        </div>
                                    </td>

                                    <td className="py-4 px-6">
                                        <div className="w-full max-w-[260px]">
                                            {app.status === 'Not Selected' ? (
                                                <span className="text-xs font-semibold text-red-600 flex items-center">
                                                    <XCircle className="w-3.5 h-3.5 mr-1" />
                                                    Application Archival
                                                </span>
                                            ) : (
                                                <div className="flex items-center relative py-1">
                                                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-gray-200 rounded-full z-0"></div>
                                                    
                                                    {stages.map((stage, idx) => {
                                                        const currentIdx = stages.indexOf(app.status);
                                                        const isCompleted = idx <= currentIdx;
                                                        const isCurrent = idx === currentIdx;
                                                        
                                                        return (
                                                            <div 
                                                                key={stage} 
                                                                className={`flex-1 flex relative z-10 ${
                                                                    idx === 0 ? 'justify-start' : idx === stages.length - 1 ? 'justify-end' : 'justify-center'
                                                                }`}
                                                            >
                                                                <div 
                                                                    className={`w-3.5 h-3.5 rounded-full border-2 transition-all ${
                                                                        isCompleted 
                                                                            ? 'bg-blue-600 border-blue-600 shadow-sm' 
                                                                            : 'bg-white border-gray-300'
                                                                    } ${isCurrent ? 'ring-2 ring-blue-200 scale-110' : ''}`}
                                                                    title={stage}
                                                                ></div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            )}
                                        </div>
                                    </td>

                                    <td className="py-4 px-6 text-right">
                                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold border ${getStatusBadge(app.status)}`}>
                                            {app.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}

                            {filteredApps.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="py-12 text-center text-gray-500 text-sm">
                                        No applications found with status &quot;{selectedStatus}&quot;.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ApplicationTracker;
