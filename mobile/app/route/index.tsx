import { useEffect, useRef, useState } from "react";

import {
  ActivityIndicator,
  Keyboard,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";

import MapView, {
  Marker,
} from "react-native-maps";

import { SafeAreaView } from "react-native-safe-area-context";

import AppCard from "../../src/components/AppCard";
import AppInput from "../../src/components/AppInput";
import ScreenHeader from "../../src/components/ScreenHeader";

import { COLORS } from "../../src/constants/theme";

import {
  RouteOption,
  searchRoutes,
} from "../../src/services/route.service";

import {
  compareRouteSafety,
  RouteComparison,
} from "../../src/services/routeSafety.service";

import { router } from "expo-router";

import { useRouteContext } from "../../src/context/RouteContext";

import * as Location from "expo-location";

export default function RouteScreen() {
  const { setSelectedRoute } = useRouteContext();

  const mapRef = useRef<MapView>(null);

  // Destination entered by the user.
  const [destination, setDestination] =
    useState("");

  // Current device location.
  const [currentLocation, setCurrentLocation] =
    useState<Location.LocationObject | null>(
      null
    );

  // Destination selected by tapping the map.
  const [selectedDestination, setSelectedDestination] =
    useState<{
      latitude: number;
      longitude: number;
    } | null>(null);

  // Loading state while getting location.
  const [isGettingLocation, setIsGettingLocation] =
    useState(true);

  // Route search loading state.
  const [isLoading, setIsLoading] =
    useState(false);

  // General error message.
  const [errorMessage, setErrorMessage] =
    useState("");

  // Routes returned by backend.
  const [routes, setRoutes] =
    useState<RouteOption[]>([]);

  // Route safety comparison results.
  const [routeComparisons, setRouteComparisons] =
    useState<RouteComparison[]>([]);

  // Safety comparison loading.
  const [isComparisonLoading, setIsComparisonLoading] =
    useState(false);

  // Safety comparison error.
  const [comparisonError, setComparisonError] =
    useState("");

  // Recommended route.
  const [recommendedRouteId, setRecommendedRouteId] =
    useState<string | null>(null);

  // Controls route results bottom sheet.
  const [isResultsExpanded, setIsResultsExpanded] =
    useState(true);

  

  /*
   * Automatically get the user's
   * current location when the screen opens.
   */
  useEffect(() => {
    const getCurrentLocation =
      async () => {
        try {
          setIsGettingLocation(true);
          setErrorMessage("");

          /*
           * Request location permission.
           */
          const { status } =
            await Location.requestForegroundPermissionsAsync();

          if (status !== "granted") {
            setErrorMessage(
              "Location permission is required to find your current location."
            );

            setIsGettingLocation(false);
            return;
          }

          /*
           * Get current GPS location.
           */
          const location =
            await Location.getCurrentPositionAsync(
              {
                accuracy:
                  Location.Accuracy.High,
              }
            );

          setCurrentLocation(location);
        } catch (error) {
          console.error(
            "Current location error:",
            error
          );

          setErrorMessage(
            "Unable to get your current location."
          );
        } finally {
          setIsGettingLocation(false);
        }
      };

    getCurrentLocation();
  }, []);

  /*
   * Search routes using:
   *
   * Current GPS location
   * +
   * User-entered destination.
   */
  const handleSearchRoutes = async () => {
    Keyboard.dismiss();

    const destinationValue =
      destination.trim();

    /*
     * Destination is required.
     */
    if (!destinationValue) {
      setErrorMessage(
        "Please enter your destination."
      );

      return;
    }

    let destinationCoordinates = selectedDestination;

    if (!destinationCoordinates) {
      try {
        const locations = await Location.geocodeAsync(
          destinationValue
        );

        if (locations.length > 0) {
          destinationCoordinates = {
            latitude: locations[0].latitude,
            longitude: locations[0].longitude,
          };

          setSelectedDestination(destinationCoordinates);

          mapRef.current?.animateToRegion(
            {
              latitude: destinationCoordinates.latitude,
              longitude: destinationCoordinates.longitude,
              latitudeDelta: 0.03,
              longitudeDelta: 0.03,
            },
            500
          );

        }
      } catch (error) {
        console.error(
          "Destination geocoding error:",
          error
        );
      }
    }

    /*
     * Current location must be available.
     */
    if (!currentLocation) {
      setErrorMessage(
        "Your current location is not available yet. Please wait a moment and try again."
      );

      return;
    }

    /*
     * Clear previous data.
     */
    setErrorMessage("");
    setRoutes([]);
    setRouteComparisons([]);
    setComparisonError("");
    setRecommendedRouteId(null);

    /*
     * Open results sheet when
     * new search starts.
     */
    setIsResultsExpanded(true);

    try {
      setIsLoading(true);

      /*
       * Send current GPS coordinates
       * and destination to backend.
       */
      const response = await searchRoutes({
        startLatitude:
          currentLocation.coords.latitude,

        startLongitude:
          currentLocation.coords.longitude,

        destination: destinationValue,

        ...(destinationCoordinates && {
          destinationLatitude:
            destinationCoordinates.latitude,

          destinationLongitude:
            destinationCoordinates.longitude,
        }),
      });

      const availableRoutes =
        response.data.routes || [];

      setRoutes(availableRoutes);

      /*
       * Compare route safety only
       * when there are at least two routes.
       */
      if (availableRoutes.length >= 2) {
        try {
          setIsComparisonLoading(true);

          const comparisonResponse =
            await compareRouteSafety(
              availableRoutes,
              0.5,
              30
            );

          const comparisons =
            comparisonResponse.data.routes ||
            [];

          setRouteComparisons(
            comparisons
          );

          /*
           * Select recommended route.
           *
           * First:
           * fewer safety incidents.
           *
           * Second:
           * shorter duration.
           */
          if (comparisons.length > 0) {
            const recommended =
              [...comparisons].sort(
                (a, b) => {
                  if (
                    a.incidentCount !==
                    b.incidentCount
                  ) {
                    return (
                      a.incidentCount -
                      b.incidentCount
                    );
                  }

                  return (
                    (a.durationSeconds ??
                      Infinity) -
                    (b.durationSeconds ??
                      Infinity)
                  );
                }
              )[0];

            setRecommendedRouteId(
              recommended.id
            );
          }
        } catch (comparisonError) {
          console.error(
            "Route comparison error:",
            comparisonError
          );

          setComparisonError(
            comparisonError instanceof Error
              ? comparisonError.message
              : "Unable to compare route safety."
          );
        } finally {
          setIsComparisonLoading(false);
        }
      }
    } catch (error) {
      console.error(
        "Route search error:",
        error
      );

      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Unable to search for routes."
      );
    } finally {
      setIsLoading(false);
    }
  };

  /*
   * Select route and open
   * Route Options screen.
   */
  const handleSelectRoute = (
    route: RouteOption
  ) => {
    Keyboard.dismiss();

    setSelectedRoute(route);

    router.push("/route/options");
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor:
          COLORS.background,
      }}
    >
      <View className="flex-1">

        {/* =====================================
            HEADER
        ====================================== */}

        <View className="px-5">
          <ScreenHeader title="Safe Route" />
        </View>

        {/* =====================================
            SEARCH SECTION
        ====================================== */}

        {/* Header with Back Button */}
        <View className="absolute left-0 right-0 top-0 z-20 px-5">
          <ScreenHeader title="Safe Route" />
        </View>

        {/* Full Screen Map */}
        <View className="absolute inset-0">
          <MapView 
            style={{
              width: "100%",
              height: "100%",
            }}
            // ...
          />
        </View>

        {/* Floating Destination Search */}
        <View className="absolute left-0 right-0 top-20 z-10 px-5">
          <View className="flex-row items-center">

            <TextInput
              className="flex-1 rounded-full border border-app-border bg-white px-5 py-3 text-base text-app-text"
              placeholder="Enter destination"
              placeholderTextColor="#8A8192"
              value={destination}
              onChangeText={(text) => {
                setDestination(text);
                setSelectedDestination(null);
              }}
              autoCapitalize="words"
              returnKeyType="search"
              onSubmitEditing={handleSearchRoutes}
            />

            <Pressable
              onPress={handleSearchRoutes}
              disabled={isLoading || isGettingLocation}
              className="ml-2 h-11 w-11 items-center justify-center rounded-full bg-primary"
            >
              <Text className="text-lg text-white">🔍</Text>
            </Pressable>

          </View>
        </View>
        
        {/* =====================================
            MAP
        ====================================== */}

        <View className="absolute inset-0">
          <MapView
            ref={mapRef}
            style={{
              width: "100%",
              height: "100%",
            }}
            onPress={async (event) => {
              Keyboard.dismiss();

              const {
                latitude,
                longitude,
              } = event.nativeEvent.coordinate;

              const coordinates = {
                latitude,
                longitude,
              };

              // Show selected destination marker.
              setSelectedDestination(coordinates);

              try {
                // Convert coordinates into a readable place name.
                const addresses =
                  await Location.reverseGeocodeAsync(
                    coordinates
                  );

                if (addresses.length > 0) {
                  const address = addresses[0];

                  const placeName =
                    address.name ||
                    address.street ||
                    address.city ||
                    address.region ||
                    `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`;

                  setDestination(placeName);
                } else {
                  setDestination(
                    `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`
                  );
                }
              } catch (error) {
                console.error(
                  "Reverse geocoding error:",
                  error
                );

                setDestination(
                  `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`
                );
              }
            }}
            showsUserLocation={
              !!currentLocation
            }
            showsMyLocationButton={true}
            initialRegion={{
              latitude:
                currentLocation?.coords
                  .latitude ?? 7.8731,

              longitude:
                currentLocation?.coords
                  .longitude ?? 80.7718,

              latitudeDelta: 0.15,
              longitudeDelta: 0.15,
            }}
          >
            {currentLocation && (
              <Marker
                coordinate={{
                  latitude:
                    currentLocation.coords
                      .latitude,

                  longitude:
                    currentLocation.coords
                      .longitude,
                }}
                title="Current Location"
              />
            )}

            {selectedDestination && (
              <Marker
                coordinate={selectedDestination}
                title="Selected Destination"
                description={destination}
              />
            )}

          </MapView>
        </View>

        {/* =====================================
            ERROR MESSAGE
        ====================================== */}

        {!isLoading &&
          errorMessage !== "" && (
            <View className="absolute left-5 right-5 top-36 rounded-xl bg-white p-4">
              <Text className="text-sm font-medium text-red-500">
                {errorMessage}
              </Text>
            </View>
          )}

        {/* =====================================
            ROUTE RESULTS BOTTOM SHEET
        ====================================== */}

        {!isLoading &&
          routes.length > 0 && (
            <View
              className={
                isResultsExpanded
                  ? "absolute bottom-0 left-0 right-0 max-h-[65%] rounded-t-3xl bg-white px-5 pb-6 pt-3"
                  : "absolute bottom-0 left-0 right-0 rounded-t-3xl bg-white px-5 pb-4 pt-3"
              }
            >

              {/* Sheet handle */}

              <Pressable
                onPress={() => {
                  setIsResultsExpanded(
                    !isResultsExpanded
                  );

                  Keyboard.dismiss();
                }}
                className="items-center py-2"
              >
                <View className="h-1.5 w-12 rounded-full bg-gray-300" />
              </Pressable>

              {/* =================================
                  MINIMIZED
              ================================== */}

              {!isResultsExpanded && (
                <Pressable
                  onPress={() =>
                    setIsResultsExpanded(
                      true
                    )
                  }
                >
                  <View className="flex-row items-center justify-between">

                    <View>
                      <Text className="text-lg font-bold text-app-text">
                        Available Routes
                      </Text>

                      <Text className="mt-1 text-sm text-app-text-secondary">
                        {routes.length} route
                        {routes.length !== 1
                          ? "s"
                          : ""}{" "}
                        found
                      </Text>
                    </View>

                    <Text className="text-xl text-app-text">
                      ↑
                    </Text>
                  </View>
                </Pressable>
              )}

              {/* =================================
                  EXPANDED
              ================================== */}

              {isResultsExpanded && (
                <>
                  <View className="mb-3 flex-row items-center justify-between">

                    <Text className="text-xl font-bold text-app-text">
                      Available Routes
                    </Text>

                    <Pressable
                      onPress={() =>
                        setIsResultsExpanded(
                          false
                        )
                      }
                      className="h-10 w-10 items-center justify-center rounded-full bg-gray-100"
                    >
                      <Text className="text-xl text-app-text">
                        ↓
                      </Text>
                    </Pressable>

                  </View>

                  <ScrollView
                    showsVerticalScrollIndicator={
                      false
                    }
                    keyboardShouldPersistTaps="handled"
                    contentContainerStyle={{
                      paddingBottom: 20,
                    }}
                  >
                    {routes.map(
                      (route) => (
                        <AppCard
                          key={route.id}
                        >

                          {/* Route name */}

                          <View className="mb-3 flex-row items-center justify-between">

                            <Text className="flex-1 text-lg font-semibold text-app-text">
                              {route.name}
                            </Text>

                            {recommendedRouteId ===
                              route.id && (
                              <View className="rounded-full bg-light-purple px-3 py-1">
                                <Text className="text-xs font-semibold text-primary">
                                  Recommended
                                </Text>
                              </View>
                            )}

                          </View>

                          {/* Start → Destination */}

                          <Text className="mb-4 text-sm text-app-text-secondary">
                            Current Location
                            {" → "}
                            {route.destination}
                          </Text>

                          {/* Distance / Duration */}

                          <View className="mb-4 flex-row">

                            <View className="mr-8">
                              <Text className="text-xs text-app-text-secondary">
                                Distance
                              </Text>

                              <Text className="mt-1 text-base font-semibold text-app-text">
                                {
                                  route.distance
                                }
                              </Text>
                            </View>

                            <View>
                              <Text className="text-xs text-app-text-secondary">
                                Estimated Time
                              </Text>

                              <Text className="mt-1 text-base font-semibold text-app-text">
                                {
                                  route.duration
                                }
                              </Text>
                            </View>

                          </View>

                          {/* Route safety */}

                          {isComparisonLoading ? (
                            <Text className="mb-4 text-sm text-app-text-secondary">
                              Checking route safety...
                            </Text>
                          ) : (
                            (() => {
                              const comparison =
                                routeComparisons.find(
                                  (
                                    item
                                  ) =>
                                    item.id ===
                                    route.id
                                );

                              if (
                                !comparison
                              ) {
                                return null;
                              }

                              return (
                                <View className="mb-4 rounded-xl bg-light-purple p-3">

                                  <Text className="text-sm font-semibold text-primary">
                                    Route Safety
                                  </Text>

                                  <Text className="mt-1 text-sm text-app-text">
                                    {
                                      comparison.incidentCount
                                    }{" "}
                                    recent
                                    report
                                    {comparison.incidentCount !==
                                    1
                                      ? "s"
                                      : ""}{" "}
                                    near this
                                    route
                                  </Text>

                                  {recommendedRouteId ===
                                    route.id && (
                                    <Text className="mt-1 text-xs font-medium text-primary">
                                      Recommended based on fewer recent reports
                                    </Text>
                                  )}

                                </View>
                              );
                            })()
                          )}

                          {/* Select route */}

                          <Pressable
                            onPress={() =>
                              handleSelectRoute(
                                route
                              )
                            }
                            className="rounded-full border border-primary py-3 active:opacity-70"
                          >
                            <Text className="text-center font-semibold text-primary">
                              Select Route
                            </Text>
                          </Pressable>

                        </AppCard>
                      )
                    )}

                    {/* Comparison error */}

                    {comparisonError !==
                      "" && (
                      <Text className="mt-2 text-xs text-red-500">
                        {comparisonError}
                      </Text>
                    )}
                  </ScrollView>
                </>
              )}
            </View>
          )}
      </View>
    </SafeAreaView>
  );
}