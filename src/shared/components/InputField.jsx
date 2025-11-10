import React, { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'

const InputField = ({ 
    type = "text", 
    value, 
    onChange, 
    placeholder, 
    required = false, 
    className = "",
    ...props 
}) => {
    const [showPassword, setShowPassword] = useState(false);
    
    const isPasswordField = type === "password";
    const inputType = isPasswordField && showPassword ? "text" : type;

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="relative">
            <input
                type={inputType}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className={`input ${className} ${isPasswordField ? 'pr-10' : ''}`}
                required={required}
                {...props}
            />
            {isPasswordField && (
                <button
                    type="button"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    onClick={togglePasswordVisibility}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors focus:outline-none"
                >
                    {showPassword ? (
                        <EyeOff size={18} />
                    ) : (
                        <Eye size={18} />
                    )}
                </button>
            )}
        </div>
    )
}

export default InputField
