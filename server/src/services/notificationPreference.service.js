import {
  getNotificationPreferences,
  createNotificationPreferences,
  updateNotificationPreferences,
} from "../repositories/notificationPreference.repository.js";

export async function getPreferences(userId) {
  let preferences = await getNotificationPreferences(userId);

  if (!preferences) {
    preferences = await createNotificationPreferences({
      userId,
      nearbyAlerts: true,
      emergencyAlerts: true,
      communityUpdates: true,
    });
  }

  return preferences;
}

export async function savePreferences(userId, data) {
  const existing = await getNotificationPreferences(userId);

  if (!existing) {
    return await createNotificationPreferences({
      userId,
      ...data,
    });
  }

  return await updateNotificationPreferences(userId, data);
}