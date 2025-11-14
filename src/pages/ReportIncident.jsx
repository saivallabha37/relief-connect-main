import React, { useState } from 'react'
import { AlertTriangle, MapPin, Phone, Clock, Users, FileText, Send, X } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useDatabase } from '../contexts/DatabaseContext'
import { useNavigate } from 'react-router-dom'
import useRevealOnScroll from '../hooks/useRevealOnScroll'

const ReportIncident = () => {
  const navigate = useNavigate()
  const { user, userLocation } = useAuth()
  const [formData, setFormData] = useState({
    incidentType: 'other',
    title: '',
    description: '',
    severity: 'medium',
    location: userLocation ? `${userLocation.city}, ${userLocation.state || userLocation.country}` : '',
    latitude: userLocation?.lat || '',
    longitude: userLocation?.lng || '',
    phoneNumber: user?.phone || '',
    contactName: user?.name || '',
    numberOfAffected: '1',
    media: null,
    anonymous: false
  })

  // option to notify all users when submitting
  const [notifyEveryone, setNotifyEveryone] = useState(true)
  const { executeQuery } = useDatabase()

  // enable reveal-on-scroll animations for this page
  useRevealOnScroll()

  const [submitted, setSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const incidentTypes = [
    { value: 'flood', label: 'Flood/Water Emergency' },
    { value: 'fire', label: 'Fire/Explosion' },
    { value: 'earthquake', label: 'Earthquake' },
    { value: 'medical', label: 'Medical Emergency' },
    { value: 'accident', label: 'Accident/Injury' },
    { value: 'cyclone', label: 'Cyclone/Severe Weather' },
    { value: 'missing', label: 'Missing Person' },
    { value: 'infrastructure', label: 'Infrastructure Damage' },
    { value: 'other', label: 'Other' }
  ]

  const severityLevels = [
    { value: 'low', label: 'Low - Non-urgent', color: 'bg-green-100 text-green-800' },
    { value: 'medium', label: 'Medium - Moderate', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'high', label: 'High - Urgent', color: 'bg-orange-100 text-orange-800' },
    { value: 'critical', label: 'Critical - Emergency', color: 'bg-red-100 text-red-800' }
  ]

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleFileChange = (e) => {
    setFormData(prev => ({
      ...prev,
      media: e.target.files[0]
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    // Validate required fields
    if (!formData.title.trim() || !formData.description.trim()) {
      alert('Please fill in all required fields')
      setIsLoading(false)
      return
    }

    // If not anonymous, validate contact info
    if (!formData.anonymous && (!formData.contactName.trim() || !formData.phoneNumber.trim())) {
      alert('Please provide contact information or select Anonymous')
      setIsLoading(false)
      return
    }

    try {
      // Submit to mock database which will also broadcast if requested
      await executeQuery(
        'INSERT INTO alerts (title, description, severity, location, alert_type, source, image_url, contact_info) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [
          formData.title,
          formData.description,
          formData.severity,
          formData.location,
          formData.incidentType,
          'User Report',
          formData.media?.name || null,
          formData.anonymous ? 'Anonymous' : `${formData.contactName} | ${formData.phoneNumber}`,
          notifyEveryone // optional boolean flag at end controls broadcasting
        ]
      )

      setSubmitted(true)

      // Redirect after 3 seconds
      setTimeout(() => {
        navigate('/')
      }, 3000)
    } catch (error) {
      console.error('Error submitting incident:', error)
      alert('Failed to submit incident report. Please try again.')
      setIsLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="h-8 w-8 text-green-600 dark:text-green-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Report Submitted Successfully!
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Thank you for reporting this incident. Our emergency response team has been notified and will investigate shortly.
          </p>
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              <strong>Reference ID:</strong> INC{Date.now().toString().slice(-8).toUpperCase()}
            </p>
            <p className="text-xs text-blue-700 dark:text-blue-300 mt-2">
              You can track your report status using this reference ID.
            </p>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Redirecting to home page in 3 seconds...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="responsive-container min-h-screen py-8">
      <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8 reveal">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
          Report an Incident
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Help emergency responders by providing detailed information about the incident
        </p>
      </div>

      {/* Emergency Info Banner */}
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 mb-8 reveal">
        <div className="flex items-start">
          <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400 mr-3 mt-1 flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-red-800 dark:text-red-200 mb-1">
              For Life-Threatening Emergencies
            </h3>
            <p className="text-red-700 dark:text-red-300 text-sm">
              If someone is in immediate danger, please call <strong>911 / Emergency Services</strong> instead of using this form.
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="card space-y-6 reveal">
        {/* Incident Type */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
            <AlertTriangle className="h-4 w-4 inline mr-2" />
            Incident Type <span className="text-red-500">*</span>
          </label>
          <select
            name="incidentType"
            value={formData.incidentType}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          >
            {incidentTypes.map(type => (
              <option key={type.value} value={type.value}>{type.label}</option>
            ))}
          </select>
        </div>

        {/* Title */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
            <FileText className="h-4 w-4 inline mr-2" />
            Incident Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Brief title of the incident"
            maxLength="100"
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{formData.title.length}/100</p>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
            <FileText className="h-4 w-4 inline mr-2" />
            Detailed Description <span className="text-red-500">*</span>
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Provide detailed information about what happened, who is affected, and current situation..."
            rows="5"
            maxLength="1000"
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{formData.description.length}/1000</p>
        </div>

        {/* Severity Level */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-3">
            <AlertTriangle className="h-4 w-4 inline mr-2" />
            Severity Level <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {severityLevels.map(level => (
              <label key={level.value} className="cursor-pointer">
                <input
                  type="radio"
                  name="severity"
                  value={level.value}
                  checked={formData.severity === level.value}
                  onChange={handleChange}
                  className="sr-only"
                />
                <div className={`p-3 rounded-lg text-center font-medium text-sm transition-all ${
                  formData.severity === level.value
                    ? `${level.color} ring-2 ring-offset-2 ring-primary-500`
                    : `bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300`
                }`}>
                  {level.label}
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Location */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
              <MapPin className="h-4 w-4 inline mr-2" />
              Location
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="City, Area, Landmark"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
              <Users className="h-4 w-4 inline mr-2" />
              Number Affected
            </label>
            <input
              type="number"
              name="numberOfAffected"
              value={formData.numberOfAffected}
              onChange={handleChange}
              min="1"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
          </div>
        </div>

        {/* Coordinates */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
              Latitude
            </label>
            <input
              type="number"
              name="latitude"
              value={formData.latitude}
              onChange={handleChange}
              placeholder="e.g., 28.7041"
              step="0.0001"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
              Longitude
            </label>
            <input
              type="number"
              name="longitude"
              value={formData.longitude}
              onChange={handleChange}
              placeholder="e.g., 77.1025"
              step="0.0001"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
          </div>
        </div>

        {/* Contact Information */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Contact Information</h3>
          
          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              name="anonymous"
              checked={formData.anonymous}
              onChange={handleChange}
              className="w-4 h-4 text-primary-600 rounded"
            />
            <label className="ml-3 text-sm text-gray-700 dark:text-gray-300">
              Report anonymously
            </label>
          </div>

          {!formData.anonymous && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                  <Users className="h-4 w-4 inline mr-2" />
                  Full Name
                </label>
                <input
                  type="text"
                  name="contactName"
                  value={formData.contactName}
                  onChange={handleChange}
                  placeholder="Your full name"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                  <Phone className="h-4 w-4 inline mr-2" />
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  placeholder="Your phone number"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
              </div>
            </div>
          )}
        </div>

        {/* Media Upload */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
          <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
            <FileText className="h-4 w-4 inline mr-2" />
            Attach Photo or Video (Optional)
          </label>
          <input
            type="file"
            name="media"
            onChange={handleFileChange}
            accept="image/*,video/*"
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          />
          {formData.media && (
            <p className="text-sm text-green-600 dark:text-green-400 mt-2">
              ✓ File selected: {formData.media.name}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
          <div className="flex items-center justify-between">
            <label className="flex items-center space-x-3">
              <input type="checkbox" checked={notifyEveryone} onChange={(e) => setNotifyEveryone(e.target.checked)} className="w-4 h-4" />
              <span className="text-sm text-gray-700 dark:text-gray-300">Notify everyone now (sends browser alerts to open clients)</span>
            </label>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => navigate('/')}
                className="px-5 py-2.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium"
              >
                <X className="h-4 w-4 inline mr-2" />
                Cancel
              </button>

              <button
                type="submit"
                disabled={isLoading}
                className="px-5 py-2.5 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white rounded-lg transition-colors font-medium flex items-center"
              >
                <Send className="h-4 w-4 mr-2" />
                {isLoading ? 'Submitting...' : 'Submit Incident Report'}
              </button>
            </div>
          </div>
        </div>
      </form>
      </div>
    </div>
  )
}

export default ReportIncident
