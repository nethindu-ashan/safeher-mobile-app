import {
  getNotificationPreferences,
  createNotificationPreferences,
  updateNotificationPreferences,
} from "../repositories/notificationPreference.repository.js";

export async function getPreferences() {
  let preferences = await getNotificationPreferences();

  if (!preferences) {
    preferences = await createNotificationPreferences({
      nearbyAlerts: true,
      emergencyAlerts: true,
      communityUpdates: true,
    });
  }

  return preferences;
}

export async function savePreferences(data) {
  const existing = await getNotificationPreferences();

  if (!existing) {
    return await createNotificationPreferences(data);
  }

  return await updateNotificationPreferences(existing.id, data);
}