import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import {  useEffect, useState } from "react";
import {
  Pressable,
  ScrollView,
  Switch,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { COLORS } from "../../src/constants/theme";
import {
  getNotificationPreferences,
  updateNotificationPreferences,
} from "../../src/services/notificationPreferenceService";

export default function NotificationPreferencesScreen() {
  const [nearbyAlerts, setNearbyAlerts] = useState(false);
  const [emergencyAlerts, setEmergencyAlerts] = useState(false);
  const [communityUpdates, setCommunityUpdates] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);


  useEffect(() => {
  async function loadPreferences() {
    try {
      const preferences = await getNotificationPreferences();

      setNearbyAlerts(preferences.nearbyAlerts);
      setEmergencyAlerts(preferences.emergencyAlerts);
      setCommunityUpdates(preferences.communityUpdates);
    } catch (error) {
      console.error("Failed to load notification preferences:", error);
    } finally {
      setLoading(false);
    }
  }

  loadPreferences();
}, []);

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
                    false: "#B8ADBF",
                    true: COLORS.primary,
                  }}
                  thumbColor="#FFFFFF"
                  ios_backgroundColor="#B8ADBF"
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
                    false: "#B8ADBF",
                    true: COLORS.primary,
                  }}
                  thumbColor="#FFFFFF"
                  ios_backgroundColor="#B8ADBF"
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
                    false: "#B8ADBF",
                    true: COLORS.primary,
                  }}
                  thumbColor="#FFFFFF"
                  ios_backgroundColor="#B8ADBF"
                />
              </View>
            </View>
          </View>

          {/* Save Button */}
          <Pressable
            className="mt-8 items-center rounded-xl bg-primary px-5 py-4 active:opacity-80"
            onPress={async () => {
                  try {
                      setSaving(true);

                      await updateNotificationPreferences({
                              nearbyAlerts,
                              emergencyAlerts,
                              communityUpdates,
                      });

                    console.log("Notification preferences saved successfully");
                  } catch (error) {
                    console.error("Failed to save notification preferences:", error);
                  } finally {
                    setSaving(false);
                  }
            }}
          >
            <Text className="text-base font-bold text-white">
              {saving ? "Saving..." : "Save Preferences"}
            </Text>
          </Pressable>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}