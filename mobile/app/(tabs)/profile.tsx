import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { COLORS } from "../../src/constants/theme";
import { useAuth } from "../../src/context/AuthContext";
import { signOut } from "../../src/services/authService";
import { getMyProfile } from "../../src/services/userService";
import type { UserProfile } from "../../src/types/user";

export default function ProfileScreen() {
  const {
    user,
    isAuthenticated,
    loading: authLoading,
  } = useAuth();

  const [profile, setProfile] =
    useState<UserProfile | null>(null);

  const [profileLoading, setProfileLoading] =
    useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      setProfile(null);
      return;
    }

    loadProfile();
  }, [isAuthenticated, user?.id]);

  const loadProfile = async () => {
    try {
      setProfileLoading(true);

      const response =
        await getMyProfile();

      setProfile(response.data);
    } catch (error) {
      console.error(
        "Profile loading error:",
        error
      );

      const message =
        error instanceof Error
          ? error.message
          : "Unable to load your profile.";

      Alert.alert(
        "Profile error",
        message
      );
    } finally {
      setProfileLoading(false);
    }
  };

  const handleNotificationPreferences = () => {
    if (!isAuthenticated) {
      Alert.alert(
        "Sign in required",
        "Please sign in to manage your notification preferences.",
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "Sign In",
            onPress: () =>
              router.push("/auth/sign-in"),
          },
        ]
      );

      return;
    }

    router.push(
      "/settings/notifications"
    );
  };

  const handleAdminPanel = () => {
    if (
      !isAuthenticated ||
      profile?.role !== "ADMIN"
    ) {
      Alert.alert(
        "Access denied",
        "Administrator access is required."
      );

      return;
    }

    router.push("/admin");
  };

  const handleLogout = () => {
    Alert.alert(
      "Sign out",
      "Are you sure you want to sign out of SafeHer?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Sign Out",
          style: "destructive",

          onPress: async () => {
            try {
              await signOut();

              setProfile(null);

              Alert.alert(
                "Signed out",
                "You have been signed out successfully."
              );
            } catch (error) {
              const message =
                error instanceof Error
                  ? error.message
                  : "Unable to sign out.";

              Alert.alert(
                "Sign out failed",
                message
              );
            }
          },
        },
      ]
    );
  };

  if (authLoading) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor:
            COLORS.background,
        }}
      >
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator
            size="large"
            color={COLORS.primary}
          />

          <Text className="mt-3 text-sm text-app-muted">
            Loading...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor:
          COLORS.background,
      }}
    >
      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 16,
          paddingBottom: 40,
        }}
        showsVerticalScrollIndicator={
          false
        }
      >
        <Text className="text-2xl font-bold text-app-text">
          Profile
        </Text>

        {/* ============================== */}
        {/* GUEST USER */}
        {/* ============================== */}

        {!isAuthenticated && (
          <>
            <View className="mt-8 items-center">
              <View className="h-20 w-20 items-center justify-center rounded-full bg-light-purple">
                <Ionicons
                  name="person-outline"
                  size={34}
                  color={COLORS.primary}
                />
              </View>

              <Text className="mt-4 text-xl font-bold text-app-text">
                SafeHer Guest
              </Text>

              <Text className="mt-2 px-6 text-center text-sm leading-5 text-app-muted">
                Sign in or create an
                account to manage your
                profile, notification
                preferences and other
                personal safety settings.
              </Text>
            </View>

            <Pressable
              onPress={() =>
                router.push(
                  "/auth/sign-in"
                )
              }
              className="mt-8 items-center rounded-2xl bg-primary py-4 active:opacity-80"
            >
              <Text className="text-base font-bold text-white">
                Sign In
              </Text>
            </Pressable>

            <Pressable
              onPress={() =>
                router.push(
                  "/auth/sign-up"
                )
              }
              className="mt-3 items-center rounded-2xl border border-primary bg-white py-4 active:opacity-70"
            >
              <Text className="text-base font-bold text-primary">
                Create Account
              </Text>
            </Pressable>

            <View className="mt-5 flex-row rounded-2xl bg-light-purple p-4">
              <Ionicons
                name="shield-checkmark-outline"
                size={22}
                color={COLORS.primary}
              />

              <Text className="ml-3 flex-1 text-sm leading-5 text-app-muted">
                Critical SafeHer safety
                features can still be used
                without creating an
                account.
              </Text>
            </View>
          </>
        )}

        {/* ============================== */}
        {/* AUTHENTICATED USER */}
        {/* ============================== */}

        {isAuthenticated && (
          <>
            <View className="mt-8 items-center">
              <View className="h-20 w-20 items-center justify-center rounded-full bg-light-purple">
                <Ionicons
                  name={
                    profile?.role ===
                    "ADMIN"
                      ? "shield-checkmark-outline"
                      : "person-outline"
                  }
                  size={34}
                  color={COLORS.primary}
                />
              </View>

              {profileLoading ? (
                <ActivityIndicator
                  className="mt-4"
                  color={COLORS.primary}
                />
              ) : (
                <>
                  <Text className="mt-4 text-xl font-bold text-app-text">
                    {profile?.fullName ??
                      "SafeHer User"}
                  </Text>

                  <Text className="mt-1 text-sm text-app-muted">
                    {profile?.email ??
                      user?.email}
                  </Text>

                  {profile?.role ===
                    "ADMIN" && (
                    <View className="mt-3 rounded-full bg-light-purple px-4 py-2">
                      <Text className="text-xs font-bold text-primary">
                        SafeHer
                        Administrator
                      </Text>
                    </View>
                  )}
                </>
              )}
            </View>

            {/* Account Information */}
            <View className="mt-8 rounded-2xl border border-app-border bg-white p-4">
              <Text className="mb-4 text-base font-bold text-app-text">
                Account Information
              </Text>

              {/* Email */}
              <View className="flex-row items-center py-2">
                <View className="h-10 w-10 items-center justify-center rounded-full bg-light-purple">
                  <Ionicons
                    name="mail-outline"
                    size={20}
                    color={COLORS.primary}
                  />
                </View>

                <View className="ml-3 flex-1">
                  <Text className="text-xs text-app-muted">
                    Email
                  </Text>

                  <Text className="mt-1 text-sm font-semibold text-app-text">
                    {profile?.email ??
                      user?.email ??
                      "-"}
                  </Text>
                </View>
              </View>

              {/* Phone */}
              <View className="mt-2 flex-row items-center py-2">
                <View className="h-10 w-10 items-center justify-center rounded-full bg-light-purple">
                  <Ionicons
                    name="call-outline"
                    size={20}
                    color={COLORS.primary}
                  />
                </View>

                <View className="ml-3 flex-1">
                  <Text className="text-xs text-app-muted">
                    Phone
                  </Text>

                  <Text className="mt-1 text-sm font-semibold text-app-text">
                    {profile?.phone ||
                      "Not added"}
                  </Text>
                </View>
              </View>

              {/* Role */}
              <View className="mt-2 flex-row items-center py-2">
                <View className="h-10 w-10 items-center justify-center rounded-full bg-light-purple">
                  <Ionicons
                    name="shield-outline"
                    size={20}
                    color={COLORS.primary}
                  />
                </View>

                <View className="ml-3 flex-1">
                  <Text className="text-xs text-app-muted">
                    Account Type
                  </Text>

                  <Text className="mt-1 text-sm font-semibold text-app-text">
                    {profile?.role ===
                    "ADMIN"
                      ? "Administrator"
                      : "SafeHer User"}
                  </Text>
                </View>
              </View>
            </View>

            {/* ============================== */}
            {/* ADMINISTRATION */}
            {/* Only visible to ADMIN */}
            {/* ============================== */}

            {profile?.role ===
              "ADMIN" && (
              <View className="mt-8">
                <Text className="mb-3 text-base font-bold text-app-text">
                  Administration
                </Text>

                <Pressable
                  onPress={
                    handleAdminPanel
                  }
                  className="rounded-3xl border border-app-border bg-white p-5 active:opacity-70"
                >
                  <View className="flex-row items-center">
                    <View className="h-12 w-12 items-center justify-center rounded-2xl bg-light-purple">
                      <Ionicons
                        name="shield-checkmark-outline"
                        size={24}
                        color={
                          COLORS.primary
                        }
                      />
                    </View>

                    <View className="ml-4 flex-1">
                      <Text className="text-base font-bold text-app-text">
                        Admin Panel
                      </Text>

                      <Text className="mt-1 text-sm leading-5 text-app-muted">
                        Review and manage
                        submitted incident
                        reports
                      </Text>
                    </View>

                    <Ionicons
                      name="chevron-forward"
                      size={20}
                      color="#A995B5"
                    />
                  </View>

                  <View className="mt-4 flex-row items-center rounded-2xl bg-light-purple px-4 py-3">
                    <Ionicons
                      name="clipboard-outline"
                      size={18}
                      color={
                        COLORS.primary
                      }
                    />

                    <Text className="ml-2 flex-1 text-xs font-medium text-app-muted">
                      Review Pending,
                      Verified and Rejected
                      safety reports
                    </Text>
                  </View>
                </Pressable>
              </View>
            )}
          </>
        )}

        {/* ============================== */}
        {/* SETTINGS */}
        {/* ============================== */}

        <View className="mt-10">
          <Text className="mb-3 text-base font-bold text-app-text">
            Settings
          </Text>

          {/* Notification Preferences */}
          <Pressable
            className="flex-row items-center rounded-2xl border border-app-border bg-white px-4 py-4 active:opacity-70"
            onPress={
              handleNotificationPreferences
            }
          >
            <View className="h-10 w-10 items-center justify-center rounded-full bg-light-purple">
              <Ionicons
                name="notifications-outline"
                size={21}
                color={COLORS.primary}
              />
            </View>

            <View className="ml-3 flex-1">
              <Text className="text-base font-semibold text-app-text">
                Notification
                Preferences
              </Text>

              <Text className="mt-1 text-sm text-app-muted">
                Manage your safety
                notifications
              </Text>
            </View>

            <Ionicons
              name="chevron-forward"
              size={20}
              color="#A995B5"
            />
          </Pressable>
        </View>

        {/* ============================== */}
        {/* LOGOUT */}
        {/* ============================== */}

        {isAuthenticated && (
          <Pressable
            onPress={handleLogout}
            className="mt-6 flex-row items-center justify-center rounded-2xl border border-red-200 bg-white py-4 active:opacity-70"
          >
            <Ionicons
              name="log-out-outline"
              size={21}
              color={COLORS.error}
            />

            <Text
              className="ml-2 text-base font-bold"
              style={{
                color: COLORS.error,
              }}
            >
              Sign Out
            </Text>
          </Pressable>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}