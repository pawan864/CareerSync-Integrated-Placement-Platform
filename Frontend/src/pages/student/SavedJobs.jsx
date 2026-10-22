import React, { useState, useEffect } from 'react';
import { Bookmark, MapPin, DollarSign, Clock, Building2, Trash2, ChevronRight, CheckCircle, ExternalLink } from 'lucide-react';

const SavedJobs = () => {
    const defaultSaved = [
        { id: 'saved-1', title: 'Software Engineer II', company: 'Microsoft', location: 'Seattle, WA', stipend: '$120k/yr', duration: 'Full-time', match: 85 }
    ];

    const [savedJobs, setSavedJobs] = useState([]);

    useEffect(() => {
        try {
            const list = JSON.parse(localStorage.getItem('careersync_saved_jobs') || '[]');
            if (list.length > 0) {
                setSavedJobs(list);
            } else {
                setSavedJobs(defaultSaved);
            }
        } catch (e) {
            setSavedJobs(defaultSaved);
        }
    }, []);

    const handleRemove = (id) => {
        const updated = savedJobs.filter(j => j.id !== id);
        setSavedJobs(updated);
        localStorage.setItem('careersync_saved_jobs', JSON.stringify(updated));
    };

    return (
        <div className="max-w-6xl mx-auto pb-12">
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 tracking-tight flex items-center">
                    <Bookmark className="w-8 h-8 mr-3 text-blue-600" />
                    Saved Opportunities & Bookmarks
                </h2>
                <p className="text-gray-600 text-sm mt-1">Review positions and internships you have saved for later application.</p>
            </div>

            <div className="space-y-4">
                {savedJobs.map(job => (
                    <div 
                        key={job.id} 
                        className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center hover:border-blue-300 transition-all gap-4"
                    >
                        <div className="flex items-start">
                            <div className="w-12 h-12 bg-blue-50 border border-blue-200 rounded-xl text-blue-700 flex items-center justify-center font-bold text-xl mr-4 shadow-sm">
                                <Building2 className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-gray-900">{job.title}</h3>
                                <p className="text-xs font-semibold text-blue-600 mt-0.5">
                                    {job.company} <span className="text-gray-300 mx-2">•</span> 
                                    <span className="text-gray-500 font-normal">{job.location}</span>
                                </p>
                                {job.stipend && (
                                    <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                                        <span>{job.stipend}</span>
                                        {job.duration && <span>• {job.duration}</span>}
                                        {job.match && <span className="font-bold text-emerald-600">• {job.match}% Match</span>}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center space-x-3 w-full md:w-auto justify-end">
                            <button 
                                onClick={() => handleRemove(job.id)}
                                className="border border-gray-200 text-gray-600 px-3 py-2 rounded-lg font-semibold text-xs hover:bg-gray-50 hover:text-red-600 transition-colors flex items-center"
                            >
                                <Trash2 className="w-3.5 h-3.5 mr-1" />
                                Remove
                            </button>
                            <button 
                                className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold text-xs hover:bg-blue-700 shadow-sm transition-all flex items-center"
                            >
                                Apply Now
                                <ChevronRight className="w-3.5 h-3.5 ml-1" />
                            </button>
                        </div>
                    </div>
                ))}

                {savedJobs.length === 0 && (
                    <div className="text-center py-16 bg-white border border-gray-200 rounded-xl text-gray-500">
                        <Bookmark className="w-10 h-10 mx-auto text-gray-300 mb-2" />
                        <p className="font-semibold text-sm">No saved opportunities yet.</p>
                        <p className="text-xs text-gray-400 mt-1">Browse the Opportunity Hub to bookmark roles that match your interests.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SavedJobs;
