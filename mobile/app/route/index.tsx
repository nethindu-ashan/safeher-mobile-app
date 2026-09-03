import {
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import ScreenHeader from "../../src/components/ScreenHeader";
import { COLORS } from "../../src/constants/theme";

export default function RouteScreen() {
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: COLORS.background,
      }}
    >
      <View className="flex-1 px-5">
        <ScreenHeader title="Safe Route" />

        <View className="mt-4 flex-1 items-center justify-center rounded-2xl bg-light-purple">
          <Text className="font-semibold text-primary">
            Route Map
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}