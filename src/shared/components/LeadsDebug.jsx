import React, { useEffect, useState } from 'react'
import api from '../services/apiService'

const LeadsDebug = () => {
  const [status, setStatus] = useState('Loading...')
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    const testAPI = async () => {
      try {
        setStatus('Checking token...')
        const token = localStorage.getItem('authToken')
        console.log('🔑 Token in localStorage:', token ? `${token.substring(0, 20)}...` : 'NO TOKEN')
        
        if (!token) {
          setError('No authentication token found in localStorage')
          setStatus('Error: No token')
          return
        }

        setStatus('Making API call...')
        console.log('📡 Making request to:', `${api.defaults.baseURL}/lead/getlead`)
        console.log('🔐 Request headers will include:', {
          'Authorization': `Bearer ${token.substring(0, 20)}...`,
          'Content-Type': 'application/json'
        })

        const response = await api.get('/lead/getlead')
        
        console.log('✅ Full API Response:', response)
        console.log('📦 Response Data:', response.data)
        console.log('📊 Response Status:', response.status)
        console.log('📋 Response Headers:', response.headers)
        
        setData(response.data)
        setStatus('Success!')
        
      } catch (err) {
        console.error('❌ Complete API Error Object:', err)
        console.error('❌ Error Response:', err.response)
        console.error('❌ Error Request:', err.request)
        console.error('❌ Error Message:', err.message)
        console.error('❌ Error Config:', err.config)
        
        let errorMessage = 'Unknown error'
        
        if (err.response) {
          // Server responded with error status
          errorMessage = `Server Error: ${err.response.status} - ${err.response.data?.message || err.response.statusText}`
        } else if (err.request) {
          // Request was made but no response received
          errorMessage = 'Network Error: No response from server'
        } else {
          // Something else happened
          errorMessage = `Request Error: ${err.message}`
        }
        
        setError(errorMessage)
        setStatus('Failed')
      }
    }

    testAPI()
  }, [])

  return (
    <div className="p-4 border-2 border-blue-200 rounded bg-blue-50">
      <h3 className="font-bold mb-2 text-blue-800">🔍 Leads API Debug Panel</h3>
      <p><strong>Status:</strong> <span className={status.includes('Error') || status === 'Failed' ? 'text-red-600' : status === 'Success!' ? 'text-green-600' : 'text-yellow-600'}>{status}</span></p>
      
      {error && (
        <div className="mt-2 p-3 bg-red-100 border-2 border-red-300 rounded">
          <strong className="text-red-800">Error Details:</strong>
          <p className="text-red-700 text-sm mt-1">{error}</p>
        </div>
      )}
      
      {data && (
        <div className="mt-2 p-3 bg-green-100 border-2 border-green-300 rounded">
          <p><strong className="text-green-800">API Response Success!</strong></p>
          <p><strong>Success:</strong> {data.success ? '✅ true' : '❌ false'}</p>
          <p><strong>Count:</strong> {data.count || 0}</p>
          <p><strong>Data Length:</strong> {data.data?.length || 0}</p>
          <p><strong>Role:</strong> {data.role || 'N/A'}</p>
          
          {data.data && data.data.length > 0 && (
            <details className="mt-2">
              <summary className="cursor-pointer font-semibold text-green-800">📋 View First Lead Data</summary>
              <pre className="text-xs bg-white p-2 rounded mt-2 overflow-auto max-h-40 border">
                {JSON.stringify(data.data[0], null, 2)}
              </pre>
            </details>
          )}
        </div>
      )}
      
      <div className="mt-3 text-xs text-gray-600">
        <p><strong>API Base URL:</strong> {api.defaults.baseURL}</p>
        <p><strong>Endpoint:</strong> /lead/getlead</p>
        <p><strong>Token Status:</strong> {localStorage.getItem('authToken') ? '🟢 Present' : '🔴 Missing'}</p>
      </div>
      
      <div className="mt-3 flex gap-2">
        <button 
          onClick={() => window.location.reload()} 
          className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
        >
          🔄 Retry API Call
        </button>
        <button 
          onClick={() => {
            console.log('🔍 Current localStorage authToken:', localStorage.getItem('authToken'))
            console.log('🔍 Current api.defaults:', api.defaults)
          }} 
          className="px-3 py-1 bg-gray-600 text-white text-sm rounded hover:bg-gray-700"
        >
          🔍 Debug Info
        </button>
      </div>
    </div>
  )
}

export default LeadsDebug