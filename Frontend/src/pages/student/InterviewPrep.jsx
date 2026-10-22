import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    MessageSquare, Video, FileQuestion, Star, Clock, 
    Play, Sparkles, X, CheckCircle, ChevronRight, HelpCircle
} from 'lucide-react';

const InterviewPrep = () => {
    const modules = [
        { 
            id: 1, 
            title: 'Behavioral Interviews (STAR Method)', 
            type: 'STAR Guide', 
            time: '15 mins', 
            rating: 4.8,
            questions: [
                'Tell me about a time you had to deal with a difficult team member or conflict.',
                'Describe a project where you faced a significant obstacle and how you overcame it.',
                'Give an example of a goal you reached and tell me how you achieved it.'
            ],
            tips: 'Structure your responses using Situation, Task, Action, and Result to convey maximum measurable impact.'
        },
        { 
            id: 2, 
            title: 'System Design Mock Interview', 
            type: 'AI Simulation', 
            time: '45 mins', 
            rating: 4.9,
            questions: [
                'Design a scalable URL shortener service (like TinyURL) handling 100M daily writes.',
                'Architect a distributed rate limiter for a public REST API.',
                'How would you design a real-time notification service across mobile and web?'
            ],
            tips: 'Start with requirement clarifications, calculate rough scale numbers, and design the high-level architecture before drilling into bottlenecks.'
        },
        { 
            id: 3, 
            title: 'Data Structures & Algorithms Room', 
            type: 'Practice Set', 
            time: '60 mins', 
            rating: 4.7,
            questions: [
                'Given an array of integers, return indices of the two numbers that add up to a target.',
                'Reverse a singly linked list iteratively and recursively in O(n) time.',
                'Find the longest palindromic substring in a string.'
            ],
            tips: 'Always communicate your thought process out loud. State the brute force approach first before optimizing time and space complexity.'
        },
        { 
            id: 4, 
            title: 'React.js Technical Screening', 
            type: 'AI Simulation', 
            time: '30 mins', 
            rating: 4.5,
            questions: [
                'Explain how React Reconciliation and the Virtual DOM diffing algorithm function.',
                'What are the performance implications of useCallback and useMemo? When should you avoid them?',
                'How does Concurrent Mode and startTransition prevent blocking UI threads during heavy renders?'
            ],
            tips: 'Focus on state management, hooks lifecycle, re-render triggers, and practical debugging patterns.'
        }
    ];

    const [activeModule, setActiveModule] = useState(null);
    const [currentQIndex, setCurrentQIndex] = useState(0);
    const [userNotes, setUserNotes] = useState('');
    const [completedMap, setCompletedMap] = useState({});

    const handleStart = (mod) => {
        setActiveModule(mod);
        setCurrentQIndex(0);
        setUserNotes('');
    };

    const handleFinish = () => {
        if (activeModule) {
            setCompletedMap(prev => ({ ...prev, [activeModule.id]: true }));
        }
        setActiveModule(null);
    };

    return (
        <div className="max-w-6xl mx-auto pb-12">
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 tracking-tight flex items-center">
                    <MessageSquare className="w-8 h-8 mr-3 text-blue-600" />
                    Interview Preparation Room
                </h2>
                <p className="text-gray-600 text-sm mt-1">
                    Practice with AI mock interview simulations and curated question banks to ace technical and behavioral rounds.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {modules.map(mod => {
                    const isDone = completedMap[mod.id];
                    return (
                        <div 
                            key={mod.id} 
                            className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md hover:border-blue-300 transition-all flex flex-col justify-between"
                        >
                            <div>
                                <div className="flex justify-between items-start mb-3">
                                    <span className="bg-blue-50 text-blue-700 border border-blue-200 px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider">
                                        {mod.type}
                                    </span>
                                    <span className="flex items-center text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                                        <Star className="w-3.5 h-3.5 mr-1 fill-amber-500 text-amber-500" />
                                        {mod.rating}
                                    </span>
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 mb-2">{mod.title}</h3>
                                <p className="text-xs text-gray-500 flex items-center mb-6">
                                    <Clock className="w-3.5 h-3.5 mr-1 text-gray-400" />
                                    Estimated Duration: {mod.time}
                                </p>
                            </div>

                            <button 
                                onClick={() => handleStart(mod)}
                                className={`w-full flex justify-center items-center py-2.5 rounded-lg text-xs font-bold transition-all shadow-sm ${
                                    isDone 
                                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                                        : 'bg-blue-600 text-white hover:bg-blue-700 active:scale-95'
                                }`}
                            >
                                {isDone ? (
                                    <>
                                        <CheckCircle className="w-4 h-4 mr-1.5 text-emerald-600" />
                                        Completed (Practice Again)
                                    </>
                                ) : (
                                    <>
                                        <Play className="w-3.5 h-3.5 mr-1.5 fill-current" />
                                        Start Practice Session
                                    </>
                                )}
                            </button>
                        </div>
                    );
                })}
            </div>

            {/* INTERVIEW PRACTICE SIMULATION MODAL */}
            {activeModule && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full overflow-hidden animate-in fade-in zoom-in duration-200 flex flex-col max-h-[90vh]">
                        <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-gray-50">
                            <div>
                                <h3 className="font-bold text-gray-900 text-base">{activeModule.title}</h3>
                                <p className="text-xs text-blue-600 font-semibold">{activeModule.type}</p>
                            </div>
                            <button onClick={() => setActiveModule(null)} className="text-gray-400 hover:text-gray-600">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-6 overflow-y-auto space-y-5">
                            <div className="flex items-center justify-between text-xs font-semibold text-gray-500">
                                <span>Question {currentQIndex + 1} of {activeModule.questions.length}</span>
                                <span className="text-amber-600 flex items-center">
                                    <Sparkles className="w-3.5 h-3.5 mr-1" />
                                    AI Evaluated
                                </span>
                            </div>

                            <div className="bg-blue-50/70 border border-blue-200 p-4 rounded-xl text-gray-900 font-bold text-base leading-relaxed">
                                {activeModule.questions[currentQIndex]}
                            </div>

                            <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 leading-relaxed">
                                <strong className="font-bold">Interviewer Tip:</strong> {activeModule.tips}
                            </div>

                            <div>
                                <label className="block text-gray-700 text-xs font-bold mb-1.5">Draft Your Response or Speaking Notes</label>
                                <textarea
                                    rows="4"
                                    className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl p-3 text-xs focus:bg-white focus:border-blue-500 outline-none resize-none leading-relaxed"
                                    placeholder="Type your structured answer here (e.g. In my last internship at...)"
                                    value={userNotes}
                                    onChange={e => setUserNotes(e.target.value)}
                                ></textarea>
                            </div>
                        </div>

                        <div className="p-4 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
                            <button
                                onClick={() => setCurrentQIndex(prev => Math.max(0, prev - 1))}
                                disabled={currentQIndex === 0}
                                className="px-4 py-2 rounded-lg text-xs font-bold text-gray-600 hover:bg-gray-100 disabled:opacity-40"
                            >
                                Previous
                            </button>

                            {currentQIndex < activeModule.questions.length - 1 ? (
                                <button
                                    onClick={() => setCurrentQIndex(prev => prev + 1)}
                                    className="px-5 py-2 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-700 flex items-center"
                                >
                                    Next Question
                                    <ChevronRight className="w-4 h-4 ml-1" />
                                </button>
                            ) : (
                                <button
                                    onClick={handleFinish}
                                    className="px-6 py-2 bg-emerald-600 text-white rounded-lg text-xs font-bold hover:bg-emerald-700 shadow-sm"
                                >
                                    Complete Session
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default InterviewPrep;
