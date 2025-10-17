import React from 'react'
import { User } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const TeamDashboard = () => {
    const navigate = useNavigate();
    
    const employees = [
        { id: 1, name: "Arjun Sharma", designation: "Senior Developer" },
        { id: 2, name: "Priya Patel", designation: "UI/UX Designer" },
        { id: 3, name: "Rajesh Kumar", designation: "Project Manager" },
        { id: 4, name: "Sneha Reddy", designation: "DevOps Engineer" },
        { id: 5, name: "Vikram Singh", designation: "Frontend Developer" },
        { id: 6, name: "Kavya Nair", designation: "Backend Developer" },
        { id: 7, name: "Rohit Gupta", designation: "QA Engineer" },
    ];

    const handleEmployeeClick = (employeeId) => {
        navigate(`/employee/${employeeId}`);
    };

    return (
        <div className="">
            {/* Page Title */}
            <div className="text-[var(--text)] section-heading mb-8">
                Team Dashboard
            </div>

            {/* Employee Flex Container */}
            <div className="flex flex-wrap gap:1 md:gap-6 justify-center md:justify-start">
                {employees.map((employee) => (
                    <EmployeeCard
                        key={employee.id}
                        employee={employee}
                        onClick={() => handleEmployeeClick(employee.id)}
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

export default TeamDashboard
