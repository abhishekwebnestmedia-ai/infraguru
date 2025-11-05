import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Plus, ChevronDown, ChevronUp, User, Mail, Smartphone, BookUser, HeartHandshake } from 'lucide-react';
import LeadsTable from '../TableView';

const AgentDetail = () => {
    const { id } = useParams();
    const [showMobileDetails, setShowMobileDetails] = useState(false);
    
    // Get agent data based on ID (extended with full details)
    const getAgentById = (agentId) => {
        const agents = {
            1: { name: "Arjun Sharma", empId: "007", email: "arjun@infraguru.com", phone: "+91 8171 839 997", leadsAssigned: 12333, leadsGenerated: 32345, successfulLeads: 42333 },
            2: { name: "Priya Patel", empId: "008", email: "priya@infraguru.com", phone: "+91 8171 839 998", leadsAssigned: 10500, leadsGenerated: 28450, successfulLeads: 38200 },
            3: { name: "Rajesh Kumar", empId: "009", email: "rajesh@infraguru.com", phone: "+91 8171 839 999", leadsAssigned: 15600, leadsGenerated: 45200, successfulLeads: 51000 },
            4: { name: "Sneha Reddy", empId: "010", email: "sneha@infraguru.com", phone: "+91 8171 839 990", leadsAssigned: 8900, leadsGenerated: 19800, successfulLeads: 28600 },
            5: { name: "Vikram Singh", empId: "011", email: "vikram@infraguru.com", phone: "+91 8171 839 991", leadsAssigned: 13400, leadsGenerated: 35600, successfulLeads: 41200 },
            6: { name: "Kavya Nair", empId: "012", email: "kavya@infraguru.com", phone: "+91 8171 839 992", leadsAssigned: 11200, leadsGenerated: 25800, successfulLeads: 33400 },
            7: { name: "Rohit Gupta", empId: "013", email: "rohit@infraguru.com", phone: "+91 8171 839 993", leadsAssigned: 9800, leadsGenerated: 22100, successfulLeads: 29700 },
        };
        return agents[agentId] || { name: "Shashank", empId: "007", email: "agent@infraguru.com", phone: "+91 8171 839 997", leadsAssigned: 12333, leadsGenerated: 32345, successfulLeads: 42333 };
    };

    const agent = getAgentById(id);

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
                            <p className="text-xs text-[#002A8060]">{agent.name}</p>
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
                                <p className="text-sm font-medium text-[#002A80]">{agent.name}</p>
                                <p className="text-xs text-[#002A8060]">Name</p>
                            </div>
                        </div>

                        {/* Leads Assigned */}
                        <div className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                            <div className="w-8 h-8 rounded-lg bg-[var(--blue700)] flex items-center justify-center">
                                <BookUser size={16} className="text-white" />
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-medium text-[#002A80]">{agent.leadsAssigned.toLocaleString()}</p>
                                <p className="text-xs text-[#002A8060]">Leads Assigned</p>
                            </div>
                        </div>

                        {/* Successful Leads */}
                        <div className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                            <div className="w-8 h-8 rounded-lg bg-[var(--blue700)] flex items-center justify-center">
                                <HeartHandshake size={16} className="text-white" />
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-medium text-[#002A80]">{agent.successfulLeads.toLocaleString()}</p>
                                <p className="text-xs text-[#002A8060]">Successful Leads</p>
                            </div>
                        </div>

                        {/* Leads Generated */}
                        <div className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                            <div className="w-8 h-8 rounded-lg bg-[var(--blue700)] flex items-center justify-center">
                                <HeartHandshake size={16} className="text-white" />
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-medium text-[#002A80]">{agent.leadsGenerated.toLocaleString()}</p>
                                <p className="text-xs text-[#002A8060]">Leads Generated</p>
                            </div>
                        </div>

                        {/* Email */}
                        <div className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                            <div className="w-8 h-8 rounded-lg bg-[var(--blue700)] flex items-center justify-center">
                                <Mail size={16} className="text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-[#002A80] truncate">{agent.email}</p>
                                <p className="text-xs text-[#002A8060]">Email</p>
                            </div>
                        </div>

                        {/* Phone */}
                        <div className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                            <div className="w-8 h-8 rounded-lg bg-[var(--blue700)] flex items-center justify-center">
                                <Smartphone size={16} className="text-white" />
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-medium text-[#002A80]">{agent.phone}</p>
                                <p className="text-xs text-[#002A8060]">Phone No.</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <h1 className="section-heading text-[#020619]">
                    {agent.name}
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

            {/* Table Component */}
            <LeadsTable />
        </div>
    );
};

export default AgentDetail;
