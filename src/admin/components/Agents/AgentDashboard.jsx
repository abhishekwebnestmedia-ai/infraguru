import React from 'react'
import { User } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useTeam } from '../../../shared/hooks/useTeam'

const AgentDashboard = () => {
    const navigate = useNavigate();
    const { agents, loading, error } = useTeam();

    const handleEmployeeClick = (employeeId) => {
        navigate(`/agent/${employeeId}`);
    };

    return (
        <div className="">
            {/* Page Title */}
            <div className=" text-[var(--text)] section-heading mb-8">
                Agents
            </div>

            {/* Loading / Error states */}
            {loading && (
                <div className="text-gray-500">Loading agents…</div>
            )}
            {error && (
                <div className="text-red-600">Failed to load agents</div>
            )}

            {/* Agents Grid */}
            <div className="flex flex-wrap gap-3 md:gap-6 justify-center md:justify-start">
                {(agents || []).map((agent) => (
                    <EmployeeCard
                        key={agent._id || agent.id}
                        employee={agent}
                        onClick={() => handleEmployeeClick(agent._id || agent.id)}
                    />
                ))}
            </div>
        </div>
    )
}

// Updated Employee Card Component with click handler
const EmployeeCard = ({ employee, onClick }) => {
    return (
        <div 
            className="flex flex-col items-center text-center space-y-3 p-2 flex-shrink-0 cursor-pointer hover:bg-gray-50 rounded-lg transition-all duration-200" 
            style={{ minWidth: '120px', maxWidth: '150px' }}
            onClick={onClick}
        >
            {/* Avatar Circle */}
            <div
                className="w-16 h-16 rounded-full flex items-center justify-center transition-transform hover:scale-105"
                style={{ backgroundColor: 'var(--blue200)' }}
            >
                <User
                    size={24}
                    className="text-white"
                />
            </div>

            {/* Employee Name */}
            <h3
                className="text-sm font-semibold line-clamp-2"
                style={{ color: 'var(--blue900)' }}
            >
                {employee.name}
            </h3>

            {/* Designation */}
            <p
                className="text-xs line-clamp-2"
                style={{ color: 'var(--blue600)' }}
            >
                {employee.designation}
            </p>
        </div>
    )
}

export default AgentDashboard
