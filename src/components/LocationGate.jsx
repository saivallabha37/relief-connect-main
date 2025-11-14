import React, { useEffect, useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import LocationPrompt from './LocationPrompt'

const LocationGate = () => {
  const { user, shouldPromptLocation, setShouldPromptLocation, saveUserLocation } = useAuth()
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (user && shouldPromptLocation) {
      setShow(true)
    }
  }, [user, shouldPromptLocation])

  const handleClose = () => {
    setShow(false)
    setShouldPromptLocation(false)
  }

  if (!show) return null

  return (
    <LocationPrompt
      onClose={handleClose}
      onSetLocation={saveUserLocation}
    />
  )
}

export default LocationGate



