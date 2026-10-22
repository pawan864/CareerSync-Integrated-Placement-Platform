import React, { useState } from 'react';
import { HelpCircle, LifeBuoy, Send, CheckCircle2, MessageSquare, X } from 'lucide-react';

const DashboardSupport = () => {
    const [ticketModal, setTicketModal] = useState(false);
    const [subject, setSubject] = useState('');
    const [description, setDescription] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitted(true);
        setTimeout(() => {
            setSubmitted(false);
            setTicketModal(false);
            setSubject('');
            setDescription('');
        }, 2000);
    };

    return (
        <div className="max-w-4xl mx-auto pb-12">
            <div className="mb-8 text-center">
                <h2 className="text-3xl font-bold text-gray-900 tracking-tight flex items-center justify-center">
                    <LifeBuoy className="w-8 h-8 mr-3 text-blue-600" />
                    CareerSync Student Support
                </h2>
                <p className="text-gray-600 text-sm mt-1">Get immediate technical assistance with your profile, tests, or placements.</p>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-8 text-center flex flex-col items-center">
                <div className="w-16 h-16 bg-blue-50 text-blue-600 border border-blue-200 rounded-2xl flex items-center justify-center mb-4 shadow-sm">
                    <HelpCircle className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Technical Assistance Desk</h3>
                <p className="text-gray-500 mb-6 max-w-md text-xs leading-relaxed">
                    Our platform support engineers and university placement officers are available to resolve test anomalies, account access, or resume verification inquiries.
                </p>
                <button 
                    onClick={() => setTicketModal(true)}
                    className="bg-blue-600 text-white px-6 py-2.5 rounded-lg font-bold text-xs hover:bg-blue-700 shadow-sm transition-all active:scale-95"
                >
                    Open a Support Ticket
                </button>
            </div>

            {/* SUPPORT TICKET MODAL */}
            {ticketModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in duration-150">
                        <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-gray-50">
                            <h3 className="font-bold text-gray-900 text-sm">Create New Support Ticket</h3>
                            <button onClick={() => setTicketModal(false)} className="text-gray-400 hover:text-gray-600">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {submitted ? (
                            <div className="p-8 text-center space-y-2">
                                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                                <h4 className="font-bold text-gray-900 text-base">Ticket Submitted!</h4>
                                <p className="text-xs text-gray-500">Ticket #CS-{Math.floor(100000 + Math.random() * 900000)} created. We will email you updates.</p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="p-6 space-y-4">
                                <div>
                                    <label className="block text-gray-700 text-xs font-bold mb-1">Issue Category / Title *</label>
                                    <input 
                                        type="text" 
                                        required
                                        className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-lg p-2.5 text-xs outline-none focus:bg-white focus:border-blue-500" 
                                        placeholder="e.g. Assessment timer glitch"
                                        value={subject}
                                        onChange={e => setSubject(e.target.value)}
                                    />
                                </div>

                                <div>
                                    <label className="block text-gray-700 text-xs font-bold mb-1">Detailed Description *</label>
                                    <textarea
                                        rows="4"
                                        required
                                        className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl p-3 text-xs outline-none focus:bg-white focus:border-blue-500 resize-none"
                                        placeholder="Describe what occurred, what page you were on, and steps to reproduce..."
                                        value={description}
                                        onChange={e => setDescription(e.target.value)}
                                    ></textarea>
                                </div>

                                <div className="pt-3 border-t border-gray-100 flex justify-end gap-2">
                                    <button type="button" onClick={() => setTicketModal(false)} className="px-4 py-2 text-xs font-bold text-gray-600 hover:bg-gray-100 rounded-lg">
                                        Cancel
                                    </button>
                                    <button type="submit" className="flex items-center px-5 py-2 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-700">
                                        <Send className="w-3.5 h-3.5 mr-1.5" />
                                        Submit Ticket
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default DashboardSupport;
