import React from 'react'
import { Heart, Shield, Users, Globe, Mail, Phone, MapPin } from 'lucide-react'

const About = () => {
  const team = [
    {
      name: 'Dr. A. Sharma',
      role: 'Emergency Response Director',
      bio: 'Former NDRF coordinator with 15+ years in disaster management',
      image: '👩‍⚕'
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

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-neutral-900 dark:text-white mb-4">
          About ReliefConnect India
        </h1>
        <p className="text-xl text-neutral-600 dark:text-neutral-400 max-w-3xl mx-auto">
          We are dedicated to providing comprehensive disaster response solutions that connect communities, 
          volunteers, and resources to save lives and support recovery efforts worldwide.
        </p>
      </div>

      {/* Mission Statement */}
      <div className="card">
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
            <div key={index} className="card text-center">
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

      {/* (Original 'Our Team' and 'Our Impact' sections removed per request) */}

      {/* Team Members (cards) */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-neutral-900 dark:text-white text-center mb-6">HopeHackers</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="card text-center">
            <div className="text-4xl mb-3">👑</div>
            <p className="font-bold text-lg text-neutral-900 dark:text-white">SAI VALLABHA</p>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">Team ID: INVX1-HT-C3D2</p>
            <p className="text-xs text-neutral-600 dark:text-neutral-400">Roll: 1602-24-737-149 • Class: 2-C</p>
          </div>

          <div className="card text-center">
            <div className="text-4xl mb-3">👤</div>
            <p className="font-bold text-lg text-neutral-900 dark:text-white">ROHAN</p>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1">Roll: 1602-24-737-160 • Class: 2-C</p>
          </div>

          <div className="card text-center">
            <div className="text-4xl mb-3">👤</div>
            <p className="font-bold text-lg text-neutral-900 dark:text-white">NISHANTH</p>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1">Roll: 1602-24-737-158 • Class: 2-C</p>
          </div>

          <div className="card text-center">
            <div className="text-4xl mb-3">👤</div>
            <p className="font-bold text-lg text-neutral-900 dark:text-white">REVANTH</p>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1">Roll: 1602-24-737-159 • Class: 2-C</p>
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