import { Compass, MapPinned, Route, UserRound } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import type { UserType } from "../../types";
import { getTypeTheme } from "../../lib/utils";

export const BottomNav = ({ userType }: { userType: UserType }) => {
  const { pathname } = useLocation();
  const theme = getTypeTheme(userType);
  const items = [
    { to: "/map", label: "Carte", icon: Compass },
    { to: "/destination", label: "Dest.", icon: MapPinned },
    { to: "/route", label: "Route", icon: Route },
    { to: "/login", label: "Profil", icon: UserRound },
  ];
  return (
    <nav className="fixed bottom-0 left-1/2 z-[1000] flex w-full max-w-[390px] -translate-x-1/2 border-t border-slate-200 bg-white px-2 py-2">
      {items.map((item) => {
        const active = pathname === item.to;
        const Icon = item.icon;
        return (
          <Link key={item.to} to={item.to} className="flex min-h-11 flex-1 flex-col items-center justify-center rounded-xl active:scale-95 active:opacity-80">
            <Icon size={18} style={{ color: active ? theme.color : "#888888" }} />
            <span className="mt-1 text-xs" style={{ color: active ? theme.color : "#888888" }}>
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
};
