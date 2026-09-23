import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Pressable, Text, View,} from "react-native";
import MapView, { Marker, Polyline,} from "react-native-maps";
import * as Location from "expo-location";

import { SafeAreaView } from "react-native-safe-area-context";

import { router } from "expo-router";

import ScreenHeader from "../../src/components/ScreenHeader";
import { COLORS } from "../../src/constants/theme";

import { useRouteContext } from "../../src/context/RouteContext";

import { decodePolyline } from "../../src/utils/decodePolyline";
import { getRouteSafetyIncidents, RouteSafetyIncident, } from "../../src/services/routeSafety.service";

type Coordinates = {
  latitude: number;
  longitude: number;
};

/*
 * Calculate the distance between two coordinates
 * using the Haversine formula.
 *
 * Result is returned in kilometres.
 */
const calculateDistanceKm = (
  point1: Coordinates,
  point2: Coordinates
) => {
  const earthRadiusKm = 6371;

  const latitudeDifference =
    ((point2.latitude - point1.latitude) * Math.PI) /
    180;

  const longitudeDifference =
    ((point2.longitude - point1.longitude) * Math.PI) /
    180;

  const latitude1 =
    (point1.latitude * Math.PI) / 180;

  const latitude2 =
    (point2.latitude * Math.PI) / 180;

  const a =
    Math.sin(latitudeDifference / 2) ** 2 +
    Math.sin(longitudeDifference / 2) ** 2 *
      Math.cos(latitude1) *
      Math.cos(latitude2);

  const c =
    2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

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

  const [isLoading, setIsLoading] =
    useState(true);

  const [errorMessage, setErrorMessage] =
    useState("");

  const [safetyIncidents, setSafetyIncidents] =
    useState<RouteSafetyIncident[]>([]);

  const [isSafetyLoading, setIsSafetyLoading] =
    useState(false);

  const [nearbyIncident, setNearbyIncident] =
  useState<RouteSafetyIncident | null>(null);

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
  * Load recent safety incidents near
  * the selected route.
  */
  useEffect(() => {
    if (!selectedRoute?.encodedPolyline) {
      return;
    }

    const loadSafetyIncidents = async () => {
      try {
        setIsSafetyLoading(true);

        const response =
          await getRouteSafetyIncidents(
            selectedRoute.encodedPolyline,
            0.5,
            30
          );

        setSafetyIncidents(
          response.data.incidents || []
        );
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

    loadSafetyIncidents();
  }, [selectedRoute]);

  /*
   * Start live location tracking.
   */
  useEffect(() => {
    let mounted = true;

    const startLocationTracking = async () => {
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
         * Get the current location first.
         */
        const location =
          await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.High,
          });

        if (mounted) {
          const coordinates = {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          };

          setCurrentLocation(coordinates);

          /*
           * Move the map to the user's location.
           */
          mapRef.current?.animateToRegion(
            {
              latitude: coordinates.latitude,
              longitude: coordinates.longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            },
            500
          );
        }

        /*
         * Start continuously watching
         * the user's location.
         */
        locationSubscription.current =
          await Location.watchPositionAsync(
            {
              accuracy: Location.Accuracy.High,
              timeInterval: 3000,
              distanceInterval: 5,
            },
            (updatedLocation) => {
              if (!mounted) {
                return;
              }

              const coordinates = {
                latitude:
                  updatedLocation.coords.latitude,
                longitude:
                  updatedLocation.coords.longitude,
              };

              setCurrentLocation(coordinates);


              /*
              * Check whether the user is close to
              * any safety incident.
              */
              const nearby = safetyIncidents.find(
                (incident) => {
                  const distance = calculateDistanceKm(
                    coordinates,
                    {
                      latitude: incident.latitude,
                      longitude: incident.longitude,
                    }
                  );

                  return distance <= 0.2;
                }
              );

              setNearbyIncident(nearby ?? null);


              /*
               * Keep the user's position
               * centered on the map.
               */
              mapRef.current?.animateToRegion(
                {
                  latitude: coordinates.latitude,
                  longitude: coordinates.longitude,
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
     * Stop location tracking when
     * the screen is closed.
     */
    return () => {
      mounted = false;

      locationSubscription.current?.remove();
      locationSubscription.current = null;
    };
  }, [safetyIncidents]);

  /*
   * End navigation.
   */
  const handleEndNavigation = () => {
    locationSubscription.current?.remove();
    locationSubscription.current = null;

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
          backgroundColor: COLORS.background,
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
   * Show loading state.
   */
  if (
    isLoading &&
    !currentLocation
  ) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: COLORS.background,
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
        backgroundColor: COLORS.background,
      }}
    >
      <View className="flex-1">
        <View className="px-5">
          <ScreenHeader title="Navigation" />
        </View>

        {/* Map */}
        <View className="flex-1 overflow-hidden">
          <MapView
            ref={mapRef}
            style={{
              width: "100%",
              height: "100%",
            }}
            initialRegion={{
              latitude:
                currentLocation?.latitude ??
                routeCoordinates[0]?.latitude ??
                7.0,
              longitude:
                currentLocation?.longitude ??
                routeCoordinates[0]?.longitude ??
                80.0,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
            showsUserLocation={false}
            showsMyLocationButton={false}
          >
            {/* Selected route */}
            {routeCoordinates.length > 0 && (
              <Polyline
                coordinates={routeCoordinates}
                strokeWidth={6}
                strokeColor={COLORS.primary}
              />
            )}

            {/* Current device location */}
            {currentLocation && (
              <Marker
                coordinate={currentLocation}
                title="Your Location"
                description="Current location"
              />
            )}

            {/* Safety incidents near the route */}
            {safetyIncidents.map((incident) => (
              <Marker
                key={incident.id}
                coordinate={{
                  latitude: incident.latitude,
                  longitude: incident.longitude,
                }}
                title={`⚠️ ${incident.category}`}
                description={`${incident.distanceToRouteKm} km from route`}
                pinColor={COLORS.error}
              />
            ))}

            {/* Destination */}
            {routeCoordinates.length > 0 && (
              <Marker
                coordinate={
                  routeCoordinates[
                    routeCoordinates.length - 1
                  ]
                }
                title="Destination"
                description={
                  selectedRoute.destination
                }
              />
            )}
          </MapView>
        </View>

        {/* Bottom information panel */}
        <View className="rounded-t-3xl bg-white px-5 pb-6 pt-5">
          <Text className="text-xl font-bold text-app-text">
            {selectedRoute.name}
          </Text>

          <Text className="mt-1 text-sm text-app-text-secondary">
            Navigating to {selectedRoute.destination}
          </Text>


          {nearbyIncident && (
            <View className="mt-4 rounded-2xl bg-red-50 p-4">
              <Text className="text-base font-bold text-red-500">
                ⚠️ Safety Alert
              </Text>

              <Text className="mt-1 text-sm font-semibold text-app-text">
                {nearbyIncident.category}
              </Text>

              <Text className="mt-1 text-sm text-app-text-secondary">
                You are approaching a recently reported
                safety incident.
              </Text>

              <Text className="mt-2 text-xs text-app-text-secondary">
                {nearbyIncident.description}
              </Text>
            </View>
          )}

          {isSafetyLoading ? (
            <Text className="mt-3 text-xs text-app-text-secondary">
              Checking route safety...
            </Text>
          ) : safetyIncidents.length > 0 ? (
            <View className="mt-3 rounded-xl bg-red-50 p-3">
              <Text className="text-sm font-semibold text-red-500">
                ⚠️ Safety Alert
              </Text>

              <Text className="mt-1 text-xs text-app-text">
                {safetyIncidents.length} recent report
                {safetyIncidents.length !== 1
                  ? "s"
                  : ""}{" "}
                found near your route.
              </Text>
            </View>
          ) : (
            <View className="mt-3 rounded-xl bg-green-50 p-3">
              <Text className="text-sm font-semibold text-green-600">
                ✓ No Recent Reports
              </Text>

              <Text className="mt-1 text-xs text-app-text-secondary">
                No recent community reports were found
                near this route.
              </Text>
            </View>
          )}

          <View className="mt-4 flex-row">
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

          <Pressable
            onPress={handleEndNavigation}
            className="mt-5 rounded-full bg-red-500 py-4 active:opacity-80"
          >
            <Text className="text-center font-semibold text-white">
              End Navigation
            </Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}