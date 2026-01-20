import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import api from '../../shared/services/apiService'
import CustomSelect from '../../shared/components/CustomSelect'

const EditInventory = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const queryClient = useQueryClient()
  const [formData, setFormData] = useState({
    propertyCode: '',
    title: '',
    type: '',
    projectName: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    landmark: '',
    bhk: '',
    size: '',
    sizeUnit: 'sqft',
    floor: '',
    totalFloors: '',
    facing: '',
    price: '',
    currency: 'INR',
    negotiable: true,
    status: 'available',
    ownerName: '',
    ownerPhone: '',
    description: '',
    images: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(true)

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        setIsFetching(true)
        const response = await api.get(`/inventory/${id}`)
        const data = response.data.data
        
        setFormData({
          propertyCode: data.propertyCode || '',
          title: data.title || '',
          type: data.type || '',
          projectName: data.projectName || '',
          address: data.location?.address || '',
          city: data.location?.city || '',
          state: data.location?.state || '',
          pincode: data.location?.pincode || '',
          landmark: data.location?.landmark || '',
          bhk: data.unitDetails?.bhk || '',
          size: data.unitDetails?.size || '',
          sizeUnit: data.unitDetails?.sizeUnit || 'sqft',
          floor: data.unitDetails?.floor || '',
          totalFloors: data.unitDetails?.totalFloors || '',
          facing: data.unitDetails?.facing || '',
          price: data.pricing?.price || '',
          currency: data.pricing?.currency || 'INR',
          negotiable: data.pricing?.negotiable !== false,
          status: data.status || 'available',
          ownerName: data.ownerName || '',
          ownerPhone: data.ownerPhone || '',
          description: data.description || '',
          images: data.images?.join(', ') || ''
        })
      } catch (err) {
        console.error('Error fetching inventory:', err)
        alert('Failed to load inventory details')
      } finally {
        setIsFetching(false)
      }
    }

    fetchInventory()
  }, [id])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setIsLoading(true)
      
      const payload = {
        propertyCode: formData.propertyCode,
        title: formData.title,
        type: formData.type,
        projectName: formData.projectName,
        location: {
          address: formData.address,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
          landmark: formData.landmark
        },
        unitDetails: {
          bhk: formData.bhk,
          size: Number(formData.size),
          sizeUnit: formData.sizeUnit,
          floor: Number(formData.floor),
          totalFloors: Number(formData.totalFloors),
          facing: formData.facing
        },
        pricing: {
          price: Number(formData.price),
          currency: formData.currency,
          negotiable: formData.negotiable
        },
        status: formData.status,
        ownerName: formData.ownerName,
        ownerPhone: formData.ownerPhone,
        description: formData.description,
        images: formData.images ? formData.images.split(',').map(img => img.trim()) : []
      }

      await api.put(`/inventory/${id}`, payload)
      queryClient.invalidateQueries(['inventory'])
      alert('Inventory updated successfully!')
      navigate('/inventory')
    } catch (err) {
      console.error('Error updating inventory:', err)
      alert('Failed to update inventory: ' + (err.response?.data?.message || err.message))
    } finally {
      setIsLoading(false)
    }
  }

  const propertyTypeOptions = ['flat', 'villa', 'plot', 'commercial', 'office']
  const statusOptions = ['available', 'sold', 'reserved', 'under-construction']
  const bhkOptions = ['1BHK', '2BHK', '3BHK', '4BHK', '5BHK', 'Studio']
  const facingOptions = ['North', 'South', 'East', 'West', 'North-East', 'North-West', 'South-East', 'South-West']
  const sizeUnitOptions = ['sqft', 'sqm', 'acres']

  if (isFetching) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-gray-600">Loading inventory...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Edit Inventory</h1>
        <button
          onClick={() => navigate('/inventory')}
          className="px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg"
        >
          Cancel
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="text-lg font-semibold mb-4">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Property Code *</label>
              <input
                type="text"
                name="propertyCode"
                value={formData.propertyCode}
                onChange={handleChange}
                required
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Property Type *</label>
              <CustomSelect
                name="type"
                value={formData.type}
                onChange={handleChange}
                options={propertyTypeOptions}
                placeholder="Select Type"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Project Name</label>
              <input
                type="text"
                name="projectName"
                value={formData.projectName}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Location Details */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="text-lg font-semibold mb-4">Location Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Address *</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                required
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">State *</label>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                required
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Pincode *</label>
              <input
                type="text"
                name="pincode"
                value={formData.pincode}
                onChange={handleChange}
                required
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Landmark</label>
              <input
                type="text"
                name="landmark"
                value={formData.landmark}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Unit Details */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="text-lg font-semibold mb-4">Unit Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">BHK *</label>
              <CustomSelect
                name="bhk"
                value={formData.bhk}
                onChange={handleChange}
                options={bhkOptions}
                placeholder="Select BHK"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Size *</label>
              <input
                type="number"
                name="size"
                value={formData.size}
                onChange={handleChange}
                required
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Size Unit</label>
              <CustomSelect
                name="sizeUnit"
                value={formData.sizeUnit}
                onChange={handleChange}
                options={sizeUnitOptions}
                placeholder="Select Unit"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Floor</label>
              <input
                type="number"
                name="floor"
                value={formData.floor}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Total Floors</label>
              <input
                type="number"
                name="totalFloors"
                value={formData.totalFloors}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Facing</label>
              <CustomSelect
                name="facing"
                value={formData.facing}
                onChange={handleChange}
                options={facingOptions}
                placeholder="Select Facing"
              />
            </div>
          </div>
        </div>

        {/* Pricing & Status */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="text-lg font-semibold mb-4">Pricing & Status</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price *</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status *</label>
              <CustomSelect
                name="status"
                value={formData.status}
                onChange={handleChange}
                options={statusOptions}
                placeholder="Select Status"
                required
              />
            </div>
            <div className="flex items-center pt-6">
              <input
                type="checkbox"
                name="negotiable"
                checked={formData.negotiable}
                onChange={handleChange}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label className="ml-2 text-sm font-medium text-gray-700">Negotiable</label>
            </div>
          </div>
        </div>

        {/* Owner Details */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="text-lg font-semibold mb-4">Owner Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Owner Name *</label>
              <input
                type="text"
                name="ownerName"
                value={formData.ownerName}
                onChange={handleChange}
                required
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Owner Phone *</label>
              <input
                type="tel"
                name="ownerPhone"
                value={formData.ownerPhone}
                onChange={handleChange}
                required
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Additional Information */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="text-lg font-semibold mb-4">Additional Information</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Images (comma-separated URLs)</label>
              <input
                type="text"
                name="images"
                value={formData.images}
                onChange={handleChange}
                placeholder="https://example.com/img1.jpg, https://example.com/img2.jpg"
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate('/inventory')}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Updating...' : 'Update Inventory'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default EditInventory
