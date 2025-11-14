import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { X } from 'lucide-react'

export default function ToastCenter() {
  const [toasts, setToasts] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    const handler = (ev) => {
      const incoming = ev.detail || {}
      const id = Date.now()
      const toast = {
        id,
        title: incoming.title || 'New Incident',
        body: incoming.description || '',
        severity: incoming.severity || 'medium',
        payload: incoming
      }
      setToasts((s) => [toast, ...s])
      // auto-dismiss
      setTimeout(() => {
        setToasts((s) => s.filter(t => t.id !== id))
      }, 6000)
    }

    window.addEventListener('relief:new-incident', handler)
    return () => window.removeEventListener('relief:new-incident', handler)
  }, [])

  const dismiss = (id) => setToasts((s) => s.filter(t => t.id !== id))
  const openDetails = (payload) => {
    // prefer opening live-updates which lists alerts
    navigate('/live-updates')
  }

  if (!toasts.length) return null

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col items-end gap-3">
      {toasts.map(t => (
        <div key={t.id} className="w-80 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg overflow-hidden">
          <div className="p-3">
            <div className="flex items-start">
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{t.title}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-300 mt-1 line-clamp-2">{t.body}</p>
                  </div>
                  <button onClick={() => dismiss(t.id)} className="ml-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <button onClick={() => { openDetails(t.payload); dismiss(t.id) }} className="text-xs text-primary-600 hover:underline">
                    View Alerts
                  </button>
                  <span className="text-xs text-gray-500 dark:text-gray-400">{new Date(t.id).toLocaleTimeString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
