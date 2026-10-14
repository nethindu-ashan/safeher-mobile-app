import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import { apiRequest } from "./apiClient";

export async function registerForPushNotificationsAsync() {
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
    });
  }

  const { status: existingStatus } =
    await Notifications.getPermissionsAsync();

  let finalStatus = existingStatus;

  if (existingStatus !== "granted") {
    const { status } =
      await Notifications.requestPermissionsAsync();

    finalStatus = status;
  }

  if (finalStatus !== "granted") {
    throw new Error("Notification permission was not granted.");
  }

  const tokenData =
    await Notifications.getExpoPushTokenAsync();

  return tokenData.data;
}

export async function registerPushTokenWithBackend(token: string) {
  return await apiRequest("/api/push-tokens", {
    method: "POST",
    body: JSON.stringify({ token }),
  });
}


