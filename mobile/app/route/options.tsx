import { useEffect, useRef, useState } from "react";

import MapView, {
  Marker,
  Polyline,
  //PROVIDER_GOOGLE,
} from "react-native-maps";

import {
  ScrollView,
  Text,
  View,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import AppCard from "../../src/components/AppCard";
import PrimaryButton from "../../src/components/PrimaryButton";
import ScreenHeader from "../../src/components/ScreenHeader";

import { COLORS } from "../../src/constants/theme";

import { useRouteContext } from "../../src/context/RouteContext";

import { decodePolyline } from "../../src/utils/decodePolyline";

export default function RouteOptionsScreen() {
  const { selectedRoute } = useRouteContext();

  const mapRef = useRef<MapView>(null);

  const [routeCoordinates, setRouteCoordinates] =
    useState<
      {
        latitude: number;
        longitude: number;
      }[]
    >([]);

  /*
   * Decode the selected route when
   * the screen is opened.
   */
  useEffect(() => {
    if (!selectedRoute?.encodedPolyline) {
      return;
    }

    const coordinates = decodePolyline(
      selectedRoute.encodedPolyline
    );

    setRouteCoordinates(coordinates);

    
    /*
     * Automatically fit the entire route
     * inside the map.
     */
    /*
    if (coordinates.length > 0) {
      setTimeout(() => {
        mapRef.current?.fitToCoordinates(
          coordinates,
          {
            edgePadding: {
              top: 60,
              right: 40,
              bottom: 60,
              left: 40,
            },
            animated: true,
          }
        );
      }, 300);
    }*/
  }, [selectedRoute]);

  /*
   * If the user somehow opens this page
   * without selecting a route.
   */
  if (!selectedRoute || routeCoordinates.length === 0) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: COLORS.background,
        }}
      >
        <View className="flex-1 px-5">
          <ScreenHeader title="Route Options" />

          <View className="flex-1 items-center justify-center">
            <Text className="text-center text-app-text-secondary">
              No route has been selected.
            </Text>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  const startCoordinate = routeCoordinates[0];

  const destinationCoordinate =
    routeCoordinates[routeCoordinates.length - 1];

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: COLORS.background,
      }}
    >
      <View className="flex-1 px-5">
        <ScreenHeader title="Route Options" />

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingBottom: 30,
          }}
        >
          {/* Map */}
          <View className="mt-3 overflow-hidden rounded-2xl">
            <MapView
                ref={mapRef}
                style={{
                  width: "100%",
                  height: 400,
                }}
                initialRegion={{
                  latitude: startCoordinate.latitude,
                  longitude: startCoordinate.longitude,
                  latitudeDelta: 0.08,
                  longitudeDelta: 0.08,
                }}
                onMapReady={() => {
                  mapRef.current?.fitToCoordinates(routeCoordinates, {
                    edgePadding: {
                      top: 60,
                      right: 40,
                      bottom: 60,
                      left: 40,
                    },
                    animated: true,
                  });
                }}
              >
              
              {/* Starting location */}
              <Marker
                coordinate={startCoordinate}
                title="Starting Location"
                description={selectedRoute.startLocation}
              />

              {/* Destination */}
              <Marker
                coordinate={destinationCoordinate}
                title="Destination"
                description={selectedRoute.destination}
              />

              {/* Route line */}
              <Polyline
                coordinates={routeCoordinates}
                strokeWidth={5}
                strokeColor={COLORS.primary}
              />
            </MapView>
          </View>

          {/* Route information */}
          <AppCard>
            <Text className="text-xl font-bold text-app-text">
              {selectedRoute.name}
            </Text>

            <Text className="mt-2 text-sm text-app-text-secondary">
              {selectedRoute.startLocation} →{" "}
              {selectedRoute.destination}
            </Text>

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
          </AppCard>

          {/* Navigation button */}
          <PrimaryButton
            title="Start Navigation"
            onPress={() => {
              console.log(
                "Start navigation:",
                selectedRoute.id
              );
            }}
          />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}