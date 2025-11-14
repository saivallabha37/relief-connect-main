import React, { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [userLocation, setUserLocation] = useState(null)
  const [shouldPromptLocation, setShouldPromptLocation] = useState(false)

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    const storedLocation = localStorage.getItem('userLocation')
    if (storedLocation) {
      setUserLocation(JSON.parse(storedLocation))
    }
    setLoading(false)
  }, [])

  const login = async (email, password) => {
    // Mock login - in real app, this would call your auth API
    const mockUser = {
      id: 1,
      email,
      name: email.split('@')[0],
      role: 'volunteer'
    }
    setUser(mockUser)
    localStorage.setItem('user', JSON.stringify(mockUser))
    // After first login, if no location stored, trigger prompt
    if (!localStorage.getItem('userLocation')) {
      setShouldPromptLocation(true)
    }
    return mockUser
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('user')
  }

  const register = async (userData) => {
    // Mock registration
    const newUser = {
      id: Date.now(),
      ...userData,
      role: 'volunteer'
    }
    setUser(newUser)
    localStorage.setItem('user', JSON.stringify(newUser))
    if (!localStorage.getItem('userLocation')) {
      setShouldPromptLocation(true)
    }
    return newUser
  }

  const saveUserLocation = (location) => {
    setUserLocation(location)
    localStorage.setItem('userLocation', JSON.stringify(location))
    setShouldPromptLocation(false)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, register, loading, userLocation, saveUserLocation, shouldPromptLocation, setShouldPromptLocation }}>
      {children}
    </AuthContext.Provider>
  )
}
