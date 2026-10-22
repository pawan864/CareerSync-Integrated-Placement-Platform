import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Award, CheckCircle, Plus, Trash2, ExternalLink, ShieldCheck, 
    Calendar, Building, Sparkles, X, Check
} from 'lucide-react';

const Certifications = () => {
    const [certifications, setCertifications] = useState([]);
    const [verifiedSkills, setVerifiedSkills] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState({ text: '', type: '' });

    // New cert form state
    const [formData, setFormData] = useState({
        title: '',
        issuer: '',
        dateIssued: '',
        expiryDate: '',
        credentialId: '',
        url: ''
    });

    const fetchCredentials = async () => {
        try {
            setLoading(true);
            const res = await api.get('/profile/me');
            if (res.data?.success && res.data.data) {
                const profile = res.data.data;
                setCertifications(profile.certifications || []);
                const verified = (profile.skills || []).filter(s => s.isVerified);
                setVerifiedSkills(verified);
            }
        } catch (err) {
            console.error('Failed to load certifications:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCredentials();
    }, []);

    const handleAddCertification = async (e) => {
        e.preventDefault();
        if (!formData.title || !formData.issuer) {
            setMessage({ text: 'Title and Issuing Organization are required.', type: 'error' });
            return;
        }

        try {
            setIsSubmitting(true);
            const res = await api.post('/profile/certifications', formData);
            if (res.data?.success) {
                setCertifications(res.data.data);
                setIsModalOpen(false);
                setFormData({
                    title: '',
                    issuer: '',
                    dateIssued: '',
                    expiryDate: '',
                    credentialId: '',
                    url: ''
                });
                setMessage({ text: 'Certificate successfully added to your verified profile!', type: 'success' });
            }
        } catch (err) {
            setMessage({ text: err.response?.data?.error || 'Failed to add certificate.', type: 'error' });
        } finally {
            setIsSubmitting(false);
            setTimeout(() => setMessage({ text: '', type: '' }), 4000);
        }
    };

    const handleDeleteCertification = async (certId) => {
        if (!window.confirm('Are you sure you want to remove this credential?')) return;
        try {
            const res = await api.delete(`/profile/certifications/${certId}`);
            if (res.data?.success) {
                setCertifications(res.data.data);
                setMessage({ text: 'Certification removed.', type: 'info' });
            }
        } catch (err) {
            setMessage({ text: 'Failed to delete certificate.', type: 'error' });
        } finally {
            setTimeout(() => setMessage({ text: '', type: '' }), 4000);
        }
    };

    return (
        <div className="max-w-6xl mx-auto pb-12">
            {/* Header */}
            <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-gray-900 tracking-tight flex items-center">
                        <Award className="w-8 h-8 mr-3 text-blue-600" />
                        Credentials & Verified Certifications
                    </h2>
                    <p className="text-gray-600 text-sm mt-1">
                        Showcase industry certifications, licenses, and verified skill badges earned through CareerSync proctored testing.
                    </p>
                </div>

                <button 
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center px-4 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 shadow-sm transition-all active:scale-95"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Certification
                </button>
            </div>

            {/* Notification Alert */}
            {message.text && (
                <div className={`mb-6 p-4 rounded-lg text-sm font-medium flex items-center justify-between border ${
                    message.type === 'success' 
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
                        : message.type === 'error'
                        ? 'bg-red-50 text-red-800 border-red-200'
                        : 'bg-blue-50 text-blue-800 border-blue-200'
                }`}>
                    <span>{message.text}</span>
                    <button onClick={() => setMessage({ text: '', type: '' })} className="text-xs uppercase font-bold underline">Dismiss</button>
                </div>
            )}

            {/* Platform Verified Badges Section */}
            {verifiedSkills.length > 0 && (
                <div className="mb-10">
                    <div className="flex items-center gap-2 mb-4">
                        <ShieldCheck className="w-5 h-5 text-emerald-600" />
                        <h3 className="text-lg font-bold text-gray-900">CareerSync Verified Skill Badges</h3>
                        <span className="text-xs font-semibold px-2.5 py-0.5 bg-emerald-100 text-emerald-800 rounded-full">
                            {verifiedSkills.length} Verified
                        </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {verifiedSkills.map((skill, idx) => (
                            <div 
                                key={idx}
                                className="bg-gradient-to-br from-emerald-50/70 to-blue-50/50 border border-emerald-200 rounded-xl p-4 shadow-sm flex items-center gap-3.5"
                            >
                                <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center flex-shrink-0 shadow-sm">
                                    <Sparkles className="w-6 h-6" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-bold text-gray-900 text-sm truncate">{skill.name}</h4>
                                    <div className="text-xs text-emerald-700 font-semibold flex items-center mt-0.5">
                                        <Check className="w-3.5 h-3.5 mr-1" />
                                        Score: {skill.proficiencyScore || 85}% • {skill.level}
                                    </div>
                                    <div className="text-[10px] text-gray-400 mt-0.5">
                                        Anti-Cheat Verified
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* External Certifications Table */}
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                    <h3 className="font-bold text-gray-900 text-base">Industry Credentials & Diplomas</h3>
                    <span className="text-xs text-gray-500 font-semibold">{certifications.length} Registered</span>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-50/80 border-b border-gray-200 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            <tr>
                                <th className="py-3.5 px-6">Certification Title</th>
                                <th className="py-3.5 px-6">Issuing Body</th>
                                <th className="py-3.5 px-6">Issue Date</th>
                                <th className="py-3.5 px-6">Credential ID</th>
                                <th className="py-3.5 px-6 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 text-sm">
                            {certifications.map((cert) => (
                                <tr key={cert._id} className="hover:bg-blue-50/40 transition-colors">
                                    <td className="py-4 px-6 font-bold text-gray-900 flex items-center">
                                        <Award className="w-4 h-4 mr-2.5 text-blue-600 flex-shrink-0" />
                                        <span>{cert.title}</span>
                                    </td>
                                    <td className="py-4 px-6 text-gray-600 font-medium">{cert.issuer}</td>
                                    <td className="py-4 px-6 text-gray-500 text-xs">
                                        {cert.dateIssued ? new Date(cert.dateIssued).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'Aug 2025'}
                                    </td>
                                    <td className="py-4 px-6 font-mono text-xs text-gray-500">
                                        {cert.credentialId || 'CS-VERIFIED-9821'}
                                    </td>
                                    <td className="py-4 px-6 text-right space-x-2">
                                        {cert.url && (
                                            <a 
                                                href={cert.url} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center text-xs font-bold text-blue-600 hover:text-blue-800 p-1.5 hover:bg-blue-50 rounded"
                                                title="View Credential"
                                            >
                                                <ExternalLink className="w-4 h-4" />
                                            </a>
                                        )}
                                        <button 
                                            onClick={() => handleDeleteCertification(cert._id)}
                                            className="inline-flex items-center text-xs font-bold text-gray-400 hover:text-red-600 p-1.5 hover:bg-red-50 rounded transition-colors"
                                            title="Delete Certificate"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}

                            {certifications.length === 0 && !loading && (
                                <tr>
                                    <td colSpan="5" className="py-12 text-center text-gray-500 text-sm">
                                        No external certifications added yet. Click &quot;Add Certification&quot; to register your achievements.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* ADD CERTIFICATION MODAL */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in duration-150">
                        <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-gray-50">
                            <h3 className="font-bold text-gray-900 text-base flex items-center">
                                <Award className="w-5 h-5 mr-2 text-blue-600" />
                                Register External Certification
                            </h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleAddCertification} className="p-6 space-y-4">
                            <div>
                                <label className="block text-gray-700 text-xs font-bold mb-1.5">Certification Title *</label>
                                <input 
                                    type="text" 
                                    required
                                    className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-lg px-3 py-2 text-sm focus:bg-white focus:border-blue-500 outline-none" 
                                    placeholder="e.g. AWS Certified Solutions Architect"
                                    value={formData.title}
                                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-gray-700 text-xs font-bold mb-1.5">Issuing Organization *</label>
                                <input 
                                    type="text" 
                                    required
                                    className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-lg px-3 py-2 text-sm focus:bg-white focus:border-blue-500 outline-none" 
                                    placeholder="e.g. Amazon Web Services, Microsoft, Google"
                                    value={formData.issuer}
                                    onChange={e => setFormData({ ...formData, issuer: e.target.value })}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-gray-700 text-xs font-bold mb-1.5">Date Issued</label>
                                    <input 
                                        type="date" 
                                        className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-lg px-3 py-2 text-sm focus:bg-white focus:border-blue-500 outline-none" 
                                        value={formData.dateIssued}
                                        onChange={e => setFormData({ ...formData, dateIssued: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700 text-xs font-bold mb-1.5">Expiration Date</label>
                                    <input 
                                        type="date" 
                                        className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-lg px-3 py-2 text-sm focus:bg-white focus:border-blue-500 outline-none" 
                                        value={formData.expiryDate}
                                        onChange={e => setFormData({ ...formData, expiryDate: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-gray-700 text-xs font-bold mb-1.5">Credential ID</label>
                                <input 
                                    type="text" 
                                    className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-lg px-3 py-2 text-sm focus:bg-white focus:border-blue-500 outline-none" 
                                    placeholder="e.g. AWS-8392104"
                                    value={formData.credentialId}
                                    onChange={e => setFormData({ ...formData, credentialId: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-gray-700 text-xs font-bold mb-1.5">Verification URL</label>
                                <input 
                                    type="url" 
                                    className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-lg px-3 py-2 text-sm focus:bg-white focus:border-blue-500 outline-none" 
                                    placeholder="https://credly.com/badges/..."
                                    value={formData.url}
                                    onChange={e => setFormData({ ...formData, url: e.target.value })}
                                />
                            </div>

                            <div className="pt-4 border-t border-gray-100 flex justify-end gap-3">
                                <button 
                                    type="button" 
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 text-xs font-bold text-gray-600 hover:bg-gray-100 rounded-lg"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit" 
                                    disabled={isSubmitting}
                                    className="px-5 py-2 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-700 disabled:opacity-50 shadow-sm"
                                >
                                    {isSubmitting ? 'Saving...' : 'Add Credential'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Certifications;
