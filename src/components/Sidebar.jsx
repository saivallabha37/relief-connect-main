import React from 'react'
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
  X
} from 'lucide-react'

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation()

  const navigation = [
    { name: 'Home', href: '/', icon: Home },
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

      {/* The main sidebar container.
        - On mobile (<lg): It's a 'fixed' panel that slides in from the left.
        - On desktop (>=lg): It's a 'sticky' panel that stays fixed to the left of the screen.
        - h-screen ensures it always takes up the full height of the viewport.
        - flex flex-col allows the navigation area to scroll if it overflows.
      */}
      <div className={`
        w-64 bg-white dark:bg-gray-800 shadow-lg flex flex-col h-screen
        fixed top-0 left-0 z-50 transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:fixed lg:top-0 lg:left-0 lg:transform-none lg:z-40 lg:flex-shrink-0
      `}>
        {/* Mobile-only header with close button */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 lg:hidden flex-shrink-0">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Menu</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Desktop-only header/logo area */}
        <div className="hidden lg:flex items-center p-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">ReliefConnect</h2>
        </div>

        {/* Navigation links container */}
        <nav className="flex-1 overflow-y-auto py-4">
          <div className="px-4 space-y-2">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={onClose} // Closes sidebar on mobile after clicking a link
                  className={`
                    flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200
                    ${isActive 
                      ? 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300' 
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
