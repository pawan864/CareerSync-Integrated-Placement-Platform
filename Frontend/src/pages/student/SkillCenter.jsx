import React, { useState, useEffect, useRef } from 'react';
import api from '../../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    BrainCircuit, Target, BookOpen, CheckCircle, 
    PlayCircle, TrendingUp, AlertTriangle, Lightbulb,
    Clock, Award, ArrowRight, Check, X, ShieldAlert, Sparkles,
    ChevronRight, ExternalLink, RefreshCw, Trophy, Medal, Crown,
    Flame, ShieldCheck, Search, Filter
} from 'lucide-react';
import {
    Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, 
    ResponsiveContainer, Tooltip, Legend
} from 'recharts';

const SkillCenter = () => {
    const [activeTab, setActiveTab] = useState('assessments');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ text: '', type: '' });

    // ---------------------------------------------
    // TAB 1: ASSESSMENTS STATE & QUIZ RUNNER
    // ---------------------------------------------
    const [assessments, setAssessments] = useState([]);
    const [attempts, setAttempts] = useState([]);
    const [activeQuiz, setActiveQuiz] = useState(null); // Assessment being taken
    const [quizAnswers, setQuizAnswers] = useState({}); // { [questionId]: selectedOptionIndex }
    const [currentQIndex, setCurrentQIndex] = useState(0);
    const [timeLeft, setTimeLeft] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [tabSwitches, setTabSwitches] = useState(0);
    const [quizResult, setQuizResult] = useState(null); // Result after submission
    const timerRef = useRef(null);

    // ---------------------------------------------
    // TAB 2: GAP ANALYSIS STATE
    // ---------------------------------------------
    const [roles, setRoles] = useState([]);
    const [selectedRole, setSelectedRole] = useState(null);
    const [gapData, setGapData] = useState(null);
    const [gapLoading, setGapLoading] = useState(false);

    // ---------------------------------------------
    // TAB 3: LEARNING RECOMMENDATIONS STATE
    // ---------------------------------------------
    const [learningResources, setLearningResources] = useState([]);
    const [enrolledIds, setEnrolledIds] = useState(new Set());
    const [enrollingId, setEnrollingId] = useState(null);

    // ---------------------------------------------
    // TAB 4: CAMPUS SKILL LEADERBOARD STATE
    // ---------------------------------------------
    const [leaderboard, setLeaderboard] = useState([]);
    const [leaderboardLoading, setLeaderboardLoading] = useState(false);
    const [selectedDept, setSelectedDept] = useState('All');
    const [leaderboardSearch, setLeaderboardSearch] = useState('');

    // Fetch initial data
    const fetchAssessmentsAndHistory = async () => {
        try {
            setLoading(true);
            const [assessRes, historyRes] = await Promise.all([
                api.get('/assessments'),
                api.get('/assessments/my/history').catch(() => ({ data: { data: [] } }))
            ]);

            if (assessRes.data?.success) {
                setAssessments(assessRes.data.data);
            }
            if (historyRes.data?.success) {
                setAttempts(historyRes.data.data || []);
            }
        } catch (err) {
            console.error("Failed to load assessments:", err);
        } finally {
            setLoading(false);
        }
    };

    const fetchRolesAndGap = async () => {
        try {
            setGapLoading(true);
            const res = await api.get('/skills/roles');
            if (res.data?.success && res.data.data?.length > 0) {
                const fetchedRoles = res.data.data;
                setRoles(fetchedRoles);
                const initialRole = fetchedRoles[0];
                setSelectedRole(initialRole);
                loadGapForRole(initialRole._id);
            }
        } catch (err) {
            console.error("Failed to fetch roles:", err);
        } finally {
            setGapLoading(false);
        }
    };

    const loadGapForRole = async (roleId) => {
        try {
            setGapLoading(true);
            const res = await api.get(`/skills/gap/${roleId}`);
            if (res.data?.success) {
                setGapData(res.data.data);
            }
        } catch (err) {
            console.error("Failed to load role gap analysis:", err);
        } finally {
            setGapLoading(false);
        }
    };

    const fetchLearningHub = async () => {
        try {
            const [learnRes, enrollRes] = await Promise.all([
                api.get('/learning'),
                api.get('/learning/my/enrollments').catch(() => ({ data: { data: [] } }))
            ]);

            if (learnRes.data?.success) {
                setLearningResources(learnRes.data.data);
            }
            if (enrollRes.data?.success) {
                const set = new Set((enrollRes.data.data || []).map(e => e.resource?._id || e.resource));
                setEnrolledIds(set);
            }
        } catch (err) {
            console.error("Failed to load learning resources:", err);
        }
    };

    const fetchLeaderboard = async (dept = selectedDept) => {
        try {
            setLeaderboardLoading(true);
            const query = (dept && dept !== 'All') ? `?department=${encodeURIComponent(dept)}` : '';
            const res = await api.get(`/skills/leaderboard${query}`);
            if (res.data?.success) {
                setLeaderboard(res.data.data || []);
            }
        } catch (err) {
            console.error("Failed to load skill leaderboard:", err);
        } finally {
            setLeaderboardLoading(false);
        }
    };

    useEffect(() => {
        fetchAssessmentsAndHistory();
        fetchRolesAndGap();
        fetchLearningHub();
        fetchLeaderboard('All');
    }, []);

    // ---------------------------------------------
    // QUIZ RUNNER LOGIC & ANTI-CHEAT
    // ---------------------------------------------
    const startAssessment = async (testId) => {
        try {
            setLoading(true);
            const res = await api.get(`/assessments/${testId}`);
            if (res.data?.success) {
                const fullTest = res.data.data;
                setActiveQuiz(fullTest);
                setQuizAnswers({});
                setCurrentQIndex(0);
                setTimeLeft((fullTest.timeLimitMinutes || 15) * 60);
                setTabSwitches(0);
                setQuizResult(null);
            }
        } catch (err) {
            setMessage({ text: 'Could not launch assessment. Please try again.', type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    // Anti-cheat tab switch monitoring
    useEffect(() => {
        if (!activeQuiz) return;

        const handleVisibilityChange = () => {
            if (document.hidden) {
                setTabSwitches(prev => prev + 1);
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, [activeQuiz]);

    // Timer countdown
    useEffect(() => {
        if (!activeQuiz) return;

        timerRef.current = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(timerRef.current);
                    handleSubmitQuiz(); // Auto submit on timeout
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timerRef.current);
    }, [activeQuiz]);

    const handleSelectOption = (questionId, optionIdx) => {
        setQuizAnswers(prev => ({
            ...prev,
            [questionId]: optionIdx
        }));
    };

    const handleSubmitQuiz = async () => {
        if (!activeQuiz) return;
        try {
            setIsSubmitting(true);
            const totalDuration = (activeQuiz.timeLimitMinutes || 15) * 60;
            const timeSpent = Math.max(1, totalDuration - timeLeft);

            const formattedAnswers = Object.entries(quizAnswers).map(([qId, optIdx]) => ({
                questionId: qId,
                selectedOptionIndex: optIdx
            }));

            const payload = {
                answers: formattedAnswers,
                timeSpentSeconds: timeSpent
            };

            const res = await api.post(`/assessments/${activeQuiz._id}/submit`, payload);
            if (res.data?.success) {
                setQuizResult(res.data.data);
                // Refresh assessment card statuses and attempts
                fetchAssessmentsAndHistory();
            }
        } catch (err) {
            console.error("Submission failed:", err);
            setMessage({ text: 'Error recording test submission.', type: 'error' });
        } finally {
            setIsSubmitting(false);
            if (timerRef.current) clearInterval(timerRef.current);
        }
    };

    const handleCloseQuiz = () => {
        setActiveQuiz(null);
        setQuizResult(null);
        if (timerRef.current) clearInterval(timerRef.current);
    };

    // ---------------------------------------------
    // LEARNING ENROLLMENT ACTION
    // ---------------------------------------------
    const handleEnroll = async (resourceId, externalUrl) => {
        try {
            setEnrollingId(resourceId);
            const res = await api.post(`/learning/${resourceId}/enroll`);
            if (res.data?.success) {
                setEnrolledIds(prev => new Set([...prev, resourceId]));
                setMessage({ text: 'Successfully enrolled in course!', type: 'success' });
                if (externalUrl) {
                    window.open(externalUrl, '_blank');
                }
            }
        } catch (err) {
            setMessage({ text: err.response?.data?.error || 'Enrollment failed.', type: 'error' });
        } finally {
            setEnrollingId(null);
            setTimeout(() => setMessage({ text: '', type: '' }), 4000);
        }
    };

    // Format seconds to mm:ss
    const formatTime = (secs) => {
        const m = Math.floor(secs / 60);
        const s = secs % 60;
        return `${m}:${s < 10 ? '0' : ''}${s}`;
    };

    // Check if user passed assessment
    const getAttemptForTest = (testSkillName) => {
        return attempts.find(a => 
            a.skillName?.toLowerCase() === testSkillName?.toLowerCase() && a.passed
        );
    };

    // Prepare radar data for gap analysis
    const prepareRadarData = () => {
        if (!gapData?.analysis) return [];
        const items = [];

        // Add matched skills
        (gapData.analysis.matchedSkills || []).forEach(s => {
            items.push({
                subject: s.name,
                student: s.proficiencyScore || 85,
                industry: 80,
                fullMark: 100
            });
        });

        // Add missing skills
        (gapData.analysis.missingSkills || []).forEach(s => {
            items.push({
                subject: s.name,
                student: 20,
                industry: 80,
                fullMark: 100
            });
        });

        // Add upgrade needed skills
        (gapData.analysis.upgradeNeededSkills || []).forEach(s => {
            items.push({
                subject: s.name,
                student: s.proficiencyScore || 50,
                industry: 80,
                fullMark: 100
            });
        });

        return items.slice(0, 8); // Top 8 for clean radar presentation
    };

    return (
        <div className="max-w-6xl mx-auto pb-12">
            {/* Header */}
            <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-gray-900 tracking-tight flex items-center">
                        <BrainCircuit className="w-8 h-8 mr-3 text-blue-600" />
                        Skill Center & Anti-Cheat Testing Hub
                    </h2>
                    <p className="text-gray-600 text-sm mt-1">
                        Complete verified assessments, analyze role deficits against industry benchmarks, and enroll in targeted learning.
                    </p>
                </div>
                
                <div className="flex bg-white rounded-lg p-1 border border-gray-200 shadow-sm overflow-x-auto">
                    {['assessments', 'analysis', 'learning', 'leaderboard'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => {
                                setActiveTab(tab);
                                if (tab === 'leaderboard' && leaderboard.length === 0) {
                                    fetchLeaderboard(selectedDept);
                                }
                            }}
                            className={`px-3.5 py-2 rounded-md text-xs font-bold transition-all whitespace-nowrap ${
                                activeTab === tab 
                                    ? 'bg-blue-600 text-white shadow-sm' 
                                    : 'text-gray-600 hover:text-gray-900'
                            }`}
                        >
                            {tab === 'assessments' && '1. Skill Assessments'}
                            {tab === 'analysis' && '2. Gap Analysis'}
                            {tab === 'learning' && '3. Learning Path'}
                            {tab === 'leaderboard' && '4. Campus Leaderboard'}
                        </button>
                    ))}
                </div>
            </div>

            {/* Notification alert */}
            {message.text && (
                <div className={`mb-6 p-4 rounded-lg text-sm font-medium flex items-center justify-between border ${
                    message.type === 'success' 
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
                        : 'bg-red-50 text-red-800 border-red-200'
                }`}>
                    <span>{message.text}</span>
                    <button onClick={() => setMessage({ text: '', type: '' })} className="text-xs uppercase font-bold underline">Dismiss</button>
                </div>
            )}

            <AnimatePresence mode="wait">
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.2 }}
                >
                    {/* TAB 1: ASSESSMENTS FEED */}
                    {activeTab === 'assessments' && (
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {assessments.map(test => {
                                    const passedAttempt = getAttemptForTest(test.skillName);
                                    return (
                                        <div 
                                            key={test._id} 
                                            className="bg-white border border-gray-200 rounded-xl p-6 relative overflow-hidden group hover:border-blue-300 hover:shadow-md transition-all flex flex-col justify-between"
                                        >
                                            {passedAttempt && (
                                                <div className="absolute top-0 right-0 bg-emerald-600 text-white text-[11px] font-bold px-3 py-1 rounded-bl-lg flex items-center shadow-sm">
                                                    <CheckCircle className="w-3.5 h-3.5 mr-1" />
                                                    VERIFIED BADGE EARNED ({passedAttempt.percentage}%)
                                                </div>
                                            )}

                                            <div>
                                                <div className="flex items-center gap-2 mb-2">
                                                    <span className="text-[11px] font-bold uppercase tracking-wider text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded border border-purple-200">
                                                        {test.domain || test.category || 'Technical'}
                                                    </span>
                                                    <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded border border-blue-200">
                                                        {test.difficulty}
                                                    </span>
                                                </div>

                                                <h3 className="text-lg font-bold text-gray-900 mb-1">{test.title}</h3>
                                                <p className="text-xs text-gray-500 mb-4">{test.description || `Validate your ${test.skillName} abilities to qualify for top-tier hiring pipelines.`}</p>

                                                <div className="flex items-center gap-4 text-xs text-gray-500 mb-6">
                                                    <span className="flex items-center">
                                                        <Clock className="w-3.5 h-3.5 mr-1 text-gray-400" />
                                                        {test.timeLimitMinutes || 15} mins
                                                    </span>
                                                    <span className="flex items-center">
                                                        <Award className="w-3.5 h-3.5 mr-1 text-gray-400" />
                                                        Pass Mark: {test.passingScorePercentage || 70}%
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                                                <span className="text-xs text-gray-400">
                                                    {test.questions?.length || 5} MCQs
                                                </span>

                                                <button 
                                                    onClick={() => startAssessment(test._id)}
                                                    className={`flex items-center text-xs font-bold px-4 py-2 rounded-lg transition-all shadow-sm ${
                                                        passedAttempt 
                                                            ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' 
                                                            : 'bg-blue-600 text-white hover:bg-blue-700'
                                                    }`}
                                                >
                                                    <PlayCircle className="w-4 h-4 mr-1.5" />
                                                    {passedAttempt ? 'Retake Test' : 'Start Assessment'}
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}

                                {assessments.length === 0 && !loading && (
                                    <div className="col-span-2 text-center py-12 text-gray-500">
                                        No active assessments found in database.
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* TAB 2: ROLE GAP ANALYSIS */}
                    {activeTab === 'analysis' && (
                        <div className="space-y-6">
                            {/* Role selector banner */}
                            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div>
                                    <h3 className="text-base font-bold text-gray-900">Target Career Benchmark</h3>
                                    <p className="text-xs text-gray-500 mt-0.5">Select a role to compare your verified competencies against industry hiring benchmarks.</p>
                                </div>

                                <div className="flex items-center gap-3">
                                    <select
                                        className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg px-4 py-2 text-sm font-semibold focus:border-blue-500 outline-none"
                                        value={selectedRole?._id || ''}
                                        onChange={e => {
                                            const role = roles.find(r => r._id === e.target.value);
                                            if (role) {
                                                setSelectedRole(role);
                                                loadGapForRole(role._id);
                                            }
                                        }}
                                    >
                                        {roles.map(r => (
                                            <option key={r._id} value={r._id}>{r.title}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {gapLoading ? (
                                <div className="text-center py-16 text-gray-500">
                                    <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-blue-600" />
                                    Calculating multi-role skill alignment...
                                </div>
                            ) : gapData ? (
                                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                                    {/* Competency Radar Chart */}
                                    <div className="lg:col-span-6 bg-white border border-gray-200 rounded-xl p-6 shadow-sm flex flex-col items-center">
                                        <div className="w-full flex justify-between items-center mb-4">
                                            <h3 className="text-base font-bold text-gray-900 flex items-center">
                                                <Target className="w-4 h-4 mr-2 text-blue-600" />
                                                Competency Radar
                                            </h3>
                                            <div className="text-xs font-bold px-3 py-1 bg-blue-50 text-blue-700 rounded-full border border-blue-200">
                                                Readiness: {gapData.readinessScore || 0}%
                                            </div>
                                        </div>

                                        <div className="w-full h-[360px]">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={prepareRadarData()}>
                                                    <PolarGrid stroke="#e5e7eb" />
                                                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#4b5563', fontSize: 11 }} />
                                                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                                                    <Radar name="My Verified Level" dataKey="student" stroke="#2563eb" fill="#2563eb" fillOpacity={0.35} />
                                                    <Radar name="Industry Benchmark" dataKey="industry" stroke="#ef4444" fill="#ef4444" fillOpacity={0.15} />
                                                    <Tooltip />
                                                    <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                                                </RadarChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </div>

                                    {/* Matched vs Missing Breakdown */}
                                    <div className="lg:col-span-6 space-y-6">
                                        {/* Missing Skills / Deficits */}
                                        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                                            <h3 className="text-base font-bold text-gray-900 mb-3 flex items-center text-red-600">
                                                <AlertTriangle className="w-4 h-4 mr-2" />
                                                Missing Skills & Deficits ({gapData.analysis?.missingSkills?.length || 0})
                                            </h3>

                                            <div className="space-y-3">
                                                {(gapData.analysis?.missingSkills || []).map((skill, idx) => (
                                                    <div key={idx} className="bg-red-50/50 border border-red-200 rounded-lg p-3 flex items-center justify-between">
                                                        <div>
                                                            <div className="font-bold text-xs text-gray-900">{skill.name}</div>
                                                            <div className="text-[11px] text-red-600 font-semibold">Required: {skill.requiredLevel || 'Intermediate'}</div>
                                                        </div>
                                                        <button 
                                                            onClick={() => setActiveTab('learning')}
                                                            className="text-xs font-bold text-red-700 bg-red-100 hover:bg-red-200 px-3 py-1 rounded transition-colors"
                                                        >
                                                            Find Course
                                                        </button>
                                                    </div>
                                                ))}

                                                {(!gapData.analysis?.missingSkills || gapData.analysis.missingSkills.length === 0) && (
                                                    <div className="text-xs text-emerald-700 font-medium">All mandatory skills matched for this role!</div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Matched Skills */}
                                        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                                            <h3 className="text-base font-bold text-gray-900 mb-3 flex items-center text-emerald-700">
                                                <CheckCircle className="w-4 h-4 mr-2" />
                                                Verified & Aligned Skills ({gapData.analysis?.matchedSkills?.length || 0})
                                            </h3>

                                            <div className="flex flex-wrap gap-2">
                                                {(gapData.analysis?.matchedSkills || []).map((skill, idx) => (
                                                    <span 
                                                        key={idx}
                                                        className="px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full text-xs font-bold flex items-center"
                                                    >
                                                        <Check className="w-3 h-3 mr-1 text-emerald-600" />
                                                        {skill.name} ({skill.currentLevel})
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : null}
                        </div>
                    )}

                    {/* TAB 3: LEARNING RECOMMENDATIONS */}
                    {activeTab === 'learning' && (
                        <div className="space-y-6">
                            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6 flex items-start shadow-sm">
                                <Sparkles className="w-6 h-6 mr-3 text-blue-600 flex-shrink-0 mt-0.5" />
                                <div>
                                    <h3 className="text-base font-bold text-gray-900 mb-1">Curated Learning Hub & Bootcamps</h3>
                                    <p className="text-xs text-gray-600 leading-relaxed">
                                        Personalized training courses directly addressing your identified technical deficits. Complete modules to automatically earn verified portfolio badges.
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {learningResources.map(resource => {
                                    const isEnrolled = enrolledIds.has(resource._id);
                                    return (
                                        <div 
                                            key={resource._id}
                                            className="bg-white border border-gray-200 rounded-xl p-5 hover:border-blue-400 hover:shadow-md transition-all flex flex-col justify-between"
                                        >
                                            <div>
                                                <div className="flex justify-between items-center mb-3">
                                                    <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                                                        {resource.type || 'Course'}
                                                    </span>
                                                    <span className="text-[11px] text-gray-500 font-medium">
                                                        {resource.durationHours ? `${resource.durationHours} hrs` : 'Self-paced'}
                                                    </span>
                                                </div>

                                                <h4 className="font-bold text-gray-900 text-sm mb-1.5">{resource.title}</h4>
                                                <p className="text-xs text-gray-500 mb-3 line-clamp-2">{resource.description}</p>
                                                <div className="text-xs text-blue-700 font-semibold mb-4">
                                                    Provider: {resource.provider || 'CareerSync Academy'}
                                                </div>
                                            </div>

                                            <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                                                <span className="text-xs font-bold text-gray-600">
                                                    {resource.isFree ? 'Free Access' : 'Sponsored'}
                                                </span>

                                                <button
                                                    onClick={() => handleEnroll(resource._id, resource.url)}
                                                    disabled={enrollingId === resource._id}
                                                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center ${
                                                        isEnrolled 
                                                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                                                            : 'bg-blue-600 text-white hover:bg-blue-700'
                                                    }`}
                                                >
                                                    {isEnrolled ? (
                                                        <>
                                                            <Check className="w-3.5 h-3.5 mr-1" />
                                                            Enrolled / Open
                                                        </>
                                                    ) : (
                                                        <>
                                                            <ExternalLink className="w-3.5 h-3.5 mr-1" />
                                                            {enrollingId === resource._id ? 'Enrolling...' : 'Enroll Now'}
                                                        </>
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}

                                {learningResources.length === 0 && (
                                    <div className="col-span-3 text-center py-12 text-gray-500">
                                        No courses currently available.
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* TAB 4: CAMPUS SKILL LEADERBOARD & TALENT RANKINGS */}
                    {activeTab === 'leaderboard' && (
                        <div className="space-y-8">
                            {/* Leaderboard Hero Banner */}
                            <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 rounded-2xl p-6 sm:p-8 text-white relative overflow-hidden shadow-xl border border-indigo-900/50">
                                <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-blue-600/20 blur-3xl pointer-events-none"></div>
                                <div className="absolute bottom-0 left-1/3 -mb-12 w-48 h-48 rounded-full bg-amber-500/10 blur-2xl pointer-events-none"></div>

                                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                                    <div className="max-w-2xl">
                                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold mb-3">
                                            <Trophy className="w-3.5 h-3.5 text-amber-400" />
                                            Live Campus Talent Index
                                        </div>
                                        <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-2">
                                            Skill Leaderboard & Candidate Rankings
                                        </h3>
                                        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                                            Rankings dynamically computed using anti-cheat proctored assessments, verified skill proficiencies, production projects, and recruiter ATS resume readiness.
                                        </p>
                                    </div>

                                    {/* Action Refresh Button */}
                                    <button
                                        onClick={() => fetchLeaderboard(selectedDept)}
                                        disabled={leaderboardLoading}
                                        className="self-start md:self-auto inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-bold transition-all backdrop-blur-sm disabled:opacity-50"
                                    >
                                        <RefreshCw className={`w-3.5 h-3.5 ${leaderboardLoading ? 'animate-spin' : ''}`} />
                                        Sync Live Standings
                                    </button>
                                </div>
                            </div>

                            {/* Department Filters & Search Controls */}
                            <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
                                <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
                                    <Filter className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                    {['All', 'Computer Science & Engineering', 'Information Technology', 'Electronics & Communication'].map(dept => (
                                        <button
                                            key={dept}
                                            onClick={() => {
                                                setSelectedDept(dept);
                                                fetchLeaderboard(dept);
                                            }}
                                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                                                selectedDept === dept
                                                    ? 'bg-blue-600 text-white shadow-sm'
                                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                            }`}
                                        >
                                            {dept === 'All' ? 'All Departments' : dept.split(' ')[0]}
                                        </button>
                                    ))}
                                </div>

                                <div className="relative w-full md:w-72">
                                    <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                    <input
                                        type="text"
                                        placeholder="Search candidate or skill..."
                                        value={leaderboardSearch}
                                        onChange={(e) => setLeaderboardSearch(e.target.value)}
                                        className="w-full pl-9 pr-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                                    />
                                </div>
                            </div>

                            {/* TOP 3 PODIUM */}
                            {leaderboard.length >= 3 && !leaderboardSearch && (
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 items-end">
                                    {/* 2nd Place (Silver) */}
                                    <div className="order-2 md:order-1 bg-white rounded-2xl border-2 border-slate-200 p-6 shadow-sm flex flex-col items-center text-center relative hover:shadow-md transition-shadow">
                                        <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center font-black text-lg border-2 border-slate-300 absolute -top-6 shadow-md">
                                            2
                                        </div>
                                        <div className="mt-4 mb-2">
                                            <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold uppercase tracking-wider mb-2">
                                                <Medal className="w-3 h-3 text-slate-500" /> Silver Tier
                                            </div>
                                            <h4 className="text-base font-bold text-gray-900">{leaderboard[1]?.name}</h4>
                                            <p className="text-xs text-gray-500">{leaderboard[1]?.department}</p>
                                        </div>

                                        <div className="w-full bg-slate-50 rounded-xl p-3 my-3 border border-slate-100 space-y-1.5 text-xs">
                                            <div className="flex justify-between text-gray-600">
                                                <span>Verified Badges:</span>
                                                <span className="font-bold text-gray-900 flex items-center gap-1">
                                                    <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                                                    {leaderboard[1]?.verifiedSkillsCount}
                                                </span>
                                            </div>
                                            <div className="flex justify-between text-gray-600">
                                                <span>ATS Score:</span>
                                                <span className="font-bold text-emerald-600">{leaderboard[1]?.atsScore}%</span>
                                            </div>
                                            <div className="flex justify-between text-gray-600">
                                                <span>Placement Index:</span>
                                                <span className="font-black text-slate-900">{leaderboard[1]?.rankScore} pts</span>
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap justify-center gap-1.5 mt-1">
                                            {(leaderboard[1]?.topSkills || []).slice(0, 3).map((skill, idx) => (
                                                <span key={idx} className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-medium">
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>

                                        {leaderboard[1]?.portfolioSlug && (
                                            <a
                                                href={`/portfolio/${leaderboard[1].portfolioSlug}`}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-800"
                                            >
                                                View Portfolio <ExternalLink className="w-3 h-3" />
                                            </a>
                                        )}
                                    </div>

                                    {/* 1st Place (Gold) - Highlighted */}
                                    <div className="order-1 md:order-2 bg-gradient-to-b from-amber-50/70 to-white rounded-2xl border-2 border-amber-400 p-6 shadow-xl flex flex-col items-center text-center relative -translate-y-2 hover:shadow-2xl transition-all">
                                        <div className="w-14 h-14 rounded-full bg-amber-400 text-amber-950 flex items-center justify-center font-black text-xl border-4 border-white absolute -top-7 shadow-lg">
                                            👑
                                        </div>
                                        <div className="mt-5 mb-2">
                                            <div className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[11px] font-extrabold uppercase tracking-wider mb-2 border border-amber-300">
                                                <Crown className="w-3.5 h-3.5 text-amber-600" /> Rank #1 Champion
                                            </div>
                                            <h4 className="text-lg font-black text-gray-900 flex items-center justify-center gap-1.5">
                                                {leaderboard[0]?.name}
                                                {leaderboard[0]?.isCurrentStudent && (
                                                    <span className="text-[10px] bg-blue-600 text-white px-2 py-0.5 rounded-full font-bold">You</span>
                                                )}
                                            </h4>
                                            <p className="text-xs text-gray-500 font-medium">{leaderboard[0]?.department}</p>
                                        </div>

                                        <div className="w-full bg-amber-50/60 rounded-xl p-3.5 my-3 border border-amber-200/80 space-y-2 text-xs">
                                            <div className="flex justify-between text-gray-700">
                                                <span className="font-medium">Verified Badges:</span>
                                                <span className="font-bold text-gray-900 flex items-center gap-1">
                                                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                                                    {leaderboard[0]?.verifiedSkillsCount} Badges
                                                </span>
                                            </div>
                                            <div className="flex justify-between text-gray-700">
                                                <span className="font-medium">ATS Readiness:</span>
                                                <span className="font-black text-emerald-700">{leaderboard[0]?.atsScore}%</span>
                                            </div>
                                            <div className="flex justify-between text-gray-700 pt-1 border-t border-amber-200/60">
                                                <span className="font-bold text-gray-900">Total Placement Score:</span>
                                                <span className="font-black text-amber-900 text-sm flex items-center gap-1">
                                                    <Flame className="w-4 h-4 text-amber-600 fill-amber-500" />
                                                    {leaderboard[0]?.rankScore} pts
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap justify-center gap-1.5 mt-1">
                                            {(leaderboard[0]?.topSkills || []).map((skill, idx) => (
                                                <span key={idx} className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 text-[10px] font-semibold">
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>

                                        {leaderboard[0]?.portfolioSlug && (
                                            <a
                                                href={`/portfolio/${leaderboard[0].portfolioSlug}`}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="mt-4 w-full py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-blue-500/20"
                                            >
                                                Inspect Verified Portfolio <ExternalLink className="w-3.5 h-3.5" />
                                            </a>
                                        )}
                                    </div>

                                    {/* 3rd Place (Bronze) */}
                                    <div className="order-3 bg-white rounded-2xl border-2 border-amber-800/30 p-6 shadow-sm flex flex-col items-center text-center relative hover:shadow-md transition-shadow">
                                        <div className="w-12 h-12 rounded-full bg-amber-900/10 text-amber-900 flex items-center justify-center font-black text-lg border-2 border-amber-800/40 absolute -top-6 shadow-md">
                                            3
                                        </div>
                                        <div className="mt-4 mb-2">
                                            <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-800/10 text-amber-900 text-[10px] font-bold uppercase tracking-wider mb-2">
                                                <Medal className="w-3 h-3 text-amber-800" /> Bronze Tier
                                            </div>
                                            <h4 className="text-base font-bold text-gray-900">{leaderboard[2]?.name}</h4>
                                            <p className="text-xs text-gray-500">{leaderboard[2]?.department}</p>
                                        </div>

                                        <div className="w-full bg-slate-50 rounded-xl p-3 my-3 border border-slate-100 space-y-1.5 text-xs">
                                            <div className="flex justify-between text-gray-600">
                                                <span>Verified Badges:</span>
                                                <span className="font-bold text-gray-900 flex items-center gap-1">
                                                    <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                                                    {leaderboard[2]?.verifiedSkillsCount}
                                                </span>
                                            </div>
                                            <div className="flex justify-between text-gray-600">
                                                <span>ATS Score:</span>
                                                <span className="font-bold text-emerald-600">{leaderboard[2]?.atsScore}%</span>
                                            </div>
                                            <div className="flex justify-between text-gray-600">
                                                <span>Placement Index:</span>
                                                <span className="font-black text-slate-900">{leaderboard[2]?.rankScore} pts</span>
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap justify-center gap-1.5 mt-1">
                                            {(leaderboard[2]?.topSkills || []).slice(0, 3).map((skill, idx) => (
                                                <span key={idx} className="px-2 py-0.5 rounded-md bg-amber-900/10 text-amber-900 text-[10px] font-medium">
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>

                                        {leaderboard[2]?.portfolioSlug && (
                                            <a
                                                href={`/portfolio/${leaderboard[2].portfolioSlug}`}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-800"
                                            >
                                                View Portfolio <ExternalLink className="w-3 h-3" />
                                            </a>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* COMPLETE RANKINGS TABLE */}
                            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                                <div className="p-4 sm:p-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gray-50/50">
                                    <div>
                                        <h4 className="text-sm font-bold text-gray-900">Campus Placement Standings</h4>
                                        <p className="text-xs text-gray-500">
                                            Showing {leaderboard.filter(i => !leaderboardSearch || i.name.toLowerCase().includes(leaderboardSearch.toLowerCase()) || (i.topSkills || []).some(s => s.toLowerCase().includes(leaderboardSearch.toLowerCase()))).length} candidates for {selectedDept === 'All' ? 'All Departments' : selectedDept}
                                        </p>
                                    </div>
                                    <div className="text-xs text-gray-500 flex items-center gap-1.5">
                                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                        Live Synced with Student Portfolios
                                    </div>
                                </div>

                                <div className="overflow-x-auto">
                                    <table className="w-full text-left text-xs">
                                        <thead className="bg-gray-50/80 text-gray-500 font-bold border-b border-gray-200 uppercase tracking-wider text-[11px]">
                                            <tr>
                                                <th className="py-3 px-4 text-center">Rank</th>
                                                <th className="py-3 px-4">Candidate Scholar</th>
                                                <th className="py-3 px-4">Department & CGPA</th>
                                                <th className="py-3 px-4">Verified Badges</th>
                                                <th className="py-3 px-4">Key Proficiencies</th>
                                                <th className="py-3 px-4 text-center">ATS Score</th>
                                                <th className="py-3 px-4 text-right">Placement Score</th>
                                                <th className="py-3 px-4 text-center">Portfolio</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            {leaderboard
                                                .filter(item => {
                                                    if (!leaderboardSearch) return true;
                                                    const q = leaderboardSearch.toLowerCase();
                                                    return item.name.toLowerCase().includes(q) || (item.topSkills || []).some(s => s.toLowerCase().includes(q));
                                                })
                                                .map((item) => {
                                                    const isTop1 = item.rank === 1;
                                                    const isTop2 = item.rank === 2;
                                                    const isTop3 = item.rank === 3;

                                                    return (
                                                        <tr 
                                                            key={item.studentId || item.rank}
                                                            className={`hover:bg-blue-50/40 transition-colors ${
                                                                item.isCurrentStudent ? 'bg-blue-50/80 font-medium' : ''
                                                            }`}
                                                        >
                                                            {/* Rank Column */}
                                                            <td className="py-3.5 px-4 text-center">
                                                                {isTop1 && <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-amber-400 text-amber-950 font-black text-xs shadow-sm">👑 1</span>}
                                                                {isTop2 && <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-slate-200 text-slate-800 font-bold text-xs">🥈 2</span>}
                                                                {isTop3 && <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-amber-900/10 text-amber-900 font-bold text-xs">🥉 3</span>}
                                                                {!isTop1 && !isTop2 && !isTop3 && (
                                                                    <span className="font-bold text-gray-500">#{item.rank}</span>
                                                                )}
                                                            </td>

                                                            {/* Candidate Scholar */}
                                                            <td className="py-3.5 px-4">
                                                                <div className="flex items-center gap-2.5">
                                                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                                                                        item.isCurrentStudent 
                                                                            ? 'bg-blue-600 text-white' 
                                                                            : 'bg-gray-100 text-gray-700'
                                                                    }`}>
                                                                        {item.name.charAt(0)}
                                                                    </div>
                                                                    <div>
                                                                        <div className="font-bold text-gray-900 flex items-center gap-1.5">
                                                                            {item.name}
                                                                            {item.isCurrentStudent && (
                                                                                <span className="text-[10px] bg-blue-600 text-white px-1.5 py-0.2 rounded font-bold">You</span>
                                                                            )}
                                                                        </div>
                                                                        <div className="text-[11px] text-gray-500">{item.projectsCount} Projects • {item.certificationsCount || 0} Certs</div>
                                                                    </div>
                                                                </div>
                                                            </td>

                                                            {/* Department & CGPA */}
                                                            <td className="py-3.5 px-4">
                                                                <div className="text-gray-900 font-medium">{item.department}</div>
                                                                <div className="text-gray-500 text-[11px]">CGPA: <span className="font-semibold text-gray-700">{item.cgpa}</span></div>
                                                            </td>

                                                            {/* Verified Badges */}
                                                            <td className="py-3.5 px-4">
                                                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold">
                                                                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                                                                    {item.verifiedSkillsCount} Badges
                                                                </span>
                                                            </td>

                                                            {/* Top Skills */}
                                                            <td className="py-3.5 px-4">
                                                                <div className="flex flex-wrap gap-1 max-w-xs">
                                                                    {(item.topSkills || []).map((skill, sIdx) => (
                                                                        <span key={sIdx} className="px-2 py-0.5 rounded bg-gray-100 text-gray-700 text-[10px] font-medium">
                                                                            {skill}
                                                                        </span>
                                                                    ))}
                                                                </div>
                                                            </td>

                                                            {/* ATS Score */}
                                                            <td className="py-3.5 px-4 text-center">
                                                                <span className={`font-bold px-2 py-0.5 rounded-full text-xs ${
                                                                    (item.atsScore || 70) >= 85 
                                                                        ? 'bg-emerald-100 text-emerald-800' 
                                                                        : (item.atsScore || 70) >= 70 
                                                                            ? 'bg-blue-100 text-blue-800' 
                                                                            : 'bg-amber-100 text-amber-800'
                                                                }`}>
                                                                    {item.atsScore || 70}%
                                                                </span>
                                                            </td>

                                                            {/* Placement Score */}
                                                            <td className="py-3.5 px-4 text-right">
                                                                <div className="font-black text-gray-900 text-sm">{item.rankScore}</div>
                                                                <div className="text-[10px] text-gray-400">Index Points</div>
                                                            </td>

                                                            {/* Portfolio Link */}
                                                            <td className="py-3.5 px-4 text-center">
                                                                {item.portfolioSlug ? (
                                                                    <a
                                                                        href={`/portfolio/${item.portfolioSlug}`}
                                                                        target="_blank"
                                                                        rel="noreferrer"
                                                                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 font-bold text-[11px] transition-colors"
                                                                    >
                                                                        View <ExternalLink className="w-3 h-3" />
                                                                    </a>
                                                                ) : (
                                                                    <span className="text-gray-400 text-[11px] italic">Private</span>
                                                                )}
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Transparent Scoring Rubric Breakdown */}
                            <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 text-xs text-gray-600">
                                <h5 className="font-bold text-gray-900 text-sm mb-2 flex items-center gap-2">
                                    <Sparkles className="w-4 h-4 text-blue-600" />
                                    CareerSync Placement Index Computation Formula
                                </h5>
                                <p className="mb-3 text-gray-600 leading-relaxed">
                                    To eliminate subjective shortlisting bias, CareerSync ranks candidates transparently using four multi-dimensional academic and technical vectors:
                                </p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                                    <div className="bg-white p-3 rounded-lg border border-slate-200">
                                        <div className="font-bold text-gray-900 mb-0.5">Verified Badges</div>
                                        <div className="text-blue-600 font-semibold">+50 pts / badge</div>
                                        <div className="text-[11px] text-gray-500 mt-1">Requires ≥ 70% in anti-cheat proctored assessments</div>
                                    </div>
                                    <div className="bg-white p-3 rounded-lg border border-slate-200">
                                        <div className="font-bold text-gray-900 mb-0.5">Industry Projects</div>
                                        <div className="text-blue-600 font-semibold">+15 pts / project</div>
                                        <div className="text-[11px] text-gray-500 mt-1">Live deployed projects with verified code repos</div>
                                    </div>
                                    <div className="bg-white p-3 rounded-lg border border-slate-200">
                                        <div className="font-bold text-gray-900 mb-0.5">Certifications</div>
                                        <div className="text-blue-600 font-semibold">+20 pts / credential</div>
                                        <div className="text-[11px] text-gray-500 mt-1">Accredited university and industry certificates</div>
                                    </div>
                                    <div className="bg-white p-3 rounded-lg border border-slate-200">
                                        <div className="font-bold text-gray-900 mb-0.5">ATS Resume Readiness</div>
                                        <div className="text-blue-600 font-semibold">+0.5x ATS Score</div>
                                        <div className="text-[11px] text-gray-500 mt-1">Industry standard keyword and format compliance</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </motion.div>
            </AnimatePresence>

            {/* ---------------------------------------------------- */}
            {/* FULL-SCREEN INTERACTIVE ASSESSMENT / QUIZ MODAL */}
            {/* ---------------------------------------------------- */}
            {activeQuiz && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
                        {/* Quiz Modal Header */}
                        <div className="p-5 border-b border-gray-200 flex items-center justify-between bg-gray-50">
                            <div>
                                <h3 className="font-bold text-gray-900 text-base">{activeQuiz.title}</h3>
                                <div className="text-xs text-gray-500 mt-0.5">Anti-Cheat Proctoring Active</div>
                            </div>

                            <div className="flex items-center gap-4">
                                {/* Timer */}
                                <div className={`flex items-center px-3 py-1 rounded-full text-xs font-bold ${
                                    timeLeft < 60 ? 'bg-red-100 text-red-700 animate-pulse' : 'bg-blue-100 text-blue-700'
                                }`}>
                                    <Clock className="w-3.5 h-3.5 mr-1" />
                                    {formatTime(timeLeft)}
                                </div>

                                <button 
                                    onClick={handleCloseQuiz}
                                    className="text-gray-400 hover:text-gray-600 p-1"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {/* Anti-cheat tab switch warning if triggered */}
                        {tabSwitches > 0 && !quizResult && (
                            <div className="bg-amber-50 border-b border-amber-200 px-5 py-2 text-xs font-semibold text-amber-800 flex items-center">
                                <ShieldAlert className="w-4 h-4 mr-2 text-amber-600" />
                                Warning: {tabSwitches} window focus switch detected. Integrity score recorded.
                            </div>
                        )}

                        {/* Modal Body: Active Question vs Results */}
                        <div className="p-6 overflow-y-auto flex-1">
                            {!quizResult ? (
                                activeQuiz.questions && activeQuiz.questions.length > 0 ? (
                                    <div>
                                        <div className="flex items-center justify-between text-xs text-gray-500 font-semibold mb-4">
                                            <span>Question {currentQIndex + 1} of {activeQuiz.questions.length}</span>
                                            <span>Passing Score: {activeQuiz.passingScorePercentage || 70}%</span>
                                        </div>

                                        {/* Question Text */}
                                        <div className="text-base font-bold text-gray-900 mb-6 leading-relaxed">
                                            {activeQuiz.questions[currentQIndex]?.questionText}
                                        </div>

                                        {/* Options */}
                                        <div className="space-y-3 mb-6">
                                            {activeQuiz.questions[currentQIndex]?.options.map((opt, optIdx) => {
                                                const qId = activeQuiz.questions[currentQIndex]._id;
                                                const isSelected = quizAnswers[qId] === optIdx;
                                                return (
                                                    <button
                                                        key={optIdx}
                                                        onClick={() => handleSelectOption(qId, optIdx)}
                                                        className={`w-full text-left p-4 rounded-xl border text-sm font-medium transition-all flex items-center ${
                                                            isSelected 
                                                                ? 'border-blue-600 bg-blue-50/70 text-blue-900 font-bold ring-2 ring-blue-100'
                                                                : 'border-gray-200 hover:border-gray-300 bg-white text-gray-800'
                                                        }`}
                                                    >
                                                        <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 text-xs font-bold ${
                                                            isSelected ? 'bg-blue-600 text-white' : 'border border-gray-300 text-gray-500'
                                                        }`}>
                                                            {String.fromCharCode(65 + optIdx)}
                                                        </div>
                                                        <span>{opt}</span>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center py-12 text-gray-500">
                                        No questions loaded for this assessment.
                                    </div>
                                )
                            ) : (
                                /* Result View */
                                <div className="text-center py-6">
                                    <div className={`w-16 h-16 rounded-full mx-auto flex items-center justify-center mb-4 ${
                                        quizResult.passed ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'
                                    }`}>
                                        {quizResult.passed ? <CheckCircle className="w-10 h-10" /> : <X className="w-10 h-10" />}
                                    </div>

                                    <h3 className="text-2xl font-bold text-gray-900 mb-1">
                                        {quizResult.passed ? 'Assessment Passed!' : 'Assessment Not Cleared'}
                                    </h3>
                                    <p className="text-sm text-gray-600 mb-6">
                                        You scored <strong>{quizResult.percentage}%</strong> ({quizResult.marksObtained} / {quizResult.totalMarks} points).
                                    </p>

                                    {quizResult.badgeAwarded && (
                                        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl mb-6 inline-flex items-center gap-3 text-left">
                                            <Award className="w-8 h-8 text-emerald-600" />
                                            <div>
                                                <div className="text-xs font-bold text-emerald-900">Verified Badge Issued!</div>
                                                <div className="text-xs text-emerald-700">Added to your verified profile and ATS portfolio.</div>
                                            </div>
                                        </div>
                                    )}

                                    <div>
                                        <button
                                            onClick={handleCloseQuiz}
                                            className="px-6 py-2.5 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 text-sm shadow-sm"
                                        >
                                            Return to Skill Center
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Quiz Modal Footer with Next / Prev / Submit */}
                        {!quizResult && (
                            <div className="p-4 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
                                <button
                                    onClick={() => setCurrentQIndex(prev => Math.max(0, prev - 1))}
                                    disabled={currentQIndex === 0}
                                    className="px-4 py-2 rounded-lg text-xs font-bold text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 disabled:opacity-40"
                                >
                                    Previous
                                </button>

                                <div className="flex gap-2">
                                    {currentQIndex < (activeQuiz.questions?.length || 1) - 1 ? (
                                        <button
                                            onClick={() => setCurrentQIndex(prev => prev + 1)}
                                            className="px-5 py-2 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-700"
                                        >
                                            Next Question
                                        </button>
                                    ) : (
                                        <button
                                            onClick={handleSubmitQuiz}
                                            disabled={isSubmitting}
                                            className="px-6 py-2 bg-emerald-600 text-white rounded-lg text-xs font-bold hover:bg-emerald-700 shadow-md"
                                        >
                                            {isSubmitting ? 'Evaluating...' : 'Submit Assessment'}
                                        </button>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default SkillCenter;
