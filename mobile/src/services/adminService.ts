import {
  apiRequest,
} from "./apiClient";

export type IncidentStatus =
  | "Pending Review"
  | "Verified"
  | "Rejected"
  | "Cancelled";

export type AdminReviewStatus =
  | "Verified"
  | "Rejected";

export interface AdminReporter {
  id: string;
  fullName: string;
  email: string;
}

export interface AdminIncident {
  id: string;
  category: string;

  latitude: number;
  longitude: number;

  incidentDatetime: string;

  description: string;

  isAnonymous: boolean;

  status:
    | IncidentStatus
    | string;

  createdAt: string;

  userId?:
    | string
    | null;

  user?:
    | AdminReporter
    | null;

  evidencePaths?: string[];
}

export interface AdminIncidentsResponse {
  success: boolean;
  data: AdminIncident[];
}

export interface AdminIncidentResponse {
  success: boolean;
  message?: string;
  data: AdminIncident;
}

export async function getAdminIncidents(
  status?: IncidentStatus
): Promise<AdminIncidentsResponse> {
  const query =
    status
      ? `?status=${encodeURIComponent(
          status
        )}`
      : "";

  return apiRequest<AdminIncidentsResponse>(
    `/api/admin/incidents${query}`
  );
}

export async function getAdminIncident(
  id: string
): Promise<AdminIncidentResponse> {
  return apiRequest<AdminIncidentResponse>(
    `/api/admin/incidents/${id}`
  );
}

export async function updateAdminIncidentStatus(
  id: string,
  status: AdminReviewStatus
): Promise<AdminIncidentResponse> {
  return apiRequest<AdminIncidentResponse>(
    `/api/admin/incidents/${id}/status`,
    {
      method: "PATCH",

      body: JSON.stringify({
        status,
      }),
    }
  );
}