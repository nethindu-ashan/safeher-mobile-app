import {
  getPushTokensByUserId,
} from "../repositories/pushToken.repository.js";
import { findUsersNearLocation } from "../repositories/user.repository.js";

const EXPO_PUSH_URL =
  "https://exp.host/--/api/v2/push/send";

export async function sendNotificationToUser(
  userId,
  { title, body, data = {} }
) {
  const pushTokens =
    await getPushTokensByUserId(userId);

  if (pushTokens.length === 0) {
    console.log(
      `No push tokens found for user ${userId}`
    );

    return [];
  }

  const messages = pushTokens.map(
    ({ token }) => ({
      to: token,
      title,
      body,
      data,
      sound: "default",
    })
  );

  const response = await fetch(
    EXPO_PUSH_URL,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(messages),
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      `Expo Push API failed: ${JSON.stringify(result)}`
    );
  }

  console.log(
    "Expo push response:",
    JSON.stringify(result)
  );

  return result.data ?? [];
}

export async function sendNearbyIncidentNotifications(incident) {
  const users = await findUsersNearLocation(
    incident.latitude,
    incident.longitude,
    5
  );

  for (const user of users) {
    const nearbyAlertsEnabled =
      user.notificationPreference?.nearbyAlerts ?? true;

    if (!nearbyAlertsEnabled) {
      continue;
    }

    if (user.pushTokens.length === 0) {
      continue;
    }

    await sendNotificationToUser(user.id, {
      title: "Nearby Safety Alert",
      body: `A safety incident was reported near your location.`,
      data: {
        type: "NEARBY_ALERT",
        incidentId: incident.id,
      },
    });
  }
}

