import { apiRequest } from "./apiClient";

export type AdminSOSStatus =
  | "ACTIVE"
  | "CANCELLED";

export interface AdminSOS {
  id: string;
  latitude: number;
  longitude: number;
  message: string | null;
  status: AdminSOSStatus;
  activatedAt: string;
  cancelledAt: string | null;
}

interface AdminSOSListResponse {
  success: boolean;
  data: AdminSOS[];
}

interface AdminSOSResponse {
  success: boolean;
  data: AdminSOS;
}

export async function getAdminSOSRecords(
  status?: AdminSOSStatus
) {
  const query = status
    ? `?status=${encodeURIComponent(status)}`
    : "";

  return apiRequest<AdminSOSListResponse>(
    `/api/admin/sos${query}`
  );
}

export async function getAdminSOSById(
  id: string
) {
  return apiRequest<AdminSOSResponse>(
    `/api/admin/sos/${id}`
  );
}