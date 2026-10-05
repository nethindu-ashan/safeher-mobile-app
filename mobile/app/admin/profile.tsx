import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import {
  useEffect,
  useState,
} from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { COLORS } from "../../src/constants/theme";
import { signOut } from "../../src/services/authService";
import { getMyProfile } from "../../src/services/userService";
import type { UserProfile } from "../../src/types/user";

export default function AdminProfileScreen() {
  const [profile, setProfile] =
    useState<UserProfile | null>(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);

      const response =
        await getMyProfile();

      setProfile(response.data);
    } catch (error) {
      Alert.alert(
        "Unable to load profile",
        error instanceof Error
          ? error.message
          : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      "Sign out",
      "Are you sure you want to sign out of the SafeHer Admin Panel?",
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

              router.replace(
                "/auth/sign-in"
              );
            } catch (error) {
              Alert.alert(
                "Sign out failed",
                error instanceof Error
                  ? error.message
                  : "Unable to sign out."
              );
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor:
          COLORS.background,
      }}
    >
      <View className="flex-1 px-5 pt-4">
        <Text className="text-2xl font-bold text-app-text">
          Admin Profile
        </Text>

        <Text className="mt-1 text-sm text-app-muted">
          SafeHer administration account
        </Text>

        {loading ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator
              size="large"
              color={COLORS.primary}
            />
          </View>
        ) : (
          <>
            <View className="mt-8 items-center">
              <View className="h-20 w-20 items-center justify-center rounded-full bg-light-purple">
                <Ionicons
                  name="shield-checkmark"
                  size={36}
                  color={COLORS.primary}
                />
              </View>

              <Text className="mt-4 text-xl font-bold text-app-text">
                {profile?.fullName ||
                  "SafeHer Administrator"}
              </Text>

              <Text className="mt-1 text-sm text-app-muted">
                {profile?.email}
              </Text>

              <View className="mt-3 rounded-full bg-light-purple px-4 py-2">
                <Text className="text-xs font-bold text-primary">
                  ADMINISTRATOR
                </Text>
              </View>
            </View>

            <View className="mt-8 rounded-3xl border border-app-border bg-white p-5">
              <View className="flex-row items-center">
                <View className="h-11 w-11 items-center justify-center rounded-2xl bg-light-purple">
                  <Ionicons
                    name="mail-outline"
                    size={21}
                    color={
                      COLORS.primary
                    }
                  />
                </View>

                <View className="ml-3 flex-1">
                  <Text className="text-xs text-app-muted">
                    Email
                  </Text>

                  <Text className="mt-1 font-semibold text-app-text">
                    {profile?.email ||
                      "-"}
                  </Text>
                </View>
              </View>

              <View className="mt-4 flex-row items-center">
                <View className="h-11 w-11 items-center justify-center rounded-2xl bg-light-purple">
                  <Ionicons
                    name="shield-outline"
                    size={21}
                    color={
                      COLORS.primary
                    }
                  />
                </View>

                <View className="ml-3 flex-1">
                  <Text className="text-xs text-app-muted">
                    Account Type
                  </Text>

                  <Text className="mt-1 font-semibold text-app-text">
                    SafeHer Administrator
                  </Text>
                </View>
              </View>
            </View>

            <Pressable
              onPress={handleLogout}
              className="mt-8 flex-row items-center justify-center rounded-2xl border border-red-200 bg-white py-4 active:opacity-70"
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
          </>
        )}
      </View>
    </SafeAreaView>
  );
}