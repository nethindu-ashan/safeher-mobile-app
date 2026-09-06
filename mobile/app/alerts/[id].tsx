import { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import MapView, { Marker } from "react-native-maps";
import { router, useLocalSearchParams } from "expo-router";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import ErrorState from "../../src/components/ErrorState";
import LoadingState from "../../src/components/LoadingState";
import { COLORS } from "../../src/constants/theme";
import { getIncidentById } from "../../src/services/incidentService";

type Incident = {
  id: string;
  category: string;
  description: string;
  latitude: number;
  longitude: number;
  incidentDatetime: string;
  createdAt: string;
  status: string;
  isAnonymous: boolean;
};

function getRelativeTime(dateString: string) {
  const minutes = Math.max(
    0,
    Math.floor((Date.now() - new Date(dateString).getTime()) / 60000)
  );

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes} min ago`;
  if (minutes < 1440) return `${Math.floor(minutes / 60)} hr ago`;
  return `${Math.floor(minutes / 1440)} day ago`;
}

function LocationPreview({
  latitude,
  longitude,
}: {
  latitude: number;
  longitude: number;
}) {
  return (
    <View className="mt-5 h-40 overflow-hidden rounded-2xl">
      <MapView
        style={{ flex: 1 }}
        initialRegion={{
          latitude,
          longitude,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        }}
        scrollEnabled={false}
        zoomEnabled={false}
        pitchEnabled={false}
        rotateEnabled={false}
      >
        <Marker
          coordinate={{
            latitude,
            longitude,
          }}
          title="Reported incident"
        />
      </MapView>
    </View>
  );
}

export default function AlertDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const [incident, setIncident] =
    useState<Incident | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadTimeout = setTimeout(() => {
      void (async () => {
        try {
          setLoading(true);
          setError("");

          if (!id) {
            setError("Invalid alert.");
            return;
          }

          const response = await getIncidentById(String(id));
          setIncident(response.data);
        } catch (error) {
          console.error("Failed to load incident:", error);
          setError("Unable to load alert details.");
        } finally {
          setLoading(false);
        }
      })();
    }, 0);

    return () => clearTimeout(loadTimeout);
  }, [id]);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: COLORS.background,
      }}
    >
      <View className="flex-1">
        <View className="flex-row items-center justify-between px-6 py-3">
          <Pressable
            accessibilityLabel="Go back"
            className="h-10 w-10 items-center justify-center rounded-full border border-app-border bg-white"
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={21} color={COLORS.text} />
          </Pressable>
          <Text className="text-xl font-bold text-app-text">Alert Details</Text>
          <View className="h-10 w-10" />
        </View>

        {loading && (
          <View className="flex-1 justify-center">
            <LoadingState message="Loading alert details..." />
          </View>
        )}

        {!loading && error && (
          <View className="flex-1 justify-center">
            <ErrorState message={error} />
          </View>
        )}

        {!loading && !error && incident && (
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 28 }}
          >
           

            <View className="px-6 pt-6">
              <Text className="text-2xl font-bold text-app-text">
                {incident.category}
              </Text>
              <View className="mt-2 flex-row items-center">
                <Text className="text-sm text-app-muted">
                  Nearby community report
                </Text>
                <Text className="mx-2 text-sm text-[#B8A8C0]">•</Text>
                <Text className="text-sm text-[#B8A8C0]">
                  {getRelativeTime(incident.incidentDatetime)}
                </Text>
              </View>

              <LocationPreview
                  latitude={incident.latitude}
                  longitude={incident.longitude}
               /> 

              <View className="mt-5 rounded-2xl border border-app-border bg-white px-4 py-4">
                <Text className="text-sm leading-5 text-app-muted">
                  {incident.description || "Community safety information has been reported in this area."}
                </Text>
                <View className="mt-3 flex-row items-center">
                  <Ionicons name="people-outline" size={18} color="#A995B5" />
                  <Text className="ml-2 text-xs font-bold text-app-text">
                    Community report submitted
                  </Text>
                </View>
              </View>

              <Text className="mt-5 text-base font-bold text-app-text">
                Community Updates
              </Text>
              <View className="mt-3 rounded-xl bg-[#F4F1F6] px-3 py-3">
                <View className="flex-row items-center">
                  <Text className="text-xs font-bold text-app-text">
                    Safety report
                  </Text>
                  <Text className="mx-2 text-xs text-app-text">•</Text>
                  <Text className="text-xs font-bold text-app-text">
                    {getRelativeTime(incident.createdAt)}
                  </Text>
                </View>
                <Text className="mt-2 text-sm leading-5 text-app-muted">
                  This alert was shared with the local community for awareness.
                </Text>
              </View>

              
            </View>
          </ScrollView>
        )}
      </View>
    </SafeAreaView>
  );
}