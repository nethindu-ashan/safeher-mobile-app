import { Ionicons } from "@expo/vector-icons";
import {
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { COLORS } from "../../src/constants/theme";

export default function ProfileScreen() {
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: COLORS.background,
      }}
    >
      <View className="flex-1 px-5 pt-4">
        <Text className="text-2xl font-bold text-app-text">
          Profile
        </Text>

        <View className="mt-8 items-center">
          <View className="h-20 w-20 items-center justify-center rounded-full bg-light-purple">
            <Ionicons
              name="person-outline"
              size={34}
              color={COLORS.primary}
            />
          </View>

          <Text className="mt-4 text-lg font-semibold text-app-text">
            SafeHer User
          </Text>

          <Text className="mt-1 text-app-muted">
            Profile features will be added later.
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}