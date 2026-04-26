import { ChevronRight, Shield, Truck, Stethoscope } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { StatusBar } from "../components/layout/StatusBar";
import type { UserType } from "../types";
import { useUserStore } from "../store/userStore";
import { getTypeTheme } from "../lib/utils";

const options: Array<{ type: UserType; title: string; description: string; icon: typeof Shield }> = [
  { type: "police", title: "Police", description: "Acces zones securisees et commissariats", icon: Shield },
  { type: "ambulance", title: "Ambulance", description: "Priorite trauma et hopitaux disponibles", icon: Stethoscope },
  { type: "pompiers", title: "Pompiers", description: "Axes larges et interventions incendie", icon: Truck },
];

export const TypeSelectScreen = () => {
  const navigate = useNavigate();
  const setUserType = useUserStore((s) => s.setUserType);
  return (
    <main className="screen bg-white">
      <StatusBar />
      <div className="px-4">
        <h1 className="text-[22px] font-medium text-slate-900">Je suis...</h1>
        <div className="mt-5 space-y-3">
          {options.map((o) => {
            const theme = getTypeTheme(o.type);
            const Icon = o.icon;
            return (
              <button
                key={o.type}
                onClick={() => {
                  setUserType(o.type);
                  navigate("/register");
                }}
                className="flex min-h-11 w-full items-center gap-3 rounded-songoCard border p-4 text-left active:scale-95 active:opacity-80"
                style={{ borderColor: theme.color, background: theme.bg }}
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl" style={{ background: theme.color }}>
                  <Icon size={22} color="white" />
                </div>
                <div className="flex-1">
                  <p className="text-base font-medium" style={{ color: theme.text }}>
                    {o.title}
                  </p>
                  <p className="text-sm text-slate-600">{o.description}</p>
                </div>
                <ChevronRight size={18} style={{ color: theme.color }} />
              </button>
            );
          })}
        </div>
      </div>
    </main>
  );
};
