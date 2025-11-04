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
                    onClick={togglePasswordVisibility}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white transition-colors"
                >
                    {showPassword ? (
                        <EyeOff size={16} />
                    ) : (
                        <Eye size={16} />
                    )}
                </button>
            )}
        </div>
    )
}

export default InputField
