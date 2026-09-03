import {
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import ScreenHeader from "../../src/components/ScreenHeader";
import { COLORS } from "../../src/constants/theme";

export default function ReportIncidentScreen() {
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: COLORS.background,
      }}
    >
      <View className="flex-1 px-5">
        <ScreenHeader title="Report an Incident" />

        <Text className="mt-4 text-app-muted">
          Private incident reporting screen will be implemented here.
        </Text>
      </View>
    </SafeAreaView>
  );
}