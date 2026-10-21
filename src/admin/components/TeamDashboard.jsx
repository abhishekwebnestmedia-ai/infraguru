import React, { useState, useEffect } from 'react'
import { User, Users, TrendingUp, Calendar, Mail, Phone, Activity, Target, Award, Clock } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import api from '../../shared/services/apiService'


const TeamDashboard = () => {
    const navigate = useNavigate();

    const [users, setUsers] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(null)
    const [teamStats, setTeamStats] = useState({
        totalMembers: 0,
        activeMembers: 0,
        totalLeads: 0,
        avgPerformance: 0,
        newMembers: 0
    })

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
                setTeamStats({
                    totalMembers: userData.length,
                    activeMembers: userData.filter(u => u.status === 'active').length,
                    totalLeads: userData.reduce((sum, user) => sum + (user.stats?.closedLeads || 0) + (user.stats?.transferredLeads || 0), 0),
                    avgPerformance: 0, // Will be calculated from actual data
                    newMembers: userData.filter(u => {
                        const joinDate = new Date(u.createdAt || u.joinDate);
                        const weekAgo = new Date();
                        weekAgo.setDate(weekAgo.getDate() - 7);
                        return joinDate > weekAgo;
                    }).length
                })
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

    // Navigate to employee leads subpage (unified routes)
    navigate(`/employee/${employeeId}/leads`)
    }

    return (
        <div className="min-h-screen px-2">
            {/* Header Section */}
            <div className="">
                <div className="">
                    {/* Welcome Header */}
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
                        <div className="flex items-center gap-4 mb-4 lg:mb-0">
                            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                                <Users size={28} className="text-white" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">Team Dashboard</h1>
                                <p className="text-gray-600 mt-1 text-lg">Monitor performance and manage your team effectively</p>
                            </div>
                        </div>
                    </div>

                    {/* Team Performance Overview */}
                    <div className="mb-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-900">Team Performance Overview</h3>
                            <Target size={20} className="text-gray-400" />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-white rounded-lg p-4 border border-gray-200 transition-shadow">
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                                        teamStats.totalLeads > 0 ? 'bg-blue-100' : 'bg-gray-100'
                                    }`}>
                                        <Target size={20} className={teamStats.totalLeads > 0 ? 'text-blue-600' : 'text-gray-400'} />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Total Leads Assigned</p>
                                        <p className="text-xl font-bold text-gray-900">
                                            {teamStats.totalLeads > 0 ? teamStats.totalLeads : '0'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white rounded-lg p-4 border border-gray-200 transition-shadow">
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                                        users.some(u => u.stats?.closedLeads > 0) ? 'bg-green-100' : 'bg-gray-100'
                                    }`}>
                                        <TrendingUp size={20} className={users.some(u => u.stats?.closedLeads > 0) ? 'text-green-600' : 'text-gray-400'} />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Total Closed Leads</p>
                                        <p className="text-xl font-bold text-gray-900">
                                            {users.reduce((sum, user) => sum + (user.stats?.closedLeads || 0), 0)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white rounded-lg p-4 border border-gray-200 transition-shadow">
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                                        users.some(u => u.stats?.transferredLeads > 0) ? 'bg-orange-100' : 'bg-gray-100'
                                    }`}>
                                        <Activity size={20} className={users.some(u => u.stats?.transferredLeads > 0) ? 'text-orange-600' : 'text-gray-400'} />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Total Transferred Leads</p>
                                        <p className="text-xl font-bold text-gray-900">
                                            {users.reduce((sum, user) => sum + (user.stats?.transferredLeads || 0), 0)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="">
                {isLoading && (
                    <div className="flex items-center justify-center py-16">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600 mx-auto mb-4"></div>
                            <p className="text-gray-600 text-lg">Loading team members...</p>
                        </div>
                    </div>
                )}

                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-2xl p-6 mb-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                                <span className="text-red-600 text-lg font-bold">!</span>
                            </div>
                            <div>
                                <p className="text-red-800 font-semibold text-lg">Error loading team members</p>
                                <p className="text-red-600 mt-1">{error.message || 'Please try again later'}</p>
                                <button
                                    onClick={() => window.location.reload()}
                                    className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                                >
                                    Try Again
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Team Members Section */}
                <div className="bg-white rounded-2xl  border border-gray-200 overflow-hidden">
                    <div className="px-6 py-5 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-xl font-semibold text-gray-900">Team Members</h2>
                                <p className="text-gray-600 text-sm mt-1">Click on any member to view their detailed performance and leads</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                    <span>Active ({teamStats.activeMembers})</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                                    <span>Inactive ({teamStats.totalMembers - teamStats.activeMembers})</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="p-6">
                        {users.length === 0 && !isLoading && !error ? (
                            <div className="text-center py-16">
                                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Users size={32} className="text-gray-400" />
                                </div>
                                <h3 className="text-lg font-medium text-gray-900 mb-2">No team members found</h3>
                                <p className="text-gray-500 mb-6">Start building your team by adding new members</p>
                                <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                                    Add First Member
                                </button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                                {users.map((employee) => (
                                    <EmployeeCard
                                        key={employee._id}
                                        employee={employee}
                                        onClick={() => handleEmployeeClick(employee)}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

// Enhanced Employee Card Component with modern design
const EmployeeCard = ({ employee, onClick }) => {
    const getInitials = (name) => {
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    };

    const getStatusColor = (status) => {
        return status === 'active' ? 'bg-green-500' : 'bg-gray-400';
    };

    const getPerformanceColor = (performance) => {
        // Since we don't have actual performance data, show neutral state
        return 'text-gray-600 bg-gray-100';
    };

    return (
        <div
            className="bg-white rounded-2xl s hadow-sm border border-gray-200 p-6 cursor-pointer  hover:border-blue-300 transition-all duration-300 group hover:-translate-y-1"
            onClick={onClick}
        >
            {/* Avatar Section */}
            <div className="flex flex-col items-center text-center space-y-4 mb-4">
                <div className="relative">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-300">
                        <span className="text-white font-bold text-lg">{getInitials(employee.name)}</span>
                    </div>
                    {/* Status indicator */}
                    <div className={`absolute -bottom-1 -right-1 w-5 h-5 ${getStatusColor(employee.status)} border-3 border-white rounded-full shadow-md`}></div>
                </div>

                {/* Employee Info */}
                <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-200 leading-tight">
                        {employee.name}
                    </h3>
                    <p className="text-sm text-gray-600 font-medium">
                        {employee.designation || 'Team Member'}
                    </p>
                    <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPerformanceColor(0)}`}>
                        <span className="mr-1">•</span>
                        {employee.status === 'active' ? 'Active' : 'Inactive'}
                    </div>
                </div>
            </div>

            {/* Stats Section - Show actual data from API */}
            <div className="space-y-3 mb-4">
                <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">Closed Leads</span>
                    <span className="font-semibold text-gray-900">{employee.stats?.closedLeads || 0}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">Transferred</span>
                    <span className="font-semibold text-gray-900">{employee.stats?.transferredLeads || 0}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">Status</span>
                    <span className={`font-semibold ${employee.status === 'active' ? 'text-green-600' : 'text-gray-500'}`}>
                        {employee.status === 'active' ? 'Active' : 'Inactive'}
                    </span>
                </div>
            </div>

            {/* Contact Info */}
            <div className="flex items-center justify-center gap-4 pt-3 border-t border-gray-100">
                {employee.email && (
                    <div className="flex items-center gap-2 text-gray-500 hover:text-blue-600 transition-colors p-2 rounded-lg hover:bg-blue-50">
                        <Mail size={16} />
                        <span className="text-xs font-medium">Email</span>
                    </div>
                )}
                {employee.phoneNumber && (
                    <div className="flex items-center gap-2 text-gray-500 hover:text-blue-600 transition-colors p-2 rounded-lg hover:bg-blue-50">
                        <Phone size={16} />
                        <span className="text-xs font-medium">Call</span>
                    </div>
                )}
            </div>

            {/* Hover indicator */}
            <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-blue-400 transition-all duration-300 pointer-events-none"></div>
        </div>
    )
}

export default TeamDashboard
