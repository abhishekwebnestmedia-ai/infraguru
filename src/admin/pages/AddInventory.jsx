import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import api from '../../shared/services/apiService'
import CustomSelect from '../../shared/components/CustomSelect'
import {
  Home,
  Info,
  MapPin,
  Building,
  DollarSign,
  User,
  Edit,
  Loader2
} from 'lucide-react'

const AddInventory = () => {
  const navigate = useNavigate()
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
      
      // Prepare payload according to API structure
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

      await api.post('/inventory', payload)
      queryClient.invalidateQueries(['inventory'])
      alert('Inventory created successfully!')
      navigate('/inventory')
    } catch (err) {
      console.error('Error creating inventory:', err)
      alert('Failed to create inventory: ' + (err.response?.data?.message || err.message))
    } finally {
      setIsLoading(false)
    }
  }

  const propertyTypeOptions = ['flat', 'villa', 'plot', 'commercial', 'office']
  const statusOptions = ['available', 'sold', 'reserved', 'under-construction']
  const bhkOptions = ['1BHK', '2BHK', '3BHK', '4BHK', '5BHK', 'Studio']
  const facingOptions = ['North', 'South', 'East', 'West', 'North-East', 'North-West', 'South-East', 'South-West']
  const sizeUnitOptions = ['sqft', 'sqm', 'acres']

  return (
    <div className="min-h-screen ">
      <div className="">
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="bg-green-600 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 ">
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                  <Home size={20} className="text-white" />
                </div>
                <h1 className="text-xl font-bold text-white">Add New Inventory</h1>
              </div>
              <button
                onClick={() => navigate('/inventory')}
                className="px-4 py-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Basic Information */}
            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                  <Info size={16} className="text-blue-600" />
                </div>
                <h2 className="text-lg font-semibold text-gray-900">Basic Information</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Property Code *</label>
                  <input
                    type="text"
                    name="propertyCode"
                    value={formData.propertyCode}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors bg-white"
                    placeholder="Enter property code"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors bg-white"
                    placeholder="Enter property title"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Property Type *</label>
                  <CustomSelect
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    options={propertyTypeOptions}
                    placeholder="Select Type"
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Project Name</label>
                  <input
                    type="text"
                    name="projectName"
                    value={formData.projectName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors bg-white"
                    placeholder="Enter project name"
                  />
                </div>
              </div>
            </div>

            {/* Location Details */}
            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center">
                  <MapPin size={16} className="text-green-600" />
                </div>
                <h2 className="text-lg font-semibold text-gray-900">Location Details</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Address *</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors bg-white"
                    placeholder="Enter full address"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">City *</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors bg-white"
                    placeholder="Enter city"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">State *</label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors bg-white"
                    placeholder="Enter state"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Pincode *</label>
                  <input
                    type="text"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors bg-white"
                    placeholder="Enter pincode"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Landmark</label>
                  <input
                    type="text"
                    name="landmark"
                    value={formData.landmark}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors bg-white"
                    placeholder="Enter landmark"
                  />
                </div>
              </div>
            </div>

            {/* Unit Details */}
            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center">
                  <Building size={16} className="text-purple-600" />
                </div>
                <h2 className="text-lg font-semibold text-gray-900">Unit Details</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">BHK *</label>
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">Size *</label>
                  <input
                    type="number"
                    name="size"
                    value={formData.size}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors bg-white"
                    placeholder="Enter size"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Size Unit</label>
                  <CustomSelect
                    name="sizeUnit"
                    value={formData.sizeUnit}
                    onChange={handleChange}
                    options={sizeUnitOptions}
                    placeholder="Select Unit"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Floor</label>
                  <input
                    type="number"
                    name="floor"
                    value={formData.floor}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors bg-white"
                    placeholder="Enter floor"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Total Floors</label>
                  <input
                    type="number"
                    name="totalFloors"
                    value={formData.totalFloors}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors bg-white"
                    placeholder="Enter total floors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Facing</label>
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
            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center">
                  <DollarSign size={16} className="text-yellow-600" />
                </div>
                <h2 className="text-lg font-semibold text-gray-900">Pricing & Status</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Price *</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors bg-white"
                    placeholder="Enter price"
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
                <div className="flex items-center pt-2">
                  <input
                    type="checkbox"
                    name="negotiable"
                    checked={formData.negotiable}
                    onChange={handleChange}
                    className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                  />
                  <label className="ml-3 text-sm font-medium text-gray-700">Negotiable</label>
                </div>
              </div>
            </div>

            {/* Owner Details */}
            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center">
                  <User size={16} className="text-indigo-600" />
                </div>
                <h2 className="text-lg font-semibold text-gray-900">Owner Details</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Owner Name *</label>
                  <input
                    type="text"
                    name="ownerName"
                    value={formData.ownerName}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors bg-white"
                    placeholder="Enter owner name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Owner Phone *</label>
                  <input
                    type="tel"
                    name="ownerPhone"
                    value={formData.ownerPhone}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors bg-white"
                    placeholder="Enter owner phone"
                  />
                </div>
              </div>
            </div>

            {/* Additional Information */}
            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-6 h-6 bg-teal-100 rounded-full flex items-center justify-center">
                  <Edit size={16} className="text-gray-600" />
                </div>
                <h2 className="text-lg font-semibold text-gray-900">Additional Information</h2>
              </div>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="4"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors bg-white resize-none"
                    placeholder="Enter property description..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Images (comma-separated URLs)</label>
                  <input
                    type="text"
                    name="images"
                    value={formData.images}
                    onChange={handleChange}
                    placeholder="https://example.com/img1.jpg, https://example.com/img2.jpg"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => navigate('/inventory')}
                className="px-6 py-3 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-3 bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors font-medium shadow-sm"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="animate-spin h-4 w-4" />
                    Creating...
                  </div>
                ) : (
                  'Create Inventory'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default AddInventory
