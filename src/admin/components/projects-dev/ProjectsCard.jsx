import React, { useMemo, useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, Edit, Trash2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import api from '../../../shared/services/apiService'

const ProjectsCard = ({ searchTerm = '', selectedType = '', sortOrder = 'asc', onEditProject }) => {
    const navigate = useNavigate()
    const queryClient = useQueryClient()
    
    // Pagination state
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 12 // 12 cards per page

    // Projects state
    const [projects, setProjects] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    // Fetch projects from API
    useEffect(() => {
        const fetchProjects = async () => {
            try {
                setLoading(true)
                const response = await api.get('/projects')
                // Normalize different possible API shapes into an array
                const normalize = (payload) => {
                    if (!payload) return []
                    if (Array.isArray(payload)) return payload
                    if (Array.isArray(payload.data)) return payload.data
                    if (Array.isArray(payload.projects)) return payload.projects
                    // fallback: if payload has a 'data' object with nested array
                    if (payload.data && Array.isArray(payload.data.projects)) return payload.data.projects
                    return []
                }

                setProjects(normalize(response.data))
            } catch (err) {
                console.error('Error fetching projects:', err)
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }

        fetchProjects()
    }, [])

    // Delete project handler
    const handleDeleteProject = async (projectId) => {
        if (window.confirm('Are you sure you want to delete this project?')) {
            try {
                console.log('🗑️ ProjectsCard: Deleting project with ID:', projectId)
                await api.delete(`/projects/${projectId}`)
                console.log('✅ ProjectsCard: Project deleted successfully')
                
                // Remove from local state
                setProjects(prev => prev.filter(project => (project.id || project._id) !== projectId))
                
                // Invalidate React Query cache if using React Query elsewhere
                queryClient.invalidateQueries(['projects'])
                
                alert('Project deleted successfully!')
            } catch (err) {
                console.error('❌ ProjectsCard: Error deleting project:', err)
                alert('Failed to delete project. Please try again.')
            }
        }
    }

    // Filter and sort projects based on props
    const filteredAndSortedProjects = useMemo(() => {
        // Ensure we always operate on an array
        let filtered = Array.isArray(projects) ? projects : []

        // Apply search filter
        if (searchTerm) {
            filtered = filtered.filter(project =>
                project.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                project.developer?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                project.description?.toLowerCase().includes(searchTerm.toLowerCase())
            )
        }

        // Apply type filter
        if (selectedType && selectedType !== 'All') {
            filtered = filtered.filter(project =>
                project.type === selectedType
            )
        }

        // Apply sorting
        filtered = [...filtered].sort((a, b) => {
            if (sortOrder === 'asc') {
                return (a.name || '').localeCompare(b.name || '')
            } else {
                return (b.name || '').localeCompare(a.name || '')
            }
        })

        return filtered
    }, [projects, searchTerm, selectedType, sortOrder])

    // Reset to first page when filters change
    React.useEffect(() => {
        setCurrentPage(1)
    }, [searchTerm, selectedType, sortOrder])

    // Pagination calculations
    const totalPages = Math.ceil(filteredAndSortedProjects.length / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    const currentPageProjects = filteredAndSortedProjects.slice(startIndex, endIndex)

    // Pagination handlers
    const handlePreviousPage = () => {
        setCurrentPage(prev => prev > 1 ? prev - 1 : prev)
    }

    const handleNextPage = () => {
        setCurrentPage(prev => prev < totalPages ? prev + 1 : prev)
    }

    const handlePageClick = (page) => {
        setCurrentPage(page)
    }

    // Generate page numbers for display
    const getPageNumbers = () => {
        const pages = []
        const maxVisiblePages = 4

        if (totalPages <= maxVisiblePages) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i)
            }
        } else {
            // Show first page, current page area, and last page
            if (currentPage <= 3) {
                pages.push(1, 2, 3, 4)
            } else if (currentPage >= totalPages - 2) {
                pages.push(totalPages - 3, totalPages - 2, totalPages - 1, totalPages)
            } else {
                pages.push(currentPage - 1, currentPage, currentPage + 1, currentPage + 2)
            }
        }

        // Remove duplicates and filter out invalid page numbers
        return [...new Set(pages)].filter(page => page > 0 && page <= totalPages)
    }
 
    // Gradient overlays based on type
    const getGradientOverlay = (type) => {
        if (type === "Commercial") {
            return "linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, rgba(0, 44, 150, 0.4) 74.02%)"
        } else {
            return "linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, rgba(0, 58, 53, 0.7) 74.02%)"
        }
    }

    return (
        <div className="w-full">
            {/* Loading State */}
            {loading && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 mb-8">
                    {Array.from({ length: 8 }).map((_, index) => (
                        <div key={index} className="animate-pulse">
                            <div className="bg-gray-300 rounded-2xl h-64"></div>
                        </div>
                    ))}
                </div>
            )}

            {/* Error State */}
            {error && !loading && (
                <div className="col-span-full text-center py-12 text-red-500">
                    <p className="text-lg">Error loading projects</p>
                    <p className="text-sm">{error}</p>
                </div>
            )}

            {/* Projects Grid Container - Responsive */}
            {!loading && !error && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 mb-8">
                    {currentPageProjects.length > 0 ? (
                        currentPageProjects.map((project) => (
                            <ProjectCard
                                key={project.id || project._id}
                                project={project}
                                gradientOverlay={getGradientOverlay(project.status || project.type)}
                                onDelete={() => handleDeleteProject(project.id || project._id)}
                                onEdit={() => onEditProject && onEditProject(project)}
                                navigate={navigate}
                            />
                        ))
                    ) : (
                        <div className="col-span-full text-center py-12 text-gray-500">
                            <p className="text-lg">No projects found</p>
                            <p className="text-sm">Try adjusting your search or filter criteria</p>
                        </div>
                    )}
                </div>
            )}

            {/* Pagination */}
            {!loading && !error && filteredAndSortedProjects.length > 0 && (
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-8">
                    {/* Left side - Entry count */}
                    <div className="text-sm text-gray-600 order-2 sm:order-1">
                        Showing {startIndex + 1}-{Math.min(endIndex, filteredAndSortedProjects.length)} out of {filteredAndSortedProjects.length} Entries
                    </div>

                    {/* Right side - Pagination controls */}
                    <div className="flex items-center gap-2 order-1 sm:order-2">
                        {/* Previous button */}
                        <button
                            onClick={handlePreviousPage}
                            disabled={currentPage === 1}
                            className="p-2 rounded-lg hover:scale-110 hover:bg-blue-50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                        >
                            <ChevronLeft size={16} className="text-gray-600" />
                        </button>

                        {/* Page numbers */}
                        <div className="flex items-center gap-1">
                            {getPageNumbers().map((page) => (
                                <button
                                    key={page}
                                    onClick={() => handlePageClick(page)}
                                    className={`w-8 h-8 rounded-md text-sm font-medium transition-colors ${
                                        page === currentPage
                                            ? 'bg-blue-600 text-white'
                                            : 'text-gray-700 hover:bg-gray-100'
                                    }`}
                                >
                                    {page}
                                </button>
                            ))}
                        </div>

                        {/* Next button */}
                        <button
                            onClick={handleNextPage}
                            disabled={currentPage === totalPages}
                            className="p-2 rounded-lg hover:scale-110 hover:bg-blue-50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                        >
                            <ChevronRight size={16} className="text-gray-600" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

// Individual Project Card Component - Responsive sizing
const ProjectCard = ({ project, gradientOverlay, onDelete, navigate }) => {
    const handleEditClick = (e) => {
        e.stopPropagation();
        const projectId = project.id || project._id;
        console.log('🔧 ProjectCard: Edit button clicked, navigating to:', `/projects/edit/${projectId}`);
        navigate(`/projects/edit/${projectId}`);
    }

    const handleDeleteClick = (e) => {
        e.stopPropagation()
        console.log('🗑️ ProjectCard: Delete button clicked for project:', project.id || project._id)
        if (onDelete) {
            onDelete();
        }; 
    }

    const handleCardClick = () => {
        // keep card click behavior minimal: do nothing to avoid interference
        // Intentionally left blank per request to remove extra functionality
        return
    };

    return (
        <div
            className="relative rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer w-full h-64 group"
            onClick={handleCardClick}
        >
            <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                    backgroundImage: `${gradientOverlay}, url('${project.image || project.imageUrl || '/Images/loginBgImage.png'}')`,
                }}
            />

            {/* Action buttons - shown on hover */}
            {/* Add z-index and explicit pointer events so the buttons are clickable above the background layer */}
            <div className="absolute bottom-2 right-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex gap-2 pointer-events-auto">{/* Updated position */}
                
                <button
                    type="button"
                    onClick={(e) => {
                        e.stopPropagation()
                        handleEditClick(e)
                    }}
                    className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                    title="Edit Project"
                >
                    <Edit size={16} />
                </button>
                <button
                    type="button"
                    onClick={(e) => {
                        e.stopPropagation()
                        handleDeleteClick(e)
                    }}
                    className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                    title="Delete Project"
                >
                    <Trash2 size={16} />
                </button>
            </div>

            <div className="relative h-full flex flex-col justify-between p-4">
                <div className="flex justify-end">
                    <span
                        className={`
                            flex items-center justify-center
                            w-[107px] h-[30px] rounded-xl text-white text-xs font-medium
                            ${(project.status || project.type) === "Commercial"
                                ? "bg-[#0C6DFF70] border border-[#0511B040]"
                                : "bg-[#22C55E70] border border-[#0511B040]"}
                        `}
                    >
                        {project.status || project.type || 'N/A'}
                    </span>
                </div>

                <div className="text-white">
                    <h3 className="text-lg font-semibold mb-1">
                        {project.projectName || project.name || 'Untitled Project'}
                    </h3>
                    <p className="text-sm opacity-90">
                        {project.developerName || project.developer || project.description || 'No description'}
                    </p>
                </div>
            </div>
        </div>
    )
}

export default ProjectsCard
