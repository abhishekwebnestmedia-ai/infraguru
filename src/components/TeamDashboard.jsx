import React, { useState, useEffect } from 'react'
import { User } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import api from '../services/apiService'

const TeamDashboard = () => {
    const navigate = useNavigate();
    const [users, setUsers] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchTeams = async () => {
            try {
                setIsLoading(true)
                setError(null)
                const response = await api.get('/auth/teams')
                const userData = response.data?.users || []
                
                // Debug: Log the structure of user data
                console.log('Team API response:', response.data);
                console.log('Users array:', userData);
                if (userData.length > 0) {
                    console.log('First user object structure:', userData[0]);
                    console.log('Available fields:', Object.keys(userData[0]));
                }
                
                setUsers(userData)
            } catch (err) {
                setError(err)
                console.error('Error fetching team members:', err)
            } finally {
                setIsLoading(false)
            }
        }

        fetchTeams()
    }, [])

    const handleEmployeeClick = (employee) => {
        // Debug: Check what fields are available
        console.log('Employee object:', employee);
        
        // Use employee ID for navigation to maintain UI consistency
        const employeeId = employee._id || employee.id;
        
        if (!employeeId) {
            console.error('No employee ID found for employee:', employee);
            return;
        }
        
        // Navigate to employee leads page (this will use EmployeeDetailLayout)
        navigate(`/employee/${employeeId}/leads`)
    }

    return (
        <div className="">
            {/* Page Title */}
            <div className="text-[var(--text)] section-heading mb-8">
                Team Dashboard
            </div>

            {isLoading && (
                <div className="text-sm text-gray-500">Loading team members...</div>
            )}

            {error && (
                <div className="text-sm text-red-500">{error.message || 'Error loading team members'}</div>
            )}

            {/* Employee Flex Container */}
            <div className="flex flex-wrap gap:1 md:gap-6 justify-center md:justify-start">
                {users.map((employee) => (
                    <EmployeeCard
                        key={employee._id}
                        employee={employee}
                        onClick={() => handleEmployeeClick(employee)}
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
