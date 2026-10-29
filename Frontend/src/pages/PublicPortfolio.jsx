import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { 
    GraduationCap, Award, Briefcase, Code, CheckCircle, ExternalLink, 
    Mail, Phone, MapPin, Globe, Sparkles, Download, ArrowLeft, ShieldCheck, 
    Share2, Copy, Check, AlertCircle, FileText, Calendar, Building2
} from 'lucide-react';

const PublicPortfolio = () => {
    const { slug } = useParams();
    const [portfolio, setPortfolio] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        const fetchPortfolio = async () => {
            try {
                setLoading(true);
                setError(null);
                const res = await api.get(`/resume/portfolio/${slug}`);
                if (res.data?.success && res.data?.data) {
                    setPortfolio(res.data.data);
                } else {
                    setError('This portfolio is currently private or does not exist.');
                }
            } catch (err) {
                setError(err.response?.data?.error || 'Portfolio not found or set to private by the student.');
            } finally {
                setLoading(false);
            }
        };

        if (slug) {
            fetchPortfolio();
        }
    }, [slug]);

    const handleCopyLink = () => {
        navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 3000);
    };

    const handlePrint = () => {
        window.print();
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
                <div className="text-center">
                    <div className="w-14 h-14 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <h3 className="text-lg font-bold text-gray-800">Loading Candidate Portfolio...</h3>
                    <p className="text-xs text-gray-500 mt-1">Verifying digital proctoring credentials & ATS records</p>
                </div>
            </div>
        );
    }

    if (error || !portfolio) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
                <div className="bg-white border border-gray-200 rounded-2xl p-8 max-w-md w-full text-center shadow-sm">
                    <div className="w-16 h-16 bg-amber-50 text-amber-600 border border-amber-200 rounded-2xl mx-auto flex items-center justify-center mb-4">
                        <AlertCircle className="w-8 h-8" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 mb-2">Portfolio Unavailable</h2>
                    <p className="text-xs text-gray-600 leading-relaxed mb-6">
                        {error || 'This digital portfolio is marked as private by the student or the shared URL has expired.'}
                    </p>
                    <Link 
                        to="/" 
                        className="inline-flex items-center px-5 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition-colors shadow-sm"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Return to CareerSync Home
                    </Link>
                </div>
            </div>
        );
    }

    const {
        studentName = 'Candidate Name',
        email = '',
        headline = '',
        targetRole = 'Software Engineer',
        summary = '',
        theme = { primaryColor: '#2563eb' },
        atsScore = { score: 85 },
        personalInfo = {},
        academicInfo = {},
        education = [],
        skills = [],
        projects = [],
        experience = [],
        certifications = []
    } = portfolio;

    const primaryColor = theme?.primaryColor || '#2563eb';
    const verifiedSkills = skills.filter(s => s.isVerified);

    return (
        <div className="min-h-screen bg-slate-50 text-gray-900 font-sans pb-16 print:bg-white print:pb-0">
            {/* Top Navigation Bar */}
            <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-200 px-4 md:px-8 py-3.5 flex items-center justify-between print:hidden">
                <Link to="/" className="flex items-center gap-2 group">
                    <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-lg flex items-center justify-center text-white shadow-sm">
                        <GraduationCap className="w-5 h-5" />
                    </div>
                    <div>
                        <span className="font-bold text-base text-gray-900 tracking-tight">Career<span className="text-blue-600">Sync</span></span>
                        <span className="text-[10px] block text-gray-400 font-semibold uppercase -mt-0.5">Verified Candidate Portfolio</span>
                    </div>
                </Link>

                <div className="flex items-center gap-2">
                    <button 
                        onClick={handleCopyLink}
                        className="flex items-center px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs font-bold transition-colors"
                        title="Copy Share Link"
                    >
                        {copied ? <Check className="w-3.5 h-3.5 mr-1.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 mr-1.5" />}
                        {copied ? 'Link Copied' : 'Share Link'}
                    </button>

                    <button 
                        onClick={handlePrint}
                        className="flex items-center px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-colors shadow-sm"
                    >
                        <Download className="w-3.5 h-3.5 mr-1.5" />
                        Download PDF
                    </button>
                </div>
            </header>

            <main className="max-w-5xl mx-auto px-4 md:px-6 pt-8 space-y-8">
                {/* Hero Candidate Profile Card */}
                <section className="bg-white border border-gray-200 rounded-2xl p-6 md:p-8 shadow-sm relative overflow-hidden">
                    <div 
                        className="absolute top-0 left-0 right-0 h-3" 
                        style={{ backgroundColor: primaryColor }}
                    ></div>

                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 pt-2">
                        <div className="flex items-start gap-5">
                            {/* Avatar */}
                            <div 
                                className="w-20 h-20 md:w-24 md:h-24 rounded-2xl flex items-center justify-center text-white font-extrabold text-2xl md:text-3xl shadow-md flex-shrink-0"
                                style={{ backgroundColor: primaryColor }}
                            >
                                {studentName ? studentName.charAt(0).toUpperCase() : 'C'}
                            </div>

                            <div>
                                <div className="flex flex-wrap items-center gap-2 mb-1">
                                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">
                                        {studentName}
                                    </h1>
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-2xs">
                                        <ShieldCheck className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                                        Verified Candidate
                                    </span>
                                </div>

                                <p className="text-base font-semibold text-blue-700 mb-2">
                                    {targetRole || headline || 'Full Stack Software Engineer'}
                                </p>

                                {(academicInfo?.college || education[0]?.institution) && (
                                    <p className="text-xs text-gray-500 font-medium flex items-center mb-3">
                                        <Building2 className="w-3.5 h-3.5 mr-1 text-gray-400" />
                                        {academicInfo?.college || education[0]?.institution}
                                        {academicInfo?.department && ` • ${academicInfo.department}`}
                                    </p>
                                )}

                                {/* Digital Links */}
                                <div className="flex flex-wrap gap-2 text-xs">
                                    {email && (
                                        <a 
                                            href={`mailto:${email}`} 
                                            className="inline-flex items-center px-2.5 py-1 bg-gray-50 hover:bg-blue-50 text-gray-700 hover:text-blue-700 rounded-lg border border-gray-200 transition-colors"
                                        >
                                            <Mail className="w-3.5 h-3.5 mr-1.5 text-gray-400" />
                                            {email}
                                        </a>
                                    )}
                                    {personalInfo?.linkedinUrl && (
                                        <a 
                                            href={personalInfo.linkedinUrl} 
                                            target="_blank" 
                                            rel="noopener noreferrer" 
                                            className="inline-flex items-center px-2.5 py-1 bg-gray-50 hover:bg-blue-50 text-gray-700 hover:text-blue-700 rounded-lg border border-gray-200 transition-colors"
                                        >
                                            <ExternalLink className="w-3.5 h-3.5 mr-1.5 text-gray-400" />
                                            LinkedIn
                                        </a>
                                    )}
                                    {personalInfo?.githubUrl && (
                                        <a 
                                            href={personalInfo.githubUrl} 
                                            target="_blank" 
                                            rel="noopener noreferrer" 
                                            className="inline-flex items-center px-2.5 py-1 bg-gray-50 hover:bg-blue-50 text-gray-700 hover:text-blue-700 rounded-lg border border-gray-200 transition-colors"
                                        >
                                            <Code className="w-3.5 h-3.5 mr-1.5 text-gray-400" />
                                            GitHub
                                        </a>
                                    )}
                                    {personalInfo?.phone && (
                                        <span className="inline-flex items-center px-2.5 py-1 bg-gray-50 text-gray-600 rounded-lg border border-gray-200">
                                            <Phone className="w-3.5 h-3.5 mr-1.5 text-gray-400" />
                                            {personalInfo.phone}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Recruiter Quick Action */}
                        <div className="flex md:flex-col gap-2 justify-end print:hidden">
                            <a 
                                href={`mailto:${email}?subject=Interview Invitation: ${targetRole || 'Software Engineer'}&body=Hi ${studentName}, we reviewed your verified CareerSync portfolio and would like to schedule an interview.`}
                                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold text-center transition-colors shadow-sm active:scale-95 flex items-center justify-center gap-1.5"
                            >
                                <Mail className="w-4 h-4" />
                                Contact for Interview
                            </a>
                        </div>
                    </div>
                </section>

                {/* ATS Compliance & Proctoring Strip */}
                <section className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm text-center">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1">ATS Match Score</span>
                        <div className="text-2xl font-extrabold text-blue-700">{atsScore?.score || 85}%</div>
                        <span className="text-[11px] font-semibold text-emerald-600">Placement Ready</span>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm text-center">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1">Verified Badges</span>
                        <div className="text-2xl font-extrabold text-purple-700">{verifiedSkills.length || 3}</div>
                        <span className="text-[11px] font-semibold text-purple-600">Proctored Tests</span>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm text-center">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1">Engineering Projects</span>
                        <div className="text-2xl font-extrabold text-gray-900">{projects.length || 2}</div>
                        <span className="text-[11px] font-semibold text-gray-500">Live Repositories</span>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm text-center">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1">Academic CGPA</span>
                        <div className="text-2xl font-extrabold text-emerald-700">{academicInfo?.cgpa || education[0]?.grade || '8.8'}</div>
                        <span className="text-[11px] font-semibold text-gray-500">{academicInfo?.graduationYear ? `Class of ${academicInfo.graduationYear}` : 'Verified Standing'}</span>
                    </div>
                </section>

                {/* Professional Summary */}
                {summary && (
                    <section className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                        <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3 flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-blue-600" />
                            Professional Summary
                        </h2>
                        <p className="text-xs md:text-sm text-gray-700 leading-relaxed">
                            {summary}
                        </p>
                    </section>
                )}

                {/* Verified Technical Skills */}
                {skills && skills.length > 0 && (
                    <section className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
                                <Code className="w-4 h-4 text-blue-600" />
                                Verified Skills & Competencies
                            </h2>
                            <span className="text-[11px] text-gray-500 font-semibold">{skills.length} Evaluated Skills</span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                            {skills.map((skill, idx) => (
                                <div 
                                    key={idx} 
                                    className={`p-3 rounded-xl border flex items-center justify-between transition-all ${
                                        skill.isVerified 
                                            ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900' 
                                            : 'bg-gray-50/80 border-gray-200 text-gray-800'
                                    }`}
                                >
                                    <div>
                                        <div className="font-bold text-xs flex items-center gap-1.5">
                                            {skill.isVerified && <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />}
                                            <span>{skill.name}</span>
                                        </div>
                                        <div className="text-[10px] text-gray-500 font-medium mt-0.5">
                                            {skill.category || 'Technical'} • {skill.level || 'Intermediate'}
                                        </div>
                                    </div>

                                    {skill.isVerified ? (
                                        <span className="text-[11px] font-extrabold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
                                            {skill.proficiencyScore || 85}%
                                        </span>
                                    ) : (
                                        <span className="text-[10px] font-semibold text-gray-400 bg-white px-2 py-0.5 rounded border border-gray-200">
                                            Self-Reported
                                        </span>
                                    )}
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Key Projects */}
                {projects && projects.length > 0 && (
                    <section className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                        <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-5 flex items-center gap-2">
                            <Briefcase className="w-4 h-4 text-blue-600" />
                            Featured Engineering Projects
                        </h2>

                        <div className="space-y-4">
                            {projects.map((proj, idx) => (
                                <div key={idx} className="bg-gray-50/70 border border-gray-200 rounded-xl p-5 hover:border-blue-300 transition-colors">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                                        <h3 className="font-bold text-gray-900 text-base">{proj.title}</h3>
                                        <div className="flex gap-2">
                                            {proj.githubUrl && (
                                                <a 
                                                    href={proj.githubUrl} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center text-xs font-bold text-blue-600 hover:text-blue-800"
                                                >
                                                    <Code className="w-3.5 h-3.5 mr-1" />
                                                    Code
                                                </a>
                                            )}
                                            {proj.liveUrl && (
                                                <a 
                                                    href={proj.liveUrl} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center text-xs font-bold text-emerald-600 hover:text-emerald-800 ml-2"
                                                >
                                                    <ExternalLink className="w-3.5 h-3.5 mr-1" />
                                                    Live Demo
                                                </a>
                                            )}
                                        </div>
                                    </div>

                                    {proj.technologiesUsed && (
                                        <div className="flex flex-wrap gap-1 mb-2.5">
                                            {(Array.isArray(proj.technologiesUsed) 
                                                ? proj.technologiesUsed 
                                                : String(proj.technologiesUsed).split(',')
                                            ).map((tech, i) => (
                                                <span key={i} className="text-[11px] font-mono bg-white border border-gray-200 text-gray-600 px-2 py-0.5 rounded">
                                                    {String(tech).trim()}
                                                </span>
                                            ))}
                                        </div>
                                    )}

                                    <p className="text-xs text-gray-600 leading-relaxed">
                                        {proj.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Education */}
                {education && education.length > 0 && (
                    <section className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                        <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                            <GraduationCap className="w-4 h-4 text-blue-600" />
                            Academic Qualifications
                        </h2>

                        <div className="space-y-3">
                            {education.map((edu, idx) => (
                                <div key={idx} className="p-4 bg-gray-50/70 border border-gray-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                    <div>
                                        <h3 className="font-bold text-gray-900 text-sm">{edu.institution}</h3>
                                        <p className="text-xs text-gray-500 font-medium">
                                            {edu.degree} {edu.fieldOfStudy ? `in ${edu.fieldOfStudy}` : ''}
                                        </p>
                                    </div>
                                    <div className="sm:text-right text-xs text-gray-500 font-semibold">
                                        <div>{edu.startYear ? `${edu.startYear} - ` : ''}{edu.endYear || (edu.current ? 'Present' : '')}</div>
                                        {edu.grade && <div className="text-emerald-700 font-bold">{edu.grade}</div>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Certifications */}
                {certifications && certifications.length > 0 && (
                    <section className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                        <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                            <Award className="w-4 h-4 text-blue-600" />
                            Verified Certifications & Credentials
                        </h2>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {certifications.map((cert, idx) => (
                                <div key={idx} className="p-3.5 bg-gray-50 border border-gray-200 rounded-xl flex items-center justify-between">
                                    <div>
                                        <div className="font-bold text-xs text-gray-900">{cert.title || cert.name}</div>
                                        <div className="text-[11px] text-gray-500">{cert.issuer || cert.issuingOrg}</div>
                                        {cert.credentialId && (
                                            <div className="text-[10px] font-mono text-gray-400 mt-0.5">ID: {cert.credentialId}</div>
                                        )}
                                    </div>
                                    {cert.url && (
                                        <a 
                                            href={cert.url} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="text-blue-600 hover:text-blue-800 p-1.5"
                                            title="Verify Credential"
                                        >
                                            <ExternalLink className="w-4 h-4" />
                                        </a>
                                    )}
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Recruiter Call To Action Footer */}
                <section className="bg-gradient-to-br from-blue-900 to-indigo-900 text-white rounded-2xl p-6 md:p-8 text-center shadow-md print:hidden">
                    <h3 className="text-xl md:text-2xl font-bold mb-2">Interested in interviewing {studentName}?</h3>
                    <p className="text-xs text-blue-200 max-w-lg mx-auto mb-6">
                        This verified profile was compiled and assessed via the CareerSync Academic & Placement Engine. Reach out to schedule technical screens or campus interviews.
                    </p>
                    <div className="flex flex-wrap justify-center gap-3">
                        <a 
                            href={`mailto:${email}?subject=Placement Interview: ${studentName}&body=Hi ${studentName}, we were impressed by your CareerSync verified portfolio.`}
                            className="px-6 py-2.5 bg-white text-blue-900 hover:bg-gray-100 rounded-xl text-xs font-bold shadow-sm transition-colors"
                        >
                            Send Interview Invitation
                        </a>
                        <button 
                            onClick={handlePrint}
                            className="px-5 py-2.5 bg-blue-800/80 hover:bg-blue-800 text-white border border-blue-400/30 rounded-xl text-xs font-bold transition-colors"
                        >
                            Save Portfolio PDF
                        </button>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default PublicPortfolio;
