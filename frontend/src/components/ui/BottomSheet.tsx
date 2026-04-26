import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
  className?: string;
}

export const BottomSheet = ({ children, className = "" }: Props) => (
  <div className={`absolute bottom-0 left-0 right-0 rounded-t-songoSheet bg-white px-4 pb-6 pt-3 shadow-2xl ${className}`}>
    <div className="mx-auto mb-3 h-1 w-9 rounded-full bg-slate-300" />
    {children}
  </div>
);
