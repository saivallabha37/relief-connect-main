import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import Header from './components/Header'
import Sidebar from './components/Sidebar'
import EmergencyButton from './components/EmergencyButton'
import Toast from './components/Toast'
import Home from './pages/Home'
import LostAndFound from './pages/LostAndFound'
import Instructions from './pages/Instructions'
import Donations from './pages/Donations'
import AIAssistant from './pages/AIAssistant'
import Feedback from './pages/Feedback'
import About from './pages/About'
import LiveUpdates from './pages/LiveUpdates'
import ResearchCenter from './pages/ResearchCenter'
import Login from './pages/Login'
import ReportIncident from './pages/ReportIncident'
import { ThemeProvider } from './contexts/ThemeContext'
import { AuthProvider } from './contexts/AuthContext'
import { DatabaseProvider } from './contexts/DatabaseContext'
import { LanguageProvider } from './contexts/LanguageContext'
import LocationGate from './components/LocationGate'

function ScrollToTop() {
  const location = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [location.pathname])
  return null
}

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <ThemeProvider>
      <AuthProvider>
        <DatabaseProvider>
        <LanguageProvider>
        <Router>
          <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
            <ScrollToTop />
            <Toast />
            
            <div className="flex">
              <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
              
              <main className="flex-1 lg:ml-64 transition-all duration-300 pt-16">
                <div className="p-4 lg:p-8">
                  <Routes>
                    <Route path="/" element={<div className="max-w-5xl mx-auto"><Home /></div>} />
                    <Route path="/lost-found" element={<div className="max-w-5xl mx-auto"><LostAndFound /></div>} />
                    <Route path="/instructions" element={<Instructions />} />
                    <Route path="/donations" element={<div className="max-w-5xl mx-auto"><Donations /></div>} />
                    <Route path="/ai-assistant" element={<div className="max-w-5xl mx-auto"><AIAssistant /></div>} />
                    <Route path="/report-incident" element={<div className="max-w-5xl mx-auto"><ReportIncident /></div>} />
                    <Route path="/feedback" element={<div className="max-w-5xl mx-auto"><Feedback /></div>} />
                    <Route path="/about" element={<div className="max-w-5xl mx-auto"><About /></div>} />
                    <Route path="/login" element={<div className="max-w-5xl mx-auto"><Login /></div>} />
                    <Route path="/live-updates" element={<div className="max-w-5xl mx-auto"><LiveUpdates /></div>} />
                    <Route path="/research" element={<div className="max-w-5xl mx-auto"><ResearchCenter /></div>} />
                  </Routes>
                </div>
              </main>
            </div>
            
            <EmergencyButton />
            <LocationGate />
          </div>
        </Router>
        </LanguageProvider>
        </DatabaseProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
