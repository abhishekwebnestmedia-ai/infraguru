import React, { useState } from 'react'
import InputField from '../shared/components/InputField'
import { useAuth } from '../shared/hooks/useAuth'
import { useLocation } from 'react-router-dom'
import { toast } from 'react-toastify'
import { ArrowUpRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const ResetPassword = () => {
  const [token, setToken] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const { resetPassword, loading } = useAuth()
  const navigate = useNavigate()
    const location = useLocation()

    // If token is provided as query param (e.g. /reset-password?token=abc), prefill
    React.useEffect(() => {
      const params = new URLSearchParams(location.search)
      const t = params.get('token')
      if (t) setToken(t)
    }, [location.search])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!token) {
      toast.error('Please provide the reset token (from your email)')
      return
    }
    if (newPassword.length < 8) {
      toast.error('Password must be at least 8 characters')
      return
    }
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    try {
      const res = await resetPassword({ token, newPassword })
      if (res.success) {
        toast.success('Password reset successful. Please login with your new password.')
        navigate('/login')
      } else {
        toast.error(res.error || 'Failed to reset password')
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
          <h2 className="section-heading text-white">Set New Password</h2>
          <p className="text-sm text-white/80">Enter the OTP or reset token you received and set a new password.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <InputField
            type="text"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="Reset Token / OTP"
            required
          />

          <InputField
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="New Password"
            required
          />

          <InputField
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm Password"
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
                Resetting...
              </>
            ) : (
              <>
                Reset Password
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

export default ResetPassword
