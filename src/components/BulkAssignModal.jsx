import React, { useState, useEffect } from 'react'
import api from '../services/apiService'

const BulkAssignModal = ({ username, onClose }) => {
  const [leads, setLeads] = useState([])
  const [users, setUsers] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [selected, setSelected] = useState(new Set())
  const [assignee, setAssignee] = useState('')

  // Fetch leads for the specific user
  useEffect(() => {
    if (!username) return
    
    const fetchLeads = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const response = await api.get('/lead/userbasedlead', { params: { username } })
        setLeads(response.data?.data || [])
      } catch (err) {
        setError(err)
        console.error('Error fetching user-based leads:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchLeads()
    setSelected(new Set()) // reset selection when username changes
  }, [username])

  // Fetch users for assignment dropdown
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get('/users')
        setUsers(response.data?.data || response.data || [])
      } catch (err) {
        console.error('Error fetching users:', err)
      }
    }

    fetchUsers()
  }, [])

  const toggle = (id) => {
    setSelected(prev => {
      const s = new Set(prev)
      if (s.has(id)) s.delete(id)
      else s.add(id)
      return s
    })
  }

  const handleAssign = async () => {
    if (!assignee) return alert('Please select a user to assign to')
    if (selected.size === 0) return alert('No leads selected')

    const leadIds = Array.from(selected)
    try {
      setIsLoading(true)
      await api.post('/lead/bulk-assign', { leadIds, assignedTo: assignee })
      alert('Leads assigned successfully')
      onClose()
    } catch (err) {
      console.error(err)
      alert(err.message || 'Failed to assign leads')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative z-10 bg-white rounded-lg shadow-lg w-full max-w-3xl p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Leads for {username}</h3>
          <button onClick={onClose} className="text-sm text-gray-500">Close</button>
        </div>

        {isLoading && <div>Loading leads...</div>}
        {error && <div className="text-red-500">{error.message}</div>}

        {!isLoading && leads.length === 0 && (
          <div className="text-sm text-gray-500">No leads found for this user.</div>
        )}

        {leads.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <select value={assignee} onChange={(e) => setAssignee(e.target.value)} className="border p-2 rounded">
                <option value="">Select user to assign</option>
                {users.map(u => (
                  <option key={u._id || u.id || u.email} value={u.name || u.email}>{u.name || u.email}</option>
                ))}
              </select>
              <button onClick={handleAssign} className="bg-blue-600 text-white px-3 py-2 rounded">Assign Selected</button>
            </div>

            <div className="max-h-64 overflow-y-auto border rounded">
              <table className="w-full text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-2">#</th>
                    <th className="p-2">Client</th>
                    <th className="p-2">Source</th>
                    <th className="p-2">Status</th>
                    <th className="p-2">Assigned To</th>
                  </tr>
                </thead>
                <tbody>
                  {leads.map((lead) => (
                    <tr key={lead._id} className="border-b">
                      <td className="p-2 text-center">
                        <input type="checkbox" checked={selected.has(lead._id)} onChange={() => toggle(lead._id)} />
                      </td>
                      <td className="p-2">{lead.clientName}</td>
                      <td className="p-2">{lead.source}</td>
                      <td className="p-2">{lead.status}</td>
                      <td className="p-2">{lead.assignedTo?.name || lead.assignedTo || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default BulkAssignModal
