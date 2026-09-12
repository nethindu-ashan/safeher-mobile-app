import { useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";

import MapView, {
  Marker,
  Polyline,
  PROVIDER_GOOGLE,
} from "react-native-maps";


import { SafeAreaView } from "react-native-safe-area-context";

import AppCard from "../../src/components/AppCard";
import AppInput from "../../src/components/AppInput";
import PrimaryButton from "../../src/components/PrimaryButton";
import ScreenHeader from "../../src/components/ScreenHeader";
import { COLORS } from "../../src/constants/theme";
import { RouteOption, searchRoutes, } from "../../src/services/route.service";
import { compareRouteSafety, RouteComparison, } from "../../src/services/routeSafety.service";

import { decodePolyline } from "../../src/utils/decodePolyline";

import { router } from "expo-router";
import { useRouteContext } from "../../src/context/RouteContext";

import * as Location from "expo-location";

export default function RouteScreen() {

  const { setSelectedRoute } = useRouteContext();
  // Stores the starting location entered by the user.
  const [startLocation, setStartLocation] = useState("");

  // Stores the destination entered by the user.
  const [destination, setDestination] = useState("");

  // Controls the loading state.
  const [isLoading, setIsLoading] = useState(false);

  // Stores an error message.
  const [errorMessage, setErrorMessage] = useState("");

  // Stores the routes returned by the backend.
  const [routes, setRoutes] = useState<RouteOption[]>([]);


  const [routeComparisons, setRouteComparisons] = useState<RouteComparison[]>([]);

  const [isComparisonLoading, setIsComparisonLoading] = useState(false);

  const [comparisonError, setComparisonError] = useState("");

  const [recommendedRouteId, setRecommendedRouteId] = useState<string | null>(null);

  const [currentLocation, setCurrentLocation] = useState<Location.LocationObject | null>(null);

  // Controls the state of getting the user's current location.
  const [isGettingLocation, setIsGettingLocation] = useState(false);


  const handleUseCurrentLocation = async () => {
  try {
    setErrorMessage("");

    const { status } =
      await Location.requestForegroundPermissionsAsync();

    if (status !== "granted") {
      setErrorMessage(
        "Location permission is required to use your current location."
      );
      return;
    }

    const location = await Location.getCurrentPositionAsync({});

    setCurrentLocation(location);

    setStartLocation("Current Location");

  } catch (error) {
    setErrorMessage(
      "Unable to get your current location."
    );
  }
};

    /*
    * Handles the Search Routes button.
    */
    const handleSearchRoutes = async () => {
      const start = startLocation.trim();
      const destinationValue = destination.trim();

      // Check whether both locations were entered.
      if (!start || !destinationValue) {
        setErrorMessage(
          "Please enter both your starting location and destination."
        );
        setRoutes([]);
        return;
      }

      // Clear previous errors and routes.
      setErrorMessage("");
      setRoutes([]);

      try {
        // Start loading.
        setIsLoading(true);

        /*
        * Call the backend through route.service.ts.
        */
        const response = await searchRoutes({
          ...(currentLocation
            ? {
                startLatitude:
                  currentLocation.coords.latitude,
                startLongitude:
                  currentLocation.coords.longitude,
              }
            : {
                startLocation: start,
              }),
          destination: destination ,
        });

        
        const availableRoutes = response.data.routes;

        setRoutes(availableRoutes);

        // Clear previous comparison data
        setRouteComparisons([]);
        setComparisonError("");
        setRecommendedRouteId(null);

        /*
        * Compare safety information for all
        * available routes.
        */
        try {
          setIsComparisonLoading(true);

          const comparisonResponse =
            await compareRouteSafety(
              availableRoutes,
              0.5,
              30
            );

          const comparisons = comparisonResponse.data.routes || [];

          setRouteComparisons(comparisons);

          if (comparisons.length > 0) {
            const recommended = [...comparisons].sort(
              (a, b) => {
                // First priority: fewer incidents
                if (a.incidentCount !== b.incidentCount) {
                  return a.incidentCount - b.incidentCount;
                }

                // Second priority: shorter duration
                return (
                  (a.durationSeconds ?? Infinity) -
                  (b.durationSeconds ?? Infinity)
                );
              }
            )[0];

            setRecommendedRouteId(recommended.id);
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
      } catch (error) {
        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Unable to search for routes."
        );
      } finally {
        // Stop loading.
        setIsLoading(false);
      }
  };

  /*
   * Handles selecting a route.
   *
   * For now we only show a message.
   * The map/navigation functionality will be implemented later.
   */
  /*
 * Stores the selected route and navigates
 * to the separate route options screen.
 */
const handleSelectRoute = (route: RouteOption) => {
  setSelectedRoute(route);

  router.push("/route/options");
};



  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: COLORS.background,
      }}
    >
      <View className="flex-1 px-5">
        <ScreenHeader title="Safe Route" />

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 30 }}
        >
          {/* Page introduction */}
          <View className="mb-6 mt-3">
            <Text className="text-2xl font-bold text-app-text">
              Find a Safe Route
            </Text>

            <Text className="mt-2 text-sm leading-5 text-app-text-secondary">
              Enter your starting point and destination to find
              available travel routes.
            </Text>
          </View>

          {/* Route search form */}
          <AppCard>
            <AppInput
              label="Starting Location"
              placeholder="Enter starting location"
              value={startLocation}
              onChangeText={(text) => {
                setStartLocation(text);
                setCurrentLocation(null);
              }}
              autoCapitalize="words"
            />

            <Pressable
              onPress={handleUseCurrentLocation}
              disabled={isGettingLocation}
              className="mb-4 rounded-xl border border-primary bg-white py-3 active:opacity-70"
            >
              <Text className="text-center font-semibold text-primary">
                {isGettingLocation
                  ? "Getting Location..."
                  : "📍 Use Current Location"}
              </Text>
            </Pressable>

            <AppInput
              label="Destination"
              placeholder="Enter destination"
              value={destination}
              onChangeText={setDestination}
              autoCapitalize="words"
            />

            <PrimaryButton
              title={isLoading ? "Searching..." : "Search Routes"}
              onPress={handleSearchRoutes}
              disabled={isLoading}
            />
          </AppCard>

          {/* Loading state */}
          {isLoading && (
            <View className="items-center py-6">
              <ActivityIndicator
                size="large"
                color={COLORS.primary}
              />

              <Text className="mt-3 text-sm text-app-text-secondary">
                Finding available routes...
              </Text>
            </View>
          )}

          {/* Error state */}
          {!isLoading && errorMessage !== "" && (
            <AppCard>
              <Text className="text-sm font-medium text-red-500">
                {errorMessage}
              </Text>
            </AppCard>
          )}

          {/* Route results */}
          {!isLoading && routes.length > 0 && (
            <View className="mt-2">
              <View className="mb-3 flex-row items-center justify-between">
                <Text className="text-xl font-bold text-app-text">
                  Available Routes
                </Text>

                <Text className="text-sm text-app-text-secondary">
                  {routes.length} routes
                </Text>
              </View>

              {routes.map((route, index) => (
                <AppCard key={route.id}>
                  {/* Route name */}
                  <View className="mb-3 flex-row items-center justify-between">
                    <Text className="flex-1 text-lg font-semibold text-app-text">
                      {route.name}
                    </Text>

                    {recommendedRouteId === route.id && (
                      <View className="rounded-full bg-light-purple px-3 py-1">
                        <Text className="text-xs font-semibold text-primary">
                          Recommended
                        </Text>
                      </View>
                    )}
                  </View>

                  {/* Start → Destination */}
                  <Text className="mb-4 text-sm text-app-text-secondary">
                    {route.startLocation} → {route.destination}
                  </Text>

                  {/* Distance and duration */}
                  <View className="mb-4 flex-row">
                    <View className="mr-6">
                      <Text className="text-xs text-app-text-secondary">
                        Distance
                      </Text>

                      <Text className="mt-1 text-base font-semibold text-app-text">
                        {route.distance}
                      </Text>
                    </View>

                    <View>
                      <Text className="text-xs text-app-text-secondary">
                        Estimated Time
                      </Text>

                      <Text className="mt-1 text-base font-semibold text-app-text">
                        {route.duration}
                      </Text>
                    </View>
                  </View>

                  {/* Route safety comparison */}
                  {isComparisonLoading ? (
                    <Text className="mb-4 text-sm text-app-text-secondary">
                      Checking route safety...
                    </Text>
                  ) : (
                    (() => {
                      const comparison =
                        routeComparisons.find(
                          (item) => item.id === route.id
                        );

                      if (!comparison) {
                        return null;
                      }

                      return (
                        <View className="mb-4 rounded-xl bg-light-purple p-3">
                          <Text className="text-sm font-semibold text-primary">
                            Route Safety
                          </Text>

                          <Text className="mt-1 text-sm text-app-text">
                            {comparison.incidentCount} recent report
                            {comparison.incidentCount !== 1
                              ? "s"
                              : ""}{" "}
                            near this route
                          </Text>

                          <Text className="mt-1 text-xs text-app-text-secondary">
                            {comparison.comparisonLabel}
                          </Text>

                          {recommendedRouteId === route.id && (
                            <Text className="mt-1 text-xs font-medium text-primary">
                              Recommended based on fewer recent reports
                            </Text>
                          )}
                        </View>
                      );
                    })()
                  )}

                  {/* Select route button */}
                  <Pressable
                    onPress={() => handleSelectRoute(route)}
                    className="rounded-full border border-primary py-3 active:opacity-70"
                  >
                    <Text className="text-center font-semibold text-primary">
                      Select Route
                    </Text>
                  </Pressable>
                </AppCard>
              ))}
            </View>
          )}

          {/* No results */}
          {!isLoading &&
            !errorMessage &&
            routes.length === 0 && (
              <View className="items-center py-8">
                <Text className="text-center text-sm text-app-text-secondary">
                  Enter your locations and search for available
                  routes.
                </Text>
              </View>
            )}

          
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}