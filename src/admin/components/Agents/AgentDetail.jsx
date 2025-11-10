import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Plus, ChevronDown, ChevronUp, User, Mail, Smartphone, BookUser, HeartHandshake } from 'lucide-react';
import LeadsTable from '../TableView';
import api from '../../../shared/services/apiService';

const AgentDetail = () => {
    const { id } = useParams();
    const [showMobileDetails, setShowMobileDetails] = useState(false);
    
    const [agent, setAgent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState(null);

    useEffect(() => {
        let isMounted = true;
        const load = async () => {
            try {
                setLoading(true); setErr(null);
                const resp = await api.get('/auth/teams');
                const list = resp?.data?.users || [];
                const found = list.find(u => String(u._id) === String(id));
                if (!found) {
                    if (isMounted) setAgent(null);
                    return;
                }
                const normalized = {
                    name: found.name || 'N/A',
                    empId: found.empid || found.empId || 'N/A',
                    email: found.email || 'N/A',
                    phone: found.phoneNumber || found.phone || 'N/A',
                    leadsAssigned: found?.stats?.transferredLeads ?? 0,
                    leadsGenerated: found?.stats?.generatedLeads ?? 0,
                    successfulLeads: found?.stats?.closedLeads ?? 0,
                };
                if (isMounted) setAgent(normalized);
            } catch (e) {
                console.error('AgentDetail: failed to load', e);
                if (isMounted) setErr(e);
            } finally {
                if (isMounted) setLoading(false);
            }
        };
        load();
        return () => { isMounted = false; };
    }, [id]);

    return (
        <div className="">
            {/* Mobile Agent Details Dropdown - Only visible on mobile */}
            <div className="md:hidden mb-4">
                <button
                    onClick={() => setShowMobileDetails(!showMobileDetails)}
                    className="w-full flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200 hover:bg-gray-50"
                >
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-[var(--blue700)] flex items-center justify-center">
                            <User size={16} className="text-white" />
                        </div>
                        <div className="text-left">
                            <p className="text-sm font-medium text-[#002A80]">Agent Details</p>
                            <p className="text-xs text-[#002A8060]">{agent?.name}</p>
                        </div>
                    </div>
                    {showMobileDetails ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>

                {/* Mobile Dropdown Content */}
                {showMobileDetails && (
                    <div className="mt-2 bg-white rounded-lg border border-gray-200 p-3 space-y-3">
                        {/* Name */}
                        <div className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                            <div className="w-8 h-8 rounded-lg bg-[var(--blue700)] flex items-center justify-center">
                                <User size={16} className="text-white" />
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-medium text-[#002A80]">{agent?.name}</p>
                                <p className="text-xs text-[#002A8060]">Name</p>
                            </div>
                        </div>

                        {/* Leads Assigned */}
                        <div className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                            <div className="w-8 h-8 rounded-lg bg-[var(--blue700)] flex items-center justify-center">
                                <BookUser size={16} className="text-white" />
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-medium text-[#002A80]">{agent?.leadsAssigned?.toLocaleString?.()}</p>
                                <p className="text-xs text-[#002A8060]">Leads Assigned</p>
                            </div>
                        </div>

                        {/* Successful Leads */}
                        <div className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                            <div className="w-8 h-8 rounded-lg bg-[var(--blue700)] flex items-center justify-center">
                                <HeartHandshake size={16} className="text-white" />
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-medium text-[#002A80]">{agent?.successfulLeads?.toLocaleString?.()}</p>
                                <p className="text-xs text-[#002A8060]">Successful Leads</p>
                            </div>
                        </div>

                        {/* Leads Generated */}
                        <div className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                            <div className="w-8 h-8 rounded-lg bg-[var(--blue700)] flex items-center justify-center">
                                <HeartHandshake size={16} className="text-white" />
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-medium text-[#002A80]">{agent?.leadsGenerated?.toLocaleString?.()}</p>
                                <p className="text-xs text-[#002A8060]">Leads Generated</p>
                            </div>
                        </div>

                        {/* Email */}
                        <div className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                            <div className="w-8 h-8 rounded-lg bg-[var(--blue700)] flex items-center justify-center">
                                <Mail size={16} className="text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-[#002A80] truncate">{agent?.email}</p>
                                <p className="text-xs text-[#002A8060]">Email</p>
                            </div>
                        </div>

                        {/* Phone */}
                        <div className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                            <div className="w-8 h-8 rounded-lg bg-[var(--blue700)] flex items-center justify-center">
                                <Smartphone size={16} className="text-white" />
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-medium text-[#002A80]">{agent?.phone}</p>
                                <p className="text-xs text-[#002A8060]">Phone No.</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <h1 className="section-heading text-[#020619]">
                    {agent?.name || 'Agent'}
                </h1>
                
                {/* Buttons matching the image - Responsive */}
                <div className="flex  sm:flex-row gap-2 sm:gap-4 w-full sm:w-auto">
                    <button className="px-4 py-2 bg-[var(--blue600)] text-white rounded-lg hover:bg-[var(--blue700)] transition-colors text-sm">
                        Leads Assigned
                    </button>
                    <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm">
                        Leads Generated
                    </button>
                </div>
            </div>

            {/* Table Component - pass username so the table uses the user-specific leads API */}
            {agent ? (
                <LeadsTable username={agent.name} />
            ) : (
                loading ? <div className="p-4">Loading agent...</div> : err ? <div className="p-4 text-red-600">Failed to load agent</div> : <div className="p-4">Agent not found</div>
            )}
        </div>
    );
};

export default AgentDetail;
