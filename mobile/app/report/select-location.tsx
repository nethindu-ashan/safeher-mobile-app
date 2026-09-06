import { router } from "expo-router";
import * as Location from "expo-location";
import { useEffect, useState } from "react";

import {
  Alert,
  Text,
  View,
} from "react-native";

import MapView, {
  MapPressEvent,
  Marker,
  Region,
} from "react-native-maps";

import { SafeAreaView } from "react-native-safe-area-context";

import PrimaryButton from "../../src/components/PrimaryButton";
import ScreenHeader from "../../src/components/ScreenHeader";

import {
  useIncidentReport,
} from "../../src/context/IncidentReportContext";

import {
  COLORS,
} from "../../src/constants/theme";


const DEFAULT_REGION: Region = {
  latitude: 6.9271,
  longitude: 79.8612,
  latitudeDelta: 0.02,
  longitudeDelta: 0.02,
};


export default function SelectLocationScreen() {
  const {
    draft,
    updateDraft,
  } = useIncidentReport();

  const [region, setRegion] =
    useState<Region>(DEFAULT_REGION);

  const [selectedLocation, setSelectedLocation] =
    useState<{
      latitude: number;
      longitude: number;
    } | null>(
      draft.latitude !== null &&
      draft.longitude !== null
        ? {
            latitude: draft.latitude,
            longitude: draft.longitude,
          }
        : null
    );


  useEffect(() => {
    const loadCurrentLocation = async () => {
      try {
        // Ask permission to use device location
        const { status } =
          await Location.requestForegroundPermissionsAsync();

        // If permission is denied,
        // user can still manually select a point on the map
        if (status !== "granted") {
          Alert.alert(
            "Location Permission",
            "Location permission was not granted. You can still select the incident location manually on the map."
          );

          return;
        }

        // Get current device location
        const location =
          await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.High,
          });

        const coordinates = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        };

        // Move the map to the user's current location
        setRegion({
          latitude: coordinates.latitude,
          longitude: coordinates.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        });

        // Only automatically select current location
        // if user has not already selected another location
        if (
          draft.latitude === null ||
          draft.longitude === null
        ) {
          setSelectedLocation(coordinates);
        }
      } catch (error) {
        console.error(
          "Unable to get current location:",
          error
        );

        Alert.alert(
          "Location Error",
          "Unable to get your current location. Please select the incident location manually on the map."
        );
      }
    };

    loadCurrentLocation();
  }, [draft.latitude, draft.longitude]);


  // Runs when user taps somewhere on the map
  const handleMapPress = (
    event: MapPressEvent
  ) => {
    const coordinate =
      event.nativeEvent.coordinate;

    setSelectedLocation({
      latitude: coordinate.latitude,
      longitude: coordinate.longitude,
    });
  };


  // Save selected coordinates into the shared report context
  const handleConfirm = () => {
    if (!selectedLocation) {
      Alert.alert(
        "Select Location",
        "Please select an incident location on the map."
      );

      return;
    }

    updateDraft({
      latitude: selectedLocation.latitude,
      longitude: selectedLocation.longitude,
    });

    // Return to report form
    router.back();
  };


  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: COLORS.background,
      }}
    >
      <View className="flex-1 px-5">
        <ScreenHeader title="Select Location" />

        <Text className="mb-4 text-sm leading-5 text-app-muted">
          Tap anywhere on the map to select where the
          incident happened.
        </Text>


        {/* Map */}
        <View className="flex-1 overflow-hidden rounded-2xl border border-app-border">
          <MapView
            style={{
              flex: 1,
            }}
            region={region}
            onRegionChangeComplete={setRegion}
            onPress={handleMapPress}
            showsUserLocation
            showsMyLocationButton
          >
            {selectedLocation && (
              <Marker
                coordinate={{
                  latitude:
                    selectedLocation.latitude,
                  longitude:
                    selectedLocation.longitude,
                }}
                pinColor={COLORS.pink}
                title="Incident Location"
                description="Selected incident location"
              />
            )}
          </MapView>
        </View>


        {/* Selected coordinates */}
        {selectedLocation && (
          <View className="mt-4 rounded-2xl bg-light-purple p-4">
            <Text className="font-semibold text-primary">
              Selected Location
            </Text>

            <Text className="mt-1 text-sm text-app-muted">
              Latitude:{" "}
              {selectedLocation.latitude.toFixed(6)}
            </Text>

            <Text className="mt-1 text-sm text-app-muted">
              Longitude:{" "}
              {selectedLocation.longitude.toFixed(6)}
            </Text>

            <Text className="mt-2 text-xs text-app-muted">
              Tap another place on the map if you want
              to change this location.
            </Text>
          </View>
        )}


        {/* Confirm button */}
        <View className="pb-5 pt-4">
          <PrimaryButton
            title="Confirm Location"
            onPress={handleConfirm}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}