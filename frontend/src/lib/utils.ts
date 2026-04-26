import type { UserType } from "../types";

export const userTheme = {
  police: { color: "#378ADD", bg: "#F0F5FC", text: "#0C447C", label: "Police" },
  ambulance: { color: "#E24B4A", bg: "#FEF0F0", text: "#791F1F", label: "Ambulance" },
  pompiers: { color: "#EF9F27", bg: "#FFFBF0", text: "#633806", label: "Pompiers" },
} as const;

export const getTypeTheme = (type: UserType) => userTheme[type];

export const cx = (...classes: Array<string | false | null | undefined>) =>
  classes.filter(Boolean).join(" ");
