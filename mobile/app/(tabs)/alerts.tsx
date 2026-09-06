import { useEffect, useState } from "react";
import { Pressable, Text, View, ScrollView } from "react-native";
import * as Location from "expo-location";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import EmptyState from "../../src/components/EmptyState";
import ErrorState from "../../src/components/ErrorState";
import LoadingState from "../../src/components/LoadingState";
import SafetyAlertCard from "../../src/components/SafetyAlertCard";
import { COLORS } from "../../src/constants/theme";
import { getNearbyIncidents } from "../../src/services/incidentService";

export default function AlertsScreen() {
  const [incidents, setIncidents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadNearbyIncidents = async () => {
    try {
      setLoading(true);
      setError("");

      const { status } =
        await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        setError("Location permission is required to view nearby alerts.");
        return;
      }

      const location = await Location.getCurrentPositionAsync({});

      const { latitude, longitude } = location.coords;

      console.log("My location:", latitude, longitude);

      const response = await getNearbyIncidents(
        latitude,
        longitude
      );

      console.log("Nearby incidents:", response.data);

      setIncidents(response.data);
    } catch (error) {
      console.error("Failed to load nearby incidents:", error);
      setError("Unable to load safety alerts.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadTimeout = setTimeout(() => {
      void loadNearbyIncidents();
    }, 0);

    return () => clearTimeout(loadTimeout);
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
      <View className="flex-1 px-6 pt-2">
        <View className="flex-row items-center justify-between">
          <Pressable
            accessibilityLabel="Go back"
            className="h-10 w-10 items-center justify-center rounded-full border border-app-border bg-white"
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={21} color={COLORS.text} />
          </Pressable>

          <Text className="text-xl font-bold text-app-text">
            Safety Alerts
          </Text>

          <Pressable
            accessibilityLabel="Filter alerts"
            className="h-10 w-10 items-center justify-center rounded-full border border-app-border bg-white"
          >
            <Ionicons name="options-outline" size={20} color={COLORS.text} />
          </Pressable>
        </View>

        <View className="mt-5 flex-row items-center rounded-xl border border-red-100 bg-red-50 px-3 py-3">
          <View className="mr-3 h-2.5 w-2.5 rounded-full bg-red-500" />
          <Text className="text-sm font-semibold text-red-500">
            {incidents.length} alerts in your immediate radius
          </Text>
        </View>

        {loading && (
          <View className="flex-1 justify-center">
            <LoadingState message="Finding nearby safety alerts..." />
          </View>
        )}

        {!loading && error && (
          <View className="flex-1 justify-center">
            <ErrorState message={error} />
          </View>
        )}

        {!loading && !error && incidents.length === 0 && (
          <View className="flex-1 justify-center">
            <EmptyState message="No safety alerts nearby." />
          </View>
        )}

        {!loading && !error && incidents.length > 0 && (
          <ScrollView
            className="mt-4"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingTop: 1, paddingBottom: 24 }}
          >
            {incidents.map((incident) => (
              <SafetyAlertCard
                key={incident.id}
                incident={incident}
                onPress={() => {
                  router.push(`/alerts/${incident.id}`);
                }}
              />
            ))}
          </ScrollView>
        )}
      </View>
    </SafeAreaView>
  );
}