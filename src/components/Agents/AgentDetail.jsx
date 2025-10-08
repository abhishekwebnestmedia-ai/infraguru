import React from 'react';
import { useParams } from 'react-router-dom';
import { Plus } from 'lucide-react';
import LeadsTable from '../TableView'; // Using your existing TableView component

const AgentDetail = () => {
    const { id } = useParams();
    
    // Get agent name based on ID (similar to your employee structure)
    const getAgentById = (agentId) => {
        const agents = {
            1: { name: "Arjun Sharma" },
            2: { name: "Priya Patel" },
            3: { name: "Rajesh Kumar" },
            4: { name: "Sneha Reddy" },
            5: { name: "Vikram Singh" },
            6: { name: "Kavya Nair" },
            7: { name: "Rohit Gupta" },
        };
        return agents[agentId] || { name: "Shashak" };
    };

    const agent = getAgentById(id);

    return (
        <div className="">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-medium text-[#020619]">
                    {agent.name}
                </h1>
                
                {/* Buttons matching the image */}
                <div className="flex gap-4">
                    <button className="px-4 py-2 bg-[var(--blue600)] text-white rounded-lg hover:bg-[var(--blue700)] transition-colors">
                        Leads Assigned
                    </button>
                    <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors">
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
