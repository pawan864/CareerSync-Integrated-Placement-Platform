import React, { useState, useEffect } from 'react';
import { 
    X, Briefcase, GraduationCap, FolderGit2, BookOpen, 
    Plus, Trash2, CheckCircle2, AlertCircle, DollarSign, 
    Calendar, MapPin, Building, Users, Clock, Sparkles
} from 'lucide-react';
import api from '../../services/api';

const POPULAR_SKILLS = [
    'React', 'Node.js', 'Python', 'Java', 'TypeScript', 
    'SQL', 'MongoDB', 'AWS', 'Docker', 'Machine Learning', 
    'Tailwind CSS', 'Next.js', 'Spring Boot', 'Git'
];

const BRANCH_OPTIONS = [
    'Computer Science & Engineering',
    'Information Technology',
    'Electronics & Communication',
    'Electrical & Electronics',
    'Mechanical Engineering',
    'Civil Engineering',
    'Data Science & AI',
    'All Branches'
];

const BATCH_OPTIONS = [2024, 2025, 2026, 2027, 2028];

const PERK_OPTIONS = [
    'Pre-Placement Offer (PPO)',
    'Certificate of Completion',
    'Flexible Working Hours',
    'Letter of Recommendation',
    'Health Insurance',
    'Dedicated Industry Mentor',
    'Work Equipment Provided',
    'Commute / Cab Allowance'
];

export default function OpportunityFormModal({ isOpen, onClose, onSuccess, initialData = null }) {
    const isEdit = Boolean(initialData?._id);

    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const [formData, setFormData] = useState({
        title: '',
        type: 'Placement',
        department: 'Software & Technology',
        location: '',
        workMode: 'On-site',
        stipendOrSalary: '',
        duration: 'Full-time',
        openings: 1,
        deadline: '',
        description: '',
        responsibilities: '',
        status: 'Open',
        perks: [],
        eligibilityCriteria: {
            minCgpa: 6.5,
            branches: ['Computer Science & Engineering', 'Information Technology'],
            gradYear: [2025, 2026]
        },
        requiredSkills: [
            { name: 'React', level: 'Intermediate', isMandatory: true }
        ]
    });

    const [newSkillName, setNewSkillName] = useState('');
    const [newSkillLevel, setNewSkillLevel] = useState('Intermediate');
    const [newSkillMandatory, setNewSkillMandatory] = useState(true);

    useEffect(() => {
        if (initialData) {
            setFormData({
                title: initialData.title || '',
                type: initialData.type || 'Placement',
                department: initialData.department || 'Software & Technology',
                location: initialData.location || '',
                workMode: initialData.workMode || 'On-site',
                stipendOrSalary: initialData.stipendOrSalary || '',
                duration: initialData.duration || 'Full-time',
                openings: initialData.openings || 1,
                deadline: initialData.deadline ? initialData.deadline.substring(0, 10) : '',
                description: initialData.description || '',
                responsibilities: initialData.responsibilities || '',
                status: initialData.status || 'Open',
                perks: initialData.perks || [],
                eligibilityCriteria: {
                    minCgpa: initialData.eligibilityCriteria?.minCgpa ?? 6.5,
                    branches: initialData.eligibilityCriteria?.branches || ['Computer Science & Engineering'],
                    gradYear: initialData.eligibilityCriteria?.gradYear || [2025, 2026]
                },
                requiredSkills: initialData.requiredSkills?.length > 0 
                    ? initialData.requiredSkills 
                    : [{ name: 'React', level: 'Intermediate', isMandatory: true }]
            });
        } else {
            // Reset to defaults
            setFormData({
                title: '',
                type: 'Placement',
                department: 'Software & Technology',
                location: '',
                workMode: 'On-site',
                stipendOrSalary: '',
                duration: 'Full-time',
                openings: 1,
                deadline: '',
                description: '',
                responsibilities: '',
                status: 'Open',
                perks: ['Pre-Placement Offer (PPO)', 'Dedicated Industry Mentor'],
                eligibilityCriteria: {
                    minCgpa: 6.5,
                    branches: ['Computer Science & Engineering', 'Information Technology'],
                    gradYear: [2025, 2026]
                },
                requiredSkills: [
                    { name: 'React', level: 'Intermediate', isMandatory: true },
                    { name: 'Node.js', level: 'Intermediate', isMandatory: true }
                ]
            });
        }
        setErrorMsg('');
    }, [initialData, isOpen]);

    if (!isOpen) return null;

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleCgpaChange = (e) => {
        const val = parseFloat(e.target.value) || 0;
        setFormData(prev => ({
            ...prev,
            eligibilityCriteria: { ...prev.eligibilityCriteria, minCgpa: val }
        }));
    };

    const toggleBranch = (branch) => {
        setFormData(prev => {
            const current = prev.eligibilityCriteria.branches || [];
            if (branch === 'All Branches') {
                return {
                    ...prev,
                    eligibilityCriteria: {
                        ...prev.eligibilityCriteria,
                        branches: current.includes('All Branches') ? [] : ['All Branches']
                    }
                };
            }
            const withoutAll = current.filter(b => b !== 'All Branches');
            const exists = withoutAll.includes(branch);
            const updated = exists ? withoutAll.filter(b => b !== branch) : [...withoutAll, branch];
            return {
                ...prev,
                eligibilityCriteria: { ...prev.eligibilityCriteria, branches: updated }
            };
        });
    };

    const toggleBatch = (batchYear) => {
        setFormData(prev => {
            const current = prev.eligibilityCriteria.gradYear || [];
            const exists = current.includes(batchYear);
            const updated = exists ? current.filter(y => y !== batchYear) : [...current, batchYear];
            return {
                ...prev,
                eligibilityCriteria: { ...prev.eligibilityCriteria, gradYear: updated }
            };
        });
    };

    const togglePerk = (perk) => {
        setFormData(prev => {
            const current = prev.perks || [];
            const exists = current.includes(perk);
            return {
                ...prev,
                perks: exists ? current.filter(p => p !== perk) : [...current, perk]
            };
        });
    };

    const handleAddSkill = (skillName = newSkillName) => {
        if (!skillName || !skillName.trim()) return;
        const cleanName = skillName.trim();
        if (formData.requiredSkills.some(s => s.name.toLowerCase() === cleanName.toLowerCase())) {
            setErrorMsg(`Skill "${cleanName}" is already added.`);
            return;
        }

        setFormData(prev => ({
            ...prev,
            requiredSkills: [
                ...prev.requiredSkills,
                { name: cleanName, level: newSkillLevel, isMandatory: newSkillMandatory }
            ]
        }));
        setNewSkillName('');
        setErrorMsg('');
    };

    const handleRemoveSkill = (index) => {
        setFormData(prev => ({
            ...prev,
            requiredSkills: prev.requiredSkills.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMsg('');

        if (!formData.title.trim()) {
            setErrorMsg('Opportunity title is required.');
            return;
        }
        if (!formData.location.trim()) {
            setErrorMsg('Work location is required.');
            return;
        }
        if (formData.requiredSkills.length === 0) {
            setErrorMsg('Please specify at least one required skill.');
            return;
        }

        setLoading(true);

        try {
            const payload = {
                ...formData,
                openings: parseInt(formData.openings, 10) || 1,
                deadline: formData.deadline ? new Date(formData.deadline) : undefined
            };

            let res;
            if (isEdit) {
                res = await api.put(`/opportunities/${initialData._id}`, payload);
            } else {
                res = await api.post('/opportunities', payload);
            }

            if (res.data?.success) {
                onSuccess?.(res.data.data, isEdit ? 'updated' : 'created');
                onClose();
            } else {
                setErrorMsg(res.data?.error || 'Failed to save opportunity');
            }
        } catch (err) {
            console.error('Save opportunity error:', err);
            setErrorMsg(err.response?.data?.error || err.message || 'An unexpected error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5">
            <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden border border-gray-100 animate-in fade-in zoom-in-95 duration-200">
                {/* Modal Header */}
                <div className="px-6 py-4 bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white flex items-center justify-between shrink-0">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center backdrop-blur-md border border-white/20">
                            <Briefcase className="w-5 h-5 text-blue-300" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-white tracking-tight">
                                {isEdit ? 'Edit Opportunity Posting' : 'Post New Opportunity'}
                            </h2>
                            <p className="text-xs text-blue-200">
                                Create an ATS-ready hiring notice for Jobs, Internships, Projects & Training
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                        title="Close Modal"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Modal Body Form */}
                <form onSubmit={handleSubmit} className="overflow-y-auto flex-1 p-6 space-y-6 text-gray-800">
                    {errorMsg && (
                        <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs flex items-center space-x-2">
                            <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                            <span>{errorMsg}</span>
                        </div>
                    )}

                    {/* Step 1: Type Selection Tabs */}
                    <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                            Opportunity Type <span className="text-red-500">*</span>
                        </label>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                            {[
                                { id: 'Placement', label: 'Full-Time Job', sub: 'Campus Placement', icon: Briefcase, color: 'indigo' },
                                { id: 'Internship', label: 'Internship', sub: '3-6 Mo. Tenure', icon: GraduationCap, color: 'emerald' },
                                { id: 'Project', label: 'Industry Project', sub: 'Capstone & R&D', icon: FolderGit2, color: 'purple' },
                                { id: 'Training', label: 'Corporate Training', sub: 'Skill Program', icon: BookOpen, color: 'amber' },
                            ].map(t => {
                                const active = formData.type === t.id;
                                const Icon = t.icon;
                                return (
                                    <button
                                        key={t.id}
                                        type="button"
                                        onClick={() => setFormData(prev => ({ 
                                            ...prev, 
                                            type: t.id,
                                            duration: t.id === 'Placement' ? 'Full-time' : prev.duration
                                        }))}
                                        className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                                            active
                                                ? 'border-indigo-600 bg-indigo-50/70 shadow-sm ring-2 ring-indigo-500/20'
                                                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                        }`}
                                    >
                                        <div className="flex items-center justify-between mb-1.5">
                                            <Icon className={`w-4 h-4 ${active ? 'text-indigo-600' : 'text-gray-400'}`} />
                                            {active && <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" />}
                                        </div>
                                        <div>
                                            <span className={`block text-xs font-bold ${active ? 'text-indigo-950' : 'text-gray-800'}`}>
                                                {t.label}
                                            </span>
                                            <span className="text-[10px] text-gray-500 block">{t.sub}</span>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Step 2: Basic Info Grid */}
                    <div className="bg-gray-50/70 p-4 rounded-xl border border-gray-200/80 space-y-4">
                        <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider flex items-center space-x-1.5">
                            <Building className="w-3.5 h-3.5 text-blue-600" />
                            <span>Role & Scope</span>
                        </h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                    Opportunity Title <span className="text-red-500">*</span>
                                </label>
                                <input
                                    required
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    placeholder="e.g. Associate Full-Stack Engineer"
                                    className="w-full text-xs bg-white border border-gray-300 rounded-lg px-3 py-2.5 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                    Department / Tech Domain
                                </label>
                                <select
                                    name="department"
                                    value={formData.department}
                                    onChange={handleInputChange}
                                    className="w-full text-xs bg-white border border-gray-300 rounded-lg px-3 py-2.5 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
                                >
                                    <option value="Software & Technology">Software & Technology</option>
                                    <option value="Data Science & Analytics">Data Science & Analytics</option>
                                    <option value="AI / Machine Learning">AI / Machine Learning</option>
                                    <option value="Cloud & DevOps">Cloud & DevOps</option>
                                    <option value="Cybersecurity">Cybersecurity</option>
                                    <option value="Core Engineering (Mechanical/Electrical)">Core Engineering</option>
                                    <option value="Product & UI/UX Design">Product & UI/UX Design</option>
                                    <option value="Business & Operations">Business & Operations</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                    Work Mode <span className="text-red-500">*</span>
                                </label>
                                <div className="grid grid-cols-3 gap-2">
                                    {['On-site', 'Hybrid', 'Remote'].map(mode => (
                                        <button
                                            type="button"
                                            key={mode}
                                            onClick={() => setFormData(p => ({ ...p, workMode: mode }))}
                                            className={`py-2 text-xs font-medium rounded-lg border transition-all text-center ${
                                                formData.workMode === mode
                                                    ? 'bg-indigo-600 text-white border-indigo-600 font-bold'
                                                    : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-100'
                                            }`}
                                        >
                                            {mode}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                    Location <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <MapPin className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-3" />
                                    <input
                                        required
                                        type="text"
                                        name="location"
                                        value={formData.location}
                                        onChange={handleInputChange}
                                        placeholder="e.g. Bengaluru / Pune / Remote"
                                        className="w-full text-xs bg-white border border-gray-300 rounded-lg pl-8 pr-3 py-2.5 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Step 3: Compensation & Schedule */}
                    <div className="bg-gray-50/70 p-4 rounded-xl border border-gray-200/80 space-y-4">
                        <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider flex items-center space-x-1.5">
                            <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Tenure, Openings & Compensation</span>
                        </h3>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                    Stipend / Salary <span className="text-red-500">*</span>
                                </label>
                                <input
                                    required
                                    type="text"
                                    name="stipendOrSalary"
                                    value={formData.stipendOrSalary}
                                    onChange={handleInputChange}
                                    placeholder="e.g. ₹8 - 12 LPA or ₹30k/mo"
                                    className="w-full text-xs bg-white border border-gray-300 rounded-lg px-3 py-2.5 focus:border-indigo-500 outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                    Duration / Commitment
                                </label>
                                <input
                                    type="text"
                                    name="duration"
                                    value={formData.duration}
                                    onChange={handleInputChange}
                                    placeholder="e.g. Full-time, 6 Months"
                                    className="w-full text-xs bg-white border border-gray-300 rounded-lg px-3 py-2.5 focus:border-indigo-500 outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                    No. of Openings
                                </label>
                                <input
                                    type="number"
                                    min="1"
                                    name="openings"
                                    value={formData.openings}
                                    onChange={handleInputChange}
                                    className="w-full text-xs bg-white border border-gray-300 rounded-lg px-3 py-2.5 focus:border-indigo-500 outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                    Application Deadline
                                </label>
                                <input
                                    type="date"
                                    name="deadline"
                                    value={formData.deadline}
                                    onChange={handleInputChange}
                                    className="w-full text-xs bg-white border border-gray-300 rounded-lg px-3 py-2.5 focus:border-indigo-500 outline-none"
                                />
                            </div>
                        </div>

                        {/* Perks & Benefits multi-selector */}
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1.5">
                                Perks & Benefits
                            </label>
                            <div className="flex flex-wrap gap-1.5">
                                {PERK_OPTIONS.map(perk => {
                                    const checked = formData.perks?.includes(perk);
                                    return (
                                        <button
                                            type="button"
                                            key={perk}
                                            onClick={() => togglePerk(perk)}
                                            className={`px-2.5 py-1 text-[11px] rounded-lg border font-medium transition-all ${
                                                checked
                                                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300 font-semibold shadow-xs'
                                                    : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-100'
                                            }`}
                                        >
                                            {checked && '✓ '}
                                            {perk}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Step 4: Skill Requirements Builder */}
                    <div className="bg-gray-50/70 p-4 rounded-xl border border-gray-200/80 space-y-3">
                        <div className="flex items-center justify-between">
                            <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider flex items-center space-x-1.5">
                                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                                <span>Required Skills & Competencies <span className="text-red-500">*</span></span>
                            </h3>
                            <span className="text-[10px] text-gray-500">
                                Match algorithm calculates student suitability against these skills
                            </span>
                        </div>

                        {/* Add Skill Controls */}
                        <div className="bg-white p-3 rounded-lg border border-gray-200 grid grid-cols-1 sm:grid-cols-12 gap-2 items-center">
                            <div className="sm:col-span-5">
                                <input
                                    type="text"
                                    placeholder="Skill name (e.g. Python, React)"
                                    value={newSkillName}
                                    onChange={(e) => setNewSkillName(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            handleAddSkill();
                                        }
                                    }}
                                    className="w-full text-xs border border-gray-300 rounded-md px-2.5 py-2 outline-none focus:border-indigo-500"
                                />
                            </div>

                            <div className="sm:col-span-3">
                                <select
                                    value={newSkillLevel}
                                    onChange={(e) => setNewSkillLevel(e.target.value)}
                                    className="w-full text-xs border border-gray-300 rounded-md px-2 py-2 outline-none"
                                >
                                    <option value="Beginner">Beginner</option>
                                    <option value="Intermediate">Intermediate</option>
                                    <option value="Advanced">Advanced</option>
                                    <option value="Expert">Expert</option>
                                </select>
                            </div>

                            <div className="sm:col-span-2 flex items-center space-x-1">
                                <label className="text-[11px] text-gray-700 flex items-center space-x-1.5 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={newSkillMandatory}
                                        onChange={(e) => setNewSkillMandatory(e.target.checked)}
                                        className="rounded text-indigo-600 focus:ring-0"
                                    />
                                    <span>Mandatory</span>
                                </label>
                            </div>

                            <div className="sm:col-span-2">
                                <button
                                    type="button"
                                    onClick={() => handleAddSkill()}
                                    className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-xs font-semibold flex items-center justify-center space-x-1 cursor-pointer transition-colors"
                                >
                                    <Plus className="w-3.5 h-3.5" />
                                    <span>Add</span>
                                </button>
                            </div>
                        </div>

                        {/* Popular Skill Quick Suggestions */}
                        <div>
                            <span className="text-[10px] text-gray-500 mr-2">Quick Add:</span>
                            <div className="inline-flex flex-wrap gap-1 mt-1">
                                {POPULAR_SKILLS.map(skill => {
                                    const isAdded = formData.requiredSkills.some(s => s.name.toLowerCase() === skill.toLowerCase());
                                    if (isAdded) return null;
                                    return (
                                        <button
                                            key={skill}
                                            type="button"
                                            onClick={() => handleAddSkill(skill)}
                                            className="text-[10px] bg-white border border-gray-200 hover:border-indigo-300 text-gray-600 hover:text-indigo-600 px-2 py-0.5 rounded-full transition-all"
                                        >
                                            + {skill}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Current Skill Badges */}
                        <div className="flex flex-wrap gap-2 pt-1">
                            {formData.requiredSkills.map((skill, idx) => (
                                <div
                                    key={idx}
                                    className="flex items-center space-x-1.5 bg-white border border-indigo-200 px-2.5 py-1 rounded-lg text-xs shadow-xs"
                                >
                                    <span className="font-semibold text-gray-900">{skill.name}</span>
                                    <span className={`text-[10px] px-1.5 py-0.2 rounded font-medium ${
                                        skill.level === 'Expert' ? 'bg-purple-100 text-purple-700' :
                                        skill.level === 'Advanced' ? 'bg-indigo-100 text-indigo-700' :
                                        skill.level === 'Intermediate' ? 'bg-blue-100 text-blue-700' :
                                        'bg-gray-100 text-gray-600'
                                    }`}>
                                        {skill.level}
                                    </span>
                                    {skill.isMandatory && (
                                        <span className="text-[9px] bg-red-100 text-red-700 px-1 rounded font-bold uppercase">
                                            Req
                                        </span>
                                    )}
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveSkill(idx)}
                                        className="text-gray-400 hover:text-red-500 ml-1"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Step 5: Eligibility Criteria */}
                    <div className="bg-gray-50/70 p-4 rounded-xl border border-gray-200/80 space-y-4">
                        <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider flex items-center space-x-1.5">
                            <GraduationCap className="w-3.5 h-3.5 text-blue-600" />
                            <span>Eligibility Criteria</span>
                        </h3>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                    Minimum CGPA Cutoff (0 - 10)
                                </label>
                                <input
                                    type="number"
                                    step="0.1"
                                    min="0"
                                    max="10"
                                    value={formData.eligibilityCriteria.minCgpa}
                                    onChange={handleCgpaChange}
                                    className="w-full text-xs bg-white border border-gray-300 rounded-lg px-3 py-2 outline-none"
                                />
                            </div>

                            <div className="sm:col-span-2">
                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                    Eligible Graduation Batches
                                </label>
                                <div className="flex flex-wrap gap-1.5">
                                    {BATCH_OPTIONS.map(batch => {
                                        const checked = formData.eligibilityCriteria.gradYear?.includes(batch);
                                        return (
                                            <button
                                                type="button"
                                                key={batch}
                                                onClick={() => toggleBatch(batch)}
                                                className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${
                                                    checked
                                                        ? 'bg-blue-600 text-white border-blue-600 font-bold'
                                                        : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-100'
                                                }`}
                                            >
                                                Batch {batch}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1.5">
                                Eligible Academic Branches
                            </label>
                            <div className="flex flex-wrap gap-1.5">
                                {BRANCH_OPTIONS.map(branch => {
                                    const checked = formData.eligibilityCriteria.branches?.includes(branch);
                                    return (
                                        <button
                                            type="button"
                                            key={branch}
                                            onClick={() => toggleBranch(branch)}
                                            className={`px-2.5 py-1 text-xs rounded-lg border transition-all ${
                                                checked
                                                    ? 'bg-indigo-600 text-white border-indigo-600 font-semibold shadow-xs'
                                                    : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-100'
                                            }`}
                                        >
                                            {branch}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Step 6: Description & Responsibilities */}
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                                Role Overview & About the Project / Position
                            </label>
                            <textarea
                                rows="3"
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                placeholder="Describe the day-to-day role, company culture, learning curve, and tech stack in detail..."
                                className="w-full text-xs bg-white border border-gray-300 rounded-lg p-3 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 resize-y"
                            ></textarea>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                                Key Responsibilities (Optional)
                            </label>
                            <textarea
                                rows="2"
                                name="responsibilities"
                                value={formData.responsibilities}
                                onChange={handleInputChange}
                                placeholder="• Design and maintain microservices&#10;• Collaborate with cross-functional product and QA teams&#10;• Write clean, production-grade unit tests"
                                className="w-full text-xs bg-white border border-gray-300 rounded-lg p-3 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 resize-y"
                            ></textarea>
                        </div>
                    </div>

                    {/* Step 7: Status selector */}
                    <div className="flex items-center justify-between p-3.5 bg-gray-50 rounded-xl border border-gray-200">
                        <div>
                            <span className="block text-xs font-bold text-gray-900">Publishing Status</span>
                            <span className="text-[11px] text-gray-500">
                                Open postings are immediately visible to eligible candidates on the student portal.
                            </span>
                        </div>
                        <select
                            name="status"
                            value={formData.status}
                            onChange={handleInputChange}
                            className="text-xs font-semibold bg-white border border-gray-300 rounded-lg px-3 py-2 outline-none cursor-pointer"
                        >
                            <option value="Open">🟢 Open / Active</option>
                            <option value="Paused">🟡 Paused</option>
                            <option value="Closed">🔴 Closed</option>
                            <option value="Draft">⚪ Draft</option>
                        </select>
                    </div>

                    {/* Modal Actions Footer */}
                    <div className="pt-2 flex items-center justify-end space-x-3 border-t border-gray-100">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={loading}
                            className="px-4 py-2.5 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50 text-xs font-semibold transition-all cursor-pointer"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white text-xs font-bold shadow-md shadow-indigo-600/20 transition-all flex items-center space-x-2 cursor-pointer disabled:opacity-60"
                        >
                            {loading ? (
                                <span>Saving Opportunity...</span>
                            ) : (
                                <>
                                    <CheckCircle2 className="w-4 h-4" />
                                    <span>{isEdit ? 'Update Opportunity' : 'Publish Opportunity'}</span>
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
