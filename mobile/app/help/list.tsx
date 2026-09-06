import { Ionicons } from "@expo/vector-icons";
import {
  router,
  useLocalSearchParams,
} from "expo-router";
import * as Location from "expo-location";
import { useEffect, useState } from "react";

import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";

import MapView, {
  Marker,
} from "react-native-maps";

import {
  SafeAreaView,
} from "react-native-safe-area-context";

import ScreenHeader from "../../src/components/ScreenHeader";

import {
  COLORS,
} from "../../src/constants/theme";

import {
  getNearbySupportServices,
} from "../../src/services/supportService";

import type {
  NearbySupportService,
  SupportCategory,
} from "../../src/types/support";


// ============================================================
// SUPPORTED CATEGORIES
// ============================================================

const SUPPORT_CATEGORIES: SupportCategory[] = [
  "POLICE",
  "HOSPITAL",
  "PHARMACY",
  "COMMUNITY_CENTER",
  "WOMENS_SUPPORT",
  "SAFE_SPACE",
];


// Check whether URL category is valid
function isSupportCategory(
  value: string
): value is SupportCategory {
  return SUPPORT_CATEGORIES.includes(
    value as SupportCategory
  );
}


// ============================================================
// SCREEN
// ============================================================

export default function NearbySupportListScreen() {
  const params =
    useLocalSearchParams<{
      type?: string;
      title?: string;
      lat?: string;
      lng?: string;
    }>();


  // Selected support category
  const requestedType =
    params.type &&
    isSupportCategory(
      params.type.toUpperCase()
    )
      ? (params.type.toUpperCase() as SupportCategory)
      : "POLICE";


  const screenTitle =
    typeof params.title === "string"
      ? `${params.title} Nearby`
      : "Nearby Services";


  // ==========================================================
  // STATE
  // ==========================================================

  const [latitude, setLatitude] =
    useState<number | null>(null);

  const [longitude, setLongitude] =
    useState<number | null>(null);

  const [services, setServices] =
    useState<NearbySupportService[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);


  // ==========================================================
  // LOAD NEARBY SERVICES
  // ==========================================================

  const loadNearbyServices = async () => {
    try {
      setLoading(true);
      setError(null);

      let currentLatitude: number;
      let currentLongitude: number;


      // ------------------------------------------------------
      // USE LOCATION FROM PREVIOUS SCREEN
      // ------------------------------------------------------

      if (
        params.lat !== undefined &&
        params.lng !== undefined
      ) {
        const parsedLatitude =
          Number(params.lat);

        const parsedLongitude =
          Number(params.lng);

        if (
          !Number.isFinite(parsedLatitude) ||
          !Number.isFinite(parsedLongitude)
        ) {
          throw new Error(
            "Invalid current location"
          );
        }

        currentLatitude =
          parsedLatitude;

        currentLongitude =
          parsedLongitude;
      }

      // ------------------------------------------------------
      // OTHERWISE GET DEVICE CURRENT LOCATION
      // ------------------------------------------------------

      else {
        const permission =
          await Location
            .requestForegroundPermissionsAsync();

        if (
          permission.status !==
          Location.PermissionStatus.GRANTED
        ) {
          throw new Error(
            "Location permission is required to find nearby services."
          );
        }

        const currentLocation =
          await Location
            .getCurrentPositionAsync({
              accuracy:
                Location.Accuracy.Balanced,
            });

        currentLatitude =
          currentLocation.coords.latitude;

        currentLongitude =
          currentLocation.coords.longitude;
      }


      // Save user location
      setLatitude(currentLatitude);
      setLongitude(currentLongitude);


      // ------------------------------------------------------
      // CALL SUPPORT BACKEND
      // ------------------------------------------------------

      const response =
        await getNearbySupportServices(
          currentLatitude,
          currentLongitude,
          requestedType,
          5000
        );

      setServices(response.data);
    } catch (error) {
      console.error(
        "Nearby services error:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Unable to load nearby services."
      );
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    void loadNearbyServices();
  }, [
    params.lat,
    params.lng,
    requestedType,
  ]);


  // ==========================================================
  // OPEN SERVICE DETAILS
  // ==========================================================

  const openServiceDetails = (
    service: NearbySupportService
  ) => {
    if (
      latitude === null ||
      longitude === null
    ) {
      return;
    }

    router.push({
      pathname: "/help/[id]",

      params: {
        // Google Place ID
        id: service.placeId,

        // User's current location
        lat: String(latitude),
        lng: String(longitude),

        category:
          service.category,
      },
    });
  };


  // ==========================================================
  // LOADING UI
  // ==========================================================

  if (loading) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor:
            COLORS.background,
        }}
      >
        <View className="flex-1 px-5">
          <ScreenHeader
            title={screenTitle}
          />

          <View className="flex-1 items-center justify-center">
            <ActivityIndicator
              size="large"
              color={COLORS.primary}
            />

            <Text className="mt-4 text-sm text-app-muted">
              Finding nearby services...
            </Text>
          </View>
        </View>
      </SafeAreaView>
    );
  }


  // ==========================================================
  // ERROR UI
  // ==========================================================

  if (error) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor:
            COLORS.background,
        }}
      >
        <View className="flex-1 px-5">
          <ScreenHeader
            title={screenTitle}
          />

          <View className="flex-1 items-center justify-center px-5">
            <View className="h-14 w-14 items-center justify-center rounded-full bg-sos-light">
              <Ionicons
                name="alert-circle-outline"
                size={30}
                color={COLORS.error}
              />
            </View>

            <Text className="mt-4 text-center text-base font-semibold text-app-text">
              Unable to load nearby services
            </Text>

            <Text className="mt-2 text-center text-sm leading-5 text-app-muted">
              {error}
            </Text>

            <Pressable
              onPress={() => {
                void loadNearbyServices();
              }}
              className="mt-5 rounded-full bg-primary px-6 py-3 active:opacity-80"
            >
              <Text className="font-semibold text-white">
                Try Again
              </Text>
            </Pressable>
          </View>
        </View>
      </SafeAreaView>
    );
  }


  // ==========================================================
  // MAIN UI
  // ==========================================================

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor:
          COLORS.background,
      }}
    >
      <ScrollView
        className="flex-1 px-5"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 30,
        }}
      >
        <ScreenHeader
          title={screenTitle}
        />


        {/* ====================================================
            CURRENT LOCATION LABEL
        ==================================================== */}

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


        {/* ====================================================
            MAP
        ==================================================== */}

        {latitude !== null &&
          longitude !== null && (
            <View
              className="overflow-hidden rounded-3xl border border-app-border"
              style={{
                height: 230,
              }}
            >
              <MapView
                style={{
                  width: "100%",
                  height: "100%",
                }}
                initialRegion={{
                  latitude,
                  longitude,
                  latitudeDelta: 0.05,
                  longitudeDelta: 0.05,
                }}
                showsUserLocation
                showsMyLocationButton
              >
                {services.map(
                  (service) => {
                    if (
                      service.latitude ===
                        null ||
                      service.longitude ===
                        null
                    ) {
                      return null;
                    }

                    return (
                      <Marker
                        key={
                          service.placeId
                        }
                        coordinate={{
                          latitude:
                            service.latitude,
                          longitude:
                            service.longitude,
                        }}
                        title={
                          service.name
                        }
                        description={
                          service.address
                        }
                        onCalloutPress={() =>
                          openServiceDetails(
                            service
                          )
                        }
                      />
                    );
                  }
                )}
              </MapView>
            </View>
          )}


        {/* ====================================================
            LIST HEADER
        ==================================================== */}

        <View className="mt-6 flex-row items-center justify-between">
          <View>
            <Text className="text-lg font-bold text-app-text">
              Nearby Services
            </Text>

            <Text className="mt-1 text-xs text-app-muted">
              Sorted closest first
            </Text>
          </View>

          <View className="rounded-full bg-light-purple px-3 py-2">
            <Text className="text-xs font-semibold text-primary">
              {services.length} found
            </Text>
          </View>
        </View>


        {/* ====================================================
            EMPTY STATE
        ==================================================== */}

        {services.length === 0 && (
          <View className="mt-5 items-center rounded-2xl border border-app-border bg-white p-8">
            <View className="h-14 w-14 items-center justify-center rounded-full bg-light-purple">
              <Ionicons
                name="search-outline"
                size={27}
                color={COLORS.primary}
              />
            </View>

            <Text className="mt-4 text-base font-semibold text-app-text">
              No services found
            </Text>

            <Text className="mt-2 text-center text-sm leading-5 text-app-muted">
              No matching support services were found within 5 km of your current location.
            </Text>
          </View>
        )}


        {/* ====================================================
            SERVICE LIST
        ==================================================== */}

        <View className="mt-4">
          {services.map(
            (service) => (
              <Pressable
                key={service.placeId}
                onPress={() =>
                  openServiceDetails(
                    service
                  )
                }
                className="mb-3 rounded-2xl border border-app-border bg-white p-4 active:opacity-80"
              >
                <View className="flex-row items-start">

                  {/* Service icon */}
                  <View className="h-12 w-12 items-center justify-center rounded-full bg-light-purple">
                    <Ionicons
                      name="location-outline"
                      size={23}
                      color={
                        COLORS.primary
                      }
                    />
                  </View>


                  {/* Main information */}
                  <View className="ml-3 flex-1">
                    <Text
                      className="text-base font-semibold text-app-text"
                      numberOfLines={1}
                    >
                      {service.name}
                    </Text>

                    <Text
                      className="mt-1 text-xs leading-4 text-app-muted"
                      numberOfLines={2}
                    >
                      {service.address}
                    </Text>


                    {/* Distance + status */}
                    <View className="mt-3 flex-row flex-wrap items-center">

                      {service.distanceKm !==
                        null && (
                        <View className="mr-4 flex-row items-center">
                          <Ionicons
                            name="navigate-outline"
                            size={14}
                            color={
                              COLORS.primary
                            }
                          />

                          <Text className="ml-1 text-xs font-medium text-app-muted">
                            {
                              service.distanceKm
                            }{" "}
                            km
                          </Text>
                        </View>
                      )}


                      {service.isOpen !==
                        null && (
                        <View className="flex-row items-center">
                          <View
                            className={`mr-1.5 h-2 w-2 rounded-full ${
                              service.isOpen
                                ? "bg-success"
                                : "bg-danger"
                            }`}
                          />

                          <Text
                            className={`text-xs font-semibold ${
                              service.isOpen
                                ? "text-success"
                                : "text-danger"
                            }`}
                          >
                            {service.isOpen
                              ? "Open"
                              : "Closed"}
                          </Text>
                        </View>
                      )}
                    </View>


                    {/* Rating */}
                    {service.rating !==
                      null && (
                        <View className="mt-2 flex-row items-center">
                          <Ionicons
                            name="star"
                            size={14}
                            color="#F59E0B"
                          />

                          <Text className="ml-1 text-xs text-app-muted">
                            {
                              service.rating
                            }

                            {service.userRatingCount >
                              0 &&
                              ` (${service.userRatingCount})`}
                          </Text>
                        </View>
                      )}
                  </View>


                  {/* Arrow */}
                  <Ionicons
                    name="chevron-forward-outline"
                    size={20}
                    color={
                      COLORS.textSecondary
                    }
                  />
                </View>
              </Pressable>
            )
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}