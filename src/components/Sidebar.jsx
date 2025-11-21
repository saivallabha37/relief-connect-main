import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { 
  Home, 
  Search, 
  Shield, 
  Heart, 
  MessageCircle, 
  MessageSquare, 
  Info, 
  Radio,
  BookOpen,
  X,
  BarChart3
} from 'lucide-react'

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation()
  const [isHovered, setIsHovered] = useState(false)

  const navigation = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Dashboard', href: '/dashboard', icon: BarChart3 },
    { name: 'Lost & Found', href: '/lost-found', icon: Search },
    { name: 'Instructions & Safety', href: '/instructions', icon: Shield },
    { name: 'Donation & Volunteers', href: '/donations', icon: Heart },
    { name: 'AI Assistant', href: '/ai-assistant', icon: MessageCircle },
    { name: 'Feedback', href: '/feedback', icon: MessageSquare },
    { name: 'About / Contact', href: '/about', icon: Info },
    { name: 'Live Updates', href: '/live-updates', icon: Radio },
    { name: 'Research Center', href: '/research', icon: BookOpen },
  ]

  return (
    <>
      {/* Mobile overlay - darkens the background when the sidebar is open on small screens */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Desktop hover trigger area - invisible area at the left edge */}
      <div 
        className="hidden lg:block fixed top-0 left-0 w-4 h-screen z-40"
        onMouseEnter={() => setIsHovered(true)}
      />

      {/* Desktop hover-to-expand sidebar */}
      <div 
        className={`
          hidden lg:block fixed top-0 left-0 z-50 h-screen bg-white dark:bg-gray-800 shadow-lg
          transition-all duration-300 ease-in-out
          ${isHovered ? 'w-64' : 'w-16'}
        `}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Logo area */}
        <div className="flex items-center h-16 px-4 border-b border-gray-200 dark:border-gray-700">
          {isHovered ? (
            <h2 className="text-xl font-bold text-gray-900 dark:text-white whitespace-nowrap">
              ReliefConnect
            </h2>
          ) : (
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <Heart className="h-5 w-5 text-white" />
            </div>
          )}
        </div>

        {/* Navigation links */}
        <nav className="flex-1 overflow-y-auto py-4">
          <div className="px-2 space-y-2">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`
                    flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-all duration-200
                    ${isActive 
                      ? 'bg-primary-100 dark:bg-primary-900/50 text-primary-700 dark:text-primary-300' 
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }
                    ${isHovered ? 'justify-start' : 'justify-center'}
                  `}
                  title={!isHovered ? item.name : ''}
                >
                  <item.icon className={`h-5 w-5 ${isHovered ? 'mr-3' : ''}`} />
                  {isHovered && (
                    <span className="whitespace-nowrap overflow-hidden">
                      {item.name}
                    </span>
                  )}
                </Link>
              )
            })}
          </div>
        </nav>
      </div>

      {/* Mobile sidebar (original sliding behavior) */}
      <div className={`
        lg:hidden w-64 bg-white dark:bg-gray-800 shadow-lg flex flex-col h-screen
        fixed top-0 left-0 z-50 transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Mobile header with close button */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Menu</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Mobile navigation links */}
        <nav className="flex-1 overflow-y-auto py-4">
          <div className="px-4 space-y-2">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={onClose}
                  className={`
                    flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200
                    ${isActive 
                      ? 'bg-primary-100 dark:bg-primary-900/50 text-primary-700 dark:text-primary-300' 
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }
                  `}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              )
            })}
          </div>
        </nav>
      </div>
    </>
  )
}

export default Sidebar
