import type { Graph } from "../../types";

export const mockGraph: Graph = {
  nodes: [
    { id: "n1", label: "Bepanda", lat: 4.058, lng: 9.725 },
    { id: "n2", label: "CHU Laquintinie", lat: 4.0435, lng: 9.6925, kind: "hospital", traumaCapacity: true },
    { id: "n3", label: "General Hospital", lat: 4.061, lng: 9.702, kind: "hospital", traumaCapacity: true },
    { id: "n4", label: "Commissariat Central", lat: 4.055, lng: 9.705, kind: "commissariat" },
    { id: "n5", label: "Caserne Bonanjo", lat: 4.049, lng: 9.684, kind: "station" },
  ],
  segments: [
    { id: "s1", from: "n1", to: "n2", distanceKm: 2.4, baseTimeMin: 9, trafficMultiplier: 1.1, roadType: "urban", maxWeightTons: 8, maxHeightM: 3.2, widthM: 5 },
    { id: "s2", from: "n1", to: "n3", distanceKm: 2.1, baseTimeMin: 8, trafficMultiplier: 1.3, roadType: "urban", maxWeightTons: 6, maxHeightM: 3, flooded: false, widthM: 4.2 },
    { id: "s3", from: "n3", to: "n2", distanceKm: 1.8, baseTimeMin: 6, trafficMultiplier: 1.1, roadType: "piste", maxWeightTons: 5, maxHeightM: 3, flooded: false, widthM: 3.6 },
    { id: "s4", from: "n1", to: "n4", distanceKm: 3.1, baseTimeMin: 12, trafficMultiplier: 1.05, roadType: "secure", secureOnly: true, maxWeightTons: 4, maxHeightM: 2.8, widthM: 4.3 },
    { id: "s5", from: "n1", to: "n5", distanceKm: 3.5, baseTimeMin: 13, trafficMultiplier: 1.2, roadType: "arterial", bridgeType: "old", maxWeightTons: 20, maxHeightM: 5, widthM: 4.5, isNightRisk: true },
    { id: "s6", from: "n5", to: "n2", distanceKm: 2.8, baseTimeMin: 10, trafficMultiplier: 1.2, roadType: "arterial", maxWeightTons: 20, maxHeightM: 5, widthM: 4.6 },
  ],
};
