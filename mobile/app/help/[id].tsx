import { useLocalSearchParams } from "expo-router";
import {
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import AppCard from "../../src/components/AppCard";
import ScreenHeader from "../../src/components/ScreenHeader";
import { COLORS } from "../../src/constants/theme";

export default function ServiceDetailsScreen() {
  const { id } = useLocalSearchParams();

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: COLORS.background,
      }}
    >
      <View className="flex-1 px-5">
        <ScreenHeader title="Service Details" />

        <AppCard>
          <Text className="font-semibold text-app-text">
            Support Service
          </Text>

          <Text className="mt-2 text-sm text-app-muted">
            Service ID: {String(id ?? "")}
          </Text>
        </AppCard>
      </View>
    </SafeAreaView>
  );
}