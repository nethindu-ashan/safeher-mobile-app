import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import {
  Pressable,
  ScrollView,
  Switch,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { COLORS } from "../../src/constants/theme";

export default function NotificationPreferencesScreen() {
  const [nearbyAlerts, setNearbyAlerts] = useState(true);
  const [emergencyAlerts, setEmergencyAlerts] = useState(true);
  const [communityUpdates, setCommunityUpdates] = useState(true);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: COLORS.background,
      }}
    >
      <View className="flex-1">
        {/* Header */}
        <View className="flex-row items-center justify-between px-5 py-3">
          <Pressable
            accessibilityLabel="Go back"
            className="h-10 w-10 items-center justify-center rounded-full border border-app-border bg-white"
            onPress={() => router.back()}
          >
            <Ionicons
              name="arrow-back"
              size={21}
              color={COLORS.text}
            />
          </Pressable>

          <Text className="text-xl font-bold text-app-text">
            Notification Preferences
          </Text>

          <View className="h-10 w-10" />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingTop: 24,
            paddingBottom: 32,
          }}
        >
          {/* Introduction */}
          <Text className="text-2xl font-bold text-app-text">
            Safety Notifications
          </Text>

          <Text className="mt-2 text-sm leading-5 text-app-muted">
            Choose which safety notifications you would like to receive.
          </Text>

          {/* Preferences */}
          <View className="mt-6 overflow-hidden rounded-2xl border border-app-border bg-white">
            {/* Nearby Alerts */}
            <View className="px-4 py-4">
              <View className="flex-row items-center justify-between">
                <View className="flex-1 pr-4">
                  <Text className="text-base font-semibold text-app-text">
                    Nearby Safety Alerts
                  </Text>

                  <Text className="mt-1 text-sm leading-5 text-app-muted">
                    Receive alerts about safety incidents reported near you.
                  </Text>
                </View>

                <Switch
                  value={nearbyAlerts}
                  onValueChange={setNearbyAlerts}
                  trackColor={{
                    false: "#D9D4DC",
                    true: COLORS.primary,
                  }}
                  thumbColor="#FFFFFF"
                />
              </View>
            </View>

            <View className="mx-4 border-t border-app-border" />

            {/* Emergency Alerts */}
            <View className="px-4 py-4">
              <View className="flex-row items-center justify-between">
                <View className="flex-1 pr-4">
                  <Text className="text-base font-semibold text-app-text">
                    Emergency Alerts
                  </Text>

                  <Text className="mt-1 text-sm leading-5 text-app-muted">
                    Receive important emergency safety notifications.
                  </Text>
                </View>

                <Switch
                  value={emergencyAlerts}
                  onValueChange={setEmergencyAlerts}
                  trackColor={{
                    false: "#D9D4DC",
                    true: COLORS.primary,
                  }}
                  thumbColor="#FFFFFF"
                />
              </View>
            </View>

            <View className="mx-4 border-t border-app-border" />

            {/* Community Updates */}
            <View className="px-4 py-4">
              <View className="flex-row items-center justify-between">
                <View className="flex-1 pr-4">
                  <Text className="text-base font-semibold text-app-text">
                    Community Safety Updates
                  </Text>

                  <Text className="mt-1 text-sm leading-5 text-app-muted">
                    Get updates about safety activity in your area.
                  </Text>
                </View>

                <Switch
                  value={communityUpdates}
                  onValueChange={setCommunityUpdates}
                  trackColor={{
                    false: "#D9D4DC",
                    true: COLORS.primary,
                  }}
                  thumbColor="#FFFFFF"
                />
              </View>
            </View>
          </View>

          {/* Save Button */}
          <Pressable
            className="mt-8 items-center rounded-xl bg-primary px-5 py-4 active:opacity-80"
            onPress={() => {
              console.log({
                nearbyAlerts,
                emergencyAlerts,
                communityUpdates,
              });
            }}
          >
            <Text className="text-base font-bold text-white">
              Save Preferences
            </Text>
          </Pressable>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}