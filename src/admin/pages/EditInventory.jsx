import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import api from '../../shared/services/apiService'
import CustomSelect from '../../shared/components/CustomSelect'
import { Edit } from 'lucide-react'

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
  <div className="min-h-screen bg-gray-100 py-6 px-4">

    {/* Header */}
    <div className="max-w-6xl mx-auto bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-4 rounded-t-xl shadow-lg flex items-center justify-between">

     <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                  <Edit size={20} className="text-white" />
                </div>
                <h1 className="text-xl font-bold text-white">Edit Inventory</h1>
              </div>
      <button
        onClick={() => navigate('/inventory')}
        className="px-4 py-2 text-sm text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition"
      >
        Cancel
      </button>

    </div>



    {/* Main Card */}
    <div className="max-w-6xl mx-auto bg-white rounded-b-xl shadow-lg border border-gray-200 p-6">

      <form onSubmit={handleSubmit} className="space-y-7">


        {/* Basic Information */}
        <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">

          <h2 className="text-lg font-semibold mb-4 text-gray-900">
            Basic Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            <div>
              <label className="form-label">Property Code *</label>
              <input
                type="text"
                name="propertyCode"
                value={formData.propertyCode}
                onChange={handleChange}
                required
                className="form-input"
              />
            </div>

            <div>
              <label className="form-label">Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="form-input"
              />
            </div>

            <div>
              <label className="form-label">Property Type *</label>
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
              <label className="form-label">Project Name</label>
              <input
                type="text"
                name="projectName"
                value={formData.projectName}
                onChange={handleChange}
                className="form-input"
              />
            </div>

          </div>

        </div>


        {/* Location */}
        <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">

          <h2 className="text-lg font-semibold mb-4 text-gray-900">
            Location Details
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            <div className="md:col-span-2">
              <label className="form-label">Address *</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
                className="form-input"
              />
            </div>

            <div>
              <label className="form-label">City *</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                required
                className="form-input"
              />
            </div>

            <div>
              <label className="form-label">State *</label>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                required
                className="form-input"
              />
            </div>

            <div>
              <label className="form-label">Pincode *</label>
              <input
                type="text"
                name="pincode"
                value={formData.pincode}
                onChange={handleChange}
                required
                className="form-input"
              />
            </div>

            <div>
              <label className="form-label">Landmark</label>
              <input
                type="text"
                name="landmark"
                value={formData.landmark}
                onChange={handleChange}
                className="form-input"
              />
            </div>

          </div>

        </div>


        {/* Unit */}
        <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">

          <h2 className="text-lg font-semibold mb-4 text-gray-900">
            Unit Details
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

            <div>
              <label className="form-label">BHK *</label>
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
              <label className="form-label">Size *</label>
              <input
                type="number"
                name="size"
                value={formData.size}
                onChange={handleChange}
                required
                className="form-input"
              />
            </div>

            <div>
              <label className="form-label">Size Unit</label>
              <CustomSelect
                name="sizeUnit"
                value={formData.sizeUnit}
                onChange={handleChange}
                options={sizeUnitOptions}
              />
            </div>

            <div>
              <label className="form-label">Floor</label>
              <input
                type="number"
                name="floor"
                value={formData.floor}
                onChange={handleChange}
                className="form-input"
              />
            </div>

            <div>
              <label className="form-label">Total Floors</label>
              <input
                type="number"
                name="totalFloors"
                value={formData.totalFloors}
                onChange={handleChange}
                className="form-input"
              />
            </div>

            <div>
              <label className="form-label">Facing</label>
              <CustomSelect
                name="facing"
                value={formData.facing}
                onChange={handleChange}
                options={facingOptions}
              />
            </div>

          </div>

        </div>


        {/* Pricing */}
        <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">

          <h2 className="text-lg font-semibold mb-4 text-gray-900">
            Pricing & Status
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            <div>
              <label className="form-label">Price *</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                className="form-input"
              />
            </div>

            <div>
              <label className="form-label">Status *</label>
              <CustomSelect
                name="status"
                value={formData.status}
                onChange={handleChange}
                options={statusOptions}
                required
              />
            </div>

            <div className="flex items-center pt-2">
              <input
                type="checkbox"
                name="negotiable"
                checked={formData.negotiable}
                onChange={handleChange}
                className="w-4 h-4 text-blue-600"
              />
              <span className="ml-2 text-sm">Negotiable</span>
            </div>

          </div>

        </div>


        {/* Owner */}
        <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">

          <h2 className="text-lg font-semibold mb-4 text-gray-900">
            Owner Details
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            <div>
              <label className="form-label">Owner Name *</label>
              <input
                type="text"
                name="ownerName"
                value={formData.ownerName}
                onChange={handleChange}
                required
                className="form-input"
              />
            </div>

            <div>
              <label className="form-label">Owner Phone *</label>
              <input
                type="tel"
                name="ownerPhone"
                value={formData.ownerPhone}
                onChange={handleChange}
                required
                className="form-input"
              />
            </div>

          </div>

        </div>


        {/* Submit */}
        <div className="flex justify-end gap-4 pt-4 ">

          <button
            type="button"
            onClick={() => navigate('/inventory')}
            className="px-6 py-2 border rounded-lg hover:bg-gray-100 font-medium"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow disabled:opacity-50 font-medium"
          >
            {isLoading ? 'Updating...' : 'Update Inventory'}
          </button>

        </div>


      </form>

    </div>

  </div>
);

}

export default EditInventory
