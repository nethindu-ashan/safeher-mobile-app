import * as Location from "expo-location";
import { apiRequest } from "./apiClient";

export async function getCurrentLocation() {
  const { status } =
    await Location.requestForegroundPermissionsAsync();

  if (status !== "granted") {
    throw new Error(
      "Location permission was not granted."
    );
  }

  const location =
    await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });

  return {
    latitude: location.coords.latitude,
    longitude: location.coords.longitude,
  };
}

export async function updateMyLocation() {
  const location = await getCurrentLocation();

  return await apiRequest("/api/users/me", {
    method: "PATCH",
    body: JSON.stringify(location),
  });
}