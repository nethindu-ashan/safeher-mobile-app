import { router } from "expo-router";
import { useState } from "react";

import {
  Alert,
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
import ErrorState from "../../src/components/ErrorState";
import PrimaryButton from "../../src/components/PrimaryButton";
import ScreenHeader from "../../src/components/ScreenHeader";

import {
  useIncidentReport,
} from "../../src/context/IncidentReportContext";

import {
  createIncident,
} from "../../src/services/incidentService";

import {
  COLORS,
} from "../../src/constants/theme";

export default function ReviewReportScreen() {
  const {
    draft,
  } = useIncidentReport();

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const handleSubmit = async () => {
    console.log(
      "createIncident type:",
      typeof createIncident
    );

    // Check location
    if (
      draft.latitude === null ||
      draft.longitude === null
    ) {
      Alert.alert(
        "Location Required",
        "Please select an incident location."
      );

      return;
    }

    // Check category
    if (!draft.category) {
      Alert.alert(
        "Category Required",
        "Please select an incident category."
      );

      return;
    }

    // Check description
    if (!draft.description?.trim()) {
      Alert.alert(
        "Description Required",
        "Please enter an incident description."
      );

      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Create payload for backend
      const payload = {
        category: draft.category,

        description:
          draft.description.trim(),

        latitude:
          draft.latitude,

        longitude:
          draft.longitude,

        dateTime:
          draft.dateTime,

        isAnonymous:
          draft.isAnonymous,
      };

      console.log(
        "Submitting incident:",
        payload
      );

      // Send report to backend
      const response =
        await createIncident(payload);

      console.log(
        "Incident API response:",
        response
      );

      // Go to success screen
      router.replace({
        pathname: "/report/success",

        params: {
          id:
            response?.data?.id ??
            "",

          status:
            response?.data?.status ??
            "Pending Review",
        },
      });
    } catch (err) {
      console.error(
        "Submit incident error:",
        err
      );

      const message =
        err instanceof Error
          ? err.message
          : "Unable to submit report.";

      setError(message);

      Alert.alert(
        "Submission Failed",
        message
      );
    } finally {
      setLoading(false);
    }
  };

  const locationAvailable =
    draft.latitude !== null &&
    draft.longitude !== null;

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: COLORS.background,
      }}
    >
      <ScrollView
        className="flex-1 px-5"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 30,
        }}
      >
        <ScreenHeader title="Review Your Report" />

        <Text className="mb-5 text-sm text-app-muted">
          Please verify the details before submitting.
        </Text>

        {/* Report Details */}
        <AppCard>
          <Text className="text-xs font-medium uppercase text-app-muted">
            Incident Type
          </Text>

          <Text className="mt-1 font-semibold text-app-text">
            {draft.category || "Not selected"}
          </Text>

          <Text className="mt-5 text-xs font-medium uppercase text-app-muted">
            Description
          </Text>

          <Text className="mt-1 leading-5 text-app-text">
            {draft.description || "No description"}
          </Text>

          <Text className="mt-5 text-xs font-medium uppercase text-app-muted">
            Reporting
          </Text>

          <Text className="mt-1 text-app-text">
            {draft.isAnonymous
              ? "Anonymous Report"
              : "Identified Report"}
          </Text>

          <Text className="mt-5 text-xs font-medium uppercase text-app-muted">
            Incident Time
          </Text>

          <Text className="mt-1 text-app-text">
            {draft.dateTime
              ? new Date(
                  draft.dateTime
                ).toLocaleString()
              : "Not available"}
          </Text>
        </AppCard>

        {/* Location Preview */}
        {locationAvailable && (
          <View className="mb-5 overflow-hidden rounded-2xl border border-app-border bg-white">
            <MapView
              style={{
                height: 180,
              }}
              initialRegion={{
                latitude:
                  draft.latitude as number,

                longitude:
                  draft.longitude as number,

                latitudeDelta:
                  0.01,

                longitudeDelta:
                  0.01,
              }}
              scrollEnabled={false}
              zoomEnabled={false}
              rotateEnabled={false}
              pitchEnabled={false}
            >
              <Marker
                coordinate={{
                  latitude:
                    draft.latitude as number,

                  longitude:
                    draft.longitude as number,
                }}
                pinColor={COLORS.pink}
                title="Incident Location"
              />
            </MapView>

            <View className="p-4">
              <Text className="font-semibold text-app-text">
                Selected Location
              </Text>

              <Text className="mt-1 text-sm text-app-muted">
                Latitude:{" "}
                {draft.latitude?.toFixed(6)}
              </Text>

              <Text className="mt-1 text-sm text-app-muted">
                Longitude:{" "}
                {draft.longitude?.toFixed(6)}
              </Text>
            </View>
          </View>
        )}

        {/* Error Message */}
        {error && (
          <ErrorState
            message={error}
          />
        )}

        {/* Submit */}
        <PrimaryButton
          title={
            loading
              ? "Submitting..."
              : "Submit Report"
          }
          disabled={loading}
          onPress={handleSubmit}
        />

        {/* Edit */}
        <Text
          onPress={() => router.back()}
          className="mt-5 text-center font-medium text-app-muted"
        >
          Edit Report
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}