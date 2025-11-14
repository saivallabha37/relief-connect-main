import React, { useState } from 'react'
import useRevealOnScroll from '../hooks/useRevealOnScroll'
import { MessageSquare, Star, Send } from 'lucide-react'
import { useDatabase } from '../contexts/DatabaseContext'
import { useAuth } from '../contexts/AuthContext'

const Feedback = () => {
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const { executeQuery } = useDatabase()
  const { user } = useAuth()

  useRevealOnScroll()

  const [feedbackForm, setFeedbackForm] = useState({
    name: '',
    email: '',
    message: '',
    rating: 0,
    category: 'general'
  })

  const categories = [
    { value: 'general', label: 'General Feedback' },
    { value: 'bug', label: 'Bug Report' },
    { value: 'feature', label: 'Feature Request' },
    { value: 'support', label: 'Support Request' },
    { value: 'emergency', label: 'Emergency Response' }
  ]

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const result = await executeQuery(`
        INSERT INTO newschema_7f6707a347ec40c3ad3f1eb7f4da4ffb.feedback 
        (name, email, message, rating, category, user_id)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *
      `, [
        feedbackForm.name,
        feedbackForm.email,
        feedbackForm.message,
        feedbackForm.rating || null,
        feedbackForm.category,
        user?.id || null
      ])

      if (result.success) {
        setSubmitted(true)
        setFeedbackForm({
          name: '',
          email: '',
          message: '',
          rating: 0,
          category: 'general'
        })
      }
    } catch (error) {
      console.error('Error submitting feedback:', error)
      alert('Error submitting feedback. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleRatingClick = (rating) => {
    setFeedbackForm({...feedbackForm, rating})
  }

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="card text-center">
          <div className="bg-green-100 dark:bg-green-900 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <MessageSquare className="h-8 w-8 text-green-600 dark:text-green-400" />
          </div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white mb-2">
            Thank You!
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400 mb-6">
            Your feedback has been submitted successfully. We appreciate your input and will use it to improve our services.
          </p>
          <button
            onClick={() => setSubmitted(false)}
            className="btn-primary"
          >
            Submit Another Feedback
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">Feedback</h1>
        <p className="text-neutral-600 dark:text-neutral-400 mt-1">
          Help us improve our disaster response platform
        </p>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                Name *
              </label>
              <input
                type="text"
                value={feedbackForm.name}
                onChange={(e) => setFeedbackForm({...feedbackForm, name: e.target.value})}
                className="input-field"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                Email *
              </label>
              <input
                type="email"
                value={feedbackForm.email}
                onChange={(e) => setFeedbackForm({...feedbackForm, email: e.target.value})}
                className="input-field"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
              Category
            </label>
            <select
              value={feedbackForm.category}
              onChange={(e) => setFeedbackForm({...feedbackForm, category: e.target.value})}
              className="input-field"
            >
              {categories.map((category) => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
              Rating (Optional)
            </label>
            <div className="flex space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => handleRatingClick(star)}
                  className={`p-1 rounded transition-colors duration-200 ${
                    star <= feedbackForm.rating
                      ? 'text-yellow-400'
                      : 'text-neutral-300 dark:text-neutral-600 hover:text-yellow-300'
                  }`}
                >
                  <Star className="h-6 w-6 fill-current" />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
              Message *
            </label>
            <textarea
              value={feedbackForm.message}
              onChange={(e) => setFeedbackForm({...feedbackForm, message: e.target.value})}
              className="input-field h-32"
              placeholder="Please share your feedback, suggestions, or report any issues..."
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary disabled:opacity-50 flex items-center justify-center"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            ) : (
              <Send className="h-4 w-4 mr-2" />
            )}
            {loading ? 'Submitting...' : 'Submit Feedback'}
          </button>
        </form>
      </div>

      <div className="card bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
        <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-200 mb-2">
          Your Voice Matters
        </h3>
        <p className="text-blue-700 dark:text-blue-300 text-sm">
          Your feedback helps us improve our disaster response capabilities and better serve communities in need. 
          Every suggestion is carefully reviewed and considered for implementation.
        </p>
      </div>
    </div>
  )
}

export default Feedback
