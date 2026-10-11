import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";

import {
  ComponentProps,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  Animated,
  Easing,
  Image,
  Pressable,
  ScrollView,
  StatusBar,
  Text,
  View,
} from "react-native";

import {
  SafeAreaView,
} from "react-native-safe-area-context";

import {
  COLORS,
} from "../../src/constants/theme";

import {
  useAuth,
} from "../../src/context/AuthContext";

import {
  getMyProfile,
} from "../../src/services/userService";

/* ============================================================
   TYPES
   ============================================================ */

type IconName =
  ComponentProps<typeof Ionicons>["name"];

type QuickActionProps = {
  title: string;
  subtitle: string;
  icon: IconName;
  tone?: "purple" | "pink";
  onPress: () => void;
};

/* ============================================================
   LOGO
   ============================================================ */

const HOME_LOGO = require(
  "../../assets/images/logo/safeher-logo.png"
);

/* ============================================================
   COLORS
   ============================================================ */

const PAGE_BACKGROUND =
  "#FFFBFD";

const HEADER_PURPLE =
  "#5B1AA6";

const SOS_RED =
  "#D92D20";

const SOS_RED_DARK =
  "#B42318";

const SOS_SOFT =
  "#FFF1F0";

/* ============================================================
   GREETING
   ============================================================ */

function getGreeting() {
  const hour =
    new Date().getHours();

  if (
    hour >= 5 &&
    hour < 12
  ) {
    return "Good Morning!";
  }

  if (
    hour >= 12 &&
    hour < 18
  ) {
    return "Good Afternoon!";
  }

  if (
    hour >= 18 &&
    hour < 22
  ) {
    return "Good Evening!";
  }

  return "Good Night!";
}

/* ============================================================
   SECTION HEADER
   ============================================================ */

function SectionHeader({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <View className="mb-3">
      <Text className="text-[16px] font-bold text-app-text">
        {title}
      </Text>

      {subtitle ? (
        <Text className="mt-1 text-[9.5px] leading-[14px] text-app-muted">
          {subtitle}
        </Text>
      ) : null}
    </View>
  );
}

/* ============================================================
   QUICK ACTION CARD
   ============================================================ */

function QuickAction({
  title,
  subtitle,
  icon,
  tone = "purple",
  onPress,
}: QuickActionProps) {
  const isPink =
    tone === "pink";

  return (
    <Pressable
      onPress={onPress}
      className="mb-3 min-h-[106px] w-[48.5%] rounded-[18px] border border-app-border bg-white p-3.5 active:opacity-70"
    >
      <View className="flex-row items-start justify-between">
        <View
          className={`h-11 w-11 items-center justify-center rounded-[14px] ${
            isPink
              ? "bg-[#FFF0F6]"
              : "bg-light-purple"
          }`}
        >
          <Ionicons
            name={icon}
            size={20}
            color={
              isPink
                ? COLORS.pink
                : COLORS.primary
            }
          />
        </View>

        <Ionicons
          name="chevron-forward"
          size={15}
          color="#AAA1AE"
        />
      </View>

      <Text className="mt-3 text-[11px] font-bold text-app-text">
        {title}
      </Text>

      <Text
        numberOfLines={2}
        className="mt-1 text-[8.5px] leading-[12px] text-app-muted"
      >
        {subtitle}
      </Text>
    </Pressable>
  );
}

/* ============================================================
   HOME SCREEN
   ============================================================ */

export default function HomeScreen() {
  /* ==========================================================
     AUTH
     ========================================================== */

  const {
    user,
    isAuthenticated,
    loading,
  } = useAuth();

  const [
    fullName,
    setFullName,
  ] =
    useState<string | null>(
      null
    );

  /* ==========================================================
     GREETING
     ========================================================== */

  const [
    greeting,
    setGreeting,
  ] =
    useState(
      getGreeting()
    );

  /* ==========================================================
     SOS ANIMATION
     ========================================================== */

  const pulseOne =
    useRef(
      new Animated.Value(0)
    ).current;

  const pulseTwo =
    useRef(
      new Animated.Value(0)
    ).current;

  useEffect(() => {
    const createPulse =
      (
        value:
          Animated.Value
      ) =>
        Animated.loop(
          Animated.sequence([
            Animated.timing(
              value,
              {
                toValue: 1,

                duration: 1800,

                easing:
                  Easing.out(
                    Easing.ease
                  ),

                useNativeDriver:
                  true,
              }
            ),

            Animated.timing(
              value,
              {
                toValue: 0,

                duration: 0,

                useNativeDriver:
                  true,
              }
            ),
          ])
        );

    const first =
      createPulse(
        pulseOne
      );

    const second =
      createPulse(
        pulseTwo
      );

    first.start();

    const secondTimer =
      setTimeout(() => {
        second.start();
      }, 900);

    return () => {
      clearTimeout(
        secondTimer
      );

      first.stop();

      second.stop();
    };
  }, [
    pulseOne,
    pulseTwo,
  ]);

  const pulseOneScale =
    pulseOne.interpolate({
      inputRange: [
        0,
        1,
      ],

      outputRange: [
        1,
        1.38,
      ],
    });

  const pulseOneOpacity =
    pulseOne.interpolate({
      inputRange: [
        0,
        0.3,
        1,
      ],

      outputRange: [
        0.24,
        0.14,
        0,
      ],
    });

  const pulseTwoScale =
    pulseTwo.interpolate({
      inputRange: [
        0,
        1,
      ],

      outputRange: [
        1,
        1.38,
      ],
    });

  const pulseTwoOpacity =
    pulseTwo.interpolate({
      inputRange: [
        0,
        0.3,
        1,
      ],

      outputRange: [
        0.18,
        0.1,
        0,
      ],
    });

  /* ==========================================================
     UPDATE GREETING
     ========================================================== */

  useEffect(() => {
    const updateGreeting =
      () => {
        setGreeting(
          getGreeting()
        );
      };

    updateGreeting();

    const timer =
      setInterval(
        updateGreeting,
        60000
      );

    return () => {
      clearInterval(
        timer
      );
    };
  }, []);

  /* ==========================================================
     LOAD USER PROFILE
     ========================================================== */

  useEffect(() => {
    if (
      !isAuthenticated
    ) {
      setFullName(
        null
      );

      return;
    }

    async function loadProfile() {
      try {
        const response =
          await getMyProfile();

        setFullName(
          response.data.fullName
        );
      } catch {
        const metadataName =
          user?.user_metadata
            ?.full_name;

        if (
          typeof metadataName ===
            "string" &&
          metadataName.trim()
        ) {
          setFullName(
            metadataName.trim()
          );
        }
      }
    }

    loadProfile();
  }, [
    isAuthenticated,
    user?.id,
  ]);

  /* ==========================================================
     USER NAME
     ========================================================== */

  const displayName =
    fullName?.trim() ||
    "";

  /* ==========================================================
     NAVIGATION
     ========================================================== */

  const openSOS = () => {
    router.push(
      "/report/sos-countdown"
    );
  };

  const openContacts =
    () => {
      if (
        isAuthenticated
      ) {
        router.push(
          "/trusted-contacts"
        );
      } else {
        router.push(
          "/auth/sign-in"
        );
      }
    };

  const openReports =
    () => {
      if (
        isAuthenticated
      ) {
        router.push(
          "/(tabs)/reports"
        );
      } else {
        router.push(
          "/auth/sign-in"
        );
      }
    };

  /* ==========================================================
     UI
     ========================================================== */

  return (
    <SafeAreaView
      edges={["top"]}
      className="flex-1"
      style={{
        backgroundColor:
          HEADER_PURPLE,
      }}
    >
      <StatusBar
        barStyle="light-content"
        backgroundColor={
          HEADER_PURPLE
        }
      />

      <View
        className="flex-1"
        style={{
          backgroundColor:
            HEADER_PURPLE,
        }}
      >
        {/* ==================================================
            COMPACT PURPLE HEADER
            ================================================== */}

        <View
          className="px-5 pb-5 pt-3"
          style={{
            backgroundColor:
              HEADER_PURPLE,
          }}
        >
          <View className="flex-row items-center justify-between">
            {/* =============================================
                GREETING
                ============================================= */}

            <View className="flex-1 pr-4">
              <Text
                numberOfLines={1}
                className="text-[13px] font-medium text-white/90"
              >
                {isAuthenticated &&
                !loading &&
                displayName
                  ? `Hi ${displayName},`
                  : "Hi there,"}
              </Text>

              <Text
                numberOfLines={1}
                className="mt-1 text-[20px] font-bold leading-[25px] text-white"
              >
                {greeting}
              </Text>
            </View>

            {/* =============================================
                SMALL SAFEHER LOGO
                ============================================= */}

            <Image
              source={
                HOME_LOGO
              }
              resizeMode="contain"
              className="h-[28px] w-[88px]"
            />
          </View>
        </View>

        {/* ==================================================
            WHITE MAIN BODY
            ================================================== */}

        <View
          className="flex-1 overflow-hidden rounded-t-[30px]"
          style={{
            backgroundColor:
              PAGE_BACKGROUND,
          }}
        >
          <ScrollView
            className="flex-1"
            showsVerticalScrollIndicator={
              false
            }
            contentContainerStyle={{
              paddingBottom: 35,
            }}
          >
            {/* ==================================================
                SOS MAIN AREA
                ================================================== */}

            <View className="px-5 pt-6">
              {/* ===============================================
                  SOS TITLE
                  =============================================== */}

              <View className="items-center">
                <View className="flex-row items-center">
                  <View
                    className="mr-2 h-2 w-2 rounded-full"
                    style={{
                      backgroundColor:
                        SOS_RED,
                    }}
                  />

                  <Text
                    className="text-[8px] font-bold uppercase tracking-[1.2px]"
                    style={{
                      color:
                        SOS_RED,
                    }}
                  >
                    Emergency SOS
                  </Text>
                </View>

                <Text className="mt-2 text-[18px] font-bold text-app-text">
                  Need help now?
                </Text>
              </View>

              {/* ===============================================
                  SOS BUTTON AREA
                  =============================================== */}

              <View className="h-[192px] items-center justify-center">
                {/* WAVE 1 */}

                <Animated.View
                  pointerEvents="none"
                  className="absolute h-[132px] w-[132px] rounded-full bg-[#F87171]"
                  style={{
                    opacity:
                      pulseOneOpacity,

                    transform: [
                      {
                        scale:
                          pulseOneScale,
                      },
                    ],
                  }}
                />

                {/* WAVE 2 */}

                <Animated.View
                  pointerEvents="none"
                  className="absolute h-[132px] w-[132px] rounded-full bg-[#FCA5A5]"
                  style={{
                    opacity:
                      pulseTwoOpacity,

                    transform: [
                      {
                        scale:
                          pulseTwoScale,
                      },
                    ],
                  }}
                />

                {/* =============================================
                    STATIC OUTER CIRCLE
                    ============================================= */}

                <View
                  pointerEvents="none"
                  style={{
                    position:
                      "absolute",

                    width: 158,

                    height: 158,

                    borderRadius:
                      79,

                    backgroundColor:
                      "#FFF7F6",

                    borderWidth:
                      1,

                    borderColor:
                      "#F0C6C3",
                  }}
                />

                {/* =============================================
                    LARGE TOUCH TARGET
                    ============================================= */}

                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Emergency SOS"
                  accessibilityHint="Starts the emergency three second countdown"
                  onPress={
                    openSOS
                  }
                  style={({
                    pressed,
                  }) => ({
                    width: 178,

                    height: 178,

                    borderRadius:
                      89,

                    alignItems:
                      "center",

                    justifyContent:
                      "center",

                    transform: [
                      {
                        scale:
                          pressed
                            ? 0.96
                            : 1,
                      },
                    ],
                  })}
                >
                  {/* ===========================================
                      VISIBLE SOS BUTTON
                      =========================================== */}

                  <View
                    style={{
                      width: 130,

                      height: 130,

                      borderRadius:
                        65,

                      shadowColor:
                        "#7A1713",

                      shadowOffset: {
                        width: 0,
                        height: 6,
                      },

                      shadowOpacity:
                        0.28,

                      shadowRadius:
                        10,

                      elevation:
                        10,
                    }}
                  >
                    <LinearGradient
                      colors={[
                        "#EF473E",
                        SOS_RED,
                        SOS_RED_DARK,
                      ]}
                      start={{
                        x: 0,
                        y: 0,
                      }}
                      end={{
                        x: 1,
                        y: 1,
                      }}
                      style={{
                        width:
                          130,

                        height:
                          130,

                        borderRadius:
                          65,

                        alignItems:
                          "center",

                        justifyContent:
                          "center",
                      }}
                    >
                      <Ionicons
                        name="warning"
                        size={28}
                        color="#FFFFFF"
                      />

                      <Text className="mt-1 text-[24px] font-bold leading-[26px] text-white">
                        SOS
                      </Text>

                      <Text className="mt-1 text-[7px] font-bold tracking-[0.8px] text-white/90">
                        TAP NOW
                      </Text>
                    </LinearGradient>
                  </View>
                </Pressable>
              </View>

              {/* ===============================================
                  SOS INFORMATION
                  =============================================== */}

              <View className="items-center">
                <Text className="text-[9.5px] font-semibold text-app-text">
                  Tap once in an emergency
                </Text>

                <View
                  className="mt-2 flex-row items-center rounded-full px-3 py-1.5"
                  style={{
                    backgroundColor:
                      SOS_SOFT,
                  }}
                >
                  <Ionicons
                    name="time-outline"
                    size={13}
                    color={
                      SOS_RED_DARK
                    }
                  />

                  <Text
                    className="ml-1.5 text-[8px] font-semibold"
                    style={{
                      color:
                        SOS_RED_DARK,
                    }}
                  >
                    3-second safety countdown
                  </Text>
                </View>
              </View>
            </View>

            {/* ==================================================
                PAGE CONTENT
                ================================================== */}

            <View className="px-5">
              {/* =================================================
                  GUEST
                  ================================================= */}

              {!isAuthenticated &&
                !loading && (
                  <View className="mt-5 flex-row items-center rounded-[16px] border border-app-border bg-white px-3.5 py-3">
                    <View className="h-10 w-10 items-center justify-center rounded-[12px] bg-light-purple">
                      <Ionicons
                        name="person-outline"
                        size={18}
                        color={
                          COLORS.primary
                        }
                      />
                    </View>

                    <View className="ml-3 flex-1 pr-2">
                      <Text className="text-[10.5px] font-semibold text-app-text">
                        Using SafeHer as a guest
                      </Text>

                      <Text
                        numberOfLines={1}
                        className="mt-0.5 text-[8.5px] text-app-muted"
                      >
                        Sign in for trusted contacts and reports.
                      </Text>
                    </View>

                    <Pressable
                      onPress={() =>
                        router.push(
                          "/auth/sign-in"
                        )
                      }
                      className="rounded-[11px] bg-primary px-3 py-2.5 active:opacity-70"
                    >
                      <Text className="text-[8.5px] font-bold text-white">
                        Sign In
                      </Text>
                    </Pressable>
                  </View>
                )}

              {/* =================================================
                  SAFETY TOOLS
                  ================================================= */}

              <View className="mt-7">
                <SectionHeader
                  title="Safety tools"
                  subtitle="Quick access when you need help."
                />

                <View className="flex-row flex-wrap justify-between">
                  {/* NEARBY HELP */}

                  <QuickAction
                    title="Nearby Help"
                    subtitle="Police, hospitals and support nearby"
                    icon="location-outline"
                    onPress={() =>
                      router.push(
                        "/help"
                      )
                    }
                  />

                  {/* TRUSTED CONTACTS */}

                  <QuickAction
                    title="Trusted Contacts"
                    subtitle={
                      isAuthenticated
                        ? "Manage emergency contacts"
                        : "Sign in to manage contacts"
                    }
                    icon="people-outline"
                    onPress={
                      openContacts
                    }
                  />

                  {/* REPORT */}

                  <QuickAction
                    title="Report Incident"
                    subtitle="Report a safety concern"
                    icon="document-text-outline"
                    tone="pink"
                    onPress={() =>
                      router.push(
                        "/report"
                      )
                    }
                  />

                  {/* ALERTS */}

                  <QuickAction
                    title="Safety Alerts"
                    subtitle="Check nearby safety alerts"
                    icon="notifications-outline"
                    tone="pink"
                    onPress={() =>
                      router.push(
                        "/(tabs)/alerts"
                      )
                    }
                  />
                </View>
              </View>

              {/* =================================================
                  PLAN JOURNEY
                  ================================================= */}

              <View className="mt-5">
                <SectionHeader
                  title="Plan your journey"
                  subtitle="Check your route before travelling."
                />

                <Pressable
                  onPress={() =>
                    router.push(
                      "/route"
                    )
                  }
                  className="overflow-hidden rounded-[20px] active:opacity-90"
                >
                  <LinearGradient
                    colors={[
                      COLORS.primaryDark,
                      COLORS.primary,
                      COLORS.pink,
                    ]}
                    start={{
                      x: 0,
                      y: 0.5,
                    }}
                    end={{
                      x: 1,
                      y: 0.5,
                    }}
                    style={{
                      minHeight:
                        86,
                    }}
                  >
                    <View className="flex-1 flex-row items-center px-4">
                      <View className="h-12 w-12 items-center justify-center rounded-[15px] bg-white/15">
                        <Ionicons
                          name="navigate"
                          size={22}
                          color="#FFFFFF"
                        />
                      </View>

                      <View className="ml-3 flex-1">
                        <Text className="text-[13px] font-bold text-white">
                          Plan a Safer Route
                        </Text>

                        <Text className="mt-1 text-[8.5px] text-white/80">
                          Compare safer routes before you go.
                        </Text>
                      </View>

                      <View className="h-9 w-9 items-center justify-center rounded-full bg-white/15">
                        <Ionicons
                          name="chevron-forward"
                          size={18}
                          color="#FFFFFF"
                        />
                      </View>
                    </View>
                  </LinearGradient>
                </Pressable>
              </View>

              {/* =================================================
                  ACTIVITY
                  ================================================= */}

              <View className="mt-6">
                <SectionHeader
                  title="Your activity"
                />

                <Pressable
                  onPress={
                    openReports
                  }
                  className="flex-row items-center rounded-[18px] border border-app-border bg-white px-4 py-4 active:opacity-70"
                >
                  <View className="h-11 w-11 items-center justify-center rounded-[14px] bg-light-purple">
                    <Ionicons
                      name={
                        isAuthenticated
                          ? "folder-open-outline"
                          : "lock-closed-outline"
                      }
                      size={20}
                      color={
                        COLORS.primary
                      }
                    />
                  </View>

                  <View className="ml-3 flex-1">
                    <Text className="text-[11.5px] font-semibold text-app-text">
                      My Reports
                    </Text>

                    <Text className="mt-1 text-[8.5px] text-app-muted">
                      {isAuthenticated
                        ? "View and track submitted reports"
                        : "Sign in to access your reports"}
                    </Text>
                  </View>

                  <Ionicons
                    name="chevron-forward"
                    size={17}
                    color="#958B9B"
                  />
                </Pressable>
              </View>
            </View>
          </ScrollView>
        </View>
      </View>
    </SafeAreaView>
  );
}