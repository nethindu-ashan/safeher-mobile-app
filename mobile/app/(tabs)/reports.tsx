import { router } from "expo-router";
import {
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import EmptyState from "../../src/components/EmptyState";
import PrimaryButton from "../../src/components/PrimaryButton";
import { COLORS } from "../../src/constants/theme";

export default function ReportsScreen() {
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: COLORS.background,
      }}
    >
      <View className="flex-1 px-5 pt-4">
        <Text className="text-2xl font-bold text-app-text">
          Reports
        </Text>

        <Text className="mt-1 text-app-muted">
          Your incident reports
        </Text>

        <View className="flex-1 justify-center">
          <EmptyState message="No reports loaded yet." />
        </View>

        <View className="pb-5">
          <PrimaryButton
            title="Report an Incident"
            onPress={() => router.push("/report")}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}