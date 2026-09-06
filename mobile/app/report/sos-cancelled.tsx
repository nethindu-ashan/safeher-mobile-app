import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

import {
  Text,
  View,
} from "react-native";

import {
  SafeAreaView,
} from "react-native-safe-area-context";

import PrimaryButton from "../../src/components/PrimaryButton";

import {
  COLORS,
} from "../../src/constants/theme";

export default function SOSCancelledScreen() {
  const goHome = () => {
    router.replace("/");
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: COLORS.background,
      }}
    >
      <View className="flex-1 items-center justify-center px-6">
        <View className="h-20 w-20 items-center justify-center rounded-full bg-light-purple">
          <Ionicons
            name="checkmark"
            size={38}
            color={COLORS.primary}
          />
        </View>

        <Text className="mt-7 text-center text-2xl font-bold text-app-text">
          SOS Cancelled
        </Text>

        <Text className="mt-3 text-center leading-5 text-app-muted">
          Your emergency SOS is no longer active.
        </Text>

        <View className="mt-10 w-full">
          <PrimaryButton
            title="Back to Home"
            onPress={goHome}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}