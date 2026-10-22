/**
 * Universal Registration Portal (Register.jsx) supporting dynamic role-based forms (Student, Faculty, TPO, Recruiter).
 * 
 * Features:
 * - Responsive UI using Tailwind CSS
 * - Interactive Framer Motion animations
 * - Dynamic rendering based on role/portal selection
 * - Unified typography and interactive states
 */
import React, { useState, useContext, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Turnstile } from '@marsidev/react-turnstile';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';
import { useGoogleLogin } from '@react-oauth/google';

// Preload slider images for instant rendering
const preloadUrls = [
    "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=60&w=600&h=800&auto=format&fit=crop", 
    "https://images.unsplash.com/photo-1573164574572-cb89e39749b4?q=60&w=600&h=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1556761175-4b46a572b786?q=60&w=600&h=800&auto=format&fit=crop", 
    "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=60&w=600&h=800&auto=format&fit=crop"
];
preloadUrls.forEach(url => { const img = new Image(); img.src = url; });

// Cloudflare Turnstile SiteKey with automatic localhost fallback to prevent Error 110200
const TURNSTILE_SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY || 
    (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
        ? '1x00000000000000000000AA' 
        : '0x4AAAAAAFRwCYnHjksWpzIg');
import { GraduationCap, ArrowLeft, User, Building, Briefcase, BookOpen, Sun, Moon, X } from 'lucide-react';

const Register = () => {
    const location = useLocation();
    const formDataRef = useRef(null);
    const [formData, setFormData] = useState({
        name: '', email: '', password: '', role: location.state?.role || 'student',
        studentId: '', college: '', course: '', branch: '', semester: '', phone: '',
        facultyId: '', department: '', designation: '', expertise: '',
        companyName: '', corporateEmail: '', website: '', industryType: '', companySize: '', location: '', registrationInfo: '',
        tpoId: '', institutionCode: ''
    });
    const [error, setError] = useState('');
    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => setError(''), 5000);
            return () => clearTimeout(timer);
        }
    }, [error]);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [showPassword, setShowPassword] = useState(false);
    const [termsAccepted, setTermsAccepted] = useState(false);
    const [showTermsModal, setShowTermsModal] = useState(false);
    const [modalType, setModalType] = useState('terms');
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [turnstileToken, setTurnstileToken] = useState('');
    const { register, googleAuth } = useContext(AuthContext);
    const navigate = useNavigate();

    
    const handleGithubLogin = (roleStr) => {
        localStorage.setItem('oauth_role', roleStr || 'student');
        localStorage.setItem('oauth_is_register', 'true');
        const clientId = import.meta.env.VITE_GITHUB_CLIENT_ID || 'placeholder';
        const redirectUri = window.location.origin + '/github/callback';
        window.location.href = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=user:email`;
    };

    const handleGoogleLogin = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            try {
                const res = await googleAuth(tokenResponse.access_token, formDataRef.current.role, true);
                if (res.success) {
                    const r = res.user?.role || 'student';
                    if (r === 'student') navigate('/student-dashboard');
                    else if (r === 'recruiter') navigate('/employer');
                    else if (r === 'faculty') navigate('/faculty-dashboard');
                    else if (r === 'admin') navigate('/admin-dashboard');
                    else if (r === 'tpo') navigate('/institution');
                    else navigate('/profile');
                } else {
                    setError(res.error || 'Google authentication failed');
                }
            } catch (err) {
                setError(err.response?.data?.error || err.message || 'Google login failed. Please try again.');
            }
        },
        onError: () => {
            setError('Google login was cancelled or failed.');
        }
    });
    const [globalTheme] = useState(localStorage.getItem('globalTheme') || 'blue');

    const themeStyles = {
        blue: { bg: "from-white via-blue-200 to-blue-600", logoBg: "from-green-500/20 to-blue-600/20", logoBorder: "border-blue-200", logoText: "text-blue-800", cardBg: "bg-white", accentText: "text-blue-900", linkText: "text-blue-800", primaryBtn: "bg-blue-600 hover:bg-blue-700", iconColor: "text-blue-600", iconBg: "${themeStyles[globalTheme].iconBg}", labelColor: "text-blue-900", ringColor: "focus-within:ring-blue-600 focus:ring-blue-600" },
        indigo: { bg: "from-white via-indigo-200 to-indigo-600", logoBg: "from-purple-500/20 to-indigo-600/20", logoBorder: "border-indigo-200", logoText: "text-indigo-800", cardBg: "bg-white", accentText: "text-blue-900", linkText: "text-blue-800", primaryBtn: "bg-blue-600 hover:bg-blue-700", iconColor: "text-blue-600", iconBg: "${themeStyles[globalTheme].iconBg}", labelColor: "text-blue-900", ringColor: "focus-within:ring-blue-600 focus:ring-blue-600" },
        orange: { bg: "from-white via-orange-100 to-orange-200", darkBg: "from-stone-900 via-orange-950 to-stone-900", darkCardBg: "bg-[#1f1209]", logoBg: "from-amber-500/20 to-orange-600/20", logoBorder: "border-orange-200", logoText: "text-amber-900", cardBg: "bg-[#fdfbf5]", accentText: "text-amber-900", linkText: "text-amber-900", primaryBtn: "bg-amber-800 hover:bg-amber-900", iconColor: "text-amber-800", iconBg: "bg-orange-50", labelColor: "text-amber-900", ringColor: "focus-within:ring-orange-600 focus:ring-orange-600" }
    };


    useEffect(() => { formDataRef.current = formData; }, [formData]);
    const slides = [
        "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=60&w=600&h=800&auto=format&fit=crop", // Diverse students collaborating
        "https://images.unsplash.com/photo-1573164574572-cb89e39749b4?q=60&w=600&h=800&auto=format&fit=crop", // Professional Meeting / Placement
        "https://images.unsplash.com/photo-1556761175-4b46a572b786?q=60&w=600&h=800&auto=format&fit=crop", // Industry Workspace
        "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=60&w=600&h=800&auto=format&fit=crop"  // University Campus
    ];

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 3500); 
        return () => clearInterval(timer);
    }, [slides.length]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRoleChange = (role) => {
        setFormData({ ...formData, role });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        
        if (formData.password.length < 6) {
            return setError('Password must be at least 6 characters long.');
        }
        
        if (!termsAccepted) {
            return setError('You must accept the Terms and Conditions.');
        }

        if (!turnstileToken) {
            return setError('Please complete the security check.');
        }

        try {
            const success = await register({ ...formData, turnstileToken });
            if (success) {
                if (formData.role === 'student') navigate('/student-dashboard');
                else if (formData.role === 'faculty') navigate('/faculty-dashboard');
                else if (formData.role === 'tpo') navigate('/institution');
                else if (formData.role === 'recruiter') navigate('/employer');
                else navigate('/');
            } else {
                setError('Registration failed. Please check your details.');
            }
        } catch (err) {
            setError(err.response?.data?.error || 'An error occurred during registration.');
        }
    };

    return (
                <motion.div 
            initial={{ opacity: 0, scale: 0.96, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 w-full h-full overflow-hidden flex font-sans"
        >
            {/* Left Side - Dark Navy */}
            <div className="hidden lg:flex lg:w-1/2 bg-[#091024] flex-col justify-center px-16 relative overflow-hidden ">
                {/* Decorative dots / Slide Indicators */}
                <div className="absolute top-12 left-16 flex space-x-2">
                    {slides.map((_, index) => (
                        <div 
                            key={index} 
                            className={`h-2 rounded-full transition-all duration-500 ${
                                currentSlide === index ? 'w-8 bg-blue-500' : 'w-2 bg-gray-600'
                            }`}
                        ></div>
                    ))}
                </div>

                <div className="z-10 mt-10">
                    <h1 className="text-white text-5xl font-bold leading-tight mb-4">
                        Connecting Top Campus<br />To Industry Leaders
                    </h1>
                    <p className="text-gray-400 text-lg mb-12 max-w-lg">
                        Orchestrate every step of the hiring and placement process with our integrated enterprise AI tools.
                    </p>
                    
                    {/* Laptop / Image Slider */}
                    <div className="w-full max-w-lg h-64 bg-[#111827] rounded-t-xl border-4 border-gray-800 shadow-2xl relative overflow-hidden">
                        <div 
                            className="flex h-full w-full transition-transform duration-1000 ease-in-out"
                            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                        >
                            {slides.map((slide, index) => (
                                <img 
                                    key={index}
                                    src={slide}
                                    alt={`Slide ${index + 1}`}
                                    className="w-full h-full object-cover flex-shrink-0"
                                />
                            ))}
                        </div>
                    </div>
                    <div className="w-full max-w-lg h-3 bg-gray-400 rounded-b-xl shadow-2xl mb-12 relative flex justify-center items-center">
                        <div className="w-16 h-1 bg-gray-300 rounded-b-md absolute top-0"></div>
                    </div>

                    <p className="text-gray-400 italic text-sm max-w-lg leading-relaxed mt-4">
                        "Bridging the gap between academia and industry. Join thousands of students, esteemed institutions, and top-tier employers building the future of work together."
                    </p>
                </div>
            </div>

            {/* Right Side - Very Dark */}
            <div className={`w-full lg:w-1/2 flex flex-col relative px-8 sm:px-16 py-8 overflow-y-auto overflow-x-hidden slim-scrollbar ${isDarkMode ? 'bg-[#020617]' : themeStyles[globalTheme].cardBg}`}>
                
                <Link to="/" className={`flex items-center text-sm font-medium w-fit mb-8 lg:mb-0 lg:absolute lg:top-8 lg:left-8 ${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'}`}>
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back
                </Link>

                <button 
                    onClick={() => setIsDarkMode(!isDarkMode)} 
                    className={`absolute top-8 right-8 p-2 rounded-full transition-colors z-50 ${isDarkMode ? 'bg-gray-800 text-yellow-400 hover:bg-gray-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                >
                    {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                </button>

                <div className="flex-1 flex flex-col justify-center max-w-md w-full mx-auto mt-4 lg:mt-0">
                    
                    <div className="text-center mb-6">
                        <p className={`text-[10px] font-bold tracking-widest mb-2 uppercase ${isDarkMode ? 'text-gray-500' : 'text-gray-600'}`}>Select Portal</p>
                        <div className="flex justify-center space-x-2">
                            {[{id: 'student', label: 'Student', icon: User}, {id: 'faculty', label: 'Faculty', icon: BookOpen}, {id: 'tpo', label: 'TPO', icon: Building}, {id: 'recruiter', label: 'Recruiter', icon: Briefcase}].map((p) => (
                                <button 
                                    key={p.id}
                                    onClick={() => handleRoleChange(p.id)}
                                    className={`px-3 py-1 rounded-md text-xs transition-colors border cursor-pointer ${
                                        formData.role === p.id 
                                            ? isDarkMode ? 'bg-[#1e293b] border-blue-500 text-white' : '${themeStyles[globalTheme].iconBg} border-blue-500 text-blue-700' 
                                            : isDarkMode ? 'border-gray-800 text-gray-400 hover:border-gray-600' : 'border-gray-200 text-gray-600 hover:border-gray-400 hover:bg-gray-50'
                                    }`}
                                >
                                    <div className="flex items-center space-x-1.5">
                                        <p.icon className="w-3.5 h-3.5" />
                                        <span>{p.label}</span>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex items-center text-blue-500 mb-4">
                        <GraduationCap className="h-6 w-6 mr-2" />
                        <span className={`font-bold text-xl tracking-tight ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            Career<span className="text-blue-500">Sync</span>
                        </span>
                    </div>

                    <p className={`block text-xs font-medium mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-700'}`}>Join CareerSync</p>
                    <h2 className={`${isDarkMode ? 'text-white' : 'text-gray-900'} text-2xl font-bold mb-6`}>Create your account.</h2>

                    <div className="relative w-full pb-4">
                        <AnimatePresence>
                            <motion.form
                                key={formData.role}
                                initial={{ x: '100%', opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                exit={{ x: '-100%', opacity: 0 }}
                                transition={{ type: "tween", ease: "easeInOut", duration: 0.35 }}
                                onSubmit={handleSubmit} 
                                className="space-y-4"
                            >
                        {error && (
                            <div className={`w-fit mx-auto px-3 py-1.5 rounded-md text-[11px] text-center font-medium border ${isDarkMode ? 'bg-red-950/50 border-red-500/50 text-red-200' : 'bg-red-50 border-red-200 text-red-600'}`}>
                                {error}
                            </div>
                        )}

                        {formData.role !== 'recruiter' && formData.role !== 'tpo' && (
                            <>
                                <div>
                                    <label className={`block text-xs font-medium mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-700'}`}>Full Name</label>
                                    <input type="text" name="name" placeholder="Enter your full name" required className={`w-full px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 ${themeStyles[globalTheme].ringColor} transition-colors text-sm placeholder-gray-400 ${isDarkMode ? 'bg-[#1e293b] text-gray-100 border-transparent focus:bg-[#0f172a] autofill-dark' : 'bg-white text-gray-900 border border-gray-300 focus:border-transparent focus:bg-white autofill-light'}`} value={formData.name} onChange={handleChange} />
                                </div>
                                <div>
                                    <label className={`block text-xs font-medium mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-700'}`}>Email Address</label>
                                    <input type="email" name="email" placeholder="Enter your email address" required className={`w-full px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 ${themeStyles[globalTheme].ringColor} transition-colors text-sm placeholder-gray-400 ${isDarkMode ? 'bg-[#1e293b] text-gray-100 border-transparent focus:bg-[#0f172a] autofill-dark' : 'bg-white text-gray-900 border border-gray-300 focus:border-transparent focus:bg-white autofill-light'}`} value={formData.email} onChange={handleChange} />
                                </div>
                            </>
                        )}

                        {formData.role === 'student' && (
                            <div>
                                <label className={`block text-xs font-medium mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-700'}`}>Enrollment/Student ID</label>
                                <input type="text" name="studentId" placeholder="Enter Student ID or Roll No." required className={`w-full px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 ${themeStyles[globalTheme].ringColor} transition-colors text-sm placeholder-gray-400 ${isDarkMode ? 'bg-[#1e293b] text-gray-100 border-transparent focus:bg-[#0f172a] autofill-dark' : 'bg-white text-gray-900 border border-gray-300 focus:border-transparent focus:bg-white autofill-light'}`} value={formData.studentId} onChange={handleChange} />
                            </div>
                        )}

                        {formData.role === 'faculty' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className={`block text-xs font-medium mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-700'}`}>Faculty ID</label>
                                    <input type="text" name="facultyId" placeholder="Enter Faculty ID" required className={`w-full px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 ${themeStyles[globalTheme].ringColor} transition-colors text-sm placeholder-gray-400 ${isDarkMode ? 'bg-[#1e293b] text-gray-100 border-transparent focus:bg-[#0f172a] autofill-dark' : 'bg-white text-gray-900 border border-gray-300 focus:border-transparent focus:bg-white autofill-light'}`} value={formData.facultyId} onChange={handleChange} />
                                </div>
                                <div>
                                    <label className={`block text-xs font-medium mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-700'}`}>Institution</label>
                                    <input type="text" name="college" placeholder="Enter college name" required className={`w-full px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 ${themeStyles[globalTheme].ringColor} transition-colors text-sm placeholder-gray-400 ${isDarkMode ? 'bg-[#1e293b] text-gray-100 border-transparent focus:bg-[#0f172a] autofill-dark' : 'bg-white text-gray-900 border border-gray-300 focus:border-transparent focus:bg-white autofill-light'}`} value={formData.college} onChange={handleChange} />
                                </div>
                                <div>
                                    <label className={`block text-xs font-medium mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-700'}`}>Department</label>
                                    <input type="text" name="department" placeholder="Department name" required className={`w-full px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 ${themeStyles[globalTheme].ringColor} transition-colors text-sm placeholder-gray-400 ${isDarkMode ? 'bg-[#1e293b] text-gray-100 border-transparent focus:bg-[#0f172a] autofill-dark' : 'bg-white text-gray-900 border border-gray-300 focus:border-transparent focus:bg-white autofill-light'}`} value={formData.department} onChange={handleChange} />
                                </div>
                                <div>
                                    <label className={`block text-xs font-medium mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-700'}`}>Designation</label>
                                    <input type="text" name="designation" placeholder="Assistant Professor, HOD, etc." required className={`w-full px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 ${themeStyles[globalTheme].ringColor} transition-colors text-sm placeholder-gray-400 ${isDarkMode ? 'bg-[#1e293b] text-gray-100 border-transparent focus:bg-[#0f172a] autofill-dark' : 'bg-white text-gray-900 border border-gray-300 focus:border-transparent focus:bg-white autofill-light'}`} value={formData.designation} onChange={handleChange} />
                                </div>
                                <div>
                                    <label className={`block text-xs font-medium mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-700'}`}>Areas of Expertise</label>
                                    <input type="text" name="expertise" placeholder="Your core subjects or research areas" required className={`w-full px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 ${themeStyles[globalTheme].ringColor} transition-colors text-sm placeholder-gray-400 ${isDarkMode ? 'bg-[#1e293b] text-gray-100 border-transparent focus:bg-[#0f172a] autofill-dark' : 'bg-white text-gray-900 border border-gray-300 focus:border-transparent focus:bg-white autofill-light'}`} value={formData.expertise} onChange={handleChange} />
                                </div>
                                <div>
                                    <label className={`block text-xs font-medium mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-700'}`}>Phone Number</label>
                                    <input type="text" name="phone" placeholder="Enter 10-digit mobile number" required className={`w-full px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 ${themeStyles[globalTheme].ringColor} transition-colors text-sm placeholder-gray-400 ${isDarkMode ? 'bg-[#1e293b] text-gray-100 border-transparent focus:bg-[#0f172a] autofill-dark' : 'bg-white text-gray-900 border border-gray-300 focus:border-transparent focus:bg-white autofill-light'}`} value={formData.phone} onChange={handleChange} />
                                </div>
                            </div>
                        )}

                        {formData.role === 'tpo' && (
                            <div className="space-y-6">
                                <div>
                                    <h3 className={`text-sm font-semibold mb-3 border-b pb-1 ${isDarkMode ? 'text-gray-200 border-gray-700' : 'text-gray-800 border-gray-200'}`}>TPO Details</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className={`block text-xs font-medium mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-700'}`}>TPO Name</label>
                                            <input type="text" name="name" placeholder="Enter your full name" required className={`w-full px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 ${themeStyles[globalTheme].ringColor} transition-colors text-sm placeholder-gray-400 ${isDarkMode ? 'bg-[#1e293b] text-gray-100 border-transparent focus:bg-[#0f172a] autofill-dark' : 'bg-white text-gray-900 border border-gray-300 focus:border-transparent focus:bg-white autofill-light'}`} value={formData.name} onChange={handleChange} />
                                        </div>
                                        <div>
                                            <label className={`block text-xs font-medium mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-700'}`}>TPO ID</label>
                                            <input type="text" name="tpoId" placeholder="Enter your TPO ID" required className={`w-full px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 ${themeStyles[globalTheme].ringColor} transition-colors text-sm placeholder-gray-400 ${isDarkMode ? 'bg-[#1e293b] text-gray-100 border-transparent focus:bg-[#0f172a] autofill-dark' : 'bg-white text-gray-900 border border-gray-300 focus:border-transparent focus:bg-white autofill-light'}`} value={formData.tpoId} onChange={handleChange} />
                                        </div>
                                        <div>
                                            <label className={`block text-xs font-medium mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-700'}`}>Official Email</label>
                                            <input type="email" name="email" placeholder="Enter your email address" required className={`w-full px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 ${themeStyles[globalTheme].ringColor} transition-colors text-sm placeholder-gray-400 ${isDarkMode ? 'bg-[#1e293b] text-gray-100 border-transparent focus:bg-[#0f172a] autofill-dark' : 'bg-white text-gray-900 border border-gray-300 focus:border-transparent focus:bg-white autofill-light'}`} value={formData.email} onChange={handleChange} />
                                        </div>
                                        <div>
                                            <label className={`block text-xs font-medium mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-700'}`}>Designation</label>
                                            <input type="text" name="designation" placeholder="Assistant Professor, HOD, etc." required className={`w-full px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 ${themeStyles[globalTheme].ringColor} transition-colors text-sm placeholder-gray-400 ${isDarkMode ? 'bg-[#1e293b] text-gray-100 border-transparent focus:bg-[#0f172a] autofill-dark' : 'bg-white text-gray-900 border border-gray-300 focus:border-transparent focus:bg-white autofill-light'}`} value={formData.designation} onChange={handleChange} />
                                        </div>
                                        <div>
                                            <label className={`block text-xs font-medium mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-700'}`}>Phone Number</label>
                                            <input type="text" name="phone" placeholder="Enter 10-digit mobile number" required className={`w-full px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 ${themeStyles[globalTheme].ringColor} transition-colors text-sm placeholder-gray-400 ${isDarkMode ? 'bg-[#1e293b] text-gray-100 border-transparent focus:bg-[#0f172a] autofill-dark' : 'bg-white text-gray-900 border border-gray-300 focus:border-transparent focus:bg-white autofill-light'}`} value={formData.phone} onChange={handleChange} />
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <h3 className={`text-sm font-semibold mb-3 border-b pb-1 ${isDarkMode ? 'text-gray-200 border-gray-700' : 'text-gray-800 border-gray-200'}`}>Institution Details</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className={`block text-xs font-medium mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-700'}`}>Institution Name</label>
                                            <input type="text" name="college" placeholder="Enter college name" required className={`w-full px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 ${themeStyles[globalTheme].ringColor} transition-colors text-sm placeholder-gray-400 ${isDarkMode ? 'bg-[#1e293b] text-gray-100 border-transparent focus:bg-[#0f172a] autofill-dark' : 'bg-white text-gray-900 border border-gray-300 focus:border-transparent focus:bg-white autofill-light'}`} value={formData.college} onChange={handleChange} />
                                        </div>
                                        <div>
                                            <label className={`block text-xs font-medium mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-700'}`}>Institution Code</label>
                                            <input type="text" name="institutionCode" placeholder="Enter assigned Institution Code" required className={`w-full px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 ${themeStyles[globalTheme].ringColor} transition-colors text-sm placeholder-gray-400 ${isDarkMode ? 'bg-[#1e293b] text-gray-100 border-transparent focus:bg-[#0f172a] autofill-dark' : 'bg-white text-gray-900 border border-gray-300 focus:border-transparent focus:bg-white autofill-light'}`} value={formData.institutionCode} onChange={handleChange} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {formData.role === 'recruiter' && (
                            <div className="space-y-6">
                                <div>
                                    <h3 className={`text-sm font-semibold mb-3 border-b pb-1 ${isDarkMode ? 'text-gray-200 border-gray-700' : 'text-gray-800 border-gray-200'}`}>Company Details</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className={`block text-xs font-medium mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-700'}`}>Company Name</label>
                                            <input type="text" name="companyName" placeholder="Enter company name" required className={`w-full px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 ${themeStyles[globalTheme].ringColor} transition-colors text-sm placeholder-gray-400 ${isDarkMode ? 'bg-[#1e293b] text-gray-100 border-transparent focus:bg-[#0f172a] autofill-dark' : 'bg-white text-gray-900 border border-gray-300 focus:border-transparent focus:bg-white autofill-light'}`} value={formData.companyName} onChange={handleChange} />
                                        </div>
                                        <div>
                                            <label className={`block text-xs font-medium mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-700'}`}>Corporate Email</label>
                                            <input type="email" name="corporateEmail" placeholder="Enter corporate email" required className={`w-full px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 ${themeStyles[globalTheme].ringColor} transition-colors text-sm placeholder-gray-400 ${isDarkMode ? 'bg-[#1e293b] text-gray-100 border-transparent focus:bg-[#0f172a] autofill-dark' : 'bg-white text-gray-900 border border-gray-300 focus:border-transparent focus:bg-white autofill-light'}`} value={formData.corporateEmail} onChange={handleChange} />
                                        </div>
                                        <div>
                                            <label className={`block text-xs font-medium mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-700'}`}>Website</label>
                                            <input type="url" name="website" placeholder="Enter company website URL" required className={`w-full px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 ${themeStyles[globalTheme].ringColor} transition-colors text-sm placeholder-gray-400 ${isDarkMode ? 'bg-[#1e293b] text-gray-100 border-transparent focus:bg-[#0f172a] autofill-dark' : 'bg-white text-gray-900 border border-gray-300 focus:border-transparent focus:bg-white autofill-light'}`} value={formData.website} onChange={handleChange} />
                                        </div>
                                        <div>
                                            <label className={`block text-xs font-medium mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-700'}`}>Industry Type</label>
                                            <input type="text" name="industryType" placeholder="IT, Finance, Healthcare, etc." required className={`w-full px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 ${themeStyles[globalTheme].ringColor} transition-colors text-sm placeholder-gray-400 ${isDarkMode ? 'bg-[#1e293b] text-gray-100 border-transparent focus:bg-[#0f172a] autofill-dark' : 'bg-white text-gray-900 border border-gray-300 focus:border-transparent focus:bg-white autofill-light'}`} value={formData.industryType} onChange={handleChange} />
                                        </div>
                                        <div>
                                            <label className={`block text-xs font-medium mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-700'}`}>Company Size</label>
                                            <input type="text" name="companySize" placeholder="Number of employees (e.g., 50-200)" required className={`w-full px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 ${themeStyles[globalTheme].ringColor} transition-colors text-sm placeholder-gray-400 ${isDarkMode ? 'bg-[#1e293b] text-gray-100 border-transparent focus:bg-[#0f172a] autofill-dark' : 'bg-white text-gray-900 border border-gray-300 focus:border-transparent focus:bg-white autofill-light'}`} value={formData.companySize} onChange={handleChange} />
                                        </div>
                                        <div>
                                            <label className={`block text-xs font-medium mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-700'}`}>Company Location</label>
                                            <input type="text" name="location" placeholder="Headquarters or branch location" required className={`w-full px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 ${themeStyles[globalTheme].ringColor} transition-colors text-sm placeholder-gray-400 ${isDarkMode ? 'bg-[#1e293b] text-gray-100 border-transparent focus:bg-[#0f172a] autofill-dark' : 'bg-white text-gray-900 border border-gray-300 focus:border-transparent focus:bg-white autofill-light'}`} value={formData.location} onChange={handleChange} />
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className={`block text-xs font-medium mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-700'}`}>Company Registration/Verification Information</label>
                                            <input type="text" name="registrationInfo" placeholder="CIN or Company Registration Number" required className={`w-full px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 ${themeStyles[globalTheme].ringColor} transition-colors text-sm placeholder-gray-400 ${isDarkMode ? 'bg-[#1e293b] text-gray-100 border-transparent focus:bg-[#0f172a] autofill-dark' : 'bg-white text-gray-900 border border-gray-300 focus:border-transparent focus:bg-white autofill-light'}`} value={formData.registrationInfo} onChange={handleChange} />
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <h3 className={`text-sm font-semibold mb-3 border-b pb-1 ${isDarkMode ? 'text-gray-200 border-gray-700' : 'text-gray-800 border-gray-200'}`}>Recruiter Details</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className={`block text-xs font-medium mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-700'}`}>Recruiter Name</label>
                                            <input type="text" name="name" placeholder="Enter your full name" required className={`w-full px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 ${themeStyles[globalTheme].ringColor} transition-colors text-sm placeholder-gray-400 ${isDarkMode ? 'bg-[#1e293b] text-gray-100 border-transparent focus:bg-[#0f172a] autofill-dark' : 'bg-white text-gray-900 border border-gray-300 focus:border-transparent focus:bg-white autofill-light'}`} value={formData.name} onChange={handleChange} />
                                        </div>
                                        <div>
                                            <label className={`block text-xs font-medium mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-700'}`}>Designation</label>
                                            <input type="text" name="designation" placeholder="Assistant Professor, HOD, etc." required className={`w-full px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 ${themeStyles[globalTheme].ringColor} transition-colors text-sm placeholder-gray-400 ${isDarkMode ? 'bg-[#1e293b] text-gray-100 border-transparent focus:bg-[#0f172a] autofill-dark' : 'bg-white text-gray-900 border border-gray-300 focus:border-transparent focus:bg-white autofill-light'}`} value={formData.designation} onChange={handleChange} />
                                        </div>
                                        <div>
                                            <label className={`block text-xs font-medium mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-700'}`}>Corporate Email</label>
                                            <input type="email" name="email" placeholder="Enter your email address" required className={`w-full px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 ${themeStyles[globalTheme].ringColor} transition-colors text-sm placeholder-gray-400 ${isDarkMode ? 'bg-[#1e293b] text-gray-100 border-transparent focus:bg-[#0f172a] autofill-dark' : 'bg-white text-gray-900 border border-gray-300 focus:border-transparent focus:bg-white autofill-light'}`} value={formData.email} onChange={handleChange} />
                                        </div>
                                        <div>
                                            <label className={`block text-xs font-medium mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-700'}`}>Phone Number</label>
                                            <input type="text" name="phone" placeholder="Enter 10-digit mobile number" required className={`w-full px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 ${themeStyles[globalTheme].ringColor} transition-colors text-sm placeholder-gray-400 ${isDarkMode ? 'bg-[#1e293b] text-gray-100 border-transparent focus:bg-[#0f172a] autofill-dark' : 'bg-white text-gray-900 border border-gray-300 focus:border-transparent focus:bg-white autofill-light'}`} value={formData.phone} onChange={handleChange} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div>
                            <label className={`block text-xs font-medium mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-700'}`}>Password</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password" placeholder="Enter your password"
                                    required
                                    className={`w-full px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 ${themeStyles[globalTheme].ringColor} transition-colors text-sm placeholder-gray-400 pr-10 ${isDarkMode ? 'bg-[#1e293b] text-gray-100 border-transparent focus:bg-[#0f172a] autofill-dark' : 'bg-white text-gray-900 border border-gray-300 focus:border-transparent focus:bg-white autofill-light'}`}
                                    value={formData.password}
                                    onChange={handleChange}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 focus:outline-none"
                                >
                                    {showPassword ? (
                                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                        </svg>
                                    ) : (
                                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.543 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>

                        <div className="flex items-start mt-2 mb-4">
                            <div className="flex items-center h-4 pt-0.5">
                                <input
                                    id="terms"
                                    type="checkbox"
                                    checked={termsAccepted}
                                    onChange={(e) => setTermsAccepted(e.target.checked)}
                                    className={`h-3.5 w-3.5 ${themeStyles[globalTheme].iconColor} ${themeStyles[globalTheme].ringColor} border-gray-300 rounded cursor-pointer`}
                                    required
                                />
                            </div>
                            <label htmlFor="terms" className={`ml-2 text-xs font-medium leading-tight ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                I agree with the <button type="button" onClick={() => { setModalType('terms'); setShowTermsModal(true); }} className="text-blue-500 hover:underline cursor-pointer">Terms and Conditions</button> and <button type="button" onClick={() => { setModalType('privacy'); setShowTermsModal(true); }} className="text-blue-500 hover:underline cursor-pointer">Privacy Policy</button>.
                            </label>
                        </div>

                        <div className="mt-4 flex justify-center w-full"><Turnstile siteKey={TURNSTILE_SITE_KEY} onSuccess={(token) => setTurnstileToken(token)} /></div>
                                            <button type="submit" disabled={!termsAccepted}
                            className={`w-full flex items-center justify-center font-semibold py-2.5 rounded-lg transition-all duration-300 text-xs shadow-md ${termsAccepted ? `${themeStyles[globalTheme].primaryBtn} text-white shadow-blue-500/30 cursor-pointer` : 'bg-gray-400 text-gray-200 cursor-not-allowed'}`}
                        >
                            Create Account
                        </button>
                            </motion.form>
                        </AnimatePresence>
                    </div>

                    <div className="mt-6 text-center">
                        <div className="text-gray-500 text-xs mb-4 relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className={`w-full border-t ${isDarkMode ? 'border-gray-800' : 'border-gray-200'}`}></div>
                            </div>
                            <span className={`relative px-4 font-medium ${isDarkMode ? 'bg-[#020617]' : themeStyles[globalTheme].cardBg}`}>OR</span>
                        </div>
                        
                        <p className="text-gray-400 text-xs mb-3">Sign Up With</p>
                        
                        <div className="flex space-x-3">
                            <button type="button" onClick={() => handleGithubLogin(formData.role)} className={`flex-1 flex items-center justify-center border py-2.5 rounded-lg transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-sm cursor-pointer ${isDarkMode ? 'bg-transparent border-gray-800 hover:bg-[#2a2a32] text-gray-300' : 'bg-white border-gray-200 hover:bg-gray-50 text-gray-700'}`}>
                                <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M12 0C5.37 0 0 5.37 0 12C0 17.3 3.438 21.8 8.205 23.385C8.805 23.495 9.025 23.125 9.025 22.82C9.025 22.54 9.015 21.58 9.01 20.485C5.67 21.21 4.965 19.04 4.965 19.04C4.42 17.655 3.635 17.28 3.635 17.28C2.55 16.535 3.715 16.55 3.715 16.55C4.915 16.635 5.545 17.785 5.545 17.785C6.61 19.61 8.335 19.085 9.055 18.78C9.165 17.96 9.495 17.435 9.86 17.135C7.195 16.835 4.395 15.805 4.395 11.225C4.395 9.92 4.86 8.85 5.615 8.01C5.495 7.705 5.085 6.495 5.735 4.85C5.735 4.85 6.73 4.53 9.025 6.085C9.975 5.82 10.99 5.69 12 5.685C13.01 5.69 14.025 5.82 14.975 6.085C17.27 4.53 18.265 4.85 18.265 4.85C18.915 6.495 18.505 7.705 18.385 8.01C19.14 8.85 19.6 9.92 19.6 11.225C19.6 15.82 16.795 16.83 14.12 17.125C14.58 17.525 15 18.31 15 19.535C15 21.285 14.985 22.695 14.985 22.82C14.985 23.13 15.205 23.505 15.815 23.385C20.565 21.795 24 17.3 24 12C24 5.37 18.63 0 12 0Z"/></svg>
                                <span className="text-xs font-semibold">GITHUB</span>
                            </button>
                            <button type="button" onClick={() => handleGoogleLogin()} className={`flex-1 flex items-center justify-center border py-2.5 rounded-lg transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-sm cursor-pointer ${isDarkMode ? 'bg-transparent border-gray-800 hover:bg-[#2a2a32] text-gray-300' : 'bg-white border-gray-200 hover:bg-gray-50 text-gray-700'}`}>
                                <svg className="w-3.5 h-3.5 mr-2" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                                <span className="text-xs font-semibold">GOOGLE</span>
                            </button>
                        </div>
                        
                        <div className={`mt-6 border-t pt-4 ${isDarkMode ? 'border-gray-800' : 'border-gray-200'}`}>
                            <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                Already have an account?{' '}
                                <Link to="/login" className="text-blue-500 hover:underline font-semibold transition-all">
                                    Sign in
                                </Link>
                            </p>
                            
                            <p className={`text-xs mt-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                Need assistance?{' '}
                                <Link to="/support" className="text-blue-500 hover:underline font-semibold transition-all">
                                    Contact Technical Support
                                </Link>
                            </p>


                        </div>
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {showTermsModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 10 }}
                            className={`w-full max-w-2xl rounded-lg shadow-2xl overflow-hidden flex flex-col max-h-[85vh] ${isDarkMode ? 'bg-[#0f172a] border border-gray-800' : 'bg-white border border-gray-200'}`}
                        >
                            <div className={`flex justify-between items-center p-4 border-b ${isDarkMode ? 'border-gray-800' : 'border-gray-200'}`}>
                                <h3 className={`text-xl font-semibold tracking-tight ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                    {modalType === 'terms' ? 'Terms and Conditions' : 'Privacy Policy'}
                                </h3>
                                <button onClick={() => setShowTermsModal(false)} className={`p-1.5 rounded-full transition-colors ${isDarkMode ? 'hover:bg-gray-800 text-gray-400' : 'hover:bg-gray-100 text-gray-500'}`}>
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            
                            <div className="p-6 overflow-y-auto slim-scrollbar">
                                {modalType === 'terms' ? (
                                    <div className="space-y-5 text-[13px] leading-relaxed">
                                        <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} text-sm`}>
                                            Last updated: October 2026. Please read these Terms of Service completely using CareerSync.com which is owned and operated by CareerSync, Inc.
                                        </p>
                                        
                                        <div>
                                            <h4 className={`text-sm font-semibold mb-1 ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>1. Acceptance of Terms</h4>
                                            <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                                By accessing or using our platform, you agree to be bound by these Terms. If you disagree with any part of the terms, then you may not access the service. These Terms apply to all visitors, users, and others who access or use the Service.
                                            </p>
                                        </div>

                                        <div>
                                            <h4 className={`text-sm font-semibold mb-1 ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>2. User Registration and Security</h4>
                                            <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                                When you create an account with us, you must provide information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our Service. You are responsible for safeguarding the password that you use to access the Service and for any activities or actions under your password.
                                            </p>
                                        </div>

                                        <div>
                                            <h4 className={`text-sm font-semibold mb-1 ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>3. Intellectual Property Rights</h4>
                                            <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                                The Service and its original content, features, and functionality are and will remain the exclusive property of CareerSync and its licensors. The Service is protected by copyright, trademark, and other laws of both the United States and foreign countries. Our trademarks and trade dress may not be used in connection with any product or service without the prior written consent of CareerSync.
                                            </p>
                                        </div>

                                        <div>
                                            <h4 className={`text-sm font-semibold mb-1 ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>4. Limitation of Liability</h4>
                                            <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                                In no event shall CareerSync, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-5 text-[13px] leading-relaxed">
                                        <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} text-sm`}>
                                            Last updated: October 2026. CareerSync ("us", "we", or "our") operates the CareerSync.com website.
                                        </p>
                                        
                                        <div>
                                            <h4 className={`text-sm font-semibold mb-1 ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>1. Information Collection And Use</h4>
                                            <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                                We collect several different types of information for various purposes to provide and improve our Service to you. Types of Data collected include Personally Identifiable Information (email address, first name and last name, phone number) and Usage Data (how the Service is accessed and used).
                                            </p>
                                        </div>

                                        <div>
                                            <h4 className={`text-sm font-semibold mb-1 ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>2. Use of Data</h4>
                                            <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                                CareerSync uses the collected data for various purposes: to provide and maintain our Service, to notify you about changes to our Service, to allow you to participate in interactive features when you choose to do so, to provide customer support, and to monitor the usage of the Service.
                                            </p>
                                        </div>

                                        <div>
                                            <h4 className={`text-sm font-semibold mb-1 ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>3. Transfer of Data</h4>
                                            <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                                Your information, including Personal Data, may be transferred to and maintained on computers located outside of your state, province, country, or other governmental jurisdiction where the data protection laws may differ than those from your jurisdiction. We will take all steps reasonably necessary to ensure that your data is treated securely.
                                            </p>
                                        </div>

                                        <div>
                                            <h4 className={`text-sm font-semibold mb-1 ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>4. Security of Data</h4>
                                            <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                                The security of your data is important to us, but remember that no method of transmission over the Internet, or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your Personal Data, we cannot guarantee its absolute security.
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                            
                            <div className={`p-4 border-t flex justify-end ${isDarkMode ? 'border-gray-800 bg-[#020617]' : 'border-gray-200 bg-gray-50'}`}>
                                <button onClick={() => setShowTermsModal(false)} className={`px-6 py-2 text-sm font-semibold rounded-md transition-colors ${isDarkMode ? 'bg-gray-800 text-gray-200 hover:bg-gray-700' : 'bg-gray-900 text-white hover:bg-gray-800'}`}>
                                    I Understand
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default Register;
