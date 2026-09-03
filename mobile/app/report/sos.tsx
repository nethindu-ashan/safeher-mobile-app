import {
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import ScreenHeader from "../../src/components/ScreenHeader";
import { COLORS } from "../../src/constants/theme";

export default function SOSScreen() {
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
          <View className="h-40 w-40 items-center justify-center rounded-full bg-sos-light">
            <View className="h-28 w-28 items-center justify-center rounded-full bg-sos">
              <Text className="text-3xl font-bold text-white">
                SOS
              </Text>
            </View>
          </View>

          <Text className="mt-6 text-app-muted">
            Emergency SOS
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}