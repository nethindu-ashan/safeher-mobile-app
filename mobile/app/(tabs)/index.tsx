import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import {
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import QuickActionCard from "../../src/components/QuickActionCard";
import { COLORS } from "../../src/constants/theme";

export default function HomeScreen() {
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: COLORS.background,
      }}
    >
      <ScrollView
        className="flex-1 px-5"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 24,
        }}
      >
        <View className="pt-4">
          <Text className="text-3xl font-bold text-app-text">
            SafeHer
          </Text>

          <Text className="mt-1 text-app-muted">
            Together for Safer Journeys
          </Text>
        </View>

        <View className="mt-8 items-center">
          <Pressable
            onPress={() => router.push("/report/sos")}
            className="h-32 w-32 items-center justify-center rounded-full bg-sos-light active:opacity-80"
          >
            <View className="h-24 w-24 items-center justify-center rounded-full bg-sos">
              <Text className="text-2xl font-bold text-white">
                SOS
              </Text>
            </View>
          </Pressable>

          <Text className="mt-3 text-sm text-app-muted">
            Emergency Assistance
          </Text>
        </View>

        <View className="mt-8 flex-row items-center justify-between">
          <Text className="text-lg font-bold text-app-text">
            Quick Actions
          </Text>

          <Ionicons
            name="shield-checkmark-outline"
            size={20}
            color={COLORS.primary}
          />
        </View>

        <View className="mt-4 flex-row flex-wrap justify-between">
          <QuickActionCard
            title="Report Incident"
            subtitle="Report privately"
            icon="document-text-outline"
            onPress={() => router.push("/report")}
          />

          <QuickActionCard
            title="Safe Route"
            subtitle="Find route information"
            icon="navigate-outline"
            onPress={() => router.push("/route")}
          />

          <QuickActionCard
            title="Safety Alerts"
            subtitle="Nearby community alerts"
            icon="notifications-outline"
            onPress={() => router.push("/alerts")}
          />

          <QuickActionCard
            title="Nearby Help"
            subtitle="Police, hospitals & support"
            icon="medical-outline"
            onPress={() => router.push("/help")}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}