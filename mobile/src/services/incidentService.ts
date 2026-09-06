import { apiRequest } from "./apiClient";

import type {
  CreateIncidentPayload,
  CreateIncidentResponse,
} from "../types/incident";

// Pasindu - Get nearby incidents
export async function getNearbyIncidents(
  latitude: number,
  longitude: number
) {
  if (typeof apiRequest !== "function") {
    throw new Error(
      `getNearbyIncidents: apiRequest is ${typeof apiRequest}`
    );
  }

  return apiRequest(
    `/api/incidents/nearby?latitude=${latitude}&longitude=${longitude}`
  );
}

// Nethindu - Create new incident
export async function createIncident(
  payload: CreateIncidentPayload
): Promise<CreateIncidentResponse> {
  if (typeof apiRequest !== "function") {
    throw new Error(
      `createIncident: apiRequest is ${typeof apiRequest}`
    );
  }

  return apiRequest("/api/incidents", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}