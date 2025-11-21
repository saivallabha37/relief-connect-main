import React, { useState, useEffect } from 'react'
import { useDatabase } from '../contexts/DatabaseContext'
import { Users, Clock, MapPin, Phone, Mail, Star, Award, Filter, Search, AlertTriangle, CheckCircle, Activity } from 'lucide-react'
import AlertsMap from '../components/AlertsMap'

const Dashboard = () => {
  const { alerts, volunteers, helpRequests } = useDatabase()
  const [activeTab, setActiveTab] = useState('overview')
  const [filterStatus, setFilterStatus] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [lastUpdated, setLastUpdated] = useState(new Date())

  // Auto-refresh data every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdated(new Date())
    }, 30000)

    return () => clearInterval(interval)
  }, [])

  const getStatusBadge = (status) => {
    switch(status?.toLowerCase()) {
      case 'pending': return 'badge badge-pending'
      case 'in-progress': case 'in progress': return 'badge badge-progress'
      case 'completed': return 'badge badge-completed'
      default: return 'badge badge-medium'
    }
  }

  const getPriorityBadge = (priority) => {
    switch(priority?.toLowerCase()) {
      case 'critical': return 'badge badge-critical'
      case 'high': return 'badge badge-high'
      case 'medium': return 'badge badge-medium'
      case 'low': return 'badge badge-low'
      default: return 'badge badge-medium'
    }
  }

  const filteredHelpRequests = helpRequests?.filter(req => {
    const matchesStatus = filterStatus === 'all' || req.status?.toLowerCase() === filterStatus
    const matchesSearch = !searchTerm || req.title.toLowerCase().includes(searchTerm.toLowerCase()) || req.location.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesStatus && matchesSearch
  }) || []

  const stats = {
    totalAlerts: alerts?.length || 0,
    activeAlerts: alerts?.filter(a => a.active)?.length || 0,
    totalVolunteers: volunteers?.length || 0,
    availableVolunteers: volunteers?.filter(v => v.availability === 'Available Now')?.length || 0,
    totalRequests: helpRequests?.length || 0,
    pendingRequests: helpRequests?.filter(r => r.status === 'Pending')?.length || 0
  }

  return (
    <div className="responsive-container">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Emergency Response Dashboard</h1>
            <p className="text-gray-600 dark:text-gray-300">Real-time coordination and volunteer management</p>
          </div>
          <div className="text-right">
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-1">
              <div className="w-2 h-2 bg-success-500 rounded-full mr-2 animate-pulse"></div>
              Live Updates
            </div>
            <div className="text-xs text-gray-500">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        <div className="card-compact">
          <div className="flex items-center">
            <AlertTriangle className="h-8 w-8 text-emergency-500 mr-3" />
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.activeAlerts}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Active Alerts</p>
            </div>
          </div>
        </div>
        
        <div className="card-compact">
          <div className="flex items-center">
            <Users className="h-8 w-8 text-primary-500 mr-3" />
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.availableVolunteers}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Available</p>
            </div>
          </div>
        </div>

        <div className="card-compact">
          <div className="flex items-center">
            <Activity className="h-8 w-8 text-warning-500 mr-3" />
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.pendingRequests}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Pending</p>
            </div>
          </div>
        </div>

        <div className="card-compact">
          <div className="flex items-center">
            <CheckCircle className="h-8 w-8 text-success-500 mr-3" />
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{helpRequests?.filter(r => r.status === 'Completed')?.length || 0}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Completed</p>
            </div>
          </div>
        </div>

        <div className="card-compact">
          <div className="flex items-center">
            <Users className="h-8 w-8 text-humanitarian-500 mr-3" />
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalVolunteers}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Volunteers</p>
            </div>
          </div>
        </div>

        <div className="card-compact">
          <div className="flex items-center">
            <Clock className="h-8 w-8 text-blue-500 mr-3" />
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalRequests}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Requests</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'requests', label: 'Help Requests' },
            { id: 'volunteers', label: 'Volunteers' },
            { id: 'alerts', label: 'Alerts' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 hover:border-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Help Requests Tab */}
      {activeTab === 'requests' && (
        <div>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by title or location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input-field pl-10"
                />
              </div>
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="input-field w-auto"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="in progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <div className="grid gap-6">
            {filteredHelpRequests.map((request) => (
              <div key={request.id} className="card">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{request.title}</h3>
                      <span className={getPriorityBadge(request.priority)}>{request.priority}</span>
                      <span className={getStatusBadge(request.status)}>{request.status}</span>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 mb-3">{request.description}</p>
                    
                    <div className="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1" />
                        {request.location}
                      </div>
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-1" />
                        {request.volunteers_assigned}/{request.volunteers_needed} volunteers
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {request.estimated_time}
                      </div>
                      {request.requester_phone && (
                        <div className="flex items-center">
                          <Phone className="h-4 w-4 mr-1" />
                          {request.requester_phone}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                {request.completion_note && (
                  <div className="mt-3 p-3 bg-success-50 dark:bg-success-900/20 rounded-lg">
                    <p className="text-sm text-success-700 dark:text-success-300">{request.completion_note}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Volunteers Tab */}
      {activeTab === 'volunteers' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {volunteers?.map((volunteer) => (
            <div key={volunteer.id} className="card">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{volunteer.name}</h3>
                  <p className="text-gray-600 dark:text-gray-300">{volunteer.experience}</p>
                </div>
                <span className={`badge ${volunteer.availability === 'Available Now' ? 'badge-completed' : 'badge-pending'}`}>
                  {volunteer.availability}
                </span>
              </div>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <MapPin className="h-4 w-4 mr-2" />
                  {volunteer.location}
                </div>
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <Mail className="h-4 w-4 mr-2" />
                  {volunteer.email}
                </div>
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <Phone className="h-4 w-4 mr-2" />
                  {volunteer.phone}
                </div>
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <Star className="h-4 w-4 mr-2" />
                  {volunteer.rating} ({volunteer.completed_missions} missions)
                </div>
              </div>
              
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Skills:</p>
                <div className="flex flex-wrap gap-1">
                  {volunteer.skills.map((skill, index) => (
                    <span key={index} className="badge badge-medium text-xs">{skill}</span>
                  ))}
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="badge badge-high">
                  <Award className="h-3 w-3 mr-1" />
                  {volunteer.badge}
                </span>
                <button 
                  onClick={() => {
                    // Create contact options
                    const contactOptions = [
                      `Call: ${volunteer.phone}`,
                      `Email: ${volunteer.email}`,
                      'Send Message'
                    ]
                    
                    // Show contact options
                    const choice = window.confirm(
                      `Contact ${volunteer.name}\n\n` +
                      `📞 Phone: ${volunteer.phone}\n` +
                      `📧 Email: ${volunteer.email}\n` +
                      `📍 Location: ${volunteer.location}\n\n` +
                      'Click OK to call or Cancel to copy email address.'
                    )
                    
                    if (choice) {
                      // Try to initiate call
                      window.open(`tel:${volunteer.phone}`, '_self')
                    } else {
                      // Copy email to clipboard
                      navigator.clipboard.writeText(volunteer.email).then(() => {
                        alert(`Email address copied: ${volunteer.email}`)
                      }).catch(() => {
                        // Fallback for older browsers
                        window.open(`mailto:${volunteer.email}`, '_blank')
                      })
                    }
                  }}
                  className="btn-primary hover:bg-primary-700 transition-colors duration-200"
                >
                  Contact
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Interactive Map Component */}
          <div className="lg:col-span-1">
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Emergency Locations</h3>
              <AlertsMap 
                alerts={alerts?.filter(alert => alert.lat && alert.lng) || []} 
                userLocation={null}
              />
              
              {/* Nearby Items Section */}
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                <div className="flex items-center mb-3">
                  <MapPin className="h-4 w-4 text-gray-500 dark:text-gray-400 mr-2" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Nearby ({((alerts?.length || 0) + (helpRequests?.length || 0)).toString()} items)
                  </span>
                </div>
                
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {/* Nearby Emergency Alerts */}
                  {alerts?.slice(0, 4).map((alert) => (
                    <div key={`alert-${alert.id}`} className="flex items-center p-2 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
                      <div className={`w-2 h-2 rounded-full mr-3 flex-shrink-0 ${
                        alert.severity === 'critical' ? 'bg-red-500' :
                        alert.severity === 'high' ? 'bg-orange-500' :
                        alert.severity === 'medium' ? 'bg-yellow-500' : 'bg-blue-500'
                      }`}></div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                          {alert.alert_type === 'medical' ? 'Medical Emergency' : 
                           alert.alert_type === 'flood' ? 'Flood Warning' :
                           alert.alert_type === 'infrastructure' ? 'Emergency Shelter' :
                           alert.title}
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                          {alert.location} • {new Date(alert.created_at).toLocaleTimeString()} • {alert.severity}
                        </p>
                      </div>
                    </div>
                  ))}
                  
                  {/* Nearby Help Requests */}
                  {helpRequests?.slice(0, 4).map((request) => (
                    <div key={`request-${request.id}`} className="flex items-center p-2 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
                      <div className={`w-2 h-2 rounded-full mr-3 flex-shrink-0 ${
                        request.status === 'Pending' ? 'bg-yellow-500' :
                        request.status === 'In Progress' ? 'bg-blue-500' : 'bg-green-500'
                      }`}></div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                          {request.title}
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                          {request.location} • {request.status}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Recent Help Requests */}
          <div className="lg:col-span-1">
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Help Requests</h3>
              <div className="space-y-3">
                {helpRequests?.slice(0, 5).map((request) => (
                  <div key={request.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 dark:text-white text-sm">{request.title}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">{request.location}</p>
                    </div>
                    <span className={getStatusBadge(request.status)}>{request.status}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Available Volunteers */}
          <div className="lg:col-span-1">
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Available Volunteers</h3>
              <div className="space-y-3">
                {volunteers?.filter(v => v.availability === 'Available Now').map((volunteer) => (
                  <div key={volunteer.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 dark:text-white text-sm">{volunteer.name}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">{volunteer.skills.join(', ')}</p>
                    </div>
                    <div className="flex items-center text-xs text-gray-500">
                      <Star className="h-3 w-3 mr-1" />
                      {volunteer.rating}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Alerts Tab */}
      {activeTab === 'alerts' && (
        <div className="space-y-6">
          {alerts?.map((alert) => (
            <div key={alert.id} className={`card ${alert.severity === 'critical' ? 'card-emergency' : ''}`}>
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{alert.title}</h3>
                    <span className={getPriorityBadge(alert.severity)}>{alert.severity}</span>
                    {alert.status && <span className={getStatusBadge(alert.status)}>{alert.status}</span>}
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 mb-3">{alert.description}</p>
                  
                  <div className="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      {alert.location}
                    </div>
                    {alert.volunteers_needed && (
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-1" />
                        {alert.volunteers_assigned || 0}/{alert.volunteers_needed} volunteers
                      </div>
                    )}
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {new Date(alert.created_at).toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Dashboard