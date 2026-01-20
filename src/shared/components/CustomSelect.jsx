import React, { useState, useRef, useEffect } from 'react'

const CustomSelect = ({ name, value, onChange, options = [], placeholder = 'Select', required = false, className = '' }) => {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!ref.current) return
      const toggleBtn = ref.current.querySelector('button[aria-haspopup="menu"]')
      if (ref.current.contains(e.target) || (toggleBtn && toggleBtn.contains(e.target))) return
      setOpen(false)
    }

    const handleKey = (e) => {
      if (e.key === 'Escape') setOpen(false)
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleKey)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleKey)
    }
  }, [])

  const resolveOption = (opt) => {
    if (opt == null) return { label: String(opt), value: opt }
    if (typeof opt === 'string' || typeof opt === 'number') return { label: String(opt), value: opt }
    return { label: opt.label ?? opt.name ?? String(opt.value), value: opt.value ?? opt.name ?? opt }
  }

  const handleSelect = (opt) => {
    const o = resolveOption(opt)
    if (onChange) onChange({ target: { name, value: o.value } })
    setOpen(false)
  }

  const selectedLabel = (() => {
    if (value === '' || value == null) return ''
    const found = options.map(resolveOption).find(o => String(o.value) === String(value))
    return found ? found.label : String(value)
  })()

  return (
    <div className={`relative ${className}`} ref={ref}>
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen(s => !s)}
        className="flex items-center justify-between w-full p-2 border border-gray-300 rounded-lg bg-white text-left focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      >
        <span className={`${selectedLabel ? 'text-gray-900' : 'text-gray-500'}`}>
          {selectedLabel || placeholder}
        </span>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={open ? 'M5 15l7-7 7 7' : 'M19 9l-7 7-7-7'} />
        </svg>
      </button>

      {open && (
        <div role="menu" className="absolute z-20 mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-md py-1 max-h-56 overflow-auto">
          {options.length === 0 && (
            <div className="px-3 py-2 text-sm text-gray-500">No options</div>
          )}
          {options.map((opt, idx) => {
            const o = resolveOption(opt)
            return (
              <button
                key={idx}
                type="button"
                role="menuitem"
                onClick={() => handleSelect(opt)}
                className="w-full text-left px-3 py-2 text-sm hover:bg-blue-50"
              >
                {o.label}
              </button>
            )
          })}
        </div>
      )}
      {required && <input type="hidden" name={name} value={value || ''} required />}
    </div>
  )
}

export default CustomSelect
