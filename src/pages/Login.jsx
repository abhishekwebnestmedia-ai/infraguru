import React, { useState } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import InputField from '../shared/components/InputField'
import { useAuth } from '../shared/hooks/useAuth'

const Login = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [keepMeLogin, setKeepMeLogin] = useState(false)
    
    const navigate = useNavigate()
    const { login, loading } = useAuth()

    const handleSubmit = async (e) => {
        e.preventDefault()
        
        try {
            const result = await login({ email, password })
            
            if (result.success) {
                toast.success('Login successful!')
                navigate('/')
            } else {
                toast.error(result.error || 'Login failed')
            }
        } catch (error) {
            console.error('Login error:', error)
            toast.error('An unexpected error occurred')
        }
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
            {/* Rest of your component remains the same */}
            <div className="absolute inset-0 bg-black/20"></div>

            <div className="absolute top-8 left-8">
                <img
                    src="/logo/webnestlogin.svg"
                    alt="webnestmedia Logo"
                    className="h-8 w-auto"
                />
            </div>

            <div className="relative z-10 bg-white/10 backdrop-blur-md rounded-lg p-8 w-full max-w-md mx-4 border border-white/20">
                <div className="text-center mb-8">
                    <h2 className="section-heading  text-white">
                        Log In To webnestmedia
                    </h2>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <InputField
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email"
                        required
                    />

                    <InputField
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        required
                    />

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
                                <Link to="/forgot-password" className="text-[var(--blue700)] hover:text-blue-800 transition-colors">
                                    Forgot Password?
                                </Link>
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

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[var(--blue700)] hover:bg-blue-800 disabled:bg-blue-400 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                Logging in...
                            </>
                        ) : (
                            <>
                                Login
                                <ArrowUpRight size={16} />
                            </>
                        )}
                    </button>
                </form>
            </div>

            <div className="absolute bottom-4 left-4">
                <p className="text-white/60 text-xs">
                    Powered By WebnestMedia
                </p>
            </div>
        </div>
    )
}

export default Login
