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

export default function AdminLayout() {
  const {
    isAuthenticated,
    loading: authLoading,
    user,
  } = useAuth();

  const [role, setRole] =
    useState<Role>(null);

  const [roleLoading, setRoleLoading] =
    useState(true);

  useEffect(() => {
    let mounted = true;

    async function checkRole() {
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
          "Unable to check admin role:",
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

  if (!isAuthenticated) {
    return (
      <Redirect href="/auth/sign-in" />
    );
  }

  if (role !== "ADMIN") {
    return <Redirect href="/" />;
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
      {/* ADMIN DASHBOARD */}
      <Tabs.Screen
        name="index"
        options={{
          title: "Dashboard",

          tabBarIcon: ({
            color,
            size,
            focused,
          }) => (
            <Ionicons
              name={
                focused
                  ? "grid"
                  : "grid-outline"
              }
              size={size}
              color={color}
            />
          ),
        }}
      />

      {/* ADMIN REPORTS */}
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
                  ? "documents"
                  : "documents-outline"
              }
              size={size}
              color={color}
            />
          ),
        }}
      />

      {/* ADMIN PROFILE */}
      <Tabs.Screen
        name="profile"
        options={{
          title: "Admin",

          tabBarIcon: ({
            color,
            size,
            focused,
          }) => (
            <Ionicons
              name={
                focused
                  ? "shield-checkmark"
                  : "shield-checkmark-outline"
              }
              size={size}
              color={color}
            />
          ),
        }}
      />

      {/* Hide report detail page
          from bottom navigation */}
      <Tabs.Screen
        name="report/[id]"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}