export type UserType = "police" | "ambulance" | "pompiers";

export interface UserProfile {
  type: UserType;
  name: string;
  matricule: string;
  phone: string;
  vehicle: string;
  pin: string;
}

export interface VehicleConstraints {
  maxWeightTons: number;
  maxHeightM: number;
  canCrossFloodedRoad: boolean;
  hasHospitalPriority: boolean;
  hasTrafficLightOverride: boolean;
  allowedRoadTypes: string[];
  avoidNightAxes: boolean;
  minRoadWidthM?: number;
}

export interface Alert {
  id: string;
  type: "blocked" | "flooded" | "accident" | "hospital_full";
  segmentId: string;
  reportedAt: Date;
  sourceReliability: number;
  confirmed: boolean;
}

export type NodeId = string;

export interface Node {
  id: NodeId;
  label: string;
  lat: number;
  lng: number;
  kind?: "hospital" | "station" | "tribunal" | "fire_zone" | "hydrant" | "commissariat";
  traumaCapacity?: boolean;
}

export interface Segment {
  id: string;
  from: NodeId;
  to: NodeId;
  distanceKm: number;
  baseTimeMin: number;
  trafficMultiplier: number;
  roadType: string;
  maxWeightTons?: number;
  maxHeightM?: number;
  widthM?: number;
  flooded?: boolean;
  secureOnly?: boolean;
  bridgeType?: "old" | "new";
  isNightRisk?: boolean;
}

export interface Graph {
  nodes: Node[];
  segments: Segment[];
}

export interface Path {
  nodeIds: NodeId[];
  segments: Segment[];
  etaMinutes: number;
  distanceKm: number;
}

export interface RouteState {
  origin: [number, number];
  destination: [number, number];
  destinationLabel: string;
  segments: Segment[];
  etaMinutes: number;
  distanceKm: number;
  activeAlerts: Alert[];
  fallbackRoute: Segment[] | null;
  lastRecalcAt: Date;
}
