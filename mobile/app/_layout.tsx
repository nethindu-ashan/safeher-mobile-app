import "../global.css";

import { Stack } from "expo-router";

import * as Notifications from "expo-notifications";

import { AuthProvider } from "../src/context/AuthContext";
import { RouteProvider } from "../src/context/RouteContext";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export default function RootLayout() {
  return (
    <AuthProvider>
      <RouteProvider>
        <Stack
          screenOptions={{
            headerShown: false,
          }}
        />
      </RouteProvider>
    </AuthProvider>
  );
}