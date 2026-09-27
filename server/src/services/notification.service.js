import {
  getPushTokensByUserId,
} from "../repositories/pushToken.repository.js";

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