import React, { useState, useEffect, useRef } from 'react'
import useRevealOnScroll from '../hooks/useRevealOnScroll'
import { AlertTriangle, Radio, MapPin, Clock, Filter, RefreshCw } from 'lucide-react'
import { useDatabase } from '../contexts/DatabaseContext'
import { useLanguage } from '../contexts/LanguageContext'
import { useAuth } from '../contexts/AuthContext'
import AlertsMap from '../components/AlertsMap'

const LiveUpdates = () => {
  const [alerts, setAlerts] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [selectedRegion, setSelectedRegion] = useState('all')
  const [lastUpdated, setLastUpdated] = useState(new Date())
  const { executeQuery } = useDatabase()
  const { t } = useLanguage()
  const { userLocation } = useAuth()
  const lastSeenAlertIdsRef = useRef(new Set())

  // enable reveal animations
  useRevealOnScroll()

  const severityColors = {
    critical: 'bg-red-100 dark:bg-red-900/20 border-red-300 dark:border-red-700 text-red-800 dark:text-red-200',
    high: 'bg-orange-100 dark:bg-orange-900/20 border-orange-300 dark:border-orange-700 text-orange-800 dark:text-orange-200',
    medium: 'bg-yellow-100 dark:bg-yellow-900/20 border-yellow-300 dark:border-yellow-700 text-yellow-800 dark:text-yellow-200',
    low: 'bg-blue-100 dark:bg-blue-900/20 border-blue-300 dark:border-blue-700 text-blue-800 dark:text-blue-200'
  }

  const severityIcons = {
    critical: '🚨',
    high: '⚠️',
    medium: '⚡',
    low: 'ℹ️'
  }

  useEffect(() => {
    loadAlerts()
    // Set up auto-refresh every 30 seconds
    const interval = setInterval(loadAlerts, 30000)
    return () => clearInterval(interval)
  }, [])

  // If user has a saved place, default the region filter to their place
  useEffect(() => {
    if (userLocation && userLocation.place && selectedRegion === 'all') {
      setSelectedRegion(userLocation.place)
    }
  }, [userLocation])

  // Request notification permission once when mounting
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission().catch(() => {})
    }
  }, [])

  const loadAlerts = async () => {
    try {
      // First, create some sample alerts if none exist
      await createSampleAlerts()
      
      const result = await executeQuery(`
        SELECT * FROM newschema_7f6707a347ec40c3ad3f1eb7f4da4ffb.disaster_alerts 
        WHERE active = true 
        ORDER BY 
          CASE severity 
            WHEN 'critical' THEN 1 
            WHEN 'high' THEN 2 
            WHEN 'medium' THEN 3 
            WHEN 'low' THEN 4 
          END,
          created_at DESC
      `)
      
      if (result.success) {
        const newAlerts = result.data
        notifyForNewCriticalHigh(newAlerts)
        setAlerts(newAlerts)
        setLastUpdated(new Date())
      }
    } catch (error) {
      console.error('Error loading alerts:', error)
    } finally {
      setLoading(false)
    }
  }

  const notifyForNewCriticalHigh = (newAlerts) => {
    if (!('Notification' in window) || Notification.permission !== 'granted') return
    const newImportant = newAlerts.filter(a => (a.severity === 'critical' || a.severity === 'high') && !lastSeenAlertIdsRef.current.has(a.id))
    newImportant.forEach(a => {
      new Notification(`${a.severity.toUpperCase()} Alert: ${a.title}`, {
        body: `${a.location} • ${a.source}`,
      })
      lastSeenAlertIdsRef.current.add(a.id)
    })
  }

  const createSampleAlerts = async () => {
    try {
      // Check if alerts already exist
      const existingAlerts = await executeQuery(`
        SELECT COUNT(*) as count FROM newschema_7f6707a347ec40c3ad3f1eb7f4da4ffb.disaster_alerts
      `)
      
      if (existingAlerts.success && existingAlerts.data[0].count > 0) {
        return // Alerts already exist
      }

      // Use localized sample alerts from language context if available
      const localizedSamples = (t && t.live && t.live.sampleAlerts) ? t.live.sampleAlerts : []
      const sampleAlerts = localizedSamples.length > 0 ? localizedSamples : []

      for (const alert of sampleAlerts) {
        await executeQuery(`
          INSERT INTO newschema_7f6707a347ec40c3ad3f1eb7f4da4ffb.disaster_alerts 
          (title, description, severity, location, alert_type, source)
          VALUES ($1, $2, $3, $4, $5, $6)
        `, [alert.title, alert.description, alert.severity, alert.location, alert.alert_type, alert.source])
      }
    } catch (error) {
      console.error('Error creating sample alerts:', error)
    }
  }

  const filteredAlerts = alerts
    .filter(alert => filter === 'all' ? true : alert.severity === filter)
    .filter(alert => {
      // Region filter
      if (selectedRegion && selectedRegion !== 'all') {
        // Use substring match so 'Hyderabad' matches 'Hyderabad (GHMC area)'
        const sel = (selectedRegion || '').toLowerCase()
        return (alert.location || '').toLowerCase().includes(sel)
      }
      if (!userLocation) return true
      // If user provided a place string, match by inclusion; if GPS, skip server-side since alerts have text location
      if (userLocation.place) {
        const place = userLocation.place.toLowerCase()
        return (
          (alert.location || '').toLowerCase().includes(place) ||
          (alert.title || '').toLowerCase().includes(place) ||
          (alert.description || '').toLowerCase().includes(place)
        )
      }
      return true
    })

  const handleRefresh = () => {
    setLoading(true)
    loadAlerts()
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-white flex items-center">
            <Radio className="h-8 w-8 mr-3 text-red-500" />
            {t.live.title}
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400 mt-1">
            {t.live.desc}
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="text-sm text-neutral-500 dark:text-neutral-400">
            {t.live.lastUpdated}: {lastUpdated.toLocaleTimeString()}
          </div>
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="btn-outline flex items-center disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            {t.live.refresh}
          </button>
        </div>
      </div>

      {/* Filter Controls */}
      <div className="card">
        <div className="flex flex-wrap items-center gap-3">
          <Filter className="h-4 w-4 text-neutral-500" />
          <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">{t.live.filterLabel}</span>
          
          {['all', 'critical', 'high', 'medium', 'low'].map((severity) => (
            <button
              key={severity}
              onClick={() => setFilter(severity)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors duration-200 ${
                filter === severity
                  ? 'bg-primary-600 text-white'
                  : 'bg-neutral-100 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-600'
              }`}
            >
              {severity.charAt(0).toUpperCase() + severity.slice(1)}
            </button>
          ))}
          {/* Region selector */}
          <div className="ml-4">
            <label className="text-sm text-neutral-600 dark:text-neutral-400 mr-2">Region:</label>
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="input-field text-sm"
            >
              <option value="all">All</option>
              {/* Build unique regions from alerts */}
              {Array.from(new Set(alerts.map(a => a.location).filter(Boolean))).map((loc) => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => setSelectedRegion('all')}
              className="ml-2 text-sm btn-outline"
            >
              Show all
            </button>
          </div>
        </div>
      </div>

      {/* Active Alerts Count */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {['critical', 'high', 'medium', 'low'].map((severity) => {
          const count = alerts.filter(alert => alert.severity === severity).length
          return (
            <div key={severity} className="card text-center">
              <div className="text-2xl mb-1">{severityIcons[severity]}</div>
              <div className="text-2xl font-bold text-neutral-900 dark:text-white">{count}</div>
              <div className="text-xs text-neutral-500 dark:text-neutral-400 capitalize">
                {severity} Alerts
              </div>
            </div>
          )
        })}
      </div>

      {/* Map of alerts */}
      <div className="mb-4">
        <AlertsMap alerts={alerts} userLocation={userLocation} />
      </div>

      {/* Alerts List */}
      <div className="space-y-4">
        {loading && alerts.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mr-3"></div>
            <span className="text-neutral-600 dark:text-neutral-400">Loading alerts...</span>
          </div>
        ) : filteredAlerts.length === 0 ? (
          <div className="card text-center py-12">
            <AlertTriangle className="h-12 w-12 text-neutral-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-neutral-900 dark:text-white mb-2">
              No alerts found
            </h3>
            <p className="text-neutral-600 dark:text-neutral-400">
              {filter === 'all' 
                ? t.live.noAlertsAll
                : t.live.noAlertsSeverity(filter)
              }
            </p>
          </div>
        ) : (
          filteredAlerts.map((alert) => (
            <div
              key={alert.id}
              className={`card border-l-4 ${severityColors[alert.severity]}`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center">
                  <span className="text-2xl mr-3">{severityIcons[alert.severity]}</span>
                  <div>
                    <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
                      {alert.title}
                    </h3>
                    <div className="flex items-center text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium mr-3 ${
                        alert.severity === 'critical' ? 'bg-red-600 text-white' :
                        alert.severity === 'high' ? 'bg-orange-600 text-white' :
                        alert.severity === 'medium' ? 'bg-yellow-600 text-white' :
                        'bg-blue-600 text-white'
                      }`}>
                        {alert.severity.toUpperCase()}
                      </span>
                      <span className="capitalize">{alert.alert_type}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <p className="text-neutral-700 dark:text-neutral-300 mb-4">
                {alert.description}
              </p>
              
              <div className="flex flex-wrap items-center gap-4 text-sm text-neutral-600 dark:text-neutral-400">
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>{alert.location}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>{new Date(alert.created_at).toLocaleString()}</span>
                </div>
                <div className="flex items-center">
                  <Radio className="h-4 w-4 mr-1" />
                  <span>Source: {alert.source}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Emergency Information */}
      <div className="card bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
        <div className="flex items-start">
          <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400 mr-3 mt-1" />
          <div>
            <h3 className="text-lg font-semibold text-red-800 dark:text-red-200 mb-2">
              Emergency Information
            </h3>
            <div className="text-sm text-red-700 dark:text-red-300 space-y-1">
              <p>• For life-threatening emergencies in India, call 112 immediately</p>
              <p>• Follow official evacuation orders without delay</p>
              <p>• Stay tuned to local emergency broadcasts and district disaster response teams</p>
              <p>• Keep emergency supplies ready and accessible</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LiveUpdates
