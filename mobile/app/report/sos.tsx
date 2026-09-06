import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

import {
  Pressable,
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

export default function SOSScreen() {
  const handleSOSPress = () => {
    router.push("/report/sos-countdown");
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: COLORS.background,
      }}
    >
      <View className="flex-1 px-5">
        <ScreenHeader title="Emergency SOS" />

        <View className="flex-1 items-center justify-center">
          <Text className="text-center text-2xl font-bold text-app-text">
            Need Emergency Help?
          </Text>

          <Text className="mt-3 px-6 text-center leading-5 text-app-muted">
            Press the SOS button to create an emergency
            assistance alert using your current location.
          </Text>

          <Pressable
            onPress={handleSOSPress}
            className="mt-12 h-48 w-48 items-center justify-center rounded-full bg-sos-light active:opacity-80"
          >
            <View className="h-36 w-36 items-center justify-center rounded-full bg-sos">
              <Ionicons
                name="alert-outline"
                size={36}
                color="#FFFFFF"
              />

              <Text className="mt-1 text-3xl font-bold text-white">
                SOS
              </Text>
            </View>
          </Pressable>

          <Text className="mt-6 text-sm text-app-muted">
            Tap only when you need emergency assistance
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}