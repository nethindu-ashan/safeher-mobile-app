import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import * as Location from "expo-location";
import { router } from "expo-router";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  ActivityIndicator,
  Alert,
  Pressable,
  StatusBar,
  Text,
  useWindowDimensions,
  View,
} from "react-native";

import MapView, {
  Region,
} from "react-native-maps";

import {
  SafeAreaView,
} from "react-native-safe-area-context";

import {
  COLORS,
} from "../../src/constants/theme";

import {
  useIncidentReport,
} from "../../src/context/IncidentReportContext";

/* ============================================================
   DEFAULT REGION
   ============================================================ */

const DEFAULT_REGION: Region = {
  latitude: 6.9271,
  longitude: 79.8612,
  latitudeDelta: 0.015,
  longitudeDelta: 0.015,
};

/* ============================================================
   SCREEN
   ============================================================ */

export default function SelectLocationScreen() {
  const { height } =
    useWindowDimensions();

  const compact =
    height < 780;

  const mapRef =
    useRef<MapView | null>(
      null
    );

  /* ==========================================================
     CONTEXT
     ========================================================== */

  const {
    draft,
    updateDraft,
  } = useIncidentReport();

  /* ==========================================================
     EXISTING LOCATION
     ========================================================== */

  const existingLocation =
    draft.latitude !== null &&
    draft.longitude !== null
      ? {
          latitude:
            draft.latitude,

          longitude:
            draft.longitude,
        }
      : null;

  /* ==========================================================
     STATE
     ========================================================== */

  const [
    selectedLocation,
    setSelectedLocation,
  ] = useState<{
    latitude: number;
    longitude: number;
  }>(
    existingLocation ?? {
      latitude:
        DEFAULT_REGION.latitude,

      longitude:
        DEFAULT_REGION.longitude,
    }
  );

  const [
    locating,
    setLocating,
  ] = useState(false);

  const [
    mapReady,
    setMapReady,
  ] = useState(false);

  const isLocatingRef = useRef(false);
const isConfirmingRef = useRef(false);

  /* ==========================================================
     MOVE MAP TO LOCATION
     ========================================================== */

  const moveMapToLocation = (
    latitude: number,
    longitude: number
  ) => {
    const nextRegion: Region = {
      latitude,
      longitude,
      latitudeDelta: 0.012,
      longitudeDelta: 0.012,
    };

    setSelectedLocation({
      latitude,
      longitude,
    });

    mapRef.current?.animateToRegion(
      nextRegion,
      500
    );
  };

  /* ==========================================================
     CURRENT LOCATION
     ========================================================== */

  const getCurrentLocation = async (showAlert = true) => {
  if (isLocatingRef.current) return;

  isLocatingRef.current = true;
  setLocating(true);

  try {
    const { status } =
      await Location.requestForegroundPermissionsAsync();

    if (status !== "granted") {
      if (showAlert) {
        Alert.alert(
          "Location Permission Required",
          "Location access was not granted. You can still move the map manually to select where the incident happened."
        );
      }

      return;
    }

    const servicesEnabled =
      await Location.hasServicesEnabledAsync();

    if (!servicesEnabled) {
      if (showAlert) {
        Alert.alert(
          "GPS Unavailable",
          "Please enable Location Services on your device, or move the map manually to select the incident location."
        );
      }

      return;
    }

    const location =
      await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

    const { latitude, longitude } = location.coords;

    const validCoordinates =
      Number.isFinite(latitude) &&
      Number.isFinite(longitude) &&
      latitude >= -90 &&
      latitude <= 90 &&
      longitude >= -180 &&
      longitude <= 180;

    if (!validCoordinates) {
      if (showAlert) {
        Alert.alert(
          "Invalid Location",
          "Your device returned invalid coordinates. Please try again or select the location manually."
        );
      }

      return;
    }

    moveMapToLocation(latitude, longitude);
  } catch (error) {
    console.error("Unable to get current location:", error);

    if (showAlert) {
      Alert.alert(
        "Location Unavailable",
        "Unable to determine your current location. Check your GPS settings or move the map manually."
      );
    }
  } finally {
    isLocatingRef.current = false;
    setLocating(false);
  }
};

  /* ==========================================================
     INITIAL LOCATION
     ========================================================== */

  useEffect(() => {
    /*
     * If the user already selected a location,
     * keep that location when opening this page again.
     */

    if (existingLocation) {
      return;
    }

    /*
     * Otherwise try to move the map
     * to the user's current location.
     */

    getCurrentLocation(false);

    // Run only once when screen opens.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ==========================================================
     MAP MOVED
     ========================================================== */

  const handleRegionChangeComplete = (
    region: Region
  ) => {
    /*
     * The pin stays fixed in the middle.
     * Therefore the center of the map
     * becomes the selected location.
     */

    setSelectedLocation({
      latitude:
        region.latitude,

      longitude:
        region.longitude,
    });
  };

  /* ==========================================================
     CONFIRM LOCATION
     ========================================================== */

  const handleConfirm = () => {
  if (isConfirmingRef.current) return;

  if (!mapReady) {
    Alert.alert(
      "Map Not Ready",
      "Please wait for the map to finish loading before confirming the location."
    );
    return;
  }

  if (locating || isLocatingRef.current) {
    Alert.alert(
      "Finding Location",
      "Please wait until your current location has been determined, or select a location manually."
    );
    return;
  }

  const { latitude, longitude } = selectedLocation;

  const validCoordinates =
    Number.isFinite(latitude) &&
    Number.isFinite(longitude) &&
    latitude >= -90 &&
    latitude <= 90 &&
    longitude >= -180 &&
    longitude <= 180;

  if (!validCoordinates) {
    Alert.alert(
      "Invalid Location",
      "Please select a valid location on the map before continuing."
    );
    return;
  }

  isConfirmingRef.current = true;

  try {
    updateDraft({
      latitude,
      longitude,
    });

    router.replace("/report/review");
  } catch (error) {
    isConfirmingRef.current = false;

    Alert.alert(
      "Unable to Save Location",
      "We couldn't save the selected location. Please try again."
    );
  }
};

  /* ==========================================================
     UI
     ========================================================== */

  return (
    <SafeAreaView
      edges={[
        "top",
        "bottom",
      ]}
      className="flex-1 bg-white"
    >
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#FFFFFF"
      />

      <View className="flex-1">
        {/* ==================================================
            FULL MAP
            ================================================== */}

        <MapView
          ref={mapRef}
          style={{
            flex: 1,
          }}
          initialRegion={
            existingLocation
              ? {
                  latitude:
                    existingLocation.latitude,

                  longitude:
                    existingLocation.longitude,

                  latitudeDelta:
                    0.012,

                  longitudeDelta:
                    0.012,
                }
              : DEFAULT_REGION
          }
          onMapReady={() =>
            setMapReady(true)
          }
          onRegionChangeComplete={
            handleRegionChangeComplete
          }
          showsUserLocation
          showsMyLocationButton={
            false
          }
          showsCompass={false}
          toolbarEnabled={false}
        />

        {/* ==================================================
            SIMPLE TOP HEADER
            ================================================== */}

        <View className="absolute left-4 right-4 top-3">
          <View
            className="flex-row items-center self-start rounded-[16px] bg-white px-1.5 py-1.5"
            style={{
              shadowColor:
                "#000",

              shadowOffset: {
                width: 0,
                height: 2,
              },

              shadowOpacity:
                0.12,

              shadowRadius:
                8,

              elevation: 5,
            }}
          >
            {/* BACK BUTTON */}

            <Pressable
              onPress={() =>
                router.back()
              }
              hitSlop={10}
              className="h-10 w-10 items-center justify-center rounded-[12px] active:bg-[#F5F1F7]"
            >
              <Ionicons
                name="chevron-back"
                size={22}
                color={
                  COLORS.text
                }
              />
            </Pressable>

            {/* TITLE */}

            <Text className="ml-1 mr-4 text-[15px] font-bold text-app-text">
              Select Location
            </Text>
          </View>
        </View>

        {/* ==================================================
            FIXED CENTER PIN
            ================================================== */}

        <View
          pointerEvents="none"
          className="absolute inset-0 items-center justify-center"
        >
          <View
            style={{
              marginTop: -55,
            }}
          >
            <Ionicons
              name="location"
              size={48}
              color={
                COLORS.pink
              }
            />

            {/* PIN SHADOW */}

            <View className="mt-[-5px] h-[5px] w-[18px] self-center rounded-full bg-black/15" />
          </View>
        </View>

        {/* ==================================================
            CURRENT LOCATION BUTTON
            ================================================== */}

        <Pressable
          onPress={() =>
            getCurrentLocation(true)
          }
          disabled={locating}
          className="absolute right-4 h-12 w-12 items-center justify-center rounded-[16px] bg-white active:opacity-75"
          style={{
            bottom:
              compact
                ? 178
                : 190,

            shadowColor:
              "#000",

            shadowOffset: {
              width: 0,
              height: 2,
            },

            shadowOpacity:
              0.12,

            shadowRadius:
              8,

            elevation: 5,
          }}
        >
          {locating ? (
            <ActivityIndicator
              size="small"
              color={
                COLORS.primary
              }
            />
          ) : (
            <Ionicons
              name="locate"
              size={21}
              color={
                COLORS.primary
              }
            />
          )}
        </Pressable>

        {/* ==================================================
            MAP LOADING
            ================================================== */}

        {!mapReady && (
          <View className="absolute inset-0 items-center justify-center bg-white">
            <ActivityIndicator
              size="small"
              color={
                COLORS.primary
              }
            />

            <Text className="mt-3 text-[11px] text-app-muted">
              Loading map...
            </Text>
          </View>
        )}

        {/* ==================================================
            BOTTOM PANEL
            ================================================== */}

        <View
          className="absolute bottom-0 left-0 right-0 rounded-t-[26px] bg-white px-5 pt-4"
          style={{
            paddingBottom:
              compact
                ? 10
                : 14,

            shadowColor:
              "#000",

            shadowOffset: {
              width: 0,
              height: -3,
            },

            shadowOpacity:
              0.1,

            shadowRadius:
              12,

            elevation: 12,
          }}
        >
          {/* HANDLE */}

          <View className="mb-4 h-1 w-10 self-center rounded-full bg-[#DCD6DF]" />

          {/* LOCATION TITLE */}

          <Text className="text-[15px] font-bold text-app-text">
            Incident location
          </Text>

          {/* INSTRUCTION */}

          <Text className="mt-1.5 text-[10px] leading-[15px] text-app-muted">
            Move the map until the pin
            is exactly where the
            incident happened.
          </Text>

          {/* ==================================================
              USE CURRENT LOCATION
              ================================================== */}

          <Pressable
            onPress={() =>
              getCurrentLocation(true)
            }
            disabled={locating}
            className="mt-3 flex-row items-center self-start py-1 active:opacity-60"
          >
            {locating ? (
              <ActivityIndicator
                size="small"
                color={
                  COLORS.primary
                }
              />
            ) : (
              <>
                <Ionicons
                  name="navigate-outline"
                  size={16}
                  color={
                    COLORS.primary
                  }
                />

                <Text className="ml-1.5 text-[10px] font-semibold text-primary">
                  Use my current location
                </Text>
              </>
            )}
          </Pressable>

          {/* ==================================================
              CONFIRM LOCATION
              ================================================== */}

          <Pressable
            onPress={
              handleConfirm
            }
            disabled={!mapReady || locating}
            className="mt-4"
            style={({
              pressed,
            }) => ({
              borderRadius:
                16,

              overflow:
                "hidden",

              opacity:
                !mapReady || locating
                  ? 0.6
                  : pressed
                  ? 0.86
                  : 1,
            })}
          >
            <LinearGradient
              colors={[
                COLORS.primaryDark,
                COLORS.primary,
                COLORS.pink,
              ]}
              start={{
                x: 0,
                y: 0.5,
              }}
              end={{
                x: 1,
                y: 0.5,
              }}
              style={{
                height:
                  compact
                    ? 49
                    : 52,

                borderRadius:
                  16,

                alignItems:
                  "center",

                justifyContent:
                  "center",
              }}
            >
              <Text className="text-[13px] font-bold text-white">
                Confirm Location
              </Text>
            </LinearGradient>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}