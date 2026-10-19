import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { GraduationCap, Menu, X, ChevronDown, Eye } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import NavShowcaseModal from './NavShowcaseModal';
import { navCardsData } from '../data/navCardsData';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const [scrolled, setScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [mobileExpandedItem, setMobileExpandedItem] = useState(null);
    const [navTheme, setNavTheme] = useState('indigo');
    const [isSliderPaused, setIsSliderPaused] = useState(false);
    const [activeShowcaseCard, setActiveShowcaseCard] = useState(null);

    const handleItemClick = (e, detail) => {
        if (detail.cardId && navCardsData[detail.cardId]) {
            e.preventDefault();
            setActiveShowcaseCard(navCardsData[detail.cardId]);
            setIsMobileMenuOpen(false);
        } else {
            setIsMobileMenuOpen(false);
        }
    };

    useEffect(() => {
        if (!isMobileMenuOpen) {
            setMobileExpandedItem(null);
        }
    }, [isMobileMenuOpen]);

    useEffect(() => {
        const handleSlideChange = (e) => {
            // Only cycle navbar colors if user is at the top of the page
            if (window.scrollY <= 20) {
                const themes = ['blue', 'indigo', 'orange'];
                setNavTheme(themes[e.detail.slide] || 'blue');
            }
        };

        // Initialize from localStorage
        const savedTheme = localStorage.getItem('globalTheme');
        if (savedTheme) {
            setNavTheme(savedTheme);
        }

        const handlePauseState = (e) => {
            if (e.detail && e.detail.isPaused !== undefined) {
                setIsSliderPaused(e.detail.isPaused);
            }
        };

        window.addEventListener('heroSlideChange', handleSlideChange);
        window.addEventListener('pageThemeChange', handlePauseState);
        
        return () => {
            window.removeEventListener('heroSlideChange', handleSlideChange);
            window.removeEventListener('pageThemeChange', handlePauseState);
        };
    }, []);

    useEffect(() => {
        // Handle scrolling state
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    const dynamicStyles = {
        blue: { bg: "from-white via-[#e6e9f0] to-[#d0d6e3]", shadow: "hover:shadow-slate-200", syncText: "text-[#020817]", loginBtn: "text-[#020817] border-[#020817]", loginHoverBg: "bg-[#020817]", signupBtn: "bg-[#020817] border-[#020817]", signupTextHover: "hover:text-[#020817]", linkHover: "hover:text-[#020817]", logoBg: "bg-[#020817]", logoBorder: "border-[#020817]", logoText: "text-white" },
        indigo: { bg: "from-white via-[#f5e6e1] to-[#e8d5ce]", shadow: "hover:shadow-amber-200", syncText: "text-[#431407]", loginBtn: "text-[#431407] border-[#431407]", loginHoverBg: "bg-[#431407]", signupBtn: "bg-[#431407] border-[#431407]", signupTextHover: "hover:text-[#431407]", linkHover: "hover:text-[#431407]", logoBg: "bg-[#431407]", logoBorder: "border-[#431407]", logoText: "text-white" },
        orange: { bg: "from-white via-[#e3ebf7] to-[#c6d7f0]", shadow: "hover:shadow-blue-200", syncText: "text-blue-800", loginBtn: "text-blue-800 border-blue-800", loginHoverBg: "bg-blue-800", signupBtn: "bg-blue-800 border-blue-800", signupTextHover: "hover:text-blue-800", linkHover: "hover:text-blue-800", logoBg: "bg-blue-800", logoBorder: "border-blue-800", logoText: "text-white" }
    };

    const themeClasses = {
        blue: "bg-slate-200/95 border-slate-300 shadow-sm",
        indigo: "bg-slate-200/95 border-slate-300 shadow-sm",
        orange: "bg-slate-200/95 border-slate-300 shadow-sm"
    };

    const currentTheme = (scrolled && !isSliderPaused) ? 'blue' : navTheme;

    const activeNavClass = scrolled 
        ? `${themeClasses[currentTheme]} backdrop-blur-md shadow-md border-b`
        : "bg-slate-200 shadow-sm border-b border-gray-200";

    const navItems = [
        {
            name: 'Home', href: '/',
            details: [
                { title: 'Overview', desc: 'Back to the main dashboard', link: '/' },
                { title: 'Platform Features', desc: 'See what CareerSync offers', cardId: 'home-features' },
                { title: 'Success Stories', desc: 'Read about our alumni', cardId: 'home-success' },
                { title: 'Testimonials', desc: 'What partners say about us', cardId: 'home-testimonials' }
            ]
        },
        {
            name: 'About', href: '/',
            details: [
                { title: 'Our Mission', desc: 'Learn about CareerSync', cardId: 'about-mission' },
                { title: 'Our Team', desc: 'Meet the creators behind the platform', cardId: 'about-team' },
                { title: 'Careers', desc: 'Join our growing team', link: '/jobs' },
                { title: 'Contact Us', desc: 'Get in touch with headquarters', link: '/support?type=helpdesk' }
            ]
        },
        {
            name: 'Students', href: '/register',
            details: [
                { title: 'Skill Analysis', desc: 'Find your skill gaps with AI', link: '/skill-gap' },
                { title: 'Build Profile', desc: 'Showcase your portfolio to employers', link: '/profile' },
                { title: 'Career Paths', desc: 'Explore tech and non-tech roles', link: '/jobs' },
                { title: 'Mock Interviews', desc: 'Practice with AI interviewers', cardId: 'student-mock-interviews' }
            ]
        },
        {
            name: 'Institutions', href: '/institution',
            details: [
                { title: 'TPO Dashboard', desc: 'Track comprehensive placement metrics', link: '/institution' },
                { title: 'Student Roster', desc: 'Manage your batches and departments', cardId: 'institution-roster' },
                { title: 'Placement Reports', desc: 'Generate real-time analytics', cardId: 'institution-reports' },
                { title: 'Alumni Network', desc: 'Connect with past graduates', cardId: 'institution-alumni' }
            ]
        },
        {
            name: 'Employers', href: '/employer',
            details: [
                { title: 'Post Opportunities', desc: 'Hire top campus talent quickly', link: '/employer' },
                { title: 'Talent Search', desc: 'Filter through verified students', cardId: 'employer-talent-search' },
                { title: 'Company Profile', desc: 'Manage your employer brand', link: '/employer' },
                { title: 'Hiring Analytics', desc: 'Track your hiring pipeline', cardId: 'employer-analytics' }
            ]
        },
        {
            name: 'Jobs', href: '/jobs',
            details: [
                { title: 'Job Board', desc: 'Browse all active full-time jobs', link: '/jobs' },
                { title: 'Internships', desc: 'Start your career with summer roles', link: '/jobs?type=internship' },
                { title: 'Saved Jobs', desc: 'View roles you bookmarked', link: '/jobs' },
                { title: 'Application History', desc: 'Track your submitted applications', link: '/jobs' }
            ]
        },
        {
            name: 'Mentorship', href: '/register',
            details: [
                { title: 'Find a Mentor', desc: 'Connect with industry experts', cardId: 'mentorship-find' },
                { title: 'Become a Mentor', desc: 'Guide the next generation of talent', cardId: 'mentorship-become' },
                { title: 'Mentorship Programs', desc: 'Join structured 6-week cohorts', cardId: 'mentorship-programs' },
                { title: 'Success Stories', desc: 'Read about successful mentor pairs', cardId: 'mentorship-success' }
            ]
        },
        {
            name: 'Events', href: '/jobs',
            details: [
                { title: 'Career Fairs', desc: 'Upcoming campus hiring drives', cardId: 'events-fairs' },
                { title: 'Workshops', desc: 'Skill-building technical sessions', cardId: 'events-workshops' },
                { title: 'Webinars', desc: 'Learn from industry thought leaders', cardId: 'events-webinars' },
                { title: 'Hackathons', desc: 'Compete and showcase your coding skills', cardId: 'events-hackathons' }
            ]
        },
        {
            name: 'Careers', href: '/jobs',
            details: [
                { title: 'Job Board', desc: 'Browse full-time & tech opportunities', link: '/jobs' },
                { title: 'Campus Drives', desc: 'Upcoming recruitment drives and notices', cardId: 'careers-drives' },
                { title: 'Internship Hub', desc: 'Paid summer & winter industrial roles', link: '/jobs?type=internship' },
                { title: 'Skill Roadmap', desc: 'AI-guided benchmark & skill analysis', link: '/skill-gap' }
            ]
        },
        {
            name: 'Contact', href: '/support',
            details: [
                { title: 'Support Helpdesk', desc: 'Get help with your account issues', link: '/support?type=helpdesk' },
                { title: 'Partnerships', desc: 'Collaborate and partner with us', link: '/support?type=partnerships' },
                { title: 'Sales Inquiries', desc: 'Talk to our enterprise sales team', link: '/support?type=sales' },
                { title: 'FAQ', desc: 'Frequently asked questions', link: '/support?type=faq' }
            ]
        }
    ];

    // Content-aware dynamic dropdown width mapping
    const getDropdownWidth = (name) => {
        switch (name) {
            case 'Events':
                return 'w-80';
            case 'Students':
            case 'Institutions':
            case 'Employers':
            case 'Mentorship':
            case 'Home':
            case 'About':
            case 'Careers':
                return 'w-72';
            default:
                return 'w-64';
        }
    };

    return (
        <>
            <div className="h-16 w-full shrink-0 md:hidden"></div>
            <motion.nav 
            initial={{ x: '-100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className={`fixed w-full top-0 z-50 transition-colors duration-500 ${activeNavClass}`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link to="/" className="flex items-center text-teal-600 mr-2 md:mr-8">
                            <motion.div 
                                animate={{ rotateY: 360 }}
                                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                                style={{ transformStyle: "preserve-3d" }}
                                className="w-8 h-8 relative mr-3"
                            >
                                {/* Front Face (Original) */}
                                <div 
                                    style={{ backfaceVisibility: "hidden" }}
                                    className={`absolute inset-0 ${dynamicStyles[currentTheme].logoBg} rounded-lg flex items-center justify-center border ${dynamicStyles[currentTheme].logoBorder} transition-colors duration-500`}
                                >
                                    <GraduationCap className={`w-5 h-5 ${dynamicStyles[currentTheme].logoText} transition-colors duration-500`} />
                                </div>
                                {/* Back Face (New Color) */}
                                <div 
                                    style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
                                    className={`absolute inset-0 ${dynamicStyles[currentTheme].logoBg} rounded-lg flex items-center justify-center border ${dynamicStyles[currentTheme].logoBorder} transition-colors duration-500`}
                                >
                                    <GraduationCap className={`w-5 h-5 ${dynamicStyles[currentTheme].logoText} transition-colors duration-500`} />
                                </div>
                            </motion.div>
                            <span className="font-bold text-xl tracking-tight">
                                <span className="text-slate-800">Career</span>
                                <span className={`${dynamicStyles[currentTheme].syncText} transition-colors duration-500`}>Sync</span>
                            </span>
                        </Link>
                        
                        {/* Public Navigation Links with Hover Dropdown Cards */}
                        <div className="hidden lg:flex space-x-1 border-l pl-6 border-gray-200">
                            {navItems.map((item) => (
                                <div key={item.name} className="group relative">
                                    <Link 
                                        to={item.href} 
                                        className={`text-gray-600 ${dynamicStyles[currentTheme].linkHover} transition-all duration-300 px-1.5 xl:px-2.5 py-2 rounded-md text-xs xl:text-sm font-medium transition-colors inline-flex items-center h-full whitespace-nowrap`}
                                    >
                                        {item.name}
                                    </Link>
                                    
                                    {/* Floating Dropdown Card with Content-Aware Width & Alignment */}
                                    <div className={`absolute ${item.name === 'Contact' || item.name === 'Careers' ? 'right-0' : 'left-0'} mt-0 ${getDropdownWidth(item.name)} pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:translate-y-1 group-hover:visible transition-all duration-200 z-50`}>
                                        <div className={`bg-gradient-to-r ${dynamicStyles[currentTheme].bg} rounded-xl shadow-xl border border-gray-100 p-2.5 overflow-hidden transition-colors duration-500`}>
                                            {item.details.map((detail, idx) => (
                                                <Link 
                                                    key={idx} 
                                                    to={detail.link || '#'}
                                                    onClick={(e) => handleItemClick(e, detail)}
                                                    className={`block p-2.5 rounded-lg hover:bg-white hover:shadow-lg ${dynamicStyles[currentTheme].shadow} transition-all duration-300 cursor-pointer mb-1 last:mb-0`}
                                                >
                                                    <div className="font-semibold text-gray-900 text-sm flex items-center justify-between gap-1.5">
                                                        <span className="truncate">{detail.title}</span>
                                                        {detail.cardId && (
                                                            <span className="text-[10px] font-bold text-blue-600 bg-blue-50 border border-blue-200/60 px-1.5 py-0.5 rounded-md flex items-center gap-1 shrink-0">
                                                                <Eye className="w-3 h-3 text-blue-600" />
                                                                View
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="text-xs text-gray-500 mt-0.5 truncate">{detail.desc}</div>
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="flex items-center space-x-4">
                        {user ? (
                            <>
                                {user.role === 'student' && (
                                    <>
                                        <Link to="/profile" className={`text-gray-700 ${dynamicStyles[currentTheme].linkHover} transition-all duration-300 px-3 py-2 rounded-md text-sm font-medium`}>Profile</Link>
                                        <Link to="/skill-gap" className={`text-gray-700 ${dynamicStyles[currentTheme].linkHover} transition-all duration-300 px-3 py-2 rounded-md text-sm font-medium`}>Skill Gap</Link>
                                        <Link to="/jobs" className={`text-gray-700 ${dynamicStyles[currentTheme].linkHover} transition-all duration-300 px-3 py-2 rounded-md text-sm font-medium`}>Opportunities</Link>
                                    </>
                                )}
                                {user.role === 'industry' && (
                                    <>
                                        <Link to="/employer" className={`text-gray-700 ${dynamicStyles[currentTheme].linkHover} transition-all duration-300 px-3 py-2 rounded-md text-sm font-medium`}>Dashboard</Link>
                                        <Link to="/jobs" className={`text-gray-700 ${dynamicStyles[currentTheme].linkHover} transition-all duration-300 px-3 py-2 rounded-md text-sm font-medium`}>All Postings</Link>
                                    </>
                                )}
                                {['faculty', 'tpo', 'admin'].includes(user.role) && (
                                    <>
                                        <Link to="/institution" className={`text-gray-700 ${dynamicStyles[currentTheme].linkHover} transition-all duration-300 px-3 py-2 rounded-md text-sm font-medium`}>Analytics Dashboard</Link>
                                        <Link to="/jobs" className={`text-gray-700 ${dynamicStyles[currentTheme].linkHover} transition-all duration-300 px-3 py-2 rounded-md text-sm font-medium`}>View Opportunities</Link>
                                    </>
                                )}
                                <span className="text-gray-500 text-sm hidden md:inline ml-4 border-l pl-4">
                                    {user.name} ({user.role})
                                </span>
                                <button
                                    onClick={handleLogout}
                                    className="ml-4 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    className={`group relative overflow-hidden px-2.5 py-1 md:px-4 md:py-1.5 text-xs md:text-sm font-normal bg-transparent border rounded-none md:rounded-md transition-all duration-500 hover:text-white ${dynamicStyles[currentTheme].loginBtn}`}
                                >
                                    <span className={`absolute inset-0 w-full h-full -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out z-0 ${dynamicStyles[currentTheme].loginHoverBg}`}></span>
                                    <span className="relative z-10 whitespace-nowrap">Log in</span>
                                </Link>
                                <Link
                                    to="/register"
                                    className={`ml-2 md:ml-3 group relative overflow-hidden px-2.5 py-1 md:px-4 md:py-1.5 text-xs md:text-sm font-normal text-white border rounded-none md:rounded-md transition-all duration-500 ${dynamicStyles[currentTheme].signupBtn} ${dynamicStyles[currentTheme].signupTextHover}`}
                                >
                                    <span className="absolute inset-0 w-full h-full bg-white -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out z-0"></span>
                                    <span className="relative z-10 whitespace-nowrap">Sign up</span>
                                </Link>
                            </>
                        )}
                        {/* Mobile Hamburger Icon */}
                        <button 
                            className="lg:hidden ml-2 md:ml-4 w-8 h-8 flex items-center justify-center text-gray-700 hover:text-black rounded-none md:rounded-md border border-gray-300 md:border-none md:w-auto md:h-auto hover:bg-black/5 transition"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        >
                            {isMobileMenuOpen ? <X className="w-5 h-5 md:w-6 md:h-6" /> : <Menu className="w-5 h-5 md:w-6 md:h-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Dropdown Menu for Android & Touch Devices */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.25 }}
                        className="lg:hidden border-t border-gray-200 bg-white shadow-2xl overflow-y-auto max-h-[calc(100dvh-4rem)] overscroll-contain"
                    >
                        <div className="px-4 py-3 divide-y divide-gray-100">
                            {navItems.map((item) => {
                                const isExpanded = mobileExpandedItem === item.name;
                                return (
                                    <div key={item.name} className="py-1">
                                        <button
                                            type="button"
                                            onClick={() => setMobileExpandedItem(prev => prev === item.name ? null : item.name)}
                                            className="w-full py-2.5 px-2 flex items-center justify-between text-left rounded-lg active:bg-slate-100 transition-colors"
                                        >
                                            <span className={`text-[15px] font-semibold transition-colors ${isExpanded ? 'text-blue-600' : 'text-slate-800'}`}>
                                                {item.name}
                                            </span>
                                            <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? 'rotate-180 text-blue-600' : 'text-slate-400'}`} />
                                        </button>

                                        <AnimatePresence>
                                            {isExpanded && (
                                                <motion.div
                                                    initial={{ opacity: 0, height: 0 }}
                                                    animate={{ opacity: 1, height: 'auto' }}
                                                    exit={{ opacity: 0, height: 0 }}
                                                    transition={{ duration: 0.2 }}
                                                    className="overflow-hidden pt-1 pb-2 space-y-1.5 pl-1 pr-1"
                                                >
                                                    {item.details.map((detail, idx) => (
                                                        <Link
                                                            key={idx}
                                                            to={detail.link || '#'}
                                                            onClick={(e) => {
                                                                handleItemClick(e, detail);
                                                                setMobileExpandedItem(null);
                                                            }}
                                                            className="block p-2.5 rounded-lg bg-slate-50/90 active:bg-blue-50/80 border border-slate-200/70 transition-all active:scale-[0.99] cursor-pointer"
                                                        >
                                                            <div className="flex items-center justify-between gap-1.5">
                                                                <span className="font-semibold text-slate-900 text-xs">
                                                                    {detail.title}
                                                                </span>
                                                                {detail.cardId ? (
                                                                    <span className="text-[10px] font-bold text-blue-600 bg-blue-50 border border-blue-200/60 px-1.5 py-0.5 rounded-md flex items-center gap-1 shrink-0">
                                                                        <Eye className="w-3 h-3 text-blue-600" />
                                                                        View
                                                                    </span>
                                                                ) : (
                                                                    <span className="text-[11px] font-bold text-slate-400">→</span>
                                                                )}
                                                            </div>
                                                            <div className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                                                                {detail.desc}
                                                            </div>
                                                        </Link>
                                                    ))}
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Mobile Auth Bottom Bar */}
                        <div className="p-4 bg-slate-50 border-t border-slate-200/80 mb-6">
                            {user ? (
                                <div className="flex items-center justify-between">
                                    <div className="text-xs">
                                        <div className="font-bold text-slate-800">{user.name}</div>
                                        <div className="text-slate-500 capitalize">{user.role}</div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={async () => {
                                            setIsMobileMenuOpen(false);
                                            await handleLogout();
                                        }}
                                        className="px-3 py-1.5 text-xs font-semibold text-red-600 bg-red-50 border border-red-200 rounded-md active:bg-red-100"
                                    >
                                        Logout
                                    </button>
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 gap-2">
                                    <Link
                                        to="/login"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="py-2 text-center text-xs font-semibold text-slate-800 bg-white border border-slate-300 rounded-md shadow-xs active:bg-slate-100"
                                    >
                                        Log in
                                    </Link>
                                    <Link
                                        to="/register"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="py-2 text-center text-xs font-semibold text-white bg-blue-600 rounded-md shadow-xs active:bg-blue-700"
                                    >
                                        Sign up
                                    </Link>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.nav>

        {/* Rectangular Long Card Showcase Modal for Navbar Details */}
        <NavShowcaseModal
            isOpen={Boolean(activeShowcaseCard)}
            onClose={() => setActiveShowcaseCard(null)}
            cardData={activeShowcaseCard}
        />
        </>
    );
};

export default Navbar;














