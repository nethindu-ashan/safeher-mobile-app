import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import * as Location from "expo-location";

import {
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

import {
  SafeAreaView,
} from "react-native-safe-area-context";

import {
  activateSOS,
} from "../../src/services/sosService";

import {
  COLORS,
} from "../../src/constants/theme";

export default function SOSCountdownScreen() {
  const [countdown, setCountdown] =
    useState(3);

  const [activating, setActivating] =
    useState(false);

  const activationStarted =
    useRef(false);

  useEffect(() => {
    if (countdown <= 0) {
      if (!activationStarted.current) {
        activationStarted.current = true;

        activateEmergencySOS();
      }

      return;
    }

    const timer = setTimeout(() => {
      setCountdown((current) => current - 1);
    }, 1000);

    return () => {
      clearTimeout(timer);
    };
  }, [countdown]);

  const activateEmergencySOS = async () => {
    try {
      setActivating(true);

      // Ask for current-location permission
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

      // Get current GPS position
      const location =
        await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });

      const payload = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,

        message:
          "I need emergency assistance.",
      };

      // Send SOS to backend
      const response =
        await activateSOS(payload);

      if (!response?.data?.id) {
        throw new Error(
          "SOS was created but no SOS ID was returned."
        );
      }

      // Replace countdown screen with active screen
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
            response.data.status ??
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
  };

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

        {!activating && (
          <Text className="mt-8 text-8xl font-bold text-white">
            {countdown}
          </Text>
        )}

        {activating && (
          <Text className="mt-8 text-lg font-semibold text-white">
            Getting your location...
          </Text>
        )}

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