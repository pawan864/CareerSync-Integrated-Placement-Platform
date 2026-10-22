import React, { useState } from 'react';
import { Building2, Search, MapPin, Users, CheckCircle, ExternalLink, Briefcase, X } from 'lucide-react';

const CompanyInsights = () => {
    const companies = [
        {
            name: 'Google',
            industry: 'Technology & Cloud',
            location: 'Mountain View, CA / Remote',
            employees: '180,000+',
            hiringStatus: 'Actively Hiring',
            openRoles: ['Software Engineering Intern', 'Cloud Support Associate', 'Data Analyst Intern'],
            hiringSeason: 'Spring & Fall 2026',
            cultureRating: 4.8
        },
        {
            name: 'Microsoft',
            industry: 'Enterprise Software & AI',
            location: 'Redmond, WA / Bengaluru',
            employees: '220,000+',
            hiringStatus: 'Actively Hiring',
            openRoles: ['Full Stack Developer', 'Cloud Solution Architect', 'Security Engineer'],
            hiringSeason: 'Campus Drives Active',
            cultureRating: 4.7
        },
        {
            name: 'Vercel',
            industry: 'Web Infrastructure & Edge',
            location: 'San Francisco, CA / Remote',
            employees: '1,200+',
            hiringStatus: 'Actively Hiring',
            openRoles: ['Frontend Developer Intern', 'DevRel Engineer', 'Next.js Runtime Specialist'],
            hiringSeason: 'Year-round Openings',
            cultureRating: 4.9
        },
        {
            name: 'Amazon',
            industry: 'E-commerce & AWS Cloud',
            location: 'Seattle, WA / Hyderabad',
            employees: '1,500,000+',
            hiringStatus: 'High Demand',
            openRoles: ['Data Scientist', 'SDE 1', 'Operations Research Intern'],
            hiringSeason: 'Campus Hiring Active',
            cultureRating: 4.5
        }
    ];

    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCompany, setSelectedCompany] = useState(null);

    const filtered = companies.filter(c => 
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        c.industry.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="max-w-6xl mx-auto pb-12">
            <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-gray-900 tracking-tight flex items-center">
                        <Building2 className="w-8 h-8 mr-3 text-blue-600" />
                        Company Insights & Corporate Profiles
                    </h2>
                    <p className="text-gray-600 text-sm mt-1">Research hiring requirements, open role headcounts, and placement culture.</p>
                </div>

                <div className="relative w-full md:w-72">
                    <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input 
                        type="text" 
                        placeholder="Search recruiters..." 
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        className="w-full bg-white border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-xs font-medium focus:outline-none focus:border-blue-500 shadow-sm" 
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filtered.map(comp => (
                    <div 
                        key={comp.name} 
                        className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:border-blue-300 hover:shadow-md transition-all flex flex-col justify-between"
                    >
                        <div>
                            <div className="flex items-center mb-4">
                                <div className="w-13 h-13 w-12 h-12 bg-blue-50 border border-blue-200 rounded-xl flex items-center justify-center font-bold text-xl text-blue-700 mr-4 shadow-sm">
                                    {comp.name.charAt(0)}
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900">{comp.name}</h3>
                                    <p className="text-xs text-gray-500 font-medium">{comp.industry} • {comp.location}</p>
                                </div>
                            </div>

                            <div className="flex justify-between text-xs text-gray-600 mb-4 border-t border-gray-100 pt-3">
                                <span>{comp.employees} Staff</span>
                                <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                                    {comp.hiringStatus}
                                </span>
                            </div>

                            <div className="mb-5">
                                <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Open Position Highlights:</div>
                                <div className="flex flex-wrap gap-1.5">
                                    {comp.openRoles.map((role, idx) => (
                                        <span key={idx} className="bg-gray-100 text-gray-700 text-xs px-2.5 py-0.5 rounded-md font-medium">
                                            {role}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <button 
                            onClick={() => setSelectedCompany(comp)}
                            className="w-full bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 py-2.5 rounded-lg font-bold text-xs transition-colors flex items-center justify-center"
                        >
                            <Briefcase className="w-3.5 h-3.5 mr-1.5" />
                            View Recruiting Information
                        </button>
                    </div>
                ))}
            </div>

            {/* DETAILS MODAL */}
            {selectedCompany && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in duration-150">
                        <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-gray-50">
                            <div>
                                <h3 className="font-bold text-gray-900 text-base">{selectedCompany.name} Recruiting Overview</h3>
                                <p className="text-xs text-gray-500">{selectedCompany.industry}</p>
                            </div>
                            <button onClick={() => setSelectedCompany(null)} className="text-gray-400 hover:text-gray-600">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-6 space-y-4 text-xs text-gray-700">
                            <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl space-y-1">
                                <div><strong>Hiring Window:</strong> {selectedCompany.hiringSeason}</div>
                                <div><strong>Location Modes:</strong> {selectedCompany.location}</div>
                                <div><strong>Campus Culture Rating:</strong> {selectedCompany.cultureRating} / 5.0</div>
                            </div>

                            <div>
                                <h4 className="font-bold text-gray-900 mb-2">Available Roles on CareerSync:</h4>
                                <ul className="space-y-1.5 pl-4 list-disc text-gray-600">
                                    {selectedCompany.openRoles.map((r, i) => (
                                        <li key={i}>{r}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end">
                            <button onClick={() => setSelectedCompany(null)} className="px-5 py-2 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-700">
                                Done
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CompanyInsights;
