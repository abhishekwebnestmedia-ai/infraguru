import React, { useState } from 'react'
import InputField from '../components/InputField'
import { useAuth } from '../hooks/useAuth'
import { toast } from 'react-toastify'
import { ArrowUpRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const ForgotPassword = () => {
  const [email, setEmail] = useState('')
  const { forgotPassword, loading } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await forgotPassword({ email })
      if (res.success) {
        toast.success('OTP / reset instructions sent to your email.');
        // Optionally navigate to reset page — user will paste token from email
        navigate('/reset-password')
      } else {
        toast.error(res.error || 'Failed to send reset instructions')
      }
    } catch (error) {
      console.error(error)
      toast.error('An unexpected error occurred')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat" style={{backgroundImage: "url('/Images/loginBgImage.png')"}}>
      <div className="absolute inset-0 bg-black/20"></div>
      <div className="relative z-10 bg-white/10 backdrop-blur-md rounded-lg p-8 w-full max-w-md mx-4 border border-white/20">
        <div className="text-center mb-8">
          <h2 className="section-heading text-white">Reset Your Password</h2>
          <p className="text-sm text-white/80">Enter your account email and we'll send you an OTP or reset token.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <InputField
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[var(--blue700)] hover:bg-blue-800 disabled:bg-blue-400 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Sending...
              </>
            ) : (
              <>
                Send Reset Link
                <ArrowUpRight size={16} />
              </>
            )}
          </button>
        </form>

        <div className="mt-4 text-sm text-white/90">
          <button onClick={() => navigate('/login')} className="text-[var(--blue700)]">Back to login</button>
        </div>
      </div>
    </div>
  )
}

export default ForgotPassword
