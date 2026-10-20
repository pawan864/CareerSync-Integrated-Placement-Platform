/**
 * CareerSync Capstone Project
 * 
 * @module Frontend/Home
 * @description Landing page showcasing the platform's value proposition for students, institutions, and employers.
 */
/**
 * Landing Page Component (Home.jsx)
 * 
 * Features:
 * - Responsive UI using Tailwind CSS
 * - Interactive Framer Motion animations
 * - Dynamic rendering based on role/portal selection
 * - Unified typography and interactive states
 */
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, BookOpen, GraduationCap, Briefcase, Users, CheckCircle, BarChart, UserPlus, FileText, ArrowRight, Cookie, X, ChevronDown, Search } from 'lucide-react';
import { roleWorkflows } from '../data/roleWorkflows';


const heroSlides = [
    {
        id: 1,
        tagline: "The Future of Campus Placements",
        title1: "Connecting Top Campus Talent",
        title2: "With Industry Leaders",
        description: "Empowering students with AI-driven skill mapping, connecting industries with top-tier verified talent, and providing TPOs with real-time placement analytics.",
        button1: "Join as Student",
        button1Link: "/register",
        button2: "Explore Opportunities",
        button2Link: "/login",
        gradient: "from-white via-white/80 to-transparent",
        taglineBg: "bg-slate-200 text-[#020817] border-slate-300",
          btn1Color: "bg-[#020817] hover:bg-black",
          btn2Color: "border-[#020817] text-[#020817] hover:bg-slate-100",
        pillGlow: "hover:border-[#020817] border border-transparent hover:shadow-[0_0_12px_rgba(2,8,23,0.3)]",
        activeDot: "bg-[#020817] w-5",
        iconHover: "hover:text-blue-600",
        watermarkQuote: "Innovating the future of campus hiring.",
        middleQuote: "CareerSync: Bridging the gap between raw potential and industry demands.",
        bgImage: "https://images.unsplash.com/photo-1562774053-701939374585?q=60&w=1280&auto=format&fit=crop",
        imageSrc: "/hero-student-transparent.jpg?v=13",
        imageAlt: "Isolated Indian college student boy",
        rightPolygonColor: "bg-[#020817]",
        rightQuote: "Celebrating success, enabling futures.",
        rightBullets: ["Verified Student Profiles", "AI Skill Matching", "Seamless Recruitment", "Direct Industry Access"]
    },
    {
        id: 2,
        tagline: "Empowering Your Career Journey",
        title1: "Discover Your True Potential",
        title2: "With AI-Powered Insights",
        description: "Build a dynamic profile, instantly match with top employers, and jumpstart your career through CareerSync's intelligent placement engine.",
        button1: "Get Started Now",
        button1Link: "/register",
        button2: "Learn More",
        button2Link: "/login",
        gradient: "from-white via-white/80 to-transparent",
        taglineBg: "bg-amber-100 text-[#431407] border-amber-200",
        btn1Color: "bg-[#431407] hover:bg-[#2a0c04]",
        btn2Color: "border-[#431407] text-[#431407] hover:bg-amber-50",
        pillGlow: "hover:border-[#431407] border border-transparent hover:shadow-[0_0_12px_rgba(67,20,7,0.3)]",
        activeDot: "bg-[#431407] w-5",
        iconHover: "hover:text-indigo-600",
        watermarkQuote: "Discover opportunities tailored for you.",
        middleQuote: "Your dream career is just one intelligent match away with CareerSync.",
        bgImage: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=60&w=1280&auto=format&fit=crop",
        imageSrc: "/hero-girl-transparent.jpg",
        imageAlt: "Isolated female student",
        rightPolygonColor: "bg-[#431407]",
        rightQuote: "Empowering over 10,000+ graduates seamlessly.",
        rightBullets: ["Dynamic AI Resume", "One-Click Apply", "Skill Analytics", "Direct Interview Invites"]
    },
    {
        id: 3,
        tagline: "Celebrate Your Achievements",
        title1: "Launch Your Career",
        title2: "With Total Confidence",
        description: "From campus convocation to corporate success. CareerSync transforms your academic milestones into real-world career opportunities seamlessly.",
        button1: "Start Your Journey",
        button1Link: "/register",
        button2: "View Placements",
        button2Link: "/login",
        gradient: "from-white via-white/80 to-transparent",
        taglineBg: "bg-blue-100 text-blue-900 border-blue-200",
        btn1Color: "bg-blue-800 hover:bg-blue-900",
          btn2Color: "border-blue-800 text-blue-800 hover:bg-blue-50",
        pillGlow: "hover:border-blue-800 border border-transparent hover:shadow-[0_0_12px_rgba(30,64,175,0.3)]",
        activeDot: "bg-blue-800 w-5",
        iconHover: "hover:text-orange-600",
        watermarkQuote: "Where ambition meets opportunity.",
        middleQuote: "Your bridge from campus to corporate success.",
        bgImage: "/campus-girl.jpg",
        imageSrc: "/hero-convocation-student.jpg",
        imageAlt: "Graduation caps thrown in the air during convocation",
        rightPolygonColor: "bg-[#0B1B33]",
        rightQuote: "Building the next generation of tech leaders.",
        rightBullets: ["High Placement Rates", "Top-Tier University Partners", "Global Corporate Tie-ups", "Lifelong Alumni Network"]
    }
];

const quickQueries = ["Jobs", "Placements", "Internships", "Registration", "Login", "Dashboard", "Resume/CV", "Skill Match", "Interviews", "Helpline", "Corporate", "Other Queries"];


const faqs = [
    {
        question: "Is CareerSync free for students?",
        answer: "Yes! CareerSync is completely free for all students. You can create a profile, parse your resume using our AI tools, and apply to unlimited jobs without any hidden charges."
    },
    {
        question: "How does the AI Skill Matching work?",
        answer: "Our intelligent matching engine analyzes your uploaded Resume/CV against live job descriptions. It scores your technical stack and instantly recommends the roles you are most qualified for."
    },
    {
        question: "Can recruiters conduct interviews on the platform?",
        answer: "Absolutely. Corporate Recruiters and HRs can schedule, manage, and execute video interviews directly through the CareerSync dashboard, streamlining the entire hiring pipeline."
    },
    {
        question: "How do universities track student placements?",
        answer: "Training and Placement Officers (TPOs) get a dedicated analytics dashboard to monitor student registrations, application statuses, and successful placement rates in real-time."
    },
    {
        question: "Who can I contact for technical support?",
        answer: "If you encounter any issues, you can click the 'Visit Support Page' link in the AI Assistant chatbot, or navigate to our Contact Us page. Our support team is available Monday to Friday."
    }
];

const Home = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const [openFaq, setOpenFaq] = useState(null);
    const [isPaused, setIsPaused] = useState(false);
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [showWorkflowModal, setShowWorkflowModal] = useState(false);
    const [activeWorkflowRole, setActiveWorkflowRole] = useState('student');

    useEffect(() => {
        if (window.innerWidth >= 768) return;
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.focus({ preventScroll: true });
                }
            });
        }, { threshold: 0.7 });
        
        const cards = document.querySelectorAll('.feature-card');
        cards.forEach(card => observer.observe(card));
        
        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);
    const [chatInput, setChatInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);

    const [messages, setMessages] = useState(() => {
        const saved = localStorage.getItem('chatMessages');
        if (saved) {
            try {
                return JSON.parse(saved);
            } catch (e) {
                console.error("Failed to parse chat messages from localStorage");
            }
        }
        return [
            { sender: 'bot', text: "Hello. I am your specialized <b>CareerSync Assistant</b>.<br/><br/>I am here to help you navigate the platform, discover top jobs, and manage placements. How can I assist you today?" }
        ];
    });

    useEffect(() => {
        localStorage.setItem('chatMessages', JSON.stringify(messages));
    }, [messages]);
    const chatEndRef = React.useRef(null);
    
    const chatBodyRef = React.useRef(null);
    useEffect(() => {
        if (chatBodyRef.current) {
            chatBodyRef.current.scrollTo({
                top: chatBodyRef.current.scrollHeight,
                behavior: 'smooth'
            });
        }
    }, [messages, isTyping]);
    
    const handleSendMessage = async (e, quickQuery = null) => {
        if (e) e.preventDefault();
        
        
        const userMsg = quickQuery || chatInput.trim();
        if (!userMsg) return;
        setMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
        if (!quickQuery) setChatInput('');
        setIsTyping(true);
        
        try {
            // Local Specialized CareerSync AI (100% Reliable, Offline Mode)
            setTimeout(() => {
                let botResponse = "";
                const input = userMsg.toLowerCase();
                
                if (input === "jobs" || input === "placements" || input.includes("job") || input.includes("placement")) {
                      botResponse = "CareerSync connects students directly with top-tier companies. You can explore active hiring drives, apply for jobs, and use our AI to match your skills with specific placements! <br/><br/>Log in to explore our active placement drives.<br/><br/><a href='/login' class='text-blue-600 underline font-semibold hover:text-blue-800 transition-colors'>Log In</a>";
                  } else if (input === "internships" || input.includes("internship")) {
                      botResponse = "CareerSync's upcoming Internships portal connects ambitious students with exclusive summer and winter internship programs at top global firms. Get ready to kickstart your career early!<br/><br/>Log in to explore upcoming internship opportunities.<br/><br/><a href='/login' class='text-blue-600 underline font-semibold hover:text-blue-800 transition-colors'>Log In</a>";
                  } else if (input === "registration" || input.includes("register") || input.includes("sign up")) {
                      botResponse = "To register, simply click the link below to head to our registration page. You can register as a Student, University TPO, or Corporate Recruiter. <br/><br/><a href='/register' class='text-blue-600 underline font-semibold hover:text-blue-800 transition-colors'>Create an Account</a>";
                  } else if (input === "login" || input.includes("log in") || input.includes("logged in") || input === "dashboard") {
                      botResponse = "Your personalized CareerSync Dashboard is your central command center! It gives you a real-time, comprehensive overview of your job applications, upcoming interviews, and AI skill-match scores.<br/><br/>Log in to access your personalized dashboard.<br/><br/><a href='/login' class='text-blue-600 underline font-semibold hover:text-blue-800 transition-colors'>Log In</a>";
                  } else if (input === "resume/cv" || input.includes("resume") || input.includes("cv")) {
                      botResponse = "Your Resume/CV is your first impression! CareerSync allows you to build a professional profile that highlights your education, projects, and technical skills to top recruiters.<br/><br/>Log in to build and update your professional Resume/CV.<br/><br/><a href='/login' class='text-blue-600 underline font-semibold hover:text-blue-800 transition-colors'>Log In</a>";
                  } else if (input === "skill match" || input.includes("skill")) {
                      botResponse = "CareerSync leverages cutting-edge AI to instantly parse your Resume/CV and automatically match your unique tech stack with the exact companies looking to hire you. Stop searching and start matching!<br/><br/>Log in to explore your AI skill-match scores.<br/><br/><a href='/login' class='text-blue-600 underline font-semibold hover:text-blue-800 transition-colors'>Log In</a>";
                  } else if (input === "interviews" || input.includes("interview")) {
                      botResponse = "CareerSync streamlines the entire hiring pipeline! Corporate recruiters can effortlessly schedule, manage, and conduct interviews directly through our seamless integrated platform, saving valuable time and resources.<br/><br/>Log in to manage your interview schedules.<br/><br/><a href='/login' class='text-blue-600 underline font-semibold hover:text-blue-800 transition-colors'>Log In</a>";
                  } else if (input === "helpline" || input.includes("help") || input.includes("support")) {
                      botResponse = "For technical support, you can reach our helpline at <b>+91-123-456-7890</b> or email us at <b>support@careersync.com</b>. We are available Monday to Friday, 9 AM - 6 PM.<br/><br/><a href='/support' class='text-blue-600 underline font-semibold hover:text-blue-800 transition-colors'>Visit Support Page</a>";
                  } else if (input === "corporate") {
                      botResponse = "CareerSync is the ultimate Corporate Hiring Portal. We empower HR teams and Recruiters to seamlessly manage talent pipelines, track applicant metrics, and roll out offers with unprecedented efficiency.<br/><br/>Log in to access the Corporate Hiring Portal.<br/><br/><a href='/login' class='text-blue-600 underline font-semibold hover:text-blue-800 transition-colors'>Log In</a>";
                  } else if (input === "other queries" || input.includes("other")) {
                      botResponse = "For any other queries or technical assistance, please visit our dedicated support center. We are available Monday to Friday, 9 AM - 6 PM.<br/><br/><a href='/support' class='text-blue-600 underline font-semibold hover:text-blue-800 transition-colors'>Visit Support Page</a>";
                  } else if (input.match(/(hi|hello|hey|greetings)/)) {
                      botResponse = "Hello. I am your specialized CareerSync Assistant. <br/><br/><b>CareerSync</b> is an advanced platform designed to bridge the gap between academia and industry. We provide a seamless ecosystem for <b>Students</b> to discover opportunities, <b>Universities</b> to manage placement drives, and <b>Recruiters</b> to hire top talent.<br/><br/>I can quickly assist you with questions regarding:<br/>• Jobs & Placements<br/>• Registration & Log In<br/>• Helpline & Support<br/><br/>How can I help you navigate the portal today?";
                  } else {
                      botResponse = "I am a specialized CareerSync assistant. I am here to help you with jobs, placements, registration, login, helpline details, or any other issue related to the portal. Could you please rephrase your question regarding one of those topics?";
                  }
                
                setMessages(prev => [...prev, { sender: 'bot', text: botResponse }]);
                setIsTyping(false);
            }, 600);
        } catch (error) {
            console.error("Chat error:", error);
            setIsTyping(false);
        }
    };
    const [pageTheme, setPageTheme] = useState('blue');
    const [showCookieConsent, setShowCookieConsent] = useState(() => {
        return localStorage.getItem('careerSyncCookieConsent') === null;
    });
    const [showPolicyModal, setShowPolicyModal] = useState(null);


    const handleCookieConsent = (type) => {
        localStorage.setItem('careerSyncCookieConsent', type);
        setShowCookieConsent(false);
    };

    useEffect(() => {
        if (isPaused) {
            const themes = ['blue', 'indigo', 'orange'];
            setPageTheme(themes[currentSlide]);
        } else {
            setPageTheme('blue'); // Default back to blue when playing
        }
    }, [isPaused, currentSlide]);

    useEffect(() => {
        localStorage.setItem('globalTheme', pageTheme);
        window.dispatchEvent(new CustomEvent('pageThemeChange', { detail: { theme: pageTheme, isPaused } }));
    }, [pageTheme, isPaused]);

    const pageStyles = {
        blue: { bgDark: "bg-blue-500", cardBg: "bg-blue-50", iconBg: "bg-blue-100", iconText: "text-blue-600", borderHover: "hover:border-blue-200", btnBg: "bg-blue-900 hover:bg-blue-600", ctaGradient: "from-white via-blue-100 to-blue-300", textLight: "text-white", syncText: "text-blue-900", glowBorder: "hover:border-blue-500 hover:shadow-[0_0_25px_rgba(59,130,246,0.5)]" },
        indigo: { bgDark: "bg-indigo-500", cardBg: "bg-[#f3f0fc]", iconBg: "bg-indigo-100", iconText: "text-indigo-600", borderHover: "hover:border-indigo-100", btnBg: "bg-indigo-900 hover:bg-indigo-600", ctaGradient: "from-white via-indigo-100 to-indigo-300", textLight: "text-white", syncText: "text-indigo-900", glowBorder: "hover:border-indigo-500 hover:shadow-[0_0_25px_rgba(99,102,241,0.5)]" },
        orange: { bgDark: "bg-orange-200", cardBg: "bg-[#fdfbf5]", iconBg: "bg-orange-100", iconText: "text-orange-600", borderHover: "hover:border-orange-200", btnBg: "bg-orange-900 hover:bg-orange-600", ctaGradient: "from-white via-orange-50 to-orange-100", textLight: "text-orange-900", syncText: "text-orange-900", glowBorder: "hover:border-orange-500 hover:shadow-[0_0_25px_rgba(249,115,22,0.5)]" }
    };


    useEffect(() => {
        window.dispatchEvent(new CustomEvent('heroSlideChange', { detail: { slide: currentSlide } }));
    }, [currentSlide]);

    useEffect(() => {
        heroSlides.forEach(slide => {
            const img = new Image();
            img.src = slide.bgImage;
        });
    }, []);

    useEffect(() => {
        if (isPaused) return;
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev === 2 ? 0 : prev + 1));
        }, 3000);
        return () => clearInterval(timer);
    }, [isPaused]);
    return (
        <>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, ease: "easeOut" }} className="bg-white"
        >
            {/* Hero Section */}
                        {/* Hero Section Slideshow */}
            <div id="tour-hero" className="relative mt-0 md:mt-20 w-full min-h-[calc(100dvh-4rem)] flex items-center border-b border-gray-200 overflow-hidden bg-white [contain:paint]">
                <AnimatePresence initial={false}>
                    <motion.div
                        key={currentSlide}
                        initial={{ x: '100%', opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: 0, opacity: 0 }}
                        transition={{ duration: 0.7, ease: "easeInOut" }}
                        className={`absolute inset-0 flex items-center will-change-transform [transform:translateZ(0)]`}
                    >
                        {/* Full screen background image */}
                        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0" style={{ backgroundImage: `url(${heroSlides[currentSlide].bgImage})` }}></div>
                        {/* Left white gradient overlay */}
                        <div className={`absolute inset-0 bg-gradient-to-r ${heroSlides[currentSlide].gradient} z-[1] w-full md:w-3/4 lg:w-[50%]`}></div>
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full relative z-10 h-full flex items-center">
                            <div className="flex flex-col md:flex-row items-center justify-between w-full">
                                {/* Left Content */}
                                <div className="md:w-1/2 text-left mb-12 md:mb-0 pr-0 md:pr-10">
                                    <div className={`inline-block px-4 py-1 rounded-full font-semibold text-sm mb-6 border ${heroSlides[currentSlide].taglineBg}`}>
                                        {heroSlides[currentSlide].tagline}
                                    </div>
                                    <h1 id="tour-hero-heading" className="text-xl md:text-3xl tracking-tight font-extrabold text-gray-900 sm:text-4xl xl:text-[44px] mb-6">
                                        <span className="block md:whitespace-nowrap">{heroSlides[currentSlide].title1}</span>
                                        <span className="block text-gray-900 mt-2 md:whitespace-nowrap">{heroSlides[currentSlide].title2}</span>
                                    </h1>
                                    <p className="text-sm text-gray-500 font-normal italic leading-relaxed tracking-wide mb-3 max-w-xl">
                                        {heroSlides[currentSlide].description}
                                    </p>
                                    <p className={`border-l-[3px] pl-4 text-[14px] font-bold italic leading-relaxed tracking-wide mb-8 max-w-xl drop-shadow-sm ${currentSlide === 0 ? 'text-[#020817] border-[#020817]' : currentSlide === 1 ? 'text-[#431407] border-[#431407]' : 'text-blue-800 border-blue-800'}`}>
                                        "{heroSlides[currentSlide].middleQuote}"
                                    </p>
                                    
                                    <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mb-10" onMouseEnter={() => setIsPaused(true)} onMouseLeave={() => setIsPaused(false)}>
                                        <Link to={heroSlides[currentSlide].button1Link} className={`group relative overflow-hidden flex items-center justify-center px-6 py-2.5 border border-transparent text-sm font-bold rounded-md text-white shadow-lg transition-all duration-300 transform hover:-translate-y-1 ${heroSlides[currentSlide].btn1Color}`}>
                                            <span className="absolute inset-0 w-full h-full bg-black/20 -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out z-0"></span>
                                            <span className="relative z-10">{heroSlides[currentSlide].button1}</span>
                                        </Link>
                                        <Link to={heroSlides[currentSlide].button2Link} className={`group relative overflow-hidden flex items-center justify-center px-6 py-2.5 border-2 text-sm font-bold rounded-md bg-white shadow transition-all duration-300 transform hover:-translate-y-1 ${heroSlides[currentSlide].btn2Color}`}>
                                            <span className="absolute inset-0 w-full h-full bg-gray-100 -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out z-0"></span>
                                            <span className="relative z-10">{heroSlides[currentSlide].button2}</span>
                                        </Link>
                                    </div>
                                </div>
                                
                                {/* Right Content Spacer */}
                                <div className="md:w-1/2 hidden md:block"></div>
                            </div>
                        </div>

                        

                        

                        {/* Right dark diagonal polygon */}
                        <div className={`hidden md:block absolute top-0 right-0 h-full w-[38%] ${heroSlides[currentSlide].rightPolygonColor} z-[10] transition-colors duration-700`} style={{ clipPath: 'polygon(15% 0, 100% 0, 100% 100%, 0% 100%)' }}>
                            {/* Top Right Little Quote */}
                            <div className="absolute top-24 right-16 lg:right-20 z-20 opacity-70 text-right pointer-events-none">
                                <p className={`text-lg md:text-xl font-bold leading-relaxed tracking-wide drop-shadow-md ${currentSlide === 0 ? 'text-blue-400' : currentSlide === 1 ? 'text-indigo-300' : 'text-orange-400'}`}>
                                    {currentSlide === 0 ? '"Your professional journey begins here."' : currentSlide === 1 ? '"Accelerate your career growth today."' : '"Unlock your true professional potential."'}
                                </p>
                            </div>
                            {/* Background Watermark Icon */}
                            <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none overflow-hidden z-0 pl-16">
                                <GraduationCap className="w-96 h-96 text-white transform rotate-12 scale-150" strokeWidth={0.8} />
                            </div>
                            <div className="absolute inset-0 flex flex-col justify-center items-start pl-12 lg:pl-16 pr-6 text-white z-10">
                                <ul className="space-y-5 mb-10">
                                    {heroSlides[currentSlide].rightBullets?.map((bullet, idx) => (
                                        <li key={idx} className="flex items-center space-x-4">
                                            <span className="bg-white/10 text-white/90 p-2 rounded-full"><CheckCircle className="w-5 h-5" /></span>
                                            <span className="text-gray-100 font-medium tracking-wide text-sm lg:text-base">{bullet}</span>
                                        </li>
                                    ))}
                                </ul>
                                <div className="border-t border-white/40 pt-6 mt-2">
                                    <p className="text-white/70 italic text-sm font-medium tracking-wide">
                                        "{heroSlides[currentSlide].rightQuote}"
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Interactive Watermark in bottom right */}
                        <div className="hidden md:flex absolute bottom-12 right-12 flex-col items-end select-none cursor-default group transition-all duration-500 hover:-translate-y-1 hover:scale-105 z-20">
                            <div className="text-4xl font-serif text-white/90 mb-1 drop-shadow-[0_0_15px_rgba(255,255,255,0.6)]">CareerSync</div>
                            <div className="text-[13px] font-medium italic text-white/70 tracking-wide drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">{heroSlides[currentSlide].watermarkQuote}</div>
                        </div>
                    </motion.div>
                </AnimatePresence>

                {/* Slideshow Indicators */}
                <div className={`absolute bottom-10 left-1/2 transform -translate-x-1/2 flex items-center space-x-2 z-20 bg-white/10 hover:bg-white/20 backdrop-blur-md px-4 py-2 sm:px-5 sm:py-2.5 rounded-full border border-white/20 shadow-sm transition-all duration-500 cursor-pointer group ${heroSlides[currentSlide].pillGlow}`}>
                    
                    {/* Dots */}
                    <div className="flex space-x-1.5 border-l border-gray-400/30 pl-2">
                        {heroSlides.map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => {
                                    setCurrentSlide(idx);
                                    setIsPaused(true);
                                }}
                                className={`h-1.5 rounded-full transition-all duration-300 ${currentSlide === idx ? heroSlides[currentSlide].activeDot : 'bg-gray-500/80 hover:bg-gray-700 w-1.5'}`}
                                aria-label={`Go to slide ${idx + 1}`}
                            />
                        ))}
                    </div>
                </div>
                
                

                
            </div>

            
            {/* Global Impact / Statistics Section */}
            <div className="bg-white py-12 border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-gray-100">
                        <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "20px" }} transition={{ duration: 0.75, delay: 0.1, ease: [0.22, 1, 0.36, 1] }} className="px-4">
                            <h4 className={`text-4xl font-extrabold transition-colors duration-500 mb-2 ${pageStyles[pageTheme].textDark}`}>500+</h4>
                            <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Top Companies</p>
                        </motion.div>
                        <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "20px" }} transition={{ duration: 0.75, delay: 0.2, ease: [0.22, 1, 0.36, 1] }} className="px-4">
                            <h4 className={`text-4xl font-extrabold transition-colors duration-500 mb-2 ${pageStyles[pageTheme].textDark}`}>50+</h4>
                            <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Universities</p>
                        </motion.div>
                        <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "20px" }} transition={{ duration: 0.75, delay: 0.3, ease: [0.22, 1, 0.36, 1] }} className="px-4">
                            <h4 className={`text-4xl font-extrabold transition-colors duration-500 mb-2 ${pageStyles[pageTheme].textDark}`}>25k+</h4>
                            <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Students Placed</p>
                        </motion.div>
                        <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "20px" }} transition={{ duration: 0.75, delay: 0.4, ease: [0.22, 1, 0.36, 1] }} className="px-4">
                            <h4 className={`text-4xl font-extrabold transition-colors duration-500 mb-2 ${pageStyles[pageTheme].textDark}`}>98%</h4>
                            <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Success Rate</p>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Features Workflow Section */}

            <motion.div initial={{ opacity: 0, y: 75 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "30px" }} transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }} id="tour-features" className="bg-gray-50 py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    
                    {/* Timeline Line */}
                    <div className="hidden md:flex justify-between items-center relative mb-12 px-10">
                        <div className={`absolute left-0 right-0 h-1 transition-colors duration-500 ${isPaused ? pageStyles[pageTheme].bgDark : 'bg-blue-900'} top-1/2 transform -translate-y-1/2 z-0`}></div>
                        
                        <div className="relative z-10 bg-gray-50 text-black rounded-full h-10 w-10 flex items-center justify-center font-extrabold text-lg">01</div>
                        <div className="relative z-10 bg-gray-50 text-black rounded-full h-10 w-10 flex items-center justify-center font-extrabold text-lg">02</div>
                        <div className="relative z-10 bg-gray-50 text-black rounded-full h-10 w-10 flex items-center justify-center font-extrabold text-lg">03</div>
                        <div className="relative z-10 bg-gray-50 text-black rounded-full h-10 w-10 flex items-center justify-center font-extrabold text-lg">04</div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        {/* Card 1 */}
                        <div tabIndex="0" className="feature-card group relative p-8 focus:outline-none rounded-[2rem] bg-white border-2 border-gray-100/50 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] hover:-translate-y-1.5 focus:-translate-y-1.5 hover:border-slate-900 focus:border-slate-900 hover:shadow-2xl focus:shadow-2xl transition-all duration-500 overflow-hidden cursor-pointer">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-blue-50 to-transparent rounded-bl-full -mr-8 -mt-8 opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                            <div className="relative z-10 w-14 h-14 rounded-2xl bg-gradient-to-br from-gray-50 to-white border border-gray-100 flex items-center justify-center mb-6 transition-all duration-500 group-hover:scale-110 group-focus:scale-110 group-hover:rotate-3 group-focus:rotate-3 group-hover:from-blue-50 group-focus:from-blue-50 group-hover:to-indigo-50 group-focus:to-indigo-50 group-hover:border-blue-100 group-focus:border-blue-100 group-hover:shadow-[0_0_20px_rgba(59,130,246,0.15)] group-focus:shadow-[0_0_20px_rgba(59,130,246,0.15)] text-gray-600 group-hover:text-blue-600 group-focus:text-blue-600">
                                <FileText className="h-6 w-6" />
                            </div>
                            <h3 className="text-sm font-bold tracking-widest text-black mb-4">AI-Driven Skill Mapping</h3>
                            <p className="text-sm text-gray-500 font-normal italic leading-relaxed tracking-wide">
                                Students can analyze their resumes instantly to identify skill gaps and receive personalized learning paths to become industry-ready.
                            </p>
                        </div>
                        
                        {/* Card 2 */}
                        <div tabIndex="0" className="feature-card group relative p-8 focus:outline-none rounded-[2rem] bg-white border-2 border-gray-100/50 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] hover:-translate-y-1.5 focus:-translate-y-1.5 hover:border-slate-900 focus:border-slate-900 hover:shadow-2xl focus:shadow-2xl transition-all duration-500 overflow-hidden cursor-pointer">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-blue-50 to-transparent rounded-bl-full -mr-8 -mt-8 opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                            <div className="relative z-10 w-14 h-14 rounded-2xl bg-gradient-to-br from-gray-50 to-white border border-gray-100 flex items-center justify-center mb-6 transition-all duration-500 group-hover:scale-110 group-focus:scale-110 group-hover:rotate-3 group-focus:rotate-3 group-hover:from-blue-50 group-focus:from-blue-50 group-hover:to-indigo-50 group-focus:to-indigo-50 group-hover:border-blue-100 group-focus:border-blue-100 group-hover:shadow-[0_0_20px_rgba(59,130,246,0.15)] group-focus:shadow-[0_0_20px_rgba(59,130,246,0.15)] text-gray-600 group-hover:text-blue-600 group-focus:text-blue-600">
                                <CheckCircle className="h-6 w-6" />
                            </div>
                            <h3 className="text-sm font-bold tracking-widest text-black mb-4">TPOal Verification</h3>
                            <p className="text-sm text-gray-500 font-normal italic leading-relaxed tracking-wide">
                                TPOs can securely verify student profiles and academic records, creating a trusted and highly credible talent pool for recruiters.
                            </p>
                        </div>

                        {/* Card 3 */}
                        <div tabIndex="0" className="feature-card group relative p-8 focus:outline-none rounded-[2rem] bg-white border-2 border-gray-100/50 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] hover:-translate-y-1.5 focus:-translate-y-1.5 hover:border-slate-900 focus:border-slate-900 hover:shadow-2xl focus:shadow-2xl transition-all duration-500 overflow-hidden cursor-pointer">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-blue-50 to-transparent rounded-bl-full -mr-8 -mt-8 opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                            <div className="relative z-10 w-14 h-14 rounded-2xl bg-gradient-to-br from-gray-50 to-white border border-gray-100 flex items-center justify-center mb-6 transition-all duration-500 group-hover:scale-110 group-focus:scale-110 group-hover:rotate-3 group-focus:rotate-3 group-hover:from-blue-50 group-focus:from-blue-50 group-hover:to-indigo-50 group-focus:to-indigo-50 group-hover:border-blue-100 group-focus:border-blue-100 group-hover:shadow-[0_0_20px_rgba(59,130,246,0.15)] group-focus:shadow-[0_0_20px_rgba(59,130,246,0.15)] text-gray-600 group-hover:text-blue-600 group-focus:text-blue-600">
                                <BarChart className="h-6 w-6" />
                            </div>
                            <h3 className="text-sm font-bold tracking-widest text-black mb-4">Smart Job Matching</h3>
                            <p className="text-sm text-gray-500 font-normal italic leading-relaxed tracking-wide">
                                Recruiters use our advanced NLP algorithms to automatically match their job requirements with the most qualified campus talent.
                            </p>
                        </div>

                        {/* Card 4 */}
                        <div tabIndex="0" className="feature-card group relative p-8 focus:outline-none rounded-[2rem] bg-white border-2 border-gray-100/50 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] hover:-translate-y-1.5 focus:-translate-y-1.5 hover:border-slate-900 focus:border-slate-900 hover:shadow-2xl focus:shadow-2xl transition-all duration-500 overflow-hidden cursor-pointer">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-blue-50 to-transparent rounded-bl-full -mr-8 -mt-8 opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                            <div className="relative z-10 w-14 h-14 rounded-2xl bg-gradient-to-br from-gray-50 to-white border border-gray-100 flex items-center justify-center mb-6 transition-all duration-500 group-hover:scale-110 group-focus:scale-110 group-hover:rotate-3 group-focus:rotate-3 group-hover:from-blue-50 group-focus:from-blue-50 group-hover:to-indigo-50 group-focus:to-indigo-50 group-hover:border-blue-100 group-focus:border-blue-100 group-hover:shadow-[0_0_20px_rgba(59,130,246,0.15)] group-focus:shadow-[0_0_20px_rgba(59,130,246,0.15)] text-gray-600 group-hover:text-blue-600 group-focus:text-blue-600">
                                <UserPlus className="h-6 w-6" />
                            </div>
                            <h3 className="text-sm font-bold tracking-widest text-black mb-4">Placement Analytics</h3>
                            <p className="text-sm text-gray-500 font-normal italic leading-relaxed tracking-wide">
                                Comprehensive real-time dashboards allow TPOs to track hiring pipelines, placement rates, and ongoing recruitment drives.
                            </p>
                        </div>
                    </div>

                    {/* Second Timeline Line */}
                    <div className="hidden md:flex justify-between items-center relative mb-12 mt-16 px-10">
                        <div className={`absolute left-0 right-0 h-1 transition-colors duration-500 ${isPaused ? pageStyles[pageTheme].bgDark : 'bg-blue-900'} top-1/2 transform -translate-y-1/2 z-0`}></div>
                        
                        <div className="relative z-10 bg-gray-50 text-black rounded-full h-10 w-10 flex items-center justify-center font-extrabold text-lg">05</div>
                        <div className="relative z-10 bg-gray-50 text-black rounded-full h-10 w-10 flex items-center justify-center font-extrabold text-lg">06</div>
                        <div className="relative z-10 bg-gray-50 text-black rounded-full h-10 w-10 flex items-center justify-center font-extrabold text-lg">07</div>
                        <div className="relative z-10 bg-gray-50 text-black rounded-full h-10 w-10 flex items-center justify-center font-extrabold text-lg">08</div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        {/* Card 5 */}
                        <div tabIndex="0" className="feature-card group relative p-8 focus:outline-none rounded-[2rem] bg-white border-2 border-gray-100/50 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] hover:-translate-y-1.5 focus:-translate-y-1.5 hover:border-slate-900 focus:border-slate-900 hover:shadow-2xl focus:shadow-2xl transition-all duration-500 overflow-hidden cursor-pointer">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-blue-50 to-transparent rounded-bl-full -mr-8 -mt-8 opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                            <div className="relative z-10 w-14 h-14 rounded-2xl bg-gradient-to-br from-gray-50 to-white border border-gray-100 flex items-center justify-center mb-6 transition-all duration-500 group-hover:scale-110 group-focus:scale-110 group-hover:rotate-3 group-focus:rotate-3 group-hover:from-blue-50 group-focus:from-blue-50 group-hover:to-indigo-50 group-focus:to-indigo-50 group-hover:border-blue-100 group-focus:border-blue-100 group-hover:shadow-[0_0_20px_rgba(59,130,246,0.15)] group-focus:shadow-[0_0_20px_rgba(59,130,246,0.15)] text-gray-600 group-hover:text-blue-600 group-focus:text-blue-600">
                                <FileText className="h-6 w-6" />
                            </div>
                            <h3 className="text-sm font-bold tracking-widest text-black mb-4">Resume Building</h3>
                            <p className="text-sm text-gray-500 font-normal italic leading-relaxed tracking-wide">
                                Automatically generate ATS-friendly professional resumes based on your verified skills, projects, and academic records.
                            </p>
                        </div>
                        
                        {/* Card 6 */}
                        <div tabIndex="0" className="feature-card group relative p-8 focus:outline-none rounded-[2rem] bg-white border-2 border-gray-100/50 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] hover:-translate-y-1.5 focus:-translate-y-1.5 hover:border-slate-900 focus:border-slate-900 hover:shadow-2xl focus:shadow-2xl transition-all duration-500 overflow-hidden cursor-pointer">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-blue-50 to-transparent rounded-bl-full -mr-8 -mt-8 opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                            <div className="relative z-10 w-14 h-14 rounded-2xl bg-gradient-to-br from-gray-50 to-white border border-gray-100 flex items-center justify-center mb-6 transition-all duration-500 group-hover:scale-110 group-focus:scale-110 group-hover:rotate-3 group-focus:rotate-3 group-hover:from-blue-50 group-focus:from-blue-50 group-hover:to-indigo-50 group-focus:to-indigo-50 group-hover:border-blue-100 group-focus:border-blue-100 group-hover:shadow-[0_0_20px_rgba(59,130,246,0.15)] group-focus:shadow-[0_0_20px_rgba(59,130,246,0.15)] text-gray-600 group-hover:text-blue-600 group-focus:text-blue-600">
                                <Users className="h-6 w-6" />
                            </div>
                            <h3 className="text-sm font-bold tracking-widest text-black mb-4">Mock Interviews</h3>
                            <p className="text-sm text-gray-500 font-normal italic leading-relaxed tracking-wide">
                                Practice your technical and behavioral skills with our AI interviewer to gain confidence before real industry interviews.
                            </p>
                        </div>

                        {/* Card 7 */}
                        <div tabIndex="0" className="feature-card group relative p-8 focus:outline-none rounded-[2rem] bg-white border-2 border-gray-100/50 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] hover:-translate-y-1.5 focus:-translate-y-1.5 hover:border-slate-900 focus:border-slate-900 hover:shadow-2xl focus:shadow-2xl transition-all duration-500 overflow-hidden cursor-pointer">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-blue-50 to-transparent rounded-bl-full -mr-8 -mt-8 opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                            <div className="relative z-10 w-14 h-14 rounded-2xl bg-gradient-to-br from-gray-50 to-white border border-gray-100 flex items-center justify-center mb-6 transition-all duration-500 group-hover:scale-110 group-focus:scale-110 group-hover:rotate-3 group-focus:rotate-3 group-hover:from-blue-50 group-focus:from-blue-50 group-hover:to-indigo-50 group-focus:to-indigo-50 group-hover:border-blue-100 group-focus:border-blue-100 group-hover:shadow-[0_0_20px_rgba(59,130,246,0.15)] group-focus:shadow-[0_0_20px_rgba(59,130,246,0.15)] text-gray-600 group-hover:text-blue-600 group-focus:text-blue-600">
                                <Briefcase className="h-6 w-6" />
                            </div>
                            <h3 className="text-sm font-bold tracking-widest text-black mb-4">One-Click Apply</h3>
                            <p className="text-sm text-gray-500 font-normal italic leading-relaxed tracking-wide">
                                Apply to top-tier verified internships and full-time positions with a single click, directly from your personalized dashboard.
                            </p>
                        </div>

                        {/* Card 8 */}
                        <div tabIndex="0" className="feature-card group relative p-8 focus:outline-none rounded-[2rem] bg-white border-2 border-gray-100/50 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] hover:-translate-y-1.5 focus:-translate-y-1.5 hover:border-slate-900 focus:border-slate-900 hover:shadow-2xl focus:shadow-2xl transition-all duration-500 overflow-hidden cursor-pointer">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-blue-50 to-transparent rounded-bl-full -mr-8 -mt-8 opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                            <div className="relative z-10 w-14 h-14 rounded-2xl bg-gradient-to-br from-gray-50 to-white border border-gray-100 flex items-center justify-center mb-6 transition-all duration-500 group-hover:scale-110 group-focus:scale-110 group-hover:rotate-3 group-focus:rotate-3 group-hover:from-blue-50 group-focus:from-blue-50 group-hover:to-indigo-50 group-focus:to-indigo-50 group-hover:border-blue-100 group-focus:border-blue-100 group-hover:shadow-[0_0_20px_rgba(59,130,246,0.15)] group-focus:shadow-[0_0_20px_rgba(59,130,246,0.15)] text-gray-600 group-hover:text-blue-600 group-focus:text-blue-600">
                                <BookOpen className="h-6 w-6" />
                            </div>
                            <h3 className="text-sm font-bold tracking-widest text-black mb-4">Alumni Mentorship</h3>
                            <p className="text-sm text-gray-500 font-normal italic leading-relaxed tracking-wide">
                                Connect with successfully placed alumni from your TPO for 1-on-1 career guidance and industry referrals.
                            </p>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Our Partners Section (Infinite Marquee) */}
            <motion.div initial={{ opacity: 0, y: 75 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "30px" }} transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }} id="tour-marquee" className="bg-gray-100 py-12 border-b border-gray-200 overflow-hidden relative flex flex-col items-center shadow-inner">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 text-center z-10">
                    <p id="tour-marquee-container" className="text-sm font-bold tracking-widest text-black uppercase">Trusted by industry leaders & top universities</p>
                </div>
                
                {/* Gradient Masks for smooth fade on edges */}
                <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-gray-100 to-transparent z-10 pointer-events-none"></div>
                <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-gray-100 to-transparent z-10 pointer-events-none"></div>

                <div className="flex overflow-hidden group w-full">
                    <div className="animate-marquee group-hover:pause flex items-center space-x-16 px-8">
                        {[...Array(2)].map((_, i) => (
                            <React.Fragment key={i}>
                                <div className="flex items-center space-x-3 transition-transform hover:scale-110 cursor-pointer">
                                    <img src="https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg" className="w-6 h-6 object-cover object-left" alt="Microsoft" />
                                    <span className="text-lg md:text-xl font-semibold tracking-tight text-[#737373]">Microsoft</span>
                                </div>
                                <div className="flex items-center space-x-3 transition-transform hover:scale-110 cursor-pointer">
                                    <GraduationCap className="w-8 h-8 text-blue-900" />
                                    <span className="text-xl md:text-2xl font-bold font-serif text-blue-900">IIT Bombay</span>
                                </div>
                                <div className="flex items-center space-x-3 transition-transform hover:scale-110 cursor-pointer">
                                    <img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" className="w-6 h-6 object-contain" alt="Google" />
                                    <span className="text-xl md:text-2xl font-medium tracking-tighter"><span className="text-[#4285F4]">G</span><span className="text-[#EA4335]">o</span><span className="text-[#FBBC05]">o</span><span className="text-[#4285F4]">g</span><span className="text-[#34A853]">l</span><span className="text-[#EA4335]">e</span></span>
                                </div>
                                <div className="flex items-center space-x-3 transition-transform hover:scale-110 cursor-pointer">
                                    <GraduationCap className="w-8 h-8 text-red-800" />
                                    <span className="text-xl md:text-2xl font-black tracking-tight text-red-800">BITS Pilani</span>
                                </div>
                                <div className="flex items-center space-x-3 transition-transform hover:scale-110 cursor-pointer">
                                    <span className="text-2xl font-black text-[#a100ff]">&gt;</span>
                                    <span className="text-xl md:text-2xl font-bold tracking-tight text-[#000000]">accenture</span>
                                </div>
                                <div className="flex items-center space-x-3 transition-transform hover:scale-110 cursor-pointer">
                                    <GraduationCap className="w-8 h-8 text-indigo-900" />
                                    <span className="text-xl md:text-2xl font-bold font-sans text-indigo-900">NIT Trichy</span>
                                </div>
                                <div className="flex items-center space-x-3 transition-transform hover:scale-110 cursor-pointer">
                                    <img src="https://upload.wikimedia.org/wikipedia/commons/a/a0/Wipro_Primary_Logo_Color_RGB.svg" className="h-6 md:h-8 object-contain" alt="Wipro" />
                                </div>
                                <div className="flex items-center space-x-3 transition-transform hover:scale-110 cursor-pointer">
                                    <GraduationCap className="w-8 h-8 text-teal-800" />
                                    <span className="text-xl md:text-2xl font-bold font-serif text-teal-800">VIT Vellore</span>
                                </div>
                                <div className="flex items-center space-x-3 transition-transform hover:scale-110 cursor-pointer">
                                    <span className="text-xl md:text-2xl font-semibold tracking-wide text-[#007cc3]">Infosys</span>
                                </div>
                                <div className="flex items-center space-x-3 transition-transform hover:scale-110 cursor-pointer">
                                    <GraduationCap className="w-8 h-8 text-gray-800" />
                                    <span className="text-xl md:text-2xl font-bold font-serif text-gray-800">IIT Delhi</span>
                                </div>
                                <div className="flex items-center space-x-3 transition-transform hover:scale-110 cursor-pointer">
                                    <img src="https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg" className="h-6 md:h-7 pt-1 object-contain" alt="Amazon" />
                                </div>
                                <div className="flex items-center space-x-3 transition-transform hover:scale-110 cursor-pointer">
                                    <GraduationCap className="w-8 h-8 text-blue-700" />
                                    <span className="text-xl md:text-2xl font-black tracking-tighter text-blue-700">SRM University</span>
                                </div>
                                <div className="flex items-center space-x-3 transition-transform hover:scale-110 cursor-pointer">
                                    <img src="https://upload.wikimedia.org/wikipedia/commons/5/51/IBM_logo.svg" className="h-7 md:h-8 object-contain" alt="IBM" />
                                </div>
                                <div className="flex items-center space-x-3 transition-transform hover:scale-110 cursor-pointer">
                                    <GraduationCap className="w-8 h-8 text-orange-900" />
                                    <span className="text-xl md:text-2xl font-bold font-sans text-orange-900">DTU Delhi</span>
                                </div>
                              </React.Fragment>
                        ))}
                    </div>
                </div>
            </motion.div>

            
            {/* Success Stories / Testimonials */}
            <motion.div initial={{ opacity: 0, y: 75 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "30px" }} transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }} id="tour-testimonials" className="bg-gray-50 py-20 border-t border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 id="tour-testimonials-heading" className="text-sm font-bold tracking-widest text-black uppercase">
                            Success Stories
                        </h2>
                        <p className={`mt-4 text-sm font-normal italic leading-relaxed tracking-wide max-w-2xl mx-auto transition-colors duration-500 ${isPaused ? pageStyles[pageTheme].syncText : 'text-blue-900'}`}>
                            Don't just take our word for it. Discover how we're helping graduates land their dream roles and companies hire their next top performers.
                        </p>
                    </div>

                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Testimonial 1 */}
                        <motion.div initial="initial" whileHover="hover" whileTap="hover" whileInView={isMobile ? "hover" : undefined} viewport={{ once: false, margin: "-50px", amount: 0.5 }} className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 relative border border-gray-300 hover:border-blue-400 overflow-hidden cursor-pointer group h-64 flex flex-col justify-end">
                            {/* Default Visible State (Minimal & Professional) */}
                            <div className={`absolute inset-0 flex flex-col items-center justify-center p-8 transition-opacity duration-300 group-hover:opacity-0 z-10 transition-colors duration-500 ${pageStyles[pageTheme].cardBg}`}>
                                <div className="w-24 h-24 rounded-full mb-4">
                                    <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=facearea&facepad=2&w=150&h=150&q=60" alt="Aryan Sharma" className="w-full h-full object-cover rounded-full border-2 border-white shadow-sm" />
                                </div>
                                <h4 className="text-sm font-bold tracking-widest text-black mb-1">Aryan Sharma</h4>
                                <p className="text-sm text-gray-500 font-normal italic leading-relaxed tracking-wide text-center">Placed at TechCorp</p>
                            </div>

                            {/* Hover Reveal State */}
                            <motion.div 
                                variants={{
                                    initial: { clipPath: 'circle(0% at 100% 0%)' },
                                    hover: { clipPath: 'circle(150% at 100% 0%)' }
                                }}
                                transition={{ type: "tween", ease: "easeInOut", duration: 0.5 }}
                                className="absolute inset-0 z-20 p-8 flex flex-col justify-center transition-colors duration-500 bg-white shadow-inner"
                            >
                                <p className="text-gray-700 italic mb-6 leading-relaxed relative z-10 text-sm font-medium">
                                    "Honestly, the platform made applying for jobs so much less stressful. It instantly flagged missing keywords in my resume before I applied, which ended up getting me my first big internship."
                                </p>
                                <div className="text-sm font-bold tracking-widest text-black">
                                    Aryan Sharma
                                </div>
                            </motion.div>
                        </motion.div>

                        {/* Testimonial 2 */}
                        <motion.div initial="initial" whileHover="hover" whileTap="hover" whileInView={isMobile ? "hover" : undefined} viewport={{ once: false, margin: "-50px", amount: 0.5 }} className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 relative border border-gray-300 hover:border-blue-400 overflow-hidden cursor-pointer group h-64 flex flex-col justify-end">
                            {/* Default Visible State */}
                            <div className={`absolute inset-0 flex flex-col items-center justify-center p-8 transition-opacity duration-300 group-hover:opacity-0 z-10 transition-colors duration-500 ${pageStyles[pageTheme].cardBg}`}>
                                <div className="w-24 h-24 rounded-full mb-4">
                                    <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=facearea&facepad=2.2&w=150&h=150&q=60" alt="Priya Reddy" className="w-full h-full object-cover rounded-full border-2 border-white shadow-sm" />
                                </div>
                                <h4 className="text-sm font-bold tracking-widest text-black mb-1">Priya Reddy</h4>
                                <p className="text-sm text-gray-500 font-normal italic leading-relaxed tracking-wide text-center">Talent Acquisition, InnovateInc</p>
                            </div>

                            {/* Hover Reveal State */}
                            <motion.div 
                                variants={{
                                    initial: { clipPath: 'circle(0% at 100% 0%)' },
                                    hover: { clipPath: 'circle(150% at 100% 0%)' }
                                }}
                                transition={{ type: "tween", ease: "easeInOut", duration: 0.5 }}
                                className="absolute inset-0 z-20 p-8 flex flex-col justify-center transition-colors duration-500 bg-white shadow-inner"
                            >
                                <p className="text-gray-700 italic mb-6 leading-relaxed relative z-10 text-sm font-medium">
                                    "We used to spend weeks filtering through unverified campus applications. Now, we just set our requirements and the system hands us a pipeline of vetted students ready for interviews."
                                </p>
                                <div className="text-sm font-bold tracking-widest text-black">
                                    Priya Reddy
                                </div>
                            </motion.div>
                        </motion.div>

                        {/* Testimonial 3 */}
                        <motion.div initial="initial" whileHover="hover" whileTap="hover" whileInView={isMobile ? "hover" : undefined} viewport={{ once: false, margin: "-50px", amount: 0.5 }} className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 relative border border-gray-300 hover:border-blue-400 overflow-hidden cursor-pointer group h-64 flex flex-col justify-end">
                            {/* Default Visible State */}
                            <div className={`absolute inset-0 flex flex-col items-center justify-center p-8 transition-opacity duration-300 group-hover:opacity-0 z-10 transition-colors duration-500 ${pageStyles[pageTheme].cardBg}`}>
                                <div className="w-24 h-24 rounded-full mb-4">
                                    <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=facearea&facepad=2&w=150&h=150&q=60" alt="Dr. Manish Kumar" className="w-full h-full object-cover rounded-full border-2 border-white shadow-sm" />
                                </div>
                                <h4 className="text-sm font-bold tracking-widest text-black mb-1">Dr. Manish Kumar</h4>
                                <p className="text-sm text-gray-500 font-normal italic leading-relaxed tracking-wide text-center">TPO Head, Global Institute</p>
                            </div>

                            {/* Hover Reveal State */}
                            <motion.div 
                                variants={{
                                    initial: { clipPath: 'circle(0% at 100% 0%)' },
                                    hover: { clipPath: 'circle(150% at 100% 0%)' }
                                }}
                                transition={{ type: "tween", ease: "easeInOut", duration: 0.5 }}
                                className="absolute inset-0 z-20 p-8 flex flex-col justify-center transition-colors duration-500 bg-white shadow-inner"
                            >
                                <p className="text-gray-700 italic mb-6 leading-relaxed relative z-10 text-sm font-medium">
                                    "It completely modernized our placement cell. I can see exactly which companies are viewing our students' profiles and generate placement reports for the dean with one click."
                                </p>
                                <div className="text-sm font-bold tracking-widest text-black">
                                    Dr. Manish Kumar
                                </div>
                            </motion.div>
                        </motion.div>
                    </div>
                    {/* Unified Placement Ecosystem Card with Premium Hover Effects */}
                    <motion.div 
                        initial={{ opacity: 0, y: 75 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "30px" }}
                        transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
                        className="mt-12 md:mt-16 relative overflow-hidden rounded-none bg-[#07183d] border border-blue-900/50 hover:border-blue-400/60 shadow-[0_25px_60px_-15px_rgba(2,10,35,0.75)] hover:shadow-[0_30px_80px_-10px_rgba(2,10,35,0.95),0_0_50px_rgba(59,130,246,0.25)] transition-all duration-500 hover:-translate-y-1.5 group/card"
                    >
                        {/* Shimmering Top Accent Line on Card Hover */}
                        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-blue-400/0 group-hover/card:via-blue-400/80 to-transparent transition-all duration-700 pointer-events-none z-20" />

                        {/* Ambient royal dark blue & warm radial glow */}
                        <div className="absolute top-1/2 left-[60%] -translate-x-1/2 -translate-y-1/2 w-[540px] h-[380px] bg-gradient-to-r from-blue-600/25 via-indigo-500/15 to-transparent blur-3xl pointer-events-none rounded-full group-hover/card:from-blue-500/35 group-hover/card:scale-110 transition-all duration-700" />
                        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 group-hover/card:bg-blue-400/20 blur-2xl pointer-events-none rounded-full transition-all duration-700" />

                        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-8 lg:gap-12 items-center p-5 sm:p-10 md:p-14 lg:p-16">
                            {/* Left Column: Heading, Description & Action */}
                            <div className="lg:col-span-6 flex flex-col items-start max-w-xl">
                                <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-[40px] font-serif font-bold text-white group-hover/card:text-amber-50/95 tracking-tight leading-[1.15] transition-colors duration-300">
                                    Who should enroll?
                                </h3>
                                <p className="mt-2.5 sm:mt-4 md:mt-5 text-xs sm:text-sm md:text-base text-zinc-300 font-normal leading-relaxed">
                                    An integrated campus placement ecosystem designed for every stakeholder — empowering students, faculty mentors, placement officers, and corporate recruiters.
                                </p>
                                <button 
                                    onClick={() => { setActiveWorkflowRole('student'); setShowWorkflowModal(true); }}
                                    className="mt-4 sm:mt-6 md:mt-8 px-5 py-2 sm:px-6 sm:py-2.5 rounded-full border border-white/40 hover:border-amber-300 text-white hover:text-amber-200 text-xs sm:text-sm font-medium tracking-wide transition-all duration-300 hover:bg-amber-400/10 hover:shadow-[0_0_20px_rgba(242,206,133,0.25)] active:scale-95 inline-flex items-center gap-2 group cursor-pointer"
                                >
                                    <span>How it works</span>
                                    <ArrowRight className="w-4 h-4 text-amber-300 group-hover:translate-x-1 transition-transform" />
                                </button>
                            </div>

                            {/* Right Column: 2x2 Grid of Students, Faculty, TPO, Recruiter */}
                            <div className="lg:col-span-6 w-full max-w-md mx-auto lg:max-w-none grid grid-cols-2">
                                {/* Top-Left: Students */}
                                <button 
                                    onClick={() => { setActiveWorkflowRole('student'); setShowWorkflowModal(true); }}
                                    className="border-r border-b border-white/15 py-3.5 px-3 sm:py-6 md:py-8 sm:px-6 flex items-center justify-center cursor-pointer group hover:bg-amber-400/[0.08] hover:shadow-[inset_0_0_30px_rgba(242,206,133,0.12)] transition-all duration-300"
                                >
                                    <span className="font-serif font-bold text-base sm:text-xl md:text-2xl lg:text-3xl tracking-tight text-[#F2CE85] group-hover:text-[#FFE3A8] drop-shadow-[0_2px_12px_rgba(242,206,133,0.25)] group-hover:drop-shadow-[0_4px_22px_rgba(242,206,133,0.5)] select-none group-hover:scale-105 transition-all duration-300">
                                        Students
                                    </span>
                                </button>

                                {/* Top-Right: Faculty */}
                                <button 
                                    onClick={() => { setActiveWorkflowRole('faculty'); setShowWorkflowModal(true); }}
                                    className="border-b border-white/15 py-3.5 px-3 sm:py-6 md:py-8 sm:px-6 flex items-center justify-center cursor-pointer group hover:bg-amber-400/[0.08] hover:shadow-[inset_0_0_30px_rgba(242,206,133,0.12)] transition-all duration-300"
                                >
                                    <span className="font-serif font-bold text-base sm:text-xl md:text-2xl lg:text-3xl tracking-tight text-[#F2CE85] group-hover:text-[#FFE3A8] drop-shadow-[0_2px_12px_rgba(242,206,133,0.25)] group-hover:drop-shadow-[0_4px_22px_rgba(242,206,133,0.5)] select-none group-hover:scale-105 transition-all duration-300">
                                        Faculty
                                    </span>
                                </button>

                                {/* Bottom-Left: TPO */}
                                <button 
                                    onClick={() => { setActiveWorkflowRole('tpo'); setShowWorkflowModal(true); }}
                                    className="border-r border-white/15 py-3.5 px-3 sm:py-6 md:py-8 sm:px-6 flex items-center justify-center cursor-pointer group hover:bg-amber-400/[0.08] hover:shadow-[inset_0_0_30px_rgba(242,206,133,0.12)] transition-all duration-300"
                                >
                                    <span className="font-serif font-bold text-base sm:text-xl md:text-2xl lg:text-3xl tracking-tight text-[#F2CE85] group-hover:text-[#FFE3A8] drop-shadow-[0_2px_12px_rgba(242,206,133,0.25)] group-hover:drop-shadow-[0_4px_22px_rgba(242,206,133,0.5)] select-none group-hover:scale-105 transition-all duration-300">
                                        TPO
                                    </span>
                                </button>

                                {/* Bottom-Right: Recruiter */}
                                <button 
                                    onClick={() => { setActiveWorkflowRole('recruiter'); setShowWorkflowModal(true); }}
                                    className="py-3.5 px-3 sm:py-6 md:py-8 sm:px-6 flex items-center justify-center cursor-pointer group hover:bg-amber-400/[0.08] hover:shadow-[inset_0_0_30px_rgba(242,206,133,0.12)] transition-all duration-300"
                                >
                                    <span className="font-serif font-bold text-base sm:text-xl md:text-2xl lg:text-3xl tracking-tight text-[#F2CE85] group-hover:text-[#FFE3A8] drop-shadow-[0_2px_12px_rgba(242,206,133,0.25)] group-hover:drop-shadow-[0_4px_22px_rgba(242,206,133,0.5)] select-none group-hover:scale-105 transition-all duration-300">
                                        Recruiter
                                    </span>
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </motion.div>

            {/* FAQ Section */}
            <motion.section 
                initial={{ opacity: 0, y: 75 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "30px" }}
                transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
                className="py-24 bg-slate-50 relative overflow-hidden"
            >
                <div className="max-w-4xl mx-auto px-4 md:px-8 relative z-10">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className="text-sm font-bold tracking-widest text-black uppercase">
                            Frequently Asked Questions
                        </h2>
                        <p className={`mt-4 text-sm font-normal italic leading-relaxed tracking-wide max-w-2xl mx-auto transition-colors duration-500 ${isPaused ? pageStyles[pageTheme].syncText : 'text-blue-900'}`}>
                            Everything you need to know about CareerSync and how it can accelerate your placement journey.
                        </p>
                    </div>

                    <div className="space-y-4">
                        {faqs.map((faq, index) => (
                            <div 
                                key={index} 
                                className={`group relative border rounded-2xl overflow-hidden transition-all duration-500 cursor-pointer ${openFaq === index ? 'bg-white border-blue-900/20 shadow-[0_8px_30px_-10px_rgba(30,58,138,0.25)] scale-[1.01]' : 'bg-white/80 border-gray-100 shadow-sm hover:shadow-md hover:border-blue-900/30 hover:-translate-y-1'}`}
                            >
                                <div className={`absolute top-0 left-0 h-full w-1.5 bg-gradient-to-b from-blue-800 to-blue-950 transition-all duration-500 ${openFaq === index ? 'opacity-100' : 'opacity-0 group-hover:opacity-40'}`}></div>
                                <button
                                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                                    className="w-full px-7 py-6 flex items-center justify-between text-left focus:outline-none"
                                >
                                    <span className={`font-bold text-sm md:text-base tracking-tight pr-4 transition-colors duration-300 ${openFaq === index ? 'text-blue-900' : 'text-gray-900 group-hover:text-blue-900'}`}>
                                        {faq.question}
                                    </span>
                                    <div className={`flex items-center justify-center w-8 h-8 rounded-full transition-all duration-500 flex-shrink-0 ${openFaq === index ? 'bg-blue-900 text-white rotate-180 shadow-md shadow-blue-900/30' : 'bg-gray-50 text-gray-400 group-hover:bg-blue-900/10 group-hover:text-blue-900'}`}>
                                        <ChevronDown className="w-4 h-4 stroke-[3]" />
                                    </div>
                                </button>
                                <AnimatePresence>
                                    {openFaq === index && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.3, ease: "easeInOut" }}
                                        >
                                            <div className={`px-6 pb-6 border-t border-blue-100/50 pt-4 text-sm font-normal italic leading-relaxed tracking-wide transition-colors duration-500 ${isPaused ? pageStyles[pageTheme].syncText : 'text-blue-900'}`}>
                                                {faq.answer}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ))}
                    </div>
                </div>
            </motion.section>

            {/* CTA Banner Styled like Hero */}
            <motion.div initial={{ opacity: 0, y: 75 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "30px" }} transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }} className={`group/cta mt-8 sm:mt-16 mx-4 sm:mx-8 lg:mx-16 rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl mb-12 sm:mb-20 relative transition-all duration-700 hover:scale-[1.02] hover:shadow-2xl focus:shadow-2xl h-[280px] sm:h-[360px] md:h-[450px]`}>
                
                {/* 1. Full screen background image */}
                <div 
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0 transition-transform duration-1000 group-hover/cta:scale-110"
                    style={{ backgroundImage: `url(https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=60&w=1280&auto=format&fit=crop)` }}
                ></div>

                {/* 2. Left white gradient overlay for readability */}
                <div className="absolute inset-0 bg-gradient-to-r from-white via-white/95 to-transparent z-10 w-full sm:w-2/3 md:w-1/2"></div>

                {/* 3. Right dark diagonal polygon (matching Hero slide 1 style) */}
                <div className="hidden md:block absolute top-0 right-0 h-full w-1/2 bg-[#020817] z-10" style={{ clipPath: 'polygon(15% 0, 100% 0, 100% 100%, 0% 100%)' }}>
                    {/* Top Right Little Quote */}
                            <div className="absolute top-24 right-16 lg:right-20 z-20 opacity-70 text-right pointer-events-none">
                                <p className={`text-lg md:text-xl font-bold leading-relaxed tracking-wide drop-shadow-md ${currentSlide === 0 ? 'text-blue-400' : currentSlide === 1 ? 'text-indigo-300' : 'text-orange-400'}`}>
                                    {currentSlide === 0 ? '"Your professional journey begins here."' : currentSlide === 1 ? '"Accelerate your career growth today."' : '"Unlock your true professional potential."'}
                                </p>
                            </div>
                            {/* Background Watermark Icon */}
                            <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none overflow-hidden z-0 pl-16">
                                <GraduationCap className="w-96 h-96 text-white transform rotate-12 scale-150" strokeWidth={0.8} />
                            </div>
                            <div className="absolute inset-0 flex flex-col justify-center items-start pl-12 lg:pl-16 pr-6 text-white z-10">
                        <ul className="space-y-5">
                            <li className="flex items-center space-x-4">
                                <span className="bg-blue-600/20 text-blue-400 p-2 rounded-full"><CheckCircle className="w-5 h-5" /></span>
                                <span className="text-gray-100 font-medium tracking-wide">AI-Driven Profile Matching</span>
                            </li>
                            <li className="flex items-center space-x-4">
                                <span className="bg-blue-600/20 text-blue-400 p-2 rounded-full"><CheckCircle className="w-5 h-5" /></span>
                                <span className="text-gray-100 font-medium tracking-wide">Verified Academic Records</span>
                            </li>
                            <li className="flex items-center space-x-4">
                                <span className="bg-blue-600/20 text-blue-400 p-2 rounded-full"><CheckCircle className="w-5 h-5" /></span>
                                <span className="text-gray-100 font-medium tracking-wide">Instant Corporate Connect</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="absolute inset-0 px-5 sm:px-8 md:px-12 lg:px-20 py-6 sm:py-10 md:py-16 flex flex-col justify-center z-20">
                    <div className="w-full md:w-1/2 lg:w-[38%] max-w-lg">
                        <h2 className="text-2xl sm:text-3xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-2 sm:mb-4 md:mb-6 tracking-tight">
                            Start Connecting<br className="hidden sm:inline" /> With Industry<br className="hidden sm:inline" /> Today
                        </h2>
                        
                        <p className="text-xs sm:text-sm md:text-base text-gray-600 font-medium leading-relaxed tracking-wide mb-3 sm:mb-6 md:mb-8 line-clamp-2 sm:line-clamp-none">
                            CareerSync bridges the gap between ambition and opportunity. Empower your future with AI-driven insights and instant access to a verified talent pool.
                        </p>
                        
                        <Link to="/register" className={`inline-flex items-center text-white font-semibold px-5 py-2.5 sm:px-8 sm:py-4 text-xs sm:text-sm md:text-base rounded-full shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-blue-900 hover:bg-blue-800 hover:shadow-2xl focus:shadow-2xl`}>
                            <span>Get Started Now</span>
                            <ArrowRight className="w-4 h-4 md:w-5 md:h-5 ml-1.5 md:ml-2" />
                        </Link>
                    </div>
                </div>
            </motion.div>

        </motion.div>

        {/* Global Persistent Floating AI Chatbot */}

                {/* AI Chatbot Window */}
                <AnimatePresence>
                    {isChatOpen && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="fixed bottom-4 sm:bottom-6 md:bottom-24 right-4 sm:right-6 md:right-12 w-[calc(100vw-2rem)] sm:w-80 md:w-96 max-h-[min(520px,calc(100dvh-7rem))] bg-white z-[150] rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.25)] border border-gray-100 overflow-hidden flex flex-col"
                        >
                            {/* Chat Header */}
                            <div className={`p-4 flex justify-between items-center bg-gradient-to-r ${heroSlides[currentSlide].gradient}`}>
                                <div className="flex items-center space-x-2">
                                    <div className="bg-white p-1.5 rounded-full shadow-sm">
                                        <Bot className={`w-4 h-4 ${['text-[#020817]', 'text-[#431407]', 'text-blue-800'][currentSlide]}`} />
                                    </div>
                                    <span className={`font-bold text-white tracking-tight px-3 py-1 rounded-md text-sm shadow-sm transition-colors duration-500 ${currentSlide === 0 ? 'bg-[#020817]' : currentSlide === 1 ? 'bg-[#431407]' : 'bg-blue-800'}`}>CareerSync Assistant</span>
                                </div>
                                <button onClick={() => { 
                                    // If chat was ended, wipe history so it starts fresh next time
                                    if (messages.length > 0 && messages[messages.length - 1].text.includes("Thank you for connecting")) {
                                        setMessages([
                                            { sender: 'bot', text: "Hello. I am your specialized <b>CareerSync Assistant</b>.<br/><br/>I am here to help you navigate the platform, discover top jobs, and manage placements. How can I assist you today?" }
                                        ]);
                                    }
                                    setIsChatOpen(false); 
                                    setIsPaused(false); 
                                }} className="text-gray-800 hover:bg-black/10 p-1 rounded-full transition">
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                            
                            {/* Chat Body */}
                            <div ref={chatBodyRef} className="h-72 p-4 bg-gray-50 overflow-y-auto flex flex-col space-y-4">
                                <div className="text-xs text-center text-gray-400 font-medium my-1">Today</div>
                                {messages.map((msg, idx) => (
                                    <React.Fragment key={idx}>
                                        <div className={`p-3 rounded-2xl text-sm leading-relaxed shadow-sm max-w-[85%] ${msg.sender === 'user' ? 'bg-gray-800 text-white self-end rounded-tr-sm' : 'bg-white border border-gray-100 text-gray-700 self-start rounded-tl-sm'}`}>
                                            {msg.sender === 'user' ? (
                                                msg.text.split('\n').map((line, i) => (
                                                    <React.Fragment key={i}>
                                                        {line}
                                                        {i !== msg.text.split('\n').length - 1 && <br />}
                                                    </React.Fragment>
                                                ))
                                            ) : (
                                                <div dangerouslySetInnerHTML={{ __html: msg.text }} />
                                            )}
                                        </div>
                                        {msg.sender === 'bot' && idx === 0 && (
                                            <div className="grid grid-cols-3 gap-2 w-full max-w-[95%] self-start mt-2">
                                                {quickQueries.map((query, i) => (
                                                    <button 
                                                        key={i}
                                                        type="button"
                                                        disabled={isTyping}
                                                        onClick={() => handleSendMessage(null, query)}
                                                        className="text-[10px] px-1 py-1.5 bg-white border border-blue-500 text-blue-600 font-semibold rounded-lg shadow-sm hover:bg-blue-600 hover:text-white transition-colors disabled:opacity-50 flex items-center justify-center text-center leading-tight whitespace-normal"
                                                    >
                                                        {query}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                        {msg.sender === 'bot' && idx > 0 && idx === messages.length - 1 && !isTyping && !msg.text.includes("Thank you for connecting") && (
                                            <button 
                                                onClick={() => {
                                                    setMessages(prev => [...prev, { sender: 'bot', text: "Thank you for connecting with CareerSync! Have a great day." }]);
                                                }}
                                                className="flex items-center space-x-1 text-[10px] text-red-500 hover:text-white hover:bg-red-500 transition-all duration-200 mt-2 mb-2 self-start bg-white border border-red-500 rounded-full px-3 py-1.5 outline-none shadow-sm"
                                            >
                                                <X className="w-3 h-3" />
                                                <span className="font-medium tracking-wide">Close Chat</span>
                                            </button>
                                        )}
                                    </React.Fragment>
                                ))}
                                {isTyping && (
                                    <div className="bg-white p-4 rounded-2xl rounded-tl-sm border border-gray-100 shadow-sm self-start flex items-center space-x-1">
                                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                    </div>
                                )}
                                <div ref={chatEndRef} />
                            </div>
                            
                            
                            {/* Chat Input or Placeholder Banners */}
                              {messages.length > 0 && messages[messages.length - 1].text.includes("Thank you for connecting") ? (
                                  <div className="p-4 border-t border-gray-100 bg-gray-50 flex items-center justify-center text-center">
                                      <p className="text-[10px] text-gray-400 font-light tracking-wider">Chat closed. I hope your queries were resolved.</p>
                                  </div>
                              ) : messages.length === 1 ? (
                                  <div className="p-4 border-t border-gray-100 bg-gray-50 flex items-center justify-center text-center">
                                      <p className="text-[10px] text-gray-400 font-light tracking-wider">No conversation. Click on an icon above to proceed to chat.</p>
                                  </div>
                              ) : (
                                  <form onSubmit={(e) => handleSendMessage(e)} className="p-3 border-t border-gray-100 bg-white flex items-center space-x-2">
                                      <input 
                                          type="text" 
                                          value={chatInput}
                                          onChange={(e) => setChatInput(e.target.value)}
                                          placeholder="Ask me anything..." 
                                          className="flex-1 bg-gray-100 border-transparent focus:bg-white focus:border-gray-300 focus:ring-0 rounded-full px-4 py-2 text-sm transition outline-none" 
                                      />
                                      <button type="submit" disabled={!chatInput.trim() || isTyping} className={`p-2 rounded-full text-white shadow-md hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed ${['bg-blue-600 hover:bg-blue-700', 'bg-indigo-600 hover:bg-indigo-700', 'bg-amber-800 hover:bg-amber-900'][currentSlide]}`}>
                                          <ArrowRight className="w-4 h-4" />
                                      </button>
                                  </form>
                              )}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Hero Chatbot Icon (Bottom Right) */}
                <AnimatePresence>
                {!isChatOpen && (
                    <motion.button 
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
                        className={`fixed bottom-4 sm:bottom-6 md:bottom-24 right-4 sm:right-6 md:right-12 z-[150] p-3.5 rounded-full bg-white shadow-[0_10px_25px_-5px_rgba(0,0,0,0.3)] hover:shadow-2xl focus:shadow-2xl border-2 border-transparent hover:border-gray-100 transition-all duration-300 hover:scale-110 flex items-center justify-center group`}
                        onClick={() => {
                            setIsChatOpen(true);
                            setIsPaused(true);
                        }}
                    >
                        <span className="absolute bottom-full right-1/2 translate-x-1/2 mb-4 bg-gray-800 text-white text-[10px] font-semibold px-2.5 py-1 rounded-md opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-lg">CareerSync Assistant</span>
                        <Bot className={`w-7 h-7 transition-colors duration-500 ${['text-[#020817]', 'text-[#431407]', 'text-blue-800'][currentSlide]}`} />
                    </motion.button>
                )}
                </AnimatePresence>

        {/* Professional Cookie Consent Banner (Horizontal) */}
        <AnimatePresence>
            {showCookieConsent && (
                <motion.div
                    initial={{ opacity: 0, y: 50, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 20, scale: 0.95 }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    className="fixed bottom-2 md:bottom-6 left-1/2 -translate-x-1/2 z-[100] w-[94%] md:w-[calc(100%-48px)] max-w-4xl bg-white border border-gray-200 shadow-[0_20px_40px_rgba(0,0,0,0.12)] rounded-sm md:rounded-2xl px-4 py-3 md:px-6 md:py-4 flex flex-col md:flex-row items-center justify-between gap-3 md:gap-6"
                >
                    <button onClick={() => setShowCookieConsent(false)} className="absolute top-2 right-2 md:hidden text-gray-400 hover:text-gray-600 p-1"><X className="w-4 h-4" /></button>
                      <div className="flex items-center gap-4 flex-1">
                        <div className="flex-shrink-0 w-8 h-8 md:w-10 md:h-10 bg-gray-100 rounded-full flex items-center justify-center">
                            <Cookie className="w-4 h-4 md:w-5 md:h-5 text-gray-700" />
                        </div>
                        <div>
                            <h3 className="text-gray-900 font-bold text-xs md:text-sm tracking-tight m-0">We value your privacy</h3>
                            <p className="text-gray-500 text-[10px] md:text-xs leading-snug md:leading-relaxed m-0 mt-0.5 md:mt-1 max-w-3xl pr-4">
                                We use cookies and similar technologies to enhance your browsing experience, serve personalized content, and analyze our traffic. By clicking "Accept all", you consent to our use of these technologies. You can learn more about how we protect your data in our <a href="#" onClick={(e) => { e.preventDefault(); setShowPolicyModal('privacy'); }} className="text-gray-900 underline font-medium hover:text-black">Privacy Policy</a> and <a href="#" onClick={(e) => { e.preventDefault(); setShowPolicyModal('terms'); }} className="text-gray-900 underline font-medium hover:text-black">Terms of Service</a>.
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <button 
                            onClick={() => handleCookieConsent('essential')}
                            className="flex-1 md:flex-none px-4 py-2 md:px-6 md:py-2.5 bg-white hover:bg-gray-100 hover:text-black hover:border-gray-400 hover:shadow-md text-gray-700 border border-gray-300 text-xs font-semibold rounded-lg transition-all shadow-sm active:scale-95"
                        >
                            Reject all
                        </button>
                        <button 
                            onClick={() => handleCookieConsent('all')}
                            className="flex-1 md:flex-none px-4 py-2 md:px-6 md:py-2.5 bg-gray-900 hover:bg-blue-600 hover:shadow-lg hover:-translate-y-0.5 text-white text-xs font-semibold rounded-lg transition-all shadow-sm active:scale-95"
                        >
                            Accept all
                        </button>
                        <button onClick={() => setShowCookieConsent(false)} className="hidden md:flex text-gray-400 hover:text-gray-600 transition-colors p-1 ml-2">
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>

        {/* Policy Modals */}
        <AnimatePresence>
            {showPolicyModal && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ duration: 0.3 }}
                        className="relative w-full max-w-2xl bg-white border border-gray-200 shadow-[0_20px_60px_rgba(0,0,0,0.15)] rounded-2xl p-6 md:p-8 max-h-[80vh] overflow-y-auto"
                    >
                        <button onClick={() => setShowPolicyModal(null)} className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition-colors bg-gray-50 hover:bg-gray-100 rounded-full p-2">
                            <X className="w-5 h-5" />
                        </button>
                        <h3 className="text-gray-900 font-bold text-xl tracking-tight mb-4">
                            {showPolicyModal === 'privacy' ? 'Privacy Policy' : 'Terms of Service'}
                        </h3>
                        <div className="text-gray-500 text-sm leading-relaxed space-y-4">
                            {showPolicyModal === 'privacy' ? (
                                <>
                                    <p>At CareerSync, we take your privacy seriously. This Privacy Policy describes how we collect, use, and protect your personal data when you use our platform.</p>
                                    <h4 className="font-bold text-gray-900 text-sm mt-6 mb-2">1. Information We Collect</h4>
                                    <p>We collect information you provide directly to us, such as when you create or modify your account, request on-demand services, contact customer support, or otherwise communicate with us. This information may include: name, email, phone number, academic records, and resume data.</p>
                                    <h4 className="font-bold text-gray-900 text-sm mt-6 mb-2">2. How We Use Your Data</h4>
                                    <p>We use the information we collect to provide, maintain, and improve our services. We may also use the information to connect students with potential recruiters and academic faculty.</p>
                                    <h4 className="font-bold text-gray-900 text-sm mt-6 mb-2">3. Data Security</h4>
                                    <p>We implement appropriate technical and organizational measures to protect the personal data that we collect and process about you. The measures we use are designed to provide a level of security appropriate to the risk of processing your personal information.</p>
                                    <h4 className="font-bold text-gray-900 text-sm mt-6 mb-2">4. Your Data Rights</h4>
                                    <p>Depending on your location, you may have certain rights regarding your personal information, including the right to access, correct, update, or request deletion of your data. You can manage these preferences directly from your account dashboard.</p>
                                    <h4 className="font-bold text-gray-900 text-sm mt-6 mb-2">5. Third-Party Services</h4>
                                    <p>We may employ third-party companies and individuals to facilitate our service, provide the service on our behalf, or assist us in analyzing how our service is used. These third parties have access to your personal data only to perform these tasks on our behalf.</p>
                                </>
                            ) : (
                                <>
                                    <p>Welcome to CareerSync. By accessing or using our platform, you agree to be bound by these Terms of Service and our Privacy Policy.</p>
                                    <h4 className="font-bold text-gray-900 text-sm mt-6 mb-2">1. User Responsibilities</h4>
                                    <p>You must provide accurate and complete information when creating an account. You are responsible for safeguarding the password that you use to access the service and for any activities or actions under your password.</p>
                                    <h4 className="font-bold text-gray-900 text-sm mt-6 mb-2">2. Acceptable Use</h4>
                                    <p>You agree not to engage in any of the following prohibited activities: copying, distributing, or disclosing any part of the service in any medium; using any automated system to access the service; attempting to interfere with the servers running the service.</p>
                                    <h4 className="font-bold text-gray-900 text-sm mt-6 mb-2">3. Termination</h4>
                                    <p>We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms. Upon termination, your right to use the Service will immediately cease.</p>
                                    <h4 className="font-bold text-gray-900 text-sm mt-6 mb-2">4. Intellectual Property</h4>
                                    <p>The Service and its original content, features, and functionality are and will remain the exclusive property of CareerSync and its licensors. The Service is protected by copyright, trademark, and other laws.</p>
                                    <h4 className="font-bold text-gray-900 text-sm mt-6 mb-2">5. Limitation of Liability</h4>
                                    <p>In no event shall CareerSync, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, or other intangible losses, resulting from your access to or use of the Service.</p>
                                </>
                            )}
                        </div>
                        <div className="mt-8 pt-5 border-t border-gray-100 flex justify-end">
                            <button onClick={() => setShowPolicyModal(null)} className="px-6 py-2.5 bg-gray-900 hover:bg-black text-white text-xs font-semibold rounded-lg transition-all shadow-sm active:scale-95">
                                I Understand
                            </button>
                        </div>
                    </motion.div>






                </div>
            )}
        </AnimatePresence>        {/* Role Workflow Modal ("How it works") */}
        <AnimatePresence>
            {showWorkflowModal && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-3 sm:p-4 md:p-6 bg-black/75 backdrop-blur-md">
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ duration: 0.3 }}
                        className="relative w-full max-w-4xl bg-white border border-gray-200 shadow-[0_25px_70px_rgba(0,0,0,0.35)] rounded-2xl md:rounded-3xl flex flex-col max-h-[90vh] overflow-hidden"
                    >
                        {/* Header */}
                        <div className="p-5 sm:p-6 md:p-7 border-b border-gray-100 flex items-start justify-between bg-gradient-to-r from-gray-50 via-white to-gray-50">
                            <div>
                                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-900 border border-amber-200/60 mb-2">
                                    <span>Stakeholder Lifecycle & Operations</span>
                                </div>
                                <h3 className="text-xl sm:text-2xl md:text-3xl font-serif font-bold text-gray-900 tracking-tight">
                                    How CareerSync Works
                                </h3>
                                <p className="text-xs sm:text-sm text-gray-500 mt-1 max-w-xl">
                                    Select any role below to view their step-by-step end-to-end placement workflow.
                                </p>
                            </div>
                            <button 
                                onClick={() => setShowWorkflowModal(false)}
                                className="p-2 text-gray-400 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors flex-shrink-0 cursor-pointer"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Role Tabs */}
                        <div className="px-5 sm:px-7 pt-4 pb-3 border-b border-gray-100 bg-white flex items-center gap-2 overflow-x-auto">
                            {[
                                { id: 'student', label: 'Students', icon: GraduationCap },
                                { id: 'faculty', label: 'Faculty', icon: BookOpen },
                                { id: 'tpo', label: 'TPO (Placement)', icon: Briefcase },
                                { id: 'recruiter', label: 'Recruiter', icon: Users },
                            ].map((roleTab) => {
                                const IconComponent = roleTab.icon;
                                const isActive = activeWorkflowRole === roleTab.id;
                                return (
                                    <button
                                        key={roleTab.id}
                                        onClick={() => setActiveWorkflowRole(roleTab.id)}
                                        className={`flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl whitespace-nowrap transition-all duration-200 cursor-pointer ${
                                            isActive
                                                ? 'bg-gray-900 text-white shadow-md shadow-black/10 scale-[1.02]'
                                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900'
                                        }`}
                                    >
                                        <IconComponent className={`w-4 h-4 ${isActive ? 'text-[#F2CE85]' : 'text-gray-500'}`} />
                                        <span>{roleTab.label}</span>
                                    </button>
                                );
                            })}
                        </div>

                        {/* Active Role Content Body */}
                        <div className="p-5 sm:p-7 md:p-8 overflow-y-auto flex-1 bg-gray-50/60">
                            {roleWorkflows[activeWorkflowRole] && (
                                <div>
                                    {/* Role Banner */}
                                    <div className="bg-white border border-gray-200/80 rounded-2xl p-5 sm:p-6 mb-6 shadow-xs">
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
                                            <h4 className="text-lg sm:text-xl font-serif font-bold text-gray-900">
                                                {roleWorkflows[activeWorkflowRole].title}
                                            </h4>
                                            <span className={`inline-flex items-center text-[11px] font-bold px-3 py-1 rounded-full border self-start sm:self-auto ${roleWorkflows[activeWorkflowRole].badgeColor}`}>
                                                {roleWorkflows[activeWorkflowRole].badge}
                                            </span>
                                        </div>
                                        <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                                            {roleWorkflows[activeWorkflowRole].summary}
                                        </p>
                                    </div>

                                    {/* Workflow Steps Timeline */}
                                    <div className="space-y-4">
                                        {roleWorkflows[activeWorkflowRole].steps.map((st, idx) => (
                                            <div 
                                                key={idx}
                                                className="bg-white border border-gray-200/80 hover:border-gray-300 rounded-2xl p-4 sm:p-5 shadow-xs transition-all duration-200 flex items-start gap-4"
                                            >
                                                {/* Step Number Badge */}
                                                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gray-900 text-white font-bold text-xs sm:text-sm flex items-center justify-center flex-shrink-0 shadow-sm mt-0.5">
                                                    {st.step}
                                                </div>

                                                {/* Step Details */}
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1.5">
                                                        <h5 className="text-sm sm:text-base font-bold text-gray-900">
                                                            {st.title}
                                                        </h5>
                                                        <span className="text-[10px] font-semibold text-gray-500 bg-gray-100 px-2 py-0.5 rounded self-start sm:self-auto">
                                                            {st.highlight}
                                                        </span>
                                                    </div>
                                                    <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                                                        {st.description}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="p-4 px-6 sm:px-7 border-t border-gray-100 bg-white flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500">
                            <span className="text-center sm:text-left">
                                Role: <strong className="text-gray-900">{roleWorkflows[activeWorkflowRole]?.roleName}</strong> • {roleWorkflows[activeWorkflowRole]?.steps?.length} Stages Workflow
                            </span>
                            <div className="flex items-center gap-3 w-full sm:w-auto">
                                <Link
                                    to={activeWorkflowRole === 'student' ? '/register' : '/login'}
                                    onClick={() => setShowWorkflowModal(false)}
                                    className="flex-1 sm:flex-none px-5 py-2 bg-gray-900 hover:bg-black text-white font-medium rounded-xl transition-all text-center inline-flex items-center justify-center gap-1.5"
                                >
                                    <span>Enter Portal</span>
                                    <ArrowRight className="w-3.5 h-3.5" />
                                </Link>
                                <button
                                    onClick={() => setShowWorkflowModal(false)}
                                    className="px-5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition-all cursor-pointer"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>

        </>
    );
};

export default Home;

































































































