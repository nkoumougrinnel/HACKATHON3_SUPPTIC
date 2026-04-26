import { AlertTriangle } from "lucide-react";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { BottomSheet } from "../components/ui/BottomSheet";
import { ConstraintCard } from "../components/ui/ConstraintCard";
import { MapView } from "../components/ui/MapView";
import { RouteCard } from "../components/ui/RouteCard";
import { SkeletonLoader } from "../components/ui/SkeletonLoader";
import { useRouting } from "../hooks/useRouting";
import { useTraffic } from "../hooks/useTraffic";
import { useAlertStore } from "../store/alertStore";
import { useRouteStore } from "../store/routeStore";
import { useUserStore } from "../store/userStore";
import { getTypeTheme } from "../lib/utils";

export const ActiveRouteScreen = () => {
  const navigate = useNavigate();
  const userType = useUserStore((s) => s.userType ?? "ambulance");
  const theme = getTypeTheme(userType);
  const route = useRouteStore((s) => s.activeRoute);
  const clearRoute = useRouteStore((s) => s.clearRoute);
  const setComputedRoute = useRouteStore((s) => s.setComputedRoute);
  const alerts = useAlertStore((s) => s.alerts);
  useTraffic();

  const { primary, fallback } = useRouting(userType, route?.origin ?? null, route?.destination ?? null, alerts);

  useMemo(() => {
    if (!primary) return;
    setComputedRoute(primary.segments, primary.etaMinutes, primary.distanceKm, fallback?.segments ?? null);
  }, [fallback?.segments, primary, setComputedRoute]);

  if (!route) {
    return (
      <main className="screen bg-songo-mapDark p-4">
        <SkeletonLoader className="h-40 w-full" />
      </main>
    );
  }

  const routePoints: [number, number][] = [route.origin, route.destination];

  const hasTrafficAlert = alerts.length > 0;
  return (
    <main className="screen relative bg-songo-mapDark">
      <div className="h-[55%]">
        <MapView center={route.origin} origin={route.origin} destination={route.destination} route={routePoints} />
      </div>
      <div className="absolute left-3 top-3 z-[600] space-y-2">
        {hasTrafficAlert && (
          <div className="inline-flex items-center gap-1 rounded-full bg-songo-warning px-3 py-1 text-xs text-white">
            <AlertTriangle size={12} /> Alerte trafic
          </div>
        )}
        <div className="inline-flex items-center gap-1 rounded-full bg-songo-danger px-3 py-1 text-xs text-white">Priorite urgence active</div>
      </div>
      <BottomSheet className="h-[45%]">
        <RouteCard destinationLabel={route.destinationLabel} etaMinutes={route.etaMinutes} distanceKm={route.distanceKm} color={theme.color} />
        <div className="mt-3">
          <ConstraintCard type={userType} text="Recalcul toutes les 30s selon trafic, blocages et priorites vehicule." />
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2">
          <button onClick={() => { clearRoute(); navigate("/map"); }} className="btn-primary bg-slate-200 text-slate-700">
            Annuler
          </button>
          <button onClick={() => navigate("/map")} className="btn-primary text-white" style={{ background: theme.color }}>
            Demarrer
          </button>
        </div>
      </BottomSheet>
    </main>
  );
};
