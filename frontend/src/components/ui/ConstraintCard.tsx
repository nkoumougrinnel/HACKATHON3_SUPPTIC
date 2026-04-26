import { AlertTriangle } from "lucide-react";
import { getTypeTheme } from "../../lib/utils";
import type { UserType } from "../../types";

export const ConstraintCard = ({ type, text }: { type: UserType; text: string }) => {
  const theme = getTypeTheme(type);
  return (
    <div className="flex items-start gap-3 rounded-songoCard border p-3" style={{ background: theme.bg, borderColor: theme.color }}>
      <AlertTriangle size={18} style={{ color: theme.color }} />
      <p className="text-sm text-slate-700">{text}</p>
    </div>
  );
};
