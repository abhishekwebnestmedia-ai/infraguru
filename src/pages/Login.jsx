import React, { useState } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import InputField from '../components/InputField'

const Login = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [keepMeLogin, setKeepMeLogin] = useState(false)

    const handleSubmit = (e) => {
        e.preventDefault()
        // Handle login logic here
        console.log({ email, password, keepMeLogin })
    }

    return (
        <div
            className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat"
            style={{
                backgroundImage: "url('/Images/loginBgImage.png')",
                backgroundSize: 'cover',
                backgroundPosition: 'center'
            }}
        >
            {/* Overlay for better contrast */}
            <div className="absolute inset-0 bg-black/20"></div>

            {/* Logo */}
            <div className="absolute top-8 left-8">
                <img
                    src="/logo/infraguruLogo.svg"
                    alt="InfraGuru Logo"
                    className="h-12 w-auto"
                />
            </div>

            {/* Login Card */}
            <div className="relative z-10 bg-white/10 backdrop-blur-md rounded-lg p-8 w-full max-w-md mx-4 border border-white/20">
                <div className="text-center mb-8">
                    <h2 className="text-2xl font-semibold text-white">
                        Log In To InfraGuru
                    </h2>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Email Input */}
                    <InputField
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email"
                        required
                    />

                    {/* Password Input */}
                    <InputField
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        required
                    />

                    {/* Keep Me Login & Links */}
                    <div className="flex items-start justify-between">
                        <div className="flex items-center">
                            <input
                                id="keep-me-login"
                                type="checkbox"
                                checked={keepMeLogin}
                                onChange={(e) => setKeepMeLogin(e.target.checked)}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <label htmlFor="keep-me-login" className="ml-2 text-sm text-white/90">
                                Keep Me Login
                            </label>
                        </div>
                        <div className="text-sm text-right">
                            <div className="mb-1">
                                <a href="#" className="text-[var(--blue700)] hover:text-blue-800 transition-colors">
                                    Forgot Password?
                                </a>
                            </div>
                            <div>
                                <span className="text-white/90">New here? </span>
                                <Link
                                    to="/register"
                                    className="text-[var(--blue700)] hover:text-blue-800 transition-colors"
                                >
                                    Register
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Login Button */}
                    <button
                        type="submit"
                        className="w-full bg-[var(--blue700)] hover:bg-blue-800 text-white font-medium py-3 px-4 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center justify-center gap-2"
                    >
                        Login
                        <ArrowUpRight size={16} />
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

export default Login
