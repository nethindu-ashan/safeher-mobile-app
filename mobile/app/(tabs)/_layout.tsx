import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

const PURPLE = "#7C3AED";
const GRAY = "#9CA3AF";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,

        tabBarActiveTintColor: PURPLE,
        tabBarInactiveTintColor: GRAY,

        tabBarStyle: {
          height: 68,
          paddingTop: 6,
          paddingBottom: 8,
          backgroundColor: "#FFFFFF",
          borderTopColor: "#E5E7EB",
        },

        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "600",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name="home-outline"
              color={color}
              size={size}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="report"
        options={{
          title: "Report",
          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name="document-text-outline"
              color={color}
              size={size}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="route"
        options={{
          title: "Route",
          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name="map-outline"
              color={color}
              size={size}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="alerts"
        options={{
          title: "Alerts",
          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name="notifications-outline"
              color={color}
              size={size}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="help"
        options={{
          title: "Help",
          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name="medical-outline"
              color={color}
              size={size}
            />
          ),
        }}
      />
    </Tabs>
  );
}