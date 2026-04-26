import { create } from "zustand";
import type { Alert } from "../types";

interface AlertStoreState {
  alerts: Alert[];
  setAlerts: (alerts: Alert[]) => void;
  upsertAlert: (alert: Alert) => void;
}

export const useAlertStore = create<AlertStoreState>((set) => ({
  alerts: [],
  setAlerts: (alerts) => set({ alerts }),
  upsertAlert: (alert) =>
    set((state) => {
      const existing = state.alerts.find((a) => a.id === alert.id);
      if (existing) {
        return { alerts: state.alerts.map((a) => (a.id === alert.id ? alert : a)) };
      }
      return { alerts: [...state.alerts, alert] };
    }),
}));
