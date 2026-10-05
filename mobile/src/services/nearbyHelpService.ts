import { apiRequest } from "./apiClient";

import type {
  NearbyHelpCategory,
  NearbyHelpDetailsResponse,
  NearbyHelpResponse,
} from "../types/nearbyHelp";

export async function getNearbyHelpServices(
  latitude: number,
  longitude: number,
  category: NearbyHelpCategory,
  radius = 5000
): Promise<NearbyHelpResponse> {
  const params = new URLSearchParams({
    lat: String(latitude),
    lng: String(longitude),
    type: category,
    radius: String(radius),
  });

  const response = (await apiRequest(
    `/api/support/nearby?${params.toString()}`
  )) as NearbyHelpResponse;

  if (!response.success || !Array.isArray(response.data)) {
    throw new Error("Nearby services response was invalid.");
  }

  return response;
}

export async function getNearbyHelpDetails(
  placeId: string,
  latitude?: number,
  longitude?: number
): Promise<NearbyHelpDetailsResponse> {
  if (!placeId.trim()) {
    throw new Error("Support service ID is missing.");
  }

  const query =
    typeof latitude === "number" &&
    typeof longitude === "number"
      ? `?${new URLSearchParams({
          lat: String(latitude),
          lng: String(longitude),
        }).toString()}`
      : "";

  return apiRequest(
    `/api/support/place/${encodeURIComponent(placeId)}${query}`
  ) as Promise<NearbyHelpDetailsResponse>;
}