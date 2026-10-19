import React, { useState, useEffect, useContext } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';

const JobBoard = () => {
    const { user } = useContext(AuthContext);
    const [searchParams] = useSearchParams();
    const typeParam = searchParams.get('type');

    const [opportunities, setOpportunities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState(() => {
        if (typeParam?.toLowerCase() === 'internship') return 'Internship';
        if (typeParam?.toLowerCase() === 'placement') return 'Placement';
        if (typeParam?.toLowerCase() === 'project') return 'Project';
        return '';
    });

    useEffect(() => {
        if (typeParam) {
            if (typeParam.toLowerCase() === 'internship') setFilter('Internship');
            else if (typeParam.toLowerCase() === 'placement') setFilter('Placement');
            else if (typeParam.toLowerCase() === 'project') setFilter('Project');
        }
    }, [typeParam]);

    useEffect(() => {
        fetchOpportunities();
    }, [filter]);

    const fetchOpportunities = async () => {
        setLoading(true);
        try {
            const url = filter ? `/opportunities?type=${filter}` : '/opportunities';
            const res = await api.get(url);
            if (res.data.success) {
                setOpportunities(res.data.data);
            }
        } catch (error) {
            console.error('Error fetching opportunities', error);
        } finally {
            setLoading(false);
        }
    };

    const handleApply = async (id) => {
        try {
            const res = await api.post(`/opportunities/${id}/apply`);
            if (res.data.success) {
                alert('Successfully applied!');
            }
        } catch (error) {
            alert(error.response?.data?.error || 'Failed to apply');
        }
    };

    return (
        <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Opportunities Board</h1>
                <select 
                    value={filter} 
                    onChange={(e) => setFilter(e.target.value)}
                    className="mt-1 block pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md border"
                >
                    <option value="">All Types</option>
                    <option value="Internship">Internships</option>
                    <option value="Placement">Placements</option>
                    <option value="Project">Industry Projects</option>
                </select>
            </div>

            {loading ? (
                <p>Loading...</p>
            ) : (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {opportunities.map(opp => (
                        <div key={opp._id} className="bg-white rounded-lg shadow p-6 flex flex-col justify-between">
                            <div>
                                <div className="flex justify-between items-start">
                                    <h2 className="text-xl font-bold text-gray-900">{opp.title}</h2>
                                    <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                                        opp.type === 'Internship' ? 'bg-blue-100 text-blue-800' :
                                        opp.type === 'Placement' ? 'bg-green-100 text-green-800' :
                                        'bg-purple-100 text-purple-800'
                                    }`}>
                                        {opp.type}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-500 mt-1">{opp.company?.companyName}</p>
                                
                                <div className="mt-4 text-sm text-gray-600 space-y-2">
                                    <p><strong>Location:</strong> {opp.location} ({opp.workMode})</p>
                                    <p><strong>Duration:</strong> {opp.duration}</p>
                                    <p><strong>Stipend/Salary:</strong> {opp.stipendOrSalary}</p>
                                </div>
                                
                                <div className="mt-4">
                                    <h4 className="text-sm font-semibold text-gray-900">Required Skills:</h4>
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {opp.requiredSkills.map((skill, idx) => (
                                            <span key={idx} className="bg-gray-100 text-gray-700 px-2 py-1 text-xs rounded">
                                                {skill.name}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {user?.role === 'student' && opp.matchScore !== undefined && (
                                    <div className="mt-4 bg-indigo-50 p-2 rounded">
                                        <p className="text-sm font-medium text-indigo-900">
                                            Your Skill Match: {opp.matchScore}%
                                        </p>
                                    </div>
                                )}
                            </div>
                            
                            {user?.role === 'student' && (
                                <button 
                                    onClick={() => handleApply(opp._id)}
                                    className="mt-6 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
                                >
                                    Apply Now
                                </button>
                            )}
                        </div>
                    ))}
                    {opportunities.length === 0 && <p className="text-gray-500 col-span-3">No opportunities found.</p>}
                </div>
            )}
        </div>
    );
};

export default JobBoard;
