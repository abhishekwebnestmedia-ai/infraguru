import React, { useState, useEffect } from "react";
import { Pencil, Trash2, ChevronDown, Filter, FileInput, ArrowUpRight, RefreshCw } from "lucide-react";
import api from "../services/apiService";

const TeamLeadsAssigned = () => {
    const [teamData, setTeamData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [expandedRows, setExpandedRows] = useState(new Set());

    const fetchTeamData = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await api.get('/lead/teamassigned');

            // Log the full response for debugging
            console.log('[TeamLeadsAssigned] /lead/teamassigned response:', response);
            console.log('[TeamLeadsAssigned] response.data:', response.data);

            if (response.data && response.data.success) {
                // Also log the data payload specifically
                console.log('[TeamLeadsAssigned] response.data.data:', response.data.data);
                setTeamData(response.data.data);
            } else {
                console.warn('[TeamLeadsAssigned] Unexpected response shape or success=false', response.data);
                setError('Failed to fetch team data');
            }
        } catch (err) {
            console.error('Error fetching team data:', err);
            setError('Failed to load team data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTeamData();
    }, []);

    const toggleRowExpansion = (index) => {
        const newExpanded = new Set(expandedRows);
        if (newExpanded.has(index)) {
            newExpanded.delete(index);
        } else {
            newExpanded.add(index);
        }
        setExpandedRows(newExpanded);
    };

    if (loading) {
        return (
            <section className="rounded-xl mt-7 md:mt-2">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4">
                    <h2 className="section-heading">Team Leads Assigned</h2>
                </div>
                <div className="overflow-hidden rounded-3xl bg-white shadow-sm">
                    <div className="flex items-center justify-center py-16">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                            <p className="text-gray-600">Loading team data...</p>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <section className="rounded-xl mt-7 md:mt-2">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4">
                    <h2 className="section-heading">Team Leads Assigned</h2>
                </div>
                <div className="overflow-hidden rounded-3xl bg-white shadow-sm">
                    <div className="flex items-center justify-center py-16">
                        <div className="text-center">
                            <p className="text-red-600 mb-2">Error loading team data</p>
                            <p className="text-gray-500 text-sm">{error}</p>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="rounded-xl mt-7 md:mt-2">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4">
                <h2 className="section-heading">Team Leads Assigned</h2>
                <div className="flex flex-wrap gap-3 sm:gap-5 lg:gap-3 text-[13px] text-gray-600 font-medium">
                    <button 
                        onClick={fetchTeamData}
                        disabled={loading}
                        className="flex items-center gap-1 hover:text-cyan-600 disabled:opacity-50"
                    >
                        <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
                        Refresh
                    </button>
                    <button className="flex items-center gap-1 hover:text-cyan-600">
                        View All <ArrowUpRight size={16} />
                    </button>
                    <button className="flex items-center gap-1 hover:text-cyan-600">
                        Filter <Filter size={16} />
                    </button>
                    <button className="flex items-center gap-1 hover:text-cyan-600">
                        Download PDF <FileInput size={16} />
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-hidden rounded-3xl bg-white shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm min-w-[800px] lg:min-w-[700px]">
                        <thead className="bg-[#FAFBFC] text-gray-500 border-b border-[#EDF2F6]">
                            <tr>
                                <th className="text-left text-sm px-5 lg:px-4 py-6 font-medium">Name</th>
                                <th className="text-left text-sm px-5 lg:px-4 py-6 font-medium">No. of Leads Assigned</th>
                                <th className="text-left text-sm px-5 lg:px-4 py-6 font-medium">No. of Hot Leads Assigned</th>
                                <th className="text-left text-sm px-5 lg:px-4 py-6 font-medium">Action</th>
                            </tr>
                        </thead>
                        <tbody className="p-5">
                            {teamData.map((member, i) => (
                                <React.Fragment key={i}>
                                    <tr className="border-b border-[#EDF2F6] hover:bg-gray-50">
                                        <td className="px-5 lg:px-4 py-3">
                                            <div className="flex flex-col">
                                                <span className="">{member.name}</span>
                                       
                                            </div>
                                        </td>
                                        <td className="px-5 lg:px-4 py-3">
                                            <div className="flex flex-col sm:flex-row sm:gap-6 sm:items-center">
                                                <span className="font-medium min-w-[3rem]">{member.totalLeads}</span>
                                                {member.totalLeads > 0 && (
                                                    <button 
                                                        onClick={() => toggleRowExpansion(i)}
                                                        className="flex gap-2 items-center mt-1 sm:mt-0 text-cyan-600 hover:text-cyan-700"
                                                    >
                                                        <p className="leading-none text-xs sm:text-sm">
                                                            {expandedRows.has(i) ? 'hide details' : 'view more'}
                                                        </p>
                                                        <ChevronDown 
                                                            size={16} 
                                                            className={`transition-transform ${expandedRows.has(i) ? 'rotate-180' : ''}`}
                                                        />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-5 lg:px-4 py-3">
                                            <span className="text-red-500 font-medium">{member.hotLeads}</span>
                                        </td>
                                        <td className="px-5 lg:px-4 py-3">
                                            <div className="flex items-center gap-3">
                                                <Pencil size={16} className="text-green-500 cursor-pointer hover:text-green-600" />
                                                <Trash2 size={16} className="text-red-500 cursor-pointer hover:text-red-600" />
                                            </div>
                                        </td>
                                    </tr>
                                    {/* Expanded Status Breakdown Row */}
                                    {expandedRows.has(i) && member.statusBreakdown && (
                                        <tr className="bg-gray-50">
                                            <td colSpan="4" className="px-5 lg:px-4 py-4">
                                                <div className="ml-8">
                                                    <h4 className="text-sm font-semibold text-gray-700 mb-3">Status Breakdown:</h4>
                                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
                                                        {Object.entries(member.statusBreakdown).map(([status, count]) => (
                                                            <div key={status} className="bg-white rounded-lg p-3 shadow-sm border border-gray-200">
                                                                <p className="text-xs text-gray-500 mb-1">{status}</p>
                                                                <p className="text-lg font-bold text-gray-800">{count}</p>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            ))}
                            {teamData.length === 0 && (
                                <tr>
                                    <td colSpan="4" className="px-5 py-8 text-center text-gray-500">
                                        No team members found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
    );
};

export default TeamLeadsAssigned;
