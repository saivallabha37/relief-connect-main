import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Heart, Shield, Users, Globe, Mail, Phone, MapPin } from 'lucide-react'
import useRevealOnScroll from '../hooks/useRevealOnScroll'

const About = () => {
  const team = [
    {
      name: 'Dr. A. Sharma',
      role: 'Emergency Response Director',
      bio: 'Former NDRF coordinator with 15+ years in disaster management',
      image: '👩‍⚕️'
    },
    {
      name: 'R. Kumar',
      role: 'Technology Lead',
      bio: 'AI specialist focused on humanitarian applications',
      image: '👨‍💻'
    },
    {
      name: 'S. Iyer',
      role: 'Community Outreach Manager',
      bio: 'Multilingual coordinator connecting diverse communities',
      image: '👩‍🤝‍👩'
    },
    {
      name: 'P. Singh',
      role: 'Operations Manager',
      bio: 'Logistics expert ensuring efficient resource distribution',
      image: '👨‍💼'
    }
  ]

  const values = [
    {
      icon: Heart,
      title: 'Compassion',
      description: 'We approach every situation with empathy and understanding for those affected by disasters.'
    },
    {
      icon: Shield,
      title: 'Safety First',
      description: 'The safety and well-being of individuals and communities is our top priority.'
    },
    {
      icon: Users,
      title: 'Community',
      description: 'We believe in the power of communities working together to overcome challenges.'
    },
    {
      icon: Globe,
      title: 'Global Impact',
      description: 'Our mission extends worldwide, helping communities regardless of location or circumstance.'
    }
  ]

  useRevealOnScroll()

  return (
    <div className="space-y-12 responsive-container">
      {/* Hero Section */}
      <div className="text-center reveal reveal-delay-1">
        <h1 className="text-4xl font-bold text-neutral-900 dark:text-white mb-4">
          About ReliefConnect India
        </h1>
        <p className="text-xl text-neutral-600 dark:text-neutral-400 max-w-3xl mx-auto">
          We are dedicated to providing comprehensive disaster response solutions that connect communities, 
          volunteers, and resources to save lives and support recovery efforts worldwide.
        </p>
      </div>

      {/* Mission Statement */}
      <div className="card reveal reveal-delay-2">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-4">Our Mission</h2>
          <p className="text-lg text-neutral-700 dark:text-neutral-300 max-w-4xl mx-auto leading-relaxed">
            To leverage technology and human compassion to ensure no community in India faces disaster alone. 
            We provide tools, resources, and connections to prepare for, respond to, and recover from crises with dignity and hope.
          </p>
        </div>
      </div>

      {/* Values */}
      <div>
        <h2 className="text-2xl font-bold text-neutral-900 dark:text-white text-center mb-8">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((value, index) => (
            <div key={index} className="card text-center reveal reveal-delay-2">
              <div className="bg-primary-100 dark:bg-primary-900 p-3 rounded-full w-fit mx-auto mb-4">
                <value.icon className="h-6 w-6 text-primary-600 dark:text-primary-400" />
              </div>
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-2">
                {value.title}
              </h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                {value.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Team */}
      <div>
        <h2 className="text-2xl font-bold text-neutral-900 dark:text-white text-center mb-8">Our Team</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {team.map((member, index) => (
            <div key={index} className="card text-center">
              <div className="text-4xl mb-4">{member.image}</div>
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-1">
                {member.name}
              </h3>
              <p className="text-sm text-primary-600 dark:text-primary-400 font-medium mb-2">
                {member.role}
              </p>
              <p className="text-xs text-neutral-600 dark:text-neutral-400">
                {member.bio}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Statistics */}
      <div className="card bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20">
        <h2 className="text-2xl font-bold text-neutral-900 dark:text-white text-center mb-8">Our Impact</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <div className="text-3xl font-bold text-primary-600 dark:text-primary-400 mb-1">28+</div>
            <div className="text-sm text-neutral-600 dark:text-neutral-400">States & UTs Served</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-primary-600 dark:text-primary-400 mb-1">1M+</div>
            <div className="text-sm text-neutral-600 dark:text-neutral-400">People Helped</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-primary-600 dark:text-primary-400 mb-1">10K+</div>
            <div className="text-sm text-neutral-600 dark:text-neutral-400">Active Volunteers</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-primary-600 dark:text-primary-400 mb-1">24/7</div>
            <div className="text-sm text-neutral-600 dark:text-neutral-400">Support Available</div>
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">Contact Us</h3>
          <div className="space-y-3">
            <div className="flex items-center">
              <Mail className="h-5 w-5 text-primary-600 dark:text-primary-400 mr-3" />
              <div>
                <p className="font-medium text-neutral-900 dark:text-white">Email</p>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">contact@humanitarianaid.org</p>
              </div>
            </div>
            <div className="flex items-center">
              <Phone className="h-5 w-5 text-primary-600 dark:text-primary-400 mr-3" />
              <div>
              <p className="font-medium text-neutral-900 dark:text-white">Emergency Hotline</p>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">112 (National)</p>
              </div>
            </div>
            <div className="flex items-center">
              <MapPin className="h-5 w-5 text-primary-600 dark:text-primary-400 mr-3" />
              <div>
                <p className="font-medium text-neutral-900 dark:text-white">Headquarters</p>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  12 Relief Avenue<br />
                  New Delhi, 110001
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">Get Involved</h3>
          <div className="space-y-4">
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              Join our mission to help communities in crisis. There are many ways to get involved:
            </p>
            <ul className="text-sm text-neutral-600 dark:text-neutral-400 space-y-2">
              <li>• Volunteer your time and skills</li>
              <li>• Make a donation to support our work</li>
              <li>• Spread awareness in your community</li>
              <li>• Partner with us as an organization</li>
              <li>• Provide feedback to improve our services</li>
            </ul>
            <div className="pt-2">
              <StartButton />
            </div>
          </div>
        </div>
      </div>

      {/* Legal Information */}
      <div className="card bg-neutral-50 dark:bg-neutral-800/50">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">Legal Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-neutral-600 dark:text-neutral-400">
            <div>
              <p className="font-medium text-neutral-900 dark:text-white mb-1">Registration</p>
              <p>Registered Non-Profit (India)</p>
              <p>CIN: U99999DL2025NPO000000</p>
            </div>
            <div>
              <p className="font-medium text-neutral-900 dark:text-white mb-1">Certifications</p>
              <p>NGO Darpan Registered</p>
              <p>CSR-1 Compliant</p>
            </div>
            <div>
              <p className="font-medium text-neutral-900 dark:text-white mb-1">Compliance</p>
              <p>IT Act & Data Protection compliant</p>
              <p>ISO 27001 aligned</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default About

function StartButton() {
  const navigate = useNavigate()
  const handleClick = () => {
    // Navigate to donations page and open volunteer tab
    navigate('/donations?tab=volunteer')
  }

  return (
    <button onClick={handleClick} className="btn-primary w-full">
      Start Helping Today
    </button>
  )
}
