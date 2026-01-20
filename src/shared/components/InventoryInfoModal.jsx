import React, { useEffect, useRef } from 'react'
import { Home, MapPin, DollarSign, User, Phone, Layers, Maximize, Navigation, Edit, X } from 'lucide-react'

const Field = ({ label, value, icon: Icon }) => (
  <div className="flex items-start gap-3">
    {Icon && <Icon className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />}
    <div className="min-w-0 flex-1">
      <div className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">{label}</div>
      <div className="text-sm text-gray-900 font-medium break-words">{value ?? '-'}</div>
    </div>
  </div>
)

const StatusPill = ({ status }) => {
  const map = {
    'available': 'bg-green-100 text-green-800 border-green-200',
    'sold': 'bg-red-100 text-red-800 border-red-200',
    'reserved': 'bg-yellow-100 text-yellow-800 border-yellow-200',
    'under-construction': 'bg-blue-100 text-blue-800 border-blue-200'
  }
  const cls = map[status] || 'bg-gray-100 text-gray-800 border-gray-200'
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${cls}`}>
      {status}
    </span>
  )
}

const InventoryInfoModal = ({ open, inventory, onClose }) => {
  const modalRef = useRef(null)
  const closeButtonRef = useRef(null)

  useEffect(() => {
    if (!open) return

    const previouslyFocused = document.activeElement
    if (closeButtonRef.current) {
      closeButtonRef.current.focus()
    }

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose()
      }
      if (e.key === 'Tab') {
        const modal = modalRef.current
        if (!modal) return
        const focusableElements = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')
        const firstElement = focusableElements[0]
        const lastElement = focusableElements[focusableElements.length - 1]

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            lastElement.focus()
            e.preventDefault()
          }
        } else {
          if (document.activeElement === lastElement) {
            firstElement.focus()
            e.preventDefault()
          }
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      if (previouslyFocused && previouslyFocused.focus) {
        previouslyFocused.focus()
      }
    }
  }, [open, onClose])

  if (!open || !inventory) return null

  const propertyType = inventory.type || 'Property'
  const initials = (inventory.title || propertyType).split(' ').map(s => s[0]).join('').slice(0, 2).toUpperCase()
  
  const formatPrice = (price) => {
    if (!price) return '-';
    return `₹${Number(price).toLocaleString('en-IN')}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-xl shadow-2xl overflow-hidden transform transition-all duration-300 scale-100 opacity-100"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white flex items-center justify-center font-bold text-xl shadow-lg">
              {initials}
            </div>
            <div>
              <h2 id="modal-title" className="text-2xl font-bold text-gray-900">
                {inventory.title || 'Inventory Details'}
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                {inventory.propertyCode} • {inventory.projectName || 'N/A'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-xs text-gray-500 uppercase tracking-wide">Property Type</div>
              <div className="text-sm text-gray-900 font-medium capitalize">
                {inventory.type || '-'}
              </div>
            </div>
            <StatusPill status={inventory.status} />
            <a
              href={`/inventory/edit/${inventory.id}`}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium shadow hover:bg-blue-700 transition-colors"
            >
              <Edit className="w-4 h-4" />
              Edit
            </a>
            <button
              ref={closeButtonRef}
              onClick={onClose}
              className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Column 1: Location Details */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Location</h3>
              <Field 
                label="Address" 
                value={inventory.location?.address} 
                icon={MapPin} 
              />
              <Field 
                label="City" 
                value={inventory.location?.city} 
                icon={MapPin} 
              />
              <Field 
                label="State" 
                value={inventory.location?.state} 
                icon={MapPin} 
              />
              <Field 
                label="Pincode" 
                value={inventory.location?.pincode} 
                icon={MapPin} 
              />
              {inventory.location?.landmark && (
                <Field 
                  label="Landmark" 
                  value={inventory.location.landmark} 
                  icon={Navigation} 
                />
              )}
            </div>

            {/* Column 2: Unit Details */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Unit Details</h3>
              <Field 
                label="BHK" 
                value={inventory.unitDetails?.bhk} 
                icon={Home} 
              />
              <Field 
                label="Size" 
                value={inventory.unitDetails?.size ? `${inventory.unitDetails.size} ${inventory.unitDetails.sizeUnit || 'sqft'}` : '-'} 
                icon={Maximize} 
              />
              <Field 
                label="Floor" 
                value={inventory.unitDetails?.floor ? `${inventory.unitDetails.floor} / ${inventory.unitDetails.totalFloors || '?'}` : '-'} 
                icon={Layers} 
              />
              <Field 
                label="Facing" 
                value={inventory.unitDetails?.facing} 
                icon={Navigation} 
              />
            </div>

            {/* Column 3: Pricing & Owner */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Pricing & Owner</h3>
              <Field 
                label="Price" 
                value={formatPrice(inventory.pricing?.price)} 
                icon={DollarSign} 
              />
              <Field 
                label="Negotiable" 
                value={inventory.pricing?.negotiable ? 'Yes' : 'No'} 
                icon={DollarSign} 
              />
              <Field 
                label="Owner Name" 
                value={inventory.ownerName} 
                icon={User} 
              />
              <Field 
                label="Owner Contact" 
                value={inventory.ownerPhone} 
                icon={Phone} 
              />
            </div>

            {/* Full Width: Description */}
            {inventory.description && (
              <div className="md:col-span-2 lg:col-span-3">
                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2 mb-4">Description</h3>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-sm text-gray-800">
                  {inventory.description || 'No description available.'}
                </div>
              </div>
            )}

            {/* Images section removed as requested */}
          </div>
        </div>
      </div>
    </div>
  )
}

export default InventoryInfoModal
