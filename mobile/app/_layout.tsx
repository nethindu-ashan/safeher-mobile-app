import "../global.css";

import { Stack } from "expo-router";
import { RouteProvider } from "../src/context/RouteContext";


export default function RootLayout() {
  return (
     <RouteProvider>
        <Stack
          screenOptions={{
            headerShown: false,
          }}
        />
     </RouteProvider>
  );
}