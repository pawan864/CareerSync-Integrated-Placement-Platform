import React, { useState } from 'react';
import { Settings as SettingsIcon, Shield, Bell, KeyRound, Check, X } from 'lucide-react';

const Settings = () => {
    const [passwordModal, setPasswordModal] = useState(false);
    const [passwords, setPasswords] = useState({ current: '', newPass: '', confirm: '' });
    const [notifications, setNotifications] = useState({
        apps: true,
        quizzes: true,
        events: false
    });
    const [message, setMessage] = useState('');

    const handlePasswordSubmit = (e) => {
        e.preventDefault();
        if (passwords.newPass !== passwords.confirm) {
            setMessage('New passwords do not match.');
            return;
        }
        setMessage('Password updated successfully!');
        setTimeout(() => {
            setMessage('');
            setPasswordModal(false);
            setPasswords({ current: '', newPass: '', confirm: '' });
        }, 1500);
    };

    return (
        <div className="max-w-4xl mx-auto pb-12">
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 tracking-tight flex items-center">
                    <SettingsIcon className="w-8 h-8 mr-3 text-blue-600" />
                    Account Settings & Security
                </h2>
                <p className="text-gray-600 text-sm mt-1">Manage platform credentials, authentication security, and alert preferences.</p>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 space-y-8">
                {/* Security Section */}
                <div className="border-b border-gray-100 pb-6">
                    <div className="flex items-center gap-2 mb-1">
                        <KeyRound className="w-5 h-5 text-blue-600" />
                        <h3 className="text-base font-bold text-gray-900">Security & Password Authentication</h3>
                    </div>
                    <p className="text-xs text-gray-500 mb-4">Manage access credentials and multi-factor verification settings.</p>
                    <button 
                        onClick={() => setPasswordModal(true)}
                        className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg font-bold text-xs hover:bg-gray-50 transition-colors shadow-sm"
                    >
                        Change Password
                    </button>
                </div>

                {/* Notifications Section */}
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <Bell className="w-5 h-5 text-blue-600" />
                        <h3 className="text-base font-bold text-gray-900">Notification Alerts & Email Preferences</h3>
                    </div>
                    <p className="text-xs text-gray-500 mb-4">Select what recruitment milestones and campus drive notifications reach your inbox.</p>
                    
                    <div className="space-y-3">
                        <label className="flex items-center cursor-pointer">
                            <input 
                                type="checkbox" 
                                checked={notifications.apps}
                                onChange={e => setNotifications({ ...notifications, apps: e.target.checked })}
                                className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-gray-300 mr-3" 
                            />
                            <span className="text-xs font-semibold text-gray-700">Application Status & Shortlist Alerts</span>
                        </label>

                        <label className="flex items-center cursor-pointer">
                            <input 
                                type="checkbox" 
                                checked={notifications.quizzes}
                                onChange={e => setNotifications({ ...notifications, quizzes: e.target.checked })}
                                className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-gray-300 mr-3" 
                            />
                            <span className="text-xs font-semibold text-gray-700">Assessment Badges & Skill Updates</span>
                        </label>

                        <label className="flex items-center cursor-pointer">
                            <input 
                                type="checkbox" 
                                checked={notifications.events}
                                onChange={e => setNotifications({ ...notifications, events: e.target.checked })}
                                className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-gray-300 mr-3" 
                            />
                            <span className="text-xs font-semibold text-gray-700">Campus Hackathon & Drive Invitations</span>
                        </label>
                    </div>
                </div>
            </div>

            {/* PASSWORD MODAL */}
            {passwordModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full overflow-hidden animate-in fade-in zoom-in duration-150">
                        <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-gray-50">
                            <h3 className="font-bold text-gray-900 text-sm">Update Password</h3>
                            <button onClick={() => setPasswordModal(false)} className="text-gray-400 hover:text-gray-600">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handlePasswordSubmit} className="p-6 space-y-3">
                            {message && (
                                <div className="p-2.5 bg-blue-50 text-blue-800 text-xs rounded-lg font-semibold text-center">
                                    {message}
                                </div>
                            )}

                            <div>
                                <label className="block text-gray-700 text-xs font-bold mb-1">Current Password</label>
                                <input 
                                    type="password" 
                                    required
                                    className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-xs outline-none focus:bg-white focus:border-blue-500" 
                                    value={passwords.current}
                                    onChange={e => setPasswords({ ...passwords, current: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-gray-700 text-xs font-bold mb-1">New Password</label>
                                <input 
                                    type="password" 
                                    required
                                    className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-xs outline-none focus:bg-white focus:border-blue-500" 
                                    value={passwords.newPass}
                                    onChange={e => setPasswords({ ...passwords, newPass: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-gray-700 text-xs font-bold mb-1">Confirm New Password</label>
                                <input 
                                    type="password" 
                                    required
                                    className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-xs outline-none focus:bg-white focus:border-blue-500" 
                                    value={passwords.confirm}
                                    onChange={e => setPasswords({ ...passwords, confirm: e.target.value })}
                                />
                            </div>

                            <div className="pt-3 border-t border-gray-100 flex justify-end gap-2">
                                <button type="button" onClick={() => setPasswordModal(false)} className="px-4 py-2 text-xs font-bold text-gray-600 hover:bg-gray-100 rounded-lg">
                                    Cancel
                                </button>
                                <button type="submit" className="px-5 py-2 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-700">
                                    Update Password
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Settings;
