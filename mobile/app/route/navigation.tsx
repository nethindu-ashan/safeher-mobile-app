import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  ActivityIndicator,
  Pressable,
  Text,
  View,
} from "react-native";

import MapView, {
  Marker,
  Polyline,
} from "react-native-maps";

import * as Location from "expo-location";

import { SafeAreaView } from "react-native-safe-area-context";

import { router } from "expo-router";

import ScreenHeader from "../../src/components/ScreenHeader";
import { COLORS } from "../../src/constants/theme";

import { useRouteContext } from "../../src/context/RouteContext";

import { decodePolyline } from "../../src/utils/decodePolyline";

import {
  getRouteSafetyIncidents,
  RouteSafetyIncident,
} from "../../src/services/routeSafety.service";

type Coordinates = {
  latitude: number;
  longitude: number;
};

/*
 * Calculate distance between two coordinates.
 *
 * Returns distance in kilometers.
 */
const calculateDistanceKm = (
  point1: Coordinates,
  point2: Coordinates
) => {
  const earthRadiusKm = 6371;

  const dLat =
    ((point2.latitude - point1.latitude) *
      Math.PI) /
    180;

  const dLon =
    ((point2.longitude - point1.longitude) *
      Math.PI) /
    180;

  const lat1 =
    (point1.latitude * Math.PI) / 180;

  const lat2 =
    (point2.latitude * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) *
      Math.sin(dLat / 2) +
    Math.sin(dLon / 2) *
      Math.sin(dLon / 2) *
      Math.cos(lat1) *
      Math.cos(lat2);

  const c =
    2 *
    Math.atan2(
      Math.sqrt(a),
      Math.sqrt(1 - a)
    );

  return earthRadiusKm * c;
};

export default function NavigationScreen() {
  const { selectedRoute } = useRouteContext();

  const mapRef = useRef<MapView>(null);

  const locationSubscription =
    useRef<Location.LocationSubscription | null>(null);

  const [currentLocation, setCurrentLocation] =
    useState<Coordinates | null>(null);

  const [routeCoordinates, setRouteCoordinates] =
    useState<Coordinates[]>([]);

  const [safetyIncidents, setSafetyIncidents] =
    useState<RouteSafetyIncident[]>([]);

  const safetyIncidentsRef =
    useRef<RouteSafetyIncident[]>([]);

  const [nearbyIncident, setNearbyIncident] =
    useState<RouteSafetyIncident | null>(null);

  const [isSafetyLoading, setIsSafetyLoading] =
    useState(false);

  const [isLoading, setIsLoading] =
    useState(true);

  const [errorMessage, setErrorMessage] =
    useState("");

  /*
   * Controls whether the bottom panel
   * is expanded or minimized.
   */
  const [isPanelExpanded, setIsPanelExpanded] =
    useState(true);

  /*
   * Decode the selected route.
   */
  useEffect(() => {
    if (!selectedRoute?.encodedPolyline) {
      return;
    }

    const coordinates = decodePolyline(
      selectedRoute.encodedPolyline
    );

    setRouteCoordinates(coordinates);
  }, [selectedRoute]);

  /*
   * Load safety incidents around
   * the selected route.
   */
  useEffect(() => {
    if (!selectedRoute?.encodedPolyline) {
      return;
    }

    const loadRouteSafety = async () => {
      try {
        setIsSafetyLoading(true);

        const response =
          await getRouteSafetyIncidents(
            selectedRoute.encodedPolyline,
            0.5,
            30
          );

        const incidents =
          response.data.incidents || [];

        setSafetyIncidents(incidents);
        safetyIncidentsRef.current = incidents;
      } catch (error) {
        console.error(
          "Navigation safety error:",
          error
        );

        setSafetyIncidents([]);
      } finally {
        setIsSafetyLoading(false);
      }
    };

    loadRouteSafety();
  }, [selectedRoute]);

  /*
   * Start live location tracking.
   */
  useEffect(() => {
    let mounted = true;

    const startLocationTracking =
      async () => {
        try {
          setIsLoading(true);
          setErrorMessage("");

          /*
           * Request foreground location permission.
           */
          const { status } =
            await Location.requestForegroundPermissionsAsync();

          if (status !== "granted") {
            setErrorMessage(
              "Location permission is required for navigation."
            );

            setIsLoading(false);
            return;
          }

          /*
           * Get initial location.
           */
          const location =
            await Location.getCurrentPositionAsync(
              {
                accuracy:
                  Location.Accuracy.High,
              }
            );

          if (mounted) {
            const coordinates = {
              latitude:
                location.coords.latitude,
              longitude:
                location.coords.longitude,
            };

            setCurrentLocation(
              coordinates
            );

            /*
             * Center map on user's location.
             */
            mapRef.current?.animateToRegion(
              {
                latitude:
                  coordinates.latitude,
                longitude:
                  coordinates.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              },
              500
            );
          }

          /*
           * Start continuous location tracking.
           */
          locationSubscription.current =
            await Location.watchPositionAsync(
              {
                accuracy:
                  Location.Accuracy.High,

                timeInterval: 3000,

                distanceInterval: 5,
              },

              (updatedLocation) => {
                if (!mounted) {
                  return;
                }

                const coordinates = {
                  latitude:
                    updatedLocation.coords
                      .latitude,

                  longitude:
                    updatedLocation.coords
                      .longitude,
                };

                /*
                 * Update current location.
                 */
                setCurrentLocation(
                  coordinates
                );

                /*
                 * Check whether user is
                 * close to a safety incident.
                 */
                const nearby =
                  safetyIncidentsRef.current.find(
                    (incident) => {
                      const distance =
                        calculateDistanceKm(
                          coordinates,
                          {
                            latitude:
                              incident.latitude,
                            longitude:
                              incident.longitude,
                          }
                        );

                      return distance <= 0.2;
                    }
                  );

                setNearbyIncident(
                  nearby ?? null
                );

                /*
                 * Keep map centered
                 * on current location.
                 */
                mapRef.current?.animateToRegion(
                  {
                    latitude:
                      coordinates.latitude,

                    longitude:
                      coordinates.longitude,

                    latitudeDelta: 0.01,

                    longitudeDelta: 0.01,
                  },
                  500
                );
              }
            );
        } catch (error) {
          console.error(
            "Navigation location error:",
            error
          );

          if (mounted) {
            setErrorMessage(
              "Unable to get your current location."
            );
          }
        } finally {
          if (mounted) {
            setIsLoading(false);
          }
        }
      };

    startLocationTracking();

    /*
     * Stop tracking when leaving
     * the navigation screen.
     */
    return () => {
      mounted = false;

      locationSubscription.current?.remove();

      locationSubscription.current =
        null;
    };
  }, []);

  /*
   * End navigation.
   */
  const handleEndNavigation = () => {
    locationSubscription.current?.remove();

    locationSubscription.current =
      null;

    router.back();
  };

  /*
   * No selected route.
   */
  if (!selectedRoute) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor:
            COLORS.background,
        }}
      >
        <View className="flex-1 px-5">
          <ScreenHeader title="Navigation" />

          <View className="flex-1 items-center justify-center">
            <Text className="text-center text-app-text-secondary">
              No route has been selected.
            </Text>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  /*
   * Loading screen.
   */
  if (
    isLoading &&
    !currentLocation
  ) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor:
            COLORS.background,
        }}
      >
        <View className="flex-1 px-5">
          <ScreenHeader title="Navigation" />

          <View className="flex-1 items-center justify-center">
            <ActivityIndicator
              size="large"
              color={COLORS.primary}
            />

            <Text className="mt-3 text-sm text-app-text-secondary">
              Getting your current location...
            </Text>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "#000",
      }}
    >
      <View className="flex-1">

        {/* =====================================
            FULL SCREEN MAP
        ====================================== */}
        <MapView
          ref={mapRef}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
          }}
          initialRegion={{
            latitude:
              currentLocation?.latitude ??
              routeCoordinates[0]
                ?.latitude ??
              7.0,

            longitude:
              currentLocation?.longitude ??
              routeCoordinates[0]
                ?.longitude ??
              80.0,

            latitudeDelta: 0.01,

            longitudeDelta: 0.01,
          }}
          showsUserLocation={false}
          showsMyLocationButton={false}
        >

          {/* Selected route */}
          {routeCoordinates.length >
            0 && (
            <Polyline
              coordinates={
                routeCoordinates
              }
              strokeWidth={6}
              strokeColor={
                COLORS.primary
              }
            />
          )}

          {/* Current device location */}
          {currentLocation && (
            <Marker
              coordinate={
                currentLocation
              }
              title="Your Location"
              description="Current location"
            />
          )}

          {/* Destination */}
          {routeCoordinates.length >
            0 && (
            <Marker
              coordinate={
                routeCoordinates[
                  routeCoordinates.length -
                    1
                ]
              }
              title="Destination"
              description={
                selectedRoute.destination
              }
            />
          )}

          {/* Safety incidents */}
          {safetyIncidents.map(
            (incident) => (
              <Marker
                key={incident.id}
                coordinate={{
                  latitude:
                    incident.latitude,

                  longitude:
                    incident.longitude,
                }}
                title={
                  incident.category
                }
                description={`${incident.distanceToRouteKm} km from route`}
                pinColor={
                  COLORS.error
                }
              />
            )
          )}
        </MapView>

        {/* =====================================
            FLOATING HEADER
        ====================================== */}
        <View className="absolute left-0 right-0 top-0 px-5">
          <ScreenHeader title="Navigation" />
        </View>

        {/* =====================================
            SAFETY ALERT
        ====================================== */}
        {nearbyIncident && (
          <View className="absolute left-4 right-4 top-20 rounded-2xl bg-red-500 px-4 py-4">

            <View className="flex-row items-center">

              <View className="mr-3 h-10 w-10 items-center justify-center rounded-full bg-white">
                <Text className="text-xl">
                  ⚠️
                </Text>
              </View>

              <View className="flex-1">
                <Text className="font-bold text-white">
                  Safety Alert
                </Text>

                <Text className="mt-1 text-sm text-white">
                  {nearbyIncident.category} reported nearby.
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* =====================================
            BOTTOM SHEET
        ====================================== */}
        <View
          className={
            isPanelExpanded
              ? "absolute bottom-0 left-0 right-0 rounded-t-3xl bg-white px-5 pb-6 pt-3"
              : "absolute bottom-0 left-0 right-0 rounded-t-3xl bg-white px-5 pb-4 pt-3"
          }
        >

          {/* Drag / toggle handle */}
          <Pressable
            onPress={() =>
              setIsPanelExpanded(
                !isPanelExpanded
              )
            }
            className="items-center py-2"
          >
            <View className="h-1.5 w-12 rounded-full bg-gray-300" />
          </Pressable>

          {/* Minimized view */}
          {!isPanelExpanded && (
            <Pressable
              onPress={() =>
                setIsPanelExpanded(
                  true
                )
              }
            >
              <View className="flex-row items-center justify-between">

                <View className="flex-1">
                  <Text className="text-lg font-bold text-app-text">
                    {selectedRoute.destination}
                  </Text>

                  <Text className="mt-1 text-sm text-app-text-secondary">
                    {selectedRoute.duration} •{" "}
                    {selectedRoute.distance}
                  </Text>
                </View>

                <Text className="text-xl text-app-text">
                  ↑
                </Text>
              </View>
            </Pressable>
          )}

          {/* Expanded view */}
          {isPanelExpanded && (
            <>
              <View className="flex-row items-center justify-between">

                <View className="flex-1">
                  <Text className="text-xl font-bold text-app-text">
                    {selectedRoute.name}
                  </Text>

                  <Text className="mt-1 text-sm text-app-text-secondary">
                    Navigating to{" "}
                    {selectedRoute.destination}
                  </Text>
                </View>

                <Pressable
                  onPress={() =>
                    setIsPanelExpanded(
                      false
                    )
                  }
                  className="ml-3 h-10 w-10 items-center justify-center rounded-full bg-gray-100"
                >
                  <Text className="text-xl text-app-text">
                    ↓
                  </Text>
                </Pressable>
              </View>

              {/* Route details */}
              <View className="mt-5 flex-row">

                <View className="mr-10">
                  <Text className="text-xs text-app-text-secondary">
                    Distance
                  </Text>

                  <Text className="mt-1 text-lg font-semibold text-app-text">
                    {selectedRoute.distance}
                  </Text>
                </View>

                <View>
                  <Text className="text-xs text-app-text-secondary">
                    Estimated Time
                  </Text>

                  <Text className="mt-1 text-lg font-semibold text-app-text">
                    {selectedRoute.duration}
                  </Text>
                </View>

              </View>

              {/* Safety information */}
              <View className="mt-4 rounded-2xl bg-gray-50 p-4">

                <Text className="font-semibold text-app-text">
                  Route Safety
                </Text>

                {isSafetyLoading ? (
                  <Text className="mt-2 text-sm text-app-text-secondary">
                    Checking recent safety reports...
                  </Text>
                ) : nearbyIncident ? (
                  <Text className="mt-2 text-sm text-red-500">
                    ⚠️ Safety incident reported nearby.
                  </Text>
                ) : safetyIncidents.length >
                  0 ? (
                  <Text className="mt-2 text-sm text-app-text-secondary">
                    {safetyIncidents.length} recent community report
                    {safetyIncidents.length !==
                    1
                      ? "s"
                      : ""}{" "}
                    found near this route.
                  </Text>
                ) : (
                  <Text className="mt-2 text-sm text-app-text-secondary">
                    No recent community reports were found near this route.
                  </Text>
                )}

              </View>

              {errorMessage !== "" && (
                <Text className="mt-3 text-sm text-red-500">
                  {errorMessage}
                </Text>
              )}

              {currentLocation && (
                <Text className="mt-3 text-xs text-app-text-secondary">
                  ● Live location tracking active
                </Text>
              )}

              {/* End navigation */}
              <Pressable
                onPress={
                  handleEndNavigation
                }
                className="mt-5 rounded-full bg-red-500 py-4 active:opacity-80"
              >
                <Text className="text-center font-semibold text-white">
                  End Navigation
                </Text>
              </Pressable>
            </>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}