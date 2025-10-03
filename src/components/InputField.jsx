import React from 'react'

const InputField = ({ 
    type = "text", 
    value, 
    onChange, 
    placeholder, 
    required = false, 
    className = "",
    ...props 
}) => {
    return (
        <div>
            <input
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className={`input ${className}`}
                required={required}
                {...props}
            />
        </div>
    )
}

export default InputField
