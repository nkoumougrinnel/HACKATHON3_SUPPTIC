import { useMemo } from "react";
import { constraintsByType } from "../lib/routing/constraints";
import { findShortestPath } from "../lib/routing/dijkstra";
import { mockGraph } from "../lib/routing/graph";
import type { Alert, UserType } from "../types";

const nearestNode = (lat: number, lng: number) => {
  let nearest = mockGraph.nodes[0];
  let min = Infinity;
  for (const node of mockGraph.nodes) {
    const d = Math.hypot(node.lat - lat, node.lng - lng);
    if (d < min) {
      min = d;
      nearest = node;
    }
  }
  return nearest.id;
};

export const useRouting = (
  userType: UserType,
  origin: [number, number] | null,
  destination: [number, number] | null,
  alerts: Alert[],
) =>
  useMemo(() => {
    if (!origin || !destination) return { primary: null, fallback: null };
    const constraints = constraintsByType[userType];
    const from = nearestNode(origin[0], origin[1]);
    const to = nearestNode(destination[0], destination[1]);
    const primary = findShortestPath(mockGraph, from, to, constraints, alerts);
    const fallback = findShortestPath(
      mockGraph,
      from,
      to,
      constraints,
      alerts.filter((a) => a.sourceReliability > 0.7),
    );
    return { primary, fallback };
  }, [alerts, destination, origin, userType]);
