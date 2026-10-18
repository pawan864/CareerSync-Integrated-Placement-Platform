import React from 'react';
import { 
    X, Briefcase, GraduationCap, FolderGit2, BookOpen, 
    MapPin, DollarSign, Clock, Users, Calendar, CheckCircle2, 
    Sparkles, Edit3, Trash2, ShieldCheck, Tag
} from 'lucide-react';

export default function OpportunityDetailsModal({ 
    opportunity, 
    isOpen, 
    onClose, 
    onEdit, 
    onDelete, 
    onStatusChange 
}) {
    if (!isOpen || !opportunity) return null;

    const getTypeBadge = (type) => {
        switch (type) {
            case 'Placement':
                return { label: 'Full-Time Job', bg: 'bg-indigo-100 text-indigo-800 border-indigo-200' };
            case 'Internship':
                return { label: 'Internship', bg: 'bg-emerald-100 text-emerald-800 border-emerald-200' };
            case 'Project':
                return { label: 'Industry Project', bg: 'bg-purple-100 text-purple-800 border-purple-200' };
            case 'Training':
                return { label: 'Corporate Training', bg: 'bg-amber-100 text-amber-800 border-amber-200' };
            default:
                return { label: type, bg: 'bg-gray-100 text-gray-800 border-gray-200' };
        }
    };

    const typeInfo = getTypeBadge(opportunity.type);

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5">
            <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-gray-100 animate-in fade-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="px-6 py-5 bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 text-white flex items-start justify-between shrink-0">
                    <div>
                        <div className="flex items-center space-x-2 mb-2">
                            <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${typeInfo.bg}`}>
                                {typeInfo.label}
                            </span>
                            <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                                opportunity.status === 'Open' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                                opportunity.status === 'Paused' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                                opportunity.status === 'Draft' ? 'bg-gray-500/20 text-gray-300 border border-gray-500/30' :
                                'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                            }`}>
                                {opportunity.status}
                            </span>
                        </div>
                        <h2 className="text-xl font-bold text-white tracking-tight">{opportunity.title}</h2>
                        <p className="text-xs text-blue-200/80 mt-1 flex items-center space-x-3">
                            <span>{opportunity.department || 'Software & Technology'}</span>
                            <span>•</span>
                            <span className="flex items-center"><MapPin className="w-3 h-3 mr-1" /> {opportunity.location} ({opportunity.workMode})</span>
                        </p>
                    </div>

                    <button
                        onClick={onClose}
                        className="p-1.5 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="overflow-y-auto flex-1 p-6 space-y-6 text-gray-800">
                    {/* Quick Stats Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        <div className="p-3 bg-indigo-50/60 rounded-xl border border-indigo-100">
                            <span className="text-[10px] text-gray-500 font-medium block">Compensation</span>
                            <span className="text-sm font-bold text-indigo-950">{opportunity.stipendOrSalary || 'N/A'}</span>
                        </div>
                        <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-100">
                            <span className="text-[10px] text-gray-500 font-medium block">Tenure</span>
                            <span className="text-sm font-bold text-emerald-950">{opportunity.duration || 'Full-time'}</span>
                        </div>
                        <div className="p-3 bg-purple-50/60 rounded-xl border border-purple-100">
                            <span className="text-[10px] text-gray-500 font-medium block">Openings</span>
                            <span className="text-sm font-bold text-purple-950">{opportunity.openings || 1} Positions</span>
                        </div>
                        <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-100">
                            <span className="text-[10px] text-gray-500 font-medium block">Total Applicants</span>
                            <span className="text-sm font-bold text-blue-950">{opportunity.applicantCount || 0} Applied</span>
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-2">Role Overview</h4>
                        <p className="text-xs text-gray-600 leading-relaxed whitespace-pre-line bg-gray-50 p-4 rounded-xl border border-gray-200">
                            {opportunity.description || 'No detailed overview provided.'}
                        </p>
                    </div>

                    {/* Key Responsibilities */}
                    {opportunity.responsibilities && (
                        <div>
                            <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-2">Key Responsibilities</h4>
                            <p className="text-xs text-gray-600 leading-relaxed whitespace-pre-line bg-gray-50 p-4 rounded-xl border border-gray-200">
                                {opportunity.responsibilities}
                            </p>
                        </div>
                    )}

                    {/* Required Skills */}
                    <div>
                        <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-2.5 flex items-center space-x-1.5">
                            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                            <span>Required Skills & Target Proficiency</span>
                        </h4>
                        <div className="flex flex-wrap gap-2">
                            {opportunity.requiredSkills?.map((skill, i) => (
                                <div key={i} className="flex items-center space-x-1.5 px-3 py-1.5 bg-white border border-gray-200 rounded-xl shadow-xs text-xs">
                                    <span className="font-semibold text-gray-900">{skill.name}</span>
                                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                                        skill.level === 'Expert' ? 'bg-purple-100 text-purple-700' :
                                        skill.level === 'Advanced' ? 'bg-indigo-100 text-indigo-700' :
                                        skill.level === 'Intermediate' ? 'bg-blue-100 text-blue-700' :
                                        'bg-gray-100 text-gray-600'
                                    }`}>
                                        {skill.level}
                                    </span>
                                    {skill.isMandatory && (
                                        <span className="text-[9px] bg-red-100 text-red-700 px-1 py-0.5 rounded font-bold uppercase">
                                            Required
                                        </span>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Eligibility & Perks Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-2">
                            <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider flex items-center space-x-1">
                                <GraduationCap className="w-3.5 h-3.5 text-blue-600" />
                                <span>Eligibility Criteria</span>
                            </h4>
                            <div className="text-xs text-gray-600 space-y-1">
                                <div><strong className="text-gray-800">Minimum CGPA:</strong> {opportunity.eligibilityCriteria?.minCgpa || 0} / 10</div>
                                <div>
                                    <strong className="text-gray-800">Eligible Batches:</strong>{' '}
                                    {opportunity.eligibilityCriteria?.gradYear?.length > 0 
                                        ? opportunity.eligibilityCriteria.gradYear.join(', ') 
                                        : 'All Batches'}
                                </div>
                                <div>
                                    <strong className="text-gray-800">Branches:</strong>{' '}
                                    <div className="flex flex-wrap gap-1 mt-1">
                                        {opportunity.eligibilityCriteria?.branches?.map((b, i) => (
                                            <span key={i} className="text-[10px] bg-white border border-gray-200 px-2 py-0.5 rounded-md text-gray-700">
                                                {b}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {opportunity.perks?.length > 0 && (
                            <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-2">
                                <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider flex items-center space-x-1">
                                    <Tag className="w-3.5 h-3.5 text-emerald-600" />
                                    <span>Perks & Benefits</span>
                                </h4>
                                <div className="flex flex-wrap gap-1.5 pt-1">
                                    {opportunity.perks.map((perk, i) => (
                                        <span key={i} className="text-xs bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-1 rounded-lg font-medium">
                                            ✓ {perk}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer Controls */}
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center space-x-2">
                        <span className="text-xs font-semibold text-gray-600">Quick Status:</span>
                        <select
                            value={opportunity.status}
                            onChange={(e) => onStatusChange?.(opportunity._id, e.target.value)}
                            className="text-xs font-bold bg-white border border-gray-300 rounded-lg px-2.5 py-1.5 outline-none cursor-pointer"
                        >
                            <option value="Open">🟢 Open</option>
                            <option value="Paused">🟡 Paused</option>
                            <option value="Closed">🔴 Closed</option>
                            <option value="Draft">⚪ Draft</option>
                        </select>
                    </div>

                    <div className="flex items-center space-x-2">
                        <button
                            onClick={() => {
                                onClose();
                                onEdit?.(opportunity);
                            }}
                            className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 shadow-sm transition-colors cursor-pointer"
                        >
                            <Edit3 className="w-3.5 h-3.5" />
                            <span>Edit Posting</span>
                        </button>

                        <button
                            onClick={() => {
                                if (window.confirm(`Are you sure you want to delete "${opportunity.title}"?`)) {
                                    onDelete?.(opportunity._id);
                                    onClose();
                                }
                            }}
                            className="px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold flex items-center space-x-1 transition-colors cursor-pointer"
                        >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Delete</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
