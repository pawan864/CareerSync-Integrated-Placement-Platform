import React, { useState } from 'react';
import { Users, Calendar, MessageSquare, Check, X, Sparkles } from 'lucide-react';

const Mentorship = () => {
    const mentors = [
        {
            id: 1,
            name: 'Sarah Jenkins',
            title: 'Staff Software Engineer',
            company: 'Netflix',
            bio: 'Expertise in high-throughput distributed systems and React performance engineering.',
            initials: 'SJ'
        },
        {
            id: 2,
            name: 'David Chen',
            title: 'Lead Cloud Architect',
            company: 'Google Cloud',
            bio: 'Advising students on Kubernetes, Docker cluster scaling, and cloud certification pathways.',
            initials: 'DC'
        },
        {
            id: 3,
            name: 'Priya Sharma',
            title: 'Head of Engineering',
            company: 'Fintech Corp',
            bio: 'Specialist in backend microservices, SQL indexing optimizations, and tech interview strategy.',
            initials: 'PS'
        }
    ];

    const [requestingMentor, setRequestingMentor] = useState(null);
    const [topic, setTopic] = useState('Career advice & code review');
    const [confirmedId, setConfirmedId] = useState(null);

    const handleConfirmRequest = () => {
        if (requestingMentor) {
            setConfirmedId(requestingMentor.id);
            setRequestingMentor(null);
        }
    };

    return (
        <div className="max-w-6xl mx-auto pb-12">
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 tracking-tight flex items-center">
                    <Users className="w-8 h-8 mr-3 text-blue-600" />
                    Industry Mentorship Network
                </h2>
                <p className="text-gray-600 text-sm mt-1">
                    Book 1-on-1 virtual mentoring sessions with verified senior engineers and technology leaders.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {mentors.map(mentor => {
                    const isRequested = confirmedId === mentor.id;
                    return (
                        <div key={mentor.id} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm text-center flex flex-col justify-between hover:border-blue-300 hover:shadow-md transition-all">
                            <div>
                                <div className="w-16 h-16 bg-blue-100 text-blue-700 border border-blue-200 rounded-full mx-auto flex items-center justify-center font-bold text-xl mb-4 shadow-sm">
                                    {mentor.initials}
                                </div>
                                <h3 className="text-lg font-bold text-gray-900">{mentor.name}</h3>
                                <p className="text-xs font-semibold text-blue-600 mb-2">{mentor.title} @ {mentor.company}</p>
                                <p className="text-xs text-gray-500 mb-6 px-1 leading-relaxed">{mentor.bio}</p>
                            </div>

                            <button 
                                onClick={() => setRequestingMentor(mentor)}
                                disabled={isRequested}
                                className={`w-full py-2.5 rounded-lg font-bold text-xs transition-all shadow-sm flex items-center justify-center ${
                                    isRequested 
                                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 cursor-default'
                                        : 'bg-blue-600 text-white hover:bg-blue-700 active:scale-95'
                                }`}
                            >
                                {isRequested ? (
                                    <>
                                        <Check className="w-3.5 h-3.5 mr-1.5 text-emerald-600" />
                                        Session Requested
                                    </>
                                ) : (
                                    'Request 1:1 Session'
                                )}
                            </button>
                        </div>
                    );
                })}
            </div>

            {/* REQUEST MODAL */}
            {requestingMentor && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in duration-150">
                        <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-gray-50">
                            <h3 className="font-bold text-gray-900 text-base">Request Session with {requestingMentor.name}</h3>
                            <button onClick={() => setRequestingMentor(null)} className="text-gray-400 hover:text-gray-600">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-6 space-y-4 text-xs">
                            <div>
                                <label className="block text-gray-700 font-bold mb-1.5">Discussion Topic / Agenda</label>
                                <input 
                                    type="text" 
                                    className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-lg p-2.5 text-xs focus:bg-white focus:border-blue-500 outline-none"
                                    value={topic}
                                    onChange={e => setTopic(e.target.value)}
                                />
                            </div>

                            <p className="text-gray-500">
                                Your mentor will be notified and an invitation link will be sent to your student email.
                            </p>
                        </div>

                        <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-2">
                            <button onClick={() => setRequestingMentor(null)} className="px-4 py-2 text-xs font-bold text-gray-600 hover:bg-gray-100 rounded-lg">
                                Cancel
                            </button>
                            <button onClick={handleConfirmRequest} className="px-5 py-2 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-700">
                                Confirm Request
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Mentorship;
