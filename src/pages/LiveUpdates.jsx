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

      // Use localized sample alerts from language context if available, otherwise use default data
      const localizedSamples = (t && t.live && t.live.sampleAlerts) ? t.live.sampleAlerts : []
      
      // Default sample alerts if no localized data
      const defaultSampleAlerts = [
        {
          id: 1,
          title: 'Flood Warning - Heavy Rainfall Alert',
          description: 'Heavy monsoon rains expected in the next 6-12 hours. Residents in low-lying areas are advised to move to higher ground. Emergency shelters have been opened.',
          severity: 'critical',
          location: 'Hyderabad, Telangana',
          alert_type: 'flood',
          source: 'Meteorological Department',
          active: true,
          created_at: new Date().toISOString(),
          lat: 17.3850,
          lng: 78.4867
        },
        {
          id: 2,
          title: 'Medical Emergency - Hospital Overcrowding',
          description: 'Local hospitals are experiencing high patient volumes. Non-emergency cases are requested to visit nearby clinics or wait for emergency services.',
          severity: 'high',
          location: 'HITEC City, Hyderabad',
          alert_type: 'medical',
          source: 'Health Department',
          active: true,
          created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 mins ago
          lat: 17.4511,
          lng: 78.3808
        },
        {
          id: 3,
          title: 'Power Outage - Electrical Grid Maintenance',
          description: 'Scheduled maintenance on electrical grid. Power restoration expected within 4-6 hours. Emergency generators operational at critical facilities.',
          severity: 'medium',
          location: 'Gachibowli, Hyderabad',
          alert_type: 'infrastructure',
          source: 'Power Grid Corporation',
          active: true,
          created_at: new Date(Date.now() - 1000 * 60 * 45).toISOString(), // 45 mins ago
          lat: 17.4434,
          lng: 78.3484
        },
        {
          id: 4,
          title: 'Traffic Advisory - Road Closure',
          description: 'Main highway closed due to flooding. Alternative routes available via Ring Road. Emergency vehicles have priority access.',
          severity: 'medium',
          location: 'Jubilee Hills, Hyderabad',
          alert_type: 'traffic',
          source: 'Traffic Police',
          active: true,
          created_at: new Date(Date.now() - 1000 * 60 * 60).toISOString(), // 1 hour ago
          lat: 17.4239,
          lng: 78.4738
        },
        {
          id: 5,
          title: 'Community Update - Relief Distribution',
          description: 'Food and water distribution ongoing at community center. Volunteers needed for coordination and logistics support.',
          severity: 'low',
          location: 'Banjara Hills, Hyderabad',
          alert_type: 'community',
          source: 'Local Administration',
          active: true,
          created_at: new Date(Date.now() - 1000 * 60 * 90).toISOString(), // 1.5 hours ago
          lat: 17.4126,
          lng: 78.4713
        }
      ]
      
      const sampleAlerts = localizedSamples.length > 0 ? localizedSamples : defaultSampleAlerts
      
      // Set alerts directly for demonstration since we don't have a real database
      setAlerts(sampleAlerts)
      setLastUpdated(new Date())

      // If we had a real database, we would insert like this:
      // for (const alert of sampleAlerts) {
      //   await executeQuery(`
      //     INSERT INTO newschema_7f6707a347ec40c3ad3f1eb7f4da4ffb.disaster_alerts 
      //     (title, description, severity, location, alert_type, source)
      //     VALUES ($1, $2, $3, $4, $5, $6)
      //   `, [alert.title, alert.description, alert.severity, alert.location, alert.alert_type, alert.source])
      // }
    } catch (error) {
      console.error('Error creating sample alerts:', error)
      // Fallback: set some basic data even if database operations fail
      setAlerts([
        {
          id: 1,
          title: 'Emergency System Active',
          description: 'Emergency monitoring system is operational and ready to receive alerts.',
          severity: 'low',
          location: 'System Status',
          alert_type: 'system',
          source: 'Relief Connect',
          active: true,
          created_at: new Date().toISOString()
        }
      ])
      setLastUpdated(new Date())
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
    <div className="responsive-container space-y-6 pt-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-white flex items-center">
            <Radio className="h-8 w-8 mr-3 text-red-500" />
            Live Updates
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400 mt-1">
            Real-time emergency alerts and updates
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="text-sm text-neutral-500 dark:text-neutral-400">
            Last updated: {lastUpdated.toLocaleTimeString()}
          </div>
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="btn-outline flex items-center disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* Filter Controls */}
      <div className="card">
        <div className="flex flex-wrap items-center gap-3">
          <Filter className="h-4 w-4 text-neutral-500" />
          <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Filter by severity:</span>
          
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
      <div className="card p-0 overflow-hidden">
        <div className="h-96 relative">
          <AlertsMap alerts={alerts} userLocation={userLocation} />
        </div>
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
                ? 'No alerts are currently active.'
                : `No ${filter} alerts found.`
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
