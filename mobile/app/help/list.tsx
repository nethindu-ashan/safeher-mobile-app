import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import { SafeAreaView } from "react-native-safe-area-context";

import NearbyEmptyState from "../../src/components/NearbyEmptyState";
import ScreenHeader from "../../src/components/ScreenHeader";
import ServiceCard from "../../src/components/ServiceCard";
import {
  getNearbyCategory,
} from "../../src/constants/nearbyCategories";
import { COLORS } from "../../src/constants/theme";
import { useLocation } from "../../src/hooks/useLocation";
import {
  getNearbyHelpServices,
} from "../../src/services/nearbyHelpService";
import type { NearbyHelpService } from "../../src/types/nearbyHelp";

export default function NearbyHelpListScreen() {
  const params = useLocalSearchParams<{
    type?: string;
    title?: string;
  }>();
  const category = getNearbyCategory(params.type);
  const { location, loading: locationLoading, error: locationError, reload } =
    useLocation();
  const [services, setServices] = useState<NearbyHelpService[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!category || locationLoading || !location) {
      if (locationError) {
        setLoading(false);
        setError(locationError);
      }
      return;
    }

    let active = true;
    setLoading(true);
    setError(null);

    void getNearbyHelpServices(
      location.latitude,
      location.longitude,
      category.type
    )
      .then((response) => {
        if (active) {
          setServices(response.data);
        }
      })
      .catch((caughtError) => {
        if (active) {
          setError(
            caughtError instanceof Error
              ? caughtError.message
              : "Unable to load nearby services."
          );
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [category, location, locationError, locationLoading]);

  const openDetails = (service: NearbyHelpService) => {
    const placeId = service.placeId ?? service.id;
    if (!placeId || !location) {
      return;
    }

    router.push({
      pathname: "/help/[id]",
      params: {
        id: placeId,
        lat: String(location.latitude),
        lng: String(location.longitude),
        category: service.category,
      },
    });
  };

  const title = category?.title ?? params.title ?? "Nearby Services";

  if (!category) {
    return (
      <SafeAreaView
        style={{ flex: 1, backgroundColor: COLORS.background }}
      >
        <View className="flex-1 px-5">
          <ScreenHeader title="Nearby Services" />
          <View className="flex-1 items-center justify-center">
            <NearbyEmptyState
              title="Category unavailable"
              message="Please return and choose a supported service category."
            />
          </View>
        </View>
      </SafeAreaView>
    );
  }

  if (loading || locationLoading) {
    return (
      <SafeAreaView
        style={{ flex: 1, backgroundColor: COLORS.background }}
      >
        <View className="flex-1 px-5">
          <ScreenHeader title={`${title} Nearby`} />
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" color={COLORS.primary} />
            <Text className="mt-4 text-sm text-app-muted">
              Finding nearby services...
            </Text>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView
        style={{ flex: 1, backgroundColor: COLORS.background }}
      >
        <View className="flex-1 px-5">
          <ScreenHeader title={`${title} Nearby`} />
          <View className="flex-1 items-center justify-center px-5">
            <Ionicons
              name="alert-circle-outline"
              size={42}
              color={COLORS.error}
            />
            <Text className="mt-4 text-center text-base font-bold text-app-text">
              Unable to load nearby services
            </Text>
            <Text className="mt-2 text-center text-sm leading-5 text-app-muted">
              {error}
            </Text>
            <Pressable
              onPress={() => {
                setError(null);
                void reload();
              }}
              className="mt-5 rounded-full bg-primary px-6 py-3 active:opacity-80"
            >
              <Text className="font-semibold text-white">Try Again</Text>
            </Pressable>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: COLORS.background }}
    >
      <ScrollView
        className="flex-1 px-5"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 30 }}
      >
        <ScreenHeader title={`${title} Nearby`} />

        <View className="mb-4 flex-row items-center">
          <Ionicons
            name="location-outline"
            size={17}
            color={COLORS.primary}
          />
          <Text className="ml-2 text-sm text-app-muted">
            Based on your current location
          </Text>
        </View>

        {location && (
          <View className="overflow-hidden rounded-2xl border border-app-border">
            <MapView
              style={{ width: "100%", height: 220 }}
              initialRegion={{
                latitude: location.latitude,
                longitude: location.longitude,
                latitudeDelta: 0.05,
                longitudeDelta: 0.05,
              }}
              showsUserLocation
              showsMyLocationButton
            >
              {services.map((service) =>
                service.latitude !== null &&
                service.longitude !== null ? (
                  <Marker
                    key={service.id}
                    coordinate={{
                      latitude: service.latitude,
                      longitude: service.longitude,
                    }}
                    title={service.name}
                    description={service.address}
                    onCalloutPress={() => openDetails(service)}
                  />
                ) : null
              )}
            </MapView>
          </View>
        )}

        <View className="mt-6 flex-row items-center justify-between">
          <View>
            <Text className="text-lg font-bold text-app-text">
              Nearby Services
            </Text>
            <Text className="mt-1 text-xs text-app-muted">
              Sorted closest first
            </Text>
          </View>
          <Text className="rounded-full bg-light-purple px-3 py-2 text-xs font-semibold text-primary">
            {services.length} found
          </Text>
        </View>

        <View className="mt-4">
          {services.length === 0 ? (
            <NearbyEmptyState />
          ) : (
            services.map((service) => (
              <ServiceCard
                key={service.id}
                service={service}
                onPress={() => openDetails(service)}
              />
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}