import React, { useState, useEffect, useContext } from 'react';
import api from '../../services/api';
import { AuthContext } from '../../context/AuthContext';
import { motion } from 'framer-motion';
import { 
    BookOpen, Briefcase, Calendar, TrendingUp, Bell, ChevronRight, 
    Award, Sparkles, CheckCircle2, Clock, MapPin, ArrowUpRight, CheckSquare, Square
} from 'lucide-react';

const DashboardHome = () => {
    const { user } = useContext(AuthContext);
    const [analytics, setAnalytics] = useState({
        activeApplicationsCount: 4,
        atsScore: 85,
        verifiedBadgesCount: 3,
        upcomingEventsCount: 3,
        completionPercentage: 80
    });
    const [recentApplications, setRecentApplications] = useState([]);
    const [tasks, setTasks] = useState([
        { id: 1, text: 'Take System Design Assessment', tag: 'Skill Center', done: false },
        { id: 2, text: 'Update Project GitHub Repository Links', tag: 'Profile Builder', done: true },
        { id: 3, text: 'RSVP for Microsoft Campus Drive', tag: 'Events Hub', done: false }
    ]);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                // Fetch analytics summary from backend
                const res = await api.get('/profile/analytics/summary').catch(() => null);
                if (res?.data?.success && res.data.data) {
                    setAnalytics(prev => ({
                        ...prev,
                        ...res.data.data
                    }));
                }

                // Fetch recent applications
                const localApps = JSON.parse(localStorage.getItem('careersync_applied_jobs') || '[]');
                if (localApps.length > 0) {
                    setRecentApplications(localApps.slice(0, 3));
                } else {
                    setRecentApplications([
                        { role: 'Frontend Developer Intern', company: 'Vercel', date: '2 days ago', status: 'Shortlisted' },
                        { role: 'Software Engineering Intern', company: 'Google', date: '1 week ago', status: 'Under Review' }
                    ]);
                }
            } catch (err) {
                console.error("Dashboard metrics load error:", err);
            }
        };

        fetchDashboardData();
    }, []);

    const toggleTask = (taskId) => {
        setTasks(prev => prev.map(t => t.id === taskId ? { ...t, done: !t.done } : t));
    };

    return (
        <div className="max-w-7xl mx-auto pb-12">
            {/* Header Greeting */}
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
                    Welcome back, {user?.name || 'Student'}! 👋
                </h2>
                <p className="text-gray-600 text-sm mt-1">Here is your daily career progression, verified skill ratings, and application pipeline.</p>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-center mb-3">
                        <span className="text-gray-500 font-semibold text-xs uppercase tracking-wider">Active Applications</span>
                        <div className="bg-blue-50 text-blue-600 p-2.5 rounded-xl border border-blue-100">
                            <Briefcase className="w-5 h-5" />
                        </div>
                    </div>
                    <div>
                        <span className="text-3xl font-extrabold text-gray-900">{analytics.activeApplicationsCount ?? 4}</span>
                        <div className="text-xs text-emerald-600 font-bold mt-1 flex items-center">
                            <span>+1 new status change</span>
                        </div>
                    </div>
                </div>
                
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-center mb-3">
                        <span className="text-gray-500 font-semibold text-xs uppercase tracking-wider">ATS Resume Score</span>
                        <div className="bg-purple-50 text-purple-600 p-2.5 rounded-xl border border-purple-100">
                            <TrendingUp className="w-5 h-5" />
                        </div>
                    </div>
                    <div>
                        <span className="text-3xl font-extrabold text-gray-900">{analytics.atsScore || 85}%</span>
                        <div className="text-xs text-purple-700 font-semibold mt-1">
                            Recruiter optimized
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-center mb-3">
                        <span className="text-gray-500 font-semibold text-xs uppercase tracking-wider">Verified Badges</span>
                        <div className="bg-emerald-50 text-emerald-600 p-2.5 rounded-xl border border-emerald-100">
                            <Award className="w-5 h-5" />
                        </div>
                    </div>
                    <div>
                        <span className="text-3xl font-extrabold text-gray-900">{analytics.verifiedBadgesCount || 3}</span>
                        <div className="text-xs text-emerald-600 font-bold mt-1">
                            Anti-cheat validated
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-center mb-3">
                        <span className="text-gray-500 font-semibold text-xs uppercase tracking-wider">Placement Drives</span>
                        <div className="bg-orange-50 text-orange-600 p-2.5 rounded-xl border border-orange-100">
                            <Calendar className="w-5 h-5" />
                        </div>
                    </div>
                    <div>
                        <span className="text-3xl font-extrabold text-gray-900">{analytics.upcomingEventsCount || 3}</span>
                        <div className="text-xs text-gray-500 font-medium mt-1 truncate">
                            Next: Microsoft Connect
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Activity & AI Career Recommendations */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Live Application Pipeline */}
                    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                        <div className="flex justify-between items-center mb-5">
                            <h3 className="font-bold text-gray-900 text-base">Recent Application Status</h3>
                            <span className="text-xs text-blue-600 font-bold">Real-time sync</span>
                        </div>

                        <div className="space-y-3">
                            {recentApplications.map((app, idx) => (
                                <div key={idx} className="flex items-center justify-between p-4 bg-gray-50/80 rounded-xl border border-gray-200 hover:border-blue-200 transition-colors">
                                    <div>
                                        <h4 className="font-bold text-gray-900 text-sm">{app.role || app.title}</h4>
                                        <p className="text-xs text-gray-500 mt-0.5">{app.company} • {app.date || 'Recent'}</p>
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                                        app.status === 'Shortlisted' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                                        app.status === 'Selected' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                                        'bg-blue-50 text-blue-700 border-blue-200'
                                    }`}>
                                        {app.status}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* AI Career Insights Card */}
                    <div className="bg-gradient-to-br from-blue-700 to-indigo-800 rounded-xl p-6 text-white shadow-md relative overflow-hidden">
                        <div className="absolute right-0 top-0 w-48 h-48 bg-white/5 rounded-full pointer-events-none"></div>

                        <div className="flex items-center gap-2 mb-2">
                            <Sparkles className="w-5 h-5 text-amber-300" />
                            <h3 className="font-bold text-base text-white">AI Career Progression Advisory</h3>
                        </div>

                        <p className="text-xs text-blue-100 leading-relaxed mb-5 max-w-xl">
                            Based on your latest multi-role gap analysis against <strong>Full Stack Engineer</strong> industry benchmarks, closing your <strong>System Design</strong> and <strong>Cloud Deployment</strong> deficits will increase your recruiter match rating by +18%.
                        </p>

                        <div className="flex items-center gap-3">
                            <div className="text-xs bg-white/10 px-3 py-1.5 rounded-lg border border-white/20 font-semibold text-blue-100">
                                Milestone: 80% Complete
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar Tasks & Priorities */}
                <div className="space-y-6">
                    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                        <h3 className="font-bold text-gray-900 text-base mb-4 flex items-center justify-between">
                            <span>Target Checklist</span>
                            <span className="text-xs text-gray-400 font-normal">3 pending</span>
                        </h3>

                        <ul className="space-y-3">
                            {tasks.map(task => (
                                <li 
                                    key={task.id} 
                                    onClick={() => toggleTask(task.id)}
                                    className="flex items-start cursor-pointer group p-2 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    <div className="mt-0.5 mr-3 text-blue-600">
                                        {task.done ? <CheckSquare className="w-4 h-4 text-emerald-600" /> : <Square className="w-4 h-4 text-gray-400 group-hover:text-blue-500" />}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className={`text-xs font-semibold ${task.done ? 'line-through text-gray-400' : 'text-gray-800'}`}>
                                            {task.text}
                                        </p>
                                        <span className="text-[10px] text-blue-600 font-bold uppercase tracking-wider">{task.tag}</span>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Digital Badge Status */}
                    <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm text-center">
                        <div className="w-12 h-12 bg-emerald-50 text-emerald-600 border border-emerald-200 rounded-full mx-auto flex items-center justify-center mb-3">
                            <CheckCircle2 className="w-6 h-6" />
                        </div>
                        <h4 className="font-bold text-gray-900 text-sm">Verified Candidate Level</h4>
                        <p className="text-xs text-gray-500 mt-1">Your credentials pass automated ATS verification filters for partner recruitment drives.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardHome;
