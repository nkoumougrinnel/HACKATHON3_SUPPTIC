import type { Alert, Graph, NodeId, Path, Segment, VehicleConstraints } from "../../types";

const getNeighbors = (segments: Segment[], node: NodeId) =>
  segments.filter((s) => s.from === node || s.to === node);

const opposite = (segment: Segment, node: NodeId): NodeId =>
  segment.from === node ? segment.to : segment.from;

const alertPenalty = (segment: Segment, alerts: Alert[], constraints: VehicleConstraints): number => {
  const onSegment = alerts.filter((a) => a.segmentId === segment.id);
  for (const a of onSegment) {
    if (a.type === "blocked") {
      if (a.sourceReliability > 0.7) return Number.POSITIVE_INFINITY;
      if (a.sourceReliability >= 0.3) return 100;
    }
    if (a.type === "flooded" && !constraints.canCrossFloodedRoad) {
      return Number.POSITIVE_INFINITY;
    }
  }
  return 0;
};

const constraintPenalty = (segment: Segment, constraints: VehicleConstraints): number => {
  if (segment.flooded && !constraints.canCrossFloodedRoad) return Number.POSITIVE_INFINITY;
  if ((segment.maxWeightTons ?? Infinity) < constraints.maxWeightTons) return Number.POSITIVE_INFINITY;
  if ((segment.maxHeightM ?? Infinity) < constraints.maxHeightM) return Number.POSITIVE_INFINITY;
  if (!constraints.allowedRoadTypes.includes(segment.roadType)) return Number.POSITIVE_INFINITY;
  if (segment.isNightRisk && constraints.avoidNightAxes) return 200;
  if (constraints.minRoadWidthM && (segment.widthM ?? 0) < constraints.minRoadWidthM) return Number.POSITIVE_INFINITY;
  if (constraints.maxWeightTons >= 15 && segment.bridgeType === "old") return Number.POSITIVE_INFINITY;
  return 0;
};

const segmentWeight = (segment: Segment, constraints: VehicleConstraints, alerts: Alert[]): number => {
  const cPenalty = constraintPenalty(segment, constraints);
  if (!Number.isFinite(cPenalty)) return Number.POSITIVE_INFINITY;
  const aPenalty = alertPenalty(segment, alerts, constraints);
  if (!Number.isFinite(aPenalty)) return Number.POSITIVE_INFINITY;
  return segment.baseTimeMin * segment.trafficMultiplier + cPenalty + aPenalty;
};

export function findShortestPath(
  graph: Graph,
  origin: NodeId,
  destination: NodeId,
  constraints: VehicleConstraints,
  activeAlerts: Alert[],
): Path | null {
  const dist = new Map<NodeId, number>();
  const prev = new Map<NodeId, { node: NodeId; segment: Segment }>();
  const unvisited = new Set(graph.nodes.map((n) => n.id));
  graph.nodes.forEach((n) => dist.set(n.id, n.id === origin ? 0 : Infinity));

  while (unvisited.size > 0) {
    let current: NodeId | null = null;
    let min = Infinity;
    unvisited.forEach((n) => {
      const d = dist.get(n) ?? Infinity;
      if (d < min) {
        min = d;
        current = n;
      }
    });
    if (!current || !Number.isFinite(min)) break;
    if (current === destination) break;
    unvisited.delete(current);

    for (const seg of getNeighbors(graph.segments, current)) {
      const next = opposite(seg, current);
      if (!unvisited.has(next)) continue;
      const weight = segmentWeight(seg, constraints, activeAlerts);
      if (!Number.isFinite(weight)) continue;
      const alt = (dist.get(current) ?? Infinity) + weight;
      if (alt < (dist.get(next) ?? Infinity)) {
        dist.set(next, alt);
        prev.set(next, { node: current, segment: seg });
      }
    }
  }

  if (!Number.isFinite(dist.get(destination) ?? Infinity)) return null;
  const nodeIds: NodeId[] = [];
  const segments: Segment[] = [];
  let cursor: NodeId | undefined = destination;

  while (cursor) {
    nodeIds.unshift(cursor);
    const p = prev.get(cursor);
    if (!p) break;
    segments.unshift(p.segment);
    cursor = p.node;
  }

  const distanceKm = segments.reduce((sum, s) => sum + s.distanceKm, 0);
  const etaMinutes = Math.ceil(dist.get(destination) ?? 0);
  return { nodeIds, segments, etaMinutes, distanceKm };
}
