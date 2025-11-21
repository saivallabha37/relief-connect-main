import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { 
  Search, 
  Shield, 
  Heart, 
  MessageCircle, 
  AlertTriangle,
  Users,
  Globe,
  Clock,
  MapPin,
  RefreshCw
} from 'lucide-react'

import { useLanguage } from '../contexts/LanguageContext'
import { useAuth } from '../contexts/AuthContext'
import useRevealOnScroll from '../hooks/useRevealOnScroll'

const Home = () => {
  const { t } = useLanguage()
  const { userLocation } = useAuth()
  const navigate = useNavigate()
  useRevealOnScroll()
  const [locationUpdates, setLocationUpdates] = useState([])
  const [loading, setLoading] = useState(false)
  const [lastUpdateTime, setLastUpdateTime] = useState(new Date())
  const [autoRefresh, setAutoRefresh] = useState(true)
  const [updateInterval, setUpdateInterval] = useState(5) // minutes
  const [newUpdatesCount, setNewUpdatesCount] = useState(0)
  const [showNotification, setShowNotification] = useState(false)
  const quickActions = [
    {
      title: 'Report Missing Person',
      description: 'Help find missing individuals',
      icon: Search,
      href: '/lost-found',
      color: 'bg-blue-500'
    },
    {
      title: 'Safety Instructions',
      description: 'Get emergency guidelines',
      icon: Shield,
      href: '/instructions',
      color: 'bg-green-500'
    },
    {
      title: 'Volunteer & Donate',
      description: 'Support relief efforts',
      icon: Heart,
      href: '/donations',
      color: 'bg-red-500'
    },
    {
      title: 'AI Emergency Help',
      description: 'Get instant assistance',
      icon: MessageCircle,
      href: '/ai-assistant',
      color: 'bg-purple-500'
    }
  ]

  const stats = [
    { label: 'People Helped', value: '12,847', icon: Users },
    { label: 'Active Volunteers', value: '2,341', icon: Heart },
    { label: 'Countries Served', value: '45', icon: Globe },
    { label: 'Response Time', value: '<2min', icon: Clock }
  ]

  // Location-based updates data
  const getLocationBasedUpdates = (location) => {
    if (!location) {
      return [
        {
          time: '2 hours ago',
          title: 'Enable location to see local updates',
          description: 'Allow location access to get personalized emergency updates for your area.',
          type: 'info',
          location: 'Global'
        }
      ]
    }

    const city = location.city || 'Your Area'
    const state = location.state || ''
    const country = location.country || 'India'

    // Simulate location-specific updates based on user's location
    const updates = {
      'Delhi': [
        {
          time: '1 hour ago',
          title: 'Heatwave Alert - Delhi',
          description: 'Temperature expected to reach 45°C. Stay hydrated and avoid outdoor activities between 11 AM - 4 PM.',
          type: 'warning',
          location: 'Delhi, India'
        },
        {
          time: '3 hours ago',
          title: 'Relief Camp - Connaught Place',
          description: 'Emergency relief camp opened at Central Park, Connaught Place. Can accommodate 500 people.',
          type: 'info',
          location: 'Central Delhi'
        },
        {
          time: '5 hours ago',
          title: 'Missing Person Found - South Delhi',
          description: 'Elderly person reported missing from Greater Kailash has been safely located.',
          type: 'success',
          location: 'South Delhi'
        }
      ],
      'Mumbai': [
        {
          time: '2 hours ago',
          title: 'Monsoon Alert - Mumbai',
          description: 'Heavy rainfall expected in next 24 hours. Avoid low-lying areas and check drainage.',
          type: 'warning',
          location: 'Mumbai, Maharashtra'
        },
        {
          time: '4 hours ago',
          title: 'Volunteer Training - Bandra',
          description: 'Disaster response training session at Bandra Kurla Complex this weekend.',
          type: 'info',
          location: 'Bandra, Mumbai'
        },
        {
          time: '6 hours ago',
          title: 'Emergency Kit Distribution',
          description: 'Free emergency kits available at Andheri railway station until 6 PM today.',
          type: 'info',
          location: 'Andheri, Mumbai'
        }
      ],
      'Bangalore': [
        {
          time: '1 hour ago',
          title: 'Cyclone Warning - Karnataka Coast',
          description: 'Cyclone expected to affect coastal areas. Bangalore may experience heavy winds and rain.',
          type: 'warning',
          location: 'Bangalore, Karnataka'
        },
        {
          time: '3 hours ago',
          title: 'Tech Volunteers Needed',
          description: 'IT professionals needed for emergency communication systems setup.',
          type: 'info',
          location: 'Bangalore'
        },
        {
          time: '5 hours ago',
          title: 'Relief Fund - Karnataka',
          description: 'State government announces ₹50 crore relief fund for affected areas.',
          type: 'info',
          location: 'Karnataka'
        }
      ],
      'Chennai': [
        {
          time: '2 hours ago',
          title: 'Flood Alert - Chennai',
          description: 'Heavy rainfall causing waterlogging in low-lying areas. Avoid unnecessary travel.',
          type: 'warning',
          location: 'Chennai, Tamil Nadu'
        },
        {
          time: '4 hours ago',
          title: 'Emergency Shelters Open',
          description: 'Temporary shelters opened at Marina Beach and Anna Nagar for affected families.',
          type: 'info',
          location: 'Chennai'
        },
        {
          time: '6 hours ago',
          title: 'Medical Camp - T. Nagar',
          description: 'Free medical camp at T. Nagar bus stand for flood-related health issues.',
          type: 'info',
          location: 'T. Nagar, Chennai'
        }
      ],
      'Kolkata': [
        {
          time: '1 hour ago',
          title: 'Cyclone Preparedness - West Bengal',
          description: 'Cyclone approaching Bay of Bengal. Kolkata may experience strong winds and heavy rain.',
          type: 'warning',
          location: 'Kolkata, West Bengal'
        },
        {
          time: '3 hours ago',
          title: 'Evacuation Centers Ready',
          description: 'Schools and community centers prepared as evacuation centers across Kolkata.',
          type: 'info',
          location: 'Kolkata'
        },
        {
          time: '5 hours ago',
          title: 'Emergency Helpline Active',
          description: '24/7 emergency helpline 1070 active for cyclone-related assistance.',
          type: 'info',
          location: 'West Bengal'
        }
      ]
    }

    // Return updates for the specific city or default updates
    return updates[city] || updates['Delhi'] || [
      {
        time: '2 hours ago',
        title: `Local Updates - ${city}`,
        description: `Emergency updates and relief activities in ${city}, ${state}`,
        type: 'info',
        location: `${city}, ${state}`
      },
      {
        time: '4 hours ago',
        title: 'Regional Weather Alert',
        description: 'Monitor local weather conditions and follow official advisories.',
        type: 'warning',
        location: state || country
      },
      {
        time: '6 hours ago',
        title: 'Community Preparedness',
        description: 'Stay informed about local emergency procedures and evacuation routes.',
        type: 'info',
        location: city
      }
    ]
  }

  // Load location-based updates
  useEffect(() => {
    const updates = getLocationBasedUpdates(userLocation)
    setLocationUpdates(updates)
  }, [userLocation])

  // Function to refresh updates
  const refreshUpdates = () => {
    setLoading(true)
    // Simulate API call delay
    setTimeout(() => {
      const updates = getTimeBasedUpdates(userLocation)
      setLocationUpdates(updates)
      setLastUpdateTime(new Date())
      setLoading(false)
      
      // Show notification for manual refresh
      setNewUpdatesCount(1)
      setShowNotification(true)
      setTimeout(() => {
        setShowNotification(false)
        setNewUpdatesCount(0)
      }, 3000)
    }, 1000)
  }

  // Function to get time-based updates (simulates real-time data)
  const getTimeBasedUpdates = (location) => {
    const now = new Date()
    const hour = now.getHours()
    const minute = now.getMinutes()
    
    // Add some randomness to simulate real-time updates
    const randomFactor = Math.floor(Math.random() * 3)
    
    if (!location) {
      return [
        {
          time: 'Just now',
          title: 'Enable location to see live updates',
          description: 'Allow location access to get real-time emergency updates for your area.',
          type: 'info',
          location: 'Global',
          isLive: true
        }
      ]
    }

    const city = location.city || 'Your Area'
    const state = location.state || ''
    
    // Generate time-sensitive updates based on current time
    const timeBasedUpdates = []
    
    // Morning updates (6 AM - 12 PM)
    if (hour >= 6 && hour < 12) {
      timeBasedUpdates.push({
        time: 'Just now',
        title: `Morning Weather Update - ${city}`,
        description: `Current conditions: Clear skies, temperature rising. Stay hydrated during peak hours.`,
        type: 'info',
        location: `${city}, ${state}`,
        isLive: true
      })
    }
    
    // Afternoon updates (12 PM - 6 PM)
    if (hour >= 12 && hour < 18) {
      timeBasedUpdates.push({
        time: 'Just now',
        title: `Afternoon Alert - ${city}`,
        description: `Peak heat hours. Avoid outdoor activities. Emergency services on standby.`,
        type: 'warning',
        location: `${city}, ${state}`,
        isLive: true
      })
    }
    
    // Evening updates (6 PM - 12 AM)
    if (hour >= 18 || hour < 6) {
      timeBasedUpdates.push({
        time: 'Just now',
        title: `Evening Update - ${city}`,
        description: `Night emergency services active. Report any incidents immediately.`,
        type: 'info',
        location: `${city}, ${state}`,
        isLive: true
      })
    }
    
    // Add some random emergency updates
    if (randomFactor === 0) {
      timeBasedUpdates.push({
        time: 'Just now',
        title: `Emergency Response - ${city}`,
        description: `Emergency team deployed in ${city}. All systems operational.`,
        type: 'success',
        location: `${city}, ${state}`,
        isLive: true
      })
    }
    
    // Combine with regular updates
    const regularUpdates = getLocationBasedUpdates(location)
    return [...timeBasedUpdates, ...regularUpdates.slice(0, 2)]
  }

  // Auto-refresh functionality
  useEffect(() => {
    if (!autoRefresh) return

    const interval = setInterval(() => {
      const updates = getTimeBasedUpdates(userLocation)
      const previousCount = locationUpdates.length
      setLocationUpdates(updates)
      setLastUpdateTime(new Date())
      
      // Show notification for new updates
      if (updates.length > previousCount) {
        setNewUpdatesCount(updates.length - previousCount)
        setShowNotification(true)
        
        // Auto-hide notification after 5 seconds
        setTimeout(() => {
          setShowNotification(false)
          setNewUpdatesCount(0)
        }, 5000)
      }
    }, updateInterval * 60 * 1000) // Convert minutes to milliseconds

    return () => clearInterval(interval)
  }, [autoRefresh, updateInterval, userLocation, locationUpdates.length])

  // Initial load
  useEffect(() => {
    const updates = getTimeBasedUpdates(userLocation)
    setLocationUpdates(updates)
    setLastUpdateTime(new Date())
  }, [userLocation])

  // Function to toggle auto-refresh
  const toggleAutoRefresh = () => {
    setAutoRefresh(!autoRefresh)
  }

  // Function to change update interval
  const changeUpdateInterval = (minutes) => {
    setUpdateInterval(minutes)
  }

  return (
    <div className="space-y-8 responsive-container">
      {/* Notification */}
      {showNotification && (
        <div className="fixed top-4 right-4 z-50 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center animate-bounce">
          <div className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></div>
          {newUpdatesCount} new update{newUpdatesCount > 1 ? 's' : ''} available
          <button 
            onClick={() => setShowNotification(false)}
            className="ml-2 text-white hover:text-gray-200"
          >
            ×
          </button>
        </div>
      )}

      {/* Hero Section */}
      <div className="text-center section-padding reveal reveal-delay-1">
        <h1 className="text-hero text-gray-900 dark:text-white mb-6">
          Connecting Disaster Survivors & Volunteers in Real Time
        </h1>
        <p className="text-xl md:text-2xl font-semibold text-primary-600 dark:text-primary-400 mb-6">
          A smart coordination platform for relief distribution
        </p>
        <p className="text-lead max-w-4xl mx-auto mb-10">
          Connect with emergency resources, report incidents, find missing persons, 
          and get AI-powered assistance during disasters and emergencies.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-6 justify-center">
          <Link to="/donations?tab=volunteer" className="btn-primary text-lg px-8 py-3">
            Register as Volunteer
          </Link>
          <button onClick={() => navigate('/report-incident')} className="btn-emergency text-lg px-8 py-3 flex items-center justify-center">
            <AlertTriangle className="mr-2 h-5 w-5" />
            Request Help
          </button>
          <Link to="/dashboard" className="bg-humanitarian-600 hover:bg-humanitarian-700 text-white font-semibold text-lg px-8 py-3 rounded-lg transition-all duration-200 focus-ring shadow-elevated hover:shadow-floating transform hover:scale-105 flex items-center justify-center">
            Open Dashboard
          </Link>
        </div>
      </div>

      {/* Emergency Banner */}
      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4">
        <div className="flex items-center">
          <AlertTriangle className="h-6 w-6 text-yellow-600 dark:text-yellow-400 mr-3" />
          <div>
            <h3 className="font-semibold text-yellow-800 dark:text-yellow-200">
              {t.home.advisoryTitle}
            </h3>
            <p className="text-yellow-700 dark:text-yellow-300">
              {t.home.advisoryBody}
            </p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 content-spacing">
        {quickActions.map((action, index) => (
          <Link 
            key={index} 
            to={action.href} 
            className="card h-52 p-6 transition-all duration-300 group focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 flex flex-col justify-between shadow-md hover:shadow-xl hover:-translate-y-2 hover:scale-105"
          >
            <div className="flex flex-col items-start flex-grow">
              <div className={`${action.color} w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200 shadow-md flex-shrink-0`}>
                <action.icon className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 leading-tight line-clamp-2 flex-grow">
                {action.title}
              </h3>
            </div>
            <div className="mt-auto">
              <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed line-clamp-2">
                {action.description}
              </p>
            </div>
          </Link>
        ))}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-16">
        {stats.map((stat, index) => (
          <div key={index} className="card text-center shadow-card hover:shadow-elevated transition-shadow duration-200">
            <stat.icon className="h-10 w-10 text-primary-600 dark:text-primary-400 mx-auto mb-4" />
            <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {stat.value}
            </div>
            <div className="text-sm font-medium text-gray-600 dark:text-gray-300">
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* Recent Updates */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {t.home.recentUpdates}
            </h2>
            {userLocation && (
              <div className="ml-4 flex items-center text-sm text-gray-600 dark:text-gray-400">
                <MapPin className="h-4 w-4 mr-1" />
                {userLocation.city}, {userLocation.state || userLocation.country}
              </div>
            )}
            {autoRefresh && (
              <div className="ml-4 flex items-center text-xs text-green-600 dark:text-green-400">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse"></div>
                Live
              </div>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1">
              <button
                onClick={toggleAutoRefresh}
                className={`text-sm px-3 py-1 rounded-md transition-colors ${
                  autoRefresh 
                    ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' 
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                }`}
              >
                Auto
              </button>
              <select
                value={updateInterval}
                onChange={(e) => changeUpdateInterval(Number(e.target.value))}
                className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 px-2 py-1 rounded border-0"
                disabled={!autoRefresh}
              >
                <option value={1}>1m</option>
                <option value={5}>5m</option>
                <option value={10}>10m</option>
                <option value={30}>30m</option>
              </select>
            </div>
            <button 
              onClick={refreshUpdates}
              disabled={loading}
              className="btn-outline text-sm flex items-center"
            >
              <RefreshCw className={`h-4 w-4 mr-1 ${loading ? 'animate-spin' : ''}`} />
              {loading ? 'Refreshing...' : 'Refresh'}
            </button>
          </div>
        </div>
        
        <div className="mb-4 text-xs text-gray-500 dark:text-gray-400">
          Last updated: {lastUpdateTime.toLocaleTimeString()}
        </div>
        
        <div className="space-y-4">
          {locationUpdates.map((update, index) => {
            const getTypeColor = (type) => {
              switch (type) {
                case 'warning':
                  return 'bg-yellow-500'
                case 'success':
                  return 'bg-green-500'
                case 'info':
                  return 'bg-blue-500'
                default:
                  return 'bg-primary-600'
              }
            }

            const getTypeIcon = (type) => {
              switch (type) {
                case 'warning':
                  return <AlertTriangle className="h-4 w-4" />
                case 'success':
                  return <Heart className="h-4 w-4" />
                case 'info':
                  return <MessageCircle className="h-4 w-4" />
                default:
                  return <Clock className="h-4 w-4" />
              }
            }

            return (
              <div key={index} className={`flex items-start space-x-4 p-4 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors ${
                update.isLive 
                  ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800' 
                  : 'bg-gray-50 dark:bg-gray-700'
              }`}>
                <div className="flex flex-col items-center">
                  <div className={`w-2 h-2 ${getTypeColor(update.type)} rounded-full mt-2 flex-shrink-0`}></div>
                  {update.isLive && (
                    <div className="w-1 h-1 bg-green-500 rounded-full mt-1 animate-pulse"></div>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center">
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {update.time}
                      </div>
                      {update.isLive && (
                        <div className="ml-2 flex items-center text-xs text-green-600 dark:text-green-400">
                          <div className="w-1 h-1 bg-green-500 rounded-full mr-1 animate-pulse"></div>
                          Live
                        </div>
                      )}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                      <MapPin className="h-3 w-3 mr-1" />
                      {update.location}
                    </div>
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                    {update.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {update.description}
                  </p>
                  <div className="mt-2 flex items-center text-xs text-gray-500 dark:text-gray-400">
                    {getTypeIcon(update.type)}
                    <span className="ml-1 capitalize">{update.type}</span>
                    {update.isLive && (
                      <span className="ml-2 px-2 py-0.5 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full">
                        Real-time
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
        
        {!userLocation && (
          <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <div className="flex items-center">
              <MapPin className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2" />
              <div>
                <h4 className="font-medium text-blue-800 dark:text-blue-200">
                  Enable Location for Personalized Updates
                </h4>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  Allow location access to receive emergency alerts and updates specific to your area.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Home
