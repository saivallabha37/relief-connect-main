import React, { useEffect, useRef } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

// Fix default marker icon issue with webpack / Vite
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

const AutoFit = ({ points, userLocation }) => {
  const map = useMap()
  useEffect(() => {
    const pts = points
      .filter(p => p.lat && p.lng)
      .map(p => [p.lat, p.lng])
    if (userLocation && userLocation.lat && userLocation.lng) {
      map.setView([userLocation.lat, userLocation.lng], 11)
    } else if (pts.length === 1) {
      map.setView(pts[0], 11)
    } else if (pts.length > 1) {
      map.fitBounds(pts)
    }
  }, [points, userLocation, map])
  return null
}

const AlertsMap = ({ alerts, userLocation }) => {
  const points = alerts.filter(a => a.lat && a.lng)
  const center = (userLocation && userLocation.lat && userLocation.lng)
    ? [userLocation.lat, userLocation.lng]
    : (points[0] ? [points[0].lat, points[0].lng] : [20.5937, 78.9629])

  return (
    <div className="h-80 w-full rounded-lg overflow-hidden">
      <MapContainer center={center} zoom={6} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <AutoFit points={points} userLocation={userLocation} />
        {points.map((alert) => (
          <Marker key={alert.id} position={[alert.lat, alert.lng]}>
            <Popup>
              <div className="text-sm">
                <div className="font-semibold">{alert.title}</div>
                <div className="text-xs text-neutral-600">{alert.location}</div>
                <div className="mt-1">{alert.description}</div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  )
}

export default AlertsMap
