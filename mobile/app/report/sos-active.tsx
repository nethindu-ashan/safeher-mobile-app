import { Ionicons } from "@expo/vector-icons";

import {
  router,
  useLocalSearchParams,
} from "expo-router";

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
  useState,
} from "react";

import {
  cancelSOS,
} from "../../src/services/sosService";

import {
  COLORS,
} from "../../src/constants/theme";

export default function SOSActiveScreen() {
  const {
    id,
    latitude,
    longitude,
  } = useLocalSearchParams();

  const [cancelling, setCancelling] =
    useState(false);

  const handleCancelSOS = () => {
    Alert.alert(
      "Cancel Emergency SOS?",
      "Are you sure you want to cancel the active SOS alert?",
      [
        {
          text: "Keep Active",
          style: "cancel",
        },

        {
          text: "Cancel SOS",
          style: "destructive",

          onPress: confirmCancelSOS,
        },
      ]
    );
  };

  const confirmCancelSOS = async () => {
    const sosId =
      Array.isArray(id)
        ? id[0]
        : id;

    if (!sosId) {
      Alert.alert(
        "Error",
        "SOS ID is missing."
      );

      return;
    }

    try {
      setCancelling(true);

      await cancelSOS(sosId);

      router.replace({
        pathname: "/report/sos-cancelled",

        params: {
          id: sosId,
        },
      });
    } catch (error) {
      console.error(
        "SOS cancellation error:",
        error
      );

      const message =
        error instanceof Error
          ? error.message
          : "Unable to cancel SOS.";

      Alert.alert(
        "Cancellation Failed",
        message
      );
    } finally {
      setCancelling(false);
    }
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: COLORS.background,
      }}
    >
      <View className="flex-1 px-6">
        <View className="flex-1 items-center justify-center">
          <View className="h-32 w-32 items-center justify-center rounded-full bg-sos-light">
            <View className="h-24 w-24 items-center justify-center rounded-full bg-sos">
              <Ionicons
                name="alert"
                size={38}
                color="#FFFFFF"
              />
            </View>
          </View>

          <Text className="mt-7 text-2xl font-bold text-sos">
            SOS Active
          </Text>

          <Text className="mt-3 text-center leading-5 text-app-muted">
            Your emergency SOS has been recorded with
            your current location.
          </Text>

          <View className="mt-8 w-full rounded-2xl border border-app-border bg-white p-5">
            <Text className="text-xs font-medium uppercase text-app-muted">
              Status
            </Text>

            <Text className="mt-1 font-bold text-sos">
              ACTIVE
            </Text>

            {id && (
              <>
                <Text className="mt-5 text-xs font-medium uppercase text-app-muted">
                  SOS ID
                </Text>

                <Text className="mt-1 text-sm text-app-text">
                  {String(id)}
                </Text>
              </>
            )}

            {latitude && longitude && (
              <>
                <Text className="mt-5 text-xs font-medium uppercase text-app-muted">
                  Location
                </Text>

                <Text className="mt-1 text-sm text-app-text">
                  {String(latitude)},{" "}
                  {String(longitude)}
                </Text>
              </>
            )}
          </View>
        </View>

        <View className="pb-6">
          <Pressable
            onPress={handleCancelSOS}
            disabled={cancelling}
            className={`items-center rounded-full border border-sos py-4 ${
              cancelling
                ? "opacity-50"
                : "active:opacity-70"
            }`}
          >
            <Text className="font-bold text-sos">
              {cancelling
                ? "Cancelling..."
                : "Cancel SOS"}
            </Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}