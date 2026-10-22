/**
 * Unified Login System (Login.jsx) handling Student, Faculty, TPO, Recruiter, and Admin authentication.
 * 
 * Features:
 * - Responsive UI using Tailwind CSS
 * - Interactive Framer Motion animations
 * - Dynamic rendering based on role/portal selection
 * - Unified typography and interactive states
 */
import React, { useState, useContext, useEffect, useRef } from 'react';

// Preload the heavy background image so it doesn't flash on initial render
const preloadImage = new Image();
preloadImage.src = "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=60&w=1280&auto=format&fit=crop";
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Turnstile } from '@marsidev/react-turnstile';
import { AuthContext } from '../context/AuthContext';
import { useGoogleLogin } from '@react-oauth/google';

// Preload slider images for instant rendering
const preloadUrls = [
    "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=60&w=600&h=800&auto=format&fit=crop", 
    "https://images.unsplash.com/photo-1573164574572-cb89e39749b4?q=60&w=600&h=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1556761175-4b46a572b786?q=60&w=600&h=800&auto=format&fit=crop", 
    "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=60&w=600&h=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=60&w=400&auto=format&fit=crop", 
    "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=60&w=400&auto=format&fit=crop", 
    "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?q=60&w=400&auto=format&fit=crop", 
    "https://images.unsplash.com/photo-1543269865-cbf427effbad?q=60&w=400&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1577896851231-70ef18881754?q=60&w=400&auto=format&fit=crop", 
    "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=60&w=400&auto=format&fit=crop", 
    "https://images.unsplash.com/photo-1544717305-2782549b5136?q=60&w=400&auto=format&fit=crop", 
    "https://images.unsplash.com/photo-1552664730-d307ca884978?q=60&w=400&auto=format&fit=crop"
];
preloadUrls.forEach(url => { const img = new Image(); img.src = url; });

// Cloudflare Turnstile SiteKey with automatic localhost fallback to prevent Error 110200
const TURNSTILE_SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY || 
    (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
        ? '1x00000000000000000000AA' 
        : '0x4AAAAAAFRwCYnHjksWpzIg');
import api from '../services/api';
import { 
    ArrowLeft, Loader2, Home, MessageSquare, Send, CheckCircle2, ArrowRight, Mail, Eye, EyeOff, X, 
    Users, Search, BarChart2, Handshake, 
    Building, Lock, ShieldCheck, UserPlus, GraduationCap
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Login = () => {
    const location = useLocation();
    const [globalTheme] = useState(localStorage.getItem('globalTheme') || 'blue');

    const themeStyles = {
        blue: { bg: "from-white via-blue-200 to-blue-600", logoBg: "from-green-500/20 to-blue-600/20", logoBorder: "border-blue-200", logoText: "text-blue-800", cardBg: "bg-white", accentText: "text-blue-900", linkText: "text-blue-800", primaryBtn: "bg-blue-600 hover:bg-blue-700", iconColor: "text-blue-600", iconBg: "${themeStyles[globalTheme].iconBg}", labelColor: "text-blue-900", ringColor: "focus-within:ring-blue-600 focus:ring-blue-600" },
        indigo: { bg: "from-white via-indigo-200 to-indigo-600", logoBg: "from-purple-500/20 to-indigo-600/20", logoBorder: "border-indigo-200", logoText: "text-indigo-800", cardBg: "bg-white", accentText: "text-blue-900", linkText: "text-blue-800", primaryBtn: "bg-blue-600 hover:bg-blue-700", iconColor: "text-blue-600", iconBg: "${themeStyles[globalTheme].iconBg}", labelColor: "text-blue-900", ringColor: "focus-within:ring-blue-600 focus:ring-blue-600" },
        orange: { bg: "from-white via-orange-100 to-orange-200", logoBg: "from-amber-500/20 to-orange-600/20", logoBorder: "border-orange-200", logoText: "text-amber-900", cardBg: "bg-[#fdfbf5]", accentText: "text-amber-900", linkText: "text-amber-900", primaryBtn: "bg-amber-800 hover:bg-amber-900", iconColor: "text-amber-800", iconBg: "bg-orange-50", labelColor: "text-amber-900", ringColor: "focus-within:ring-orange-600 focus:ring-orange-600" }
    };


    const [portal, setPortal] = useState(location.state?.portal || 'Student');
    const portalRef = useRef(portal);
    useEffect(() => { portalRef.current = portal; }, [portal]);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [institutionCode, setInstitutionCode] = useState('');
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const [turnstileToken, setTurnstileToken] = useState('');
    const [currentSlide, setCurrentSlide] = useState(0);
    const [showPassword, setShowPassword] = useState(false);
    const [otpSent, setOtpSent] = useState(false);
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [devOtp, setDevOtp] = useState('');
    const [isVerifying, setIsVerifying] = useState(false);
    const [loginSuccess, setLoginSuccess] = useState(false);
    const [timeLeft, setTimeLeft] = useState(60);
    const [userId, setUserId] = useState(null);
    const [showSupport, setShowSupport] = useState(location.state?.openSupport || false);
    
    useEffect(() => {
        if (location.state?.openSupport) {
            setShowSupport(true);
        }
    }, [location.state]);
    
    useEffect(() => {
        if (location.state?.error) {
            setError(location.state.error);
            window.history.replaceState({}, document.title);
        }
    }, [location]);
    
    const [supportStatus, setSupportStatus] = useState('idle');
    const [supportData, setSupportData] = useState({ name: '', email: '', role: 'student', category: 'login', description: '' });

    const handleSupportChange = (e) => {
        setSupportData({ ...supportData, [e.target.name]: e.target.value });
    };

    const handleSupportSubmit = (e) => {
        e.preventDefault();
        setSupportStatus('submitting');
        setTimeout(() => {
            setSupportStatus('success');
            setSupportData({ name: '', email: '', role: 'student', category: 'login', description: '' });
        }, 1500);
    };
    const handleOtpChange = (element, index) => {
        if (isNaN(element.value)) return false;
        setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);
        if (element.nextSibling && element.value !== '') {
            element.nextSibling.focus();
        }
    };

    const handleOtpKeyDown = (e, index) => {
        if (e.key === 'Backspace' && !otp[index] && e.target.previousSibling) {
            e.target.previousSibling.focus();
        }
    };

    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => setError(''), 5000);
            return () => clearTimeout(timer);
        }
    }, [error]);

    useEffect(() => {
        if (successMsg) {
            const timer = setTimeout(() => setSuccessMsg(''), 5000);
            return () => clearTimeout(timer);
        }
    }, [successMsg]);

    const { login, googleAuth } = useContext(AuthContext);
    const navigate = useNavigate();

    
    const handleGithubLogin = (roleStr) => {
        localStorage.setItem('oauth_role', roleStr || 'student');
        localStorage.setItem('oauth_is_register', 'false');
        const clientId = import.meta.env.VITE_GITHUB_CLIENT_ID || 'placeholder';
        const redirectUri = window.location.origin + '/github/callback';
        window.location.href = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=user:email`;
    };

    const handleGoogleLogin = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            try {
                const res = await googleAuth(tokenResponse.access_token, portalRef.current.toLowerCase());
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


    useEffect(() => {
        let timer;
        if (otpSent && timeLeft > 0) {
            timer = setInterval(() => {
                setTimeLeft(prev => prev - 1);
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [otpSent, timeLeft]);

    const slides = [
        "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=60&w=600&h=800&auto=format&fit=crop", 
        "https://images.unsplash.com/photo-1573164574572-cb89e39749b4?q=60&w=600&h=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1556761175-4b46a572b786?q=60&w=600&h=800&auto=format&fit=crop", 
        "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=60&w=600&h=800&auto=format&fit=crop"
    ];

    const studentSlides = [
        "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=60&w=400&auto=format&fit=crop", 
        "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=60&w=400&auto=format&fit=crop", 
        "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?q=60&w=400&auto=format&fit=crop", 
        "https://images.unsplash.com/photo-1543269865-cbf427effbad?q=60&w=400&auto=format&fit=crop"
    ];

    const facultySlides = [
        "https://images.unsplash.com/photo-1577896851231-70ef18881754?q=60&w=400&auto=format&fit=crop", 
        "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=60&w=400&auto=format&fit=crop", 
        "https://images.unsplash.com/photo-1544717305-2782549b5136?q=60&w=400&auto=format&fit=crop", 
        "https://images.unsplash.com/photo-1552664730-d307ca884978?q=60&w=400&auto=format&fit=crop"
    ];

    useEffect(() => {
        if (portal === 'TPO' || portal === 'Student' || portal === 'Faculty') {
            const timer = setInterval(() => {
                setCurrentSlide((prev) => {
                    if (portal === 'TPO') return (prev + 1) % slides.length;
                    if (portal === 'Student') return (prev + 1) % studentSlides.length;
                    if (portal === 'Faculty') return (prev + 1) % facultySlides.length;
                    return 0;
                });
            }, 3500); 
            return () => clearInterval(timer);
        }
    }, [slides.length, studentSlides.length, facultySlides.length, portal]);

    useEffect(() => {
        // Reset slide to 0 when portal changes
        setCurrentSlide(0);
        setError('');
        
        // Reset OTP state when switching roles
        setOtpSent(false);
        setOtp(['', '', '', '', '', '']);
        setTimeLeft(60);
        setDevOtp('');
    }, [portal]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        
        
        if (!turnstileToken && (!otpSent || timeLeft === 0)) {
            setError('Please complete the security check.');
            return;
        }
        
        try {
            if (!otpSent || timeLeft === 0) {
                const res = await login({ email: email.trim().toLowerCase(), password, institutionCode: institutionCode ? institutionCode.trim() : "", portal, turnstileToken });
                if (res.success && res.userId) {
                    setUserId(res.userId);
                    setOtpSent(true);
                    setTimeLeft(60);
                    setOtp(['', '', '', '', '', '']); // clear old OTP
                    setSuccessMsg('OTP has been sent successfully to your registered mail id');
                    if (res.otp) {
                        setDevOtp(res.otp);
                        setTimeout(() => setDevOtp(''), 15000); // hide after 15s
                    }
                } else if (res.success) {
                    navigate(portal === 'Recruiter' ? '/employer' : portal === 'Student' ? '/student-dashboard' : portal === 'Admin' ? '/admin-dashboard' : portal === 'Faculty' ? '/faculty-dashboard' : '/');
                } else {
                    setError('Invalid credentials');
                }
            } else {
                const otpString = otp.join('');
                setIsVerifying(true);
                
                // Artificially delay for 4 seconds FIRST, regardless of success or failure
                await new Promise(resolve => setTimeout(resolve, 4000));
                
                const res = await api.post('/auth/verify-otp', { userId, otp: otpString });
                
                if (res.data.success) {
                    localStorage.setItem('token', res.data.token);
                    setIsVerifying(false);
                    setLoginSuccess(true);
                    
                    // Wait 1.5s to show the green success state before redirecting
                    setTimeout(() => {
                        window.location.href = portal === 'Recruiter' ? '/employer' : portal === 'Student' ? '/student-dashboard' : portal === 'Admin' ? '/admin-dashboard' : portal === 'Faculty' ? '/faculty-dashboard' : '/';
                    }, 1500);
                } else {
                    setIsVerifying(false);
                }
            }
        } catch (err) {
            setIsVerifying(false);
            console.error("API Error:", err);
            if (!err.response) {
                setError('Network error: Unable to connect to server. Is the backend running?');
            } else {
                setError(err.response?.data?.error || (!otpSent ? 'Login failed' : 'Invalid OTP'));
            }
        }
    };

    // Diagonal Curtain Wipe Variants
    const pageVariants = {
        initial: { 
            clipPath: 'circle(0% at 100% 0%)',
            zIndex: 10
        },
        in: { 
            clipPath: 'circle(150% at 100% 0%)',
            zIndex: 10
        },
        out: { 
            zIndex: 0,
            transition: { delay: 0.6 } // Keep it mounted underneath while the new one wipes over it
        }
    };

    const pageTransition = {
        type: "tween",
        ease: "easeInOut",
        duration: 0.6
    };

    return (
        <div 
        className="fixed inset-0 w-full h-full flex flex-col items-center justify-start md:justify-center md:px-4 overflow-hidden bg-white md:bg-[#0B1B33] bg-none md:bg-[url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=60&w=1280&auto=format&fit=crop')] bg-cover bg-center bg-no-repeat"
        
    >

        {/* Interactive Dark Overlay */}
        <div className="absolute inset-0 hidden md:block bg-[#0B1B33]/50 backdrop-blur-sm z-0"></div>
        
        {/* Return to Home Button */}
        <Link 
            to="/" 
            className="absolute top-4 right-6 md:top-6 md:right-8 z-50 p-2.5 rounded-full bg-slate-100 md:bg-white/10 backdrop-blur-md border border-slate-200 md:border-white/20 text-slate-800 md:text-white hover:bg-slate-200 md:hover:bg-white/20 hover:scale-110 transition-all duration-300 shadow-[0_4px_15px_rgba(0,0,0,0.3)] hidden md:flex items-center justify-center group"
            title="Return to Homepage"
        >
            <Home className="w-5 h-5 md:w-6 md:h-6" strokeWidth={2.5} />
            <span className="absolute top-full right-1/2 translate-x-1/2 mt-2 bg-gray-900/90 text-white text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">Home</span>
        </Link>

            
            {/* Absolute Top-Left Rotating CareerSync Logo */}
            <div className="absolute top-2 left-6 md:top-3 md:left-8 z-50 hidden md:flex items-center gap-4">
                <motion.div 
                    animate={{ rotateY: 360 }}
                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                    style={{ transformStyle: "preserve-3d" }}
                    className="relative w-16 h-16 md:w-20 md:h-20 shadow-2xl rounded-2xl"
                >
                    {/* Front Face */}
                    <div 
                        style={{ backfaceVisibility: "hidden" }}
                        className={`absolute inset-0 bg-white/90 backdrop-blur-sm flex items-center justify-center rounded-2xl border ${themeStyles[globalTheme].logoBorder}`}
                    >
                        <GraduationCap className={`w-10 h-10 md:w-12 md:h-12 ${themeStyles[globalTheme].iconColor}`} />
                    </div>
                    {/* Back Face */}
                    <div 
                        style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
                        className="absolute inset-0 bg-gradient-to-br from-gray-900 to-black rounded-2xl flex items-center justify-center border border-gray-700"
                    >
                        <GraduationCap className="w-10 h-10 md:w-12 md:h-12 text-white" />
                    </div>
                </motion.div>
                <div className="hidden md:flex flex-col drop-shadow-lg -mt-6">
                    <span className="text-3xl lg:text-4xl font-black text-black tracking-tight leading-none drop-shadow-md">
                        Career<span className="text-blue-800">Sync</span>
                    </span>
                    <span className="text-sm font-bold text-white/90 tracking-widest uppercase mt-1 drop-shadow-sm">
                        Portal
                    </span>
                </div>
            </div>

            <>
                <div className="absolute top-0 right-0 w-96 h-96 bg-white/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
            </>
            
            {/* Brand Logo and Tagline */}
            <div className="text-center z-20 mb-1 mt-3 drop-shadow-md">
                <div className={`flex items-center justify-center mb-1.5 ${themeStyles[globalTheme].accentText}`}>
                    
                    <span className="font-extrabold text-xl tracking-tight">
                        <span className="text-black">Career</span><span className={themeStyles[globalTheme].accentText}>Sync</span>
                    </span>
                </div>
                <p className="text-black text-sm font-medium tracking-wide">
                    Bridging the Gap Between Talent and Opportunity
                </p>
            </div>

            {/* Absolute positioning container wrapper so layout doesn't break during transition */}
            <motion.div 
                className="w-full h-full overflow-y-auto overflow-x-hidden md:overflow-hidden md:max-w-6xl md:rounded-3xl md:h-[min(700px,90vh)] md:shadow-2xl relative z-10 perspective-1000 mx-auto md:mb-6 shrink-0 bg-transparent pb-32 md:pb-0"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
                <AnimatePresence initial={false}>
                    <motion.div
                          key={showSupport ? 'support' : portal}
                          initial="initial"
                          animate="in"
                          exit="out"
                          variants={pageVariants}
                          transition={pageTransition}
                          className={`absolute inset-0 w-full h-full rounded-none md:rounded-3xl overflow-y-auto overflow-x-hidden md:overflow-hidden flex flex-col lg:flex-row ${portal === 'Admin' && !showSupport ? 'bg-white md:bg-[#050505] ring-2 ring-inset ring-red-500 shadow-[0_0_40px_rgba(220,38,38,0.3)]' : showSupport ? `${themeStyles[globalTheme].cardBg} shadow-[0_20px_50px_rgba(8,_112,_184,_0.4)]` : 'bg-white'}`}
                      >
                        {showSupport ? (
                            <div className="w-full p-4 md:p-6 flex flex-col justify-center h-full relative">
                                <Link to="/" className="absolute top-4 right-6 p-2 rounded-full hover:bg-black/5 text-gray-400 hover:text-gray-700 transition-colors cursor-pointer" title="Back to Home">
                                    <Home className="w-5 h-5" />
                                </Link>
                                <div className="flex flex-col items-center text-center mb-3">
                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-3 ${themeStyles[globalTheme].iconBg}`}>
                                        <MessageSquare className={`w-6 h-6 ${themeStyles[globalTheme].iconColor}`} />
                                    </div>
                                    <h2 className="text-2xl font-bold tracking-tight text-gray-900">Technical Support</h2>
                                    <p className="text-gray-500 mt-1 text-sm">We're here to help you resolve any issues.</p>
                                </div>
                                
                                <div className="flex-grow flex flex-col justify-center">
                                    {supportStatus === 'success' ? (
                                        <div className="text-center py-8">
                                            <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
                                            <h3 className="text-xl font-bold text-gray-900 mb-2">Ticket Submitted!</h3>
                                            <p className="text-gray-600 mb-6">Your support ticket has been raised. Our technical team will review it and contact you via email shortly.</p>
                                            <button onClick={() => { setSupportStatus('idle'); setShowSupport(false); }} className={`font-medium hover:underline cursor-pointer ${themeStyles[globalTheme].iconColor}`}>
                                                Back to Login
                                            </button>
                                        </div>
                                    ) : (
                                        <form onSubmit={handleSupportSubmit} className="space-y-2.5 max-w-lg mx-auto w-full">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-gray-700 text-xs font-medium mb-1">Full Name</label>
                                                    <input type="text" name="name" required className={`w-full px-3 py-1.5 bg-white/70 border border-white/40 autofill-light rounded-xl focus:bg-white focus:ring-2 ${themeStyles[globalTheme].ringColor}/20  outline-none transition-all text-sm shadow-sm`} value={supportData.name} onChange={handleSupportChange} placeholder="John Doe" />
                                                </div>
                                                <div>
                                                    <label className="block text-gray-700 text-xs font-medium mb-1">Email Address</label>
                                                    <input type="email" name="email" required className={`w-full px-3 py-1.5 bg-white/70 border border-white/40 autofill-light rounded-xl focus:bg-white focus:ring-2 ${themeStyles[globalTheme].ringColor}/20  outline-none transition-all text-sm shadow-sm`} value={supportData.email} onChange={handleSupportChange} placeholder="john@example.com" />
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-gray-700 text-xs font-medium mb-1">Your Role</label>
                                                    <select name="role" className={`w-full px-3 py-1.5 bg-white/70 border border-white/40 rounded-xl focus:bg-white focus:ring-2 ${themeStyles[globalTheme].ringColor}/20  outline-none transition-all text-sm shadow-sm`} value={supportData.role} onChange={handleSupportChange}>
                                                        <option value="student">Student</option>
                                                        <option value="faculty">Faculty</option>
                                                        <option value="tpo">TPO / Institution</option>
                                                        <option value="recruiter">Recruiter</option>
                                                        <option value="other">Other</option>
                                                    </select>
                                                </div>
                                                <div>
                                                    <label className="block text-gray-700 text-xs font-medium mb-1">Issue Category</label>
                                                    <select name="category" className={`w-full px-3 py-1.5 bg-white/70 border border-white/40 rounded-xl focus:bg-white focus:ring-2 ${themeStyles[globalTheme].ringColor}/20  outline-none transition-all text-sm shadow-sm`} value={supportData.category} onChange={handleSupportChange}>
                                                        <option value="login">Login / Authentication</option>
                                                        <option value="registration">Registration Process</option>
                                                        <option value="technical">Technical Glitch / Bug</option>
                                                        <option value="other">Other Request</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-gray-700 text-xs font-medium mb-1">Describe the Issue</label>
                                                <textarea name="description" required rows="2" className={`w-full px-3 py-1.5 bg-white/70 border border-white/40 rounded-xl focus:bg-white focus:ring-2 ${themeStyles[globalTheme].ringColor}/20  outline-none transition-all text-sm shadow-sm resize-none`} value={supportData.description} onChange={handleSupportChange} placeholder="Please provide specific details..."></textarea>
                                            </div>
                                            <button type="submit" disabled={supportStatus === 'submitting'} className={`w-full flex items-center justify-center py-1.5 rounded-lg text-gray-900 md:text-white font-medium transition-colors text-sm ${themeStyles[globalTheme].primaryBtn} ${supportStatus === 'submitting' ? 'opacity-70 cursor-not-allowed' : ''}`}>
                                                {supportStatus === 'submitting' ? 'Submitting...' : <>Submit Ticket <Send className="w-4 h-4 ml-2" /></>}
                                            </button>
</form>
                                    )}
                                    <div className="mt-4 text-center">
                                        <button onClick={() => setShowSupport(false)} className="inline-flex items-center text-xs font-medium text-gray-500 hover:text-gray-900 transition-colors cursor-pointer">
                                            <ArrowLeft className="w-3 h-3 mr-1" /> Back to Login
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : portal === 'Student' ? (
                            <>
                                {/* STUDENT LAYOUT */}
                                <div className="hidden lg:flex lg:w-[55%] flex-col relative bg-[#9b72f0] p-14 overflow-hidden w-full items-center">
                                    <div className="absolute inset-0 bg-gradient-to-b from-[#9b72f0]/60 via-[#9b72f0]/10 to-transparent z-10"></div>
                                    
                                    <div className="absolute inset-0 z-0 overflow-hidden">
                                        <AnimatePresence initial={false}>
                                            <motion.img
                                                key={currentSlide}
                                                src={studentSlides[currentSlide]}
                                                alt="Students"
                                                initial={{ x: '-100%' }}
                                                animate={{ x: 0 }}
                                                exit={{ x: '100%' }}
                                                transition={{ type: "tween", ease: "easeInOut", duration: 1 }}
                                                className="absolute inset-0 w-full h-full object-cover opacity-100"
                                            />
                                        </AnimatePresence>
                                    </div>
                                    
                                    {/* CAREERSYNC BRAND TAG */}
                                    <div className="absolute top-2 left-8 z-50 flex items-center">
                                        <div className="w-8 h-8 bg-white/20 backdrop-blur-md rounded-lg flex items-center justify-center mr-2 shadow-lg">
                                            <span className="text-white font-bold text-lg">C</span>
                                        </div>
                                        <span className="font-bold tracking-widest text-sm drop-shadow-md flex items-center">
                                            <span className="text-white">CAREER</span>
                                            <span className={`bg-white ${themeStyles[globalTheme].labelColor} px-1.5 py-0.5 rounded-sm leading-none ml-0.5 shadow-sm`}>SYNC</span>
                                        </span>
                                    </div>

                                    <div className="relative z-20 pt-10 w-full text-center">
                                        <h1 className="text-5xl font-bold mb-2 leading-tight text-white drop-shadow-md">Welcome to Student Portal</h1>
                                        <p className="text-white/90 text-sm font-medium drop-shadow">Login to access your account</p>
                                    </div>
                                </div>

                                <div className="w-full lg:w-[45%] p-8 pb-32 lg:p-12 bg-white md:bg-[#1e1e24] flex flex-col relative overflow-y-auto slim-scrollbar">
                                    <div className="flex justify-center items-center mb-10 mt-4 lg:mt-0 w-full">
                                        <div className="flex flex-wrap justify-center p-1 bg-gray-100 md:bg-[#2a2a32] rounded-lg w-fit mx-auto">
                                            {['Student', 'Faculty', 'TPO', 'Recruiter', 'Admin'].map((p) => (
                                                <button 
                                                    key={p}
                                                    type="button"
                                                    onClick={() => setPortal(p)}
                                                    className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all duration-300 ${
                                                        portal === p 
                                                            ? `${themeStyles[globalTheme].primaryBtn} text-white shadow-sm` 
                                                            : 'text-gray-400 hover:text-gray-200'
                                                    }`}
                                                >
                                                    {p}
                                                </button>
                                            ))}
                                            
                                        </div>
                                    </div>
                                    <Link to="/" className="absolute top-4 right-6 text-gray-400 hover:text-gray-200 flex items-center text-xs font-semibold px-3 py-1.5 rounded-full hover:bg-white/5 transition-colors">
                                        <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Back
                                    </Link>

                                    <div className="flex-1 flex flex-col justify-center max-w-sm w-full mx-auto">
                                        <div className="flex flex-col items-center lg:items-start mb-6">
                                            <div className={`w-12 h-12 ${themeStyles[globalTheme].iconBg} rounded-full flex items-center justify-center mb-3 ${themeStyles[globalTheme].iconColor}`}>
                                                <GraduationCap className="w-6 h-6" />
                                            </div>
                                            <h2 className="text-gray-900 md:text-gray-900 md:text-white text-xl font-bold mb-1">Student Login</h2>
                                            <p className="text-gray-500 md:text-gray-400 text-xs">Enter your account details</p>
                                        </div>

                                        <form onSubmit={handleSubmit} className="space-y-6">
                                            {error && (
                                                <div className="w-fit mx-auto bg-red-50 md:bg-red-900/50 border border-red-200 md:border-red-500 text-red-600 md:text-red-200 px-3 py-1.5 rounded-md text-[11px] text-center font-medium">
                                                    {error}
                                                </div>
                                            )}
                                            {successMsg && (
                                                <div className="bg-blue-50 md:bg-blue-900/50 border border-blue-200 md:border-blue-500 text-blue-600 md:text-blue-200 px-3 py-1.5 rounded-md text-[11px] text-center font-medium mt-2">
                                                    {successMsg}
                                                </div>
                                            )}

                                            <div className="relative border-b border-gray-300 md:border-gray-600 focus-within:border-[#2563eb] transition-colors pb-1">
                                                <input
                                                    type="text"
                                                    required
                                                    placeholder="Username or Email"
                                                    className="w-full bg-transparent text-gray-800 md:text-gray-200 focus:outline-none text-sm placeholder-gray-500 md:placeholder-gray-400 autofill-student"
                                                    style={{ WebkitBoxShadow: (typeof window !== 'undefined' && window.innerWidth >= 768) ? '0 0 0px 1000px #1e1e24 inset' : undefined }}
                                                    value={email}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                />
                                            </div>

                                            <div>
                                                <div className="relative border-b border-gray-300 md:border-gray-600 focus-within:border-[#2563eb] transition-colors pb-1 flex items-center justify-between">
                                                    <input
                                                        type={showPassword ? "text" : "password"}
                                                        required
                                                        placeholder="Password"
                                                        className="w-full bg-transparent text-gray-800 md:text-gray-200 focus:outline-none text-sm pr-10 placeholder-gray-500 md:placeholder-gray-400 autofill-student"
                                                        style={{ WebkitBoxShadow: (typeof window !== 'undefined' && window.innerWidth >= 768) ? '0 0 0px 1000px #1e1e24 inset' : undefined }}
                                                        value={password}
                                                        onChange={(e) => setPassword(e.target.value)}
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowPassword(!showPassword)}
                                                        className="text-gray-500 hover:text-gray-300 focus:outline-none flex-shrink-0 ml-2"
                                                    >
                                                        {showPassword ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                                                    </button>
                                                </div>
                                                <div className="mt-3 flex items-center justify-between">
                                                    <div className="flex items-center">
                                                        <input id="remember-me-student" type="checkbox" className={`h-3.5 w-3.5 ${themeStyles[globalTheme].iconColor} ${themeStyles[globalTheme].ringColor} border-gray-600 bg-transparent rounded cursor-pointer autofill-light`} />
                                                        <label htmlFor="remember-me-student" className="ml-1.5 block text-xs text-gray-400 cursor-pointer">Remember me</label>
                                                    </div>
                                                    <Link to="/forgot-password" className="text-xs text-gray-400 hover:text-white transition-colors">Forgot Password?</Link>
                                                </div>
                                            </div>

                                            
                                            {otpSent && timeLeft > 0 && (
                                                <div className="mt-5 animate-in fade-in slide-in-from-top-2 duration-300">
                                                    <label className="block text-gray-600 text-xs font-semibold mb-2 text-center uppercase tracking-wider">Enter 6-Digit OTP</label>
                                                    <div className="flex justify-between items-center gap-2 mb-2">
                                                        {otp.map((data, index) => (
                                                            <input
                                                                key={index}
                                                                type="text"
                                                                name="otp"
                                                                maxLength="1"
                                                                className={`w-10 h-12 text-center text-lg font-bold text-gray-800 bg-white/80 border border-gray-300 rounded-lg focus:bg-white focus:ring-2 ${themeStyles[globalTheme].ringColor}  transition-all outline-none shadow-sm`}
                                                                value={data}
                                                                onChange={e => handleOtpChange(e.target, index)}
                                                                onKeyDown={e => handleOtpKeyDown(e, index)}
                                                                onFocus={e => e.target.select()}
                                                            />
                                                        ))}
                                                    </div>
                                                    <div className="flex justify-center items-center mt-3 mb-2">
                                                        <span className={`text-xs font-semibold px-3 py-1 rounded-full ${timeLeft > 0 ? 'bg-orange-100 text-orange-600 border border-orange-200' : 'bg-red-100 text-red-600 border border-red-200'}`}>
                                                            {timeLeft > 0 ? `Valid for 00:${timeLeft.toString().padStart(2, '0')}` : 'OTP Expired'}
                                                        </span>
                                                    </div>
                                                </div>
                                            )}

                                            <div className="mt-4 flex justify-center w-full"><Turnstile siteKey={TURNSTILE_SITE_KEY} onSuccess={(token) => setTurnstileToken(token)} /></div>
<button type="submit" disabled={isVerifying || loginSuccess}
                                                className={`w-full flex items-center justify-center font-semibold py-2.5 rounded-lg transition-all duration-300 mt-4 text-xs shadow-md ${
                                                    loginSuccess 
                                                    ? 'bg-green-500 text-white shadow-green-500/40 cursor-default' 
                                                    : isVerifying
                                                    ? 'bg-[#1d4ed8] text-white cursor-wait opacity-90'
                                                    : `${themeStyles[globalTheme].primaryBtn} text-white shadow-blue-500/30`
                                                }`}
                                            >
                                                {loginSuccess ? (
                                                    <>
                                                        <CheckCircle2 className="w-4 h-4 mr-2" /> Login Successful!
                                                    </>
                                                ) : isVerifying ? (
                                                    <>
                                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Verifying...
                                                    </>
                                                ) : otpSent ? (
                                                    timeLeft > 0 ? 'Verify & Login' : 'Resend OTP'
                                                ) : (
                                                    'Send OTP'
                                                )}
                                            </button>
</form>

                                        <div className="mt-8 text-center">
                                            <div className="flex items-center mb-6">
                                                <div className="flex-1 border-t border-gray-700"></div>
                                                <span className="px-3 text-[10px] font-semibold text-gray-500">OR LOGIN WITH</span>
                                                <div className="flex-1 border-t border-gray-700"></div>
                                            </div>

                                            <div className="flex space-x-3 mb-8">
                                                <button onClick={() => handleGithubLogin(portal.toLowerCase())} type="button"  className="flex-1 flex items-center justify-center bg-transparent border border-gray-600 hover:bg-gray-100 md:hover:bg-[#3f3f46] md:bg-[#2a2a32] text-gray-600 md:text-gray-300 py-2 rounded-md transition-colors autofill-light">
                                                    <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M12 0C5.37 0 0 5.37 0 12C0 17.3 3.438 21.8 8.205 23.385C8.805 23.495 9.025 23.125 9.025 22.82C9.025 22.54 9.015 21.58 9.01 20.485C5.67 21.21 4.965 19.04 4.965 19.04C4.42 17.655 3.635 17.28 3.635 17.28C2.55 16.535 3.715 16.55 3.715 16.55C4.915 16.635 5.545 17.785 5.545 17.785C6.61 19.61 8.335 19.085 9.055 18.78C9.165 17.96 9.495 17.435 9.86 17.135C7.195 16.835 4.395 15.805 4.395 11.225C4.395 9.92 4.86 8.85 5.615 8.01C5.495 7.705 5.085 6.495 5.735 4.85C5.735 4.85 6.73 4.53 9.025 6.085C9.975 5.82 10.99 5.69 12 5.685C13.01 5.69 14.025 5.82 14.975 6.085C17.27 4.53 18.265 4.85 18.265 4.85C18.915 6.495 18.505 7.705 18.385 8.01C19.14 8.85 19.6 9.92 19.6 11.225C19.6 15.82 16.795 16.83 14.12 17.125C14.58 17.525 15 18.31 15 19.535C15 21.285 14.985 22.695 14.985 22.82C14.985 23.13 15.205 23.505 15.815 23.385C20.565 21.795 24 17.3 24 12C24 5.37 18.63 0 12 0Z"/></svg>
<span className="text-xs font-semibold">GITHUB</span>
                                                </button>
                                                <button type="button" onClick={() => handleGoogleLogin()} className="flex-1 flex items-center justify-center bg-transparent border border-gray-600 hover:bg-gray-100 md:hover:bg-[#3f3f46] md:bg-[#2a2a32] text-gray-600 md:text-gray-300 py-2 rounded-md transition-colors autofill-light">
                                                    <svg className="w-3.5 h-3.5 mr-2" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                                                    <span className="text-xs font-medium">GOOGLE</span>
                                                </button>
                                            </div>

                                            <div className="flex items-center justify-center space-x-2">
                                                <p className="text-gray-500 text-xs">Don't have an account?</p>
                                                <Link to="/register" state={{ role: "student" }} className={`${themeStyles[globalTheme].iconColor} hover:text-[#1d4ed8] underline text-xs font-semibold transition-all`}>
                                                    Create new account
                                                </Link>
                                            </div>
                                            {/* Technical Support Link */}
                                            <div className="text-center mt-3 pt-3 border-t border-gray-100">
                                                <p className="text-[11px] font-medium text-gray-500">
                                                    Need assistance? <button type="button" onClick={() => setShowSupport(true)} className={`font-bold hover:underline transition-colors cursor-pointer ${themeStyles[globalTheme].iconColor}`}>Contact Technical Support</button>
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </>
                        ) : portal === 'Faculty' ? (
                            <>
                                {/* FACULTY LAYOUT */}
                                <div className="hidden lg:flex lg:w-1/2 flex-col relative bg-[#047857] overflow-hidden w-full items-center p-14">
                                    <div className="absolute inset-0 bg-gradient-to-b from-[#047857]/60 via-[#047857]/20 to-[#047857]/20 z-10"></div>
                                    
                                    <div className="absolute inset-0 z-0 overflow-hidden">
                                        <AnimatePresence initial={false}>
                                            <motion.img
                                                key={currentSlide}
                                                src={facultySlides[currentSlide]}
                                                alt="Faculty"
                                                initial={{ x: '-100%' }}
                                                animate={{ x: 0 }}
                                                exit={{ x: '100%' }}
                                                transition={{ type: "tween", ease: "easeInOut", duration: 1 }}
                                                className="absolute inset-0 w-full h-full object-cover opacity-100"
                                            />
                                        </AnimatePresence>
                                    </div>

                                    <div className="absolute top-2 left-8 z-50 flex items-center">
                                        <div className="w-8 h-8 bg-white/20 backdrop-blur-md rounded-lg flex items-center justify-center mr-2 shadow-lg">
                                            <span className="text-white font-bold text-lg">C</span>
                                        </div>
                                        <span className="font-bold tracking-widest text-sm drop-shadow-md flex items-center">
                                            <span className="text-white">CAREER</span>
                                            <span className="bg-white text-[#047857] px-1.5 py-0.5 rounded-sm leading-none ml-0.5 shadow-sm">SYNC</span>
                                        </span>
                                    </div>

                                    <div className="relative z-20 pt-10 w-full text-center">
                                        <h1 className="text-5xl font-bold mb-3 leading-tight text-white drop-shadow-md">Empower the<br/>next generation</h1>
                                        <p className="text-white/90 text-sm font-medium drop-shadow">Login to access faculty resources</p>
                                    </div>
                                </div>

                                <div className={`flex-1 w-full h-full lg:w-1/2 p-8 pb-10 md:pb-8 lg:p-12 flex flex-col relative overflow-y-auto slim-scrollbar transition-colors duration-700 ${themeStyles[globalTheme].cardBg}`}>
                                    <div className="flex justify-center items-center mb-6 mt-12 md:mt-4 lg:mt-0 w-full">
                                        <div className="flex flex-wrap justify-center p-1 bg-gray-100 rounded-lg w-fit mx-auto">
                                            {['Student', 'Faculty', 'TPO', 'Recruiter', 'Admin'].map((p) => (
                                                <button 
                                                    key={p}
                                                    type="button"
                                                    onClick={() => setPortal(p)}
                                                    className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all duration-300 ${
                                                        portal === p 
                                                            ? `${themeStyles[globalTheme].primaryBtn} text-white shadow-sm` 
                                                            : 'text-gray-500 hover:text-gray-700'
                                                    }`}
                                                >
                                                    {p}
                                                </button>
                                            ))}
                                            
                                        </div>
                                    </div>
                                    <Link to="/" className="absolute top-4 right-6 text-gray-500 hover:text-gray-800 flex items-center text-xs font-semibold px-3 py-1.5 rounded-full hover:bg-black/5 transition-colors">
                                        <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Back
                                    </Link>

                                    <div className="flex-1 flex flex-col justify-center max-w-sm w-full mx-auto">
                                        <div className="flex flex-col items-center lg:items-start mb-6">
                                            <div className={`w-12 h-12 ${themeStyles[globalTheme].iconBg} rounded-full flex items-center justify-center mb-3 ${themeStyles[globalTheme].iconColor}`}>
                                                <Users className="w-6 h-6" />
                                            </div>
                                            <h2 className={`${themeStyles[globalTheme].labelColor} text-2xl font-bold mb-1`}>Faculty Login</h2>
                                            <p className="text-gray-500 text-xs">Enter your academic credentials</p>
                                        </div>

                                        <form onSubmit={handleSubmit} className="space-y-4">
                                            {error && (
                                                <div className="w-fit mx-auto bg-red-50 border border-red-200 text-red-600 px-3 py-1.5 rounded-md text-[11px] text-center font-medium">
                                                    {error}
                                                </div>
                                            )}
                                        {successMsg && (
                                            <div className={`\${themeStyles[globalTheme].iconBg} border border-blue-200 text-blue-600 px-3 py-1.5 rounded-md text-[11px] text-center font-medium mt-2`}>
                                                {successMsg}
                                            </div>
                                        )}

                                            <div>
                                                <label className="block text-gray-700 text-sm font-medium mb-1.5">Official Email / Faculty ID</label>
                                                <div className={`relative flex items-center w-full px-4 py-2.5 bg-[#f0f4f8] border-transparent rounded-lg focus-within:ring-2 ${themeStyles[globalTheme].ringColor} focus-within:bg-white transition-colors`}>
                                                    <Mail className="w-4 h-4 text-gray-400 mr-2" />
                                                    <input
                                                        type="text"
                                                        required
                                                        placeholder="Enter email or ID"
                                                        className="w-full bg-transparent focus:outline-none text-sm text-gray-800 autofill-light"
                                                        value={email}
                                                        onChange={(e) => setEmail(e.target.value)}
                                                    />
                                                </div>
                                            </div>

                                            <div>
                                                <div className="flex justify-between items-center mb-1.5">
                                                    <label className="block text-gray-700 text-sm font-medium">Password</label>
                                                    <Link to="/forgot-password" className={`text-xs font-semibold ${themeStyles[globalTheme].iconColor} hover:text-[#1d4ed8] transition-colors`}>Forgot Password?</Link>
                                                </div>
                                                <div className={`relative flex items-center justify-between w-full px-4 py-2.5 bg-[#f0f4f8] border-transparent rounded-lg focus-within:ring-2 ${themeStyles[globalTheme].ringColor} focus-within:bg-white transition-colors`}>
                                                    <div className="flex items-center flex-1">
                                                        <Lock className="w-4 h-4 text-gray-400 mr-2" />
                                                        <input
                                                            type={showPassword ? "text" : "password"}
                                                            required
                                                            placeholder="Enter password"
                                                            className="w-full bg-transparent focus:outline-none text-sm text-gray-800 autofill-light"
                                                            value={password}
                                                            onChange={(e) => setPassword(e.target.value)}
                                                        />
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowPassword(!showPassword)}
                                                        className="text-gray-400 hover:text-gray-600 focus:outline-none ml-2"
                                                    >
                                                        {showPassword ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                                                    </button>
                                                </div>
                                                <div className="mt-3 flex items-center">
                                                    <input id="remember-me-faculty" type="checkbox" className={`h-3.5 w-3.5 ${themeStyles[globalTheme].iconColor} ${themeStyles[globalTheme].ringColor} border-gray-300 rounded cursor-pointer`} />
                                                    <label htmlFor="remember-me-faculty" className="ml-1.5 block text-xs text-gray-600 cursor-pointer">Remember me</label>
                                                </div>
                                            </div>

                                            
                                            {otpSent && timeLeft > 0 && (
                                                <div className="mt-5 animate-in fade-in slide-in-from-top-2 duration-300">
                                                    <label className="block text-gray-600 text-xs font-semibold mb-2 text-center uppercase tracking-wider">Enter 6-Digit OTP</label>
                                                    <div className="flex justify-between items-center gap-2 mb-2">
                                                        {otp.map((data, index) => (
                                                            <input
                                                                key={index}
                                                                type="text"
                                                                name="otp"
                                                                maxLength="1"
                                                                className={`w-10 h-12 text-center text-lg font-bold text-gray-800 bg-white/80 border border-gray-300 rounded-lg focus:bg-white focus:ring-2 ${themeStyles[globalTheme].ringColor}  transition-all outline-none shadow-sm`}
                                                                value={data}
                                                                onChange={e => handleOtpChange(e.target, index)}
                                                                onKeyDown={e => handleOtpKeyDown(e, index)}
                                                                onFocus={e => e.target.select()}
                                                            />
                                                        ))}
                                                    </div>
                                                    <div className="flex justify-center items-center mt-3 mb-2">
                                                        <span className={`text-xs font-semibold px-3 py-1 rounded-full ${timeLeft > 0 ? 'bg-orange-100 text-orange-600 border border-orange-200' : 'bg-red-100 text-red-600 border border-red-200'}`}>
                                                            {timeLeft > 0 ? `Valid for 00:${timeLeft.toString().padStart(2, '0')}` : 'OTP Expired'}
                                                        </span>
                                                    </div>
                                                </div>
                                            )}

                                            <div className="mt-4 flex justify-center w-full"><Turnstile siteKey={TURNSTILE_SITE_KEY} onSuccess={(token) => setTurnstileToken(token)} /></div>
<button type="submit" disabled={isVerifying || loginSuccess}
                                                className={`w-full flex items-center justify-center font-semibold py-2.5 rounded-lg transition-all duration-300 mt-4 text-xs shadow-md ${
                                                    loginSuccess 
                                                    ? 'bg-green-500 text-white shadow-green-500/40 cursor-default' 
                                                    : isVerifying
                                                    ? 'bg-[#1d4ed8] text-white cursor-wait opacity-90'
                                                    : `${themeStyles[globalTheme].primaryBtn} text-white shadow-blue-500/30`
                                                }`}
                                            >
                                                {loginSuccess ? (
                                                    <><CheckCircle2 className="w-4 h-4 mr-2" /> Login Successful!</>
                                                ) : isVerifying ? (
                                                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Verifying...</>
                                                ) : otpSent ? (
                                                    timeLeft > 0 ? 'Verify & Login' : 'Resend OTP'
                                                ) : (
                                                    <>Send OTP <ArrowRight className="w-4 h-4 ml-2" /></>
                                                )}
                                            </button>
</form>

                                        <div className="flex items-center my-4">
                                            <div className="flex-1 border-t border-gray-200"></div>
                                            <span className="px-3 text-[10px] font-semibold text-gray-400">OR LOGIN WITH</span>
                                            <div className="flex-1 border-t border-gray-200"></div>
                                        </div>

                                        <div className="flex space-x-3 mb-4">
                                            <button onClick={() => handleGithubLogin(portal.toLowerCase())} type="button"  className="flex-1 flex items-center justify-center bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 py-2.5 rounded-lg transition-colors shadow-sm">
                                                <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M12 0C5.37 0 0 5.37 0 12C0 17.3 3.438 21.8 8.205 23.385C8.805 23.495 9.025 23.125 9.025 22.82C9.025 22.54 9.015 21.58 9.01 20.485C5.67 21.21 4.965 19.04 4.965 19.04C4.42 17.655 3.635 17.28 3.635 17.28C2.55 16.535 3.715 16.55 3.715 16.55C4.915 16.635 5.545 17.785 5.545 17.785C6.61 19.61 8.335 19.085 9.055 18.78C9.165 17.96 9.495 17.435 9.86 17.135C7.195 16.835 4.395 15.805 4.395 11.225C4.395 9.92 4.86 8.85 5.615 8.01C5.495 7.705 5.085 6.495 5.735 4.85C5.735 4.85 6.73 4.53 9.025 6.085C9.975 5.82 10.99 5.69 12 5.685C13.01 5.69 14.025 5.82 14.975 6.085C17.27 4.53 18.265 4.85 18.265 4.85C18.915 6.495 18.505 7.705 18.385 8.01C19.14 8.85 19.6 9.92 19.6 11.225C19.6 15.82 16.795 16.83 14.12 17.125C14.58 17.525 15 18.31 15 19.535C15 21.285 14.985 22.695 14.985 22.82C14.985 23.13 15.205 23.505 15.815 23.385C20.565 21.795 24 17.3 24 12C24 5.37 18.63 0 12 0Z"/></svg>
<span className="text-xs font-semibold">GITHUB</span>
                                            </button>
                                            <button type="button" onClick={() => handleGoogleLogin()} className="flex-1 flex items-center justify-center bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 py-2.5 rounded-lg transition-colors shadow-sm">
                                                <svg className="w-3.5 h-3.5 mr-2" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                                                <span className="text-xs font-semibold">GOOGLE</span>
                                            </button>
                                        </div>

                                        <div className="flex items-center justify-center space-x-2">
                                            <p className="text-gray-500 text-xs">Don't have an account?</p>
                                            <Link to="/register" state={{ role: "faculty" }} className={`${themeStyles[globalTheme].iconColor} hover:text-[#1d4ed8] underline text-xs font-semibold transition-all`}>
                                                Create new account
                                            </Link>
                                        </div>
                                            {/* Technical Support Link */}
                                            <div className="text-center mt-3 pt-3 border-t border-gray-100">
                                                <p className="text-[11px] font-medium text-gray-500">
                                                    Need assistance? <button type="button" onClick={() => setShowSupport(true)} className={`font-bold hover:underline transition-colors cursor-pointer ${themeStyles[globalTheme].iconColor}`}>Contact Technical Support</button>
                                                </p>
                                            </div>
                                            <div className="h-24 md:hidden w-full shrink-0"></div>
                                    </div>
                                </div>
                            </>
                        ) : portal === 'Recruiter' ? (
                            <>
                                {/* Recruiter Layout */}
                                <div className="hidden lg:flex lg:w-1/2 flex-col relative bg-[#1e40af] overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-r from-[#1e40af]/60 via-[#1e40af]/40 to-[#1e40af]/10 z-10"></div>
                                    <img src="https://images.unsplash.com/photo-1573164713988-8665fc963095?q=60&w=400&auto=format&fit=crop" alt="Corporate handshake" className="absolute inset-0 w-full h-full object-cover z-0 opacity-100" />
                                    
                                    {/* CAREERSYNC BRAND TAG */}
                                    <div className="absolute top-2 left-8 z-50 flex items-center">
                                        <div className="w-8 h-8 bg-white/20 backdrop-blur-md rounded-lg flex items-center justify-center mr-2">
                                            <span className="text-white font-bold text-lg">C</span>
                                        </div>
                                        <span className="font-bold tracking-widest text-sm drop-shadow-md flex items-center">
                                            <span className="text-white">CAREER</span>
                                            <span className={`bg-white ${themeStyles[globalTheme].labelColor} px-1.5 py-0.5 rounded-sm leading-none ml-0.5 shadow-sm`}>SYNC</span>
                                        </span>
                                    </div>

                                    {/* Slanted blue overlay at bottom */}
                                    <div className="absolute bottom-0 left-0 w-full h-48 bg-[#1e3a8a] z-20" style={{ clipPath: 'polygon(0 40%, 100% 0, 100% 100%, 0% 100%)' }}></div>

                                    <div className="relative z-30 p-10 pt-24 text-white h-full flex flex-col">
                                        <div className="flex items-center mb-10">
                                            <div className="p-2 bg-white/10 rounded-lg mr-3">
                                                <Handshake className="w-6 h-6 text-white" />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-sm">Academia - Industry</h3>
                                                <h3 className="font-semibold text-sm">Collaboration Portal</h3>
                                                <div className="text-[10px] text-blue-200 mt-1 space-x-2">
                                                    <span>Connect</span><span>|</span><span>Develop</span><span>|</span><span>Intern</span><span>|</span><span>Recruit</span>
                                                </div>
                                            </div>
                                        </div>

                                        <h1 className="text-xl font-bold mb-3 leading-tight">Industry & recruiter portal</h1>
                                        <p className="text-blue-100 text-sm mb-6 max-w-md">Connect with skilled talent.<br/>Build your future workforce.</p>

                                        <div className="space-y-4">
                                            <div className="flex items-start">
                                                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center mr-4 flex-shrink-0 border border-white/20">
                                                    <Users className="w-5 h-5 text-white" />
                                                </div>
                                                <div>
                                                    <h4 className="font-semibold text-sm">Post Jobs & Internships</h4>
                                                    <p className="text-xs text-blue-200 mt-0.5">Find the right talent for your team</p>
                                                </div>
                                            </div>
                                            <div className="flex items-start">
                                                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center mr-4 flex-shrink-0 border border-white/20">
                                                    <Search className="w-5 h-5 text-white" />
                                                </div>
                                                <div>
                                                    <h4 className="font-semibold text-sm">Skill Matching</h4>
                                                    <p className="text-xs text-blue-200 mt-0.5">Discover candidates with relevant skills</p>
                                                </div>
                                            </div>
                                            <div className="flex items-start">
                                                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center mr-4 flex-shrink-0 border border-white/20">
                                                    <BarChart2 className="w-5 h-5 text-white" />
                                                </div>
                                                <div>
                                                    <h4 className="font-semibold text-sm">Track Applications</h4>
                                                    <p className="text-xs text-blue-200 mt-0.5">Manage your hiring process easily</p>
                                                </div>
                                            </div>
                                            <div className="flex items-start">
                                                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center mr-4 flex-shrink-0 border border-white/20">
                                                    <Handshake className="w-5 h-5 text-white" />
                                                </div>
                                                <div>
                                                    <h4 className="font-semibold text-sm">Build Long-term Partnerships</h4>
                                                    <p className="text-xs text-blue-200 mt-0.5">Collaborate with top institutions</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mt-auto pt-6">
                                            <p className="font-serif text-xl italic transform -rotate-2 text-white/90">
                                                Partner with Academia<br/>for a Better Tomorrow
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className={`flex-1 w-full h-full lg:w-1/2 p-8 pb-10 md:pb-8 lg:p-12 flex flex-col relative overflow-y-auto slim-scrollbar transition-colors duration-700 ${themeStyles[globalTheme].cardBg}`}>
                                    <div className="flex justify-center items-center mb-6 mt-12 md:mt-4 lg:mt-0 w-full">
                                        <div className="flex flex-wrap justify-center p-1 bg-gray-100 rounded-lg w-fit mx-auto">
                                            {['Student', 'Faculty', 'TPO', 'Recruiter', 'Admin'].map((p) => (
                                                <button 
                                                    key={p}
                                                    type="button"
                                                    onClick={() => setPortal(p)}
                                                    className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all duration-300 ${
                                                        portal === p 
                                                            ? `${themeStyles[globalTheme].primaryBtn} text-white shadow-sm` 
                                                            : 'text-gray-500 hover:text-gray-700'
                                                    }`}
                                                >
                                                    {p}
                                                </button>
                                            ))}
                                            
                                        </div>
                                    </div>
                                    <Link to="/" className="absolute top-4 right-6 text-gray-500 hover:text-gray-800 flex items-center text-xs font-semibold px-3 py-1.5 rounded-full hover:bg-black/5 transition-colors">
                                        <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Back
                                    </Link>

                                    <div className="flex flex-col items-center mb-6">
                                        <div className={`w-12 h-12 ${themeStyles[globalTheme].iconBg} rounded-full flex items-center justify-center mb-2 ${themeStyles[globalTheme].iconColor}`}>
                                            <Building className="w-6 h-6" />
                                        </div>
                                        <h2 className={`${themeStyles[globalTheme].labelColor} text-2xl font-bold mb-1`}>Recruiter Login</h2>
                                        <h3 className="text-[#1e40af] text-sm font-semibold mb-1">Welcome to the recruiter portal</h3>
                                        <p className="text-gray-500 text-xs">Find skilled students and build your talent pool.</p>
                                    </div>

                                    <form onSubmit={handleSubmit} className="space-y-4 max-w-sm w-full mx-auto">
                                        {error && (
                                            <div className="w-fit mx-auto bg-red-50 border border-red-200 text-red-600 px-3 py-1.5 rounded-md text-[11px] text-center font-medium">
                                                {error}
                                            </div>
                                        )}
                                        {successMsg && (
                                            <div className={`\${themeStyles[globalTheme].iconBg} border border-blue-200 text-blue-600 px-3 py-1.5 rounded-md text-[11px] text-center font-medium mt-2`}>
                                                {successMsg}
                                            </div>
                                        )}

                                        <div>
                                            <label className={`block ${themeStyles[globalTheme].labelColor} text-xs font-semibold mb-1.5`}>Corporate Email</label>
                                            <div className={`relative flex items-center w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus-within:ring-2 ${themeStyles[globalTheme].ringColor} focus-within:border-transparent transition-colors`}>
                                                <Mail className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" />
                                                <input
                                                    type="email"
                                                    required
                                                    placeholder="Enter your corporate email"
                                                    className="w-full bg-transparent text-gray-900 focus:outline-none text-sm placeholder-gray-400 autofill-light"
                                                    value={email}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className={`block ${themeStyles[globalTheme].labelColor} text-xs font-semibold mb-1.5`}>Password</label>
                                            <div className={`relative flex items-center w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus-within:ring-2 ${themeStyles[globalTheme].ringColor} focus-within:border-transparent transition-colors`}>
                                                <Lock className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" />
                                                <input
                                                    type={showPassword ? "text" : "password"}
                                                    required
                                                    placeholder="Enter your password"
                                                    className="w-full bg-transparent text-gray-900 focus:outline-none text-sm placeholder-gray-400 autofill-light"
                                                    value={password}
                                                    onChange={(e) => setPassword(e.target.value)}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    className="text-gray-400 hover:text-gray-600 focus:outline-none ml-2"
                                                >
                                                    {showPassword ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                                                </button>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between mt-1">
                                            <div className="flex items-center">
                                                <input
                                                    id="remember-me-emp"
                                                    type="checkbox"
                                                    className={`h-3.5 w-3.5 ${themeStyles[globalTheme].iconColor} ${themeStyles[globalTheme].ringColor} border-gray-300 rounded cursor-pointer`}
                                                />
                                                <label htmlFor="remember-me-emp" className="ml-1.5 block text-xs text-gray-600 cursor-pointer">
                                                    Remember Me
                                                </label>
                                            </div>
                                            <Link to="/forgot-password" className={`text-xs font-semibold ${themeStyles[globalTheme].iconColor} hover:text-[#1d4ed8] transition-colors`}>Forgot Password?</Link>
                                        </div>

                                        
                                            {otpSent && timeLeft > 0 && (
                                                <div className="mt-5 animate-in fade-in slide-in-from-top-2 duration-300">
                                                    <label className="block text-gray-600 text-xs font-semibold mb-2 text-center uppercase tracking-wider">Enter 6-Digit OTP</label>
                                                    <div className="flex justify-between items-center gap-2 mb-2">
                                                        {otp.map((data, index) => (
                                                            <input
                                                                key={index}
                                                                type="text"
                                                                name="otp"
                                                                maxLength="1"
                                                                className={`w-10 h-12 text-center text-lg font-bold text-gray-800 bg-white/80 border border-gray-300 rounded-lg focus:bg-white focus:ring-2 ${themeStyles[globalTheme].ringColor}  transition-all outline-none shadow-sm`}
                                                                value={data}
                                                                onChange={e => handleOtpChange(e.target, index)}
                                                                onKeyDown={e => handleOtpKeyDown(e, index)}
                                                                onFocus={e => e.target.select()}
                                                            />
                                                        ))}
                                                    </div>
                                                    <div className="flex justify-center items-center mt-3 mb-2">
                                                        <span className={`text-xs font-semibold px-3 py-1 rounded-full ${timeLeft > 0 ? 'bg-orange-100 text-orange-600 border border-orange-200' : 'bg-red-100 text-red-600 border border-red-200'}`}>
                                                            {timeLeft > 0 ? `Valid for 00:${timeLeft.toString().padStart(2, '0')}` : 'OTP Expired'}
                                                        </span>
                                                    </div>
                                                </div>
                                            )}

                                        <div className="mt-4 flex justify-center w-full"><Turnstile siteKey={TURNSTILE_SITE_KEY} onSuccess={(token) => setTurnstileToken(token)} /></div>
<button type="submit" disabled={isVerifying || loginSuccess}
                                            className={`w-full flex items-center justify-center font-semibold py-2.5 rounded-lg transition-all duration-300 mt-4 text-xs shadow-md ${
                                                loginSuccess 
                                                ? 'bg-green-500 text-white shadow-green-500/40 cursor-default' 
                                                : isVerifying
                                                ? 'bg-[#1d4ed8] text-white cursor-wait opacity-90'
                                                : `${themeStyles[globalTheme].primaryBtn} text-white shadow-blue-500/30`
                                            }`}
                                        >
                                            {loginSuccess ? (
                                                <><CheckCircle2 className="w-4 h-4 mr-2" /> Login Successful!</>
                                            ) : isVerifying ? (
                                                <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Verifying...</>
                                            ) : otpSent ? (
                                                timeLeft > 0 ? 'Verify & Login' : 'Resend OTP'
                                            ) : (
                                                <>Send OTP <ArrowRight className="w-3.5 h-3.5 ml-1.5" /></>
                                            )}
                                        </button>
</form>

                                    <div className="max-w-sm w-full mx-auto mt-4">
                                        <div className="flex items-center mb-4">
                                            <div className="flex-1 border-t border-gray-200"></div>
                                            <span className="px-3 text-[10px] font-semibold text-gray-400">OR LOGIN WITH</span>
                                            <div className="flex-1 border-t border-gray-200"></div>
                                        </div>

                                        <div className="flex space-x-3 mb-4">
                                            <button onClick={() => handleGithubLogin(portal.toLowerCase())} type="button"  className="flex-1 flex items-center justify-center bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 py-2.5 rounded-lg transition-colors shadow-sm">
                                                <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M12 0C5.37 0 0 5.37 0 12C0 17.3 3.438 21.8 8.205 23.385C8.805 23.495 9.025 23.125 9.025 22.82C9.025 22.54 9.015 21.58 9.01 20.485C5.67 21.21 4.965 19.04 4.965 19.04C4.42 17.655 3.635 17.28 3.635 17.28C2.55 16.535 3.715 16.55 3.715 16.55C4.915 16.635 5.545 17.785 5.545 17.785C6.61 19.61 8.335 19.085 9.055 18.78C9.165 17.96 9.495 17.435 9.86 17.135C7.195 16.835 4.395 15.805 4.395 11.225C4.395 9.92 4.86 8.85 5.615 8.01C5.495 7.705 5.085 6.495 5.735 4.85C5.735 4.85 6.73 4.53 9.025 6.085C9.975 5.82 10.99 5.69 12 5.685C13.01 5.69 14.025 5.82 14.975 6.085C17.27 4.53 18.265 4.85 18.265 4.85C18.915 6.495 18.505 7.705 18.385 8.01C19.14 8.85 19.6 9.92 19.6 11.225C19.6 15.82 16.795 16.83 14.12 17.125C14.58 17.525 15 18.31 15 19.535C15 21.285 14.985 22.695 14.985 22.82C14.985 23.13 15.205 23.505 15.815 23.385C20.565 21.795 24 17.3 24 12C24 5.37 18.63 0 12 0Z"/></svg>
<span className="text-xs font-semibold">GITHUB</span>
                                            </button>
                                            <button type="button" onClick={() => handleGoogleLogin()} className="flex-1 flex items-center justify-center bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 py-2.5 rounded-lg transition-colors shadow-sm">
                                                <svg className="w-3.5 h-3.5 mr-2" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                                                <span className="text-xs font-semibold">GOOGLE</span>
                                            </button>
                                        </div>

                                        <Link to="/register" state={{ role: "recruiter" }} className="mt-4 bg-[#f0f4f8] hover:${themeStyles[globalTheme].iconBg} hover:shadow-md hover:-translate-y-0.5 hover:border-blue-300 transition-all duration-300 rounded-xl p-3 flex items-center border border-blue-100 block group">
                                            <div className={`w-8 h-8 rounded-full ${themeStyles[globalTheme].iconBg} flex flex-shrink-0 items-center justify-center ${themeStyles[globalTheme].iconColor} group-hover:${themeStyles[globalTheme].primaryBtn} group-hover:text-white transition-colors mr-3`}>
                                                <UserPlus className="w-4 h-4" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] text-gray-500 mb-0.5 font-medium">Don't have an account?</p>
                                                <div className={`text-xs font-semibold ${themeStyles[globalTheme].iconColor} underline flex items-center group-hover:text-[#1d4ed8] transition-colors`}>
                                                    Register Your Company <ArrowRight className="w-3 h-3 ml-1 transform group-hover:translate-x-1 transition-transform" />
                                                </div>
                                            </div>
                                        </Link>
                                            {/* Technical Support Link */}
                                            <div className="text-center mt-3 pt-3 border-t border-gray-100">
                                                <p className="text-[11px] font-medium text-gray-500">
                                                    Need assistance? <button type="button" onClick={() => setShowSupport(true)} className={`font-bold hover:underline transition-colors cursor-pointer ${themeStyles[globalTheme].iconColor}`}>Contact Technical Support</button>
                                                </p>
                                            </div>

                                        <div className="mt-5 flex justify-center space-x-6">
                                            <div className="flex items-center">
                                                <ShieldCheck className="w-6 h-6 text-teal-600 mr-1.5 opacity-80" strokeWidth={1.5} />
                                                <div>
                                                    <p className={`text-[10px] font-semibold ${themeStyles[globalTheme].labelColor} leading-tight`}>Verified Companies</p>
                                                    <p className="text-[9px] text-gray-500 leading-tight">Authentic & Trusted</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center">
                                                <Lock className="w-6 h-6 text-teal-600 mr-1.5 opacity-80" strokeWidth={1.5} />
                                                <div>
                                                    <p className={`text-[10px] font-semibold ${themeStyles[globalTheme].labelColor} leading-tight`}>Secure Access</p>
                                                    <p className="text-[9px] text-gray-500 leading-tight">Your data is safe with us</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </>
                        ) : portal === 'TPO' ? (
                            <>
                                {/* TPO Layout */}
                                <div className="hidden lg:flex lg:w-1/2 relative min-h-[300px] lg:min-h-full">
                                    <div className="absolute inset-0 bg-blue-600 mix-blend-multiply opacity-20 z-10"></div>
                                    
                                    {/* CAREERSYNC BRAND TAG */}
                                    <div className="absolute top-2 left-8 z-50 flex items-center">
                                        <div className="w-8 h-8 bg-white/20 backdrop-blur-md rounded-lg flex items-center justify-center mr-2">
                                            <span className="text-white font-bold text-lg">C</span>
                                        </div>
                                        <span className="font-bold tracking-widest text-sm drop-shadow-md flex items-center">
                                            <span className="text-white">CAREER</span>
                                            <span className={`bg-white ${themeStyles[globalTheme].labelColor} px-1.5 py-0.5 rounded-sm leading-none ml-0.5 shadow-sm`}>SYNC</span>
                                        </span>
                                    </div>

                                    {slides.map((slide, index) => (
                                        <img
                                            key={index}
                                            src={slide}
                                            alt={`Slide ${index + 1}`}
                                            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${
                                                index === currentSlide ? 'opacity-100' : 'opacity-0'
                                            }`}
                                        />
                                    ))}
                                    <div className="absolute inset-0 bg-gradient-to-t from-blue-900/60 via-blue-900/20 to-transparent z-20"></div>
                                    <div className="absolute bottom-0 left-0 p-10 text-white z-30">
                                        <h2 className="text-xl font-bold mb-3 leading-tight">Bridge the Gap Between<br/>Campus and Industry</h2>
                                        <p className="text-blue-100 text-sm max-w-md mb-6 leading-relaxed">
                                            Join thousands of top companies and institutions transforming the way early-career talent is discovered and hired.
                                        </p>
                                        <p className="text-blue-300 text-sm font-semibold">💎 The CareerSync Network</p>
                                    </div>
                                </div>

                                <div className={`flex-1 w-full h-full lg:w-1/2 p-8 pb-10 md:pb-8 lg:p-12 flex flex-col relative overflow-y-auto slim-scrollbar transition-colors duration-700 ${themeStyles[globalTheme].cardBg}`}>
                                    
                                    <Link to="/" className="absolute top-4 right-6 text-gray-400 hover:text-gray-800 flex items-center text-xs font-semibold px-3 py-1.5 rounded-full hover:bg-black/5 transition-colors">
                                        <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Back
                                    </Link>

                                    <div className="mt-8 lg:mt-6 mb-6">
                                        <div className="flex flex-wrap justify-center p-1 bg-gray-100 rounded-lg w-fit mx-auto">
                                            {['Student', 'Faculty', 'TPO', 'Recruiter', 'Admin'].map((p) => (
                                                <button 
                                                    key={p}
                                                    type="button"
                                                    onClick={() => setPortal(p)}
                                                    className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all duration-300 ${
                                                        portal === p 
                                                            ? `${themeStyles[globalTheme].primaryBtn} text-white shadow-sm` 
                                                            : 'text-gray-500 hover:text-gray-700'
                                                    }`}
                                                >
                                                    {p}
                                                </button>
                                            ))}
                                            
                                        </div>
                                    </div>

                                    <div className="flex flex-col items-center lg:items-start mb-6">
                                        <div className={`w-12 h-12 ${themeStyles[globalTheme].iconBg} rounded-full flex items-center justify-center mb-3 ${themeStyles[globalTheme].iconColor}`}>
                                            <Building className="w-6 h-6" />
                                        </div>
                                        <h2 className={`${themeStyles[globalTheme].labelColor} text-2xl font-bold mb-1`}>TPO Login</h2>
                                        <p className="text-gray-500 text-xs">Login to your account to continue</p>
                                    </div>

                                    <form onSubmit={handleSubmit} className="space-y-4">
                                        {error && (
                                            <div className="w-fit mx-auto bg-red-50 border border-red-200 text-red-600 px-3 py-1.5 rounded-md text-[11px] text-center font-medium">
                                                {error}
                                            </div>
                                        )}
                                        {successMsg && (
                                            <div className={`\${themeStyles[globalTheme].iconBg} border border-blue-200 text-blue-600 px-3 py-1.5 rounded-md text-[11px] text-center font-medium mt-2`}>
                                                {successMsg}
                                            </div>
                                        )}

                                        <div>
                                            <div className="flex justify-between items-center mb-1.5">
                                                <label className="block text-gray-700 text-sm font-medium">Official Email / TPO ID</label>
                                            </div>
                                            <input
                                                type="text"
                                                required
                                                className={`w-full px-4 py-2.5 bg-[#f0f4f8] border-transparent text-gray-900 rounded-lg focus:outline-none focus:ring-2 ${themeStyles[globalTheme].ringColor} focus:bg-white transition-colors text-sm placeholder-gray-400`}
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                            />
                                        </div>

                                        <div>
                                            <div className="flex justify-between items-center mb-1.5">
                                                <label className="block text-gray-700 text-sm font-medium">Institution Code</label>
                                            </div>
                                            <input
                                                type="text"
                                                required
                                                placeholder="e.g. INST-2023"
                                                className={`w-full px-4 py-2.5 bg-[#f0f4f8] border-transparent text-gray-900 rounded-lg focus:outline-none focus:ring-2 ${themeStyles[globalTheme].ringColor} focus:bg-white transition-colors text-sm placeholder-gray-400`}
                                                value={institutionCode}
                                                onChange={(e) => setInstitutionCode(e.target.value)}
                                            />
                                        </div>

                                        <div>
                                            <div className="flex justify-between items-center mb-1.5">
                                                <label className="block text-gray-700 text-sm font-medium">Password</label>
                                                <Link to="/forgot-password" className={`text-xs font-semibold ${themeStyles[globalTheme].iconColor} hover:text-[#1d4ed8] transition-colors`}>Forgot Password?</Link>
                                            </div>
                                            <div className={`relative flex items-center justify-between w-full px-4 py-2.5 bg-[#f0f4f8] border-transparent rounded-lg focus-within:ring-2 ${themeStyles[globalTheme].ringColor} focus-within:bg-white transition-colors`}>
                                                <input
                                                    type={showPassword ? "text" : "password"}
                                                    required
                                                    className="w-full bg-transparent text-gray-900 focus:outline-none text-sm placeholder-gray-400 autofill-light"
                                                    value={password}
                                                    onChange={(e) => setPassword(e.target.value)}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    className="text-gray-400 hover:text-gray-600 focus:outline-none ml-2"
                                                >
                                                    {showPassword ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                                                </button>
                                            </div>
                                        </div>

                                        <div className="flex items-center">
                                            <input
                                                id="remember-me-inst"
                                                type="checkbox"
                                                className={`h-4 w-4 ${themeStyles[globalTheme].iconColor} ${themeStyles[globalTheme].ringColor} border-gray-300 rounded cursor-pointer`}
                                            />
                                            <label htmlFor="remember-me-inst" className="ml-2 block text-sm text-gray-700 cursor-pointer">
                                                Remember me
                                            </label>
                                        </div>

                                        
                                            {otpSent && timeLeft > 0 && (
                                                <div className="mt-5 animate-in fade-in slide-in-from-top-2 duration-300">
                                                    <label className="block text-gray-600 text-xs font-semibold mb-2 text-center uppercase tracking-wider">Enter 6-Digit OTP</label>
                                                    <div className="flex justify-between items-center gap-2 mb-2">
                                                        {otp.map((data, index) => (
                                                            <input
                                                                key={index}
                                                                type="text"
                                                                name="otp"
                                                                maxLength="1"
                                                                className={`w-10 h-12 text-center text-lg font-bold text-gray-800 bg-white/80 border border-gray-300 rounded-lg focus:bg-white focus:ring-2 ${themeStyles[globalTheme].ringColor}  transition-all outline-none shadow-sm`}
                                                                value={data}
                                                                onChange={e => handleOtpChange(e.target, index)}
                                                                onKeyDown={e => handleOtpKeyDown(e, index)}
                                                                onFocus={e => e.target.select()}
                                                            />
                                                        ))}
                                                    </div>
                                                    <div className="flex justify-center items-center mt-3 mb-2">
                                                        <span className={`text-xs font-semibold px-3 py-1 rounded-full ${timeLeft > 0 ? 'bg-orange-100 text-orange-600 border border-orange-200' : 'bg-red-100 text-red-600 border border-red-200'}`}>
                                                            {timeLeft > 0 ? `Valid for 00:${timeLeft.toString().padStart(2, '0')}` : 'OTP Expired'}
                                                        </span>
                                                    </div>
                                                </div>
                                            )}

                                        <div className="mt-4 flex justify-center w-full"><Turnstile siteKey={TURNSTILE_SITE_KEY} onSuccess={(token) => setTurnstileToken(token)} /></div>
<button type="submit" disabled={isVerifying || loginSuccess}
                                            className={`w-full md:w-[85%] mx-auto flex items-center justify-center font-semibold py-2.5 md:py-2 rounded-lg transition-all duration-300 mt-4 text-xs shadow-md ${
                                                loginSuccess 
                                                ? 'bg-green-500 text-white shadow-green-500/40 cursor-default' 
                                                : isVerifying
                                                ? 'bg-[#1d4ed8] text-white cursor-wait opacity-90'
                                                : `${themeStyles[globalTheme].primaryBtn} text-white shadow-blue-500/30`
                                            }`}
                                        >
                                            {loginSuccess ? (
                                                <><CheckCircle2 className="w-4 h-4 mr-2" /> Login Successful!</>
                                            ) : isVerifying ? (
                                                <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Verifying...</>
                                            ) : otpSent ? (
                                                timeLeft > 0 ? 'Verify & Login' : 'Resend OTP'
                                            ) : (
                                                <>Send OTP <ArrowRight className="w-4 h-4 ml-2" /></>
                                            )}
                                        </button>
</form>

                                    <div className="flex items-center my-4">
                                            <div className="flex-1 border-t border-gray-200"></div>
                                            <span className="px-3 text-[10px] font-semibold text-gray-400">OR LOGIN WITH</span>
                                            <div className="flex-1 border-t border-gray-200"></div>
                                        </div>

                                        <div className="flex space-x-3 mb-4">
                                            <button onClick={() => handleGithubLogin(portal.toLowerCase())} type="button"  className="flex-1 flex items-center justify-center bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 py-2.5 rounded-lg transition-colors shadow-sm">
                                                <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M12 0C5.37 0 0 5.37 0 12C0 17.3 3.438 21.8 8.205 23.385C8.805 23.495 9.025 23.125 9.025 22.82C9.025 22.54 9.015 21.58 9.01 20.485C5.67 21.21 4.965 19.04 4.965 19.04C4.42 17.655 3.635 17.28 3.635 17.28C2.55 16.535 3.715 16.55 3.715 16.55C4.915 16.635 5.545 17.785 5.545 17.785C6.61 19.61 8.335 19.085 9.055 18.78C9.165 17.96 9.495 17.435 9.86 17.135C7.195 16.835 4.395 15.805 4.395 11.225C4.395 9.92 4.86 8.85 5.615 8.01C5.495 7.705 5.085 6.495 5.735 4.85C5.735 4.85 6.73 4.53 9.025 6.085C9.975 5.82 10.99 5.69 12 5.685C13.01 5.69 14.025 5.82 14.975 6.085C17.27 4.53 18.265 4.85 18.265 4.85C18.915 6.495 18.505 7.705 18.385 8.01C19.14 8.85 19.6 9.92 19.6 11.225C19.6 15.82 16.795 16.83 14.12 17.125C14.58 17.525 15 18.31 15 19.535C15 21.285 14.985 22.695 14.985 22.82C14.985 23.13 15.205 23.505 15.815 23.385C20.565 21.795 24 17.3 24 12C24 5.37 18.63 0 12 0Z"/></svg>
<span className="text-xs font-semibold">GITHUB</span>
                                            </button>
                                            <button type="button" onClick={() => handleGoogleLogin()} className="flex-1 flex items-center justify-center bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 py-2.5 rounded-lg transition-colors shadow-sm">
                                                <svg className="w-3.5 h-3.5 mr-2" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                                                <span className="text-xs font-semibold">GOOGLE</span>
                                            </button>
                                        </div>

                                        <div className="flex items-center justify-center space-x-2">
                                            <p className="text-gray-500 text-xs">Don't have an account?</p>
                                            <Link to="/register" state={{ role: "tpo" }} className={`${themeStyles[globalTheme].iconColor} hover:text-[#1d4ed8] underline text-xs font-semibold transition-all`}>
                                                Create new account
                                            </Link>
                                        </div>
                                            {/* Technical Support Link */}
                                            <div className="text-center mt-3 pt-3 border-t border-gray-100">
                                                <p className="text-[11px] font-medium text-gray-500">
                                                    Need assistance? <button type="button" onClick={() => setShowSupport(true)} className={`font-bold hover:underline transition-colors cursor-pointer ${themeStyles[globalTheme].iconColor}`}>Contact Technical Support</button>
                                                </p>
                                            </div>
                                            <div className="h-24 md:hidden w-full shrink-0"></div>
                                </div>
                            </>
                        ) : (
                            <>
                                {/* ADMIN Layout */}
                                <div className="hidden lg:flex lg:w-1/2 flex-col relative bg-white md:bg-[#050505] overflow-hidden items-center justify-center p-14">
                                    <div className="absolute inset-0 bg-gradient-to-r from-red-900/30 via-black/40 to-[#050505]/60 z-10"></div>
                                    
                                    <div className="absolute top-1/4 left-1/4 w-[300px] h-[300px] bg-red-600/20 rounded-full blur-[100px] pointer-events-none z-10" />
                                    {/* CAREERSYNC BRAND TAG */}
                                    <div className="absolute top-2 left-8 z-50 flex items-center">
                                        <div className="w-8 h-8 bg-white/10 backdrop-blur-md rounded-lg flex items-center justify-center mr-2 border border-white/5 shadow-[0_0_15px_rgba(220,38,38,0.2)]">
                                            <span className="text-white font-bold text-lg">C</span>
                                        </div>
                                        <span className="font-bold tracking-widest text-sm drop-shadow-md flex items-center">
                                            <span className="text-white">CAREER</span>
                                            <span className="bg-red-600 text-white px-1.5 py-0.5 rounded-sm leading-none ml-0.5 shadow-sm">SYNC</span>
                                        </span>
                                    </div>
                                    
                                    <div className="relative z-20 w-full text-center">
                                        <div className="w-20 h-20 bg-gradient-to-br from-red-600 to-red-900 rounded-2xl flex items-center justify-center mb-6 mx-auto shadow-[0_0_30px_rgba(220,38,38,0.3)] border border-red-500/30">
                                            <ShieldCheck className="w-10 h-10 text-white" />
                                        </div>
                                        <h1 className="text-4xl font-bold mb-3 leading-tight text-white drop-shadow-md tracking-tight">System Control<br/>Center</h1>
                                        <p className="text-gray-400 text-sm font-medium mb-3">Authorized Personnel Only</p>
                                        <p className="text-red-300/70 text-sm max-w-xs mx-auto leading-relaxed italic font-light tracking-wide">
                                            "Maintaining the integrity, security, and performance of the CareerSync network."
                                        </p>
                                    </div>
                                </div>

                                <div className="flex-1 w-full h-full lg:w-1/2 p-8 pb-10 md:pb-8 lg:p-12 bg-white md:bg-[#050505] flex flex-col relative overflow-y-auto slim-scrollbar">
                                    <Link to="/" className="absolute top-4 right-6 text-gray-400 hover:text-white flex items-center text-xs font-semibold px-3 py-1.5 rounded-full hover:bg-white/5 transition-colors z-50">
                                        <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Back
                                    </Link>
                                    <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-red-700/10 rounded-full blur-[120px] pointer-events-none" />
                                    
                                    <div className="flex justify-center items-center mb-6 mt-12 md:mt-4 lg:mt-0 relative z-20 w-full">
                                        <div className="flex flex-wrap justify-center p-1 bg-gray-100 md:bg-[#121212] rounded-lg w-fit border border-gray-200 md:border-gray-800 mx-auto">
                                            {['Student', 'Faculty', 'TPO', 'Recruiter', 'Admin'].map((p) => (
                                                <button 
                                                    key={p}
                                                    type="button"
                                                    onClick={() => setPortal(p)}
                                                    className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all duration-300 ${
                                                        portal === p 
                                                            ? 'bg-red-900/50 text-red-200 border border-red-500/30 shadow-[0_0_10px_rgba(220,38,38,0.2)]' 
                                                            : 'text-gray-500 hover:text-gray-300'
                                                    }`}
                                                >
                                                    {p}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="flex-1 flex flex-col justify-center max-w-sm w-full mx-auto relative z-20">
                                        <div className="flex flex-col items-center lg:items-start mb-6">
                                            <div className="w-12 h-12 bg-red-950/50 rounded-full flex items-center justify-center mb-3 text-red-500 border border-red-900/50">
                                                <ShieldCheck className="w-6 h-6" />
                                            </div>
                                            <h2 className="text-gray-900 md:text-white text-2xl font-bold mb-1 tracking-tight">Admin Login</h2>
                                            <p className="text-gray-500 text-xs">Enter your master credentials</p>
                                        </div>

                                        <form onSubmit={handleSubmit} className="space-y-4">
                                            {error && (
                                                <div className="w-fit mx-auto bg-red-50 md:bg-red-950/50 border border-red-200 md:border-red-500/50 text-red-600 md:text-red-200 px-3 py-1.5 rounded-md text-[11px] text-center font-medium">
                                                    {error}
                                                </div>
                                            )}
                                            {successMsg && (
                                                <div className="bg-blue-50 md:bg-blue-950/50 border border-blue-200 md:border-blue-500/50 text-blue-600 md:text-blue-200 px-3 py-1.5 rounded-md text-[11px] text-center font-medium mt-2">
                                                    {successMsg}
                                                </div>
                                            )}

                                            <div>
                                                <label className="block text-gray-500 md:text-gray-400 text-xs font-semibold mb-1.5">Master Email</label>
                                                <div className="relative flex items-center w-full px-3 py-2 bg-white md:bg-[#0a0a0a] border border-gray-300 md:border-gray-800 rounded-lg focus-within:ring-1 focus-within:ring-red-500/70 focus-within:border-red-500/70 transition-all">
                                                    <Mail className="w-4 h-4 text-gray-400 md:text-gray-600 mr-2 flex-shrink-0" />
                                                    <input
                                                        type="email"
                                                        required
                                                        placeholder="admin@careersync.com"
                                                        className="w-full bg-transparent text-gray-900 md:text-white focus:outline-none text-sm placeholder-gray-500 md:placeholder-gray-400 autofill-admin"
                                                        value={email}
                                                        onChange={(e) => setEmail(e.target.value)}
                                                    />
                                                </div>
                                            </div>

                                            <div>
                                                <div className="flex justify-between items-center mb-1.5">
                                                    <label className="block text-gray-500 md:text-gray-400 text-xs font-semibold">Master Password</label>
                                                    <Link to="/forgot-password" className="text-xs font-semibold text-red-500 hover:text-red-400 transition-colors">Forgot Password?</Link>
                                                </div>
                                                <div className="relative flex items-center justify-between w-full px-3 py-2 bg-white md:bg-[#0a0a0a] border border-gray-300 md:border-gray-800 rounded-lg focus-within:ring-1 focus-within:ring-red-500/70 focus-within:border-red-500/70 transition-all">
                                                    <div className="flex items-center flex-1">
                                                        <Lock className="w-4 h-4 text-gray-400 md:text-gray-600 mr-2 flex-shrink-0" />
                                                        <input
                                                            type={showPassword ? "text" : "password"}
                                                            required
                                                            placeholder="Enter master password"
                                                            className="w-full bg-transparent text-gray-900 md:text-white focus:outline-none text-sm placeholder-gray-500 md:placeholder-gray-400 autofill-admin"
                                                            value={password}
                                                            onChange={(e) => setPassword(e.target.value)}
                                                        />
                                                    </div>
                                                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-gray-600 hover:text-gray-400 focus:outline-none ml-2">
                                                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                                    </button>
                                                </div>
                                            </div>
                                            {otpSent && (
                                                <div className="animate-fade-in-up mt-4">
                                                    <div className="flex justify-between items-center mb-1.5">
                                                        <label className="block text-gray-400 text-[11px] font-bold uppercase tracking-wider">Authentication Code</label>
                                                        <span className="text-[10px] text-red-500 font-mono">{Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}</span>
                                                    </div>
                                                    <div className="flex justify-between space-x-2">
                                                        {otp.map((digit, index) => (
                                                            <input
                                                                key={index}
                                                                id={`admin-otp-${index}`}
                                                                type="text"
                                                                maxLength="1"
                                                                value={digit}
                                                                onChange={(e) => handleOtpChange(e.target, index)}
                                                                onKeyDown={(e) => handleOtpKeyDown(e, index)}
                                                                className={`w-10 h-10 text-center bg-[#0a0a0a] border text-white font-bold rounded-md focus:ring-1 transition-all outline-none ${
                                                                    digit !== '' 
                                                                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                                                                    : 'border-white/30 hover:border-white/50 focus:border-white focus:ring-white'
                                                                }`}
                                                            />
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            <div className="mt-4 flex justify-center w-full"><Turnstile siteKey={TURNSTILE_SITE_KEY} onSuccess={(token) => setTurnstileToken(token)} /></div>
<button type="submit" disabled={isVerifying || loginSuccess}
                                                  className={`w-full flex items-center justify-center font-semibold py-2.5 rounded-lg transition-all duration-300 mt-6 text-xs shadow-[0_0_15px_rgba(220,38,38,0.2)] ${
                                                      loginSuccess 
                                                      ? 'bg-green-500 text-white cursor-default' 
                                                      : isVerifying
                                                      ? 'bg-red-800 text-white cursor-wait opacity-90'
                                                      : 'bg-red-600 hover:bg-red-700 text-white'
                                                  }`}
                                              >
                                                  {loginSuccess ? (
                                                      <><CheckCircle2 className="w-3.5 h-3.5 mr-2" /> Login Successful!</>
                                                  ) : isVerifying ? (
                                                      <><Loader2 className="w-3.5 h-3.5 mr-2 animate-spin" /> Verifying...</>
                                                  ) : otpSent ? (
                                                      timeLeft > 0 ? 'Verify & Login' : 'Resend OTP'
                                                  ) : (
                                                      <>Authenticate <ArrowRight className="w-3.5 h-3.5 ml-1.5" /></>
                                                  )}
                                              </button>
<div className="h-40 md:hidden w-full shrink-0 flex items-center justify-center text-[10px] text-gray-500/50 uppercase tracking-widest pt-4">⬇ Scroll up if needed ⬇</div>
</form>
                                    </div>
                                </div>
                            </>
                        )}
                    </motion.div>
                </AnimatePresence>
            </motion.div>
            
            {/* Invisible spacer to perfectly preserve the original vertical alignment of the card */}
            <div className="mt-3 text-center z-20 h-[18px]"></div>
            


            

            
            {/* Custom Interactive Dev OTP Toast */}
            <AnimatePresence>
                {devOtp && (
                    <motion.div
                        initial={{ opacity: 0, x: 50, scale: 0.9 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9, y: -20 }}
                        className="fixed top-8 right-8 z-[100] bg-white/95 backdrop-blur-md border border-gray-200 shadow-[0_8px_30px_rgb(0,0,0,0.12)] rounded-lg p-2.5 min-w-[140px] flex flex-col items-center gap-0.5 cursor-pointer hover:shadow-[0_8px_30px_rgb(0,0,0,0.2)] hover:-translate-y-1 active:scale-95 transition-all duration-300 group"
                        onClick={() => {
                            navigator.clipboard.writeText(devOtp);
                            setSuccessMsg('OTP copied to clipboard!');
                            setDevOtp('');
                        }}
                    >
                        <button onClick={(e) => { e.stopPropagation(); setDevOtp(''); }} className="absolute top-1.5 right-1.5 text-gray-400 hover:text-gray-800 transition-colors bg-gray-50 hover:bg-gray-100 rounded-full p-0.5">
                            <X className="w-3 h-3" />
                        </button>
                        <div className="text-blue-600 text-[9px] font-extrabold tracking-[0.2em] uppercase mt-0.5 group-hover:text-blue-700 transition-colors">Your OTP Code</div>
                        <div className="text-center tracking-[0.25em] font-mono text-lg font-black text-gray-800 group-hover:text-black transition-colors">
                            {devOtp}
                        </div>

                    </motion.div>
                )}
            </AnimatePresence>
        </div>

    );
};

export default Login;















