import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import * as Location from "expo-location";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  ActivityIndicator,
  Alert,
  Pressable,
  StatusBar,
  Text,
  View,
} from "react-native";

import {
  SafeAreaView,
} from "react-native-safe-area-context";

import {
  activateSOS,
} from "../../src/services/sosService";

/* ============================================================
   COLORS
   ============================================================ */

const SOS_RED = "#D92D20";

/* ============================================================
   SCREEN
   ============================================================ */

export default function SOSCountdownScreen() {
  /* ==========================================================
     STATE
     ========================================================== */

  const [
    countdown,
    setCountdown,
  ] = useState(3);

  const [
    activating,
    setActivating,
  ] = useState(false);

  /*
   * Prevent SOS API from
   * being called more than once.
   */
  const activationStarted =
    useRef(false);

  /* ==========================================================
     ACTIVATE SOS
     ========================================================== */

  const activateEmergencySOS =
    useCallback(
      async () => {
        try {
          setActivating(true);

          /* ===============================================
             REQUEST LOCATION PERMISSION
             =============================================== */

          const {
            status,
          } =
            await Location.requestForegroundPermissionsAsync();

          if (
            status !== "granted"
          ) {
            Alert.alert(
              "Location Required",
              "Location permission is required to activate Emergency SOS."
            );

            router.back();

            return;
          }

          /* ===============================================
             GET CURRENT LOCATION
             =============================================== */

          const location =
            await Location.getCurrentPositionAsync({
              accuracy:
                Location.Accuracy.High,
            });

          /* ===============================================
             CREATE SOS DATA
             =============================================== */

          const payload = {
            latitude:
              location.coords
                .latitude,

            longitude:
              location.coords
                .longitude,

            message:
              "I need emergency assistance.",
          };

          console.log(
            "Activating SOS:",
            payload
          );

          /* ===============================================
             SEND TO BACKEND
             =============================================== */

          const response =
            await activateSOS(
              payload
            );

          console.log(
            "SOS response:",
            response
          );

          /* ===============================================
             VALIDATE RESPONSE
             =============================================== */

          if (
            !response?.data?.id
          ) {
            throw new Error(
              "SOS was created but no SOS ID was returned."
            );
          }

          /* ===============================================
             GO TO ACTIVE SOS
             =============================================== */

          router.replace({
            pathname:
              "/report/sos-active",

            params: {
              id:
                response.data.id,

              latitude:
                String(
                  response.data
                    .latitude
                ),

              longitude:
                String(
                  response.data
                    .longitude
                ),

              status:
                response.data
                  .status ??
                "ACTIVE",
            },
          });
        } catch (error) {
          console.error(
            "SOS activation error:",
            error
          );

          const message =
            error instanceof Error
              ? error.message
              : "Unable to activate SOS.";

          Alert.alert(
            "SOS Activation Failed",
            message,
            [
              {
                text: "OK",

                onPress: () => {
                  router.back();
                },
              },
            ]
          );
        } finally {
          setActivating(false);
        }
      },
      []
    );

  /* ==========================================================
     COUNTDOWN
     ========================================================== */

  useEffect(() => {
    if (
      countdown <= 0
    ) {
      if (
        !activationStarted
          .current
      ) {
        activationStarted.current =
          true;

        activateEmergencySOS();
      }

      return;
    }

    const timer =
      setTimeout(() => {
        setCountdown(
          (current) =>
            current - 1
        );
      }, 1000);

    return () => {
      clearTimeout(timer);
    };
  }, [
    countdown,
    activateEmergencySOS,
  ]);

  /* ==========================================================
     CANCEL SOS
     ========================================================== */

  const cancelCountdown =
    () => {
      /*
       * Stop SOS from activating
       * if user cancels.
       */
      activationStarted.current =
        true;

      router.back();
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
          SOS_RED,
      }}
    >
      <StatusBar
        barStyle="light-content"
        backgroundColor={
          SOS_RED
        }
      />

      <View className="flex-1 px-6">
        {/* ==================================================
            MAIN
            ================================================== */}

        <View className="flex-1 items-center justify-center">
          {/* WARNING ICON */}

          <View className="h-16 w-16 items-center justify-center rounded-full bg-white/15">
            <Ionicons
              name="warning"
              size={30}
              color="#FFFFFF"
            />
          </View>

          {/* TITLE */}

          <Text className="mt-5 text-center text-[22px] font-bold text-white">
            Emergency SOS
          </Text>

          {/* ===============================================
              COUNTDOWN STATE
              =============================================== */}

          {!activating ? (
            <>
              <Text className="mt-2 text-center text-[11px] text-white/85">
                SOS will activate in
              </Text>

              {/* COUNTDOWN */}

              <Text className="mt-5 text-[96px] font-bold leading-[110px] text-white">
                {countdown}
              </Text>

              <Text className="text-[10px] font-semibold uppercase tracking-[1.5px] text-white/80">
                Seconds
              </Text>
            </>
          ) : (
            /* =============================================
               ACTIVATING STATE
               ============================================= */

            <View className="mt-10 items-center">
              <ActivityIndicator
                size="large"
                color="#FFFFFF"
              />

              <Text className="mt-5 text-[15px] font-semibold text-white">
                Activating SOS...
              </Text>

              <Text className="mt-2 text-center text-[10px] text-white/80">
                Getting your location
                and sending the alert.
              </Text>
            </View>
          )}
        </View>

        {/* ==================================================
            CANCEL BUTTON
            ================================================== */}

        {!activating && (
          <View className="pb-5">
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Cancel SOS"
              onPress={
                cancelCountdown
              }
              className="h-[54px] flex-row items-center justify-center rounded-[16px] bg-white active:opacity-85"
            >
              <Ionicons
                name="close"
                size={20}
                color={
                  SOS_RED
                }
              />

              <Text
                className="ml-2 text-[13px] font-bold"
                style={{
                  color:
                    SOS_RED,
                }}
              >
                Cancel SOS
              </Text>
            </Pressable>

            <Text className="mt-3 text-center text-[8.5px] text-white/75">
              SOS activates automatically
              when the countdown reaches zero.
            </Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}