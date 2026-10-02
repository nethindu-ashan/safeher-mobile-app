import { Ionicons } from "@expo/vector-icons";
import {
  Redirect,
  Tabs,
} from "expo-router";
import {
  useEffect,
  useState,
} from "react";
import {
  ActivityIndicator,
  View,
} from "react-native";

import { COLORS } from "../../src/constants/theme";
import { useAuth } from "../../src/context/AuthContext";
import { getMyProfile } from "../../src/services/userService";

type Role =
  | "USER"
  | "ADMIN"
  | null;

export default function TabLayout() {
  const {
    isAuthenticated,
    loading: authLoading,
    user,
  } = useAuth();

  const [role, setRole] =
    useState<Role>(null);

  // IMPORTANT:
  // Start as TRUE so normal tabs do not
  // appear before the role is checked.
  const [roleLoading, setRoleLoading] =
    useState(true);

  useEffect(() => {
    let mounted = true;

    async function checkRole() {
      // Guest users may use normal tabs.
      if (!isAuthenticated) {
        if (mounted) {
          setRole(null);
          setRoleLoading(false);
        }

        return;
      }

      try {
        if (mounted) {
          setRoleLoading(true);
        }

        const response =
          await getMyProfile();

        if (mounted) {
          setRole(
            response.data.role
          );
        }
      } catch (error) {
        console.error(
          "Unable to check user role:",
          error
        );

        if (mounted) {
          setRole("USER");
        }
      } finally {
        if (mounted) {
          setRoleLoading(false);
        }
      }
    }

    if (!authLoading) {
      checkRole();
    }

    return () => {
      mounted = false;
    };
  }, [
    authLoading,
    isAuthenticated,
    user?.id,
  ]);

  if (
    authLoading ||
    roleLoading
  ) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent:
            "center",
          backgroundColor:
            COLORS.background,
        }}
      >
        <ActivityIndicator
          size="large"
          color={COLORS.primary}
        />
      </View>
    );
  }

  // Admin must never see
  // normal USER tabs.
  if (
    isAuthenticated &&
    role === "ADMIN"
  ) {
    return (
      <Redirect href="/admin" />
    );
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,

        tabBarActiveTintColor:
          COLORS.primary,

        tabBarInactiveTintColor:
          COLORS.textSecondary,

        tabBarHideOnKeyboard:
          true,

        tabBarStyle: {
          height: 68,
          paddingTop: 6,
          paddingBottom: 8,
          backgroundColor:
            COLORS.surface,
          borderTopColor:
            COLORS.border,
        },

        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: "500",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",

          tabBarIcon: ({
            color,
            size,
            focused,
          }) => (
            <Ionicons
              name={
                focused
                  ? "home"
                  : "home-outline"
              }
              size={size}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="alerts"
        options={{
          title: "Alerts",

          tabBarIcon: ({
            color,
            size,
            focused,
          }) => (
            <Ionicons
              name={
                focused
                  ? "notifications"
                  : "notifications-outline"
              }
              size={size}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="reports"
        options={{
          title: "Reports",

          tabBarIcon: ({
            color,
            size,
            focused,
          }) => (
            <Ionicons
              name={
                focused
                  ? "document-text"
                  : "document-text-outline"
              }
              size={size}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",

          tabBarIcon: ({
            color,
            size,
            focused,
          }) => (
            <Ionicons
              name={
                focused
                  ? "person"
                  : "person-outline"
              }
              size={size}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}