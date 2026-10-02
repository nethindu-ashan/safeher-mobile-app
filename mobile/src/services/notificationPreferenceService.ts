import { apiRequest } from "./apiClient";

export async function getNotificationPreferences() {
  return await apiRequest("/api/notification-preferences");
}

export async function updateNotificationPreferences(data: {
  nearbyAlerts: boolean;
  emergencyAlerts: boolean;
  communityUpdates: boolean;
}) {
  return await apiRequest("/api/notification-preferences", {
    method: "PUT",
    body: JSON.stringify(data),
  });
}