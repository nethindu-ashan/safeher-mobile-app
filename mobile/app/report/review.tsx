import { Ionicons } from "@expo/vector-icons";

import { router } from "expo-router";

import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";

import {
  SafeAreaView,
} from "react-native-safe-area-context";

import {
  useState,
} from "react";

import PrimaryButton from "../../src/components/PrimaryButton";
import ScreenHeader from "../../src/components/ScreenHeader";

import {
  COLORS,
} from "../../src/constants/theme";

import {
  useIncidentReport,
} from "../../src/context/IncidentReportContext";

import {
  createIncident,
} from "../../src/services/incidentService";

import {
  uploadIncidentEvidence,
} from "../../src/services/evidenceService";

export default function ReviewIncidentScreen() {
  const {
    draft,
  } = useIncidentReport();

  const [
    submitting,
    setSubmitting,
  ] =
    useState(false);

  const handleSubmit =
    async () => {
      if (
        draft.latitude ===
          null ||
        draft.longitude ===
          null
      ) {
        Alert.alert(
          "Location Required",
          "Please select an incident location."
        );

        router.push(
          "/report/select-location"
        );

        return;
      }

      try {
        setSubmitting(true);

        const evidencePaths =
          draft.evidence.length >
          0
            ? await uploadIncidentEvidence(
                draft.evidence
              )
            : [];

        const response =
          await createIncident({
            category:
              draft.category,
            latitude:
              draft.latitude,
            longitude:
              draft.longitude,
            dateTime:
              draft.dateTime,
            description:
              draft.description,
            isAnonymous:
              draft.isAnonymous,
            evidencePaths,
          });

        router.replace({
          pathname:
            "/report/success",
          params: {
            id:
              response.data.id,
            status:
              response.data.status,
          },
        });
      } catch (error) {
        console.error(
          "Report submission error:",
          error
        );

        Alert.alert(
          "Submission Failed",
          error instanceof Error
            ? error.message
            : "Unable to submit your report."
        );
      } finally {
        setSubmitting(false);
      }
    };

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
        showsVerticalScrollIndicator={
          false
        }
        contentContainerStyle={{
          paddingBottom: 40,
        }}
      >
        <ScreenHeader title="Review Your Report" />

        <Text className="mt-2 text-sm leading-5 text-app-muted">
          Please verify
          the details before
          submitting.
        </Text>

        <View className="mt-6 rounded-3xl border border-app-border bg-white p-5">
          <Text className="text-xs font-semibold uppercase text-app-muted">
            Incident Type
          </Text>

          <Text className="mt-2 text-base font-bold text-app-text">
            {draft.category}
          </Text>
        </View>

        <View className="mt-4 rounded-3xl border border-app-border bg-white p-5">
          <Text className="text-xs font-semibold uppercase text-app-muted">
            Description
          </Text>

          <Text className="mt-2 text-sm leading-6 text-app-text">
            {
              draft.description
            }
          </Text>
        </View>

        <View className="mt-4 rounded-3xl border border-app-border bg-white p-5">
          <View className="flex-row items-center">
            <Ionicons
              name="location-outline"
              size={21}
              color={
                COLORS.primary
              }
            />

            <Text className="ml-2 text-xs font-semibold uppercase text-app-muted">
              Incident Location
            </Text>
          </View>

          <Text className="mt-3 text-sm font-medium text-app-text">
            {draft.latitude?.toFixed(
              6
            )}
            ,{" "}
            {draft.longitude?.toFixed(
              6
            )}
          </Text>
        </View>

        <View className="mt-4 rounded-3xl border border-app-border bg-white p-5">
          <View className="flex-row items-center">
            <Ionicons
              name={
                draft.isAnonymous
                  ? "eye-off-outline"
                  : "person-outline"
              }
              size={21}
              color={
                COLORS.primary
              }
            />

            <Text className="ml-2 text-xs font-semibold uppercase text-app-muted">
              Submission
            </Text>
          </View>

          <Text className="mt-3 text-sm font-medium text-app-text">
            {draft.isAnonymous
              ? "Anonymous report"
              : "Report with profile"}
          </Text>
        </View>

        <View className="mt-4 rounded-3xl border border-app-border bg-white p-5">
          <View className="flex-row items-center">
            <Ionicons
              name="images-outline"
              size={21}
              color={
                COLORS.primary
              }
            />

            <Text className="ml-2 text-xs font-semibold uppercase text-app-muted">
              Incident Evidence
            </Text>
          </View>

          {draft.evidence
            .length === 0 ? (
            <Text className="mt-3 text-sm text-app-muted">
              No evidence
              photos attached.
            </Text>
          ) : (
            <>
              <Text className="mt-3 text-sm text-app-muted">
                {
                  draft
                    .evidence
                    .length
                }{" "}
                {draft.evidence
                  .length === 1
                  ? "photo"
                  : "photos"}{" "}
                attached
              </Text>

              <View className="mt-4 flex-row flex-wrap gap-3">
                {draft.evidence.map(
                  (
                    item,
                    index
                  ) => (
                    <Image
                      key={`${item.uri}-${index}`}
                      source={{
                        uri:
                          item.uri,
                      }}
                      style={{
                        width: 88,
                        height: 88,
                        borderRadius:
                          14,
                      }}
                    />
                  )
                )}
              </View>
            </>
          )}
        </View>

        <View className="mt-4 flex-row rounded-3xl bg-light-purple p-4">
          <Ionicons
            name="shield-checkmark-outline"
            size={22}
            color={
              COLORS.primary
            }
          />

          <Text className="ml-3 flex-1 text-xs leading-5 text-app-muted">
            Your report will
            be submitted for
            review. Evidence
            files are stored
            privately and are
            not included in
            the public nearby
            incident feed.
          </Text>
        </View>

        <View className="mt-8">
          {submitting ? (
            <View className="h-14 items-center justify-center rounded-2xl bg-primary">
              <ActivityIndicator
                color="#FFFFFF"
              />

              <Text className="mt-1 text-xs font-medium text-white">
                Submitting...
              </Text>
            </View>
          ) : (
            <PrimaryButton
              title="Submit Report"
              onPress={
                handleSubmit
              }
            />
          )}
        </View>

        <Pressable
          disabled={submitting}
          onPress={() =>
            router.back()
          }
          className="mt-4 items-center py-3"
        >
          <Text className="font-semibold text-primary">
            Edit Report
          </Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}