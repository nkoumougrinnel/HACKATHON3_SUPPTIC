import { getTypeTheme } from "../../lib/utils";
import type { UserType } from "../../types";

interface Props {
  type: UserType;
}

export const TypeBadge = ({ type }: Props) => {
  const theme = getTypeTheme(type);
  return (
    <div className="inline-flex min-h-11 items-center gap-2 rounded-full border px-3 py-2" style={{ background: theme.bg, borderColor: theme.color }}>
      <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: theme.color }} />
      <span className="text-sm font-medium" style={{ color: theme.text }}>
        {theme.label}
      </span>
    </div>
  );
};
