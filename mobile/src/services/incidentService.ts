import { apiRequest } from "./apiClient";

export async function getNearbyIncidents(
  latitude: number,
  longitude: number
) {
  return await apiRequest(
    `/api/incidents/nearby?latitude=${latitude}&longitude=${longitude}`
  );
}

export async function getIncidentById(id: string) {
  return await apiRequest(`/api/incidents/${id}`);
}