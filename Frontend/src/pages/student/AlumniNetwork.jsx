import React, { useState } from 'react';
import { Network, Search, MessageSquare, Send, X, Check } from 'lucide-react';

const AlumniNetwork = () => {
    const alumniList = [
        { id: 1, name: 'Alex Mercer', year: 'Class of 2023', company: 'Meta', role: 'Software Engineer', location: 'Menlo Park, CA' },
        { id: 2, name: 'Ananya Roy', year: 'Class of 2022', company: 'Google', role: 'Data Scientist', location: 'Bengaluru, India' },
        { id: 3, name: 'Kavita Patel', year: 'Class of 2021', company: 'Microsoft', role: 'Product Manager', location: 'Hyderabad, India' },
        { id: 4, name: 'Rohan Verma', year: 'Class of 2024', company: 'Amazon AWS', role: 'Cloud Support Engineer', location: 'Remote' }
    ];

    const [search, setSearch] = useState('');
    const [messagingAlumni, setMessagingAlumni] = useState(null);
    const [messageText, setMessageText] = useState('');
    const [sentMap, setSentMap] = useState({});

    const filtered = alumniList.filter(a => 
        a.name.toLowerCase().includes(search.toLowerCase()) ||
        a.company.toLowerCase().includes(search.toLowerCase()) ||
        a.role.toLowerCase().includes(search.toLowerCase())
    );

    const handleSendMessage = () => {
        if (!messagingAlumni) return;
        setSentMap(prev => ({ ...prev, [messagingAlumni.id]: true }));
        setMessagingAlumni(null);
        setMessageText('');
    };

    return (
        <div className="max-w-6xl mx-auto pb-12">
            <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-gray-900 tracking-tight flex items-center">
                        <Network className="w-8 h-8 mr-3 text-blue-600" />
                        Alumni Directory & Graduate Network
                    </h2>
                    <p className="text-gray-600 text-sm mt-1">Connect with verified graduates working across global technology companies.</p>
                </div>

                <div className="relative w-full md:w-72">
                    <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input 
                        type="text" 
                        placeholder="Search alumni by name or firm..." 
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="w-full bg-white border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-xs font-medium focus:outline-none focus:border-blue-500 shadow-sm" 
                    />
                </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50/80 border-b border-gray-200 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        <tr>
                            <th className="py-4 px-6">Alumni Member</th>
                            <th className="py-4 px-6">Graduation Year</th>
                            <th className="py-4 px-6">Current Position</th>
                            <th className="py-4 px-6 text-right">Connect</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-sm">
                        {filtered.map(alumni => {
                            const isSent = sentMap[alumni.id];
                            return (
                                <tr key={alumni.id} className="hover:bg-blue-50/40 transition-colors">
                                    <td className="py-4 px-6">
                                        <div className="font-bold text-gray-900">{alumni.name}</div>
                                        <div className="text-xs text-gray-400">{alumni.location}</div>
                                    </td>
                                    <td className="py-4 px-6 text-gray-600 text-xs font-medium">{alumni.year}</td>
                                    <td className="py-4 px-6">
                                        <span className="font-semibold text-gray-900">{alumni.role}</span>
                                        <span className="text-gray-400 mx-1.5">•</span>
                                        <span className="text-blue-600 font-bold">{alumni.company}</span>
                                    </td>
                                    <td className="py-4 px-6 text-right">
                                        <button 
                                            onClick={() => setMessagingAlumni(alumni)}
                                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                                                isSent 
                                                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                                    : 'bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100'
                                            }`}
                                        >
                                            {isSent ? 'Message Sent' : 'Send Message'}
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* MESSAGE MODAL */}
            {messagingAlumni && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in duration-150">
                        <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-gray-50">
                            <div>
                                <h3 className="font-bold text-gray-900 text-base">Message {messagingAlumni.name}</h3>
                                <p className="text-xs text-gray-500">{messagingAlumni.role} @ {messagingAlumni.company}</p>
                            </div>
                            <button onClick={() => setMessagingAlumni(null)} className="text-gray-400 hover:text-gray-600">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-6 space-y-3">
                            <label className="block text-gray-700 text-xs font-bold">Your Introduction & Inquiry</label>
                            <textarea
                                rows="4"
                                className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl p-3 text-xs focus:bg-white focus:border-blue-500 outline-none resize-none"
                                placeholder={`Hi ${messagingAlumni.name}, I am a student at CareerSync interested in learning more about your experience at ${messagingAlumni.company}...`}
                                value={messageText}
                                onChange={e => setMessageText(e.target.value)}
                            ></textarea>
                        </div>

                        <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-2">
                            <button onClick={() => setMessagingAlumni(null)} className="px-4 py-2 text-xs font-bold text-gray-600 hover:bg-gray-100 rounded-lg">
                                Cancel
                            </button>
                            <button onClick={handleSendMessage} className="flex items-center px-5 py-2 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-700">
                                <Send className="w-3.5 h-3.5 mr-1.5" />
                                Send Message
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AlumniNetwork;
