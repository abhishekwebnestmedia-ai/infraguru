import React, { useState, useRef, useEffect } from 'react'
import { Search, ChevronDown, ChevronUp, ArrowUpDown, X, Calendar, Plus } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import ProjectsCard from './ProjectsCard'

const ProjectsDashboard = () => {
    const navigate = useNavigate()
    
    // Filter states
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedDate, setSelectedDate] = useState('')
    const [selectedDateLabel, setSelectedDateLabel] = useState('')
    const [selectedType, setSelectedType] = useState('')
    const [sortOrder, setSortOrder] = useState('asc')
    const [showDatePicker, setShowDatePicker] = useState(false)
    const [showTypeDropdown, setShowTypeDropdown] = useState(false)
    const [showCalendar, setShowCalendar] = useState(false)
    const [showEditModal, setShowEditModal] = useState(false)
    const [editingProject, setEditingProject] = useState(null)

    // Refs for click outside detection
    const datePickerRef = useRef(null)
    const typeDropdownRef = useRef(null)
    const calendarRef = useRef(null)

    // Options for dropdowns
    const typeOptions = ['All', 'Commercial', 'Residential']

    // Click outside handler
    useEffect(() => {
        const handleClickOutside = (event) => {
            // Close date picker if clicked outside
            if (datePickerRef.current && !datePickerRef.current.contains(event.target) && showDatePicker) {
                setShowDatePicker(false)
            }

            // Close type dropdown if clicked outside
            if (typeDropdownRef.current && !typeDropdownRef.current.contains(event.target) && showTypeDropdown) {
                setShowTypeDropdown(false)
            }

            // Close calendar if clicked outside
            if (calendarRef.current && !calendarRef.current.contains(event.target) && showCalendar) {
                setShowCalendar(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)

        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [showDatePicker, showTypeDropdown, showCalendar])

    // Close other dropdowns when opening one
    const handleDatePickerToggle = () => {
        setShowTypeDropdown(false) // Close type dropdown
        setShowCalendar(false) // Close calendar
        setShowDatePicker(!showDatePicker)
    }

    const handleTypeDropdownToggle = () => {
        setShowDatePicker(false) // Close date picker
        setShowCalendar(false) // Close calendar
        setShowTypeDropdown(!showTypeDropdown)
    }

    // Date utility functions
    const getDateString = (date) => {
        return date.toISOString().split('T')[0];
    };

    const getYesterday = () => {
        const date = new Date();
        date.setDate(date.getDate() - 1);
        return date;
    };

    const getLast7Days = () => {
        const date = new Date();
        date.setDate(date.getDate() - 7);
        return date;
    };

    const getLast30Days = () => {
        const date = new Date();
        date.setDate(date.getDate() - 30);
        return date;
    };

    const getLast90Days = () => {
        const date = new Date();
        date.setDate(date.getDate() - 90);
        return date;
    };

    const getLastMonth = () => {
        const date = new Date();
        date.setMonth(date.getMonth() - 1);
        return date;
    };

    // Date preset options
    const datePresets = [
        {
            label: 'Yesterday',
            value: getDateString(getYesterday()),
            date: getYesterday()
        },
        {
            label: 'Last 7 Days',
            value: getDateString(getLast7Days()),
            date: getLast7Days()
        },
        {
            label: 'Last 30 Days',
            value: getDateString(getLast30Days()),
            date: getLast30Days()
        },
        {
            label: 'Last Month',
            value: getDateString(getLastMonth()),
            date: getLastMonth()
        },
        {
            label: 'Last 90 Days',
            value: getDateString(getLast90Days()),
            date: getLast90Days()
        }
    ];

    // Handle preset date selection
    const handlePresetDateSelect = (preset) => {
        setSelectedDate(preset.value);
        setSelectedDateLabel(preset.label);
        setShowDatePicker(false);
        setShowCalendar(false);
    };

    // Handle custom date selection
    const handleCustomDateSelect = (dateValue) => {
        setSelectedDate(dateValue);
        setSelectedDateLabel('Custom Date');
        setShowDatePicker(false);
        setShowCalendar(false);
    };

    // Handle pick date option click
    const handlePickDateClick = () => {
        setShowCalendar(true);
        setShowDatePicker(false);
    };

    // Active filters for display
    const activeFilters = []
    if (selectedDate) activeFilters.push({ type: 'date', label: `Date: ${selectedDateLabel || selectedDate}`, value: selectedDate })
    if (selectedType && selectedType !== 'All') activeFilters.push({ type: 'type', label: `Type: ${selectedType}`, value: selectedType })
    if (sortOrder) activeFilters.push({ type: 'sort', label: `Sort: ${sortOrder === 'asc' ? 'A-Z' : 'Z-A'}`, value: sortOrder })

    // Filter removal handlers
    const removeFilter = (filterType) => {
        switch (filterType) {
            case 'date':
                setSelectedDate('')
                setSelectedDateLabel('')
                break
            case 'type':
                setSelectedType('')
                break
            case 'sort':
                setSortOrder('asc')
                break
            default:
                break
        }
    }

    const clearAllFilters = () => {
        setSearchTerm('')
        setSelectedDate('')
        setSelectedDateLabel('')
        setSelectedType('')
        setSortOrder('asc')
    }

    return (
        <div className="p-3 md:p-6">
            {/* Header with Add Project Button */}
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold text-gray-800">Projects & Development</h1>
                <button
                    onClick={() => navigate('/projects/add')}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                    <Plus size={20} />
                    Add Project
                </button>
            </div>

            {/* Search and Filter Controls */}
            <div className="rounded-lg mb-2">
                <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
                    {/* Search Input */}
                    <div className="relative w-full lg:flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full lg:w-[50%] pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        />
                    </div>

                    {/* Filter Controls */}
                    <div className="flex flex-col sm:flex-row flex-wrap gap-3 items-stretch sm:items-center w-full lg:w-auto">
                        {/* Date Picker Dropdown */}
                        <div className="relative" ref={datePickerRef}>
                            <button
                                onClick={handleDatePickerToggle}
                                className="flex items-center justify-between gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none w-full sm:w-auto min-w-[180px]"
                            >
                                <div className="flex items-center gap-2">
                                    <Calendar size={16} />
                                    <span className="text-sm">
                                        {selectedDateLabel || selectedDate || 'Pick Date'}
                                    </span>
                                </div>
                                <div className="transition-transform duration-200">
                                    {showDatePicker ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                </div>
                            </button>

                            {/* Date Presets Dropdown */}
                            {showDatePicker && (
                                <div className="absolute top-full mt-1 left-0 right-0 sm:right-auto z-10 bg-white border border-gray-300 rounded-lg shadow-lg py-1 min-w-[180px]">
                                    {datePresets.map((preset) => (
                                        <button
                                            key={preset.label}
                                            onClick={() => handlePresetDateSelect(preset)}
                                            className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm focus:bg-gray-100 outline-none"
                                        >
                                            {preset.label}
                                        </button>
                                    ))}
                                    <hr className="my-1" />
                                    <button
                                        onClick={handlePickDateClick}
                                        className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm focus:bg-gray-100 outline-none font-medium text-blue-600"
                                    >
                                        Pick Date
                                    </button>
                                </div>
                            )}

                            {/* Calendar Popup */}
                            {showCalendar && (
                                <div ref={calendarRef} className="absolute top-full mt-1 left-0 right-0 sm:right-auto z-20 bg-white border border-gray-300 rounded-lg shadow-lg p-3">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-medium text-gray-700">Select Date</span>
                                        <button
                                            onClick={() => setShowCalendar(false)}
                                            className="text-gray-400 hover:text-gray-600"
                                        >
                                            <X size={16} />
                                        </button>
                                    </div>
                                    <input
                                        type="date"
                                        value={selectedDate}
                                        onChange={(e) => handleCustomDateSelect(e.target.value)}
                                        className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                    />
                                </div>
                            )}
                        </div>

                        {/* Type Dropdown */}
                        <div className="relative" ref={typeDropdownRef}>
                            <button
                                onClick={handleTypeDropdownToggle}
                                className="flex items-center justify-between gap-2 px-4 py-2 border-2 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none w-full sm:w-auto min-w-[150px]"
                                style={{
                                    borderColor: 'var(--blue700)',
                                    color: 'var(--blue700)',
                                    backgroundColor: 'transparent'
                                }}
                            >
                                <span className="text-sm font-medium">
                                    {selectedType || 'Select Type'}
                                </span>
                                <div className="transition-transform duration-200">
                                    {showTypeDropdown ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                </div>
                            </button>

                            {showTypeDropdown && (
                                <div className="absolute top-full mt-1 left-0 right-0 sm:right-auto z-10 bg-white border border-gray-300 rounded-lg shadow-lg py-1 min-w-[150px]">
                                    {typeOptions.map((option) => (
                                        <button
                                            key={option}
                                            onClick={() => {
                                                setSelectedType(option)
                                                setShowTypeDropdown(false)
                                            }}
                                            className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm focus:bg-gray-100 outline-none"
                                        >
                                            {option}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Sort Button */}
                        <button
                            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                            className="flex items-center justify-center gap-2 px-4 py-2 border-2 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none w-full sm:w-auto"
                            style={{
                                borderColor: 'var(--blue700)',
                                color: 'var(--blue700)',
                                backgroundColor: 'transparent'
                            }}
                        >
                            <span className="text-sm font-medium">Sort</span>
                            <ArrowUpDown size={16} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Active Filters */}
            {activeFilters.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4 items-center">
                    <span className="text-sm text-gray-600 font-medium">Active Filters:</span>

                    {activeFilters.map((filter, index) => (
                        <FilterTag
                            key={`${filter.type}-${index}`}
                            label={filter.label}
                            onRemove={() => removeFilter(filter.type)}
                        />
                    ))}

                    {activeFilters.length > 1 && (
                        <button
                            onClick={clearAllFilters}
                            className="text-xs text-gray-500 hover:text-red-600 underline ml-2"
                        >
                            Clear All
                        </button>
                    )}
                </div>
            )}

            {/* Pass filter props to ProjectsCard component */}
            <ProjectsCard
                searchTerm={searchTerm}
                selectedType={selectedType}
                sortOrder={sortOrder}
                selectedDate={selectedDate}
                onEditProject={(project) => {
                    // Navigate to edit project page
                    navigate(`/projects/edit/${project.id || project._id}`)
                }}
            />

            {/* Edit Project Modal */}
            {showEditModal && editingProject && (
                <EditProjectModal
                    project={editingProject}
                    onClose={() => {
                        setShowEditModal(false)
                        setEditingProject(null)
                    }}
                    onProjectUpdated={() => {
                        setShowEditModal(false)
                        setEditingProject(null)
                        // Refresh projects list
                        window.location.reload() // Temporary solution
                    }}
                />
            )}
        </div>
    )
}

const FilterTag = ({ label, onRemove }) => {
    return (
        <div className="flex items-center gap-2 bg-[#0024FF17] text-[var(--blue800)] px-4 py-2 rounded-full text-sm">
            <span>{label}</span>
            <button
                onClick={onRemove}
                className="hover:bg-blue-200 rounded-full p-1 transition-colors"
                aria-label="Remove filter"
            >
                <X size={14} />
            </button>
        </div>
    )
}

const EditProjectModal = ({ project, onClose, onProjectUpdated }) => {
    const [formData, setFormData] = useState({
        name: project?.name || '',
        description: project?.description || '',
        type: project?.type || 'Commercial',
        developer: project?.developer || '',
        image: null
    })
    const [loading, setLoading] = useState(false)

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleFileChange = (e) => {
        const file = e.target.files[0]
        setFormData(prev => ({
            ...prev,
            image: file
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)

        try {
            const submitData = new FormData()
            submitData.append('name', formData.name)
            submitData.append('description', formData.description)
            submitData.append('type', formData.type)
            submitData.append('developer', formData.developer)
            if (formData.image) {
                submitData.append('image', formData.image)
            }

            const api = (await import('../../services/apiService')).default
            await api.put(`/projects/${project.id}`, submitData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })

            onProjectUpdated()
        } catch (err) {
            console.error('Error updating project:', err)
            alert('Failed to update project. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold">Edit Project</h2>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600"
                        >
                            <X size={24} />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Project Name *
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                placeholder="Enter project name"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Description
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                rows="3"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
                                placeholder="Enter project description"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Project Type *
                            </label>
                            <select
                                name="type"
                                value={formData.type}
                                onChange={handleInputChange}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                            >
                                <option value="Commercial">Commercial</option>
                                <option value="Residential">Residential</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Developer
                            </label>
                            <input
                                type="text"
                                name="developer"
                                value={formData.developer}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                placeholder="Enter developer name"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Project Image (leave empty to keep current)
                            </label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                            />
                        </div>

                        <div className="flex gap-3 pt-4">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg transition-colors"
                            >
                                {loading ? 'Updating...' : 'Update Project'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default ProjectsDashboard
