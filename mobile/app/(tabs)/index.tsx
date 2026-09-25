import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { ComponentProps, useEffect, useState } from "react";
import {
  Pressable,
  ScrollView,
  StatusBar,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { COLORS, GRADIENTS } from "../../src/constants/theme";
import { useAuth } from "../../src/context/AuthContext";
import { getMyProfile } from "../../src/services/userService";

type IconName = ComponentProps<typeof Ionicons>["name"];

type QuickActionProps = {
  title: string;
  subtitle: string;
  icon: IconName;
  iconColor: string;
  iconBackground: string;
  onPress: () => void;
};

function QuickActionCard({
  title,
  subtitle,
  icon,
  iconColor,
  iconBackground,
  onPress,
}: QuickActionProps) {
  return (
    <Pressable
      onPress={onPress}
      className="mb-3 w-[48.5%] rounded-3xl border border-app-border bg-white p-4 active:opacity-75"
    >
      <View
        style={{
          width: 46,
          height: 46,
          borderRadius: 16,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: iconBackground,
        }}
      >
        <Ionicons
          name={icon}
          size={23}
          color={iconColor}
        />
      </View>

      <Text className="mt-4 text-base font-bold text-app-text">
        {title}
      </Text>

      <Text className="mt-1 text-xs leading-5 text-app-muted">
        {subtitle}
      </Text>
    </Pressable>
  );
}

export default function HomeScreen() {
  const { user, isAuthenticated, loading } = useAuth();

  const [fullName, setFullName] = useState<string | null>(
    null
  );

  useEffect(() => {
    if (!isAuthenticated) {
      setFullName(null);
      return;
    }

    async function loadProfile() {
      try {
        const response = await getMyProfile();

        setFullName(response.data.fullName);
      } catch (error) {
        console.log(
          "Unable to load Home profile:",
          error
        );

        const metadataName =
          user?.user_metadata?.full_name;

        if (
          typeof metadataName === "string" &&
          metadataName.trim()
        ) {
          setFullName(metadataName.trim());
        }
      }
    }

    loadProfile();
  }, [isAuthenticated, user?.id]);

  const firstName =
    fullName?.trim().split(" ")[0] || "there";

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: COLORS.background,
      }}
      edges={["top"]}
    >
      <StatusBar
        barStyle="dark-content"
        backgroundColor={COLORS.background}
      />

      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 10,
          paddingBottom: 40,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* ============================== */}
        {/* HEADER */}
        {/* ============================== */}

        <View className="flex-row items-center justify-between">
          <View className="flex-1 flex-row items-center">
            <LinearGradient
              colors={GRADIENTS.primary}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{
                width: 46,
                height: 46,
                borderRadius: 16,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Ionicons
                name="shield-checkmark-outline"
                size={25}
                color="#FFFFFF"
              />
            </LinearGradient>

            <View className="ml-3 flex-1">
              <Text className="text-xl font-bold text-app-text">
                SafeHer
              </Text>

              <Text className="mt-0.5 text-xs text-app-muted">
                Together for Safer Journeys
              </Text>
            </View>
          </View>

          <Pressable
            onPress={() =>
              router.push("/(tabs)/profile")
            }
            className="h-11 w-11 items-center justify-center rounded-full border border-app-border bg-white active:opacity-70"
          >
            <Ionicons
              name={
                isAuthenticated
                  ? "person"
                  : "person-outline"
              }
              size={21}
              color={COLORS.primary}
            />
          </Pressable>
        </View>

        {/* ============================== */}
        {/* USER / GUEST GREETING */}
        {/* ============================== */}

        {!loading && (
          <View className="mt-6">
            {isAuthenticated ? (
              <>
                <Text className="text-sm font-medium text-app-muted">
                  Welcome back,
                </Text>

                <Text className="mt-1 text-2xl font-bold text-app-text">
                  {firstName} 👋
                </Text>
              </>
            ) : (
              <View className="flex-row items-center justify-between rounded-2xl border border-app-border bg-white px-4 py-3">
                <View className="mr-3 flex-1">
                  <Text className="text-sm font-bold text-app-text">
                    Using SafeHer as a guest
                  </Text>

                  <Text className="mt-1 text-xs leading-4 text-app-muted">
                    Safety features are available without
                    creating an account.
                  </Text>
                </View>

                <Pressable
                  onPress={() =>
                    router.push("/auth/sign-in")
                  }
                  className="rounded-xl bg-light-purple px-4 py-2.5"
                >
                  <Text className="text-sm font-bold text-primary">
                    Sign In
                  </Text>
                </Pressable>
              </View>
            )}
          </View>
        )}

        {/* ============================== */}
        {/* MAIN SAFETY CARD */}
        {/* ============================== */}

        <LinearGradient
          colors={[
            "#FFF0F5",
            "#F7F1FF",
          ]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            marginTop: 20,
            borderRadius: 28,
            padding: 20,
            borderWidth: 1,
            borderColor: COLORS.border,
          }}
        >
          <View className="flex-row items-start justify-between">
            <View className="mr-3 flex-1">
              <Text className="text-xl font-bold text-app-text">
                Your safety matters
              </Text>

              <Text className="mt-2 text-sm leading-6 text-app-muted">
                Access emergency assistance,
                report incidents and find nearby
                support when you need it.
              </Text>
            </View>

            <View className="h-12 w-12 items-center justify-center rounded-2xl bg-white">
              <Ionicons
                name="heart-outline"
                size={25}
                color={COLORS.pink}
              />
            </View>
          </View>

          {/* SOS */}
          <View className="mt-6 items-center">
            <Pressable
              onPress={() =>
                router.push("/report/sos")
              }
              className="active:opacity-80"
            >
              <View
                style={{
                  width: 126,
                  height: 126,
                  borderRadius: 63,
                  backgroundColor: "#FFE3E6",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <View
                  style={{
                    width: 104,
                    height: 104,
                    borderRadius: 52,
                    backgroundColor: "#FFC9CE",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <View
                    style={{
                      width: 84,
                      height: 84,
                      borderRadius: 42,
                      backgroundColor: COLORS.sos,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Ionicons
                      name="warning-outline"
                      size={25}
                      color="#FFFFFF"
                    />

                    <Text className="mt-1 text-lg font-extrabold text-white">
                      SOS
                    </Text>
                  </View>
                </View>
              </View>
            </Pressable>

            <Text className="mt-4 text-sm font-semibold text-app-text">
              Emergency SOS
            </Text>

            <Text className="mt-1 text-center text-xs text-app-muted">
              Tap for emergency assistance
            </Text>
          </View>
        </LinearGradient>

        {/* ============================== */}
        {/* QUICK ACTIONS */}
        {/* ============================== */}

        <View className="mt-7">
          <View className="flex-row items-center justify-between">
            <Text className="text-lg font-bold text-app-text">
              Quick Actions
            </Text>

            <Text className="text-xs text-app-muted">
              Stay safe
            </Text>
          </View>

          <View className="mt-4 flex-row flex-wrap justify-between">
            <QuickActionCard
              title="Report"
              subtitle="Report a safety incident"
              icon="document-text-outline"
              iconColor={COLORS.pink}
              iconBackground="#FFF0F5"
              onPress={() =>
                router.push("/report")
              }
            />

            <QuickActionCard
              title="Safe Route"
              subtitle="Find a safer way to travel"
              icon="navigate-outline"
              iconColor={COLORS.primary}
              iconBackground="#F4EEFF"
              onPress={() =>
                router.push("/route")
              }
            />

            <QuickActionCard
              title="Alerts"
              subtitle="View nearby safety alerts"
              icon="notifications-outline"
              iconColor="#E59B16"
              iconBackground="#FFF7E7"
              onPress={() =>
                router.push("/(tabs)/alerts")
              }
            />

            <QuickActionCard
              title="Nearby Help"
              subtitle="Find support services nearby"
              icon="medical-outline"
              iconColor="#22A06B"
              iconBackground="#ECFDF5"
              onPress={() =>
                router.push("/help")
              }
            />
          </View>
        </View>

        {/* ============================== */}
        {/* MY REPORTS */}
        {/* ============================== */}

        <Pressable
          onPress={() => {
            if (isAuthenticated) {
              router.push("/(tabs)/reports");
            } else {
              router.push("/auth/sign-in");
            }
          }}
          className="mt-3 flex-row items-center rounded-3xl border border-app-border bg-white p-4 active:opacity-70"
        >
          <View className="h-12 w-12 items-center justify-center rounded-2xl bg-light-purple">
            <Ionicons
              name="folder-open-outline"
              size={23}
              color={COLORS.primary}
            />
          </View>

          <View className="ml-4 flex-1">
            <Text className="text-base font-bold text-app-text">
              My Reports
            </Text>

            <Text className="mt-1 text-sm text-app-muted">
              {isAuthenticated
                ? "View and track your submitted reports"
                : "Sign in to access your personal reports"}
            </Text>
          </View>

          <Ionicons
            name="chevron-forward"
            size={20}
            color="#A995B5"
          />
        </Pressable>

        {/* ============================== */}
        {/* ACCOUNT CARD FOR GUEST */}
        {/* ============================== */}

        {!isAuthenticated && !loading && (
          <View className="mt-5 rounded-3xl border border-app-border bg-white p-5">
            <View className="flex-row items-start">
              <View className="h-11 w-11 items-center justify-center rounded-2xl bg-light-purple">
                <Ionicons
                  name="person-add-outline"
                  size={22}
                  color={COLORS.primary}
                />
              </View>

              <View className="ml-3 flex-1">
                <Text className="text-base font-bold text-app-text">
                  Create a SafeHer account
                </Text>

                <Text className="mt-1 text-sm leading-5 text-app-muted">
                  Save your profile, manage notification
                  preferences and access personal safety
                  information.
                </Text>
              </View>
            </View>

            <View className="mt-4 flex-row gap-3">
              <Pressable
                onPress={() =>
                  router.push("/auth/sign-in")
                }
                className="flex-1 items-center rounded-2xl border border-primary bg-white py-3"
              >
                <Text className="font-bold text-primary">
                  Sign In
                </Text>
              </Pressable>

              <Pressable
                onPress={() =>
                  router.push("/auth/sign-up")
                }
                className="flex-1 overflow-hidden rounded-2xl"
              >
                <LinearGradient
                  colors={GRADIENTS.primary}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={{
                    minHeight: 48,
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: 16,
                  }}
                >
                  <Text className="font-bold text-white">
                    Create Account
                  </Text>
                </LinearGradient>
              </Pressable>
            </View>
          </View>
        )}

        {/* ============================== */}
        {/* SAFETY TIP */}
        {/* ============================== */}

        <View className="mt-5 flex-row rounded-3xl bg-light-purple p-5">
          <View className="h-10 w-10 items-center justify-center rounded-full bg-white">
            <Ionicons
              name="bulb-outline"
              size={21}
              color={COLORS.primary}
            />
          </View>

          <View className="ml-3 flex-1">
            <Text className="text-sm font-bold text-app-text">
              Safety Tip
            </Text>

            <Text className="mt-1 text-sm leading-5 text-app-muted">
              Stay aware of your surroundings and use
              SafeHer to check alerts, routes and nearby
              support services before travelling.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}