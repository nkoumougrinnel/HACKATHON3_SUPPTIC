import { useEffect, useState } from "react";

export const useGeolocation = () => {
  const [position, setPosition] = useState<[number, number]>([4.058, 9.725]);

  useEffect(() => {
    if (!navigator.geolocation) return;
    const watchId = navigator.geolocation.watchPosition(
      (p) => setPosition([p.coords.latitude, p.coords.longitude]),
      () => undefined,
      { enableHighAccuracy: true, maximumAge: 15_000, timeout: 8_000 },
    );
    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  return { position };
};
