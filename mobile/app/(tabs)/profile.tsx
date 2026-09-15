import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import {
  Pressable,
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

        {/* Profile */}
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
        </View>

        {/* Settings */}
        <View className="mt-10">
          <Text className="mb-3 text-base font-bold text-app-text">
            Settings
          </Text>

          <Pressable
            className="flex-row items-center rounded-2xl border border-app-border bg-white px-4 py-4 active:opacity-70"
            onPress={() => router.push("/settings/notifications")}
          >
            <View className="h-10 w-10 items-center justify-center rounded-full bg-light-purple">
              <Ionicons
                name="notifications-outline"
                size={21}
                color={COLORS.primary}
              />
            </View>

            <View className="ml-3 flex-1">
              <Text className="text-base font-semibold text-app-text">
                Notification Preferences
              </Text>

              <Text className="mt-1 text-sm text-app-muted">
                Manage your safety notifications
              </Text>
            </View>

            <Ionicons
              name="chevron-forward"
              size={20}
              color="#A995B5"
            />
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}