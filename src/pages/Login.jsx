import React, { useState } from 'react'
import useRevealOnScroll from '../hooks/useRevealOnScroll'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const Login = () => {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState('')
  const [otpSent, setOtpSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useRevealOnScroll()

  const sendOtp = (e) => {
    e && e.preventDefault()
    setError('')
    if (!phone || phone.replace(/\D/g, '').length < 10) {
      setError('Please enter a valid mobile number')
      return
    }
    // In a real app you'd call your backend to send an OTP. Here we just simulate.
    setOtpSent(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!otpSent) {
      setError('Please request an OTP first')
      return
    }
    if (otp !== '1234') {
      setError('Invalid OTP')
      return
    }

    setLoading(true)
    try {
      // We don't have real emails for phone users; create a mock email for the mock login
      const mockEmail = `${phone.replace(/\D/g, '')}@phone.local`
      const user = await login(mockEmail, '')
      if (user) navigate('/')
    } catch (err) {
      setError('Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto py-12 px-4">
      <h1 className="text-2xl font-bold mb-4">Sign In</h1>
      {error && <div className="mb-4 text-red-600">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        {!otpSent ? (
          <div>
            <label className="block text-sm font-medium mb-1">Mobile number</label>
            <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} className="input-field w-full" placeholder="e.g. +91 98xxxxxxxx" required />
            <div className="flex mt-3">
              <button onClick={sendOtp} className="btn-primary">Send OTP</button>
            </div>
          </div>
        ) : (
          <div>
            <label className="block text-sm font-medium mb-1">Enter OTP</label>
            <input type="text" value={otp} onChange={e => setOtp(e.target.value)} className="input-field w-full" placeholder="Enter the 4-digit OTP" required />
            <div className="flex mt-3 gap-2">
              <button type="submit" className="btn-primary" disabled={loading}>{loading ? 'Signing in...' : 'Sign In'}</button>
              <button type="button" className="btn-outline" onClick={() => { setOtp(''); setOtpSent(false); }}>Change Number</button>
            </div>
            <div className="text-xs text-neutral-500 mt-2">(For demo use OTP <strong>1234</strong>)</div>
          </div>
        )}
      </form>
    </div>
  )
}

export default Login
