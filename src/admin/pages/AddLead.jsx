import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import api from '../../shared/services/apiService'
import CustomSelect from '../../shared/components/CustomSelect'
import {
  Plus,
  Info,
  Users,
  User,
  Home,
  Clock,
  Edit,
  Loader2
} from 'lucide-react'

const AddLead = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [formData, setFormData] = useState({
    source: '',
    executiveName: '',
    assignedTo: '',
    transferTo: '',
    capturedBy: '',
    status: '',
    clientName: '',
    contactNumber: '',
    email: '',
    budget: '',
    location: '',
    projects: '',
    remark: '',
    date: '',
    followUp: ''
  })
  const [users, setUsers] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  // Fetch users for dropdowns
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get('/auth/teams')
        setUsers(response.data?.users || [])
      } catch (err) {
        console.error('Error fetching users:', err)
      }
    }
    fetchUsers()
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setIsLoading(true)
  await api.post('/lead/create', formData)
  // Invalidate leads cache so listing refreshes immediately
  try { queryClient.invalidateQueries(['leads']) } catch { /* non-blocking */ }
  alert('Lead created successfully!')
  navigate('/leads')
    } catch (err) {
      console.error('Error creating lead:', err)
      alert('Failed to create lead: ' + (err.response?.data?.message || err.message))
    } finally {
      setIsLoading(false)
    }
  }

  const statusOptions = ['Follow Ups', 'Not Connected', 'Prospect', 'Closer']
  const sourceOptions = ['Google', 'Facebook', 'Referral', 'Website', 'Cold Call', 'Walk-in']

  return (
    <div className="min-h-screen ">
      <div className="">
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                  <Plus size={20} className="text-white" />
                </div>
                <h1 className="text-xl font-bold text-white">Add New Lead</h1>
              </div>
              <button
                onClick={() => navigate('/leads')}
                className="px-4 py-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Lead Information */}
            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                  <Info size={16} className="text-blue-600" />
                </div>
                <h2 className="text-lg font-semibold text-gray-900">Lead Information</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Source *</label>
                  <CustomSelect
                    name="source"
                    value={formData.source}
                    onChange={handleChange}
                    options={sourceOptions}
                    placeholder="Select Source"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Executive Name *</label>
                  <input
                    type="text"
                    name="executiveName"
                    value={formData.executiveName}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white"
                    placeholder="Enter executive name"
                  />
                </div>
              </div>
            </div>

            {/* Assignment Details */}
            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                  <Users size={16} className="text-green-600" />
                </div>
                <h2 className="text-lg font-semibold text-gray-900">Assignment Details</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Assigned To</label>
                  <CustomSelect
                    name="assignedTo"
                    value={formData.assignedTo}
                    onChange={handleChange}
                    options={users.map(u => u.name)}
                    placeholder="Select User"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Transfer To</label>
                  <CustomSelect
                    name="transferTo"
                    value={formData.transferTo}
                    onChange={handleChange}
                    options={users.map(u => u.name)}
                    placeholder="Select User"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Captured By</label>
                  <CustomSelect
                    name="capturedBy"
                    value={formData.capturedBy}
                    onChange={handleChange}
                    options={users.map(u => u.name)}
                    placeholder="Select User"
                  />
                </div>
              </div>
            </div>

            {/* Client Information */}
            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center">
                  <User size={16} className="text-purple-600" />
                </div>
                <h2 className="text-lg font-semibold text-gray-900">Client Information</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Client Name *</label>
                  <input
                    type="text"
                    name="clientName"
                    value={formData.clientName}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white"
                    placeholder="Enter client name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Contact Number *</label>
                  <input
                    type="tel"
                    name="contactNumber"
                    value={formData.contactNumber}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white"
                    placeholder="Enter contact number"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white"
                    placeholder="Enter email address"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status *</label>
                  <CustomSelect
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    options={statusOptions}
                    placeholder="Select Status"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Property Details */}
            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center">
                  <Home size={16} className="text-orange-600" />
                </div>
                <h2 className="text-lg font-semibold text-gray-900">Property Details</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Budget</label>
                  <input
                    type="text"
                    name="budget"
                    value={formData.budget}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white"
                    placeholder="Enter budget"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white"
                    placeholder="Enter location"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Projects</label>
                  <input
                    type="text"
                    name="projects"
                    value={formData.projects}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white"
                    placeholder="Enter projects"
                  />
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center">
                  <Clock size={16} className="text-indigo-600" />
                </div>
                <h2 className="text-lg font-semibold text-gray-900">Timeline</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                  <input
                    type="datetime-local"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Follow Up</label>
                  <input
                    type="datetime-local"
                    name="followUp"
                    value={formData.followUp}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Remarks */}
            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 bg-teal-100 rounded-full flex items-center justify-center">
                  <Edit size={16} className="text-teal-600" />
                </div>
                <h2 className="text-lg font-semibold text-gray-900">Additional Notes</h2>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Remark</label>
                <textarea
                  name="remark"
                  value={formData.remark}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white resize-none"
                  placeholder="Enter any additional remarks..."
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => navigate('/leads')}
                className="px-6 py-3 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors font-medium shadow-sm"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <Loader2 size={16} className="animate-spin" />
                    Creating...
                  </div>
                ) : (
                  'Create Lead'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default AddLead
