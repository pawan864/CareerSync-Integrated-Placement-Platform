import React, { useState } from 'react';
import { Map, CheckCircle2, Circle, ChevronDown, ChevronUp, Sparkles, BookOpen } from 'lucide-react';

const CareerPathways = () => {
    const pathways = [
        {
            id: 'fsd',
            title: 'Full Stack Software Engineer',
            desc: 'Frontend architecture to scalable microservices and database clustering.',
            milestones: [
                { title: 'Core Web Standards', items: ['Modern JavaScript (ES6+)', 'DOM Manipulation', 'CSS Grid & Flexbox'], done: true },
                { title: 'Frontend Component Architecture', items: ['React.js State Management', 'Component Lifecycle & Custom Hooks', 'TailwindCSS Styling'], done: true },
                { title: 'Backend & API Engineering', items: ['Node.js & Express REST APIs', 'Authentication & JWT Middleware', 'Data Validation'], done: false },
                { title: 'Database & Cloud Architecture', items: ['MongoDB Schema Indexing', 'PostgreSQL Relational Design', 'Docker Containerization & CI/CD'], done: false }
            ]
        },
        {
            id: 'ds',
            title: 'Data Scientist & Machine Learning Engineer',
            desc: 'Statistical modeling, data pipelines, predictive analytics and LLM deployments.',
            milestones: [
                { title: 'Mathematics & Data Manipulation', items: ['Python for Data Analysis', 'Pandas & NumPy Vectorization', 'Exploratory Data Analysis'], done: true },
                { title: 'Machine Learning Fundamentals', items: ['Scikit-Learn Supervised Models', 'Regression & Classification', 'Model Evaluation & Cross-Validation'], done: false },
                { title: 'Deep Learning & NLP', items: ['PyTorch / TensorFlow Architecture', 'Convolutional & Recurrent Networks', 'Hugging Face Transformers'], done: false },
                { title: 'Production MLOps', items: ['Model Serving with FastAPI', 'MLflow Tracking', 'Pipeline Deployment & Monitoring'], done: false }
            ]
        }
    ];

    const [expandedId, setExpandedId] = useState('fsd');

    return (
        <div className="max-w-6xl mx-auto pb-12">
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 tracking-tight flex items-center">
                    <Map className="w-8 h-8 mr-3 text-blue-600" />
                    Career Roadmaps & Skill Pathways
                </h2>
                <p className="text-gray-600 text-sm mt-1">Explore structured technical roadmaps and track milestone progress towards your target career.</p>
            </div>

            <div className="space-y-6">
                {pathways.map(pathway => {
                    const isExpanded = expandedId === pathway.id;
                    return (
                        <div key={pathway.id} className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                            <div 
                                onClick={() => setExpandedId(isExpanded ? null : pathway.id)}
                                className="p-6 cursor-pointer hover:bg-gray-50 flex items-center justify-between transition-colors"
                            >
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-1">{pathway.title}</h3>
                                    <p className="text-xs text-gray-500">{pathway.desc}</p>
                                </div>
                                <div className="p-2 text-gray-400">
                                    {isExpanded ? <ChevronUp className="w-5 h-5 text-blue-600" /> : <ChevronDown className="w-5 h-5" />}
                                </div>
                            </div>

                            {isExpanded && (
                                <div className="p-6 border-t border-gray-100 bg-gray-50/50 space-y-6">
                                    <div className="space-y-4">
                                        {pathway.milestones.map((m, idx) => (
                                            <div key={idx} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm flex items-start gap-4">
                                                <div className="mt-0.5">
                                                    {m.done ? (
                                                        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                                                    ) : (
                                                        <Circle className="w-5 h-5 text-gray-300" />
                                                    )}
                                                </div>
                                                <div className="flex-1">
                                                    <h4 className="font-bold text-gray-900 text-sm mb-1">{m.title}</h4>
                                                    <div className="flex flex-wrap gap-1.5">
                                                        {m.items.map((it, i) => (
                                                            <span key={i} className="text-[11px] bg-gray-100 text-gray-700 px-2 py-0.5 rounded font-medium">
                                                                {it}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default CareerPathways;
