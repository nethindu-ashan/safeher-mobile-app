import { apiRequest } from "./apiClient";

export interface MyIncident {
  id: string;
  category: string;
  latitude: number;
  longitude: number;
  incidentDatetime: string;
  description: string;
  isAnonymous: boolean;
  status: string;
  createdAt: string;
}

export interface MyReportsResponse {
  success: boolean;
  data: MyIncident[];
}

export interface CancelReportResponse {
  success: boolean;
  message: string;
  data: MyIncident;
}

export async function getMyReports(): Promise<MyReportsResponse> {
  return apiRequest<MyReportsResponse>(
    "/api/incidents/my"
  );
}

export async function cancelMyReport(
  id: string
): Promise<CancelReportResponse> {
  return apiRequest<CancelReportResponse>(
    `/api/incidents/${id}/cancel`,
    {
      method: "PATCH",
    }
  );
}