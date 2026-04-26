import { Ambulance, Flame, Shield, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { BottomSheet } from "../components/ui/BottomSheet";
import { MapView } from "../components/ui/MapView";
import { useGeolocation } from "../hooks/useGeolocation";
import { useRouteStore } from "../store/routeStore";
import { useUserStore } from "../store/userStore";

const suggestions = [
  { label: "CHU Laquintinie", type: "hospital", eta: 9, distance: 2.4, coords: [4.0435, 9.6925] as [number, number] },
  { label: "Commissariat Central", type: "commissariat", eta: 12, distance: 3.1, coords: [4.055, 9.705] as [number, number] },
  { label: "Caserne Bonanjo", type: "caserne", eta: 10, distance: 2.9, coords: [4.049, 9.684] as [number, number] },
];

const iconFor = (type: string) => {
  if (type === "hospital") return <Ambulance size={16} className="text-songo-danger" />;
  if (type === "caserne") return <Flame size={16} className="text-songo-warning" />;
  return <Shield size={16} className="text-songo-police" />;
};

export const DestinationScreen = () => {
  const navigate = useNavigate();
  const { position } = useGeolocation();
  const setDestination = useRouteStore((s) => s.setDestination);
  const userType = useUserStore((s) => s.userType);
  const filtered = suggestions.filter((s) => (userType === "ambulance" ? s.type !== "caserne" : true));

  return (
    <main className="screen relative bg-songo-mapDark">
      <div className="h-[40%]">
        <MapView center={position} origin={position} />
      </div>
      <BottomSheet className="top-[40%]">
        <div className="space-y-2">
          <div className="field-row border-songo-success">
            <MapPin size={14} className="text-songo-success" />
            <span className="text-sm text-slate-600">Depart: position GPS actuelle</span>
          </div>
          <label className="field-row">
            <MapPin size={14} className="text-songo-danger" />
            <input className="w-full bg-transparent text-sm outline-none" placeholder="Vers (recherche Nominatim OSM)" />
          </label>
        </div>
        <div className="mt-3 space-y-2">
          {filtered.map((s) => (
            <button
              key={s.label}
              onClick={() => {
                setDestination({ origin: position, destination: s.coords, destinationLabel: s.label });
                navigate("/route");
              }}
              className="flex min-h-11 w-full items-center gap-3 rounded-songoCard bg-slate-50 p-3 text-left active:scale-95 active:opacity-80"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white">{iconFor(s.type)}</div>
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-800">{s.label}</p>
                <p className="text-xs text-slate-500">{s.distance} km</p>
              </div>
              <span className="text-sm text-songo-success">{s.eta} min</span>
            </button>
          ))}
        </div>
      </BottomSheet>
    </main>
  );
};
