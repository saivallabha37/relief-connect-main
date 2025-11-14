import React, { useState, useRef, useEffect } from 'react'
import useRevealOnScroll from '../hooks/useRevealOnScroll'
import { Search, Filter, Plus, Upload, User, MapPin, Calendar, Eye } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useDatabase } from '../contexts/DatabaseContext'

const LostAndFound = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [showReportForm, setShowReportForm] = useState(false)
  const [reportType, setReportType] = useState('person') // 'person' or 'item'
  const [selectedImage, setSelectedImage] = useState(null)
  const [extractedInfo, setExtractedInfo] = useState(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [reports, setReports] = useState([])
  const [itemReports, setItemReports] = useState([])
  const [activeTab, setActiveTab] = useState('people') // 'people' or 'items'
  const [error, setError] = useState(null)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [detailsData, setDetailsData] = useState(null)
  // enable reveal-on-scroll animations
  useRevealOnScroll()
  
  // Safely get context values with fallbacks
  let authContext, dbContext
  try {
    authContext = useAuth()
    dbContext = useDatabase()
  } catch (error) {
    console.error('Context error:', error)
    return (
      <div className="p-4 text-red-500">
        Error loading contexts. Please refresh the page.
      </div>
    )
  }
  
  const { user } = authContext || {}
  const { executeQuery } = dbContext || {}
  
  // Add loading state to prevent rendering issues
  const [isLoading, setIsLoading] = useState(true)
  
  const fileInputRef = useRef(null)

  const [filters, setFilters] = useState({
    status: 'all',
    ageRange: 'all',
    location: '',
    category: 'all'
  })

  const itemCategories = [
    { value: 'documents', label: 'Documents (ID, Passport, License)' },
    { value: 'electronics', label: 'Electronics (Phone, Laptop, Camera)' },
    { value: 'jewelry', label: 'Jewelry & Accessories' },
    { value: 'clothing', label: 'Clothing & Bags' },
    { value: 'keys', label: 'Keys & Keychains' },
    { value: 'valuables', label: 'Valuables & Cash' },
    { value: 'other', label: 'Other Items' }
  ]

  // Use only live data from mock DB; no static fallbacks so new submissions appear immediately
  const missingPersons = reports
  const lostItems = itemReports

  useEffect(() => {
    let isMounted = true
    
    const loadData = async () => {
      try {
        setIsLoading(true)
        
        if (!executeQuery) {
          throw new Error('Database context not available')
        }
        
        // Load missing person reports from the mock DB (alerts) on mount
        const personRes = await executeQuery('SELECT * FROM alerts WHERE alert_type = ? ORDER BY created_at DESC', ['missing_person']).catch(() => ({ success: false }))
        if (isMounted && personRes && personRes.success) {
          setReports(personRes.data.map(r => ({
            id: r.id,
            name: (r.title || '').replace(/ - Missing$/,''),
            age: r.age,
            gender: r.gender,
            lastSeen: r.last_seen_date || r.lastSeen,
            location: r.location,
            description: r.description,
            image_url: r.image_url,
            status: r.status || (r.active ? 'missing' : 'found'),
            contactInfo: r.contact_info || r.source
          })))
        }

        // Load lost item reports from the mock DB (alerts) on mount
        const itemRes = await executeQuery('SELECT * FROM alerts WHERE alert_type = ? ORDER BY created_at DESC', ['lost_item']).catch(() => ({ success: false }))
        if (isMounted && itemRes && itemRes.success) {
          setItemReports(itemRes.data.map(r => ({
            id: r.id,
            title: r.title,
            category: r.category,
            description: r.description,
            location: r.location,
            dateFound: r.date_found || (r.created_at ? new Date(r.created_at).toISOString().slice(0,10) : ''),
            image_url: r.image_url,
            status: r.status || (r.active ? 'lost' : 'found'),
            contactInfo: r.contact_info || r.source
          })))
        }
        
        if (isMounted) {
          setIsLoading(false)
        }
      } catch (error) {
        console.error('Error loading data:', error)
        if (isMounted) {
          setError('Failed to load data. Please refresh the page.')
          setIsLoading(false)
        }
      }
    }
    
    loadData()
    
    return () => {
      isMounted = false
    }
  }, [executeQuery])

  const handleImageUpload = async (event) => {
    const file = event.target.files[0]
    if (!file) return

    // Validate file type and size
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file')
      return
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      alert('Image size should be less than 5MB')
      return
    }

    // Store the file for later upload
    setSelectedImage({
      file: file,
      preview: URL.createObjectURL(file),
      name: file.name
    })
    setExtractedInfo(null)
    setIsAnalyzing(false)
  }

  const submitReport = async (formValues) => {
    setError(null)
    if (!executeQuery) {
      setError('Database not available. Cannot submit report.')
      return
    }

    setIsLoading(true)
    try {
      let imageUrl = null
      // Handle image upload if present
      if (selectedImage && selectedImage.file) {
        try {
          const base64Image = await convertToBase64(selectedImage.file)
          imageUrl = base64Image
        } catch (err) {
          console.error('Error converting image to base64:', err)
          throw new Error('Error processing image. Please try again.')
        }
      }

      if (reportType === 'person') {
        // Persist to mock DB as an alert with alert_type 'missing_person'
        const title = formValues.fullName + ' - Missing'
        const description = formValues.description || `${formValues.fullName}, last seen at ${formValues.location} on ${formValues.lastSeen}`
        const severity = 'high'
        const location = formValues.location
        const alert_type = 'missing_person'
        const source = formValues.reportedBy || (user?.email || 'Community')

        await executeQuery('INSERT INTO alerts (title, description, severity, location, alert_type, source, image_url, age, gender, last_seen_date, contact_info) VALUES (?,?,?,?,?,?,?,?,?,?,?)', 
          [title, description, severity, location, alert_type, source, imageUrl, formValues.age, formValues.gender, formValues.lastSeen, formValues.contactInfo])

        // Refresh local list
        const res = await executeQuery('SELECT * FROM alerts WHERE alert_type = ? ORDER BY created_at DESC', ['missing_person'])
        if (res && res.success) setReports(res.data.map(r => ({
          id: r.id,
          name: (r.title || '').replace(/ - Missing$/,''),
          age: r.age,
          gender: r.gender,
          lastSeen: r.last_seen_date || r.lastSeen,
          location: r.location,
          description: r.description,
          image_url: r.image_url,
          status: r.status || (r.active ? 'missing' : 'found'),
          contactInfo: r.contact_info || r.source
        })))
      } else {
        // Persist to mock DB as an alert with alert_type 'lost_item'
        const title = formValues.itemName + ' - Lost Item'
        const description = formValues.description || `${formValues.itemName} found at ${formValues.location}`
        const severity = 'medium'
        const location = formValues.location
        const alert_type = 'lost_item'
        const source = formValues.reportedBy || (user?.email || 'Community')

        await executeQuery('INSERT INTO alerts (title, description, severity, location, alert_type, source, image_url, category, contact_info) VALUES (?,?,?,?,?,?,?,?,?)', 
          [title, description, severity, location, alert_type, source, imageUrl, formValues.category, formValues.contactInfo])

        // Refresh local list
        const res = await executeQuery('SELECT * FROM alerts WHERE alert_type = ? ORDER BY created_at DESC', ['lost_item'])
        if (res && res.success) setItemReports(res.data.map(r => ({
          id: r.id,
          title: r.title,
          category: r.category,
          description: r.description,
          location: r.location,
          dateFound: r.date_found || (r.created_at ? new Date(r.created_at).toISOString().slice(0,10) : ''),
          image_url: r.image_url,
          status: r.status || (r.active ? 'lost' : 'found'),
          contactInfo: r.contact_info || r.source
        })))
      }

      // Reset form
      setShowReportForm(false)
      setSelectedImage(null)
      setExtractedInfo(null)
    } catch (err) {
      console.error('Submit report error:', err)
      setError(err.message || 'Failed to submit report')
    } finally {
      setIsLoading(false)
    }
  }

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result)
      reader.onerror = error => reject(error)
    })
  }

  const markFound = async (id, type) => {
    setError(null)
    if (!executeQuery) return setError('Database unavailable')
    setIsLoading(true)
    try {
      await executeQuery('UPDATE alerts SET active = ? WHERE id = ?', [0, id])
      if (type === 'person') {
        setReports(prev => prev.map(r => r.id === id ? { ...r, active: false, status: 'found' } : r))
      } else {
        setItemReports(prev => prev.map(r => r.id === id ? { ...r, active: false, status: 'found' } : r))
      }
    } catch (err) {
      console.error('Mark found error:', err)
      setError('Failed to update status')
    } finally {
      setIsLoading(false)
    }
  }

  const filteredPersons = missingPersons.filter(person => {
    const matchesSearch = person.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         person.location.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filters.status === 'all' || person.status === filters.status
    const matchesLocation = !filters.location || 
                           person.location.toLowerCase().includes(filters.location.toLowerCase())
    
    return matchesSearch && matchesStatus && matchesLocation
  })

  const filteredItems = lostItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filters.status === 'all' || item.status === filters.status
    const matchesLocation = !filters.location || 
                           item.location.toLowerCase().includes(filters.location.toLowerCase())
    const matchesCategory = filters.category === 'all' || item.category === filters.category
    
    return matchesSearch && matchesStatus && matchesLocation && matchesCategory
  })

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Lost & Found
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              Help reunite families and find missing persons and items
            </p>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <div className="text-red-500 text-lg mb-2">⚠️ Error</div>
              <p className="text-gray-600 dark:text-gray-300 mb-4">{error}</p>
              <button 
                onClick={() => window.location.reload()} 
                className="btn-primary"
              >
                Refresh Page
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Lost & Found
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              Help reunite families and find missing persons and items
            </p>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            <span className="ml-3 text-gray-600 dark:text-gray-300">Loading...</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="card border-l-4 border-red-500 bg-red-50 dark:bg-red-900/20 p-4">
          <div className="flex justify-between items-start">
            <div>
              <strong className="text-red-800 dark:text-red-200">Error</strong>
              <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
            </div>
            <button onClick={() => setError(null)} className="text-sm text-red-600">Dismiss</button>
          </div>
        </div>
      )}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Lost & Found
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Help reunite families and find missing persons and items
          </p>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={() => {
              setReportType('person')
              setShowReportForm(true)
            }}
            className="btn-primary flex items-center"
          >
            <Plus className="mr-2 h-4 w-4" />
            Report Missing Person
          </button>
          <button
            onClick={() => {
              setReportType('item')
              setShowReportForm(true)
            }}
            className="btn-secondary flex items-center"
          >
            <Plus className="mr-2 h-4 w-4" />
            Report Lost Item
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
        <button
          onClick={() => setActiveTab('people')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'people'
              ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          Missing People ({filteredPersons.length})
        </button>
        <button
          onClick={() => setActiveTab('items')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'items'
              ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          Lost Items ({filteredItems.length})
        </button>
      </div>

      {/* Search and Filters */}
      <div className="card">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder={activeTab === 'people' ? "Search by name or location..." : "Search by item name or location..."}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10"
            />
          </div>
          
          <select
            value={filters.status}
            onChange={(e) => setFilters({...filters, status: e.target.value})}
            className="input-field"
          >
            <option value="all">All Status</option>
            <option value={activeTab === 'people' ? 'missing' : 'lost'}>{activeTab === 'people' ? 'Missing' : 'Lost'}</option>
            <option value="found">Found</option>
          </select>
          
          {activeTab === 'people' ? (
            <select
              value={filters.ageRange}
              onChange={(e) => setFilters({...filters, ageRange: e.target.value})}
              className="input-field"
            >
              <option value="all">All Ages</option>
              <option value="child">Child (0-17)</option>
              <option value="adult">Adult (18-64)</option>
              <option value="senior">Senior (65+)</option>
            </select>
          ) : (
            <select
              value={filters.category}
              onChange={(e) => setFilters({...filters, category: e.target.value})}
              className="input-field"
            >
              <option value="all">All Categories</option>
              {itemCategories.map(cat => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>
          )}
          
          <input
            type="text"
            placeholder="Filter by location..."
            value={filters.location}
            onChange={(e) => setFilters({...filters, location: e.target.value})}
            className="input-field"
          />
        </div>
      </div>

      {/* Content Grid */}
      {activeTab === 'people' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPersons.map((person) => (
            <div key={person.id} className="card">
              <div className="flex items-start space-x-4">
                <div className="w-20 h-20 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center overflow-hidden">
                  {person.image_url ? (
                    <img 
                      src={person.image_url} 
                      alt={person.name}
                      className="w-full h-full object-cover rounded-lg"
                      onError={(e) => {
                        e.target.style.display = 'none'
                        e.target.nextSibling.style.display = 'flex'
                      }}
                    />
                  ) : null}
                  <User className="h-8 w-8 text-gray-400" style={{display: person.image_url ? 'none' : 'flex'}} />
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {person.name}
                    </h3>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      person.status === 'missing' 
                        ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                        : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    }`}>
                      {person.status}
                    </span>
                  </div>
                  
                  <div className="space-y-1 text-sm text-gray-600 dark:text-gray-300">
                    <div className="flex items-center">
                      <User className="h-3 w-3 mr-1" />
                      {person.gender}, {person.age} years old
                    </div>
                    <div className="flex items-center">
                      <MapPin className="h-3 w-3 mr-1" />
                      {person.location}
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      {person.lastSeen}
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                    {person.description}
                  </p>
                  
                  <div className="mt-3 flex items-center space-x-2">
                    <button className="text-primary-600 hover:text-primary-700 text-sm font-medium" onClick={() => { setDetailsData({ type: 'person', data: person }); setDetailsOpen(true) }}>
                      View Details
                    </button>
                    {person.status !== 'found' && (
                      <button
                        onClick={() => markFound(person.id, 'person')}
                        className="text-sm bg-green-600 text-white px-3 py-1 rounded-md"
                      >
                        Mark Found
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div key={item.id} className="card">
              <div className="flex items-start space-x-4">
                <div className="w-20 h-20 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center overflow-hidden">
                  {item.image_url ? (
                    <img 
                      src={item.image_url} 
                      alt={item.title}
                      className="w-full h-full object-cover rounded-lg"
                      onError={(e) => {
                        e.target.style.display = 'none'
                        e.target.nextSibling.style.display = 'flex'
                      }}
                    />
                  ) : null}
                  <Eye className="h-8 w-8 text-gray-400" style={{display: item.image_url ? 'none' : 'flex'}} />
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {item.title}
                    </h3>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      item.status === 'lost' 
                        ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
                        : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    }`}>
                      {item.status}
                    </span>
                  </div>
                  
                  <div className="space-y-1 text-sm text-gray-600 dark:text-gray-300">
                    <div className="flex items-center">
                      <span className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                        {itemCategories.find(cat => cat.value === item.category)?.label || item.category}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="h-3 w-3 mr-1" />
                      {item.location}
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      {item.dateFound}
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                    {item.description}
                  </p>
                  
                  <div className="mt-3 flex items-center space-x-2">
                    <button className="text-primary-600 hover:text-primary-700 text-sm font-medium" onClick={() => { setDetailsData({ type: 'item', data: item }); setDetailsOpen(true) }}>
                      View Details
                    </button>
                    {item.status !== 'found' && (
                      <button
                        onClick={() => markFound(item.id, 'item')}
                        className="text-sm bg-green-600 text-white px-3 py-1 rounded-md"
                      >
                        Mark Found
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Report Missing Person Modal */}
      {showReportForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                {reportType === 'person' ? 'Report Missing Person' : 'Report Lost Item'}
              </h2>
              
              <form className="space-y-4" onSubmit={async (e) => {
                e.preventDefault()
                const form = e.target
                const formValues = reportType === 'person' ? {
                  fullName: form.fullName.value,
                  age: form.age.value,
                  gender: form.gender.value,
                  lastSeen: form.lastSeen.value,
                  location: form.location.value,
                  description: form.description.value,
                  reportedBy: form.reportedBy.value,
                  contactInfo: form.contactInfo?.value
                } : {
                  itemName: form.itemName.value,
                  category: form.category.value,
                  location: form.location.value,
                  description: form.description.value,
                  reportedBy: form.reportedBy.value,
                  contactInfo: form.contactInfo.value
                }
                await submitReport(formValues)
              }}>
                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Photo (Optional)
                  </label>
                  
                  {selectedImage ? (
                    <div className="border-2 border-gray-300 dark:border-gray-600 rounded-lg p-4">
                      <div className="flex items-center space-x-4">
                        <div className="w-20 h-20 bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden flex items-center justify-center">
                          <img 
                            src={selectedImage.preview} 
                            alt="Preview"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {selectedImage.name}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {(selectedImage.file.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                          <button
                            type="button"
                            onClick={() => setSelectedImage(null)}
                            className="text-xs text-red-600 hover:text-red-700 mt-1"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center cursor-pointer hover:border-primary-500 transition-colors"
                    >
                      <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-600 dark:text-gray-300">
                        Click to upload photo or drag and drop
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        JPG, PNG, GIF up to 5MB
                      </p>
                    </div>
                  )}
                  
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </div>

                {/* AI Analysis Results */}
                {isAnalyzing && (
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                      <span className="text-blue-800 dark:text-blue-200">
                        Analyzing image and extracting information...
                      </span>
                    </div>
                  </div>
                )}

                {extractedInfo && (
                  <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                    <h3 className="font-medium text-green-800 dark:text-green-200 mb-2">
                      Extracted Information:
                    </h3>
                    <pre className="text-sm text-green-700 dark:text-green-300 whitespace-pre-wrap">
                      {JSON.stringify(extractedInfo, null, 2)}
                    </pre>
                  </div>
                )}

                {reportType === 'person' ? (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Full Name *
                        </label>
                        <input name="fullName" type="text" required className="input-field" defaultValue={extractedInfo?.name || ''} />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Age *
                        </label>
                        <input name="age" type="number" required className="input-field" defaultValue={extractedInfo?.age || ''} />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Gender
                        </label>
                        <select name="gender" className="input-field" defaultValue={extractedInfo?.gender || ''}>
                          <option value="">Select gender</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Last Seen Date *
                        </label>
                        <input name="lastSeen" type="date" required className="input-field" />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Last Seen Location *
                      </label>
                      <input name="location" type="text" required className="input-field" placeholder="Be as specific as possible" defaultValue={extractedInfo?.location || ''} />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Physical Description
                      </label>
                      <textarea name="description"
                        rows={4} 
                        className="input-field" 
                        placeholder="Height, weight, hair color, eye color, clothing, distinguishing features..."
                        defaultValue={extractedInfo?.description || ''}
                      ></textarea>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Your Contact Email *
                        </label>
                        <input name="reportedBy" type="email" required className="input-field" placeholder="Your email address" defaultValue={user?.email || ''} />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Contact Phone (Optional)
                        </label>
                        <input name="contactInfo" type="tel" className="input-field" placeholder="Phone number" />
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Item Name *
                        </label>
                        <input name="itemName" type="text" required className="input-field" placeholder="e.g., iPhone, Wallet, Keys" />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Category *
                        </label>
                        <select name="category" required className="input-field">
                          <option value="">Select category</option>
                          {itemCategories.map(cat => (
                            <option key={cat.value} value={cat.value}>{cat.label}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Location Found/Lost *
                      </label>
                      <input name="location" type="text" required className="input-field" placeholder="Where was the item found or last seen?" />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Item Description
                      </label>
                      <textarea name="description"
                        rows={4} 
                        className="input-field" 
                        placeholder="Color, brand, model, distinctive features, condition..."
                      ></textarea>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Your Contact Information *
                        </label>
                        <input name="reportedBy" type="email" required className="input-field" placeholder="Your email address" defaultValue={user?.email || ''} />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Additional Contact (Optional)
                        </label>
                        <input name="contactInfo" type="text" className="input-field" placeholder="Phone number or alternative contact" />
                      </div>
                    </div>
                  </>
                )}
                
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowReportForm(false)}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary">
                    Submit Report
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {detailsOpen && detailsData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-2xl w-full overflow-hidden">
            <div className="p-6">
              <div className="flex items-start space-x-4">
                <div className="w-32 h-32 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center overflow-hidden">
                  {detailsData.data.image_url ? (
                    <img src={detailsData.data.image_url} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-sm text-gray-500">No image</div>
                  )}
                </div>
                <div className="flex-1 space-y-1 text-sm text-gray-700 dark:text-gray-200">
                  {detailsData.type === 'person' ? (
                    <>
                      <div className="text-lg font-semibold">{detailsData.data.name}</div>
                      <div>Gender: {detailsData.data.gender || '-'}</div>
                      <div>Age: {detailsData.data.age || '-'}</div>
                      <div>Last Seen: {detailsData.data.lastSeen || '-'}</div>
                      <div>Location: {detailsData.data.location || '-'}</div>
                      <div>Description: {detailsData.data.description || '-'}</div>
                      <div>Contact: {detailsData.data.contactInfo || '-'}</div>
                    </>
                  ) : (
                    <>
                      <div className="text-lg font-semibold">{detailsData.data.title}</div>
                      <div>Category: {detailsData.data.category}</div>
                      <div>Location: {detailsData.data.location}</div>
                      <div>Date: {detailsData.data.dateFound || '-'}</div>
                      <div>Description: {detailsData.data.description || '-'}</div>
                      <div>Contact: {detailsData.data.contactInfo || '-'}</div>
                    </>
                  )}
                </div>
              </div>
              <div className="flex justify-end space-x-3 pt-6">
                <button className="btn-secondary" onClick={() => setDetailsOpen(false)}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default LostAndFound
