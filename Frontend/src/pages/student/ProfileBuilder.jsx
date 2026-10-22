import React, { useState, useEffect, useContext } from 'react';
import api from '../../services/api';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    User, BookOpen, Code, Award, Briefcase, FileText, 
    CheckCircle, ChevronRight, ChevronLeft, Plus, Trash2, Download, Save, Sparkles, MapPin, Target
} from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';

const ProfileBuilder = () => {
    const { user } = useContext(AuthContext);
    const [currentStep, setCurrentStep] = useState(1);
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState({ text: '', type: '' });

    // Form State
    const [formData, setFormData] = useState({
        personal: { 
            name: user?.name || '',
            phone: '', 
            portfolioUrl: '', 
            githubUrl: '', 
            linkedinUrl: '' 
        },
        academic: { 
            college: '', 
            department: '', 
            semester: '', 
            graduationYear: '', 
            cgpa: '' 
        },
        skills: [
            { name: 'JavaScript', level: 'Intermediate', category: 'Technical' },
            { name: 'React.js', level: 'Intermediate', category: 'Technical' }
        ],
        projects: [
            { title: '', description: '', technologiesUsed: '', githubUrl: '', liveUrl: '' }
        ],
        career: { 
            targetRoles: 'Full Stack Developer', 
            preferredLocations: 'Remote, Bengaluru' 
        }
    });

    const updateField = (section, field, value) => {
        setFormData(prev => ({
            ...prev,
            [section]: { ...prev[section], [field]: value }
        }));
    };

    const handleArrayChange = (section, index, field, value) => {
        const newArray = [...formData[section]];
        newArray[index][field] = value;
        setFormData(prev => ({ ...prev, [section]: newArray }));
    };

    const addArrayItem = (section, template) => {
        setFormData(prev => ({ ...prev, [section]: [...prev[section], template] }));
    };

    const removeArrayItem = (section, index) => {
        const newArray = formData[section].filter((_, i) => i !== index);
        setFormData(prev => ({ ...prev, [section]: newArray }));
    };

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await api.get('/profile/me');
                if (res.data?.success && res.data?.data) {
                    const dbProfile = res.data.data;
                    setFormData({
                        personal: {
                            name: dbProfile.user?.name || user?.name || '',
                            phone: dbProfile.personalInfo?.phone || '',
                            portfolioUrl: dbProfile.personalInfo?.portfolioUrl || '',
                            githubUrl: dbProfile.personalInfo?.githubUrl || '',
                            linkedinUrl: dbProfile.personalInfo?.linkedinUrl || ''
                        },
                        academic: dbProfile.academicInfo || { college: '', department: '', semester: '', graduationYear: '', cgpa: '' },
                        skills: dbProfile.skills && dbProfile.skills.length > 0 ? dbProfile.skills : [
                            { name: 'JavaScript', level: 'Intermediate', category: 'Technical' },
                            { name: 'React.js', level: 'Intermediate', category: 'Technical' }
                        ],
                        projects: dbProfile.projects && dbProfile.projects.length > 0 
                            ? dbProfile.projects.map(p => ({
                                ...p, 
                                technologiesUsed: Array.isArray(p.technologiesUsed) ? p.technologiesUsed.join(', ') : (p.technologiesUsed || '')
                            })) 
                            : [{ title: '', description: '', technologiesUsed: '', githubUrl: '', liveUrl: '' }],
                        career: dbProfile.careerInterests || { targetRoles: 'Full Stack Developer', preferredLocations: 'Remote' }
                    });
                }
            } catch (err) {
                console.log("No existing profile or error fetching profile:", err);
            }
        };
        fetchProfile();
    }, [user]);

    const saveProfile = async () => {
        setIsSaving(true);
        setMessage({ text: '', type: '' });
        try {
            const processedProjects = formData.projects
                .filter(p => p.title?.trim())
                .map(p => ({
                    ...p,
                    technologiesUsed: typeof p.technologiesUsed === 'string' 
                        ? p.technologiesUsed.split(',').map(s => s.trim()).filter(Boolean) 
                        : (p.technologiesUsed || [])
                }));

            const payload = {
                personalInfo: formData.personal,
                academicInfo: formData.academic,
                skills: formData.skills.filter(s => s.name?.trim()),
                projects: processedProjects,
                careerInterests: formData.career
            };

            const res = await api.post('/profile', payload);
            if (res.data?.success) {
                setMessage({ text: 'Profile successfully updated and synchronized!', type: 'success' });
            }
        } catch (err) {
            setMessage({ 
                text: err.response?.data?.message || 'Failed to save profile. Please check your connection.', 
                type: 'error' 
            });
        } finally {
            setIsSaving(false);
            setTimeout(() => setMessage({ text: '', type: '' }), 5000);
        }
    };

    const generateResumePDF = async () => {
        const input = document.getElementById('resume-pdf-template');
        if (!input) return;
        
        try {
            // Temporarily position visible for canvas capture
            input.style.display = 'block';
            input.style.position = 'absolute';
            input.style.left = '0px';
            input.style.top = '0px';
            input.style.zIndex = '9999';

            const canvas = await html2canvas(input, { scale: 2, useCORS: true });
            const imgData = canvas.toDataURL('image/png');
            
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
            
            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save(`${formData.personal.name || 'Student'}_Resume.pdf`);
            
            // Re-hide
            input.style.display = 'none';
        } catch (err) {
            console.error("PDF Generation Error", err);
            setMessage({ text: 'Error generating PDF. Please try again.', type: 'error' });
        }
    };

    const steps = [
        { num: 1, title: 'Personal & Academic', icon: User },
        { num: 2, title: 'Skills & Proficiencies', icon: Code },
        { num: 3, title: 'Projects & Career', icon: Briefcase },
        { num: 4, title: 'Review & Resume', icon: FileText }
    ];

    const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 4));
    const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

    return (
        <div className="max-w-5xl mx-auto pb-12">
            {/* Header & Actions */}
            <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Digital Profile Builder</h2>
                    <p className="text-gray-600 text-sm mt-1">Complete your profile to unlock automated ATS scoring, skill matching, and verified badges.</p>
                </div>
                
                <div className="flex items-center gap-3">
                    <button 
                        onClick={saveProfile} 
                        disabled={isSaving}
                        className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 shadow-sm transition-all active:scale-95 disabled:opacity-50"
                    >
                        <Save className="w-4 h-4 mr-2" />
                        {isSaving ? 'Saving...' : 'Save Profile'}
                    </button>
                </div>
            </div>

            {/* Notification alert */}
            {message.text && (
                <div className={`mb-6 p-4 rounded-lg text-sm font-medium flex items-center justify-between border ${
                    message.type === 'success' 
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                        : 'bg-red-50 text-red-700 border-red-200'
                }`}>
                    <span>{message.text}</span>
                    <button onClick={() => setMessage({ text: '', type: '' })} className="text-xs uppercase font-bold underline ml-4">Dismiss</button>
                </div>
            )}

            {/* Stepper Wizard Progress */}
            <div className="relative mb-10 pt-2">
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-gray-200 rounded-full z-0"></div>
                <div 
                    className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-blue-600 rounded-full z-0 transition-all duration-300"
                    style={{ width: `${((currentStep - 1) / 3) * 100}%` }}
                ></div>

                <div className="flex justify-between items-center relative z-10">
                    {steps.map((step) => {
                        const Icon = step.icon;
                        const isDone = currentStep > step.num;
                        const isCurrent = currentStep === step.num;
                        return (
                            <button
                                key={step.num}
                                onClick={() => setCurrentStep(step.num)}
                                className="flex flex-col items-center group cursor-pointer focus:outline-none"
                            >
                                <div className={`w-11 h-11 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-200 shadow-sm ${
                                    isDone
                                        ? 'bg-blue-600 text-white border-2 border-blue-600 ring-4 ring-blue-100'
                                        : isCurrent
                                        ? 'bg-blue-600 text-white border-2 border-blue-600 ring-4 ring-blue-100 shadow-md scale-105'
                                        : 'bg-white text-gray-500 border-2 border-gray-300 hover:border-blue-400'
                                }`}>
                                    {isDone ? <CheckCircle className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                                </div>
                                <span className={`mt-2 text-xs font-semibold tracking-wide ${
                                    isCurrent ? 'text-blue-700 font-bold' : isDone ? 'text-gray-700' : 'text-gray-400'
                                }`}>
                                    {step.title}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Step Content Container */}
            <div className="bg-white border border-blue-100 rounded-xl p-8 shadow-sm relative overflow-hidden">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentStep}
                        initial={{ opacity: 0, x: 15 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -15 }}
                        transition={{ duration: 0.2 }}
                    >
                        {/* STEP 1: PERSONAL & ACADEMIC */}
                        {currentStep === 1 && (
                            <div className="space-y-6">
                                <div className="border-b border-gray-100 pb-4 mb-6">
                                    <h3 className="text-lg font-bold text-gray-900 flex items-center">
                                        <User className="w-5 h-5 mr-2 text-blue-600" />
                                        Personal & Contact Information
                                    </h3>
                                    <p className="text-xs text-gray-500 mt-1">Provide your primary contact links so recruiters can reach you directly.</p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div>
                                        <label className="block text-gray-700 text-xs font-semibold mb-1.5">Full Name</label>
                                        <input 
                                            type="text" 
                                            className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-lg px-4 py-2.5 text-sm focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all" 
                                            placeholder="John Doe" 
                                            value={formData.personal.name} 
                                            onChange={e => updateField('personal', 'name', e.target.value)} 
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 text-xs font-semibold mb-1.5">Phone Number</label>
                                        <input 
                                            type="tel" 
                                            className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-lg px-4 py-2.5 text-sm focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all" 
                                            placeholder="+91 9876543210" 
                                            value={formData.personal.phone} 
                                            onChange={e => updateField('personal', 'phone', e.target.value)} 
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 text-xs font-semibold mb-1.5">LinkedIn Profile URL</label>
                                        <input 
                                            type="url" 
                                            className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-lg px-4 py-2.5 text-sm focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all" 
                                            placeholder="https://linkedin.com/in/username" 
                                            value={formData.personal.linkedinUrl} 
                                            onChange={e => updateField('personal', 'linkedinUrl', e.target.value)} 
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 text-xs font-semibold mb-1.5">GitHub Profile URL</label>
                                        <input 
                                            type="url" 
                                            className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-lg px-4 py-2.5 text-sm focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all" 
                                            placeholder="https://github.com/username" 
                                            value={formData.personal.githubUrl} 
                                            onChange={e => updateField('personal', 'githubUrl', e.target.value)} 
                                        />
                                    </div>
                                </div>

                                <div className="border-b border-gray-100 pb-4 pt-6 mb-6">
                                    <h3 className="text-lg font-bold text-gray-900 flex items-center">
                                        <BookOpen className="w-5 h-5 mr-2 text-blue-600" />
                                        Academic Credentials
                                    </h3>
                                    <p className="text-xs text-gray-500 mt-1">Institutions and current academic metrics.</p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div className="md:col-span-2">
                                        <label className="block text-gray-700 text-xs font-semibold mb-1.5">College / University</label>
                                        <input 
                                            type="text" 
                                            className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-lg px-4 py-2.5 text-sm focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all" 
                                            placeholder="Indian Institute of Technology / State University" 
                                            value={formData.academic.college} 
                                            onChange={e => updateField('academic', 'college', e.target.value)} 
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 text-xs font-semibold mb-1.5">Department / Major</label>
                                        <input 
                                            type="text" 
                                            className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-lg px-4 py-2.5 text-sm focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all" 
                                            placeholder="Computer Science & Engineering" 
                                            value={formData.academic.department} 
                                            onChange={e => updateField('academic', 'department', e.target.value)} 
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 text-xs font-semibold mb-1.5">Current Semester</label>
                                        <input 
                                            type="text" 
                                            className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-lg px-4 py-2.5 text-sm focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all" 
                                            placeholder="6th Semester" 
                                            value={formData.academic.semester} 
                                            onChange={e => updateField('academic', 'semester', e.target.value)} 
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 text-xs font-semibold mb-1.5">Expected Graduation Year</label>
                                        <input 
                                            type="text" 
                                            className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-lg px-4 py-2.5 text-sm focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all" 
                                            placeholder="2026" 
                                            value={formData.academic.graduationYear} 
                                            onChange={e => updateField('academic', 'graduationYear', e.target.value)} 
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 text-xs font-semibold mb-1.5">CGPA / Percentage</label>
                                        <input 
                                            type="text" 
                                            className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-lg px-4 py-2.5 text-sm focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all" 
                                            placeholder="8.75 / 10" 
                                            value={formData.academic.cgpa} 
                                            onChange={e => updateField('academic', 'cgpa', e.target.value)} 
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* STEP 2: SKILLS & PROFICIENCIES */}
                        {currentStep === 2 && (
                            <div className="space-y-6">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 pb-4 mb-6">
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-900 flex items-center">
                                            <Code className="w-5 h-5 mr-2 text-purple-600" />
                                            Skills Inventory
                                        </h3>
                                        <p className="text-xs text-gray-500 mt-1">List technical programming languages, frameworks, and domain knowledge.</p>
                                    </div>
                                    <button 
                                        onClick={() => addArrayItem('skills', { name: '', level: 'Intermediate', category: 'Technical' })} 
                                        className="flex items-center text-xs font-bold text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200 px-3 py-2 rounded-lg transition-colors"
                                    >
                                        <Plus className="w-4 h-4 mr-1" />
                                        Add New Skill
                                    </button>
                                </div>

                                <div className="space-y-3">
                                    {formData.skills.map((skill, idx) => (
                                        <div key={idx} className="flex flex-col md:flex-row gap-3 items-start md:items-center bg-gray-50/80 p-3.5 rounded-lg border border-gray-200">
                                            <div className="flex-1 w-full">
                                                <input 
                                                    type="text" 
                                                    className="w-full bg-white border border-gray-300 text-gray-900 rounded-lg px-3 py-2 text-sm focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none" 
                                                    placeholder="Skill name (e.g. Node.js, Docker, Python)" 
                                                    value={skill.name} 
                                                    onChange={e => handleArrayChange('skills', idx, 'name', e.target.value)} 
                                                />
                                            </div>
                                            <div className="w-full md:w-44">
                                                <select 
                                                    className="w-full bg-white border border-gray-300 text-gray-800 rounded-lg px-3 py-2 text-sm focus:border-purple-500 outline-none" 
                                                    value={skill.category} 
                                                    onChange={e => handleArrayChange('skills', idx, 'category', e.target.value)}
                                                >
                                                    <option value="Technical">Technical</option>
                                                    <option value="Soft">Soft Skill</option>
                                                    <option value="Domain">Domain / Tool</option>
                                                </select>
                                            </div>
                                            <div className="w-full md:w-44">
                                                <select 
                                                    className="w-full bg-white border border-gray-300 text-gray-800 rounded-lg px-3 py-2 text-sm focus:border-purple-500 outline-none" 
                                                    value={skill.level} 
                                                    onChange={e => handleArrayChange('skills', idx, 'level', e.target.value)}
                                                >
                                                    <option value="Beginner">Beginner</option>
                                                    <option value="Intermediate">Intermediate</option>
                                                    <option value="Advanced">Advanced</option>
                                                    <option value="Expert">Expert</option>
                                                </select>
                                            </div>
                                            {formData.skills.length > 1 && (
                                                <button 
                                                    onClick={() => removeArrayItem('skills', idx)} 
                                                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-200"
                                                    title="Remove skill"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* STEP 3: PROJECTS & CAREER PREFERENCES */}
                        {currentStep === 3 && (
                            <div className="space-y-6">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 pb-4 mb-6">
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-900 flex items-center">
                                            <Briefcase className="w-5 h-5 mr-2 text-emerald-600" />
                                            Key Projects
                                        </h3>
                                        <p className="text-xs text-gray-500 mt-1">Showcase high-impact projects with modern technologies.</p>
                                    </div>
                                    <button 
                                        onClick={() => addArrayItem('projects', { title: '', description: '', technologiesUsed: '', githubUrl: '', liveUrl: '' })} 
                                        className="flex items-center text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-3 py-2 rounded-lg transition-colors"
                                    >
                                        <Plus className="w-4 h-4 mr-1" />
                                        Add New Project
                                    </button>
                                </div>

                                <div className="space-y-6">
                                    {formData.projects.map((proj, idx) => (
                                        <div key={idx} className="bg-gray-50/70 p-5 rounded-lg border border-gray-200 relative">
                                            {formData.projects.length > 1 && (
                                                <button 
                                                    onClick={() => removeArrayItem('projects', idx)} 
                                                    className="absolute top-4 right-4 text-gray-400 hover:text-red-600 p-1 rounded-md hover:bg-red-50 transition-colors"
                                                    title="Remove project"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            )}
                                            
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 pr-8">
                                                <div>
                                                    <label className="block text-gray-700 text-xs font-semibold mb-1.5">Project Title</label>
                                                    <input 
                                                        type="text" 
                                                        className="w-full bg-white border border-gray-300 text-gray-900 rounded-lg px-3 py-2 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none" 
                                                        placeholder="e.g. AI-Powered Resume Ranker" 
                                                        value={proj.title} 
                                                        onChange={e => handleArrayChange('projects', idx, 'title', e.target.value)} 
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-gray-700 text-xs font-semibold mb-1.5">Tech Stack (comma-separated)</label>
                                                    <input 
                                                        type="text" 
                                                        className="w-full bg-white border border-gray-300 text-gray-900 rounded-lg px-3 py-2 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none" 
                                                        placeholder="React, Node.js, Express, MongoDB" 
                                                        value={proj.technologiesUsed} 
                                                        onChange={e => handleArrayChange('projects', idx, 'technologiesUsed', e.target.value)} 
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-gray-700 text-xs font-semibold mb-1.5">Repository Link (GitHub)</label>
                                                    <input 
                                                        type="url" 
                                                        className="w-full bg-white border border-gray-300 text-gray-900 rounded-lg px-3 py-2 text-sm focus:border-emerald-500 outline-none" 
                                                        placeholder="https://github.com/username/project" 
                                                        value={proj.githubUrl} 
                                                        onChange={e => handleArrayChange('projects', idx, 'githubUrl', e.target.value)} 
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-gray-700 text-xs font-semibold mb-1.5">Live Demo URL</label>
                                                    <input 
                                                        type="url" 
                                                        className="w-full bg-white border border-gray-300 text-gray-900 rounded-lg px-3 py-2 text-sm focus:border-emerald-500 outline-none" 
                                                        placeholder="https://myproject.vercel.app" 
                                                        value={proj.liveUrl || ''} 
                                                        onChange={e => handleArrayChange('projects', idx, 'liveUrl', e.target.value)} 
                                                    />
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-gray-700 text-xs font-semibold mb-1.5">Project Overview & Results</label>
                                                <textarea 
                                                    rows="3" 
                                                    className="w-full bg-white border border-gray-300 text-gray-900 rounded-lg px-3 py-2 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none resize-none" 
                                                    placeholder="Engineered a full-stack platform supporting 500+ active users with 99.9% uptime..." 
                                                    value={proj.description} 
                                                    onChange={e => handleArrayChange('projects', idx, 'description', e.target.value)}
                                                ></textarea>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="border-t border-gray-100 pt-6 mt-6">
                                    <h3 className="text-lg font-bold text-gray-900 flex items-center mb-4">
                                        <Target className="w-5 h-5 mr-2 text-blue-600" />
                                        Target Role & Location Preferences
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-gray-700 text-xs font-semibold mb-1.5">Target Roles</label>
                                            <input 
                                                type="text" 
                                                className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-lg px-4 py-2.5 text-sm focus:bg-white focus:border-blue-500 outline-none" 
                                                placeholder="e.g. Full Stack Developer, DevOps Engineer" 
                                                value={formData.career.targetRoles} 
                                                onChange={e => updateField('career', 'targetRoles', e.target.value)} 
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-gray-700 text-xs font-semibold mb-1.5">Preferred Locations</label>
                                            <input 
                                                type="text" 
                                                className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-lg px-4 py-2.5 text-sm focus:bg-white focus:border-blue-500 outline-none" 
                                                placeholder="e.g. Remote, Bengaluru, Hyderabad" 
                                                value={formData.career.preferredLocations} 
                                                onChange={e => updateField('career', 'preferredLocations', e.target.value)} 
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* STEP 4: REVIEW & RESUME GENERATION */}
                        {currentStep === 4 && (
                            <div className="py-6 text-center max-w-2xl mx-auto">
                                <div className="w-16 h-16 bg-blue-50 border border-blue-200 rounded-2xl mx-auto flex items-center justify-center mb-4 text-blue-600 shadow-sm">
                                    <Sparkles className="w-8 h-8" />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-2">Profile Completed & Ready!</h3>
                                <p className="text-gray-600 text-sm mb-8">
                                    Your verified student profile is ready. You can save all attributes to the database or instantly download an ATS-compliant PDF resume formatted for recruiting algorithms.
                                </p>

                                <div className="flex flex-col sm:flex-row justify-center gap-4">
                                    <button 
                                        onClick={generateResumePDF} 
                                        className="flex items-center justify-center px-6 py-3 bg-white text-gray-800 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition-all shadow-sm active:scale-95 text-sm"
                                    >
                                        <Download className="w-4 h-4 mr-2 text-blue-600" />
                                        Download Instant PDF
                                    </button>

                                    <button 
                                        onClick={saveProfile} 
                                        disabled={isSaving}
                                        className="flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all shadow-md active:scale-95 text-sm disabled:opacity-50"
                                    >
                                        <Save className="w-4 h-4 mr-2" />
                                        {isSaving ? 'Synchronizing...' : 'Save Profile Changes'}
                                    </button>
                                </div>
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>

                {/* Bottom Step Navigation Controls */}
                <div className="flex justify-between items-center mt-10 pt-6 border-t border-gray-100">
                    <button 
                        onClick={prevStep}
                        disabled={currentStep === 1}
                        className={`flex items-center px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                            currentStep === 1 
                                ? 'opacity-0 pointer-events-none' 
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                    >
                        <ChevronLeft className="w-4 h-4 mr-1" />
                        Previous Step
                    </button>
                    
                    {currentStep < 4 ? (
                        <button 
                            onClick={nextStep}
                            className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 shadow-sm transition-all"
                        >
                            Next Step
                            <ChevronRight className="w-4 h-4 ml-1" />
                        </button>
                    ) : (
                        <div className="w-24"></div>
                    )}
                </div>
            </div>

            {/* HIDDEN RESUME PREVIEW CONTAINER FOR PDF CAPTURE (Rendered offscreen) */}
            <div 
                id="resume-pdf-template" 
                style={{ display: 'none', width: '800px', backgroundColor: '#ffffff', color: '#111827', padding: '40px', fontFamily: 'sans-serif' }}
            >
                <div style={{ borderBottom: '2px solid #2563eb', paddingBottom: '16px', marginBottom: '24px' }}>
                    <h1 style={{ fontSize: '28px', fontWeight: 'bold', margin: 0, color: '#1e3a8a' }}>
                        {formData.personal.name || user?.name || 'Student Name'}
                    </h1>
                    <div style={{ fontSize: '13px', color: '#4b5563', marginTop: '6px' }}>
                        {formData.personal.phone && <span>{formData.personal.phone} • </span>}
                        {user?.email && <span>{user.email} • </span>}
                        {formData.personal.linkedinUrl && <span>{formData.personal.linkedinUrl} • </span>}
                        {formData.personal.githubUrl && <span>{formData.personal.githubUrl}</span>}
                    </div>
                </div>

                {formData.academic.college && (
                    <div style={{ marginBottom: '20px' }}>
                        <h2 style={{ fontSize: '16px', fontWeight: 'bold', textTransform: 'uppercase', color: '#2563eb', borderBottom: '1px solid #e5e7eb', paddingBottom: '4px', marginBottom: '8px' }}>
                            Education
                        </h2>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '14px' }}>
                            <span>{formData.academic.college}</span>
                            <span>{formData.academic.graduationYear ? `Class of ${formData.academic.graduationYear}` : ''}</span>
                        </div>
                        <div style={{ fontSize: '13px', color: '#4b5563' }}>
                            {formData.academic.department} {formData.academic.cgpa ? `| CGPA: ${formData.academic.cgpa}` : ''}
                        </div>
                    </div>
                )}

                {formData.skills && formData.skills.length > 0 && (
                    <div style={{ marginBottom: '20px' }}>
                        <h2 style={{ fontSize: '16px', fontWeight: 'bold', textTransform: 'uppercase', color: '#2563eb', borderBottom: '1px solid #e5e7eb', paddingBottom: '4px', marginBottom: '8px' }}>
                            Technical Skills
                        </h2>
                        <div style={{ fontSize: '13px', color: '#374151', lineHeight: '1.6' }}>
                            <strong>Languages & Frameworks:</strong> {formData.skills.map(s => s.name).filter(Boolean).join(', ')}
                        </div>
                    </div>
                )}

                {formData.projects && formData.projects.length > 0 && (
                    <div style={{ marginBottom: '20px' }}>
                        <h2 style={{ fontSize: '16px', fontWeight: 'bold', textTransform: 'uppercase', color: '#2563eb', borderBottom: '1px solid #e5e7eb', paddingBottom: '4px', marginBottom: '8px' }}>
                            Featured Projects
                        </h2>
                        {formData.projects.map((proj, idx) => (
                            <div key={idx} style={{ marginBottom: '12px' }}>
                                <div style={{ fontWeight: 'bold', fontSize: '14px', color: '#111827' }}>
                                    {proj.title}
                                </div>
                                {proj.technologiesUsed && (
                                    <div style={{ fontSize: '12px', fontStyle: 'italic', color: '#6b7280', marginBottom: '4px' }}>
                                        Technologies: {proj.technologiesUsed}
                                    </div>
                                )}
                                <div style={{ fontSize: '13px', color: '#4b5563', lineHeight: '1.4' }}>
                                    {proj.description}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProfileBuilder;