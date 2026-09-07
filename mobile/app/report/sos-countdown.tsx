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
  Alert,
  Pressable,
  Text,
  View,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import { activateSOS } from "../../src/services/sosService";

import { COLORS } from "../../src/constants/theme";

export default function SOSCountdownScreen() {
  const [countdown, setCountdown] = useState(3);

  const [activating, setActivating] = useState(false);

  // Prevents the SOS API from being called more than once
  const activationStarted = useRef(false);

  /*
   * Activate Emergency SOS
   * 1. Ask for location permission
   * 2. Get current GPS location
   * 3. Send SOS data to backend
   * 4. Navigate to active SOS screen
   */
  const activateEmergencySOS = useCallback(async () => {
    try {
      setActivating(true);

      // Ask user for location permission
      const { status } =
        await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        Alert.alert(
          "Location Required",
          "Location permission is required to activate Emergency SOS."
        );

        router.back();
        return;
      }

      // Get current phone location
      const location =
        await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });

      // Data sent to backend
      const payload = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        message: "I need emergency assistance.",
      };

      console.log("Activating SOS:", payload);

      // POST /api/sos
      const response = await activateSOS(payload);

      console.log("SOS response:", response);

      // Make sure backend returned an SOS ID
      if (!response?.data?.id) {
        throw new Error(
          "SOS was created but no SOS ID was returned."
        );
      }

      // Go to SOS Active screen
      router.replace({
        pathname: "/report/sos-active",

        params: {
          id: response.data.id,

          latitude: String(
            response.data.latitude
          ),

          longitude: String(
            response.data.longitude
          ),

          status:
            response.data.status ?? "ACTIVE",
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
  }, []);


  useEffect(() => {
    if (countdown <= 0) {
      if (!activationStarted.current) {
        activationStarted.current = true;

        activateEmergencySOS();
      }

      return;
    }

    const timer = setTimeout(() => {
      setCountdown(
        (current) => current - 1
      );
    }, 1000);

    return () => {
      clearTimeout(timer);
    };
  }, [
    countdown,
    activateEmergencySOS,
  ]);

  // Cancel before the SOS becomes active
  const cancelCountdown = () => {
    router.back();
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: COLORS.sos,
      }}
    >
      <View className="flex-1 items-center justify-center px-6">
        <Ionicons
          name="warning-outline"
          size={50}
          color="#FFFFFF"
        />

        <Text className="mt-6 text-center text-2xl font-bold text-white">
          Emergency SOS
        </Text>

        <Text className="mt-3 text-center text-white">
          {activating
            ? "Activating Emergency SOS..."
            : "SOS will activate in"}
        </Text>

        {/* Countdown */}
        {!activating && (
          <Text className="mt-8 text-8xl font-bold text-white">
            {countdown}
          </Text>
        )}

        {/* Loading message */}
        {activating && (
          <Text className="mt-8 text-lg font-semibold text-white">
            Getting your location...
          </Text>
        )}

        {/* Cancel before activation */}
        {!activating && (
          <Pressable
            onPress={cancelCountdown}
            className="mt-14 w-full items-center rounded-full bg-white py-4 active:opacity-80"
          >
            <Text className="font-bold text-sos">
              Cancel SOS
            </Text>
          </Pressable>
        )}
      </View>
    </SafeAreaView>
  );
}