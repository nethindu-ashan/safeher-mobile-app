import * as Location from "expo-location";
import { useCallback, useEffect, useState } from "react";

export type DeviceLocation = {
  latitude: number;
  longitude: number;
};

export function useLocation() {
  const [location, setLocation] =
    useState<DeviceLocation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadLocation = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const permission =
        await Location.requestForegroundPermissionsAsync();

      if (permission.status !== "granted") {
        throw new Error(
          "Location permission is required to find nearby help."
        );
      }

      const currentLocation =
        await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });

      setLocation({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
      });
    } catch (caughtError) {
      console.error("Nearby Help location error:", caughtError);
      setLocation(null);
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Unable to get your current location."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadLocation();
  }, [loadLocation]);

  return {
    location,
    loading,
    error,
    reload: loadLocation,
  };
}