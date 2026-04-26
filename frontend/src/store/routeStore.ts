import { create } from "zustand";
import type { Alert, RouteState, Segment } from "../types";

interface RouteStoreState {
  activeRoute: RouteState | null;
  mapState: {
    center: [number, number];
    zoom: number;
  };
  setDestination: (payload: {
    destination: [number, number];
    destinationLabel: string;
    origin: [number, number];
  }) => void;
  setComputedRoute: (segments: Segment[], etaMinutes: number, distanceKm: number, fallbackRoute: Segment[] | null) => void;
  setActiveAlerts: (alerts: Alert[]) => void;
  recalcRouteWithFallback: (segments: Segment[], etaMinutes: number, fallback: Segment[] | null) => void;
  clearRoute: () => void;
  setMapState: (center: [number, number], zoom: number) => void;
}

export const useRouteStore = create<RouteStoreState>((set) => ({
  activeRoute: null,
  mapState: { center: [4.058, 9.725], zoom: 14 },
  setDestination: ({ destination, destinationLabel, origin }) =>
    set({
      activeRoute: {
        origin,
        destination,
        destinationLabel,
        segments: [],
        etaMinutes: 0,
        distanceKm: 0,
        activeAlerts: [],
        fallbackRoute: null,
        lastRecalcAt: new Date(),
      },
    }),
  setComputedRoute: (segments, etaMinutes, distanceKm, fallbackRoute) =>
    set((state) => {
      if (!state.activeRoute) return state;
      return {
        activeRoute: {
          ...state.activeRoute,
          segments,
          etaMinutes,
          distanceKm,
          fallbackRoute,
          lastRecalcAt: new Date(),
        },
      };
    }),
  setActiveAlerts: (alerts) =>
    set((state) => {
      if (!state.activeRoute) return state;
      return { activeRoute: { ...state.activeRoute, activeAlerts: alerts } };
    }),
  recalcRouteWithFallback: (segments, etaMinutes, fallback) =>
    set((state) => {
      if (!state.activeRoute) return state;
      return {
        activeRoute: {
          ...state.activeRoute,
          segments,
          etaMinutes,
          fallbackRoute: fallback,
          lastRecalcAt: new Date(),
        },
      };
    }),
  clearRoute: () => set({ activeRoute: null }),
  setMapState: (center, zoom) => set({ mapState: { center, zoom } }),
}));
