import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";

import {
  useEffect,
  useRef,
} from "react";

import {
  Animated,
  Easing,
  Pressable,
  StatusBar,
  Text,
  View,
} from "react-native";

import {
  SafeAreaView,
} from "react-native-safe-area-context";

import ScreenHeader from "../../src/components/ScreenHeader";

import {
  COLORS,
} from "../../src/constants/theme";

/* ============================================================
   COLORS
   ============================================================ */

const BACKGROUND = "#FFFBFD";

const SOS_RED = "#E43C36";

const SOS_RED_DARK = "#B91F1A";

/* ============================================================
   SCREEN
   ============================================================ */

export default function SOSScreen() {
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

  /* ==========================================================
     START WAVES
     ========================================================== */

  useEffect(() => {
    const firstWave =
      Animated.loop(
        Animated.sequence([
          Animated.timing(
            pulseOne,
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
            pulseOne,
            {
              toValue: 0,

              duration: 0,

              useNativeDriver:
                true,
            }
          ),
        ])
      );

    const secondWave =
      Animated.loop(
        Animated.sequence([
          Animated.delay(
            900
          ),

          Animated.timing(
            pulseTwo,
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
            pulseTwo,
            {
              toValue: 0,

              duration: 0,

              useNativeDriver:
                true,
            }
          ),
        ])
      );

    firstWave.start();

    secondWave.start();

    return () => {
      firstWave.stop();

      secondWave.stop();
    };
  }, [
    pulseOne,
    pulseTwo,
  ]);

  /* ==========================================================
     WAVE VALUES
     ========================================================== */

  const pulseOneScale =
    pulseOne.interpolate({
      inputRange: [
        0,
        1,
      ],

      outputRange: [
        1,
        1.45,
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
        0.28,
        0.16,
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
        1.45,
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
        0.21,
        0.13,
        0,
      ],
    });

  /* ==========================================================
     SOS ACTION
     ========================================================== */

  const handleSOSPress = () => {
    router.push(
      "/report/sos-countdown"
    );
  };

  /* ==========================================================
     UI
     ========================================================== */

  return (
    <SafeAreaView
      edges={[
        "top",
        "bottom",
      ]}
      className="flex-1"
      style={{
        backgroundColor:
          BACKGROUND,
      }}
    >
      <StatusBar
        barStyle="dark-content"
        backgroundColor={
          BACKGROUND
        }
      />

      {/* ==================================================
          HEADER
          ================================================== */}

      <View className="px-5">
        <ScreenHeader
          title="Emergency SOS"
        />

        <Text className="-mt-1 text-[10.5px] leading-[16px] text-app-muted">
          Fast emergency access when
          you need help.
        </Text>
      </View>

      {/* ==================================================
          MAIN CONTENT
          ================================================== */}

      <View className="flex-1 px-5">
        <View className="flex-1 items-center justify-center">
          {/* =================================================
              EMERGENCY LABEL
              ================================================= */}

          <View className="items-center">
            <View className="flex-row items-center rounded-full bg-[#FFF0EF] px-3 py-2">
              <View className="mr-2 h-2 w-2 rounded-full bg-[#E43C36]" />

              <Text className="text-[8.5px] font-bold uppercase tracking-[1px] text-[#C52A24]">
                Emergency
              </Text>
            </View>

            <Text className="mt-4 text-center text-[21px] font-bold leading-[27px] text-app-text">
              Need immediate help?
            </Text>

            <Text className="mt-2 max-w-[285px] text-center text-[10.5px] leading-[16px] text-app-muted">
              Tap the SOS button to
              start the emergency
              countdown.
            </Text>
          </View>

          {/* =================================================
              SOS INTERACTION AREA
              ================================================= */}

          <View className="mt-5 h-[240px] w-full items-center justify-center">
            {/* WAVE ONE */}

            <Animated.View
              pointerEvents="none"
              className="absolute h-[140px] w-[140px] rounded-full bg-[#F87171]"
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

            {/* WAVE TWO */}

            <Animated.View
              pointerEvents="none"
              className="absolute h-[140px] w-[140px] rounded-full bg-[#FCA5A5]"
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

            {/* STATIC SOFT RING */}

            <View
              pointerEvents="none"
              className="absolute h-[160px] w-[160px] rounded-full border border-[#F3C5C3] bg-[#FFF7F7]"
            />

            {/* =================================================
                LARGE TOUCH TARGET
                ================================================= */}

            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Emergency SOS"
              accessibilityHint="Starts the emergency three second countdown"
              onPress={
                handleSOSPress
              }
              className="h-[180px] w-[180px] items-center justify-center rounded-full"
              style={({
                pressed,
              }) => ({
                transform: [
                  {
                    scale:
                      pressed
                        ? 0.97
                        : 1,
                  },
                ],
              })}
            >
              {/* ===============================================
                  VISIBLE BUTTON
                  =============================================== */}

              <View
                className="h-[132px] w-[132px] rounded-full"
                style={{
                  shadowColor:
                    "#7E1713",

                  shadowOffset: {
                    width: 0,
                    height: 7,
                  },

                  shadowOpacity:
                    0.3,

                  shadowRadius:
                    11,

                  elevation: 11,
                }}
              >
                <LinearGradient
                  colors={[
                    "#F6534A",
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
                    width: 132,
                    height: 132,

                    borderRadius:
                      66,

                    alignItems:
                      "center",

                    justifyContent:
                      "center",
                  }}
                >
                  <Ionicons
                    name="warning"
                    size={29}
                    color="#FFFFFF"
                  />

                  <Text className="mt-1 text-[23px] font-bold leading-[25px] text-white">
                    SOS
                  </Text>

                  <Text className="mt-1 text-[7.5px] font-semibold tracking-[0.8px] text-white/90">
                    TAP NOW
                  </Text>
                </LinearGradient>
              </View>
            </Pressable>
          </View>

          {/* =================================================
              COUNTDOWN MESSAGE
              ================================================= */}

          <View className="items-center">
            <Text className="text-center text-[10.5px] font-semibold text-app-text">
              One tap starts the
              emergency process
            </Text>

            <View className="mt-3 flex-row items-center rounded-full bg-[#FFF1F0] px-4 py-2">
              <Ionicons
                name="time-outline"
                size={14}
                color="#B42318"
              />

              <Text className="ml-2 text-[8.5px] font-semibold text-[#B42318]">
                3-second countdown
                before continuing
              </Text>
            </View>
          </View>

          {/* =================================================
              SAFETY INFO CARD
              ================================================= */}

          <View className="mt-7 w-full flex-row items-start rounded-[16px] bg-light-purple px-4 py-3.5">
            <View className="h-9 w-9 items-center justify-center rounded-[11px] bg-white">
              <Ionicons
                name="shield-checkmark-outline"
                size={17}
                color={
                  COLORS.primary
                }
              />
            </View>

            <View className="ml-3 flex-1">
              <Text className="text-[10px] font-semibold text-app-text">
                Designed for quick access
              </Text>

              <Text className="mt-1 text-[8.8px] leading-[13px] text-app-muted">
                You do not need to tap
                exactly on the red
                circle. The surrounding
                area is also touchable
                for faster one-hand use.
              </Text>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}