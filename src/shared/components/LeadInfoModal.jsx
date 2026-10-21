import React, { useEffect, useRef } from 'react'
import { Phone, Mail, MapPin, User, Calendar, DollarSign, Briefcase, MessageSquare, Edit, X } from 'lucide-react'

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
    'Prospect': 'bg-blue-100 text-blue-800 border-blue-200',
    'Follow Ups': 'bg-yellow-100 text-yellow-800 border-yellow-200',
    'Closer': 'bg-green-100 text-green-800 border-green-200',
    'Not Interested': 'bg-red-100 text-red-800 border-red-200',
    'Not Connected': 'bg-gray-100 text-gray-800 border-gray-200'
  }
  const cls = map[status] || 'bg-gray-100 text-gray-800 border-gray-200'
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${cls}`}>{status}</span>
  )
}

const LeadInfoModal = ({ open, lead, onClose }) => {
  const modalRef = useRef(null)
  const closeButtonRef = useRef(null)

  useEffect(() => {
    if (!open) return

    // Focus management
    const previouslyFocused = document.activeElement
    if (closeButtonRef.current) {
      closeButtonRef.current.focus()
    }

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose()
      }
      // Simple focus trap - if tabbing out, keep focus in modal
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

  if (!open || !lead) return null

  const initials = (lead.clientName || lead.executiveName || '').split(' ').map(s => s[0]).join('').slice(0, 2).toUpperCase()

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
              {initials || 'L'}
            </div>
            <div>
              <h2 id="modal-title" className="text-2xl font-bold text-gray-900">
                {lead.clientName || lead.executiveName || 'Lead Details'}
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                {lead.clientName ? `Executive: ${lead.executiveName || '—'}` : (lead.executiveName || '')}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-xs text-gray-500 uppercase tracking-wide">Created</div>
              <div className="text-sm text-gray-900 font-medium">
                {lead.date ? new Date(lead.date).toLocaleDateString() : '-'}
              </div>
            </div>
            <StatusPill status={lead.status} />
            <a
              href={`/leads/edit/${lead.id}`}
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
            <div className="space-y-6">
              <Field label="Contact" value={lead.contactNo || lead.contactNumber} icon={Phone} />
              <Field label="Email" value={lead.email || lead.emailId} icon={Mail} />
              <Field label="Source" value={lead.source} icon={Briefcase} />
              <Field label="Assigned To" value={lead.assignedTo} icon={User} />
            </div>

            <div className="space-y-6">
              <Field label="Transfer To" value={lead.transferTo} icon={User} />
              <Field label="Captured By" value={lead.capturedBy} icon={User} />
              <Field label="Budget" value={lead.budget} icon={DollarSign} />
              <Field label="Location" value={lead.location} icon={MapPin} />
            </div>

            <div className="space-y-6">
              <Field label="Projects" value={lead.projects} icon={Briefcase} />
              <Field label="Follow Up" value={lead.followUp ? new Date(lead.followUp).toLocaleDateString() : '-'} icon={Calendar} />
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <MessageSquare className="w-4 h-4 text-gray-400" />
                  <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">Remarks</div>
                </div>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-sm text-gray-800 min-h-[120px] max-h-[200px] overflow-y-auto">
                  {lead.remark || 'No remarks available.'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LeadInfoModal
