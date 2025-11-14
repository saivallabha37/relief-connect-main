import React from 'react'
import { Menu, Sun, Moon, Heart } from 'lucide-react'
import { useTheme } from '../contexts/ThemeContext'
import { useAuth } from '../contexts/AuthContext'
import { useLanguage } from '../contexts/LanguageContext'
import { useNavigate } from 'react-router-dom'

const Header = ({ onMenuClick }) => {
  const { isDark, toggleTheme } = useTheme()
  const { user, logout } = useAuth()
  const { lang, setLang } = useLanguage()
  const navigate = useNavigate()

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <button
              onClick={onMenuClick}
              className="lg:hidden p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              aria-label="Open menu"
            >
              <Menu className="h-6 w-6" />
            </button>
            
            <div className="flex items-center ml-4 lg:ml-0 gap-2">
              <Heart className="h-8 w-8 text-primary-600 flex-shrink-0" />
              <div className="flex flex-col">
                <h1 className="text-lg font-bold text-gray-900 dark:text-white whitespace-nowrap">
                  ReliefConnect
                </h1>
                <p className="text-xs text-gray-600 dark:text-gray-400 whitespace-nowrap hidden sm:block">
                  Disaster Information & Relief Hub
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value)}
              className="hidden sm:block text-sm border border-gray-300 dark:border-gray-600 rounded-md px-2 py-1 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200"
              aria-label="Select language"
            >
              <option value="en">English</option>
              <option value="hi">हिन्दी</option>
              <option value="te">తెలుగు</option>
              <option value="kn">ಕನ್ನಡ</option>
              <option value="bn">বাংলা</option>
              <option value="ta">தமிழ்</option>
            </select>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              aria-label="Toggle theme"
            >
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>

            {user ? (
              <div className="flex items-center space-x-3">
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Welcome, {user.name}
                </span>
                <button
                  onClick={logout}
                  className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400"
                >
                  {useLanguage().t.header.logout}
                </button>
              </div>
            ) : (
              <button onClick={() => navigate('/login')} className="btn-primary text-sm">
                {useLanguage().t.header.signIn}
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
