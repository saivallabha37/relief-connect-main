import React, { useState, useEffect } from 'react'
import { 
  Heart, 
  IndianRupee, 
  Package, 
  Users, 
  MapPin, 
  Clock,
  CheckCircle,
  Star
} from 'lucide-react'
import { useLocation } from 'react-router-dom'

const Donations = () => {
  const [activeTab, setActiveTab] = useState('donate')
  const [donationType, setDonationType] = useState('money')
  const [volunteerForm, setVolunteerForm] = useState({
    name: '',
    email: '',
    phone: '',
    skills: [],
    availability: '',
    location: ''
  })

  const campaigns = [
    {
      id: 1,
      title: 'Cyclone Relief Fund',
      description: 'Supporting families affected by recent cyclone damage',
      raised: 7500000,
      goal: 10000000,
      donors: 1250,
      urgent: true
    },
    {
      id: 2,
      title: 'Emergency Shelter Supplies',
      description: 'Providing essential supplies for temporary shelters',
      raised: 4500000,
      goal: 6000000,
      donors: 890,
      urgent: false
    },
    {
      id: 3,
      title: 'Medical Equipment Fund',
      description: 'Purchasing medical supplies for disaster response',
      raised: 3200000,
      goal: 5000000,
      donors: 567,
      urgent: true
    }
  ]

  const location = useLocation()

  // If a query param ?tab=volunteer is present, default to volunteer tab
  useEffect(() => {
    try {
      const params = new URLSearchParams(location.search)
      const tab = params.get('tab')
      if (tab === 'volunteer' || tab === 'donate') setActiveTab(tab)
    } catch (e) {
      // ignore
    }
  }, [location.search])

  const volunteerOpportunities = [
    {
      id: 1,
      title: 'Emergency Response Team',
      description: 'First responders for disaster situations',
      location: 'Various locations',
      timeCommitment: 'On-call basis',
      skills: ['First Aid', 'CPR', 'Emergency Response'],
      urgent: true
    },
    {
      id: 2,
      title: 'Shelter Coordinator',
      description: 'Help manage emergency shelters and assist evacuees',
      location: 'Downtown Community Center',
      timeCommitment: '4-8 hours/week',
      skills: ['Organization', 'Communication', 'Leadership'],
      urgent: false
    },
    {
      id: 3,
      title: 'Supply Distribution',
      description: 'Sort and distribute emergency supplies to affected areas',
      location: 'Warehouse District',
      timeCommitment: 'Flexible shifts',
      skills: ['Physical work', 'Teamwork', 'Attention to detail'],
      urgent: false
    }
  ]

  const skillOptions = [
    'First Aid/CPR',
    'Medical Training',
    'Construction/Repair',
    'Transportation',
    'Translation',
    'IT/Communications',
    'Counseling/Mental Health',
    'Logistics/Organization',
    'Cooking/Food Service',
    'Childcare',
    'Swimming',
    'Water Rescue',
    'Lifeguard Training',
    'Boat Operation'
  ]

  const handleSkillToggle = (skill) => {
    setVolunteerForm(prev => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill]
    }))
  }

  const handleVolunteerSubmit = (e) => {
    e.preventDefault()
    // Handle volunteer registration
    console.log('Volunteer registration:', volunteerForm)
    alert('Thank you for volunteering! We will contact you soon.')
  }

  const notifyMaterialsByDisaster = (type) => {
    // moved: volunteer notification logic is now handled by ReportIncident and DatabaseContext via broadcast
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Donation & Volunteers
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mt-2">
          Support disaster relief efforts through donations and volunteering
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
        <button
          onClick={() => setActiveTab('donate')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'donate'
              ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
              : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          <IndianRupee className="inline h-4 w-4 mr-2" />
          Donate
        </button>
        <button
          onClick={() => setActiveTab('volunteer')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'volunteer'
              ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
              : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          <Users className="inline h-4 w-4 mr-2" />
          Volunteer
        </button>
      </div>

      {activeTab === 'donate' && (
        <div className="space-y-6">
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Donate to trusted channels</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">To ensure funds are used efficiently, please donate directly to national government relief funds or well-known, registered NGOs:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <a href="https://www.indianredcross.org/donate" target="_blank" rel="noreferrer" className="p-4 border rounded-lg hover:shadow-md transition flex items-center">
                <img src="/assets/logo-indian-red-cross.svg" alt="Indian Red Cross" className="w-12 h-12 mr-4 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-sm sm:text-base">Indian Red Cross Society — Donate</h3>
                  <p className="text-xs sm:text-sm text-gray-600">Donate to Indian Red Cross disaster relief efforts.</p>
                </div>
              </a>

              <a href="https://india.unicef.org/joyofgiving?utm_source=uniceforg&utm_medium=referral&utm_content=topbutton&utm_campaign=jog" target="_blank" rel="noreferrer" className="p-4 border rounded-lg hover:shadow-md transition flex items-center">
                <img src="/assets/logo-cry.svg" alt="UNICEF India" className="w-12 h-12 mr-4 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-sm sm:text-base">UNICEF India — Donate</h3>
                  <p className="text-xs sm:text-sm text-gray-600">Donate to UNICEF India's programs for children in emergencies.</p>
                </div>
              </a>

              <a href="https://www.pmcares.gov.in" target="_blank" rel="noreferrer" className="p-4 border rounded-lg hover:shadow-md transition">
                <h3 className="font-semibold text-sm sm:text-base">PM CARES Fund — Donate</h3>
                <p className="text-xs sm:text-sm text-gray-600">Donate directly to the official PM CARES donation page.</p>
              </a>

              <a href="https://ndma.gov.in" target="_blank" rel="noreferrer" className="p-4 border rounded-lg hover:shadow-md transition">
                <h3 className="font-semibold text-sm sm:text-base">National Disaster Management Authority (NDMA)</h3>
                <p className="text-xs sm:text-sm text-gray-600">Official information and links to state-level relief channels.</p>
              </a>

              <a href="https://www.giveindia.org" target="_blank" rel="noreferrer" className="p-4 border rounded-lg hover:shadow-md transition">
                <h3 className="font-semibold text-sm sm:text-base">GiveIndia — Donate</h3>
                <p className="text-xs sm:text-sm text-gray-600">Donate via GiveIndia's secure donation flow.</p>
              </a>

              <a href="https://goonj.org/donate/" target="_blank" rel="noreferrer" className="p-4 border rounded-lg hover:shadow-md transition flex items-center">
                <img src="/assets/logo-goonj.svg" alt="Goonj" className="w-12 h-12 mr-4 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-sm sm:text-base">Goonj — Donate</h3>
                  <p className="text-xs sm:text-sm text-gray-600">Support Goonj's relief operations through their donation page.</p>
                </div>
              </a>
            </div>
            <p className="text-sm text-gray-500 mt-4">If you prefer, donate directly through the official state disaster relief portals for your region.</p>
          </div>
        </div>
      )}

      {activeTab === 'volunteer' && (
        <div className="space-y-6">
          {/* Notify volunteers UI moved to Report Incident page */}
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Volunteer - ways anyone can help</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-3">These organizations accept general volunteers or have easy, non-technical ways for citizens to help (donation drives, packing, distribution, community kitchens, local coordination).</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <a href="https://www.indianredcross.org" target="_blank" rel="noreferrer" className="p-4 border rounded-lg hover:shadow-md transition flex items-center">
                <img src="/assets/logo-indian-red-cross.svg" alt="Indian Red Cross" className="w-12 h-12 mr-4 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-sm sm:text-base">Indian Red Cross Society</h3>
                  <p className="text-xs sm:text-sm text-gray-600">Local chapters run blood drives, first aid training, and relief distribution.</p>
                </div>
              </a>

              <a href="https://www.goonj.org" target="_blank" rel="noreferrer" className="p-4 border rounded-lg hover:shadow-md transition flex items-center">
                <img src="/assets/logo-goonj.svg" alt="Goonj" className="w-12 h-12 mr-4 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-sm sm:text-base">Goonj</h3>
                  <p className="text-xs sm:text-sm text-gray-600">Disaster relief and rural development — collection drives, packing and distribution.</p>
                </div>
              </a>

              <a href="https://robinhoodarmy.com" target="_blank" rel="noreferrer" className="p-4 border rounded-lg hover:shadow-md transition flex items-center">
                <img src="/assets/logo-robin-hood-army.svg" alt="Robin Hood Army" className="w-12 h-12 mr-4 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-sm sm:text-base">Robin Hood Army</h3>
                  <p className="text-xs sm:text-sm text-gray-600">Community volunteers redistribute surplus food to those in need.</p>
                </div>
              </a>

              <a href="https://www.teachforindia.org" target="_blank" rel="noreferrer" className="p-4 border rounded-lg hover:shadow-md transition flex items-center">
                <img src="/assets/logo-teach-for-india.svg" alt="Teach For India" className="w-12 h-12 mr-4 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-sm sm:text-base">Teach For India</h3>
                  <p className="text-xs sm:text-sm text-gray-600">Volunteer to teach and mentor underprivileged children.</p>
                </div>
              </a>

              <a href="https://www.youthforseva.org" target="_blank" rel="noreferrer" className="p-4 border rounded-lg hover:shadow-md transition flex items-center">
                <img src="/assets/logo-youth-for-seva.svg" alt="Youth for Seva" className="w-12 h-12 mr-4 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-sm sm:text-base">Youth for Seva</h3>
                  <p className="text-xs sm:text-sm text-gray-600">Volunteers support education, environment, and health programs.</p>
                </div>
              </a>

              <a href="https://www.feedingindia.org" target="_blank" rel="noreferrer" className="p-4 border rounded-lg hover:shadow-md transition flex items-center">
                <img src="/assets/logo-feeding-india.svg" alt="Feeding India" className="w-12 h-12 mr-4 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-sm sm:text-base">Feeding India</h3>
                  <p className="text-xs sm:text-sm text-gray-600">Work to end hunger and food waste — many on-ground volunteer roles.</p>
                </div>
              </a>

              <a href="https://nss.gov.in" target="_blank" rel="noreferrer" className="p-4 border rounded-lg hover:shadow-md transition flex items-center">
                <div className="w-12 h-12 mr-4 flex-shrink-0 flex items-center justify-center">
                  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="48" height="48" rx="8" fill="#1565c0"/>
                    <path d="M8 20h32v6H8zM8 30h32v6H8z" fill="#fff"/>
                    <circle cx="24" cy="14" r="4" fill="#fff"/>
                    <text x="24" y="42" textAnchor="middle" fontSize="8" fill="#fff" fontWeight="bold">NSS</text>
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-sm sm:text-base">National Service Scheme (NSS)</h3>
                  <p className="text-xs sm:text-sm text-gray-600">Government-supported student volunteering program across colleges.</p>
                </div>
              </a>

              <a href="https://www.cry.org" target="_blank" rel="noreferrer" className="p-4 border rounded-lg hover:shadow-md transition flex items-center">
                <img src="/assets/logo-cry.svg" alt="CRY" className="w-12 h-12 mr-4 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-sm sm:text-base">CRY (Child Rights and You)</h3>
                  <p className="text-xs sm:text-sm text-gray-600">Volunteer for child welfare, education and protection programs.</p>
                </div>
              </a>
            </div>
          </div>

          {/* Volunteer Registration Form (kept for users who want to register through this app) */}
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Register as a volunteer (optional)</h2>
            <form onSubmit={handleVolunteerSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={volunteerForm.name}
                    onChange={(e) => setVolunteerForm({...volunteerForm, name: e.target.value})}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={volunteerForm.email}
                    onChange={(e) => setVolunteerForm({...volunteerForm, email: e.target.value})}
                    className="input-field"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={volunteerForm.phone}
                    onChange={(e) => setVolunteerForm({...volunteerForm, phone: e.target.value})}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Location/City
                  </label>
                  <input
                    type="text"
                    value={volunteerForm.location}
                    onChange={(e) => setVolunteerForm({...volunteerForm, location: e.target.value})}
                    className="input-field"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Skills & Expertise (select all that apply)
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {skillOptions.map((skill) => (
                    <label key={skill} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={volunteerForm.skills.includes(skill)}
                        onChange={() => handleSkillToggle(skill)}
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500 mr-2"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {skill}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Availability
                </label>
                <select
                  value={volunteerForm.availability}
                  onChange={(e) => setVolunteerForm({...volunteerForm, availability: e.target.value})}
                  className="input-field"
                >
                  <option value="">Select availability</option>
                  <option value="weekdays">Weekdays</option>
                  <option value="weekends">Weekends</option>
                  <option value="evenings">Evenings</option>
                  <option value="flexible">Flexible</option>
                  <option value="emergency-only">Emergency situations only</option>
                </select>
              </div>
              
              <button type="submit" className="btn-primary w-full">
                Register as Volunteer
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Donations
