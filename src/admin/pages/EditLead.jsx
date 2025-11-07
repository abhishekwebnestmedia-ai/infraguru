import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import api from '../../shared/services/apiService'

const EditLead = () => {
  
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { id } = useParams()
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
  const [isLoadingLead, setIsLoadingLead] = useState(true)

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

  // Fetch lead data
  useEffect(() => {
    const fetchLead = async () => {
      try {
        setIsLoadingLead(true)
        const response = await api.get(`/lead/getlead/${id}`)
        const lead = response.data?.data || {}
        
        // Format data for form
        setFormData({
          source: lead.source || '',
          executiveName: lead.executiveName || '',
          assignedTo: lead.assignedTo?.name || lead.assignedTo || '',
          transferTo: lead.transferTo?.name || lead.transferTo || '',
          capturedBy: lead.capturedBy?.name || lead.capturedBy || '',
          status: lead.status || '',
          clientName: lead.clientName || '',
          contactNumber: lead.contactNumber || '',
          email: lead.email || '',
          budget: lead.budget || '',
          location: lead.location || '',
          projects: lead.projects || '',
          remark: lead.remark || '',
          date: lead.date ? formatDateForInput(lead.date) : '',
          followUp: lead.followUp ? formatDateForInput(lead.followUp) : ''
        })
      } catch (err) {
        console.error('Error fetching lead:', err)
  alert('Failed to load lead data')
  navigate('/leads')
      } finally {
        setIsLoadingLead(false)
      }
    }

    if (id) {
      fetchLead()
    }
  }, [id, navigate])

  // Format date for datetime-local input
  const formatDateForInput = (dateString) => {
    try {
      const date = new Date(dateString)
      return date.toISOString().slice(0, 16)
    } catch {
      return ''
    }
  }

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
      
      console.log('🔄 EditLead: Updating lead with data:', formData)
      console.log('🔑 EditLead: Current auth token exists:', !!localStorage.getItem('authToken'))

  await api.put(`/lead/update/${id}`, formData)
  // Refresh leads list
  try { queryClient.invalidateQueries(['leads']) } catch { /* non-blocking */ }
  console.log('✅ EditLead: Lead update successful')
  console.log('🔑 EditLead: Auth token still exists after update:', !!localStorage.getItem('authToken'))
  alert('Lead updated successfully!')
  navigate('/leads')
    } catch (err) {
      console.error('❌ EditLead: Error updating lead:', err)
      console.log('🔑 EditLead: Auth token exists after error:', !!localStorage.getItem('authToken'))
      console.log('📊 EditLead: Error response status:', err.response?.status)
      console.log('📊 EditLead: Error response data:', err.response?.data)
      
      if (err.response?.status === 401) {
        console.warn('🔐 EditLead: Received 401 Unauthorized during lead update')
      }
      
      alert('Failed to update lead: ' + (err.response?.data?.message || err.message))
    } finally {
      setIsLoading(false)
    }
  }

  const statusOptions = ['Follow Ups', 'Not Connected', 'Prospect', 'Closer']
  const sourceOptions = ['Google', 'Facebook', 'Referral', 'Website', 'Cold Call', 'Walk-in']

  if (isLoadingLead) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-gray-600">Loading lead data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 ">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Edit Lead</h1>
        <button
          onClick={() => navigate('/leads')}
          className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          Cancel
        </button>
      </div>

      <form onSubmit={handleSubmit} className="">
        {/* Row 1 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Source</label>
            <select
              name="source"
              value={formData.source}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select Source</option>
              {sourceOptions.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Executive Name</label>
            <input
              type="text"
              name="executiveName"
              value={formData.executiveName}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Row 2 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Assigned To</label>
            <select
              name="assignedTo"
              value={formData.assignedTo}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select User</option>
              {users.map(user => (
                <option key={user._id} value={user.name}>{user.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Transfer To</label>
            <select
              name="transferTo"
              value={formData.transferTo}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select User</option>
              {users.map(user => (
                <option key={user._id} value={user.name}>{user.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Row 3 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Captured By</label>
            <input
              type="text"
              name="capturedBy"
              value={formData.capturedBy}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select Status</option>
              {statusOptions.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Row 4 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Client Name</label>
            <input
              type="text"
              name="clientName"
              value={formData.clientName}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Contact Number</label>
            <input
              type="tel"
              name="contactNumber"
              value={formData.contactNumber}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Row 5 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Budget</label>
            <input
              type="text"
              name="budget"
              value={formData.budget}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Row 6 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Projects</label>
            <input
              type="text"
              name="projects"
              value={formData.projects}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Row 7 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
            <input
              type="datetime-local"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Follow Up</label>
            <input
              type="datetime-local"
              name="followUp"
              value={formData.followUp}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Remark - Full Width */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">Remark</label>
          <textarea
            name="remark"
            value={formData.remark}
            onChange={handleChange}
            rows={3}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Submit Button */}
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => navigate('/leads')}
            className="px-6 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {isLoading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default EditLead
