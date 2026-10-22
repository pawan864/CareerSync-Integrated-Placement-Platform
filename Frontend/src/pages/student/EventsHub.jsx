import React, { useState } from 'react';
import { Calendar, MapPin, Users, Ticket, ExternalLink, Check, Clock, Sparkles } from 'lucide-react';

const EventsHub = () => {
    const initialEvents = [
        { 
            id: 1, 
            title: 'Global Tech Hackathon 2026', 
            org: 'Major League Hacking', 
            date: 'Oct 28-30, 2026', 
            format: 'Online', 
            attendees: 1240, 
            description: '48-hour global sprint building next-gen generative AI applications and cloud pipelines.' 
        },
        { 
            id: 2, 
            title: 'Microsoft Campus Placement Connect', 
            org: 'Microsoft HR & University Recruiting', 
            date: 'Nov 04, 2026', 
            format: 'Hybrid', 
            attendees: 480, 
            description: 'Direct screening, resume reviews, and pre-placement talks with Microsoft engineering managers.' 
        },
        { 
            id: 3, 
            title: 'Open Source Contribution Workshop', 
            org: 'GitHub Campus Experts', 
            date: 'Nov 12, 2026', 
            format: 'Online', 
            attendees: 820, 
            description: 'Hands-on mentorship on opening pull requests, Git rebase workflows, and contributing to top OSS repositories.' 
        },
    ];

    const [events] = useState(initialEvents);
    const [rsvpMap, setRsvpMap] = useState({});
    const [activeDetail, setActiveDetail] = useState(null);

    const toggleRsvp = (eventId) => {
        setRsvpMap(prev => ({ ...prev, [eventId]: !prev[eventId] }));
    };

    return (
        <div className="max-w-6xl mx-auto pb-12">
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 tracking-tight flex items-center">
                    <Calendar className="w-8 h-8 mr-3 text-blue-600" />
                    Events, Hackathons & Placement Drives
                </h2>
                <p className="text-gray-600 text-sm mt-1">
                    Discover and RSVP for upcoming coding competitions, campus recruitment drives, and industry technical webinars.
                </p>
            </div>

            <div className="space-y-4">
                {events.map(event => {
                    const isRsvpd = rsvpMap[event.id];
                    return (
                        <div 
                            key={event.id} 
                            className="bg-white border border-gray-200 rounded-xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center hover:border-blue-300 hover:shadow-md transition-all gap-4"
                        >
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1.5">
                                    <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                                        {event.format}
                                    </span>
                                    <span className="text-xs text-gray-500 font-medium">By {event.org}</span>
                                </div>

                                <h3 className="text-lg font-bold text-gray-900 mb-1">{event.title}</h3>
                                <p className="text-xs text-gray-500 mb-4 max-w-2xl">{event.description}</p>
                                
                                <div className="flex flex-wrap gap-4 text-xs font-semibold text-gray-600">
                                    <span className="flex items-center">
                                        <Clock className="w-3.5 h-3.5 mr-1.5 text-gray-400" />
                                        {event.date}
                                    </span>
                                    <span className="flex items-center">
                                        <MapPin className="w-3.5 h-3.5 mr-1.5 text-gray-400" />
                                        {event.format} Event
                                    </span>
                                    <span className="flex items-center">
                                        <Users className="w-3.5 h-3.5 mr-1.5 text-gray-400" />
                                        {event.attendees + (isRsvpd ? 1 : 0)} Attending
                                    </span>
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                                <button 
                                    onClick={() => toggleRsvp(event.id)}
                                    className={`px-5 py-2.5 rounded-lg text-xs font-bold transition-all shadow-sm flex items-center ${
                                        isRsvpd 
                                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                                            : 'bg-blue-600 text-white hover:bg-blue-700 active:scale-95'
                                    }`}
                                >
                                    {isRsvpd ? (
                                        <>
                                            <Check className="w-4 h-4 mr-1 text-emerald-600" />
                                            RSVP Confirmed
                                        </>
                                    ) : (
                                        <>
                                            <Ticket className="w-4 h-4 mr-1.5" />
                                            RSVP Now
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default EventsHub;
