import { Ionicons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";
import MapView, { Marker } from "react-native-maps";

import { COLORS } from "../constants/theme";
import type { DeviceLocation } from "../hooks/useLocation";

type Props = {
  location: DeviceLocation | null;
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
};

export default function LocationCard({
  location,
  loading = false,
  error,
  onRetry,
}: Props) {
  const hasError = Boolean(error);

  // Loading state
  if (loading) {
    return (
      <View className="rounded-3xl border border-app-border bg-white p-4 shadow-sm">
        <View className="flex-row items-center">
          <View className="h-11 w-11 items-center justify-center rounded-2xl bg-light-purple">
            <Ionicons
              name="navigate-outline"
              size={22}
              color={COLORS.primary}
            />
          </View>

          <View className="ml-3">
            <Text className="text-sm font-bold text-app-text">
              Finding your location
            </Text>

            <Text className="mt-1 text-xs text-app-muted">
              Preparing nearby safety services...
            </Text>
          </View>
        </View>
      </View>
    );
  }

  // Error state
  if (hasError || !location) {
    return (
      <View className="rounded-3xl border border-app-border bg-white p-4 shadow-sm">
        <View className="flex-row items-center">
          <View className="h-11 w-11 items-center justify-center rounded-2xl bg-sos-light">
            <Ionicons
              name="location-outline"
              size={22}
              color={COLORS.error}
            />
          </View>

          <View className="ml-3 flex-1">
            <Text className="text-sm font-bold text-app-text">
              Location unavailable
            </Text>

            <Text className="mt-1 text-xs leading-4 text-app-muted">
              {error ?? "Unable to access your current location."}
            </Text>
          </View>
        </View>

        {onRetry && (
          <Pressable
            onPress={onRetry}
            className="mt-3 self-start rounded-full bg-light-purple px-4 py-2 active:opacity-70"
          >
            <Text className="text-xs font-bold text-primary">
              Try Again
            </Text>
          </Pressable>
        )}
      </View>
    );
  }

  // Location map preview
  return (
    <View className="overflow-hidden rounded-3xl border border-app-border bg-white shadow-sm">
      <View className="flex-row items-center px-4 py-3">
        <View className="h-10 w-10 items-center justify-center rounded-2xl bg-light-purple">
          <Ionicons
            name="location"
            size={20}
            color={COLORS.primary}
          />
        </View>

        <View className="ml-3 flex-1">
          <Text className="text-sm font-bold text-app-text">
            Your Location
          </Text>

          <Text className="mt-1 text-xs text-app-muted">
            Nearby services are based on this location
          </Text>
        </View>
      </View>

      <MapView
        style={{
          width: "100%",
          height: 180,
        }}
        initialRegion={{
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.012,
          longitudeDelta: 0.012,
        }}
        scrollEnabled={false}
        zoomEnabled={false}
        rotateEnabled={false}
        pitchEnabled={false}
      >
        <Marker
          coordinate={{
            latitude: location.latitude,
            longitude: location.longitude,
          }}
          title="Your Location"
        />
      </MapView>
    </View>
  );
}