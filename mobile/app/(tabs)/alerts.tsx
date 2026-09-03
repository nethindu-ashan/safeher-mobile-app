import {
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import EmptyState from "../../src/components/EmptyState";
import { COLORS } from "../../src/constants/theme";

export default function AlertsScreen() {
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: COLORS.background,
      }}
    >
      <View className="flex-1 px-5 pt-4">
        <Text className="text-2xl font-bold text-app-text">
          Safety Alerts
        </Text>

        <Text className="mt-1 text-app-muted">
          Community safety information near you
        </Text>

        <View className="flex-1 justify-center">
          <EmptyState message="No safety alerts loaded yet." />
        </View>
      </View>
    </SafeAreaView>
  );
}