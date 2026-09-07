import { apiRequest } from "./apiClient";

/*
 * Data sent to the backend when searching for routes.
 */
export type RouteSearchRequest = {
  startLocation: string;
  destination: string;
};

/*
 * Represents one route returned by the backend.
 */
export type RouteOption = {
  id: string;
  name: string;
  startLocation: string;
  destination: string;
  distanceMeters: number;
  distance: string;
  durationSeconds: number;
  duration: string;
  encodedPolyline: string;
  routeLabels: string[];
};

/*
 * Represents the data section of the backend response.
 */
export type RouteSearchData = {
  startLocation: string;
  destination: string;
  routeCount: number;
  routes: RouteOption[];
};

/*
 * Represents the complete API response.
 */
export type RouteSearchResponse = {
  success: boolean;
  message: string;
  data: RouteSearchData;
};

/*
 * Sends a route search request to the SafeHer backend.
 */
export async function searchRoutes(
  request: RouteSearchRequest
): Promise<RouteSearchResponse> {
  return await apiRequest("/route-search", {
    method: "POST",
    body: JSON.stringify(request),
  });
}