import React, { useState } from 'react'
import { Search, ChevronDown, ChevronUp, ArrowUpDown, X, Calendar } from 'lucide-react'
import ProjectsCard from './ProjectsCard'

const ProjectsDashboard = () => {
    // Filter states
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedDate, setSelectedDate] = useState('')
    const [selectedType, setSelectedType] = useState('')
    const [sortOrder, setSortOrder] = useState('asc')
    const [showDatePicker, setShowDatePicker] = useState(false)
    const [showTypeDropdown, setShowTypeDropdown] = useState(false)

    // Options for dropdowns
    const typeOptions = ['All', 'Commercial', 'Residential']

    // Active filters for display
    const activeFilters = []
    if (selectedDate) activeFilters.push({ type: 'date', label: `Date: ${selectedDate}`, value: selectedDate })
    if (selectedType && selectedType !== 'All') activeFilters.push({ type: 'type', label: `Type: ${selectedType}`, value: selectedType })
    if (sortOrder) activeFilters.push({ type: 'sort', label: `Sort: ${sortOrder === 'asc' ? 'A-Z' : 'Z-A'}`, value: sortOrder })

    // Filter removal handlers
    const removeFilter = (filterType) => {
        switch (filterType) {
            case 'date':
                setSelectedDate('')
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
        setSelectedType('')
        setSortOrder('asc')
    }

    return (
        <div className="p-6">
            {/* Search and Filter Controls */}
            <div className=" rounded-lg mb-2">
                <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
                    {/* Search Input */}
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-[50%] pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        />
                    </div>

                    {/* Filter Controls */}
                    <div className="flex flex-wrap gap-3 items-center">
                        {/* Date Picker Dropdown */}
                        <div className="relative">
                            <button
                                onClick={() => setShowDatePicker(!showDatePicker)}
                                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                            >
                                <Calendar size={16} />
                                <span className="text-sm">
                                    {selectedDate || 'Pick Date'}
                                </span>
                                <div className="transition-transform duration-200">
                                    {showDatePicker ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                </div>
                            </button>

                            {showDatePicker && (
                                <div className="absolute top-full mt-1 left-0 z-10 bg-white border border-gray-300 rounded-lg shadow-lg p-2 min-w-[200px]">
                                    <input
                                        type="date"
                                        value={selectedDate}
                                        onChange={(e) => {
                                            setSelectedDate(e.target.value)
                                            setShowDatePicker(false)
                                        }}
                                        className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                    />
                                </div>
                            )}
                        </div>

                        {/* Type Dropdown */}
                        <div className="relative">
                            <button
                                onClick={() => setShowTypeDropdown(!showTypeDropdown)}
                                className="flex items-center gap-2 px-4 py-2 border-2 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none"
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
                                <div className="absolute top-full mt-1 left-0 z-10 bg-white border border-gray-300 rounded-lg shadow-lg py-1 min-w-[150px]">
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
                            className="flex items-center gap-2 px-4 py-2 border-2 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none"
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
            />
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

export default ProjectsDashboard
