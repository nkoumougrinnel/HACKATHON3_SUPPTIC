import { useEffect } from "react";
import { subSeconds } from "date-fns";
import { useAlertStore } from "../store/alertStore";
import type { Alert } from "../types";

const mockAlerts = (): Alert[] => [
  {
    id: "a-blocked-1",
    type: "blocked",
    segmentId: "s1",
    reportedAt: subSeconds(new Date(), 12),
    sourceReliability: 0.62,
    confirmed: true,
  },
];

export const useTraffic = () => {
  const setAlerts = useAlertStore((s) => s.setAlerts);

  useEffect(() => {
    const run = () => {
      setAlerts(mockAlerts());
    };
    run();
    const id = window.setInterval(run, 30_000);
    return () => window.clearInterval(id);
  }, [setAlerts]);
};
