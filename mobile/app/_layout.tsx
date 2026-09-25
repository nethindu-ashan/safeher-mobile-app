import "../global.css";

import { Stack } from "expo-router";

import { AuthProvider } from "../src/context/AuthContext";
import { RouteProvider } from "../src/context/RouteContext";

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