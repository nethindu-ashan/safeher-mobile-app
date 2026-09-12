import { apiRequest } from "./apiClient";

export type RouteSafetyIncident = {
  id: string;
  category: string;
  latitude: number;
  longitude: number;
  incidentDatetime: string;
  description: string;
  status: string;
  distanceToRouteKm: number;
};

export type RouteSafetyResponse = {
  corridorKm: number;
  days: number;
  routePointCount: number;
  incidentCount: number;
  incidents: RouteSafetyIncident[];
  disclaimer?: string;
};

/*
 * Get recent safety incidents located
 * close to the selected route.
 */
export async function getRouteSafetyIncidents(
  encodedPolyline: string,
  corridorKm = 0.5,
  days = 30
) {
  return await apiRequest("/api/route-safety/route-incidents", {
    method: "POST",

    body: JSON.stringify({
      encodedPolyline,
      corridorKm,
      days,
    }),
  });
}