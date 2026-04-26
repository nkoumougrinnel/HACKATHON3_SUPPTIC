import type { UserType, VehicleConstraints } from "../../types";

export const constraintsByType: Record<UserType, VehicleConstraints> = {
  police: {
    maxWeightTons: 3.5,
    maxHeightM: 2.5,
    canCrossFloodedRoad: false,
    hasHospitalPriority: false,
    hasTrafficLightOverride: true,
    allowedRoadTypes: ["urban", "arterial", "secure"],
    avoidNightAxes: true,
  },
  ambulance: {
    maxWeightTons: 5,
    maxHeightM: 3,
    canCrossFloodedRoad: false,
    hasHospitalPriority: true,
    hasTrafficLightOverride: true,
    allowedRoadTypes: ["urban", "arterial", "piste", "hospital"],
    avoidNightAxes: false,
  },
  pompiers: {
    maxWeightTons: 15,
    maxHeightM: 4,
    canCrossFloodedRoad: true,
    hasHospitalPriority: false,
    hasTrafficLightOverride: true,
    allowedRoadTypes: ["urban", "arterial", "fire"],
    avoidNightAxes: false,
    minRoadWidthM: 4,
  },
};
