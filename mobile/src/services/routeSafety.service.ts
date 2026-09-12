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

export type RouteComparison = {
  id: string;
  name: string;

  distanceMeters: number | null;
  distance: string | null;

  durationSeconds: number | null;
  duration: string | null;

  routeLabels: string[];

  encodedPolyline: string;

  incidentCount: number;
  nearestIncidentDistanceKm: number | null;

  categorySummary: Record<string, number>;

  incidents: RouteSafetyIncident[];

  comparisonLabel: string;
};

export type RouteComparisonResponse = {
  routeCount: number;
  corridorKm: number;
  days: number;
  routes: RouteComparison[];
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

/*
 * Compare the safety information
 * of multiple available routes.
 */
export async function compareRouteSafety(
  routes: {
    id: string;
    name?: string;
    distanceMeters?: number;
    distance?: string;
    durationSeconds?: number;
    duration?: string;
    routeLabels?: string[];
    encodedPolyline: string;
  }[],
  corridorKm = 0.5,
  days = 30
) {
  return await apiRequest("/api/route-safety/compare-routes", {
    method: "POST",

    body: JSON.stringify({
      routes,
      corridorKm,
      days,
    }),
  });
}