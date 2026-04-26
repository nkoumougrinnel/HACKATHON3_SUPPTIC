import { MapPinned } from "lucide-react";

interface Props {
  destinationLabel: string;
  etaMinutes: number;
  distanceKm: number;
  color: string;
}

export const RouteCard = ({ destinationLabel, etaMinutes, distanceKm, color }: Props) => (
  <div className="rounded-songoCard bg-white p-4 shadow-lg">
    <div className="mb-2 flex items-center gap-2 text-sm text-slate-500">
      <MapPinned size={16} />
      <span>{destinationLabel}</span>
    </div>
    <div className="text-[28px] font-medium leading-none" style={{ color }}>
      {etaMinutes} min
    </div>
    <div className="mt-1 text-xs text-slate-500">{distanceKm.toFixed(1)} km</div>
  </div>
);
