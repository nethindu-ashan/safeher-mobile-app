import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";

import {
  ActivityIndicator,
  Alert,
  Linking,
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

import AppCard from "../../src/components/AppCard";
import ScreenHeader from "../../src/components/ScreenHeader";

import {
  COLORS,
} from "../../src/constants/theme";

import {
  getSupportPlaceDetails,
} from "../../src/services/supportService";

import type {
  SupportPlaceDetails,
} from "../../src/types/support";


// ============================================================
// SCREEN
// ============================================================

export default function ServiceDetailsScreen() {
  const params =
    useLocalSearchParams<{
      id?: string;
      lat?: string;
      lng?: string;
      category?: string;
    }>();


  // ==========================================================
  // STATE
  // ==========================================================

  const [service, setService] =
    useState<SupportPlaceDetails | null>(
      null
    );

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);


  // ==========================================================
  // LOAD SERVICE DETAILS
  // ==========================================================

  const loadServiceDetails =
    async () => {
      try {
        setLoading(true);
        setError(null);


        // Google Place ID is required
        if (
          !params.id ||
          typeof params.id !== "string"
        ) {
          throw new Error(
            "Support service ID is missing."
          );
        }


        // Current user location passed from list screen
        const latitude =
          params.lat !== undefined
            ? Number(params.lat)
            : undefined;

        const longitude =
          params.lng !== undefined
            ? Number(params.lng)
            : undefined;


        // Validate optional coordinates
        const hasValidLocation =
          typeof latitude === "number" &&
          Number.isFinite(latitude) &&
          typeof longitude === "number" &&
          Number.isFinite(longitude);


        // Call backend Place Details API
        const response =
          await getSupportPlaceDetails(
            params.id,
            hasValidLocation
              ? latitude
              : undefined,
            hasValidLocation
              ? longitude
              : undefined
          );


        setService(response.data);
      } catch (error) {
        console.error(
          "Support service details error:",
          error
        );

        setError(
          error instanceof Error
            ? error.message
            : "Unable to load support service details."
        );
      } finally {
        setLoading(false);
      }
    };


  useEffect(() => {
    void loadServiceDetails();
  }, [
    params.id,
    params.lat,
    params.lng,
  ]);


  // ==========================================================
  // CALL SERVICE
  // ==========================================================

  const handleCallService = async () => {
    if (!service?.phone) {
      Alert.alert(
        "Contact Unavailable",
        "A phone number is not available for this service."
      );

      return;
    }


    // Remove spaces/brackets/etc. while keeping +
    const cleanPhoneNumber =
      service.phone.replace(
        /[^0-9+]/g,
        ""
      );

    const phoneUrl =
      `tel:${cleanPhoneNumber}`;


    try {
      const supported =
        await Linking.canOpenURL(
          phoneUrl
        );

      if (!supported) {
        Alert.alert(
          "Unable to Call",
          "Phone calling is not supported on this device."
        );

        return;
      }

      await Linking.openURL(
        phoneUrl
      );
    } catch (error) {
      console.error(
        "Call service error:",
        error
      );

      Alert.alert(
        "Unable to Call",
        "Could not open the phone dialer."
      );
    }
  };


  // ==========================================================
  // GET ROUTE
  // ==========================================================

  const handleGetRoute = async () => {
    if (!service) {
      return;
    }


    try {
      /**
       * Prefer Google's own Maps URI when available.
       *
       * This opens the selected support service directly
       * in Google Maps.
       */
      if (service.googleMapsUri) {
        await Linking.openURL(
          service.googleMapsUri
        );

        return;
      }


      /**
       * Fallback:
       * Open Google Maps directions using destination
       * latitude and longitude.
       */
      if (
        service.latitude !== null &&
        service.longitude !== null
      ) {
        const directionsUrl =
          "https://www.google.com/maps/dir/?api=1" +
          `&destination=${service.latitude},${service.longitude}`;


        await Linking.openURL(
          directionsUrl
        );

        return;
      }


      Alert.alert(
        "Route Unavailable",
        "Location information is not available for this service."
      );
    } catch (error) {
      console.error(
        "Get route error:",
        error
      );

      Alert.alert(
        "Route Unavailable",
        "Unable to open directions for this service."
      );
    }
  };


  // ==========================================================
  // LOADING
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
            title="Service Details"
          />

          <View className="flex-1 items-center justify-center">
            <ActivityIndicator
              size="large"
              color={COLORS.primary}
            />

            <Text className="mt-4 text-sm text-app-muted">
              Loading service details...
            </Text>
          </View>
        </View>
      </SafeAreaView>
    );
  }


  // ==========================================================
  // ERROR
  // ==========================================================

  if (error || !service) {
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
            title="Service Details"
          />

          <View className="flex-1 items-center justify-center px-6">
            <View className="h-14 w-14 items-center justify-center rounded-full bg-sos-light">
              <Ionicons
                name="alert-circle-outline"
                size={30}
                color={COLORS.error}
              />
            </View>

            <Text className="mt-4 text-center text-base font-semibold text-app-text">
              Unable to load service
            </Text>

            <Text className="mt-2 text-center text-sm leading-5 text-app-muted">
              {error ??
                "Support service details are unavailable."}
            </Text>

            <Pressable
              onPress={() => {
                void loadServiceDetails();
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
          title="Service Details"
        />


        {/* ====================================================
            BASIC INFORMATION
        ==================================================== */}

        <AppCard>
          <View className="flex-row items-start">
            <View className="h-12 w-12 items-center justify-center rounded-full bg-light-purple">
              <Ionicons
                name="location-outline"
                size={24}
                color={COLORS.primary}
              />
            </View>

            <View className="ml-3 flex-1">
              <Text className="text-lg font-bold text-app-text">
                {service.name}
              </Text>

              {service.googleType && (
                <Text className="mt-1 text-xs font-medium uppercase text-primary">
                  {service.category}
                </Text>
              )}

              <View className="mt-3 flex-row items-start">
                <Ionicons
                  name="location-outline"
                  size={16}
                  color={
                    COLORS.textSecondary
                  }
                />

                <Text className="ml-2 flex-1 text-sm leading-5 text-app-muted">
                  {service.address}
                </Text>
              </View>
            </View>
          </View>


          {/* Distance + Status + Rating */}
          <View className="mt-4 flex-row flex-wrap items-center border-t border-app-border pt-4">

            {service.distanceKm !==
              null && (
              <View className="mr-5 flex-row items-center">
                <Ionicons
                  name="navigate-outline"
                  size={16}
                  color={COLORS.primary}
                />

                <Text className="ml-1.5 text-sm font-medium text-app-text">
                  {service.distanceKm} km
                </Text>
              </View>
            )}


            {service.isOpen !==
              null && (
              <View className="mr-5 flex-row items-center">
                <View
                  className={`mr-1.5 h-2 w-2 rounded-full ${
                    service.isOpen
                      ? "bg-success"
                      : "bg-danger"
                  }`}
                />

                <Text
                  className={`text-sm font-semibold ${
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


            {service.rating !==
              null && (
              <View className="flex-row items-center">
                <Ionicons
                  name="star"
                  size={15}
                  color="#F59E0B"
                />

                <Text className="ml-1 text-sm text-app-muted">
                  {service.rating}

                  {service.userRatingCount >
                    0 &&
                    ` (${service.userRatingCount})`}
                </Text>
              </View>
            )}
          </View>
        </AppCard>


        {/* ====================================================
            MAP
        ==================================================== */}

        {service.latitude !== null &&
          service.longitude !== null && (
            <View
              className="mb-4 overflow-hidden rounded-2xl border border-app-border"
              style={{
                height: 220,
              }}
            >
              <MapView
                style={{
                  width: "100%",
                  height: "100%",
                }}
                initialRegion={{
                  latitude:
                    service.latitude,
                  longitude:
                    service.longitude,
                  latitudeDelta:
                    0.015,
                  longitudeDelta:
                    0.015,
                }}
              >
                <Marker
                  coordinate={{
                    latitude:
                      service.latitude,
                    longitude:
                      service.longitude,
                  }}
                  title={service.name}
                  description={
                    service.address
                  }
                />
              </MapView>
            </View>
          )}


        {/* ====================================================
            CONTACT INFORMATION
        ==================================================== */}

        <AppCard>
          <Text className="text-base font-bold text-app-text">
            Contact Information
          </Text>


          {/* Phone */}
          <View className="mt-4 flex-row items-center">
            <View className="h-10 w-10 items-center justify-center rounded-full bg-light-purple">
              <Ionicons
                name="call-outline"
                size={19}
                color={COLORS.primary}
              />
            </View>

            <View className="ml-3 flex-1">
              <Text className="text-xs text-app-muted">
                Phone Number
              </Text>

              <Text className="mt-1 font-medium text-app-text">
                {service.phone ??
                  "Not available"}
              </Text>
            </View>
          </View>


          {/* Website */}
          {service.websiteUri && (
            <View className="mt-4 flex-row items-center">
              <View className="h-10 w-10 items-center justify-center rounded-full bg-light-purple">
                <Ionicons
                  name="globe-outline"
                  size={19}
                  color={
                    COLORS.primary
                  }
                />
              </View>

              <View className="ml-3 flex-1">
                <Text className="text-xs text-app-muted">
                  Website
                </Text>

                <Pressable
                  onPress={() => {
                    if (
                      service.websiteUri
                    ) {
                      void Linking.openURL(
                        service.websiteUri
                      );
                    }
                  }}
                >
                  <Text
                    className="mt-1 text-sm font-medium text-primary"
                    numberOfLines={1}
                  >
                    Open Website
                  </Text>
                </Pressable>
              </View>
            </View>
          )}
        </AppCard>


        {/* ====================================================
            OPENING HOURS
        ==================================================== */}

        <AppCard>
          <View className="flex-row items-center">
            <Ionicons
              name="time-outline"
              size={20}
              color={COLORS.primary}
            />

            <Text className="ml-2 text-base font-bold text-app-text">
              Opening Hours
            </Text>
          </View>


          {service.openingHours.length >
          0 ? (
            <View className="mt-4">
              {service.openingHours.map(
                (openingHour) => (
                  <Text
                    key={openingHour}
                    className="mb-2 text-sm leading-5 text-app-muted"
                  >
                    {openingHour}
                  </Text>
                )
              )}
            </View>
          ) : (
            <Text className="mt-3 text-sm text-app-muted">
              Opening hours are not available.
            </Text>
          )}
        </AppCard>


        {/* ====================================================
            ACTION BUTTONS
        ==================================================== */}

        <View className="mt-1 flex-row">

          {/* Call */}
          <Pressable
            onPress={() => {
              void handleCallService();
            }}
            disabled={!service.phone}
            className={`mr-2 flex-1 flex-row items-center justify-center rounded-full py-4 ${
              service.phone
                ? "bg-primary active:opacity-80"
                : "bg-gray-300"
            }`}
          >
            <Ionicons
              name="call"
              size={19}
              color="#FFFFFF"
            />

            <Text className="ml-2 font-semibold text-white">
              Call Service
            </Text>
          </Pressable>


          {/* Get Route */}
          <Pressable
            onPress={() => {
              void handleGetRoute();
            }}
            className="ml-2 flex-1 flex-row items-center justify-center rounded-full border border-primary bg-white py-4 active:opacity-80"
          >
            <Ionicons
              name="navigate-outline"
              size={19}
              color={COLORS.primary}
            />

            <Text className="ml-2 font-semibold text-primary">
              Get Route
            </Text>
          </Pressable>
        </View>


        {/* ====================================================
            DATA SOURCE NOTE
        ==================================================== */}

        <View className="mt-4 flex-row items-start rounded-2xl bg-light-purple p-4">
          <Ionicons
            name="information-circle-outline"
            size={19}
            color={COLORS.primary}
          />

          <Text className="ml-2 flex-1 text-xs leading-4 text-app-muted">
            Service information is provided using nearby
            location data and may change over time.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}