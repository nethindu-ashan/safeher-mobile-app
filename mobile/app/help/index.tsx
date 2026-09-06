import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import * as Location from "expo-location";
import type { ComponentProps } from "react";
import { useEffect, useState } from "react";

import {
  Alert,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";

import {
  SafeAreaView,
} from "react-native-safe-area-context";

import ScreenHeader from "../../src/components/ScreenHeader";

import {
  COLORS,
} from "../../src/constants/theme";

import type {
  SupportCategory,
} from "../../src/types/support";


// ============================================================
// TYPES
// ============================================================

type IconName =
  ComponentProps<typeof Ionicons>["name"];

type SupportCategoryItem = {
  type: SupportCategory;
  title: string;
  subtitle: string;
  icon: IconName;
};


// ============================================================
// SUPPORT CATEGORIES
// ============================================================

const supportCategories: SupportCategoryItem[] = [
  {
    type: "POLICE",
    title: "Police Stations",
    subtitle: "Nearby police assistance",
    icon: "shield-outline",
  },

  {
    type: "HOSPITAL",
    title: "Hospitals",
    subtitle: "Emergency medical support",
    icon: "medkit-outline",
  },

  {
    type: "WOMENS_SUPPORT",
    title: "Women's Support",
    subtitle: "Support services for women",
    icon: "heart-outline",
  },

  {
    type: "SAFE_SPACE",
    title: "Safe Spaces",
    subtitle: "Nearby safe locations",
    icon: "home-outline",
  },

  {
    type: "PHARMACY",
    title: "Pharmacies",
    subtitle: "Nearby medical supplies",
    icon: "medical-outline",
  },

  {
    type: "COMMUNITY_CENTER",
    title: "Community Centers",
    subtitle: "Community assistance",
    icon: "people-outline",
  },
];


// ============================================================
// SCREEN
// ============================================================

export default function NearbyHelpScreen() {
  // User's current device location
  const [latitude, setLatitude] =
    useState<number | null>(null);

  const [longitude, setLongitude] =
    useState<number | null>(null);

  const [locationLoading, setLocationLoading] =
    useState(true);

  const [locationError, setLocationError] =
    useState<string | null>(null);


  // ==========================================================
  // LOAD CURRENT LOCATION
  // ==========================================================

  const loadCurrentLocation = async () => {
    try {
      setLocationLoading(true);
      setLocationError(null);

      // Ask permission to access device location
      const { status } =
        await Location
          .requestForegroundPermissionsAsync();

      if (status !== "granted") {
        setLocationError(
          "Location permission is required to find nearby help."
        );

        return;
      }

      // Get user's CURRENT location
      const currentLocation =
        await Location
          .getCurrentPositionAsync({
            accuracy:
              Location.Accuracy.Balanced,
          });

      setLatitude(
        currentLocation.coords.latitude
      );

      setLongitude(
        currentLocation.coords.longitude
      );
    } catch (error) {
      console.error(
        "Nearby Help location error:",
        error
      );

      setLocationError(
        "Unable to get your current location."
      );
    } finally {
      setLocationLoading(false);
    }
  };


  useEffect(() => {
    void loadCurrentLocation();
  }, []);


  // ==========================================================
  // OPEN SUPPORT CATEGORY
  // ==========================================================

  const handleCategoryPress = (
    category: SupportCategoryItem
  ) => {
    // Wait until current location is loaded
    if (locationLoading) {
      Alert.alert(
        "Please Wait",
        "We are detecting your current location."
      );

      return;
    }

    // Nearby services require current location
    if (
      latitude === null ||
      longitude === null
    ) {
      Alert.alert(
        "Location Required",
        locationError ??
          "Please enable location access to find nearby services.",
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "Try Again",
            onPress: () => {
              void loadCurrentLocation();
            },
          },
        ]
      );

      return;
    }

    // Open the selected nearby service category
    router.push({
      pathname: "/help/list",

      params: {
        type: category.type,
        title: category.title,

        // Pass current location to list screen
        lat: String(latitude),
        lng: String(longitude),
      },
    });
  };


  // ==========================================================
  // EMERGENCY SOS
  // ==========================================================

  const handleEmergencySOS = () => {
    /**
     * Emergency SOS belongs to Nethindu's component.
     *
     * Our Nearby Help screen ONLY navigates
     * to the existing SOS feature.
     */
    router.push("/report/sos");
  };


  // ==========================================================
  // UI
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
        {/* Existing shared project header */}
        <ScreenHeader
          title="Nearby Help Services"
        />


        {/* ====================================================
            INTRO
        ==================================================== */}

        <Text className="mt-1 text-sm leading-5 text-app-muted">
          Find trusted support services near your current
          location.
        </Text>


        {/* ====================================================
            CURRENT LOCATION STATUS
        ==================================================== */}

        <View className="mt-5 flex-row items-center rounded-2xl border border-app-border bg-white p-4">
          <View className="h-11 w-11 items-center justify-center rounded-full bg-light-purple">
            <Ionicons
              name="location-outline"
              size={22}
              color={COLORS.primary}
            />
          </View>

          <View className="ml-3 flex-1">
            <Text className="font-semibold text-app-text">
              Current Location
            </Text>

            {locationLoading ? (
              <Text className="mt-1 text-xs text-app-muted">
                Detecting your current location...
              </Text>
            ) : locationError ? (
              <Text className="mt-1 text-xs leading-4 text-danger">
                {locationError}
              </Text>
            ) : (
              <Text className="mt-1 text-xs text-app-muted">
                Using your current device location
              </Text>
            )}
          </View>

          {!locationLoading &&
            !locationError &&
            latitude !== null &&
            longitude !== null && (
              <Ionicons
                name="checkmark-circle"
                size={22}
                color={COLORS.success}
              />
            )}
        </View>


        {/* Retry location if something failed */}
        {!locationLoading &&
          locationError && (
            <Pressable
              onPress={() => {
                void loadCurrentLocation();
              }}
              className="mt-3 self-start active:opacity-70"
            >
              <Text className="font-medium text-primary">
                Try Location Again
              </Text>
            </Pressable>
          )}


        {/* ====================================================
            CATEGORY SECTION
        ==================================================== */}

        <Text className="mt-7 text-lg font-bold text-app-text">
          What help do you need?
        </Text>

        <View className="mt-4 flex-row flex-wrap justify-between">
          {supportCategories.map(
            (category) => (
              <Pressable
                key={category.type}
                onPress={() =>
                  handleCategoryPress(
                    category
                  )
                }
                className="mb-3 w-[48%] rounded-2xl border border-app-border bg-white p-4 active:opacity-80"
              >
                {/* Category icon */}
                <View className="mb-4 h-11 w-11 items-center justify-center rounded-full bg-light-purple">
                  <Ionicons
                    name={category.icon}
                    size={22}
                    color={
                      COLORS.primary
                    }
                  />
                </View>

                {/* Category name */}
                <Text className="font-semibold text-app-text">
                  {category.title}
                </Text>

                {/* Category description */}
                <Text className="mt-1 text-xs leading-4 text-app-muted">
                  {category.subtitle}
                </Text>

                {/* Small action label */}
                <View className="mt-4 flex-row items-center">
                  <Text className="mr-1 text-xs font-semibold text-primary">
                    Find nearby
                  </Text>

                  <Ionicons
                    name="arrow-forward-outline"
                    size={14}
                    color={
                      COLORS.primary
                    }
                  />
                </View>
              </Pressable>
            )
          )}
        </View>


        {/* ====================================================
            EMERGENCY SOS LINK
            NETHINDU'S FEATURE
        ==================================================== */}

        <View className="mt-4 rounded-2xl bg-sos-light p-4">
          <View className="flex-row items-start">
            <View className="h-11 w-11 items-center justify-center rounded-full bg-white">
              <Ionicons
                name="alert-outline"
                size={22}
                color={COLORS.sos}
              />
            </View>

            <View className="ml-3 flex-1">
              <Text className="font-semibold text-app-text">
                Need Emergency Help?
              </Text>

              <Text className="mt-1 text-xs leading-4 text-app-muted">
                Open SafeHer Emergency SOS for immediate
                emergency assistance.
              </Text>
            </View>
          </View>

          <Pressable
            onPress={handleEmergencySOS}
            className="mt-4 flex-row items-center justify-center rounded-full bg-sos py-4 active:opacity-80"
          >
            <Ionicons
              name="alert-circle-outline"
              size={20}
              color="#FFFFFF"
            />

            <Text className="ml-2 font-semibold text-white">
              Emergency SOS
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}