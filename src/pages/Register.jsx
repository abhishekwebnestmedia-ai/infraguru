import React, { useState } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import InputField from '../shared/components/InputField'
import { useAuth } from '../shared/hooks/useAuth'

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        phoneNumber: '',
        address: '',
        empid: '',
        designation: ''
    })
    
    const navigate = useNavigate()
    const { register, loading } = useAuth()

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        
        try {
            const result = await register(formData)
            
            if (result.success) {
                toast.success('Registration successful!')
                navigate('/')
            } else {
                toast.error(result.error || 'Registration failed')
            }
        } catch (error) {
            console.error('Registration error:', error)
            toast.error('An unexpected error occurred')
        }
    }

    return (
        <div
            className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat"
            style={{
                backgroundImage: "url('/Images/registerbgImage.png')",
                backgroundSize: 'cover',
                backgroundPosition: 'center'
            }}
        >
            {/* Overlay for better contrast */}
            <div className="absolute inset-0 bg-black/20"></div>

            {/* Logo */}
            <div className="absolute top-8 left-8">
                <img
                    src="/logo/webnestmediaLogo.svg"
                    alt="webnestmedia Logo"
                    className="h-12 w-auto"
                />
            </div>

            {/* Register Card */}
            <div className="relative z-10 bg-white/10 backdrop-blur-md rounded-lg p-8 w-full max-w-md mx-4 border border-white/20">
                <div className="text-center mb-8">
                    <h2 className="section-heading text-white">
                        Sign Up To webnestmedia
                    </h2>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Name Input */}
                    <InputField
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Full Name"
                        required
                    />

                    {/* Email Input */}
                    <InputField
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Email"
                        required
                    />

                    {/* Phone Number Input */}
                    <InputField
                        type="tel"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        placeholder="Phone Number"
                        required
                    />

                    {/* Employee ID Input */}
                    <InputField
                        type="text"
                        name="empid"
                        value={formData.empid}
                        onChange={handleChange}
                        placeholder="Employee ID"
                        required
                    />

                    {/* Designation Input */}
                    <InputField
                        type="text"
                        name="designation"
                        value={formData.designation}
                        onChange={handleChange}
                        placeholder="Designation"
                        required
                    />

                    {/* Address Input */}
                    <InputField
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        placeholder="Address"
                        required
                    />

                    {/* Password Input */}
                    <InputField
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Password"
                        required
                    />

                    {/* Already have account link */}
                    <div className="text-right text-sm">
                        <span className="text-white/90">Already have an account? </span>
                        <Link
                            to="/login"
                            className="text-[var(--blue700)] hover:text-blue-800 transition-colors"
                        >
                            Login
                        </Link>
                    </div>

                    {/* Sign Up Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[var(--blue700)] hover:bg-blue-800 disabled:bg-blue-400 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                Signing up...
                            </>
                        ) : (
                            <>
                                Sign Up
                                <ArrowUpRight size={16} />
                            </>
                        )}
                    </button>
                </form>
            </div>

            {/* Footer */}
            <div className="absolute bottom-4 left-4">
                <p className="text-white/60 text-xs">
                    Powered By WebnestMedia
                </p>
            </div>
        </div>
    )
}

export default Register
