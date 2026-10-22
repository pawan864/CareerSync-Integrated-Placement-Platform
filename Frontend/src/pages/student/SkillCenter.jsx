import React, { useState, useEffect, useRef } from 'react';
import api from '../../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    BrainCircuit, Target, BookOpen, CheckCircle, 
    PlayCircle, TrendingUp, AlertTriangle, Lightbulb,
    Clock, Award, ArrowRight, Check, X, ShieldAlert, Sparkles,
    ChevronRight, ExternalLink, RefreshCw
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

    useEffect(() => {
        fetchAssessmentsAndHistory();
        fetchRolesAndGap();
        fetchLearningHub();
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
                
                <div className="flex bg-white rounded-lg p-1 border border-gray-200 shadow-sm">
                    {['assessments', 'analysis', 'learning'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-4 py-2 rounded-md text-xs font-bold transition-all ${
                                activeTab === tab 
                                    ? 'bg-blue-600 text-white shadow-sm' 
                                    : 'text-gray-600 hover:text-gray-900'
                            }`}
                        >
                            {tab === 'assessments' && '1. Skill Assessments'}
                            {tab === 'analysis' && '2. Gap Analysis'}
                            {tab === 'learning' && '3. Learning Path'}
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
