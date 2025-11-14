import React, { useState } from 'react'
import { MapPin, Phone, X } from 'lucide-react'

const LocationPrompt = ({ onClose, onSetLocation }) => {
  const [mode, setMode] = useState('gps') // 'gps' | 'phone'
  const [phone, setPhone] = useState('')
  const [manualLocation, setManualLocation] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleUseGPS = async () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser')
      return
    }
    setLoading(true)
    setError('')
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude, source: 'gps' }
        onSetLocation(coords)
        onClose()
      },
      (err) => {
        setError(err.message || 'Unable to retrieve your location')
        setLoading(false)
      },
      { enableHighAccuracy: true, timeout: 10000 }
    )
  }

  const handleUsePhone = async (e) => {
    e.preventDefault()
    if (!phone && !manualLocation) {
      setError('Enter phone number or a location name')
      return
    }
    setLoading(true)
    setError('')
    try {
      // Simple fallback: if manualLocation provided, use that as a place string
      if (manualLocation) {
        onSetLocation({ place: manualLocation, source: 'manual' })
        onClose()
        return
      }
      // Phone-based lookup placeholder: we cannot actually resolve phone->location on client
      // Store masked phone and mark as unknown location tied to phone
      const masked = phone.replace(/.(?=.{4})/g, '*')
      onSetLocation({ phone: masked, source: 'phone' })
      onClose()
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 max-w-md w-full">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">Share your location</h2>
          <button onClick={onClose} className="p-1 rounded-md text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-700">
            <X className="h-5 w-5" />
          </button>
        </div>
        {error && (
          <div className="mb-3 p-3 bg-red-100 dark:bg-red-900 border border-red-300 dark:border-red-700 rounded-lg text-red-700 dark:text-red-300 text-sm">
            {error}
          </div>
        )}
        <div className="space-y-4">
          <div className="card">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <MapPin className="h-5 w-5 text-primary-600 mr-2" />
                <div>
                  <div className="font-medium">Use GPS</div>
                  <div className="text-sm text-neutral-500">Best accuracy for nearby alerts</div>
                </div>
              </div>
              <button onClick={handleUseGPS} disabled={loading} className="btn-primary disabled:opacity-50">
                Allow
              </button>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center mb-3">
              <Phone className="h-5 w-5 text-primary-600 mr-2" />
              <div>
                <div className="font-medium">Enter phone or place</div>
                <div className="text-sm text-neutral-500">We will use this to personalize alerts</div>
              </div>
            </div>
            <form onSubmit={handleUsePhone} className="space-y-3">
              <input
                type="tel"
                placeholder="Phone number (optional)"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="input-field"
              />
              <input
                type="text"
                placeholder="City/Area (optional)"
                value={manualLocation}
                onChange={(e) => setManualLocation(e.target.value)}
                className="input-field"
              />
              <button type="submit" disabled={loading} className="w-full btn-outline disabled:opacity-50">
                Save
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LocationPrompt



