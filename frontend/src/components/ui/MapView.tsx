import { useEffect } from "react";
import { MapContainer, Marker, Polyline, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

delete (L.Icon.Default.prototype as { _getIconUrl?: unknown })._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

const FlyTo = ({ center }: { center: [number, number] }) => {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, map.getZoom(), { duration: 0.5 });
  }, [center, map]);
  return null;
};

interface Props {
  center: [number, number];
  route?: [number, number][];
  origin?: [number, number];
  destination?: [number, number];
  className?: string;
}

export const MapView = ({ center, route, origin, destination, className = "h-full w-full" }: Props) => (
  <MapContainer center={center} zoom={14} zoomControl={false} className={className}>
    <TileLayer
      url="https://cartodb-basemaps-a.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png"
      attribution="&copy; OpenStreetMap &copy; CartoDB"
    />
    <FlyTo center={center} />
    {origin && <Marker position={origin} />}
    {destination && <Marker position={destination} />}
    {route && route.length > 1 && <Polyline positions={route} pathOptions={{ color: "#E24B4A", weight: 5 }} />}
  </MapContainer>
);
