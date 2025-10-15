import React, { useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const ProjectsCard = ({ searchTerm = '', selectedType = '', sortOrder = 'asc' }) => {
    // Pagination state
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 12 // 12 cards per page

    const allProjects = [
        {
            id: 1,
            name: "Alpha Tower",
            developer: "Developer Name 1",
            type: "Commercial",
            image: "/Images/loginBgImage.png"
        },
        {
            id: 2,
            name: "Beta Residency",
            developer: "Developer Name 2",
            type: "Residential",
            image: "/Images/registerbgImage.png"
        },
        {
            id: 3,
            name: "Gamma Plaza",
            developer: "Developer Name 3",
            type: "Commercial",
            image: "/Images/loginBgImage.png"
        },
        {
            id: 4,
            name: "Delta Homes",
            developer: "Developer Name 4",
            type: "Residential",
            image: "/Images/registerbgImage.png"
        },
        {
            id: 5,
            name: "Epsilon Center",
            developer: "Developer Name 5",
            type: "Commercial",
            image: "/Images/loginBgImage.png"
        },
        {
            id: 6,
            name: "Zeta Gardens",
            developer: "Developer Name 6",
            type: "Residential",
            image: "/Images/registerbgImage.png"
        },
        {
            id: 7,
            name: "Theta Complex",
            developer: "Developer Name 7",
            type: "Commercial",
            image: "/Images/loginBgImage.png"
        },
        {
            id: 8,
            name: "Lambda Villas",
            developer: "Developer Name 8",
            type: "Residential",
            image: "/Images/registerbgImage.png"
        },
        {
            id: 9,
            name: "Sigma Building",
            developer: "Developer Name 9",
            type: "Commercial",
            image: "/Images/loginBgImage.png"
        },
        {
            id: 10,
            name: "Omega Heights",
            developer: "Developer Name 10",
            type: "Residential",
            image: "/Images/registerbgImage.png"
        },
        {
            id: 11,
            name: "Phoenix Mall",
            developer: "Developer Name 11",
            type: "Commercial",
            image: "/Images/loginBgImage.png"
        },
        {
            id: 12,
            name: "Horizon Apartments",
            developer: "Developer Name 12",
            type: "Residential",
            image: "/Images/registerbgImage.png"
        },
        {
            id: 13,
            name: "Nova Complex",
            developer: "Developer Name 13",
            type: "Commercial",
            image: "/Images/loginBgImage.png"
        },
    ]

    // Filter and sort projects based on props
    const filteredAndSortedProjects = useMemo(() => {
        let filtered = allProjects

        // Apply search filter
        if (searchTerm) {
            filtered = filtered.filter(project =>
                project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                project.developer.toLowerCase().includes(searchTerm.toLowerCase())
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
                return a.name.localeCompare(b.name)
            } else {
                return b.name.localeCompare(a.name)
            }
        })

        return filtered
    }, [searchTerm, selectedType, sortOrder])

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

        return pages
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
            {/* Projects Grid Container - Responsive */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 mb-8">
                {currentPageProjects.length > 0 ? (
                    currentPageProjects.map((project) => (
                        <ProjectCard
                            key={project.id}
                            project={project}
                            gradientOverlay={getGradientOverlay(project.type)}
                        />
                    ))
                ) : (
                    <div className="col-span-full text-center py-12 text-gray-500">
                        <p className="text-lg">No projects found</p>
                        <p className="text-sm">Try adjusting your search or filter criteria</p>
                    </div>
                )}
            </div>

            {/* Pagination */}
            {filteredAndSortedProjects.length > 0 && (
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
const ProjectCard = ({ project, gradientOverlay }) => {
    return (
        <div
            className="relative rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer w-full h-64"
        >
            <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                    backgroundImage: `${gradientOverlay}, url('${project.image}')`,
                }}
            />

            <div className="relative h-full flex flex-col justify-between p-4">
                <div className="flex justify-end">
                    <span
                        className={`
                            flex items-center justify-center
                            w-[107px] h-[30px] rounded-xl text-white text-xs font-medium
                            ${project.type === "Commercial"
                                ? "bg-[#0C6DFF70] border border-[#0511B040]"
                                : "bg-[#22C55E70] border border-[#0511B040]"}
                        `}
                    >
                        {project.type}
                    </span>
                </div>

                <div className="text-white">
                    <h3 className="text-lg font-semibold mb-1">
                        {project.name}
                    </h3>
                    <p className="text-sm opacity-90">
                        {project.developer}
                    </p>
                </div>
            </div>
        </div>
    )
}

export default ProjectsCard
