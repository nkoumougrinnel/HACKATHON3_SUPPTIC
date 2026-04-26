import { useState, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import './App.css'

// Fix pour les icônes Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
})

interface RouteResponse {
  path?: [number, number][]
  error?: string
}


type VehicleType = 'ambulance' | 'pompier' | 'police';

const VEHICLES = [
  { key: 'ambulance', label: 'Ambulance', color: '#E63946', icon: '🚑', desc: 'Vitesse, accès hôpitaux' },
  { key: 'pompier', label: 'Pompier', color: '#FF9C1C', icon: '🚒', desc: 'Zones incendie, hydrants' },
  { key: 'police', label: 'Police', color: '#1D4ED8', icon: '🚓', desc: 'Interception, zones à risque' },
];

function App() {
  const [vehicle, setVehicle] = useState<VehicleType>('ambulance');
  const [depart, setDepart] = useState('');
  const [destination, setDestination] = useState('');
  const [routePath, setRoutePath] = useState<[number, number][]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [departCoords, setDepartCoords] = useState<[number, number] | null>(null);
  const [destCoords, setDestCoords] = useState<[number, number] | null>(null);

  // Mobile-first: zoom plus proche
  const center: [number, number] = [3.8667, 11.5167];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setRoutePath([]);
    try {
      const parseCoord = (coord: string): [number, number] => {
        const parts = coord.split(',').map(s => parseFloat(s.trim()));
        if (parts.length !== 2 || isNaN(parts[0]) || isNaN(parts[1])) {
          throw new Error('Format invalide. Utiliser: lat,lng');
        }
        return [parts[0], parts[1]];
      };
      const start = parseCoord(depart);
      const end = parseCoord(destination);
      setDepartCoords(start);
      setDestCoords(end);
      const response = await fetch('http://localhost:8000/api/route/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ start, end, vehicle }),
      });
      const data: RouteResponse = await response.json();
      if (data.error) setError(data.error);
      else if (data.path) setRoutePath(data.path);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du calcul de l\'itinéraire');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="songo-app">
      <header className="songo-header">
        <h1 className="songo-title">Songo</h1>
        <p className="songo-baseline">Trouve l’itinéraire optimal pour les urgences</p>
      </header>

      <form className="songo-form" onSubmit={handleSubmit}>
        <div className="vehicle-select">
          {VEHICLES.map(v => (
            <button
              type="button"
              key={v.key}
              className={`vehicle-btn${vehicle === v.key ? ' selected' : ''}`}
              style={{ background: vehicle === v.key ? v.color : '#f5f5f5', color: vehicle === v.key ? '#fff' : v.color }}
              onClick={() => setVehicle(v.key as VehicleType)}
            >
              <span className="vehicle-icon">{v.icon}</span> {v.label}
            </button>
          ))}
        </div>
        <div className="form-group">
          <label htmlFor="depart">Départ</label>
          <input
            id="depart"
            type="text"
            value={depart}
            onChange={e => setDepart(e.target.value)}
            placeholder="lat, lng"
            required
            autoComplete="off"
          />
        </div>
        <div className="form-group">
          <label htmlFor="destination">Destination</label>
          <input
            id="destination"
            type="text"
            value={destination}
            onChange={e => setDestination(e.target.value)}
            placeholder="lat, lng"
            required
            autoComplete="off"
          />
        </div>
        <button className="songo-primary" type="submit" disabled={loading}>
          {loading ? 'Calcul en cours...' : 'Trouver l’itinéraire'}
        </button>
      </form>

      {error && <div className="songo-error">❌ {error}</div>}

      <div className="songo-map-container">
        <MapContainer center={center} zoom={14} scrollWheelZoom={true} style={{ height: '320px', width: '100%' }}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {departCoords && (
            <Marker position={departCoords}><Popup>Départ</Popup></Marker>
          )}
          {destCoords && (
            <Marker position={destCoords}><Popup>Destination</Popup></Marker>
          )}
          {routePath.length > 0 && (
            <Polyline
              positions={routePath}
              pathOptions={{ color: VEHICLES.find(v => v.key === vehicle)?.color || 'blue', weight: 5, opacity: 0.9 }}
            />
          )}
        </MapContainer>
      </div>

      {routePath.length > 0 && (
        <div className="songo-summary">
          <span className="songo-summary-icon">{VEHICLES.find(v => v.key === vehicle)?.icon}</span>
          <span>Itinéraire trouvé ({routePath.length} points)</span>
        </div>
      )}
    </div>
  );
}

export default App
