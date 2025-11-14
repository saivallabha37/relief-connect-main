import React, { useState } from 'react'
import useRevealOnScroll from '../hooks/useRevealOnScroll'
import { useLanguage } from '../contexts/LanguageContext'
import { 
  Shield, 
  Zap, 
  Waves, 
  Wind, 
  Flame, 
  Mountain, 
  Snowflake,
  AlertTriangle,
  CheckCircle,
  Clock
} from 'lucide-react'

const Instructions = () => {
  const { t } = useLanguage()
  const [selectedDisaster, setSelectedDisaster] = useState('earthquake')
  const [selectedPhase, setSelectedPhase] = useState('before')
  const [safetyGuide, setSafetyGuide] = useState('')
  const [loading, setLoading] = useState(false)

  // enable reveal animations
  useRevealOnScroll()

  const disasters = [
    { id: 'earthquake', name: 'Earthquake', icon: Mountain, color: 'bg-orange-500' },
    { id: 'flood', name: 'Flood', icon: Waves, color: 'bg-blue-500' },
    { id: 'hurricane', name: 'Hurricane', icon: Wind, color: 'bg-purple-500' },
    { id: 'wildfire', name: 'Wildfire', icon: Flame, color: 'bg-red-500' },
    { id: 'tornado', name: 'Tornado', icon: Wind, color: 'bg-gray-500' },
    { id: 'blizzard', name: 'Blizzard', icon: Snowflake, color: 'bg-cyan-500' },
    { id: 'thunderstorm', name: 'Thunderstorm', icon: Zap, color: 'bg-yellow-500' },
    { id: 'heatwave', name: 'Heat Wave', icon: Flame, color: 'bg-orange-600' }
  ]

  const phases = [
    { id: 'before', name: 'Before', icon: Clock, description: 'Preparation and planning' },
    { id: 'during', name: 'During', icon: AlertTriangle, description: 'Immediate response' },
    { id: 'after', name: 'After', icon: CheckCircle, description: 'Recovery and cleanup' }
  ]

  // Comprehensive disaster safety guidelines
  const disasterGuidelines = {
    earthquake: {
      before: `EARTHQUAKE SAFETY - BEFORE

Preparation:
• Secure heavy furniture, appliances, and water heaters to walls
• Store breakable items on lower shelves
• Identify safe spots in each room (under sturdy tables, against interior walls)
• Practice "Drop, Cover, and Hold On" drills with family
• Keep a flashlight and sturdy shoes near your bed
• Prepare an emergency kit with water, food, first aid, and tools
• Know how to shut off gas, water, and electricity
• Create a family emergency communication plan
• Keep important documents in a fireproof, waterproof container
• Reinforce your home's foundation and structure if in a high-risk area`,
      during: `EARTHQUAKE SAFETY - DURING

Immediate Actions:
• DROP to your hands and knees immediately
• COVER your head and neck with your arms, and if possible, get under a sturdy table or desk
• HOLD ON to your shelter until shaking stops
• If indoors: Stay inside, stay away from windows, glass, and heavy objects
• If outdoors: Move to an open area away from buildings, trees, and power lines
• If in a vehicle: Pull over to a safe location and stay inside
• If in bed: Stay there and cover your head with a pillow
• Do NOT use elevators
• Do NOT run outside during shaking
• Be prepared for aftershocks`,
      after: `EARTHQUAKE SAFETY - AFTER

Recovery Steps:
• Check yourself and others for injuries
• Check for gas leaks, electrical damage, and structural issues
• If you smell gas, turn off the main valve and leave immediately
• Use flashlights instead of candles to avoid fire risk
• Listen to emergency broadcasts for updates
• Avoid damaged areas and buildings
• Be cautious of falling debris and aftershocks
• Help neighbors if safe to do so
• Contact family members to confirm safety
• Follow evacuation orders if issued
• Document damage with photos for insurance claims`
    },
    flood: {
      before: `FLOOD SAFETY - BEFORE

Preparation:
• Know your area's flood risk and evacuation routes
• Purchase flood insurance if available
• Keep important documents in waterproof containers
• Elevate electrical panels, appliances, and utilities above potential flood levels
• Install sump pumps with battery backup
• Create an emergency kit with water, non-perishable food, and supplies
• Prepare a "go bag" with essentials for quick evacuation
• Sign up for local flood alerts and warnings
• Keep sandbags ready if you're in a flood-prone area
• Plan where you'll go if evacuation is necessary`,
      during: `FLOOD SAFETY - DURING

Immediate Actions:
• Move to higher ground immediately if flooding begins
• Evacuate if authorities tell you to do so
• Never walk or drive through flooded areas - just 6 inches of moving water can knock you down
• Turn around, don't drown - find an alternate route
• Stay away from bridges over fast-moving water
• If trapped in a building, go to the highest level
• Avoid contact with floodwater - it may be contaminated
• Turn off electricity at the main breaker if water enters your home
• Listen to emergency broadcasts for updates
• Do not attempt to cross flowing streams or flooded roads`,
      after: `FLOOD SAFETY - AFTER

Recovery Steps:
• Return home only when authorities say it's safe
• Avoid floodwaters - they may be contaminated or electrically charged
• Be cautious of damaged roads, bridges, and buildings
• Check for structural damage before entering buildings
• Document all damage with photos for insurance
• Clean and disinfect everything that got wet
• Throw away food that came in contact with floodwater
• Have electrical systems checked by a professional
• Watch for signs of mold growth
• Use generators and other fuel-powered equipment outdoors only
• Help neighbors if safe to do so`
    },
    hurricane: {
      before: `HURRICANE SAFETY - BEFORE

Preparation:
• Board up windows or install storm shutters
• Secure outdoor furniture, decorations, and loose items
• Trim trees and remove dead branches
• Clear gutters and drains
• Stock up on water (1 gallon per person per day for 3-7 days)
• Stock up on non-perishable food and supplies
• Charge all electronic devices and power banks
• Fill your vehicle's gas tank
• Prepare an emergency kit with first aid, flashlights, batteries
• Know your evacuation route and have a plan
• Identify a safe room or shelter location
• Review your insurance policies`,
      during: `HURRICANE SAFETY - DURING

Immediate Actions:
• Stay indoors and away from windows and glass doors
• Take refuge in a small interior room, closet, or hallway on the lowest floor
• Lie on the floor under a table or another sturdy object
• Avoid elevators
• Do not go outside, even if the storm seems to have passed - the eye of the storm can be deceptive
• Listen to battery-powered radio or TV for updates
• Turn off utilities if instructed to do so
• Use flashlights instead of candles
• Stay away from flood-prone areas
• If in a mobile home, evacuate to a sturdier shelter`,
      after: `HURRICANE SAFETY - AFTER

Recovery Steps:
• Wait for official word that it's safe before going outside
• Avoid downed power lines - assume they are live
• Stay away from damaged buildings and structures
• Do not drive through flooded areas
• Check for gas leaks before using matches or lighters
• Use generators outdoors and away from windows
• Avoid drinking tap water until authorities confirm it's safe
• Document damage with photos for insurance
• Help neighbors if safe to do so
• Be patient - recovery takes time
• Follow instructions from local authorities`
    },
    wildfire: {
      before: `WILDFIRE SAFETY - BEFORE

Preparation:
• Create defensible space around your home (30-100 feet)
• Remove dead vegetation, leaves, and debris from your property
• Keep gutters and roofs clear of leaves and debris
• Store flammable materials away from your home
• Use fire-resistant building materials when possible
• Have an evacuation plan and practice it
• Prepare a "go bag" with essentials
• Keep important documents ready to grab quickly
• Sign up for local wildfire alerts
• Know multiple evacuation routes
• Keep vehicles fueled and ready`,
      during: `WILDFIRE SAFETY - DURING

Immediate Actions:
• Evacuate immediately if authorities tell you to do so
• Close all windows, doors, and vents
• Turn off gas at the meter
• Turn on lights to help visibility in smoke
• Move flammable furniture away from windows
• Fill containers with water
• Wear protective clothing if you must stay
• Monitor air quality and stay indoors if air quality is poor
• Keep pets indoors
• Listen to emergency broadcasts for updates
• Do not return until authorities say it's safe`,
      after: `WILDFIRE SAFETY - AFTER

Recovery Steps:
• Return home only when authorities say it's safe
• Be cautious of hot spots, smoldering debris, and hidden embers
• Check roofs and gutters for sparks or embers
• Check for gas leaks before using utilities
• Document all damage with photos for insurance
• Be aware of unstable trees and structures
• Watch for signs of respiratory problems from smoke
• Help neighbors if safe to do so
• Follow instructions from fire and emergency officials
• Be patient - recovery takes time`
    },
    tornado: {
      before: `TORNADO SAFETY - BEFORE

Preparation:
• Identify a safe room in your home (basement, interior room, or storm cellar)
• Practice tornado drills with your family
• Know the difference between a tornado watch and warning
• Keep an emergency kit ready
• Secure outdoor items that could become projectiles
• Know where to take shelter at work, school, or other locations
• Sign up for tornado alerts and warnings
• Have a battery-powered weather radio
• Keep important documents in a safe place
• Plan how to communicate with family if separated`,
      during: `TORNADO SAFETY - DURING

Immediate Actions:
• Go to the lowest level of a sturdy building
• Get into a small interior room or closet
• Stay away from windows, doors, and outside walls
• Get under something sturdy like a heavy table
• Cover your head and neck with your arms
• If in a mobile home, evacuate to a sturdier shelter
• If in a vehicle, get out and find a low-lying area or ditch
• Never try to outrun a tornado in a vehicle
• If outside with no shelter, lie flat in a low-lying area
• Protect your head from flying debris`,
      after: `TORNADO SAFETY - AFTER

Recovery Steps:
• Check yourself and others for injuries
• Watch out for broken glass, nails, and other sharp objects
• Avoid downed power lines - assume they are live
• Stay out of damaged buildings
• Use flashlights instead of candles
• Listen to emergency broadcasts for updates
• Help neighbors if safe to do so
• Contact family members to confirm safety
• Document damage with photos for insurance
• Follow instructions from emergency officials`
    },
    blizzard: {
      before: `BLIZZARD SAFETY - BEFORE

Preparation:
• Stock up on food, water, and supplies for several days
• Have alternative heating sources ready (safely)
• Insulate pipes to prevent freezing
• Keep your vehicle's gas tank full
• Have a winter emergency kit in your car
• Stock up on rock salt or sand for walkways
• Have warm clothing and blankets ready
• Charge all electronic devices
• Know how to shut off water if pipes freeze
• Have a battery-powered radio and extra batteries`,
      during: `BLIZZARD SAFETY - DURING

Immediate Actions:
• Stay indoors and avoid unnecessary travel
• If you must go outside, dress in layers and cover exposed skin
• Watch for signs of frostbite and hypothermia
• Keep dry and change wet clothing immediately
• Conserve fuel by keeping your home cooler than usual
• Use generators outdoors and away from windows
• Avoid overexertion when shoveling snow
• Stay hydrated and eat regularly
• Check on elderly neighbors if safe to do so
• Listen to weather updates and emergency broadcasts`,
      after: `BLIZZARD SAFETY - AFTER

Recovery Steps:
• Clear snow from walkways and driveways carefully
• Check for damage to your home and property
• Check on neighbors, especially the elderly
• Be cautious of ice on roads and walkways
• Watch for signs of hypothermia if you've been outside
• Check pipes for freezing and damage
• Avoid overexertion during cleanup
• Stay warm and dry
• Follow instructions from local authorities
• Be patient - recovery may take time`
    },
    thunderstorm: {
      before: `THUNDERSTORM SAFETY - BEFORE

Preparation:
• Secure outdoor furniture and loose items
• Trim trees and remove dead branches
• Clear gutters and drains
• Have a battery-powered weather radio
• Charge electronic devices
• Know where to take shelter
• Have flashlights and batteries ready
• Unplug sensitive electronics if possible
• Stay informed about weather forecasts
• Plan indoor activities for severe weather`,
      during: `THUNDERSTORM SAFETY - DURING

Immediate Actions:
• Go indoors immediately when you hear thunder
• Stay away from windows and doors
• Avoid electrical equipment and plumbing
• Do not use corded phones
• Stay away from tall objects and metal
• If outside, avoid open fields, hilltops, and isolated trees
• If in a vehicle, stay inside with windows closed
• If in water, get out immediately
• Wait 30 minutes after the last thunder before going outside
• Listen to weather updates`,
      after: `THUNDERSTORM SAFETY - AFTER

Recovery Steps:
• Check for damage to your property
• Avoid downed power lines - assume they are live
• Check on neighbors if safe to do so
• Document damage with photos for insurance
• Be cautious of flooding and standing water
• Watch for signs of electrical problems
• Follow instructions from emergency officials
• Help neighbors if safe to do so
• Stay away from damaged areas
• Report hazards to authorities`
    },
    heatwave: {
      before: `HEAT WAVE SAFETY - BEFORE

Preparation:
• Install window air conditioners or fans
• Have plenty of water available
• Stock up on electrolyte drinks
• Know the signs of heat-related illness
• Plan to stay in air-conditioned places
• Have light, loose-fitting clothing ready
• Avoid scheduling strenuous activities during peak heat
• Check on elderly neighbors and relatives
• Keep pets indoors and provide plenty of water
• Know where cooling centers are located`,
      during: `HEAT WAVE SAFETY - DURING

Immediate Actions:
• Stay indoors in air-conditioned spaces as much as possible
• Drink plenty of water - don't wait until you're thirsty
• Avoid alcoholic and caffeinated beverages
• Wear light-colored, loose-fitting clothing
• Limit outdoor activities, especially during peak hours (10am-4pm)
• Take cool showers or baths
• Never leave children or pets in vehicles
• Check on elderly neighbors and relatives
• Watch for signs of heat exhaustion or heat stroke
• Use fans and cool, wet cloths if air conditioning isn't available`,
      after: `HEAT WAVE SAFETY - AFTER

Recovery Steps:
• Continue to stay hydrated
• Monitor for signs of heat-related illness
• Check on vulnerable neighbors and relatives
• Be aware that heat can persist even after the peak
• Gradually resume normal activities
• Continue to avoid peak heat hours
• Watch for signs of heat exhaustion in yourself and others
• Seek medical attention if needed
• Follow instructions from health officials
• Take time to recover and rest`
    }
  }

  const fetchSafetyGuide = async () => {
    setLoading(true)
    try {
      // Try API first, but fall back to local data
      const response = await fetch('https://builder.empromptu.ai/api_tools/apply_prompt_to_data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer 5254d3137bc61704d35e86e9e22c6bc6',
          'X-Generated-App-ID': '7f6707a3-47ec-40c3-ad3f-1eb7f4da4ffb',
          'X-Usage-Key': 'cbdf28b6a6e122cf39846203916f8199'
        },
        body: JSON.stringify({
          prompt_name: 'disaster_safety_guide',
          input_data: {
            disaster_type: selectedDisaster,
            phase: selectedPhase
          },
          return_type: 'pretty_text'
        })
      })

      if (response.ok) {
        const data = await response.json()
        if (data.value && !data.value.includes('not available')) {
          setSafetyGuide(data.value)
        } else {
          // Fall back to local data
          setSafetyGuide(disasterGuidelines[selectedDisaster]?.[selectedPhase] || 'Safety guide not available.')
        }
      } else {
        // Fall back to local data
        setSafetyGuide(disasterGuidelines[selectedDisaster]?.[selectedPhase] || 'Safety guide not available.')
      }
    } catch (error) {
      console.error('Error fetching safety guide:', error)
      // Fall back to local data
      setSafetyGuide(disasterGuidelines[selectedDisaster]?.[selectedPhase] || 'Safety guide not available.')
    } finally {
      setLoading(false)
    }
  }

  React.useEffect(() => {
    // Set initial guide from local data immediately
    setSafetyGuide(disasterGuidelines[selectedDisaster]?.[selectedPhase] || 'Loading...')
    // Then try to fetch from API
    fetchSafetyGuide()
  }, [selectedDisaster, selectedPhase])

  const quickTips = {
    earthquake: [
      'Drop, Cover, and Hold On',
      'Stay away from windows and heavy objects',
      'If outdoors, move away from buildings',
      'Do not run outside during shaking'
    ],
    flood: [
      'Move to higher ground immediately',
      'Never drive through flooded roads',
      'Avoid walking in moving water',
      'Listen for evacuation orders'
    ],
    hurricane: [
      'Board up windows and secure outdoor items',
      'Stock up on water and non-perishable food',
      'Charge all electronic devices',
      'Know your evacuation route'
    ],
    wildfire: [
      'Create defensible space around your home',
      'Have an evacuation plan ready',
      'Keep important documents accessible',
      'Monitor air quality and stay indoors if needed'
    ],
    tornado: [
      'Go to the lowest level of a sturdy building',
      'Get into a small interior room or closet',
      'Stay away from windows and outside walls',
      'Cover your head and neck'
    ],
    blizzard: [
      'Stay indoors and avoid travel',
      'Dress in layers if going outside',
      'Watch for signs of frostbite',
      'Conserve fuel and stay warm'
    ],
    thunderstorm: [
      'Go indoors when you hear thunder',
      'Stay away from windows and electrical equipment',
      'Avoid open fields and tall objects',
      'Wait 30 minutes after last thunder'
    ],
    heatwave: [
      'Stay in air-conditioned spaces',
      'Drink plenty of water',
      'Avoid peak heat hours (10am-4pm)',
      'Watch for signs of heat exhaustion'
    ]
  }

  return (
    <div className="responsive-container py-8">
      <div className="flex relative">
      {/* Main Content Area */}
      <div className="flex-1 space-y-6 pr-0 lg:pr-80">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            Instructions & Safety
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2 text-sm sm:text-base">
            Get comprehensive safety guidelines for various disaster scenarios
          </p>
        </div>

        {/* Disaster Type Selection */}
        <div className="card">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Select Disaster Type
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
            {disasters.map((disaster) => (
              <button
                key={disaster.id}
                onClick={() => setSelectedDisaster(disaster.id)}
                className={`p-3 sm:p-4 rounded-lg border-2 transition-all duration-200 ${
                  selectedDisaster === disaster.id
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                    : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                }`}
              >
                <div className={`${disaster.color} w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center mx-auto mb-2`}>
                  <disaster.icon className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
                <div className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white">
                  {disaster.name}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Phase Selection */}
        <div className="card">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Select Phase
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            {phases.map((phase) => (
              <button
                key={phase.id}
                onClick={() => setSelectedPhase(phase.id)}
                className={`p-3 sm:p-4 rounded-lg border-2 text-left transition-all duration-200 ${
                  selectedPhase === phase.id
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                    : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                }`}
              >
                <div className="flex items-center mb-2">
                  <phase.icon className="h-4 w-4 sm:h-5 sm:w-5 text-primary-600 dark:text-primary-400 mr-2" />
                  <span className="font-medium text-sm sm:text-base text-gray-900 dark:text-white">
                    {phase.name}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                  {phase.description}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Safety Guide */}
        <div className="card">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Safety Guidelines: {disasters.find(d => d.id === selectedDisaster)?.name} - {phases.find(p => p.id === selectedPhase)?.name}
          </h2>
          
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
              <span className="ml-2 text-gray-600 dark:text-gray-300">
                Loading safety guidelines...
              </span>
            </div>
          ) : (
            <div className="prose dark:prose-invert max-w-none">
              <div className="whitespace-pre-wrap text-sm sm:text-base text-gray-700 dark:text-gray-300">
                {safetyGuide}
              </div>
            </div>
          )}
        </div>

        {/* Quick Tips - Mobile only */}
        <div className="card lg:hidden">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Quick Tips
          </h3>
          <div className="space-y-3">
            {(quickTips[selectedDisaster] || []).map((tip, index) => (
              <div key={index} className="flex items-start space-x-3">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  {tip}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Fixed Right Sidebar - Emergency Kit (Desktop only, Instructions page only) */}
      <div className="hidden lg:block fixed right-0 top-16 h-[calc(100vh-4rem)] w-80 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 overflow-y-auto z-30">
        <div className="p-6 space-y-6">
          {/* Quick Tips */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Quick Tips
            </h3>
            <div className="space-y-3">
              {(quickTips[selectedDisaster] || []).map((tip, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {tip}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Emergency Kit Essentials */}
          <div className="card bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
            <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-200 mb-4">
              {t.kitTitle}
            </h3>
            <div className="grid grid-cols-1 gap-2">
              {t.kitItems.map((item, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input 
                    type="checkbox" 
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-blue-700 dark:text-blue-300">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  )
}

export default Instructions
