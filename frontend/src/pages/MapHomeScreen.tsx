import { Menu, Search, UserRound } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { BottomSheet } from "../components/ui/BottomSheet";
import { MapView } from "../components/ui/MapView";
import { useUserStore } from "../store/userStore";
import { getTypeTheme } from "../lib/utils";
import { useGeolocation } from "../hooks/useGeolocation";
import { useRouteStore } from "../store/routeStore";

export const MapHomeScreen = () => {
  const navigate = useNavigate();
  const type = useUserStore((s) => s.userType ?? "ambulance");
  const theme = getTypeTheme(type);
  const { position } = useGeolocation();
  const setDestination = useRouteStore((s) => s.setDestination);

  const quickDestinations = [
    { label: "CHU Laquintinie", coords: [4.0435, 9.6925] as [number, number] },
    { label: "Commissariat Central", coords: [4.055, 9.705] as [number, number] },
  ];

  return (
    <main className="screen relative bg-songo-mapDark">
      <MapView center={position} origin={position} />
      <div className="absolute left-0 right-0 top-0 flex items-center justify-between p-4">
        <button className="icon-btn bg-black/50 text-white">
          <Menu size={18} />
        </button>
        <button className="icon-btn text-white" style={{ background: theme.color }}>
          <UserRound size={18} />
        </button>
      </div>

      <div className="pointer-events-none absolute left-1/2 top-1/2 z-[600] -translate-x-1/2 -translate-y-full">
        <div className="h-7 w-7 rounded-full border-2 border-white bg-songo-danger shadow-xl" />
      </div>

      <BottomSheet>
        <button onClick={() => navigate("/destination")} className="flex min-h-11 w-full items-center gap-2 rounded-songoInput bg-slate-100 px-3 active:scale-95 active:opacity-80">
          <Search size={16} className="text-slate-500" />
          <span className="text-sm text-slate-600">Ou aller ?</span>
        </button>
        <div className="mt-3 grid grid-cols-2 gap-2">
          {quickDestinations.map((d) => (
            <button
              key={d.label}
              onClick={() => {
                setDestination({ origin: position, destination: d.coords, destinationLabel: d.label });
                navigate("/route");
              }}
              className="min-h-11 rounded-songoCard bg-slate-100 p-3 text-left active:scale-95 active:opacity-80"
            >
              <p className="text-xs text-slate-500">Recent</p>
              <p className="text-sm font-medium text-slate-800">{d.label}</p>
            </button>
          ))}
        </div>
      </BottomSheet>
    </main>
  );
};
