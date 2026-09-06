import { apiRequest } from "./apiClient";

import type {
  ActivateSOSPayload,
  SOSResponse,
} from "../types/sos";


// Activate SOS
export async function activateSOS(
  payload: ActivateSOSPayload
): Promise<SOSResponse> {
  return apiRequest("/api/sos", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}


// Get SOS details
export async function getSOS(
  id: string
): Promise<SOSResponse> {
  return apiRequest(`/api/sos/${id}`);
}


// Cancel SOS
export async function cancelSOS(
  id: string
): Promise<SOSResponse> {
  return apiRequest(`/api/sos/${id}/cancel`, {
    method: "PATCH",
  });
}