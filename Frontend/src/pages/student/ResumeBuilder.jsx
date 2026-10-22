import React, { useState, useEffect, useContext, useRef } from 'react';
import api from '../../services/api';
import { AuthContext } from '../../context/AuthContext';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FileText, Download, Share2, Sparkles, CheckCircle2, AlertCircle,
    LayoutTemplate, Palette, Eye, EyeOff, Save, ExternalLink, Copy, Check,
    User, Mail, Phone, MapPin, Globe, Award, Briefcase, GraduationCap, Code2, Link
} from 'lucide-react';

const ResumeBuilder = () => {
    const { user } = useContext(AuthContext);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [sharing, setSharing] = useState(false);
    const [copied, setCopied] = useState(false);
    const [shareUrl, setShareUrl] = useState('');
    const [isPublic, setIsPublic] = useState(false);
    const [message, setMessage] = useState({ text: '', type: '' });

    // Resume & Profile State
    const [profile, setProfile] = useState(null);
    const [atsScore, setAtsScore] = useState({ score: 75, strengths: [], improvements: [] });
    
    const [config, setConfig] = useState({
        template: 'modern',
        primaryColor: '#2563eb',
        targetJobTitle: 'Full Stack Software Engineer',
        professionalSummary: 'Detail-oriented and results-driven software engineer with solid foundations in full-stack web development, modern cloud architectures, and database design. Eager to solve challenging problems and deliver scalable solutions.',
        sectionVisibility: {
            summary: true,
            education: true,
            skills: true,
            projects: true,
            experience: true,
            certifications: true
        }
    });

    const resumeRef = useRef(null);

    // Fetch initial resume configuration and profile data
    useEffect(() => {
        const fetchResumeData = async () => {
            try {
                setLoading(true);
                const res = await api.get('/resume');
                if (res.data?.success && res.data?.data) {
                    const { resumeConfig, profile: userProfile, atsScore: scoreData } = res.data.data;
                    if (userProfile) setProfile(userProfile);
                    if (scoreData) setAtsScore(scoreData);
                    
                    if (resumeConfig) {
                        setConfig({
                            template: resumeConfig.theme?.template || 'modern',
                            primaryColor: resumeConfig.theme?.primaryColor || '#2563eb',
                            targetJobTitle: resumeConfig.targetJobTitle || 'Full Stack Software Engineer',
                            professionalSummary: resumeConfig.professionalSummary || '',
                            sectionVisibility: {
                                summary: resumeConfig.sectionVisibility?.summary ?? true,
                                education: resumeConfig.sectionVisibility?.education ?? true,
                                skills: resumeConfig.sectionVisibility?.skills ?? true,
                                projects: resumeConfig.sectionVisibility?.projects ?? true,
                                experience: resumeConfig.sectionVisibility?.experience ?? true,
                                certifications: resumeConfig.sectionVisibility?.certifications ?? true
                            }
                        });
                        setIsPublic(Boolean(resumeConfig.isPublic));
                        if (resumeConfig.shareableSlug) {
                            setShareUrl(`${window.location.origin}/portfolio/${resumeConfig.shareableSlug}`);
                        }
                    }
                }
            } catch (err) {
                console.error("Error loading resume:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchResumeData();
    }, []);

    // Save resume changes and recalculate ATS score
    const handleSave = async () => {
        try {
            setSaving(true);
            const payload = {
                template: config.template,
                primaryColor: config.primaryColor,
                targetJobTitle: config.targetJobTitle,
                professionalSummary: config.professionalSummary,
                sectionVisibility: config.sectionVisibility
            };
            const res = await api.put('/resume', payload);
            if (res.data?.success) {
                if (res.data.data?.atsScore) {
                    setAtsScore(res.data.data.atsScore);
                }
                setMessage({ text: 'Resume settings and ATS score saved successfully!', type: 'success' });
            }
        } catch (err) {
            setMessage({ text: 'Failed to save resume configuration.', type: 'error' });
        } finally {
            setSaving(false);
            setTimeout(() => setMessage({ text: '', type: '' }), 4000);
        }
    };

    // Toggle public portfolio sharing
    const handleToggleShare = async () => {
        try {
            setSharing(true);
            const res = await api.post('/resume/share');
            if (res.data?.success) {
                const nextShared = res.data.data.isShared;
                setIsPublic(nextShared);
                if (nextShared) {
                    const fullUrl = `${window.location.origin}${res.data.data.shareableUrl}`;
                    setShareUrl(fullUrl);
                    setMessage({ text: 'Public portfolio link activated!', type: 'success' });
                } else {
                    setMessage({ text: 'Portfolio link deactivated (private).', type: 'info' });
                }
            }
        } catch (err) {
            setMessage({ text: 'Failed to update share status.', type: 'error' });
        } finally {
            setSharing(false);
            setTimeout(() => setMessage({ text: '', type: '' }), 4000);
        }
    };

    const copyShareLink = () => {
        if (!shareUrl) return;
        navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 3000);
    };

    // Export PDF using html2canvas & jsPDF
    const handleDownloadPDF = async () => {
        const element = resumeRef.current;
        if (!element) return;

        try {
            setMessage({ text: 'Generating high-resolution ATS PDF...', type: 'info' });
            
            // Clone or render element without scaling glitches
            const canvas = await html2canvas(element, {
                scale: 2,
                useCORS: true,
                backgroundColor: '#ffffff'
            });

            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            const fileName = `${(profile?.personalInfo?.name || user?.name || 'Resume').replace(/\s+/g, '_')}_ATS_Resume.pdf`;
            pdf.save(fileName);

            setMessage({ text: 'PDF downloaded successfully!', type: 'success' });
        } catch (err) {
            console.error('PDF export failed:', err);
            setMessage({ text: 'Error generating PDF. Please retry.', type: 'error' });
        } finally {
            setTimeout(() => setMessage({ text: '', type: '' }), 4000);
        }
    };

    const colorPalette = [
        { name: 'Royal Blue', hex: '#2563eb' },
        { name: 'Emerald', hex: '#059669' },
        { name: 'Violet', hex: '#7c3aed' },
        { name: 'Slate Gray', hex: '#1e293b' },
        { name: 'Crimson', hex: '#dc2626' }
    ];

    const templates = [
        { id: 'modern', name: 'Modern Tech', desc: 'Sleek two-column layout with accented highlights' },
        { id: 'classic', name: 'Classic ATS', desc: 'Standard top-down layout favoured by corporate recruiters' },
        { id: 'minimal', name: 'Minimalist', desc: 'Clean typography with maximum white space' },
        { id: 'executive', name: 'Executive', desc: 'Prominent header banner with structured sub-blocks' }
    ];

    // Data helpers
    const studentName = profile?.personalInfo?.name || user?.name || 'Candidate Name';
    const email = user?.email || 'candidate@careersync.com';
    const phone = profile?.personalInfo?.phone || '+91 98765 43210';
    const linkedin = profile?.personalInfo?.linkedinUrl || 'linkedin.com/in/profile';
    const github = profile?.personalInfo?.githubUrl || 'github.com/profile';
    const college = profile?.academicInfo?.college || 'University Institute of Technology';
    const dept = profile?.academicInfo?.department || 'Computer Science & Engineering';
    const cgpa = profile?.academicInfo?.cgpa || '8.8';
    const gradYear = profile?.academicInfo?.graduationYear || '2026';

    const skillsList = profile?.skills && profile.skills.length > 0 
        ? profile.skills 
        : [
            { name: 'JavaScript (ES6+)', level: 'Advanced', category: 'Technical' },
            { name: 'React.js', level: 'Advanced', category: 'Technical' },
            { name: 'Node.js / Express', level: 'Intermediate', category: 'Technical' },
            { name: 'MongoDB / PostgreSQL', level: 'Intermediate', category: 'Technical' },
            { name: 'Git & GitHub CI/CD', level: 'Advanced', category: 'Technical' },
            { name: 'Agile & Scrum', level: 'Intermediate', category: 'Soft' }
        ];

    const projectsList = profile?.projects && profile.projects.length > 0 
        ? profile.projects 
        : [
            {
                title: 'CareerSync AI Placement Platform',
                technologiesUsed: ['React', 'TailwindCSS', 'Node.js', 'MongoDB', 'Cloudflare'],
                description: 'Engineered an end-to-end recruitment management portal with ATS resume scoring, anti-cheat assessments, and real-time student gap analysis.'
            },
            {
                title: 'High-Concurrency Task Engine',
                technologiesUsed: ['Node.js', 'Redis', 'Docker'],
                description: 'Architected an asynchronous job queue processing 10k+ events/sec with sub-50ms latency.'
            }
        ];

    const certsList = profile?.certifications && profile.certifications.length > 0
        ? profile.certifications
        : [
            { name: 'AWS Certified Cloud Practitioner', issuingOrg: 'Amazon Web Services', issueDate: '2025' }
        ];

    return (
        <div className="max-w-7xl mx-auto pb-12">
            {/* Header bar */}
            <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-gray-900 tracking-tight flex items-center">
                        <FileText className="w-8 h-8 mr-3 text-blue-600" />
                        ATS Resume Builder & Portfolio Hub
                    </h2>
                    <p className="text-gray-600 text-sm mt-1">
                        Customize styling, track ATS keyword readiness, and export standard recruiter-compliant resumes.
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    <button
                        onClick={handleToggleShare}
                        disabled={sharing}
                        className={`flex items-center px-4 py-2 rounded-lg text-sm font-semibold border transition-all shadow-sm ${
                            isPublic 
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-emerald-100'
                                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                        }`}
                    >
                        <Share2 className="w-4 h-4 mr-2" />
                        {isPublic ? 'Public Active' : 'Make Public'}
                    </button>

                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex items-center px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg text-sm font-semibold hover:bg-gray-50 shadow-sm transition-all"
                    >
                        <Save className="w-4 h-4 mr-2 text-blue-600" />
                        {saving ? 'Saving...' : 'Save Settings'}
                    </button>

                    <button
                        onClick={handleDownloadPDF}
                        className="flex items-center px-5 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 shadow-sm transition-all active:scale-95"
                    >
                        <Download className="w-4 h-4 mr-2" />
                        Download PDF
                    </button>
                </div>
            </div>

            {/* Notification message */}
            {message.text && (
                <div className={`mb-6 p-3.5 rounded-lg text-sm font-medium border flex items-center justify-between ${
                    message.type === 'success' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' :
                    message.type === 'error' ? 'bg-red-50 text-red-800 border-red-200' :
                    'bg-blue-50 text-blue-800 border-blue-200'
                }`}>
                    <span>{message.text}</span>
                    <button onClick={() => setMessage({ text: '', type: '' })} className="text-xs uppercase font-bold underline">Close</button>
                </div>
            )}

            {/* Share link banner if active */}
            {isPublic && shareUrl && (
                <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-sm">
                    <div className="flex items-center space-x-3">
                        <div className="w-9 h-9 rounded-lg bg-blue-600 text-white flex items-center justify-center">
                            <Globe className="w-5 h-5" />
                        </div>
                        <div>
                            <div className="text-sm font-bold text-gray-900">Your Public Portfolio is Live!</div>
                            <div className="text-xs text-blue-700 font-mono truncate max-w-md">{shareUrl}</div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={copyShareLink}
                            className="flex items-center px-3 py-1.5 bg-white text-gray-700 border border-gray-300 rounded-lg text-xs font-semibold hover:bg-gray-50 transition-all"
                        >
                            {copied ? <Check className="w-3.5 h-3.5 mr-1 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 mr-1" />}
                            {copied ? 'Copied Link!' : 'Copy Link'}
                        </button>
                    </div>
                </div>
            )}

            {/* Main Studio Grid: Controls (Left) vs Live Preview (Right) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left Column: ATS Meter & Customization Controls */}
                <div className="lg:col-span-5 space-y-6">
                    {/* ATS Score Card */}
                    <div className="bg-white border border-blue-100 rounded-xl p-5 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center space-x-2">
                                <Sparkles className="w-5 h-5 text-amber-500" />
                                <h3 className="font-bold text-gray-900 text-base">ATS Compliance Score</h3>
                            </div>
                            <div className={`text-xl font-extrabold px-3 py-1 rounded-full border ${
                                atsScore.score >= 80 ? 'text-emerald-700 bg-emerald-50 border-emerald-300' :
                                atsScore.score >= 60 ? 'text-amber-700 bg-amber-50 border-amber-300' :
                                'text-red-700 bg-red-50 border-red-300'
                            }`}>
                                {atsScore.score} / 100
                            </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden mb-4">
                            <div 
                                className={`h-full transition-all duration-500 ${
                                    atsScore.score >= 80 ? 'bg-emerald-500' :
                                    atsScore.score >= 60 ? 'bg-amber-500' :
                                    'bg-red-500'
                                }`} 
                                style={{ width: `${atsScore.score}%` }}
                            ></div>
                        </div>

                        {/* Strengths & Improvements */}
                        <div className="space-y-3 text-xs">
                            {atsScore.strengths && atsScore.strengths.length > 0 && (
                                <div>
                                    <div className="font-semibold text-emerald-800 mb-1.5 flex items-center">
                                        <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                                        ATS Strengths
                                    </div>
                                    <ul className="space-y-1 pl-4 text-gray-600 list-disc">
                                        {atsScore.strengths.map((str, i) => (
                                            <li key={i}>{str}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {atsScore.improvements && atsScore.improvements.length > 0 && (
                                <div className="pt-2 border-t border-gray-100">
                                    <div className="font-semibold text-amber-800 mb-1.5 flex items-center">
                                        <AlertCircle className="w-3.5 h-3.5 mr-1 text-amber-600" />
                                        Recommended Improvements
                                    </div>
                                    <ul className="space-y-1 pl-4 text-gray-600 list-disc">
                                        {atsScore.improvements.map((imp, i) => (
                                            <li key={i}>{imp}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Role & Summary Form */}
                    <div className="bg-white border border-blue-100 rounded-xl p-5 shadow-sm space-y-4">
                        <h3 className="font-bold text-gray-900 text-sm flex items-center">
                            <User className="w-4 h-4 mr-2 text-blue-600" />
                            Target Headline & Summary
                        </h3>

                        <div>
                            <label className="block text-gray-700 text-xs font-semibold mb-1">Target Job Title</label>
                            <input
                                type="text"
                                className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-lg px-3 py-2 text-sm focus:bg-white focus:border-blue-500 outline-none"
                                value={config.targetJobTitle}
                                onChange={e => setConfig(prev => ({ ...prev, targetJobTitle: e.target.value }))}
                                placeholder="e.g. Senior Frontend Developer"
                            />
                        </div>

                        <div>
                            <label className="block text-gray-700 text-xs font-semibold mb-1">Professional Summary</label>
                            <textarea
                                rows="4"
                                className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-lg px-3 py-2 text-sm focus:bg-white focus:border-blue-500 outline-none resize-none"
                                value={config.professionalSummary}
                                onChange={e => setConfig(prev => ({ ...prev, professionalSummary: e.target.value }))}
                                placeholder="Write a 3-4 sentence elevator pitch with quantifiable impact and core technologies..."
                            ></textarea>
                            <div className="text-right text-[11px] text-gray-400 mt-0.5">
                                {config.professionalSummary.length} characters
                            </div>
                        </div>
                    </div>

                    {/* Template Selector */}
                    <div className="bg-white border border-blue-100 rounded-xl p-5 shadow-sm">
                        <h3 className="font-bold text-gray-900 text-sm flex items-center mb-3">
                            <LayoutTemplate className="w-4 h-4 mr-2 text-blue-600" />
                            Resume Template Format
                        </h3>

                        <div className="grid grid-cols-2 gap-2.5">
                            {templates.map(tpl => (
                                <button
                                    key={tpl.id}
                                    onClick={() => setConfig(prev => ({ ...prev, template: tpl.id }))}
                                    className={`p-3 rounded-lg border text-left transition-all ${
                                        config.template === tpl.id 
                                            ? 'border-blue-600 bg-blue-50/60 ring-2 ring-blue-100'
                                            : 'border-gray-200 hover:border-gray-300 bg-white'
                                    }`}
                                >
                                    <div className="font-bold text-xs text-gray-900">{tpl.name}</div>
                                    <div className="text-[10px] text-gray-500 mt-0.5 leading-snug">{tpl.desc}</div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Color Accent Picker */}
                    <div className="bg-white border border-blue-100 rounded-xl p-5 shadow-sm">
                        <h3 className="font-bold text-gray-900 text-sm flex items-center mb-3">
                            <Palette className="w-4 h-4 mr-2 text-blue-600" />
                            Primary Theme Accent
                        </h3>

                        <div className="flex items-center gap-3">
                            {colorPalette.map(color => (
                                <button
                                    key={color.hex}
                                    onClick={() => setConfig(prev => ({ ...prev, primaryColor: color.hex }))}
                                    className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                                        config.primaryColor === color.hex 
                                            ? 'ring-4 ring-offset-2 ring-blue-300 scale-110 shadow-sm' 
                                            : 'hover:scale-105'
                                    }`}
                                    style={{ backgroundColor: color.hex }}
                                    title={color.name}
                                >
                                    {config.primaryColor === color.hex && (
                                        <Check className="w-4 h-4 text-white" />
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Section Visibility Toggles */}
                    <div className="bg-white border border-blue-100 rounded-xl p-5 shadow-sm">
                        <h3 className="font-bold text-gray-900 text-sm flex items-center mb-3">
                            <Eye className="w-4 h-4 mr-2 text-blue-600" />
                            Section Display Controls
                        </h3>

                        <div className="grid grid-cols-2 gap-2 text-xs">
                            {Object.entries(config.sectionVisibility).map(([key, val]) => (
                                <button
                                    key={key}
                                    onClick={() => setConfig(prev => ({
                                        ...prev,
                                        sectionVisibility: {
                                            ...prev.sectionVisibility,
                                            [key]: !val
                                        }
                                    }))}
                                    className={`flex items-center justify-between p-2 rounded-lg border transition-all ${
                                        val ? 'bg-gray-50 border-gray-200 text-gray-800' : 'bg-gray-100 text-gray-400 border-gray-200 opacity-60'
                                    }`}
                                >
                                    <span className="capitalize font-medium">{key}</span>
                                    {val ? <Eye className="w-3.5 h-3.5 text-blue-600" /> : <EyeOff className="w-3.5 h-3.5 text-gray-400" />}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Column: Live Styled Resume Preview Canvas */}
                <div className="lg:col-span-7 flex flex-col items-center">
                    <div className="w-full flex items-center justify-between mb-3 px-1">
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Live Document Canvas (A4 Standard)</span>
                        <span className="text-xs text-blue-600 font-medium">Updates live with edits</span>
                    </div>

                    {/* The rendered sheet */}
                    <div className="w-full bg-gray-200/80 p-4 rounded-xl shadow-inner overflow-x-auto flex justify-center">
                        <div
                            ref={resumeRef}
                            id="rendered-resume-canvas"
                            className="bg-white text-gray-900 shadow-2xl rounded-sm p-10 w-[780px] min-h-[1050px] font-sans text-[13px] leading-relaxed transition-all"
                            style={{ fontFamily: "'Inter', sans-serif" }}
                        >
                            {/* MODERN TEMPLATE */}
                            {config.template === 'modern' && (
                                <div>
                                    {/* Header */}
                                    <div 
                                        className="pb-5 mb-6 border-b-2"
                                        style={{ borderColor: config.primaryColor }}
                                    >
                                        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 mb-1">
                                            {studentName}
                                        </h1>
                                        <div 
                                            className="text-base font-semibold tracking-wide mb-3"
                                            style={{ color: config.primaryColor }}
                                        >
                                            {config.targetJobTitle}
                                        </div>

                                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-600">
                                            <span className="flex items-center"><Mail className="w-3 h-3 mr-1 text-gray-400" />{email}</span>
                                            {phone && <span className="flex items-center"><Phone className="w-3 h-3 mr-1 text-gray-400" />{phone}</span>}
                                            {linkedin && <span className="flex items-center"><Link className="w-3 h-3 mr-1 text-gray-400" />{linkedin}</span>}
                                            {github && <span className="flex items-center"><Code2 className="w-3 h-3 mr-1 text-gray-400" />{github}</span>}
                                        </div>
                                    </div>

                                    {/* Summary */}
                                    {config.sectionVisibility.summary && config.professionalSummary && (
                                        <div className="mb-6">
                                            <h2 
                                                className="text-xs font-bold uppercase tracking-wider mb-2 flex items-center"
                                                style={{ color: config.primaryColor }}
                                            >
                                                Professional Summary
                                            </h2>
                                            <p className="text-gray-700 leading-normal">
                                                {config.professionalSummary}
                                            </p>
                                        </div>
                                    )}

                                    {/* Technical Skills */}
                                    {config.sectionVisibility.skills && (
                                        <div className="mb-6">
                                            <h2 
                                                className="text-xs font-bold uppercase tracking-wider mb-2"
                                                style={{ color: config.primaryColor }}
                                            >
                                                Technical & Core Skills
                                            </h2>
                                            <div className="flex flex-wrap gap-1.5">
                                                {skillsList.map((skill, idx) => (
                                                    <span 
                                                        key={idx} 
                                                        className="px-2.5 py-1 rounded text-xs font-semibold bg-gray-100 text-gray-800"
                                                    >
                                                        {skill.name}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Projects */}
                                    {config.sectionVisibility.projects && projectsList.length > 0 && (
                                        <div className="mb-6">
                                            <h2 
                                                className="text-xs font-bold uppercase tracking-wider mb-3"
                                                style={{ color: config.primaryColor }}
                                            >
                                                Key Engineering Projects
                                            </h2>
                                            <div className="space-y-4">
                                                {projectsList.map((proj, idx) => (
                                                    <div key={idx}>
                                                        <div className="flex justify-between items-baseline font-bold text-sm text-gray-900">
                                                            <span>{proj.title}</span>
                                                        </div>
                                                        {proj.technologiesUsed && (
                                                            <div className="text-[11px] font-mono text-gray-500 mb-1">
                                                                Technologies: {Array.isArray(proj.technologiesUsed) ? proj.technologiesUsed.join(', ') : proj.technologiesUsed}
                                                            </div>
                                                        )}
                                                        <p className="text-gray-700 text-xs leading-relaxed">
                                                            {proj.description}
                                                        </p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Education */}
                                    {config.sectionVisibility.education && (
                                        <div className="mb-6">
                                            <h2 
                                                className="text-xs font-bold uppercase tracking-wider mb-2"
                                                style={{ color: config.primaryColor }}
                                            >
                                                Education & Credentials
                                            </h2>
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <div className="font-bold text-gray-900">{college}</div>
                                                    <div className="text-xs text-gray-600">{dept}</div>
                                                </div>
                                                <div className="text-right text-xs text-gray-600">
                                                    <div>Class of {gradYear}</div>
                                                    <div className="font-semibold text-gray-800">CGPA: {cgpa}</div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Certifications */}
                                    {config.sectionVisibility.certifications && certsList.length > 0 && (
                                        <div>
                                            <h2 
                                                className="text-xs font-bold uppercase tracking-wider mb-2"
                                                style={{ color: config.primaryColor }}
                                            >
                                                Verified Certifications
                                            </h2>
                                            <div className="space-y-1.5 text-xs text-gray-700">
                                                {certsList.map((cert, idx) => (
                                                    <div key={idx} className="flex justify-between">
                                                        <span className="font-medium text-gray-900">{cert.name}</span>
                                                        <span className="text-gray-500">{cert.issuingOrg}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* CLASSIC / MINIMAL / EXECUTIVE TEMPLATES */}
                            {config.template !== 'modern' && (
                                <div>
                                    <div className="text-center pb-6 mb-6 border-b border-gray-300">
                                        <h1 className="text-3xl font-serif font-bold text-gray-900 tracking-wide uppercase">
                                            {studentName}
                                        </h1>
                                        <div 
                                            className="text-sm font-semibold tracking-wider uppercase mt-1 mb-2"
                                            style={{ color: config.primaryColor }}
                                        >
                                            {config.targetJobTitle}
                                        </div>
                                        <div className="text-xs text-gray-600 space-x-3">
                                            <span>{email}</span>
                                            <span>•</span>
                                            <span>{phone}</span>
                                            <span>•</span>
                                            <span>{linkedin}</span>
                                        </div>
                                    </div>

                                    {config.sectionVisibility.summary && config.professionalSummary && (
                                        <div className="mb-5">
                                            <h3 className="font-bold uppercase tracking-wider text-xs border-b border-gray-300 pb-1 mb-2" style={{ color: config.primaryColor }}>
                                                Summary
                                            </h3>
                                            <p className="text-gray-700 text-xs leading-relaxed">{config.professionalSummary}</p>
                                        </div>
                                    )}

                                    {config.sectionVisibility.education && (
                                        <div className="mb-5">
                                            <h3 className="font-bold uppercase tracking-wider text-xs border-b border-gray-300 pb-1 mb-2" style={{ color: config.primaryColor }}>
                                                Education
                                            </h3>
                                            <div className="flex justify-between text-xs">
                                                <div>
                                                    <strong className="text-gray-900">{college}</strong>
                                                    <div className="text-gray-600">{dept}</div>
                                                </div>
                                                <div className="text-right text-gray-600">
                                                    <span>{gradYear} | CGPA: {cgpa}</span>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {config.sectionVisibility.skills && (
                                        <div className="mb-5">
                                            <h3 className="font-bold uppercase tracking-wider text-xs border-b border-gray-300 pb-1 mb-2" style={{ color: config.primaryColor }}>
                                                Technical Competencies
                                            </h3>
                                            <p className="text-xs text-gray-700 leading-relaxed">
                                                {skillsList.map(s => s.name).join(' • ')}
                                            </p>
                                        </div>
                                    )}

                                    {config.sectionVisibility.projects && projectsList.length > 0 && (
                                        <div className="mb-5">
                                            <h3 className="font-bold uppercase tracking-wider text-xs border-b border-gray-300 pb-1 mb-2" style={{ color: config.primaryColor }}>
                                                Projects & Deployments
                                            </h3>
                                            <div className="space-y-3">
                                                {projectsList.map((p, i) => (
                                                    <div key={i} className="text-xs">
                                                        <div className="font-bold text-gray-900">{p.title}</div>
                                                        <p className="text-gray-600 mt-0.5">{p.description}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResumeBuilder;
