import React, { useEffect } from 'react'
import { Box } from '@mui/material'
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Custom red pin — avoids the classic "broken marker icon" issue that happens
// when bundlers (Vite/webpack) can't resolve Leaflet's default image assets.
const pinIcon = L.divIcon({
  className: '',
  html: `<svg width="34" height="46" viewBox="0 0 36 48" xmlns="http://www.w3.org/2000/svg">
    <path d="M18 0C8.06 0 0 8.06 0 18c0 13.5 18 30 18 30s18-16.5 18-30C36 8.06 27.94 0 18 0z" fill="#e0413f"/>
    <circle cx="18" cy="18" r="7" fill="#ffffff"/>
  </svg>`,
  iconSize: [34, 46],
  iconAnchor: [17, 46],
})

// Fallback map center before any pin is placed — adjust to your municipality.
const DEFAULT_CENTER = { lat: 16.1851, lng: 103.6547 }

function ClickToPick({ onPick }) {
  useMapEvents({
    click(e) {
      onPick({ lat: e.latlng.lat, lng: e.latlng.lng })
    },
  })
  return null
}

// Recenters the map only when `recenterTrigger` changes (e.g. after the GPS
// button succeeds) — NOT on every coords change, so it doesn't fight the user
// while they're manually dragging/clicking to fine-tune the pin.
function RecenterOnTrigger({ coords, recenterTrigger }) {
  const map = useMap()
  useEffect(() => {
    if (coords) map.setView([coords.lat, coords.lng], 17)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recenterTrigger])
  return null
}

export default function LocationPicker({ coords, onChange, recenterTrigger, height = 260 }) {
  const center = coords || DEFAULT_CENTER

  return (
    <Box sx={{ height, borderRadius: 3, overflow: 'hidden', border: '1px solid #e2e8f0' }}>
      <MapContainer
        center={[center.lat, center.lng]}
        zoom={coords ? 17 : 13}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <ClickToPick onPick={onChange} />
        <RecenterOnTrigger coords={coords} recenterTrigger={recenterTrigger} />
        {coords && (
          <Marker
            position={[coords.lat, coords.lng]}
            icon={pinIcon}
            draggable
            eventHandlers={{
              dragend: (e) => {
                const { lat, lng } = e.target.getLatLng()
                onChange({ lat, lng })
              },
            }}
          />
        )}
      </MapContainer>
    </Box>
  )
}