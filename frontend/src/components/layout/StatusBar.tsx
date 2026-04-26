import { format } from "date-fns";
import { BatteryMedium, Signal } from "lucide-react";

export const StatusBar = ({ dark = false }: { dark?: boolean }) => (
  <div className="flex items-center justify-between px-4 py-3">
    <span className={`text-xs ${dark ? "text-white" : "text-slate-700"}`}>{format(new Date(), "HH:mm")}</span>
    <div className={`flex items-center gap-2 ${dark ? "text-white" : "text-slate-700"}`}>
      <Signal size={14} />
      <BatteryMedium size={14} />
    </div>
  </div>
);
