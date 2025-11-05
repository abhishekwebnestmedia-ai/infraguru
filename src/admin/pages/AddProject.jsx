import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import api from '../../shared/services/apiService'

const AddProject = () => {
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        projectName: '',
        description: '',
        status: 'Commercial',
        developerName: '',
        pdfLink: '',
        thumbnail: ''
    })
    const [loading, setLoading] = useState(false)

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        
        // Additional validation
        if (!formData.projectName.trim()) {
            alert('Project name is required')
            return
        }
        
        if (!formData.developerName.trim()) {
            alert('Developer name is required')
            return
        }
        
        setLoading(true)

        try {
            const submitData = new FormData()
            submitData.append('projectName', formData.projectName)
            submitData.append('description', formData.description)
            submitData.append('status', formData.status)
            submitData.append('developerName', formData.developerName)
            submitData.append('pdfLink', formData.pdfLink)
            submitData.append('thumbnail', formData.thumbnail)
            
            // Debug: Log what we're sending
            console.log('Sending data:', {
                projectName: formData.projectName,
                description: formData.description,
                status: formData.status,
                developerName: formData.developerName,
                pdfLink: formData.pdfLink,
                thumbnail: formData.thumbnail
            })

            await api.post('/projects/create', submitData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })

            // Navigate back to projects page
            navigate('/admin/projects')
        } catch (err) {
            console.error('Error creating project:', err)
            alert('Failed to create project. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    const handleBack = () => {
        navigate('/admin/projects')
    }

    return (
        <div className="min-h-screen ">
            <div className="px-4">
                {/* Header */}
    

                <div className="">
                    <h1 className="text-2xl font-bold text-gray-800 mb-6">Add New Project</h1>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Project Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Project Name *
                            </label>
                            <input
                                type="text"
                                name="projectName"
                                value={formData.projectName}
                                onChange={handleInputChange}
                                required
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                                placeholder="Enter project name"
                            />
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Description
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                rows="4"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none transition-colors"
                                placeholder="Enter project description"
                            />
                        </div>

                        {/* Project Type and Developer in a row */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Project Status *
                                </label>
                                <select
                                    name="status"
                                    value={formData.status}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                                >
                                    <option value="Commercial">Commercial</option>
                                    <option value="Residential">Residential</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Developer *
                                </label>
                                <input
                                    type="text"
                                    name="developerName"
                                    value={formData.developerName}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                                    placeholder="Enter developer name"
                                />
                            </div>
                        </div>

                        {/* PDF Link and Thumbnail URL */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    PDF Link
                                </label>
                                <input
                                    type="url"
                                    name="pdfLink"
                                    value={formData.pdfLink}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                                    placeholder="https://example.com/brochure.pdf"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Thumbnail Image URL
                                </label>
                                <input
                                    type="url"
                                    name="thumbnail"
                                    value={formData.thumbnail}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                                    placeholder="https://example.com/image.jpg"
                                />
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col justify-end sm:flex-row gap-4 pt-6">
                            <button
                                type="button"
                                onClick={handleBack}
                                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg transition-colors font-medium"
                            >
                                {loading ? 'Creating Project...' : 'Create Project'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default AddProject